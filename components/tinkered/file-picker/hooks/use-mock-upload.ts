"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTimeScale } from "@/components/playground/time-scale"
import {
  BAR_MS,
  FAIL_FROM,
  FAIL_TO,
  MAX_STEPS,
  MIN_STEPS,
  STALL_MS,
  UPLOAD_MAX_MS,
  UPLOAD_MIN_MS,
} from "../constants"
import type { UploadResult, UploadState } from "../types"

function between(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Splits `total` into `count` uneven parts. */
function unevenParts(total: number, count: number) {
  const weights = Array.from({ length: count }, () => between(0.4, 1.6))
  const sum = weights.reduce((a, b) => a + b, 0)
  return weights.map((weight) => (weight / sum) * total)
}

/**
 * Stands in for the upload request. Each run reports progress in 7 to 11 uneven
 * jumps over 3 to 5 seconds, like the progress events from a real request.
 * The result is read as the run passes its failure point, so switching it
 * mid-upload still decides how this upload ends.
 */
export function useMockUpload(result: UploadResult) {
  const time = useTimeScale()
  const [state, setState] = useState<UploadState>("uploading")
  const [progress, setProgress] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const resultRef = useRef(result)
  // Read when a run starts, so changing the speed doesn't restart the upload.
  const msRef = useRef(time.ms)

  useEffect(() => {
    resultRef.current = result
    msRef.current = time.ms
  }, [result, time])

  const cancel = useCallback(() => {
    for (const id of timers.current) clearTimeout(id)
    timers.current = []
  }, [])

  const start = useCallback(() => {
    cancel()
    setState("uploading")
    setProgress(0)

    const ms = msRef.current
    const steps = Math.round(between(MIN_STEPS, MAX_STEPS))
    const gaps = unevenParts(ms(between(UPLOAD_MIN_MS, UPLOAD_MAX_MS)), steps)
    const jumps = unevenParts(100, steps)
    const failAt = between(FAIL_FROM, FAIL_TO)
    const later = (ms: number, run: () => void) => timers.current.push(setTimeout(run, ms))

    let elapsed = 0
    let reported = 0
    for (let step = 0; step < steps; step++) {
      elapsed += gaps[step]
      const value = step === steps - 1 ? 100 : Math.round(reported + jumps[step])
      const passesFailPoint = reported < failAt && value >= failAt
      reported = value

      later(elapsed, () => {
        if (passesFailPoint && resultRef.current === "failed") {
          // The request hangs, then gives up. The bar stays where it got to.
          cancel()
          later(ms(STALL_MS), () => setState("failed"))
          return
        }
        setProgress(value)
      })
    }

    // Let the bar finish its slide to 100 before the row says it's done.
    later(elapsed + ms(BAR_MS + 150), () => setState("completed"))
  }, [cancel])

  useEffect(() => cancel, [cancel])

  return { state, progress, start, cancel }
}
