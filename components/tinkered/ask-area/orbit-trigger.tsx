"use client"

import type { CSSProperties, Ref } from "react"
import { cn } from "@/lib/utils"
import { focusRing } from "./constants"

/** Three dots that fade in turn. The orb uses them, and so does a reply while it loads. */
export function OrbitDots({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("area-orbit mx-auto flex items-center justify-center gap-[0.156rem]", className)}>
      {[2, 1, 0].map((index) => (
        <div
          key={index}
          className="size-[0.188rem] rounded-full ease-in-out"
          style={{ "--orbit-dot-index": index } as CSSProperties}
        />
      ))}
    </div>
  )
}

export function OrbitTrigger({
  ref,
  isOpen,
  onToggle,
}: Readonly<{ ref?: Ref<HTMLButtonElement>; isOpen: boolean; onToggle: () => void }>) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Area menu"
      aria-expanded={isOpen}
      onClick={onToggle}
      className={cn(
        "relative isolate grid size-[2.563rem] cursor-pointer place-content-center rounded-full focus-visible:outline-offset-2",
        focusRing,
      )}
    >
      {/* Blurred ellipses */}
      <div className="absolute top-[-3px] left-[5px] h-8 w-8 animate-pulse rounded-full bg-[#CAEFD7] blur-[7.5px]" />
      <div className="absolute top-[8px] left-[-2px] h-8 w-8 animate-pulse rounded-full bg-[#F5BFD7] blur-[7.5px]" />
      <div className="absolute top-[9px] left-[11px] h-8 w-8 animate-pulse rounded-full bg-[#ABC9E9] blur-[7.5px]" />

      <div className="relative grid size-10 place-content-center overflow-hidden rounded-full">
        {/* Outer multicolor blurred ellipses */}
        <div className="absolute top-[-10px] left-[1px] h-10 w-10 rounded-full bg-[#CAEFD7] blur-[1.5px]" />
        <div className="absolute top-[4px] left-[-1px] h-10 w-10 rounded-full bg-[#F5BFD7] blur-[1.5px]" />
        <div className="absolute top-[13px] left-[14px] h-10 w-10 rounded-full bg-[#ABC9E9] blur-[1.5px]" />

        {/* Transparent circle that picks up the background blur as border */}
        <div className="absolute inset-0 z-10 rounded-full border border-transparent bg-transparent" />

        <div className="area-outer-orbit relative isolate grid size-[2.375rem] place-content-center rounded-full">
          <OrbitDots />
        </div>
      </div>
    </button>
  )
}
