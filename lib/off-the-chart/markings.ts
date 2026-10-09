import { HEIGHT, TAU, WIDTH } from "./constants"
import { toPath } from "./geometry"
import type { ChartConfig, Point } from "./types"

export function rhumbLines(config: ChartConfig, center: Point) {
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

export function roseGlyph([x, y]: Point) {
  const points: Point[] = []
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * TAU - Math.PI / 2
    const r = i % 4 === 0 ? 18 : i % 2 === 0 ? 10 : 3.5
    points.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r])
  }
  return `${toPath([...points, points[0]])}Z`
}
