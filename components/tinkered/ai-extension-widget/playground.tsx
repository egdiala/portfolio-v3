"use client"

import { useState } from "react"
import {
  Playground,
  PlaygroundControls,
  PlaygroundStage,
  ToggleControl,
} from "@/components/playground/playground"
import { ListingWidget } from "./widget"

function Demo() {
  const [shared, setShared] = useState(true)

  return (
    <>
      <PlaygroundStage className="min-h-[39rem] bg-neutral-100 py-6">
        {/* layoutIds are registered on mount, so switching them remounts the widget. */}
        <ListingWidget key={String(shared)} shared={shared} />
      </PlaygroundStage>
      <PlaygroundControls>
        <ToggleControl label="Shared elements" checked={shared} onChange={setShared} />
      </PlaygroundControls>
    </>
  )
}

export function AiExtensionWidgetPlayground() {
  return (
    <Playground caption="Tap the pill to open the assistant, then accept or dismiss each recommendation. Press Escape or tap anywhere else on the stage to close it.">
      <Demo />
    </Playground>
  )
}
