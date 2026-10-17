"use client"

import { useState } from "react"
import { motion, useReducedMotion, useTransform } from "motion/react"
import { EPISODE } from "@/lib/said-out-loud"
import { formatTime } from "@/lib/time"
import { cn } from "@/lib/utils"
import { useElapsed, useEpisode } from "./episode-provider"

/** The track thickens under the pointer or keyboard focus, like the Dynamic Island seek bar. */
export function SeekBar({ className }: Readonly<{ className?: string }>) {
  const { time, seek, scrub } = useEpisode()
  const seconds = useElapsed()
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const fill = useTransform(time, (value) => value / EPISODE.duration)
  const active = hovered || focused || scrubbing

  const setScrub = (next: boolean) => {
    scrub(next)
    setScrubbing(next)
  }

  return (
    <div
      className={cn(
        "relative h-1.5 flex-1 rounded-full",
        focused && "ring-[3px] ring-foreground ring-offset-2 ring-offset-background",
        className,
      )}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        initial={false}
        animate={{ clipPath: active ? "inset(0px 0px round 999px)" : "inset(1px 0px round 999px)" }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 }}
        className="relative size-full bg-neutral-300"
      >
        <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-foreground" />
      </motion.div>
      <input
        type="range"
        min={0}
        max={EPISODE.duration}
        step={5}
        value={seconds}
        aria-label="Seek"
        aria-valuetext={`${formatTime(seconds)} of ${formatTime(EPISODE.duration)}`}
        onChange={(event) => seek(Number(event.target.value))}
        onPointerDown={() => setScrub(true)}
        onPointerUp={() => setScrub(false)}
        onPointerCancel={() => setScrub(false)}
        onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        className="absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 cursor-pointer opacity-0"
      />
    </div>
  )
}
