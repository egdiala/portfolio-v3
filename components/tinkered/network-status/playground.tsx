"use client"

import { useState } from "react"
import {
  Playground,
  PlaygroundControls,
  PlaygroundStage,
  SegmentedControl,
  SliderControl,
} from "@/components/playground/playground"
import { NetworkStatus, type NetworkState } from "./network-status"

const STATES = [
  { value: "off", label: "Off" },
  { value: "searching", label: "Searching" },
  { value: "connected", label: "Connected" },
] as const satisfies ReadonlyArray<{ value: NetworkState; label: string }>

function Demo() {
  const [state, setState] = useState<NetworkState>("off")
  const [strength, setStrength] = useState(4)

  return (
    <>
      <PlaygroundStage className="min-h-64">
        <NetworkStatus state={state} strength={strength} className="text-[1.75rem]" />
      </PlaygroundStage>
      <PlaygroundControls>
        <SegmentedControl<NetworkState> label="Network" value={state} options={STATES} onChange={setState} />
        <SliderControl
          label="Signal bars"
          value={strength}
          min={1}
          max={4}
          onChange={setStrength}
        />
      </PlaygroundControls>
    </>
  )
}

export function NetworkStatusPlayground() {
  return (
    <Playground caption="Signal bars only show while connected. Drag the slider to see how weaker coverage looks.">
      <Demo />
    </Playground>
  )
}
