"use client"

import { useState } from "react"
import {
  Playground,
  PlaygroundControls,
  PlaygroundStage,
  SegmentedControl,
  ToggleControl,
} from "@/components/playground/playground"
import { DynamicIsland, type IslandView } from "./dynamic-island"

type BouncePreset = "tuned" | "none" | "uniform"

const VIEWS = [
  { value: "idle", label: "Idle" },
  { value: "ring", label: "Ring" },
  { value: "music", label: "Music" },
] as const satisfies ReadonlyArray<{ value: IslandView; label: string }>

const BOUNCES = [
  { value: "tuned", label: "Tuned" },
  { value: "none", label: "None" },
  { value: "uniform", label: "0.5" },
] as const satisfies ReadonlyArray<{ value: BouncePreset; label: string }>

const BOUNCE_VALUE: Record<BouncePreset, number | undefined> = {
  tuned: undefined,
  none: 0,
  uniform: 0.5,
}

function Demo() {
  const [view, setView] = useState<IslandView>("idle")
  const [bounce, setBounce] = useState<BouncePreset>("tuned")
  const [blur, setBlur] = useState(true)

  return (
    <>
      <PlaygroundStage className="items-start pt-14">
        <DynamicIsland view={view} bounce={BOUNCE_VALUE[bounce]} blur={blur} />
      </PlaygroundStage>
      <PlaygroundControls>
        <SegmentedControl<IslandView> label="State" value={view} options={VIEWS} onChange={setView} />
        <SegmentedControl<BouncePreset> label="Bounce" value={bounce} options={BOUNCES} onChange={setBounce} />
        <ToggleControl label="Blur content in" checked={blur} onChange={setBlur} />
      </PlaygroundControls>
    </>
  )
}

export function DynamicIslandPlayground() {
  return (
    <Playground caption="In Music, tap the island to open the player. Press Escape or tap anywhere else on the stage to close it.">
      <Demo />
    </Playground>
  )
}
