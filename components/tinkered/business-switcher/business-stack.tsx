"use client"

import { AnimatePresence, motion } from "motion/react"
import { PlusIcon } from "lucide-react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import { BusinessAvatar } from "./business-avatar"
import {
  CHEVRON_MS,
  addButtonSwap,
  defaultFade,
  defaultLayout,
  defaultScale,
  overflowSwap,
  tooltipSpring,
} from "./constants"
import { IconChevronUp } from "./icons"
import type { Business } from "./types"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { GlobalTooltipProvider } from "./ui/global-tooltip/provider"
import { GlobalTooltip, GlobalTooltipContent, GlobalTooltipTrigger } from "./ui/global-tooltip/tooltip"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

/** The label, the other businesses as a stack of avatars, and the chevron that opens them into a list. */
export function BusinessStack({
  others,
  expanded,
  shareAvatars,
  onToggle,
}: Readonly<{
  others: Business[]
  expanded: boolean
  shareAvatars: boolean
  onToggle: () => void
}>) {
  const time = useTimeScale()
  const swap = time.transition({ opacity: defaultFade, filter: defaultFade, scale: defaultScale })
  const layout = time.transition(defaultLayout)

  return (
    <div className="relative flex items-center justify-between">
      <span className="text-xs leading-6 font-semibold tracking-wide text-melun-neutral-950 uppercase">Switch business</span>
      <div className="absolute right-0 flex items-center justify-end">
        <div className="flex items-center -space-x-2">
          <GlobalTooltipProvider transition={time.transition(tooltipSpring)}>
            {others.map((business) => (
              <GlobalTooltip key={business.name}>
                <GlobalTooltipTrigger>
                  <motion.div layoutId={shareAvatars ? `${business.name}-avatar` : undefined} transition={layout}>
                    <BusinessAvatar business={business} className="size-6" />
                  </motion.div>
                </GlobalTooltipTrigger>
                <GlobalTooltipContent>{business.name}</GlobalTooltipContent>
              </GlobalTooltip>
            ))}
          </GlobalTooltipProvider>
          {/* Sized by expanded, not by the child still exiting, so the avatars' new spot is known when Motion measures them. */}
          <div className={cn("flex justify-end", expanded ? "w-8" : "w-6")}>
            <AnimatePresence mode="wait" initial={false}>
              {expanded ? (
                <motion.div key="add-business-button" {...addButtonSwap} transition={swap}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon-sm" type="button" aria-label="Add new business">
                        <PlusIcon className="text-melun-neutral-800" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end">
                      Add new business
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ) : (
                <motion.div key="business-avatar-rows" className="flex -space-x-2" {...overflowSwap} transition={swap}>
                  <Avatar className="size-6 ring-1 ring-melun-background">
                    <AvatarFallback>+4</AvatarFallback>
                  </Avatar>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          aria-label="Show businesses"
          aria-expanded={expanded}
          onClick={onToggle}
        >
          <IconChevronUp
            className={cn(
              "text-melun-neutral-800 transition-transform ease-out motion-reduce:transition-none",
              expanded ? "rotate-0" : "rotate-180",
            )}
            style={{ transitionDuration: `${time.ms(CHEVRON_MS)}ms` }}
          />
        </Button>
      </div>
    </div>
  )
}
