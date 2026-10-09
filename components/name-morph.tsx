"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

const SCROLL_DISTANCE = 140
const FADE_PORTION = 0.45
const BLUR_MAX = 4

type Side = "start" | "end" | "keep" | "enter"

type Glyph = {
  char: string
  side: Side
}

// "stephen diala" settles on "egdiala". The second e in "stephen" stays,
// and so does "diala". Everything else blurs shut. "g" is not in the full
// name, so it opens in the same slot language, unblurring as it arrives.
const GLYPHS: Glyph[] = [
  { char: "s", side: "start" },
  { char: "t", side: "start" },
  { char: "e", side: "start" },
  { char: "p", side: "start" },
  { char: "h", side: "start" },
  { char: "e", side: "keep" },
  { char: "g", side: "enter" },
  { char: "n", side: "end" },
  { char: "\u00A0", side: "end" },
  { char: "d", side: "keep" },
  { char: "i", side: "keep" },
  { char: "a", side: "keep" },
  { char: "l", side: "keep" },
  { char: "a", side: "keep" },
]

const ALIGN: Record<Side, string> = {
  start: "justify-end",
  end: "justify-start",
  keep: "justify-center",
  enter: "justify-start",
}

function fadeIn(value: number) {
  return Math.min(1, value / FADE_PORTION)
}

function GlyphSlot({
  glyph,
  progress,
  fullWidth,
  measureRef,
}: Readonly<{
  glyph: Glyph
  progress: MotionValue<number>
  fullWidth: number | null
  measureRef: (node: HTMLSpanElement | null) => void
}>) {
  const widthRef = useRef(fullWidth)
  widthRef.current = fullWidth

  const width = useTransform(progress, (value) => {
    const full = widthRef.current
    if (full == null) return 0
    if (glyph.side === "keep") return full
    if (glyph.side === "enter") return full * fadeIn(value)
    return full * (1 - value)
  })
  const opacity = useTransform(progress, (value) => {
    if (glyph.side === "keep") return 1
    if (glyph.side === "enter") return fadeIn(value)
    return Math.max(0, 1 - value / FADE_PORTION)
  })
  const blur = useTransform(progress, (value) => {
    if (glyph.side === "keep") return 0
    if (glyph.side === "enter") return BLUR_MAX * (1 - fadeIn(value))
    return Math.min(BLUR_MAX, (value / FADE_PORTION) * BLUR_MAX)
  })
  const filter = useMotionTemplate`blur(${blur}px)`

  let slotStyle: { width: number | MotionValue<number>; opacity: number | MotionValue<number> } | undefined
  if (fullWidth == null && glyph.side === "enter") {
    slotStyle = { width: 0, opacity: 0 }
  } else if (fullWidth != null) {
    slotStyle = { width, opacity }
  }

  return (
    <motion.span
      aria-hidden="true"
      className={`inline-flex min-w-0 [clip-path:inset(-0.4em_0)] ${ALIGN[glyph.side]}`}
      style={slotStyle}
    >
      <motion.span
        ref={measureRef}
        className="block shrink-0 leading-none whitespace-pre"
        style={{ filter }}
      >
        {glyph.char}
      </motion.span>
    </motion.span>
  )
}

export function NameMorph() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const reduceRef = useRef(prefersReducedMotion)
  reduceRef.current = prefersReducedMotion

  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, (latest) => {
    if (reduceRef.current) return 0
    return Math.min(1, Math.max(0, latest / SCROLL_DISTANCE))
  })
  const progress = useSpring(rawProgress, {
    stiffness: 420,
    damping: 48,
    mass: 0.25,
  })

  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [widths, setWidths] = useState<Array<number | null>>(() =>
    GLYPHS.map(() => null),
  )

  useLayoutEffect(() => {
    const measure = () => {
      const next = GLYPHS.map(
        (_, index) => glyphRefs.current[index]?.getBoundingClientRect().width ?? 0,
      )
      if (next.every((width) => width === 0)) return
      setWidths((current) => {
        const same = current.every(
          (width, index) =>
            width != null && Math.abs(width - next[index]) < 0.5,
        )
        return same ? current : next
      })
    }

    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const glyphs = GLYPHS.map((glyph, index) => (
    <GlyphSlot
      key={`${glyph.side}-${index}`}
      glyph={glyph}
      progress={progress}
      fullWidth={widths[index]}
      measureRef={(node) => {
        glyphRefs.current[index] = node
      }}
    />
  ))
  const nameClassName =
    "inline-flex shrink-0 items-baseline font-asimovian text-2xl leading-none font-bold"

  if (pathname === "/") {
    return (
      <h1 aria-label="stephen diala" className={nameClassName}>
        {glyphs}
      </h1>
    )
  }

  return (
    <Link
      href="/"
      aria-label="stephen diala, home"
      className={`${nameClassName} rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
    >
      {glyphs}
    </Link>
  )
}
