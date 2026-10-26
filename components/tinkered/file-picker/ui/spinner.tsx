"use client"

import type { CSSProperties } from "react"
import { Loader } from "lucide-react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import { LOADER_MS } from "../constants"

/**
 * Melun's Spinner2. It doesn't rotate: `.melun-loader` in globals.css fades the spokes in turn.
 * Hidden from screen readers, since the row's live region already says the file is uploading.
 */
export function Spinner2({ className }: Readonly<{ className?: string }>) {
  const time = useTimeScale()

  return (
    <Loader
      aria-hidden="true"
      style={{ "--melun-loader-ms": `${time.ms(LOADER_MS)}ms` } as CSSProperties}
      className={cn("melun-loader size-4 text-melun-neutral-999", className)}
    />
  )
}
