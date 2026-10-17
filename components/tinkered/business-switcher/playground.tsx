"use client"

import { useState } from "react"
import { Playground, PlaygroundControls, PlaygroundStage, ToggleControl } from "@/components/playground/playground"
import { BusinessSwitcher } from "./business-switcher"
import { BUSINESSES } from "./constants"

function Demo() {
  const [shareAvatars, setShareAvatars] = useState(true)
  const [animateHeight, setAnimateHeight] = useState(true)

  return (
    <>
      <PlaygroundStage className="min-h-[28rem] items-start bg-neutral-100 pt-10">
        {/* As wide as the menu, so the open menu sits in the middle of the stage. */}
        <div className="w-85.5 max-w-full">
          <div className="w-60">
            <BusinessSwitcher businesses={BUSINESSES} shareAvatars={shareAvatars} animateHeight={animateHeight} />
          </div>
        </div>
      </PlaygroundStage>
      <PlaygroundControls>
        <ToggleControl label="Move avatars into the list" checked={shareAvatars} onChange={setShareAvatars} />
        <ToggleControl label="Animate the height" checked={animateHeight} onChange={setAnimateHeight} />
      </PlaygroundControls>
    </>
  )
}

export function BusinessSwitcherPlayground() {
  return (
    <Playground caption="Tap the business at the top to open the menu, then tap the chevron to open the other businesses into a list. Pick one to switch to it. Hover the stack of avatars to see whose they are.">
      <Demo />
    </Playground>
  )
}
