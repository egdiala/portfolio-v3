"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion, useTransform } from "motion/react"
import { XMarkIcon } from "@/components/icons/x-mark"
import { EPISODE } from "@/lib/said-out-loud"
import { useEpisode } from "./episode-provider"
import { PlayPauseIcon } from "./play-pause-icon"

const ease = [0.23, 1, 0.32, 1] as const

const buttonClass =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg text-foreground transition-[scale,background-color] duration-150 ease-out outline-none hover:bg-neutral-200/50 focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-inset active:scale-[0.96]"

/** Keeps the episode in reach on other pages, and once its section scrolls away. */
export function MiniPlayer() {
  const episode = useEpisode()
  const reduceMotion = useReducedMotion()
  const visible = episode.active && !episode.inlineInView
  const playing = episode.status === "playing" || episode.status === "loading"
  const { clip } = episode
  const progress = useTransform(episode.time, (value) =>
    clip ? Math.min(1, Math.max(0, (value - clip.start) / (clip.end - clip.start))) : value / EPISODE.duration,
  )

  const sectionRef = useRef<HTMLElement>(null)
  const { inlineButtonRef } = episode

  // Hidden because its section scrolled into view: focus would otherwise drop to the body.
  // The exit animation keeps the player mounted, so it can still be asked what has focus.
  useEffect(() => {
    if (!visible && sectionRef.current?.contains(document.activeElement)) {
      inlineButtonRef.current?.focus({ preventScroll: true })
    }
  }, [visible, inlineButtonRef])

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(150%)" }
  const shown = reduceMotion ? { opacity: 1 } : { opacity: 1, transform: "translateY(0%)" }

  const close = () => {
    episode.close()
    const target = episode.inlineButtonRef.current ?? document.getElementById("content")
    target?.focus({ preventScroll: true })
  }

  return (
    <>
      {/* Room at the end of the page, so the footer can scroll clear of the player. */}
      {visible ? <div aria-hidden="true" className="h-20 shrink-0" /> : null}
      <AnimatePresence>
        {visible ? (
          <motion.section
            ref={sectionRef}
            key="mini-player"
            aria-label="Podcast player"
            initial={hidden}
            animate={shown}
            exit={{ ...hidden, transition: { duration: 0.15, ease } }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto w-[min(24rem,calc(100%-2.5rem))]"
          >
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-background p-2 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_2px_4px_-1px_rgb(0_0_0/0.06),0_12px_24px_-8px_rgb(0_0_0/0.16)]">
              <Image
                src={EPISODE.cover}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-lg outline-1 -outline-offset-1 outline-black/10"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {episode.status === "error" ? "Couldn't load the episode" : (clip?.title ?? EPISODE.title)}
                </p>
                <p className="truncate text-sm text-neutral-600">{EPISODE.show}</p>
              </div>
              <div className="flex shrink-0">
                <button
                  type="button"
                  aria-label={`${playing ? "Pause" : "Play"} ${clip ? "clip" : "episode"}`}
                  onClick={clip ? () => episode.playClip(clip) : episode.toggle}
                  className={buttonClass}
                >
                  <PlayPauseIcon playing={playing} loading={episode.slow} />
                </button>
                <button type="button" aria-label="Close player" onClick={close} className={buttonClass}>
                  <XMarkIcon className="size-3" />
                </button>
              </div>
              <motion.div
                aria-hidden="true"
                style={{ scaleX: progress }}
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-foreground"
              />
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  )
}
