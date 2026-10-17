"use client"

import { useState } from "react"
import {
  Playground,
  PlaygroundControls,
  PlaygroundStage,
  SegmentedControl,
  ToggleControl,
} from "@/components/playground/playground"
import { LlmOverlay } from "./overlay"
import type { OverlayMode } from "./types"

const STATUSES = [
  { value: "syncing", label: "Syncing" },
  { value: "ready", label: "Ready" },
  { value: "attached", label: "Attached" },
] as const satisfies ReadonlyArray<{ value: OverlayMode; label: string }>

function Demo() {
  // A status picked here is held. One the overlay reaches by itself settles back to ready.
  const [status, setStatus] = useState<{ mode: OverlayMode; held: boolean }>({ mode: "syncing", held: false })
  const [morph, setMorph] = useState(true)
  const [grow, setGrow] = useState(true)

  return (
    <>
      <PlaygroundStage className="min-h-[33rem] items-end bg-mmb-background-dark pt-6 pb-10">
        <LlmOverlay
          mode={status.mode}
          held={status.held}
          onModeChange={(mode) => setStatus({ mode, held: false })}
          morph={morph}
          grow={grow}
        />
      </PlaygroundStage>
      <PlaygroundControls>
        <SegmentedControl<OverlayMode>
          label="Status"
          value={status.mode}
          options={STATUSES}
          onChange={(mode) => setStatus({ mode, held: true })}
        />
        <ToggleControl label="Morph text" checked={morph} onChange={setMorph} />
        <ToggleControl label="Grow from the pill" checked={grow} onChange={setGrow} />
      </PlaygroundControls>
    </>
  )
}

export function MemorybaseLlmOverlayPlayground() {
  return (
    <Playground caption="Once memory is ready, tap the pill and attach a memory. Close the popup and press send to move it into the conversation. Press Escape or tap anywhere else on the stage to close the popup.">
      <Demo />
    </Playground>
  )
}
