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

export type Point = [number, number]
