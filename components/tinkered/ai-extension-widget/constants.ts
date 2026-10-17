/** How long the AI works on an accepted recommendation. */
export const WORK_MS = 2000
/** How long the resolved card stays before the next one slides in. */
export const SETTLE_MS = 1000

export const BASE_SCORE = 46
export const SCORE_PER_FIX = 18

export const slide = {
  enter: (direction: number) => ({ x: `${110 * direction}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: `${-110 * direction}%`, opacity: 0 }),
}

export const blurOut = { opacity: 0, filter: "blur(4px)" }

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#010101] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
export const pressable =
  "transition-[scale,opacity] duration-150 ease-out active:scale-[0.96] aria-disabled:active:scale-100"
export const label = "text-[0.8125rem]/5 font-medium"
