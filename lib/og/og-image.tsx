import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { connection } from "next/server"
import config from "@/lib/off-the-chart/config.json"
import { renderChart, type ChartConfig, type ChartModel } from "@/lib/off-the-chart/render"
import { SITE_NAME } from "@/lib/metadata"

export const OG_SIZE = { width: 1200, height: 630 }

const INK = "#0a0a0a"
const PAPER = "#fafafa"
const MUTED = "#525252"

const ROLE = "Design Engineer"

// The 720 × 440 sheet sits whole against the right edge, centred top to
// bottom. The view runs past it on the other sides, where the rhumb lines keep
// going and the coast's off-sheet lead-in hides under the text column's fade.
const SHEET_LEFT = 430
const SCALE = (OG_SIZE.width - SHEET_LEFT) / 720
const VIEW = {
  x: -SHEET_LEFT / SCALE,
  y: -(OG_SIZE.height / SCALE - 440) / 2,
  width: OG_SIZE.width / SCALE,
  height: OG_SIZE.height / SCALE,
}
// Strokes scale with the view here rather than staying at 1px, so the chart
// keeps its weight once a feed shrinks the card.
const OG_INK = 1.3
const LABEL_SCALE = 1.25

// Literal paths, so output file tracing ships the fonts with the route.
const fonts = Promise.all([
  readFile(join(process.cwd(), "lib/og/fonts/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "lib/og/fonts/Geist-Medium.ttf")),
  readFile(join(process.cwd(), "lib/og/fonts/Asimovian-Regular.ttf")),
]).then(([regular, medium, asimovian]) => [
  { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
  { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
  { name: "Asimovian", data: asimovian, weight: 400 as const, style: "normal" as const },
])

const line = {
  fill: "none",
  stroke: INK,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

function ChartArt({ model }: Readonly<{ model: ChartModel }>) {
  return (
    <svg
      width={OG_SIZE.width}
      height={OG_SIZE.height}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {model.rhumbs.map((tier, i) => (
        <path key={i} d={tier.d} {...line} strokeWidth={0.5} strokeOpacity={tier.opacity} />
      ))}
      <path d={model.rose.d} {...line} strokeWidth={0.75} strokeOpacity={0.5} />
      {model.waterlines.map((waterline, i) => (
        <path key={i} d={waterline.d} {...line} strokeWidth={waterline.width} strokeOpacity={waterline.opacity} />
      ))}
      {model.surveyed.map((d, i) => (
        <path key={i} d={d} {...line} strokeWidth={1.4 * model.ink} />
      ))}
      {model.unsurveyed.map((d, i) => (
        <path key={i} d={d} {...line} strokeWidth={1.1 * model.ink} strokeDasharray="5 5" strokeOpacity={0.75} />
      ))}
      {model.track.map((dot, i) =>
        dot.opacity > 0.02 ? (
          <circle
            key={i}
            cx={dot.x.toFixed(1)}
            cy={dot.y.toFixed(1)}
            r={1.1 * model.ink}
            fill={INK}
            fillOpacity={dot.opacity * 0.9}
          />
        ) : null,
      )}
      <circle cx={model.anchorage.x} cy={model.anchorage.y} r={3} {...line} strokeWidth={1.2 * model.ink} />
    </svg>
  )
}

/** Satori can't draw SVG text, so the chart's labels are set over it instead. */
function ChartLabel({
  x,
  y,
  size,
  opacity,
  spacing,
  children,
}: Readonly<{ x: number; y: number; size: number; opacity: number; spacing: number; children: string }>) {
  const fontSize = size * SCALE * LABEL_SCALE
  return (
    <div
      style={{
        position: "absolute",
        left: (x - VIEW.x) * SCALE - 300,
        top: (y - VIEW.y) * SCALE - fontSize * 0.86,
        width: 600,
        display: "flex",
        justifyContent: "center",
        paddingLeft: fontSize * spacing,
        fontSize,
        lineHeight: 1,
        letterSpacing: `${spacing}em`,
        color: INK,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

function Role({ size }: Readonly<{ size: number }>) {
  return (
    <div style={{ fontSize: size, lineHeight: 1, letterSpacing: "0.22em", color: MUTED }}>{ROLE.toUpperCase()}</div>
  )
}

/**
 * The share card for a page: its title over a sea chart drawn from a fresh
 * seed on every request, the way clicking the chart in the lab redraws it.
 * Leave out `title` on the home page, where the name is the title.
 */
export async function ogImage({ title, eyebrow }: Readonly<{ title?: string; eyebrow?: string }> = {}) {
  await connection()
  const seed = Math.floor(Math.random() * 1_000_000)
  const model = renderChart({ ...(config as ChartConfig), seed, ink: config.ink * OG_INK })

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: PAPER, fontFamily: "Geist" }}>
      <ChartArt model={model} />
      <ChartLabel x={model.rose.x} y={model.rose.y - 23} size={8} opacity={0.5} spacing={0.1}>
        N
      </ChartLabel>
      {model.labels.map((label) => (
        <ChartLabel key={label.text} x={label.x} y={label.y} size={label.size} opacity={label.opacity} spacing={0.22}>
          {label.text}
        </ChartLabel>
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          backgroundImage: `linear-gradient(90deg, ${PAPER} 0px, ${PAPER} ${SHEET_LEFT - 50}px, rgba(250, 250, 250, 0) ${SHEET_LEFT + 50}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: title ? "space-between" : "flex-end",
          padding: "64px 72px",
        }}
      >
        {title ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: "Asimovian", fontSize: 40, lineHeight: 1, color: INK }}>{SITE_NAME}</div>
            <Role size={17} />
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: SHEET_LEFT - 72 }}>
          {eyebrow ? <div style={{ fontSize: 26, lineHeight: 1.2, color: MUTED }}>{eyebrow}</div> : null}
          {title ? (
            <div style={{ fontSize: 60, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.025em", color: INK }}>
              {title}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ fontFamily: "Asimovian", fontSize: 92, lineHeight: 0.95, color: INK }}>{SITE_NAME}</div>
              <Role size={24} />
            </div>
          )}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts },
  )
}
