"use client"

import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import { BAR_MS } from "../constants"

/** Melun's Progress, without Radix: the indicator slides in from the left, linearly, to each new value. */
export function Progress({ className, value }: Readonly<{ className?: string; value: number }>) {
  const time = useTimeScale()

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label="Upload progress"
      data-slot="progress"
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-melun-neutral-200", className)}
    >
      <div
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full bg-melun-green-500 transition-transform duration-500 ease-linear"
        style={{ transform: `translateX(-${100 - value}%)`, transitionDuration: `${time.ms(BAR_MS)}ms` }}
      />
    </div>
  )
}
