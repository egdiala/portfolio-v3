import type { Point } from "./types"

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function roughen(points: Point[], roughness: number, depth: number, random: () => number) {
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

export function resample(points: Point[], step: number) {
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
export function average(values: number[], radius: number, closed = false) {
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

export function smooth(points: Point[], radius: number, closed = false) {
  const xs = average(points.map(([x]) => x), radius, closed)
  const ys = average(points.map(([, y]) => y), radius, closed)
  return xs.map((x, i): Point => [x, ys[i]])
}

/** Unit normal towards the sea, which is on the left of the direction of travel. */
export function seaward(points: Point[], i: number): Point {
  const [ax, ay] = points[Math.max(0, i - 1)]
  const [bx, by] = points[Math.min(points.length - 1, i + 1)]
  const length = Math.hypot(bx - ax, by - ay) || 1
  return [(by - ay) / length, -(bx - ax) / length]
}

export function offset(points: Point[], distance: number | number[]) {
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
export function unloop(points: Point[], window: number) {
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

export function toPath(points: Point[]) {
  if (points.length < 2) return ""
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join("")
}
