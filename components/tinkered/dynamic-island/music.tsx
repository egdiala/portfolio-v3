"use client"

import { useEffect, useRef, useState, type ReactNode, type Ref, type RefObject } from "react"
import Image from "next/image"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { media } from "@/lib/media"
import { AudioVisualizer } from "./audio-visualizer"

export const TRACK = {
  title: "Death Note (feat. Ichika)",
  artist: "Polyphia",
  src: media("tinkered/dynamic-island/death-note.m4a"),
  cover: media("tinkered/dynamic-island/cover.jpg"),
  duration: 220,
}
const SKIP_SECONDS = 15
const COMPACT = { width: 173, height: 38 }
const EXPANDED = { width: 367, height: 165 }
/** The island resizes on this spring when the player opens or closes. */
export const PLAYER_SPRING = { type: "spring", duration: 0.3, bounce: 0 } as const
// Below this width the decorative lyrics and AirPlay glyphs crowd the transport.
const GLYPHS_MIN_WIDTH = 320

const fade = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
}

const iconSwap = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
}

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

type Playback = {
  audioRef: RefObject<HTMLAudioElement | null>
  progress: MotionValue<number>
  seconds: number
  duration: number
  playing: boolean
  toggle: () => void
  seek: (seconds: number) => void
  scrub: (active: boolean) => void
  setDuration: (seconds: number) => void
  stop: () => void
}

function usePlayback(): Playback {
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

function Artwork({
  layoutId,
  size,
  radius,
  transition,
}: Readonly<{ layoutId: string; size: number; radius: number; transition: Transition }>) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={transition}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      style={{ width: size, height: size, borderRadius: radius }}
      className="relative block shrink-0 overflow-hidden bg-[#931117]"
    >
      <Image src={TRACK.cover} alt="" fill sizes="53px" className="object-cover" />
    </motion.span>
  )
}

function TransportButton({
  label,
  onClick,
  children,
  ref,
}: Readonly<{ label: string; onClick: () => void; children: ReactNode; ref?: Ref<HTMLButtonElement> }>) {
  const time = useTimeScale()

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={time.transition({ type: "spring", stiffness: 550, damping: 30, restSpeed: 10 })}
      className="relative z-10 flex size-11 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {children}
    </motion.button>
  )
}

function SeekBar({ playback }: Readonly<{ playback: Playback }>) {
  const time = useTimeScale()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)
  const fill = useTransform(playback.progress, (value) => value / playback.duration)
  const active = hovered || focused || scrubbing

  const scrub = (next: boolean) => {
    playback.scrub(next)
    setScrubbing(next)
  }

  return (
    <div
      className={`relative h-[9px] flex-1 rounded-full ${focused ? "ring-2 ring-white/70 ring-offset-2 ring-offset-black" : ""}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        initial={false}
        animate={{ clipPath: active ? "inset(0px 0% round 999px)" : "inset(1.5px 2% round 999px)" }}
        transition={time.transition({ type: "spring", duration: 0.3, bounce: 0 })}
        className="relative size-full bg-[#3F3F3F]/70"
      >
        <motion.div style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-white" />
      </motion.div>
      <input
        type="range"
        min={0}
        max={Math.floor(playback.duration)}
        step={1}
        value={playback.seconds}
        aria-label="Seek"
        aria-valuetext={`${formatTime(playback.seconds)} of ${formatTime(playback.duration)}`}
        onChange={(event) => playback.seek(Number(event.target.value))}
        onPointerDown={() => scrub(true)}
        onPointerUp={() => scrub(false)}
        onPointerCancel={() => scrub(false)}
        onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        className="absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 cursor-pointer opacity-0"
      />
    </div>
  )
}

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

function BackwardGlyph() {
  return (
    <svg width="30" height="31" viewBox="0 0 39 40" fill="none" aria-hidden="true">
      <path d="M16.0088 29.8252C16.999 29.8252 17.8369 29.0635 17.8369 27.6543V20.3418C17.9766 20.875 18.3701 21.332 19.0557 21.7383L31.9922 29.3555C32.5 29.6602 32.9316 29.8252 33.4521 29.8252C34.4424 29.8252 35.2803 29.0635 35.2803 27.6543V12.0518C35.2803 10.6426 34.4424 9.88086 33.4521 9.88086C32.9316 9.88086 32.5127 10.0459 31.9922 10.3506L19.0557 17.9678C18.3574 18.374 17.9766 18.8311 17.8369 19.3643V12.0518C17.8369 10.6426 16.999 9.88086 16.0088 9.88086C15.4883 9.88086 15.0693 10.0459 14.5488 10.3506L1.6123 17.9678C0.710938 18.501 0.330078 19.123 0.330078 19.8467C0.330078 20.583 0.710938 21.2051 1.6123 21.7383L14.5488 29.3555C15.0566 29.6602 15.4883 29.8252 16.0088 29.8252Z" fill="white" />
    </svg>
  )
}

function ForwardGlyph() {
  return (
    <svg width="30" height="31" viewBox="0 0 39 40" fill="none" aria-hidden="true">
      <path d="M5.06543 29.8252C5.58594 29.8252 6.01758 29.6602 6.52539 29.3555L19.4619 21.7383C20.1602 21.332 20.541 20.875 20.6807 20.3418V27.6543C20.6807 29.0635 21.5186 29.8252 22.5088 29.8252C23.0293 29.8252 23.4609 29.6602 23.9688 29.3555L36.918 21.7383C37.8066 21.2051 38.2002 20.583 38.2002 19.8467C38.2002 19.123 37.8066 18.501 36.918 17.9678L23.9688 10.3506C23.4609 10.0459 23.0293 9.88086 22.5088 9.88086C21.5186 9.88086 20.6807 10.6426 20.6807 12.0518V19.3643C20.541 18.8311 20.1602 18.374 19.4619 17.9678L6.52539 10.3506C6.00488 10.0459 5.58594 9.88086 5.06543 9.88086C4.0752 9.88086 3.2373 10.6426 3.2373 12.0518V27.6543C3.2373 29.0635 4.0752 29.8252 5.06543 29.8252Z" fill="white" />
    </svg>
  )
}

function LyricsGlyph() {
  return (
    <svg width="28" height="18" viewBox="0 0 32 21" fill="none" aria-hidden="true" className="opacity-60">
      <path d="M10.8259 0.662021C13.3416 0.684788 15.3907 2.3354 15.3907 5.2382C15.3907 7.75396 13.9108 9.50702 12.0325 10.5885C11.1788 11.0666 10.2453 11.4081 8.7427 11.6244C8.98176 11.0552 9.11836 10.4177 9.11836 9.72331C9.11836 7.28724 7.11486 5.1016 4.64463 4.65764C4.84954 4.2023 5.04306 3.89494 5.25934 3.62174C6.70505 1.59547 8.8793 0.639254 10.8259 0.662021ZM21.5036 0.662021C23.4616 0.639254 25.6245 1.59547 27.0816 3.62174C27.2865 3.89494 27.4914 4.2023 27.6849 4.65764C25.2147 5.1016 23.2226 7.28724 23.2226 9.72331C23.2226 10.4177 23.3478 11.0552 23.5982 11.6244C22.0956 11.4081 21.1621 11.0666 20.297 10.5885C18.4301 9.50702 16.9502 7.75396 16.9502 5.2382C16.9502 2.3354 18.9993 0.684788 21.5036 0.662021ZM21.0711 5.54556C21.2987 5.73908 21.6402 5.71631 21.8338 5.47725C22.0273 5.2382 22.0045 4.89669 21.7655 4.70317L20.0921 3.29162C19.8644 3.0981 19.5115 3.13225 19.3294 3.3713C19.1359 3.59897 19.1472 3.94048 19.3863 4.134L21.0711 5.54556ZM11.2698 5.54556L12.9546 4.134C13.1937 3.94048 13.205 3.59897 13.0001 3.3713C12.818 3.13225 12.4765 3.0981 12.2488 3.29162L10.5755 4.70317C10.3364 4.89669 10.3022 5.2382 10.4958 5.47725C10.6893 5.71631 11.0422 5.73908 11.2698 5.54556ZM4.69017 13.0245C2.65251 13.0245 0.546561 11.4081 0.546561 8.93785C0.546561 7.28724 1.71906 5.67077 3.75672 5.67077C6.17002 5.67077 8.02554 7.75396 8.02554 9.72331C8.02554 11.9317 6.45461 13.0245 4.69017 13.0245ZM27.6507 13.0245C25.8863 13.0245 24.3154 11.9317 24.3154 9.72331C24.3154 7.75396 26.1709 5.67077 28.5842 5.67077C30.6218 5.67077 31.7943 7.28724 31.7943 8.93785C31.7943 11.4081 29.6884 13.0245 27.6507 13.0245ZM4.12099 11.2942C4.43973 11.021 4.26897 10.4746 3.62011 9.64363C2.9371 8.82401 2.40208 8.55081 2.07195 8.84678C1.75321 9.11998 1.92397 9.67778 2.58421 10.486C3.25584 11.2942 3.80225 11.5788 4.12099 11.2942ZM28.2199 11.2942C28.5387 11.5788 29.0851 11.2942 29.7567 10.486C30.4169 9.67778 30.5877 9.11998 30.269 8.84678C29.9388 8.55081 29.4038 8.82401 28.7208 9.64363C28.0719 10.4746 27.9012 11.021 28.2199 11.2942ZM9.18666 20.7995C8.48088 20.7995 8.01416 20.4352 8.01416 19.7294V12.8765C9.19804 12.7969 10.2795 12.5806 11.2471 12.2277V19.7294C11.2471 20.4352 10.7804 20.7995 10.086 20.7995H9.18666ZM23.1429 20.7995H22.255C21.5492 20.7995 21.0938 20.4352 21.0938 19.7294V12.2277C22.0614 12.5806 23.1315 12.7969 24.3154 12.8765V19.7294C24.3154 20.4352 23.86 20.7995 23.1429 20.7995Z" fill="white" />
    </svg>
  )
}

function AirPlayGlyph() {
  return (
    <svg width="24" height="34" viewBox="0 0 28 40" fill="none" aria-hidden="true" className="opacity-60">
      <path d="M2.01025 19.8916C2.01025 23.0474 3.29053 25.8999 5.3457 27.9775C5.4917 28.1235 5.64893 28.1235 5.77246 27.9663L6.27783 27.3936C6.4126 27.2476 6.40137 27.1128 6.2666 26.9668C4.49219 25.1362 3.38037 22.6318 3.38037 19.8916C3.38037 14.3662 7.9624 9.77295 13.5103 9.77295C19.0581 9.77295 23.6401 14.3662 23.6401 19.8916C23.6401 22.6318 22.5283 25.1362 20.7539 26.9668C20.6191 27.1128 20.6079 27.2476 20.7427 27.3936L21.248 27.9663C21.3716 28.1235 21.5288 28.1235 21.6748 27.9775C23.73 25.9111 25.0103 23.0474 25.0103 19.8916C25.0103 13.5913 19.8555 8.3916 13.5103 8.3916C7.16504 8.3916 2.01025 13.5913 2.01025 19.8916ZM5.27832 19.8916C5.27832 22.0703 6.12061 24.0356 7.51318 25.5181C7.65918 25.6753 7.81641 25.6641 7.95117 25.5181L8.45654 24.9565C8.60254 24.8105 8.58008 24.6758 8.44531 24.5186C7.3335 23.2832 6.65967 21.666 6.65967 19.8916C6.65967 16.1406 9.74805 13.041 13.5103 13.041C17.2725 13.041 20.3608 16.1406 20.3608 19.8916C20.3608 21.666 19.687 23.2832 18.5752 24.5073C18.4404 24.6646 18.418 24.7993 18.564 24.9453L19.0806 25.5181C19.2041 25.6641 19.3726 25.6753 19.5073 25.5181C20.8887 24.0356 21.7422 22.0703 21.7422 19.8916C21.7422 15.377 18.0474 11.6597 13.5103 11.6597C8.97314 11.6597 5.27832 15.377 5.27832 19.8916ZM8.54639 19.8916C8.54639 21.082 8.96191 22.1714 9.68066 23.0361C9.8042 23.1934 9.96143 23.1934 10.1074 23.0361L10.6353 22.4858C10.77 22.3511 10.7588 22.2051 10.6577 22.0479C10.1973 21.4526 9.92773 20.689 9.92773 19.8916C9.92773 17.9375 11.5562 16.3091 13.5103 16.3091C15.4644 16.3091 17.0928 17.9375 17.0928 19.8916C17.0928 20.689 16.8232 21.4526 16.3628 22.0479C16.2505 22.2051 16.2393 22.3511 16.3853 22.4971L16.9131 23.0361C17.0479 23.1934 17.2163 23.1934 17.3398 23.0361C18.0586 22.1714 18.4741 21.082 18.4741 19.8916C18.4741 17.1738 16.2393 14.9277 13.5103 14.9277C10.7812 14.9277 8.54639 17.1738 8.54639 19.8916ZM6.24414 30.0889C5.90723 30.4707 6.10938 31.0098 6.63721 31.0098H20.3608C20.8887 31.0098 21.0908 30.4595 20.7651 30.0889L13.9819 22.4185C13.7236 22.1265 13.2744 22.1265 13.0161 22.4185L6.24414 30.0889Z" fill="white" />
    </svg>
  )
}
