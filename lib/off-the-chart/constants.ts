import type { ChartConfig } from "./types"

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

export const WIDTH = 720
export const HEIGHT = 440
export const STEP = 2
export const TAU = Math.PI * 2
/** Soundings were only taken near the shore, so no waterline lies farther out than this. */
export const SOUNDINGS = 72
