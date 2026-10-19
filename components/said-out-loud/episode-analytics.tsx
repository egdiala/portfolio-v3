"use client"

import { useEffect, useRef } from "react"
import { useMotionValueEvent } from "motion/react"
import { trackEvent } from "@/lib/analytics"
import { EPISODE, type Moment } from "@/lib/said-out-loud"
import { useEpisode } from "./episode-provider"

const AUDIO_ID = "code-and-canvas-e1"
/** Percent of the episode actually listened to, so skipping ahead doesn't count. */
const MILESTONES = [25, 50, 75, 90]

/** Turns the player's state into podcast events without touching the player. Render it inside <EpisodeProvider>. */
export function EpisodeAnalytics() {
  const { status, clip, inlineInView, time } = useEpisode()

  // Read by the status effect, which should only run when the status changes.
  const latest = useRef({ clip, inlineInView })
  useEffect(() => {
    latest.current = { clip, inlineInView }
  })

  const session = useRef({
    playing: false,
    started: false,
    lastTime: 0,
    listened: 0,
    milestones: new Set<number>(),
    previousClip: null as Moment | null,
    clipJustFinished: false,
  })

  // A moment that played to its end. Runs before the status effect, so the clip stopping itself
  // isn't also reported as a pause.
  useEffect(() => {
    const s = session.current
    const previous = s.previousClip
    s.previousClip = clip
    if (!previous || clip) return

    // Not a seek past the end, which also clears the clip.
    const now = time.get()
    if (now >= previous.end - 0.25 && now <= previous.end + 1) {
      s.clipJustFinished = true
      trackEvent("podcast_moment_completed", { audioId: AUDIO_ID, moment: previous.id })
    }
  }, [clip, time])

  useEffect(() => {
    const s = session.current
    const position = Math.round(time.get())

    if (status === "playing" && !s.playing) {
      s.playing = true
      s.lastTime = time.get()
      if (!s.started) {
        s.started = true
        trackEvent("audio_started", { audioId: AUDIO_ID })
      }
      const { clip, inlineInView } = latest.current
      trackEvent("audio_play", {
        audioId: AUDIO_ID,
        source: clip ? "moment" : inlineInView ? "episode" : "mini_player",
        moment: clip?.id,
        positionSeconds: position,
      })
    } else if (status === "paused" && s.playing) {
      s.playing = false
      // `pause` fires before `ended`, so a finished episode lands here first.
      if (time.get() >= EPISODE.duration - 1) {
        trackEvent("audio_completed", { audioId: AUDIO_ID })
      } else if (s.clipJustFinished) {
        s.clipJustFinished = false
      } else {
        trackEvent("audio_pause", {
          audioId: AUDIO_ID,
          positionSeconds: position,
          listenedSeconds: Math.round(s.listened),
        })
      }
    } else if (status === "error") {
      s.playing = false
      trackEvent("podcast_error", { audioId: AUDIO_ID })
    }
  }, [status, time])

  useMotionValueEvent(time, "change", (now) => {
    const s = session.current
    if (!s.playing) return
    const delta = now - s.lastTime
    s.lastTime = now
    // Seeks jump; playing moves forward a frame at a time.
    if (delta <= 0 || delta > 2) return

    s.listened += delta
    const percent = (s.listened / EPISODE.duration) * 100
    for (const milestone of MILESTONES) {
      if (percent >= milestone && !s.milestones.has(milestone)) {
        s.milestones.add(milestone)
        trackEvent("podcast_progress", { audioId: AUDIO_ID, percent: milestone })
      }
    }
  })

  return null
}
