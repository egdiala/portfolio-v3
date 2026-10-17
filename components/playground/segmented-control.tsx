"use client"

import { useId, type CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { ControlRow } from "./control-row"
import { labelClassName } from "./constants"
import type { SegmentedControlProps } from "./types"

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: Readonly<SegmentedControlProps<T>>) {
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
