"use client"

import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"
import { MORPH_MS, focusRing, pressable, trim } from "./constants"
import { useOverlayState } from "./hooks/use-overlay"
import { LogoIcon } from "./icons"
import { StatusDot } from "./status-dot"
import type { OverlayMode } from "./types"

const WORDS: Record<OverlayMode, string> = {
  syncing: "syncing...",
  ready: "ready",
  attached: "attached",
}

export function OverlayPill() {
  const { pillRef, mode, open, toggle, morph, ms } = useOverlayState()
  const word = WORDS[mode]

  return (
    <button
      ref={pillRef}
      type="button"
      aria-label={`Memory is ${word}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      // Stays focusable while syncing, so keyboard focus isn't dropped when the state changes.
      aria-disabled={mode === "syncing"}
      onClick={toggle}
      className={cn(
        "relative flex h-6.5 cursor-pointer items-center gap-1.5 rounded-full bg-mmb-background/7 pr-3 pl-2 after:absolute after:inset-x-0 after:-inset-y-2.5 aria-disabled:cursor-default aria-disabled:active:scale-100",
        pressable,
        focusRing,
        "focus-visible:ring-offset-mmb-background-dark",
      )}
    >
      <span className="relative text-mmb-contrast-high">
        <StatusDot />
        <LogoIcon className="size-5" />
      </span>
      <span className={cn("text-mmb-xs font-medium text-mmb-content select-none", trim)}>
        Memory is{" "}
        <TextMorph duration={ms(MORPH_MS)} disabled={!morph}>
          {word}
        </TextMorph>
      </span>
    </button>
  )
}
