"use client"

import Image from "next/image"
import { formatMonth } from "@/lib/figured-out"
import { EPISODE } from "@/lib/said-out-loud"
import { formatTime } from "@/lib/time"
import { useElapsed, useEpisode } from "./episode-provider"
import { PlayPauseIcon } from "./play-pause-icon"
import { SeekBar } from "./seek-bar"

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm text-base underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out outline-none hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function EpisodeCard() {
  const { inlineButtonRef, ...episode } = useEpisode()
  const seconds = useElapsed()
  const playing = episode.status === "playing" || episode.status === "loading"

  return (
    <div className="max-w-[50ch]">
      <div className="flex items-center gap-4">
        <Image
          src={EPISODE.cover}
          alt=""
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-lg outline-1 -outline-offset-1 outline-black/10"
        />
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-base font-medium text-balance">{EPISODE.title}</h3>
          <p className="text-sm text-neutral-600">
            {EPISODE.show} · Episode {EPISODE.number} ·{" "}
            <time dateTime={EPISODE.publishedAt}>{formatMonth(EPISODE.publishedAt)}</time>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          ref={inlineButtonRef}
          type="button"
          aria-label={playing ? "Pause episode" : "Play episode"}
          onClick={episode.toggle}
          className="relative grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground transition-[scale,background-color] duration-150 ease-out outline-none after:absolute after:-inset-1 hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]"
        >
          <PlayPauseIcon playing={playing} loading={episode.slow} />
        </button>
        <span className="min-w-10 text-sm text-neutral-600 tabular-nums">{formatTime(seconds)}</span>
        <SeekBar />
        <span className="min-w-10 text-end text-sm text-neutral-600 tabular-nums">{formatTime(EPISODE.duration)}</span>
      </div>

      {episode.status === "error" ? (
        <p className="mt-3 text-sm text-pretty text-neutral-600">
          Couldn&apos;t load the episode. It&apos;s also on Spotify and Apple Podcasts below.
        </p>
      ) : null}

      <p className="mt-4 text-base leading-relaxed text-pretty text-neutral-600">{EPISODE.summary}</p>
      <p className="mt-2 flex flex-wrap gap-x-5">
        {EPISODE.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </p>
    </div>
  )
}
