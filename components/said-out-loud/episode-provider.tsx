"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import { useMotionValue, useMotionValueEvent, type MotionValue } from "motion/react"
import { EPISODE, type Moment } from "@/lib/said-out-loud"

type Status = "idle" | "loading" | "playing" | "paused" | "error"

type Episode = {
  status: Status
  /** The moment playing as a clip, or null while the episode plays freely. */
  clip: Moment | null
  /** Started and not closed: the mini player may show. */
  active: boolean
  /** Loading has lasted long enough to show a spinner. */
  slow: boolean
  time: MotionValue<number>
  inlineInView: boolean
  setInlineInView: (inView: boolean) => void
  /** The inline play button, where focus goes when the mini player closes. */
  inlineButtonRef: RefObject<HTMLButtonElement | null>
  toggle: () => void
  playClip: (moment: Moment) => void
  seek: (seconds: number) => void
  scrub: (scrubbing: boolean) => void
  close: () => void
}

const EpisodeContext = createContext<Episode | null>(null)

const FADE_IN = 0.25
const FADE_OUT = 0.6
const SPINNER_DELAY = 300
const SKIP_SECONDS = 10

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function useEpisode() {
  const episode = useContext(EpisodeContext)
  if (!episode) throw new Error("useEpisode must be used inside <EpisodeProvider>")
  return episode
}

/** Whole seconds into the episode, re-rendering once a second rather than every frame. */
export function useElapsed() {
  const { time } = useEpisode()
  const [seconds, setSeconds] = useState(() => Math.floor(time.get()))
  useMotionValueEvent(time, "change", (latest) => setSeconds(Math.floor(latest)))
  return seconds
}

export function EpisodeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const inlineButtonRef = useRef<HTMLButtonElement>(null)
  const time = useMotionValue(0)
  const [status, setStatus] = useState<Status>("idle")
  const [clip, setClipState] = useState<Moment | null>(null)
  const [active, setActive] = useState(false)
  const [slow, setSlow] = useState(false)
  const [inlineInView, setInlineInView] = useState(false)

  // The frame loop and media events read these without re-subscribing.
  const clipRef = useRef<Moment | null>(null)
  // Before metadata loads, Safari can ignore `currentTime` writes, so a seek waits here.
  const pendingSeekRef = useRef<number | null>(null)
  // iOS Safari keeps `volume` at 1, so clips there stop at their end without fading.
  // Web Audio can't fade instead: the host sends no CORS headers, which would mute it.
  const fadesRef = useRef<boolean | null>(null)

  const setClip = useCallback((next: Moment | null) => {
    clipRef.current = next
    setClipState(next)
  }, [])

  const seekTo = useCallback(
    (seconds: number) => {
      const audio = audioRef.current
      if (!audio) return
      time.set(seconds)
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        audio.currentTime = seconds
      } else {
        pendingSeekRef.current = seconds
      }
    },
    [time],
  )

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.error) {
      pendingSeekRef.current = time.get()
      audio.load()
    }
    fadesRef.current ??= volumeIsSettable(audio)
    pauseOtherMedia(audio)
    setActive(true)
    setStatus("loading")
    audio.play().catch(() => setStatus(audio.error ? "error" : "paused"))
  }, [time])

  // Runs every frame while playing, and on `timeupdate` so a clip still ends in a background tab.
  const step = useCallback(() => {
    const audio = audioRef.current
    if (!audio || pendingSeekRef.current !== null) return
    const now = audio.currentTime
    time.set(now)

    const current = clipRef.current
    if (!current) {
      if (fadesRef.current && audio.volume !== 1) audio.volume = 1
      return
    }
    if (now >= current.end) {
      audio.pause()
      audio.volume = 1
      setClip(null)
      return
    }
    if (fadesRef.current) {
      audio.volume = Math.min(clamp01((now - current.start) / FADE_IN), clamp01((current.end - now) / FADE_OUT))
    }
  }, [time, setClip])

  useEffect(() => {
    if (status !== "playing") return
    let frame = 0
    const tick = () => {
      step()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [status, step])

  useEffect(() => {
    if (status !== "loading") {
      setSlow(false)
      return
    }
    const timer = setTimeout(() => setSlow(true), SPINNER_DELAY)
    return () => clearTimeout(timer)
  }, [status])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
      return
    }
    setClip(null)
    play()
  }, [play, setClip])

  const playClip = useCallback(
    (moment: Moment) => {
      const audio = audioRef.current
      if (!audio) return
      if (clipRef.current?.id === moment.id) {
        if (audio.paused) play()
        else audio.pause()
        return
      }
      setClip(moment)
      seekTo(moment.start)
      play()
    },
    [play, seekTo, setClip],
  )

  const seek = useCallback(
    (seconds: number) => {
      setClip(null)
      seekTo(Math.min(EPISODE.duration, Math.max(0, seconds)))
    },
    [seekTo, setClip],
  )

  const scrub = useCallback((scrubbing: boolean) => {
    if (audioRef.current) audioRef.current.muted = scrubbing
  }, [])

  const close = useCallback(() => {
    audioRef.current?.pause()
    setClip(null)
    setActive(false)
  }, [setClip])

  // Another sound starting (say, the Dynamic Island demo) pauses the episode.
  useEffect(() => {
    const onPlay = (event: Event) => {
      const own = audioRef.current
      if (event.target instanceof HTMLMediaElement && event.target !== own && !event.target.muted) own?.pause()
    }
    document.addEventListener("play", onPlay, true)
    return () => document.removeEventListener("play", onPlay, true)
  }, [])

  useEffect(() => {
    if (!("mediaSession" in navigator)) return
    const session = navigator.mediaSession
    if (!active) {
      session.metadata = null
      session.playbackState = "none"
      return
    }
    session.metadata = new MediaMetadata({
      title: clip?.title ?? EPISODE.title,
      artist: EPISODE.show,
      artwork: [{ src: EPISODE.cover, sizes: "600x600", type: "image/jpeg" }],
    })
  }, [active, clip])

  useEffect(() => {
    if (!active || !("mediaSession" in navigator)) return
    const session = navigator.mediaSession
    const position = () => audioRef.current?.currentTime ?? 0
    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ["play", () => play()],
      ["pause", () => audioRef.current?.pause()],
      ["stop", () => close()],
      ["seekto", (details) => seek(details.seekTime ?? position())],
      ["seekbackward", (details) => seek(position() - (details.seekOffset ?? SKIP_SECONDS))],
      ["seekforward", (details) => seek(position() + (details.seekOffset ?? SKIP_SECONDS))],
    ]
    for (const [action, handler] of handlers) session.setActionHandler(action, handler)
    return () => {
      for (const [action] of handlers) session.setActionHandler(action, null)
    }
  }, [active, play, close, seek])

  useEffect(() => {
    if (!active || !("mediaSession" in navigator)) return
    navigator.mediaSession.playbackState = status === "playing" || status === "loading" ? "playing" : "paused"
  }, [active, status])

  const syncPosition = () => {
    const audio = audioRef.current
    if (!audio || !("mediaSession" in navigator) || !Number.isFinite(audio.duration)) return
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: Math.min(audio.currentTime, audio.duration),
    })
  }

  const value = useMemo<Episode>(
    () => ({
      status,
      clip,
      active,
      slow,
      time,
      inlineInView,
      setInlineInView,
      inlineButtonRef,
      toggle,
      playClip,
      seek,
      scrub,
      close,
    }),
    [status, clip, active, slow, time, inlineInView, toggle, playClip, seek, scrub, close],
  )

  return (
    <EpisodeContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={EPISODE.audio}
        preload="none"
        onLoadedMetadata={(event) => {
          const pending = pendingSeekRef.current
          if (pending !== null) {
            event.currentTarget.currentTime = pending
            pendingSeekRef.current = null
          }
          syncPosition()
        }}
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus("loading")}
        onPause={(event) => setStatus(event.currentTarget.error ? "error" : "paused")}
        onError={() => setStatus("error")}
        onTimeUpdate={step}
        onSeeked={(event) => {
          if (pendingSeekRef.current === null) time.set(event.currentTarget.currentTime)
          syncPosition()
        }}
        onEnded={() => setClip(null)}
      />
      <p role="status" className="sr-only">
        {status === "error"
          ? "Couldn't load the episode. It's also on Spotify and Apple Podcasts."
          : slow
            ? "Loading the episode"
            : ""}
      </p>
    </EpisodeContext.Provider>
  )
}

function volumeIsSettable(audio: HTMLAudioElement) {
  audio.volume = 0.5
  const settable = audio.volume === 0.5
  audio.volume = 1
  return settable
}

/** Muted loops (the work videos) keep playing; anything with sound stops. */
function pauseOtherMedia(own: HTMLMediaElement) {
  for (const media of document.querySelectorAll<HTMLMediaElement>("audio, video")) {
    if (media !== own && !media.muted && !media.paused) media.pause()
  }
}
