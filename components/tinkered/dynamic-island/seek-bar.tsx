"use client"

import { useState } from "react"
import { motion, useTransform } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { formatTime } from "./hooks/use-playback"
import type { Playback } from "./types"

export function SeekBar({ playback }: Readonly<{ playback: Playback }>) {
  const time = useTimeScale()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const fill = useTransform(playback.progress, (value) => value / playback.duration)
  const active = hovered || focused || scrubbing

  const scrub = (next: boolean) => {
    playback.scrub(next)
    setScrubbing(next)
  }

  return (
    <div
      className={`relative h-[9px] flex-1 rounded-full ${focused ? "ring-2 ring-white/70 ring-offset-2 ring-offset-black" : ""}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        initial={false}
        animate={{ clipPath: active ? "inset(0px 0% round 999px)" : "inset(1.5px 2% round 999px)" }}
        transition={time.transition({ type: "spring", duration: 0.3, bounce: 0 })}
        className="relative size-full bg-[#3F3F3F]/70"
      >
        <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-white" />
      </motion.div>
      <input
        type="range"
        min={0}
        max={Math.floor(playback.duration)}
        step={1}
        value={playback.seconds}
        aria-label="Seek"
        aria-valuetext={`${formatTime(playback.seconds)} of ${formatTime(playback.duration)}`}
        onChange={(event) => playback.seek(Number(event.target.value))}
        onPointerDown={() => scrub(true)}
        onPointerUp={() => scrub(false)}
        onPointerCancel={() => scrub(false)}
        onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        className="absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 cursor-pointer opacity-0"
      />
    </div>
  )
}
