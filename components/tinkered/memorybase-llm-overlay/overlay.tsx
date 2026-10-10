"use client"

import { Mic, Plus, Send } from "lucide-react"
import { useWidth } from "@/components/tinkered/dynamic-island/hooks/use-width"
import { cn } from "@/lib/utils"
import { focusRing, pressable } from "./constants"
import { OverlayContext, useOverlay, useOverlayState } from "./hooks/use-overlay"
import { OverlayPill } from "./overlay-pill"
import { OverlayPopup } from "./overlay-popup"
import type { OverlayMode } from "./types"

/** A stand-in for the host chat's input. Only send does anything. */
function ChatBox() {
  const { send } = useOverlayState()

  return (
    <div className="flex h-14 w-full items-center rounded-full border border-mmb-contrast-lower bg-mmb-background-light px-2">
      <span aria-hidden="true" className="grid size-9 shrink-0 place-content-center text-mmb-contrast-high">
        <Plus className="size-4" />
      </span>
      <span aria-hidden="true" className="min-w-0 flex-1 truncate px-1.5 text-[0.9375rem] text-mmb-contrast-low">
        Ask anything
      </span>
      <span aria-hidden="true" className="grid size-9 shrink-0 place-content-center text-mmb-contrast-high">
        <Mic className="size-4" />
      </span>
      <button
        type="button"
        aria-label="Send message"
        onClick={send}
        className={cn(
          "ml-1 grid size-9 shrink-0 cursor-pointer place-content-center rounded-full bg-mmb-secondary text-white",
          pressable,
          focusRing,
        )}
      >
        <Send aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

/**
 * The pill MemoryBase adds under a chat's input, and the popup it opens.
 * Attached memories wait for the next message; sending moves them into the conversation.
 */
export function LlmOverlay({
  mode,
  held = false,
  onModeChange,
  morph = true,
  grow = true,
}: Readonly<{
  mode: OverlayMode
  /** Keep syncing or attached on screen instead of letting it settle to ready. */
  held?: boolean
  onModeChange: (mode: OverlayMode) => void
  /** Morph the changing text instead of swapping it. */
  morph?: boolean
  /** Open the popup by growing it from the pill. Off, it only fades in. */
  grow?: boolean
}>) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const overlay = useOverlay({ mode, held, onModeChange, morph, grow, width })
  const { anchorRef } = overlay

  return (
    <OverlayContext value={overlay}>
      <div ref={ref} className="flex w-full max-w-lg flex-col items-center gap-8">
        <ChatBox />
        <div ref={anchorRef} className="relative flex justify-center">
          <OverlayPopup />
          <OverlayPill />
        </div>
        <p role="status" className="sr-only">
          {overlay.announcement}
        </p>
      </div>
    </OverlayContext>
  )
}
