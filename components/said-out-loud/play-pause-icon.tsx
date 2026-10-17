"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { PauseIcon } from "@/components/icons/pause"
import { PlayIcon } from "@/components/icons/play"
import { cn } from "@/lib/utils"

const swap = { type: "spring", duration: 0.3, bounce: 0 } as const

/** Play, pause or a spinner, crossfading in place so the button never changes size. */
export function PlayPauseIcon({
  playing,
  loading = false,
  className,
}: Readonly<{ playing: boolean; loading?: boolean; className?: string }>) {
  const reduceMotion = useReducedMotion()
  let state: "play" | "pause" | "loading" = playing ? "pause" : "play"
  if (loading) state = "loading"
  // `shown` is the same either way: it's what renders on the server, which can't know the preference.
  const hidden = reduceMotion ? { opacity: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
  const shown = { opacity: 1, scale: 1, filter: "blur(0px)" }

  return (
    <span aria-hidden="true" className={cn("grid size-4 shrink-0 place-items-center", className)}>
      <AnimatePresence initial={false}>
        <motion.span
          key={state}
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={swap}
          className="col-start-1 row-start-1 grid size-full place-items-center"
        >
          {icons[state]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const icons = {
  play: <PlayIcon className="size-full" />,
  pause: <PauseIcon className="size-full" />,
  loading: <Spinner />,
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="size-full animate-[spin_600ms_linear_infinite] motion-reduce:animate-[spin_1.6s_linear_infinite]"
    >
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M8 2.25A5.75 5.75 0 0 1 13.75 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
