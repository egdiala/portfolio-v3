"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { Chart } from "@/components/off-the-chart/chart"
import { ELSEWHERE, EMAIL } from "@/lib/contact"
import config from "@/lib/off-the-chart/config.json"
import { renderChart, type ChartConfig } from "@/lib/off-the-chart/render"
import type { Where } from "@/lib/where"

const WIDTH = 720
const HEIGHT = 440
/** On-screen radius of a course dot, in CSS px, whatever size the chart is drawn at. */
const DOT_PX = 1.15
const COPIED_MS = 1600

const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

// Spots in open water on the 404's chart (seed 83989), in its 720 × 440 units: clear of the
// compass rose at (362, 132) and above the coast, which runs low across the sheet.
const PORTS: Record<string, { x: number; y: number }> = {
  e: { x: 560, y: 110 },
  x: { x: 215, y: 105 },
  g: { x: 612, y: 255 },
  l: { x: 390, y: 245 },
}

/** Dots along a gentle arc from the anchorage to a port, spaced like the 404's track. */
function course(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  // Bowed toward the top of the sheet, so a course never crosses the coast below.
  const control = { x: from.x + dx / 2 + dy * 0.18, y: from.y + dy / 2 - Math.abs(dx) * 0.18 }
  const count = Math.max(6, Math.round(length / 11))
  return Array.from({ length: count - 1 }, (_, index) => {
    const t = (index + 1) / count
    const u = 1 - t
    return {
      x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
      y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
    }
  })
}

function useCopy(text: string) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")

  useEffect(() => {
    if (state === "idle") return
    const id = setTimeout(() => setState("idle"), COPIED_MS)
    return () => clearTimeout(id)
  }, [state])

  const copy = () => {
    if (!navigator.clipboard) {
      setState("failed")
      return
    }
    navigator.clipboard.writeText(text).then(
      () => setState("copied"),
      () => setState("failed"),
    )
  }

  return { copied: state === "copied", failed: state === "failed", copy }
}

/** The site's sea chart, with each way to reach me as a port. Hovering or focusing one plots a course to it. */
export function ContactChart({ where }: Readonly<{ where: Where }>) {
  const model = useMemo(() => ({ ...renderChart(config as ChartConfig), labels: [], track: [] }), [])
  const [active, setActive] = useState<string | null>(null)
  const [dotRadius, setDotRadius] = useState(1.3)
  const sheetRef = useRef<HTMLDivElement>(null)
  const { copied, failed, copy } = useCopy(EMAIL)
  // A tap has no hover to hold the course open, so the email course stays up while "Copied" shows.
  const plotted = active ?? (copied ? "e" : null)

  // The chart scales with its column, so a dot sized in chart units would shrink to nothing on a phone.
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setDotRadius((DOT_PX * WIDTH) / entry.contentRect.width)
    })
    observer.observe(sheet)
    return () => observer.disconnect()
  }, [])

  const courses = useMemo(
    () => Object.fromEntries(Object.entries(PORTS).map(([key, port]) => [key, course(model.anchorage, port)])),
    [model.anchorage],
  )

  const ports = [
    { key: "e", label: copied ? "Copied" : "Email", onClick: copy },
    ...ELSEWHERE.map((place) => ({ key: place.key, label: place.label, href: place.href })),
  ]

  const portProps = (key: string) => ({
    onPointerEnter: () => setActive(key),
    onPointerLeave: () => setActive((current) => (current === key ? null : current)),
    onFocus: () => setActive(key),
    onBlur: () => setActive((current) => (current === key ? null : current)),
    style: { left: `${(PORTS[key].x / WIDTH) * 100}%`, top: `${(PORTS[key].y / HEIGHT) * 100}%` },
    className: `group/port absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-md px-2 ${focusRing}`,
  })

  const portFace = (label: string) => (
    <>
      <span
        aria-hidden="true"
        className="size-2.5 rounded-full border-[1.5px] border-foreground bg-white transition-transform duration-150 ease-out group-hover/port:scale-125 group-focus-visible/port:scale-125 motion-reduce:transition-none"
      />
      <span className="mt-1.5 text-[0.6875rem] leading-none font-medium tracking-[0.22em] text-foreground uppercase transition-transform duration-200 ease-out group-hover/port:-translate-y-0.5 group-focus-visible/port:-translate-y-0.5 motion-reduce:transition-none">
        {label}
      </span>
    </>
  )

  return (
    <div ref={sheetRef} className="relative overflow-hidden rounded-2xl border bg-white">
      <Chart model={model} />

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-foreground">
        {Object.entries(courses).map(([key, dots]) =>
          dots.map((dot, index) => (
            <circle
              key={`${key}-${index}`}
              cx={dot.x.toFixed(1)}
              cy={dot.y.toFixed(1)}
              r={dotRadius}
              fill="currentColor"
              className="transition-opacity ease-out motion-reduce:transition-none"
              style={
                {
                  opacity: plotted === key ? 0.85 : 0,
                  transitionDuration: plotted === key ? "180ms" : "120ms",
                  transitionDelay: plotted === key ? `${index * 12}ms` : "0ms",
                } as CSSProperties
              }
            />
          )),
        )}
      </svg>

      {/* HTML, not SVG text, so it stays readable when the chart shrinks. It sits beside the
          anchorage, which is near the left edge, so a centred label would be cut off. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute max-w-[45%] translate-x-2.5 -translate-y-1/2 truncate text-[0.625rem] leading-none tracking-[0.22em] text-foreground/70 uppercase"
        style={{ left: `${(model.anchorage.x / WIDTH) * 100}%`, top: `${(model.anchorage.y / HEIGHT) * 100}%` }}
      >
        {where.label}
      </span>

      <ul aria-label="Ways to reach me" className="absolute inset-0">
        {ports.map((port) => (
          <li key={port.key}>
            {"href" in port ? (
              <a href={port.href} target="_blank" rel="noopener noreferrer" {...portProps(port.key)}>
                {portFace(port.label)}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <button type="button" onClick={port.onClick} aria-label={`Copy email address, ${EMAIL}`} {...portProps(port.key)}>
                {portFace(port.label)}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Always rendered, so the region exists before it has anything to say. */}
      <p role="status" className="sr-only">
        {copied ? "Email address copied" : failed ? `Couldn’t copy. My address is ${EMAIL}.` : ""}
      </p>
    </div>
  )
}
