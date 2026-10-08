"use client"

import {
  createContext,
  Fragment,
  useContext,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { MotionConfig } from "motion/react"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { TimeScaleContext } from "./time-scale"

const SPEEDS = [
  { value: 1, label: "1×" },
  { value: 0.5, label: "0.5×" },
  { value: 0.1, label: "0.1×" },
] as const

type PlaygroundContextValue = {
  rate: number
  setRate: (rate: number) => void
}

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null)

function usePlayground() {
  const context = useContext(PlaygroundContext)
  if (!context) throw new Error("Playground parts must render inside <Playground>.")
  return context
}

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

function ControlRow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
      {children}
    </div>
  )
}

const labelClassName = "text-sm text-neutral-600"

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: Readonly<{
  label: string
  value: T
  options: ReadonlyArray<{ value: T; label: string }>
  onChange: (value: T) => void
}>) {
  const id = useId()
  const anchor = { "--segment-anchor": `--segment-${id.replace(/[^\w-]/g, "")}` } as CSSProperties

  return (
    <ControlRow>
      <span id={`${id}-label`} className={labelClassName}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        style={anchor}
        className={cn(
          "relative isolate flex rounded-full bg-neutral-200/70 p-0.5",
          "anchored:before:absolute anchored:before:-z-10 anchored:before:rounded-full anchored:before:bg-white anchored:before:shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_oklch(0_0_0/0.08)]",
          "anchored:before:[position-anchor:var(--segment-anchor)] anchored:before:[top:anchor(top)] anchored:before:[left:anchor(left)] anchored:before:[width:anchor-size(width)] anchored:before:[height:anchor-size(height)]",
          "anchored:before:transition-[top,left,width,height] anchored:before:duration-200 anchored:before:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:before:transition-none",
        )}
      >
        {options.map((option) => (
          <label key={String(option.value)} className="-my-0.5 cursor-pointer py-0.5">
            <input
              type="radio"
              name={id}
              value={String(option.value)}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="flex h-10 min-w-11 items-center justify-center rounded-full px-3.5 text-sm text-neutral-600 tabular-nums transition-colors duration-150 ease-out peer-checked:text-foreground peer-checked:[anchor-name:var(--segment-anchor)] unanchored:peer-checked:bg-white unanchored:peer-checked:shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_oklch(0_0_0/0.08)] peer-focus-visible:ring-[3px] peer-focus-visible:ring-foreground peer-focus-visible:ring-offset-1 hover:text-foreground">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </ControlRow>
  )
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = String,
}: Readonly<{
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
}>) {
  const id = useId()

  return (
    <ControlRow>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-11 w-36 cursor-pointer accent-foreground outline-none focus-visible:rounded-full focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50"
        />
        <output htmlFor={id} className="w-8 text-end text-sm text-foreground tabular-nums">
          {format(value)}
        </output>
      </div>
    </ControlRow>
  )
}

export function ToggleControl({
  label,
  checked,
  onChange,
}: Readonly<{
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}>) {
  const id = useId()

  return (
    <ControlRow>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <span className="relative inline-flex size-11 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className="flex h-6 w-10 items-center rounded-full bg-neutral-300 p-0.5 transition-colors duration-150 ease-out peer-checked:bg-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-foreground peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-neutral-50 peer-checked:[&>span]:translate-x-4"
        >
          <span className="size-5 rounded-full bg-white shadow-[0_1px_2px_oklch(0_0_0/0.2)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none" />
        </span>
      </span>
    </ControlRow>
  )
}
