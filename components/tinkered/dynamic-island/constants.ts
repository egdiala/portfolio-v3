import { media } from "@/lib/media"

export const TRACK = {
  title: "Death Note (feat. Ichika)",
  artist: "Polyphia",
  src: media("tinkered/dynamic-island/death-note.m4a"),
  cover: media("tinkered/dynamic-island/cover.jpg"),
  duration: 220,
}

export const SKIP_SECONDS = 15
export const COMPACT = { width: 173, height: 38 }
export const EXPANDED = { width: 367, height: 165 }
/** The island resizes on this spring when the player opens or closes. */
export const PLAYER_SPRING = { type: "spring", duration: 0.3, bounce: 0 } as const
// Below this width the decorative lyrics and AirPlay glyphs crowd the transport.
export const GLYPHS_MIN_WIDTH = 320

export const fade = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
}

export const iconSwap = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
}

// Keyed by "from-to". The bigger the change in size, the less it bounces.
export const TUNED_BOUNCE: Record<string, number> = {
  idle: 0.5,
  "idle-ring": 0.5,
  "ring-idle": 0.5,
  "ring-music": 0.35,
  "music-ring": 0.35,
  "idle-music": 0.3,
  "music-idle": 0.3,
}
