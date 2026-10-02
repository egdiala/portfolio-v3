"use client"

import { useLayoutEffect, useRef, useState } from "react"
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

type Side = "start" | "end" | "keep" | "gap"

type Glyph = {
  char: string
  keep: boolean
  side: Side
}

function sideFor(index: number, keepIndex: number): Side {
  if (index < keepIndex) return "start"
  if (index > keepIndex) return "end"
  return "keep"
}

function word(text: string, keepIndex: number): Glyph[] {
  return [...text].map((char, index) => ({
    char,
    keep: index === keepIndex,
    side: sideFor(index, keepIndex),
  }))
}

// "stephen" keeps its p. "diala" keeps its d. The space between them closes too.
const GLYPHS: Glyph[] = [
  ...word("stephen", 3),
  { char: "\u00A0", keep: false, side: "gap" },
  ...word("diala", 0),
]

const ALIGN: Record<Side, string> = {
  start: "justify-end",
  end: "justify-start",
  keep: "justify-center",
  gap: "justify-start",
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
    return glyph.keep ? full : full * (1 - value)
  })
  const opacity = useTransform(progress, (value) => {
    if (glyph.keep) return 1
    return Math.max(0, 1 - value / 0.45)
  })
  const blur = useTransform(progress, (value) =>
    glyph.keep ? 0 : Math.min(4, (value / 0.45) * 4),
  )
  const filter = useMotionTemplate`blur(${blur}px)`

  return (
    <motion.span
      aria-hidden="true"
      className={`inline-flex min-w-0 overflow-hidden ${ALIGN[glyph.side]}`}
      style={fullWidth == null ? undefined : { width, opacity }}
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

  return (
    <h1
      aria-label="stephen diala"
      className="inline-flex shrink-0 items-baseline font-asimovian text-2xl leading-none font-bold"
    >
      {GLYPHS.map((glyph, index) => (
        <GlyphSlot
          key={`${glyph.side}-${index}`}
          glyph={glyph}
          progress={progress}
          fullWidth={widths[index]}
          measureRef={(node) => {
            glyphRefs.current[index] = node
          }}
        />
      ))}
    </h1>
  )
}
