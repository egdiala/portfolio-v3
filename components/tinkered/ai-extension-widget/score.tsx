"use client"

import { AnimatePresence, motion, type Transition } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import type { Tone } from "./types"

export type { Tone } from "./types"

const TONES = {
  poor: { solid: "#DC2828", track: "#FFC9C9", wash: "#FEF1F1" },
  fair: { solid: "#E9590C", track: "#FED6A9", wash: "#FFF6EB" },
  good: { solid: "#047656", track: "#ADFCD7", wash: "#EDFDF5" },
} satisfies Record<string, Tone>

export function toneFor(score: number): Tone {
  if (score >= 80) return TONES.good
  if (score >= 60) return TONES.fair
  return TONES.poor
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function Digit({ digit }: Readonly<{ digit: number }>) {
  const time = useTimeScale()

  return (
    <motion.span
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={time.transition({ type: "spring", duration: 0.4, bounce: 0 })}
      className="block h-[1em] overflow-hidden"
    >
      <motion.span
        initial={false}
        animate={{ y: `${-digit}em` }}
        transition={time.transition({ type: "spring", duration: 0.6, bounce: 0.15 })}
        className="flex flex-col"
      >
        {DIGITS.map((value) => (
          <span key={value} className="h-[1em]">
            {value}
          </span>
        ))}
      </motion.span>
    </motion.span>
  )
}

/** Each digit is a column of 0–9 that slides to its value. Keyed by place, so 82 → 100 adds a hundreds column. */
function Ticker({ value }: Readonly<{ value: number }>) {
  const digits = String(value).split("").map(Number)

  return (
    <span aria-hidden="true" className="flex leading-none">
      <AnimatePresence initial={false} mode="popLayout">
        {digits.map((digit, index) => (
          <Digit key={digits.length - index} digit={digit} />
        ))}
      </AnimatePresence>
    </span>
  )
}

/**
 * The score badge. The pill and the panel each render one with the same
 * layoutId, so opening the widget carries it from one place to the other.
 */
export function Score({
  score,
  layoutId,
  transition,
  size,
  rolling = false,
}: Readonly<{
  score: number
  layoutId?: string
  transition: Transition
  size: "sm" | "lg"
  /** Roll digits on change instead of swapping them. */
  rolling?: boolean
}>) {
  const time = useTimeScale()
  const tone = toneFor(score)
  const colors = time.transition({ type: "tween", ease: "easeOut", duration: 0.3 })

  return (
    <motion.span
      layoutId={layoutId}
      initial={false}
      animate={{ backgroundColor: tone.wash, color: tone.solid }}
      transition={{ ...transition, backgroundColor: colors, color: colors }}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full font-medium tabular-nums",
        size === "sm" ? "size-12 text-lg" : "size-[3.875rem] text-xl",
      )}
    >
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
        <motion.circle
          cx="32"
          cy="32"
          r="30.5"
          strokeWidth="2"
          initial={false}
          animate={{ stroke: tone.track }}
          transition={colors}
        />
        <motion.circle
          cx="32"
          cy="32"
          r="30.5"
          strokeWidth="3"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: score / 100, stroke: tone.solid }}
          transition={{ pathLength: time.transition({ type: "spring", duration: 0.8, bounce: 0 }), stroke: colors }}
        />
      </svg>
      {rolling ? <Ticker value={score} /> : <span aria-hidden="true">{score}</span>}
      <span className="sr-only">{score} out of 100</span>
    </motion.span>
  )
}
