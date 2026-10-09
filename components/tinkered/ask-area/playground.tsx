"use client"

import { useState } from "react"
import {
  Playground,
  PlaygroundControls,
  PlaygroundStage,
  SegmentedControl,
} from "@/components/playground/playground"
import { Orbit } from "./orbit"
import type { OrbitState, OrbitView } from "./types"

type View = OrbitView | "closed"

const VIEWS = [
  { value: "closed", label: "Closed" },
  { value: "orbit-menu", label: "Menu" },
  { value: "ask-area", label: "Ask Area" },
] as const satisfies ReadonlyArray<{ value: View; label: string }>

function Demo() {
  const [state, setState] = useState<OrbitState>({ isOpen: false, view: "orbit-menu", prevView: "orbit-menu" })
  const current: View = state.isOpen ? state.view : "closed"

  // Each view starts from wherever the container is now, as it would if you had tapped your way there.
  const show = (next: View) => {
    if (next === current) return
    if (next === "closed") {
      setState({ isOpen: false, view: "orbit-menu", prevView: "orbit-menu" })
      return
    }
    // The app only reaches the chat through the menu. Opened cold, it grows from nothing instead.
    const fromClosed = next === "ask-area" ? "closed" : "orbit-menu"
    setState({ isOpen: true, view: next, prevView: state.isOpen ? state.view : fromClosed })
  }

  return (
    <>
      <PlaygroundStage className="min-h-[33rem] items-stretch justify-items-stretch p-0">
        <Orbit state={state} onChange={setState} />
      </PlaygroundStage>
      <PlaygroundControls>
        <SegmentedControl<View> label="View" value={current} options={VIEWS} onChange={show} />
      </PlaygroundControls>
    </>
  )
}

export function AskAreaPlayground() {
  return (
    <Playground caption="Tap the orb, then Ask Area, and ask it something about Area. The answers are written by an AI model from a copy of Area's docs. Press Escape or tap anywhere else on the stage to close it.">
      <Demo />
    </Playground>
  )
}
