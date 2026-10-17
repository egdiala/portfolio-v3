import type { CSSProperties } from "react"
import type { ChartModel } from "@/lib/off-the-chart/render"
import { cn } from "@/lib/utils"

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const

export function Chart({
  model,
  animated = false,
  className,
}: Readonly<{ model: ChartModel; animated?: boolean; className?: string }>) {
  return (
    <svg
      viewBox={`0 0 ${model.width} ${model.height}`}
      aria-hidden="true"
      className={cn("block h-auto w-full font-sans text-foreground", className)}
    >
      {model.rhumbs.map((tier, i) => (
        <path key={i} d={tier.d} {...line} strokeWidth={0.5} strokeOpacity={tier.opacity} />
      ))}
      <path d={model.rose.d} {...line} strokeWidth={0.75} strokeOpacity={0.5} />
      <text
        x={model.rose.x}
        y={model.rose.y - 23}
        textAnchor="middle"
        fontSize={8}
        letterSpacing="0.1em"
        fill="currentColor"
        fillOpacity={0.5}
      >
        N
      </text>

      {model.waterlines.map((waterline, i) => (
        <path key={i} d={waterline.d} {...line} strokeWidth={waterline.width} strokeOpacity={waterline.opacity} />
      ))}
      {model.surveyed.map((d, i) => (
        <path key={i} d={d} {...line} strokeWidth={1.4 * model.ink} />
      ))}
      {model.unsurveyed.map((d, i) => (
        <path key={i} d={d} {...line} strokeWidth={1.1 * model.ink} strokeDasharray="5 5" strokeOpacity={0.75} />
      ))}

      <g className={cn(animated && "chart-track")}>
        {model.track.map((dot, i) =>
          dot.opacity > 0.02 ? (
            <circle
              key={i}
              cx={dot.x.toFixed(1)}
              cy={dot.y.toFixed(1)}
              r={1.1 * model.ink}
              fill="currentColor"
              fillOpacity={dot.opacity * 0.9}
              style={{ "--i": i } as CSSProperties}
            />
          ) : null,
        )}
      </g>
      <circle cx={model.anchorage.x} cy={model.anchorage.y} r={3} {...line} strokeWidth={1.2 * model.ink} />

      {model.labels.map((label) => (
        <text
          key={label.text}
          x={label.x.toFixed(1)}
          y={label.y.toFixed(1)}
          textAnchor="middle"
          fontSize={label.size}
          letterSpacing="0.22em"
          fill="currentColor"
          fillOpacity={label.opacity}
        >
          {label.text}
        </text>
      ))}
    </svg>
  )
}
