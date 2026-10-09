"use client"

import { Fragment, useMemo, useState, type ReactNode } from "react"
import { MotionConfig } from "motion/react"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlaygroundContext } from "./context"
import { SPEEDS } from "./constants"
import { usePlayground } from "./hooks/use-playground"
import { SegmentedControl } from "./segmented-control"
import { TimeScaleContext } from "./time-scale"

export { SegmentedControl } from "./segmented-control"
export { SliderControl } from "./slider-control"
export { ToggleControl } from "./toggle-control"

/**
 * Frame for an interactive demo. The demo renders a PlaygroundStage and a
 * PlaygroundControls inside it. Resetting remounts the demo, so any state it
 * owns returns to its defaults; the playback speed is kept.
 */
export function Playground({
  children,
  caption,
}: Readonly<{ children: ReactNode; caption?: ReactNode }>) {
  const [rate, setRate] = useState(1)
  const [version, setVersion] = useState(0)

  const value = useMemo(() => ({ rate, setRate }), [rate])

  return (
    <figure className="my-10 @min-[52rem]/page:-mx-16">
      <div className="relative overflow-hidden rounded-2xl border bg-white">
        <button
          type="button"
          onClick={() => setVersion((current) => current + 1)}
          className="absolute top-2 right-2 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-[color,background-color,scale] duration-150 ease-out outline-none hover:bg-neutral-100 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.96]"
        >
          <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.75} />
          <span className="sr-only">Reset demo</span>
        </button>
        <PlaygroundContext value={value}>
          <TimeScaleContext value={rate}>
            <Fragment key={version}>{children}</Fragment>
          </TimeScaleContext>
        </PlaygroundContext>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-snug text-pretty text-neutral-600 @min-[52rem]/page:px-16">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function PlaygroundStage({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div
      data-playground-stage=""
      className={cn(
        "relative isolate grid min-h-80 items-center justify-items-center overflow-hidden px-4 py-16",
        className,
      )}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </div>
  )
}

export function PlaygroundControls({ children }: Readonly<{ children: ReactNode }>) {
  const { rate, setRate } = usePlayground()

  return (
    <div className="divide-y divide-border border-t bg-neutral-50 px-4">
      {children}
      <SegmentedControl label="Speed" value={rate} options={SPEEDS} onChange={setRate} />
    </div>
  )
}
