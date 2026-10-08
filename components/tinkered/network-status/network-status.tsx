"use client"

import { AnimatePresence, motion } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"

export type NetworkState = "off" | "searching" | "connected"

// Heights in px at the 12px base size. Every bar is 12px tall and scaled
// down from its bottom edge, so the animation stays on the compositor.
// The bars have no text, so their baseline is their bottom edge; aligning
// the row on baselines puts the bars on the label's baseline.
const BAR_HEIGHTS = [4.6, 7, 9.6, 12]
const BAR_MAX = 12
const BAR_REST = 1 / BAR_MAX
const SEARCH_PEAK = 4.2 / BAR_MAX
const SEARCH_DURATION = 0.6

const barClassName = "block h-[1em] w-[0.1667em] origin-bottom rounded-[0.0625em] bg-current"

// 1.333em tall, the same as the airplane, so swapping states never changes
// the indicator's height. The line height lives here rather than on the root
// because cn() drops it there whenever className sets a font size.
const rowClassName = "flex items-baseline gap-[0.1667em] leading-[1.333]"

function describe(state: NetworkState, strength: number, carrier: string) {
  if (state === "off") return "Airplane mode"
  if (state === "searching") return "Searching for a network"
  return `${carrier}, ${strength} of ${BAR_HEIGHTS.length} bars`
}

export function NetworkStatus({
  state,
  strength = BAR_HEIGHTS.length,
  carrier = "MTN Nigeria",
  className,
}: Readonly<{
  state: NetworkState
  strength?: number
  carrier?: string
  className?: string
}>) {
  const time = useTimeScale()
  const swap = time.transition({ type: "tween", ease: "easeInOut", duration: 0.4 })
  const grow = time.transition({ type: "spring", duration: 0.4, bounce: 0 })

  return (
    <div
      role="img"
      aria-label={describe(state, strength, carrier)}
      className={cn("relative flex w-[7em] items-end text-xs text-neutral-900", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "off" ? (
          <motion.span
            key="off"
            initial={{ x: "-2em", opacity: 0, filter: "blur(0.5px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: "6.25em", opacity: 0, filter: "blur(0.5px)" }}
            transition={swap}
            className="block py-[0.0833em]"
          >
            <svg viewBox="0 0 16 14" fill="currentColor" aria-hidden="true" className="h-[1.1667em] w-[1.3333em]">
              <path d="M15.6366 7.00341C15.6366 6.19873 14.5387 5.57136 13.1953 5.57136H10.3926C10.0107 5.57136 9.87433 5.49635 9.64247 5.25085L5.019 0.245494C4.86897 0.0886508 4.69167 0 4.49391 0H3.62104C3.44374 0 3.34145 0.163663 3.4301 0.347784L5.81685 5.56454L2.32538 5.95324L1.07745 3.72333C0.981978 3.55285 0.831953 3.47784 0.613736 3.47784H0.306868C0.122747 3.47784 0 3.60058 0 3.78471V10.2221C0 10.4062 0.122747 10.529 0.306868 10.529H0.613736C0.831953 10.529 0.981978 10.454 1.07745 10.2835L2.32538 8.04676L5.81685 8.44228L3.4301 13.6522C3.34145 13.8432 3.44374 14 3.62104 14H4.49391C4.69167 14 4.86897 13.9182 5.019 13.7613L9.64247 8.75597C9.87433 8.50365 10.0107 8.43546 10.3926 8.43546H13.1953C14.5387 8.43546 15.6366 7.80127 15.6366 7.00341Z" />
            </svg>
          </motion.span>
        ) : null}

        {state === "searching" ? (
          <motion.div
            key="searching"
            initial={{ opacity: 0, filter: "blur(0.5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(0.5px)" }}
            transition={swap}
            aria-hidden="true"
            className={rowClassName}
          >
            <span className="flex items-end gap-[0.0833em]">
              {BAR_HEIGHTS.map((_, index) => (
                <motion.span
                  key={index}
                  initial={{ scaleY: BAR_REST }}
                  animate={{ scaleY: [BAR_REST, SEARCH_PEAK, BAR_REST] }}
                  transition={time.transition({
                    type: "keyframes",
                    duration: SEARCH_DURATION,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    delay: (index * SEARCH_DURATION) / BAR_HEIGHTS.length,
                  })}
                  className={barClassName}
                />
              ))}
            </span>
            <motion.span layoutId="network-label" layout="position" transition={swap}>
              Searching
            </motion.span>
          </motion.div>
        ) : null}

        {state === "connected" ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={swap}
            aria-hidden="true"
            className={rowClassName}
          >
            <span className="flex items-end gap-[0.0833em]">
              {BAR_HEIGHTS.map((height, index) => (
                <motion.span
                  key={index}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: height / BAR_MAX }}
                  exit={{ scaleY: 0 }}
                  transition={grow}
                  className={cn(
                    barClassName,
                    "transition-opacity duration-200 ease-out",
                    index < strength ? "opacity-100" : "opacity-25",
                  )}
                />
              ))}
            </span>
            <motion.span layoutId="network-label" layout="position" transition={swap} className="whitespace-nowrap">
              {carrier}
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
