import { HEIGHT, STEP, TAU, WIDTH } from "./constants"
import { average, clamp, offset, resample, roughen, seaward, smooth } from "./geometry"
import type { ChartConfig, Point } from "./types"

/**
 * A smoothed copy of the coast, pushed out wherever a cape pokes past it, so
 * a waterline never touches the shore it follows.
 */
export function waterline(coast: Point[], radius: number, distance: number, closed: boolean) {
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

export function coastline(config: ChartConfig, random: () => number) {
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
