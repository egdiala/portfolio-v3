"use client"

import { useId } from "react"
import { ControlRow } from "./control-row"
import { labelClassName } from "./constants"
import type { SliderControlProps } from "./types"

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = String,
}: Readonly<SliderControlProps>) {
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
