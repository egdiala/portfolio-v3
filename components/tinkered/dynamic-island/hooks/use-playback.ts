"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValue, useMotionValueEvent } from "motion/react"
import { TRACK } from "../constants"
import type { Playback } from "../types"

export function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

export function usePlayback(): Playback {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progress = useMotionValue(0)
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(TRACK.duration)
  const [playing, setPlaying] = useState(false)

  useMotionValueEvent(progress, "change", (latest) => setSeconds(Math.floor(latest)))

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !playing) return
    let frame = 0
    const tick = () => {
      progress.set(audio.currentTime)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, progress])

  useEffect(() => {
    const audio = audioRef.current
    return () => audio?.pause()
  }, [])

  return {
    audioRef,
    progress,
    seconds,
    duration,
    playing,
    toggle: () => {
      const audio = audioRef.current
      if (!audio) return
      if (audio.paused) {
        setPlaying(true)
        audio.play().catch(() => setPlaying(false))
      } else {
        audio.pause()
      }
    },
    seek: (value) => {
      const next = Math.min(duration, Math.max(0, value))
      if (audioRef.current) audioRef.current.currentTime = next
      progress.set(next)
    },
    scrub: (active) => {
      if (audioRef.current) audioRef.current.muted = active
    },
    setDuration: (value) => {
      if (Number.isFinite(value)) setDuration(value)
    },
    stop: () => setPlaying(false),
  }
}
