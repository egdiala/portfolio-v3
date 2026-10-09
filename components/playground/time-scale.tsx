"use client"

import { createContext, useContext, useMemo } from "react"
import type { Transition } from "motion/react"

export const TimeScaleContext = createContext(1)

const TIME_KEYS = new Set(["duration", "delay", "visualDuration", "repeatDelay"])

// Motion resolves a spring that only sets `bounce` against an 800ms duration.
const SPRING_DEFAULT_DURATION = 0.8
const SPRING_DEFAULT_STIFFNESS = 100
const SPRING_DEFAULT_DAMPING = 10

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function scaleTransition(transition: Transition, rate: number): Transition {
  if (rate === 1) return transition

  const source = transition as Record<string, unknown>
  const next: Record<string, unknown> = { ...source }

  for (const [key, value] of Object.entries(source)) {
    if (TIME_KEYS.has(key) && typeof value === "number") {
      next[key] = value / rate
    } else if (isPlainObject(value)) {
      next[key] = scaleTransition(value as Transition, rate)
    }
  }

  if (source.type === "spring") {
    const physics = "stiffness" in source || "damping" in source || "mass" in source
    if (physics) {
      // Stretching time by 1/rate keeps the damping ratio when stiffness
      // scales by rate² and damping by rate.
      next.stiffness = ((source.stiffness as number) ?? SPRING_DEFAULT_STIFFNESS) * rate * rate
      next.damping = ((source.damping as number) ?? SPRING_DEFAULT_DAMPING) * rate
      if (typeof source.restSpeed === "number") next.restSpeed = source.restSpeed * rate
    } else if (source.duration === undefined && source.visualDuration === undefined) {
      next.duration = SPRING_DEFAULT_DURATION / rate
    }
  }

  return next as Transition
}

/**
 * Playback rate for demos mounted in a Playground. Outside one, the rate is 1
 * and both helpers return their input untouched. Transitions need an explicit
 * `type` so the scaled version stays the same kind of animation.
 */
export function useTimeScale() {
  const rate = useContext(TimeScaleContext)

  return useMemo(
    () => ({
      rate,
      transition: (transition: Transition) => scaleTransition(transition, rate),
      ms: (milliseconds: number) => milliseconds / rate,
    }),
    [rate],
  )
}
