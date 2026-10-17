"use client"

import { motion, useTransform } from "motion/react"
import { ChevronRightIcon } from "@/components/icons/chevron-right"
import type { Moment } from "@/lib/said-out-loud"
import { formatTime } from "@/lib/time"
import { useEpisode } from "./episode-provider"
import { PlayPauseIcon } from "./play-pause-icon"

function spokenLength(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  const parts: string[] = []
  if (minutes) parts.push(minutes === 1 ? "1 minute" : `${minutes} minutes`)
  if (rest) parts.push(`${rest} seconds`)
  return parts.join(" ")
}

/** Rendered inside a relative `<li>`: the fill covers the whole row while the clip plays. */
export function MomentRow({ moment }: Readonly<{ moment: Moment }>) {
  const episode = useEpisode()
  const current = episode.clip?.id === moment.id
  const playing = current && (episode.status === "playing" || episode.status === "loading")
  const length = moment.end - moment.start
  const progress = useTransform(episode.time, (value) =>
    Math.min(1, Math.max(0, (value - moment.start) / length)),
  )
  const summaryId = `${moment.id}-summary`

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: current ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        style={{ scaleX: progress }}
        className="pointer-events-none absolute inset-0 origin-left bg-neutral-200/50"
      />
      <button
        type="button"
        aria-label={`${playing ? "Pause" : "Play"} clip: ${moment.title}, ${spokenLength(length)}`}
        aria-describedby={summaryId}
        onClick={() => episode.playClip(moment)}
        className="group relative grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 rounded-sm pt-4 pb-1 text-start outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="font-medium text-pretty underline decoration-transparent underline-offset-2 transition-colors duration-100 ease-out group-hover:decoration-neutral-400">
          {moment.title}
        </span>
        <span className="flex items-center gap-1.5 self-center text-sm text-neutral-600 tabular-nums whitespace-nowrap">
          <PlayPauseIcon playing={playing} loading={current && episode.slow} className="size-3.5" />
          {formatTime(length)}
        </span>
        <span id={summaryId} className="col-span-2 mt-1 text-pretty text-neutral-600">
          {moment.summary}
        </span>
      </button>
      <details className="group/transcript relative pb-1">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 rounded-sm text-sm text-neutral-600 underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out outline-none hover:text-foreground hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
          Transcript<span className="sr-only"> for {moment.title}</span>
          <ChevronRightIcon className="size-3 transition-transform duration-150 ease-out group-open/transcript:rotate-90" />
        </summary>
        <div className="max-w-[65ch] space-y-3 pt-1 pb-2 text-base leading-relaxed text-pretty text-neutral-600">
          {moment.transcript.map((line, index) => (
            <p key={index}>
              <span className="font-medium text-foreground">{line.speaker}:</span> {line.text}
            </p>
          ))}
        </div>
      </details>
    </>
  )
}
