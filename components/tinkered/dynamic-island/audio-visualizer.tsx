"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"

const MAX_HEIGHT = 24
const RESTING = [1, 1, 1, 1, 1, 1]
const STILL = [6, 16, 24, 12, 20, 8]

function randomBars() {
  return RESTING.map(() => Math.floor(Math.random() * (MAX_HEIGHT - 1)) + 2)
}

export function AudioVisualizer({ playing }: Readonly<{ playing: boolean }>) {
  const time = useTimeScale()
  const reduceMotion = useReducedMotion()
  const [bars, setBars] = useState(STILL)

  useEffect(() => {
    if (!playing || reduceMotion) return
    const id = setInterval(() => setBars(randomBars()), time.ms(100))
    return () => clearInterval(id)
  }, [playing, reduceMotion, time])

  let heights = RESTING
  if (playing) heights = reduceMotion ? STILL : bars

  return (
    <div aria-hidden="true" className="flex h-6 items-center gap-0.5">
      {heights.map((height, index) => (
        <motion.span
          key={index}
          initial={false}
          animate={{ scaleY: height / MAX_HEIGHT }}
          transition={time.transition({ type: "spring", duration: 0.5, bounce: 0 })}
          className="h-6 w-0.5 rounded-[2px] bg-[#E78584]"
        />
      ))}
    </div>
  )
}
