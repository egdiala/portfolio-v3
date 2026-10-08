"use client"

import { useId } from "react"
import { ControlRow } from "./control-row"
import { labelClassName } from "./constants"
import type { ToggleControlProps } from "./types"

export function ToggleControl({ label, checked, onChange }: Readonly<ToggleControlProps>) {
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
