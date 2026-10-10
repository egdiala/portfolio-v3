"use client"

import { type CSSProperties, useMemo, useState } from "react"
import { useTimeScale } from "@/components/playground/time-scale"
import { BusinessHeader } from "./business-header"
import { BusinessList } from "./business-list"
import { BusinessStack } from "./business-stack"
import { MENU_MS } from "./constants"
import { SwitcherTrigger } from "./switcher-trigger"
import type { Business } from "./types"
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu"

/**
 * Melun's switcher for the businesses on one account. The menu opens with the
 * others collapsed into a stack, and the chevron opens them into a list.
 */
export function BusinessSwitcher({
  businesses,
  shareAvatars = true,
  animateHeight = true,
}: Readonly<{
  businesses: Business[]
  /** Give each avatar in the stack its row's layoutId, so it moves into the list. */
  shareAvatars?: boolean
  /** Spring the list to its measured height. Off, it snaps. */
  animateHeight?: boolean
}>) {
  const time = useTimeScale()
  const [expanded, setExpanded] = useState(false)
  const [activeBusiness, setActiveBusiness] = useState(businesses[0])

  const others = useMemo(
    () => businesses.filter((business) => business.name !== activeBusiness?.name),
    [activeBusiness?.name, businesses],
  )

  if (!activeBusiness) return null

  return (
    <ul className="flex w-full min-w-0 flex-col gap-1">
      <li className="relative">
        {/* Not modal, so opening it doesn't lock the article's scroll. */}
        <DropdownMenu modal={false} onOpenChange={(isOpen) => setExpanded(!isOpen)}>
          <SwitcherTrigger business={activeBusiness} />
          <DropdownMenuContent
            className="w-85.5 rounded-[20px] border-0 p-0 inset-ring-1 inset-ring-[#C7C7C7]/32"
            // Radix clears the animation shorthand once the menu is positioned, which drops animationDuration.
            style={{ "--tw-animation-duration": `${time.ms(MENU_MS)}ms` } as CSSProperties}
            align="start"
            alignOffset={8}
            side="bottom"
            sideOffset={4}
          >
            <BusinessHeader business={activeBusiness} />
            <div className="flex flex-col gap-2 rounded-none p-4 shadow-[inset_0_1px_0_var(--color-melun-neutral-200)]">
              <BusinessStack
                others={others}
                expanded={expanded}
                shareAvatars={shareAvatars}
                onToggle={() => setExpanded((current) => !current)}
              />
              <BusinessList
                others={others}
                expanded={expanded}
                shareAvatars={shareAvatars}
                animateHeight={animateHeight}
                onSelect={setActiveBusiness}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  )
}
