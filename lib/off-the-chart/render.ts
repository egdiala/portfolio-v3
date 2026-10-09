import { coastline, waterline } from "./coast"
import { HEIGHT, SOUNDINGS, STEP, WIDTH } from "./constants"
import { clamp, mulberry32, offset, resample, smooth, toPath, unloop } from "./geometry"
import { rhumbLines, roseGlyph } from "./markings"
import type { ChartConfig, ChartModel, Point } from "./types"

export type { ChartConfig, ChartMode, ChartModel } from "./types"
export { CHART_DEFAULTS } from "./constants"

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
