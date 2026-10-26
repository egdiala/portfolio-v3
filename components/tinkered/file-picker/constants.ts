export const SAMPLE_FILE_NAME = "account_statement.pdf"

export const ACCEPT = ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"

export const MAX_SIZE = 1024 * 1024 * 10

/** The whole upload, from 0 to 100, lands somewhere in this range. */
export const UPLOAD_MIN_MS = 3000
export const UPLOAD_MAX_MS = 5000

/** How many progress events a run reports. */
export const MIN_STEPS = 7
export const MAX_STEPS = 11

/** A failing run gives up somewhere in this band of progress. */
export const FAIL_FROM = 40
export const FAIL_TO = 80

/** How long a failing run hangs before it gives up. */
export const STALL_MS = 800

/** The bar's linear slide between two values, from Melun's Progress. */
export const BAR_MS = 500

/** Lucide's loader runs one lap of its spokes in this long. */
export const LOADER_MS = 500

/** A press shorter than this counts as a tap, and earns the "Hold to remove" hint. */
export const TAP_MS = 300

/** How long the hint stays before the status comes back. */
export const HINT_MS = 1500

/** Held: the sweep crosses at a steady pace, so how far it's got is how much longer to hold. */
export const sweepPress = { type: "tween", duration: 2, ease: "linear" } as const

/** Let go: the sweep snaps back. */
export const sweepRelease = { type: "tween", duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const

export const statusSwap = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(2px)" },
}

export const iconSwap = {
  initial: { opacity: 0, filter: "blur(2px)", scale: 0.8 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(2px)", scale: 0.8 },
}

export const swapTransition = { type: "keyframes", ease: [0.23, 1, 0.32, 1], duration: 0.15 } as const

export const progressSpring = { type: "spring", bounce: 0.1, duration: 0.4 } as const

/** The bar leaves quicker than it arrives. */
export const progressExit = { type: "spring", bounce: 0, duration: 0.25 } as const

/** The name's nudge to the middle of the row when the bar leaves. */
export const nameLayout = { type: "tween", duration: 0.25, ease: [0.77, 0, 0.175, 1] } as const
