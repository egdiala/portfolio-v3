export type ChartMode = "coast" | "island"

export type ChartConfig = {
  seed: number
  mode: ChartMode
  /** Midpoint displacement per subdivision, as a share of the segment length. Above 0.45 the coast folds over itself. */
  roughness: number
  /** Share of the coast that was surveyed and drawn solid. */
  surveyed: number
  /** Share of the coast drawn dashed after the survey runs out. */
  unsurveyed: number
  waterlines: number
  /** Distance from the shore to the first waterline. */
  firstOffset: number
  /** Each waterline gap is this many times the previous one. */
  spacing: number
  winds: 16 | 32
  roses: 0 | 8 | 16
  rhumbStrength: number
  /** How much the ship's track drifts once it leaves the coast. */
  wander: number
  ink: number
}

export type ChartModel = {
  width: number
  height: number
  rhumbs: { d: string; opacity: number }[]
  rose: { x: number; y: number; d: string }
  surveyed: string[]
  unsurveyed: string[]
  waterlines: { d: string; opacity: number; width: number }[]
  track: { x: number; y: number; opacity: number }[]
  anchorage: { x: number; y: number }
  /** Centred on x. */
  labels: { x: number; y: number; text: string; size: number; opacity: number }[]
  ink: number
}

export const CHART_DEFAULTS: ChartConfig = {
  seed: 1,
  mode: "coast",
  roughness: 0.35,
  surveyed: 0.58,
  unsurveyed: 0.16,
  waterlines: 5,
  firstOffset: 4,
  spacing: 1.3,
  winds: 32,
  roses: 16,
  rhumbStrength: 0.1,
  wander: 0.5,
  ink: 1,
}

type Point = [number, number]

const WIDTH = 720
const HEIGHT = 440
const STEP = 2
const TAU = Math.PI * 2
/** Soundings were only taken near the shore, so no waterline lies farther out than this. */
const SOUNDINGS = 72

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function roughen(points: Point[], roughness: number, depth: number, random: () => number) {
  let current = points
  for (let level = 0; level < depth; level++) {
    const next: Point[] = [current[0]]
    for (let i = 1; i < current.length; i++) {
      const [ax, ay] = current[i - 1]
      const [bx, by] = current[i]
      const offset = (random() - 0.5) * roughness
      next.push([(ax + bx) / 2 - (by - ay) * offset, (ay + by) / 2 + (bx - ax) * offset], current[i])
    }
    current = next
  }
  return current
}

function resample(points: Point[], step: number) {
  const out: Point[] = [points[0]]
  let carry = 0
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1]
    const [bx, by] = points[i]
    const length = Math.hypot(bx - ax, by - ay)
    let t = step - carry
    while (t <= length) {
      out.push([ax + ((bx - ax) * t) / length, ay + ((by - ay) * t) / length])
      t += step
    }
    carry = length - (t - step)
  }
  return out
}

/**
 * Moving average. Closed lines wrap around; open lines shrink the window
 * evenly near their ends so the ends stay put instead of being pulled inward.
 */
function average(values: number[], radius: number, closed = false) {
  const n = values.length
  const r = Math.min(Math.round(radius), Math.floor((n - 1) / 2))
  if (r < 1) return values
  const source = closed ? [...values.slice(n - r), ...values, ...values.slice(0, r)] : values
  const sums = [0]
  for (const value of source) sums.push(sums[sums.length - 1] + value)
  return values.map((_, i) => {
    const j = closed ? i + r : i
    const k = closed ? r : Math.min(r, i, n - 1 - i)
    return (sums[j + k + 1] - sums[j - k]) / (2 * k + 1)
  })
}

function smooth(points: Point[], radius: number, closed = false) {
  const xs = average(points.map(([x]) => x), radius, closed)
  const ys = average(points.map(([, y]) => y), radius, closed)
  return xs.map((x, i): Point => [x, ys[i]])
}

/** Unit normal towards the sea, which is on the left of the direction of travel. */
function seaward(points: Point[], i: number): Point {
  const [ax, ay] = points[Math.max(0, i - 1)]
  const [bx, by] = points[Math.min(points.length - 1, i + 1)]
  const length = Math.hypot(bx - ax, by - ay) || 1
  return [(by - ay) / length, -(bx - ax) / length]
}

function offset(points: Point[], distance: number | number[]) {
  return points.map(([x, y], i): Point => {
    const [nx, ny] = seaward(points, i)
    const d = typeof distance === "number" ? distance : distance[i]
    return [x + nx * d, y + ny * d]
  })
}

function intersect([ax, ay]: Point, [bx, by]: Point, [cx, cy]: Point, [dx, dy]: Point): Point | null {
  const denominator = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx)
  if (denominator === 0) return null
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / denominator
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / denominator
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [ax + t * (bx - ax), ay + t * (by - ay)] : null
}

/** Cuts out the loops an offset line makes wherever it turns tighter than its distance. */
function unloop(points: Point[], window: number) {
  const out: Point[] = []
  let i = 0
  while (i < points.length - 1) {
    out.push(points[i])
    let next = i + 1
    for (let j = Math.min(points.length - 2, i + window); j > i + 1; j--) {
      const hit = intersect(points[i], points[i + 1], points[j], points[j + 1])
      if (hit) {
        out.push(hit)
        next = j + 1
        break
      }
    }
    i = next
  }
  out.push(points[points.length - 1])
  return out
}

/**
 * A smoothed copy of the coast, pushed out wherever a cape pokes past it, so
 * a waterline never touches the shore it follows.
 */
function waterline(coast: Point[], radius: number, distance: number, closed: boolean) {
  const n = coast.length
  const r = Math.round(radius)
  const reach = r + Math.ceil((3 * distance) / STEP) + 16
  const base = smooth(coast, r, closed)
  const clearance = base.map(([bx, by], i) => {
    const [nx, ny] = seaward(base, i)
    let need = distance
    for (let j = i - reach; j <= i + reach; j++) {
      const k = closed ? (j + n) % n : j
      if (k < 0 || k >= n) continue
      const dx = coast[k][0] - bx
      const dy = coast[k][1] - by
      const across = Math.abs(dx * ny - dy * nx)
      if (across < distance) need = Math.max(need, dx * nx + dy * ny + Math.sqrt(distance ** 2 - across ** 2))
    }
    return need
  })
  const eased = average(clearance, r / 2, closed).map((value, i) => Math.max(value, clearance[i]))
  return { line: offset(base, eased), reach }
}

function toPath(points: Point[]) {
  if (points.length < 2) return ""
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")
}

function coastline(config: ChartConfig, random: () => number) {
  if (config.mode === "island") {
    const cx = WIDTH * (0.4 + random() * 0.05)
    const cy = HEIGHT * (0.53 + (random() - 0.5) * 0.06)
    const radius = HEIGHT * 0.24
    const harmonics = [2, 3, 4, 5].map((k) => ({ k, amount: (random() * 0.12) / k, phase: random() * TAU }))
    const base: Point[] = []
    for (let i = 0; i <= 12; i++) {
      const angle = (i / 12) * TAU
      const r = radius * (1 + harmonics.reduce((sum, h) => sum + h.amount * Math.sin(h.k * angle + h.phase), 0))
      base.push([cx + Math.cos(angle) * r * 1.25, cy + Math.sin(angle) * r])
    }
    base[12] = base[0]
    return { points: resample(roughen(base, config.roughness, 6, random), STEP), center: [cx, cy] as Point }
  }

  // Starts well off the sheet, where the smoothing settles in unseen.
  const base: Point[] = [[-120, HEIGHT * (0.6 + random() * 0.14)]]
  let heading = -0.25 + random() * 0.2
  const stepLength = (WIDTH + 140) / 7
  for (let i = 0; i < 7; i++) {
    heading = clamp(heading + (random() - 0.5) * 0.9, -0.85, 0.6)
    const [x, y] = base[base.length - 1]
    base.push([x + Math.cos(heading) * stepLength, clamp(y + Math.sin(heading) * stepLength, HEIGHT * 0.38, HEIGHT * 0.84)])
  }
  return { points: resample(roughen(base, config.roughness, 6, random), STEP), center: null }
}

function rhumbLines(config: ChartConfig, center: Point) {
  const hidden = Math.min(WIDTH, HEIGHT) * 0.46
  const origins: Point[] = [center]
  for (let i = 0; i < config.roses; i++) {
    const angle = (i / config.roses) * TAU
    origins.push([center[0] + Math.cos(angle) * hidden, center[1] + Math.sin(angle) * hidden])
  }

  const tiers = [[], [], []] as string[][]
  const reach = WIDTH * 2
  for (const [x, y] of origins) {
    for (let k = 0; k < config.winds / 2; k++) {
      const angle = (k / config.winds) * TAU
      const dx = Math.cos(angle) * reach
      const dy = Math.sin(angle) * reach
      const tier = config.winds === 32 ? (k % 4 === 0 ? 0 : k % 2 === 0 ? 1 : 2) : k % 2 === 0 ? 0 : 1
      tiers[tier].push(`M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)}L${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`)
    }
  }

  const weights = [1, 0.7, 0.45]
  return tiers
    .map((paths, i) => ({ d: paths.join(""), opacity: config.rhumbStrength * weights[i] }))
    .filter((tier) => tier.d)
}

function roseGlyph([x, y]: Point) {
  const points: Point[] = []
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * TAU - Math.PI / 2
    const r = i % 4 === 0 ? 18 : i % 2 === 0 ? 10 : 3.5
    points.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r])
  }
  return `${toPath([...points, points[0]])}Z`
}

/**
 * A sea chart whose survey runs out. Every random choice comes from the seed,
 * so the same config always draws the same chart.
 */
export function renderChart(config: ChartConfig): ChartModel {
  const random = mulberry32(config.seed)
  const { points: coast, center } = coastline(config, random)
  const n = coast.length
  const island = config.mode === "island"

  // Index ranges along the coast, in drawing order. An island loops
  // [gap][dash][surveyed][dash][gap] from the east. An open coast measures its
  // shares along the part on the sheet, and keeps its last dash clear of the
  // right edge so the track has room to leave it.
  let surveyStart: number
  let surveyEnd: number
  let dashStart: number
  let dashEnd: number
  if (island) {
    const gap = Math.max(0, 1 - config.surveyed - config.unsurveyed) / 2
    const dashHalf = config.unsurveyed / 2
    dashStart = Math.round(n * gap)
    surveyStart = Math.round(n * (gap + dashHalf))
    surveyEnd = Math.round(n * (gap + dashHalf + config.surveyed))
    dashEnd = Math.min(n - 1, Math.round(n * (gap + 2 * dashHalf + config.surveyed)))
  } else {
    const first = Math.max(0, coast.findIndex(([x]) => x >= 0))
    const edge = coast.findIndex(([x]) => x > WIDTH * 0.86)
    const last = edge < 0 ? n - 1 : edge
    const span = last - first
    surveyStart = 0
    surveyEnd = Math.min(last - 2, first + Math.round(span * config.surveyed))
    dashStart = surveyEnd
    dashEnd = Math.min(last, surveyEnd + Math.round(span * config.unsurveyed))
  }

  const smoothed = (radius: number) => smooth(coast, radius / STEP, island)
  const surveyedCoast = coast.slice(surveyStart, surveyEnd + 1)
  const unsurveyed = [toPath(coast.slice(surveyEnd, dashEnd + 1))]
  if (island) unsurveyed.push(toPath(coast.slice(dashStart, surveyStart + 1)))

  const waterlines: ChartModel["waterlines"] = []
  let distance = 0
  let gapSize = config.firstOffset
  for (let i = 0; i < config.waterlines; i++) {
    if (distance + gapSize > SOUNDINGS) break
    distance += gapSize
    gapSize *= config.spacing
    const trim = Math.round((distance * 1.4) / STEP)
    const { line, reach } = waterline(coast, (distance * 1.5 + 4) / STEP, distance, island)
    const surveyedLine = line.slice(surveyStart, surveyEnd + 1)
    const trimmed = surveyedLine.slice(island ? trim : 0, Math.max(island ? trim + 2 : 2, surveyedLine.length - trim))
    waterlines.push({
      d: toPath(smooth(resample(unloop(trimmed, reach), STEP), Math.min(2, distance / 4))),
      opacity: 0.6 * (1 - i / (config.waterlines + 1)),
      width: Math.max(0.4, (0.9 - i * 0.08) * config.ink),
    })
  }

  // The ship's track keeps its distance from the coast, then leaves it.
  const trackDistance = distance + 16
  let route: Point[]
  let anchorage: Point
  if (island) {
    const west = surveyedCoast.reduce((best, point, i) => (point[0] < surveyedCoast[best][0] ? i : best), 0)
    const north = unloop(offset(smoothed(60).slice(surveyStart + west, dashEnd + 1), trackDistance), 200)
    anchorage = [clamp(north[0][0] - 24, 32, 56), north[0][1] + 18]
    route = [...resample([anchorage, north[0]], STEP), ...north]
  } else {
    const along = unloop(offset(smoothed(60).slice(0, dashEnd + 1), trackDistance), 200)
    const start = Math.max(0, along.findIndex(([px]) => px >= 56))
    anchorage = along[start]
    route = along.slice(start)
  }

  const fadeFrom = route.length
  let [x, y] = route[route.length - 1]
  const [px, py] = route[Math.max(0, route.length - 12)]
  let heading = Math.atan2(y - py, x - px)
  for (let i = 0; i < 70; i++) {
    heading += (random() - 0.5) * 0.3 * config.wander
    x += Math.cos(heading) * STEP
    y += Math.sin(heading) * STEP
    route.push([clamp(x, 10, WIDTH - 10), clamp(y, 10, HEIGHT - 10)])
  }
  const flowing = smooth(route, 6)
  const dots = resample(flowing, 7)
  let sailed = 0
  for (let i = 1; i < fadeFrom; i++) sailed += Math.hypot(flowing[i][0] - flowing[i - 1][0], flowing[i][1] - flowing[i - 1][1])
  const fadeDot = Math.round(sailed / 7)
  const track = dots.map(([dx, dy], i) => ({
    x: dx,
    y: dy,
    opacity: i < fadeDot ? 1 : Math.max(0, 1 - (i - fadeDot) / Math.max(1, dots.length - fadeDot)),
  }))

  const highest = Math.min(...dots.map(([, dy]) => dy))
  const roseAt: Point = island
    ? [WIDTH * (0.72 + random() * 0.12), HEIGHT * (0.18 + random() * 0.12)]
    : [WIDTH * (0.5 + random() * 0.14), clamp(highest - 64, 44, HEIGHT * 0.3)]

  // Terra incognita sits in the blank past the last dash.
  let unknown: Point
  if (island && center) {
    const east = Math.max(...coast.map(([cx]) => cx))
    unknown = [clamp(east + 84, 90, WIDTH - 90), center[1] + 4]
  } else {
    const [ux, uy] = offset(smoothed(40), -44)[dashEnd]
    unknown = [clamp(ux + 56, 90, WIDTH - 90), clamp(uy + 3, 36, HEIGHT - 16)]
  }

  const [, homeY] = offset(route.slice(0, 3), 14)[0]
  const labels: ChartModel["labels"] = [
    { x: anchorage[0], y: homeY - 2, text: "HOME", size: 9, opacity: 0.8 },
    { x: unknown[0], y: unknown[1], text: "TERRA INCOGNITA", size: 11, opacity: 0.55 },
  ]
  if (island && center) {
    labels.push({ x: center[0], y: center[1] + 4, text: "TINKERED ISLE", size: 9, opacity: 0.7 })
  } else {
    for (const [share, text] of [
      [0.36, "SHIPPED POINT"],
      [0.76, "TINKERED HEAD"],
    ] as const) {
      const index = surveyStart + Math.round(surveyedCoast.length * share)
      const [lx, ly] = offset(smoothed(40), -26)[index]
      labels.push({ x: lx, y: ly + 3, text, size: 9, opacity: 0.7 })
    }
  }
  for (const label of labels) {
    const half = label.text.length * label.size * 0.42
    label.x = clamp(label.x, half + 6, WIDTH - half - 6)
    label.y = clamp(label.y, label.size + 6, HEIGHT - 8)
  }

  return {
    width: WIDTH,
    height: HEIGHT,
    rhumbs: rhumbLines(config, roseAt),
    rose: { x: roseAt[0], y: roseAt[1], d: roseGlyph(roseAt) },
    surveyed: [toPath(surveyedCoast)],
    unsurveyed: unsurveyed.filter(Boolean),
    waterlines,
    track,
    anchorage: { x: anchorage[0], y: anchorage[1] },
    labels,
    ink: config.ink,
  }
}
