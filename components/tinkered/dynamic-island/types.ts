import type { RefObject } from "react"
import type { MotionValue } from "motion/react"

export type IslandView = "idle" | "ring" | "music"

export type Playback = {
  audioRef: RefObject<HTMLAudioElement | null>
  progress: MotionValue<number>
  seconds: number
  duration: number
  playing: boolean
  toggle: () => void
  seek: (seconds: number) => void
  scrub: (active: boolean) => void
  setDuration: (seconds: number) => void
  stop: () => void
}
