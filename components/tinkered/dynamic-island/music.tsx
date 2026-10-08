"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { AudioVisualizer } from "./audio-visualizer"
import { COMPACT, EXPANDED, fade, GLYPHS_MIN_WIDTH, iconSwap, PLAYER_SPRING, SKIP_SECONDS, TRACK } from "./constants"
import { AirPlayGlyph, BackwardGlyph, ForwardGlyph, LyricsGlyph } from "./glyphs"
import { formatTime, usePlayback } from "./hooks/use-playback"
import { SeekBar } from "./seek-bar"
import { Artwork, TransportButton } from "./transport"

export { PLAYER_SPRING, TRACK } from "./constants"

/**
 * The compact pill is not interactive on its own: the island clips anything
 * outside its shape, so DynamicIsland renders the 44px trigger outside it.
 *
 * The player jumps between its two sizes and the island's layout animation
 * morphs between them. Both faces keep a fixed size and animate position only,
 * so they are not stretched while the island scales.
 */
export function Music({
  maxWidth,
  expanded,
  onCollapse,
}: Readonly<{
  maxWidth: number
  expanded: boolean
  onCollapse: (restoreFocus: boolean) => void
}>) {
  const time = useTimeScale()
  const playback = usePlayback()
  const rootRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)

  const width = Math.min(EXPANDED.width, maxWidth)
  const morph = time.transition({ type: "spring", duration: 0.5, bounce: 0.1 })
  const snappy = time.transition(PLAYER_SPRING)
  const content = time.transition({ type: "tween", ease: "easeOut", duration: 0.3 })
  const swap = time.transition({ type: "tween", ease: "easeInOut", duration: 0.1 })

  useEffect(() => {
    if (!expanded) return
    const root = rootRef.current
    const scope = root?.closest("[data-playground-stage]") ?? document

    const onPointerDown = (event: Event) => {
      if (!root?.contains(event.target as Node)) onCollapse(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCollapse(root?.contains(document.activeElement) ?? false)
    }

    scope.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      scope.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [expanded, onCollapse])

  useEffect(() => {
    if (expanded) playRef.current?.focus({ preventScroll: true })
  }, [expanded])

  return (
    <div
      ref={rootRef}
      style={expanded ? { width, height: EXPANDED.height } : COMPACT}
      className="relative flex"
    >
      <audio
        ref={playback.audioRef}
        src={TRACK.src}
        preload="none"
        onLoadedMetadata={(event) => playback.setDuration(event.currentTarget.duration)}
        onPause={playback.stop}
      />

      <AnimatePresence>
        {expanded ? (
          <motion.div
            key="expanded"
            layout="position"
            exit={{ opacity: 0 }}
            transition={{ ...morph, layout: snappy }}
            style={{ width, height: EXPANDED.height }}
            className="absolute top-0 left-0 z-10 flex flex-col gap-2 p-5"
          >
            <div className="flex items-center gap-3">
              <Artwork layoutId="artwork" size={53} radius={8} transition={morph} />
              <motion.div {...fade} transition={content} className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base leading-tight font-semibold">{TRACK.title}</span>
                <span className="text-sm text-[#9A9A9A]">{TRACK.artist}</span>
              </motion.div>
              <motion.div exit={fade.exit} transition={snappy}>
                <AudioVisualizer playing={playback.playing} />
              </motion.div>
            </div>

            <motion.div {...fade} transition={content} className="flex items-center gap-2.5">
              <span className="w-8 text-xs text-[#9A9A9A] tabular-nums">
                {formatTime(playback.seconds)}
              </span>
              <SeekBar playback={playback} />
              <span className="w-9 text-end text-xs text-[#9A9A9A] tabular-nums">
                -{formatTime(playback.duration - playback.seconds)}
              </span>
            </motion.div>

            <motion.div
              {...fade}
              transition={content}
              className={`flex items-center ${width >= GLYPHS_MIN_WIDTH ? "justify-between" : "justify-center"}`}
            >
              {width >= GLYPHS_MIN_WIDTH ? <LyricsGlyph /> : null}
              <div className="flex items-center gap-4">
                <TransportButton
                  label={`Back ${SKIP_SECONDS} seconds`}
                  onClick={() => playback.seek(playback.progress.get() - SKIP_SECONDS)}
                >
                  <BackwardGlyph />
                </TransportButton>
                <TransportButton
                  ref={playRef}
                  label={playback.playing ? "Pause" : "Play"}
                  onClick={playback.toggle}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {playback.playing ? (
                      <motion.svg key="pause" {...iconSwap} transition={swap} width="33" height="40" viewBox="0 0 33 40" fill="none" aria-hidden="true">
                        <path d="M7.19922 35.7256H11.4297C13.0439 35.7256 13.8975 34.8721 13.8975 33.2393V7.96777C13.8975 6.2793 13.0439 5.5 11.4297 5.5H7.19922C5.58496 5.5 4.73145 6.35352 4.73145 7.96777V33.2393C4.73145 34.8721 5.58496 35.7256 7.19922 35.7256ZM20.6885 35.7256H24.9004C26.5332 35.7256 27.3682 34.8721 27.3682 33.2393V7.96777C27.3682 6.2793 26.5332 5.5 24.9004 5.5H20.6885C19.0557 5.5 18.2021 6.35352 18.2021 7.96777V33.2393C18.2021 34.8721 19.0557 35.7256 20.6885 35.7256Z" fill="white" />
                      </motion.svg>
                    ) : (
                      <motion.svg key="play" {...iconSwap} transition={swap} width="36" height="41" viewBox="0 0 36 41" fill="none" aria-hidden="true">
                        <path d="M7.68846 35.7688C8.40301 35.7688 9.03637 35.5198 9.84836 35.0384L29.1251 23.6175C30.5704 22.7709 31.22 22.0571 31.22 20.9117C31.22 19.7829 30.5704 19.0691 29.1251 18.2059L9.84836 6.78496C9.03637 6.30356 8.40301 6.05455 7.68846 6.05455C6.27559 6.05455 5.22 7.16676 5.22 8.94298V32.8804C5.22 34.6732 6.27559 35.7688 7.68846 35.7688Z" fill="white" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </TransportButton>
                <TransportButton
                  label={`Forward ${SKIP_SECONDS} seconds`}
                  onClick={() => playback.seek(playback.progress.get() + SKIP_SECONDS)}
                >
                  <ForwardGlyph />
                </TransportButton>
              </div>
              {width >= GLYPHS_MIN_WIDTH ? <AirPlayGlyph /> : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {expanded ? null : (
          <motion.div
            key="compact"
            layout="position"
            transition={{ layout: snappy }}
            aria-hidden="true"
            style={{ borderRadius: 32 }}
            className="relative flex h-[38px] w-[173px] items-center justify-between gap-2 px-2.5"
          >
            <Artwork layoutId="artwork" size={24} radius={4} transition={snappy} />
            <motion.span exit={fade.exit} transition={snappy}>
              <AudioVisualizer playing={playback.playing} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
