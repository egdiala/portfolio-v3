"use client"

import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react"
import useMeasure from "react-use-measure"
import { useTimeScale } from "@/components/playground/time-scale"
import { BusinessAvatar } from "./business-avatar"
import { defaultLayout, heightSpring } from "./constants"
import type { Business } from "./types"
import { DropdownMenuItem } from "./ui/dropdown-menu"

/** The other businesses as rows. The wrapper springs to the height the rows measure, or to nothing. */
export function BusinessList({
  others,
  expanded,
  shareAvatars,
  animateHeight,
  onSelect,
}: Readonly<{
  others: Business[]
  expanded: boolean
  shareAvatars: boolean
  animateHeight: boolean
  onSelect: (business: Business) => void
}>) {
  const [ref, bounds] = useMeasure()
  const time = useTimeScale()
  const reduceMotion = useReducedMotionConfig()
  const spring = time.transition(heightSpring)
  const layout = time.transition(defaultLayout)

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: expanded ? bounds.height : 0, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      // Height isn't a transform, so MotionConfig's reduced motion leaves it animating.
      transition={animateHeight && !reduceMotion ? spring : { ...spring, height: { duration: 0 } }}
      style={{ willChange: "height" }}
      className="overflow-clip"
    >
      <div ref={ref} className="relative overflow-clip">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="businesses"
              className="space-y-2 rounded-xl bg-melun-neutral-100 p-2 inset-ring-1 inset-ring-melun-neutral-200"
            >
              {others.map((business) => (
                <DropdownMenuItem
                  key={business.name}
                  onClick={() => onSelect(business)}
                  className="gap-2 rounded p-0 focus:bg-transparent"
                >
                  <motion.div
                    layoutId={shareAvatars ? `${business.name}-avatar` : undefined}
                    transition={layout}
                    className="flex items-center justify-center"
                  >
                    <BusinessAvatar
                      business={business}
                      decorative
                      className="size-9 shrink-0 rounded-full"
                      imageClassName="object-cover"
                    />
                  </motion.div>
                  <div className="grid text-left">
                    <span className="truncate text-sm leading-5 font-medium text-melun-teal-950">{business.name}</span>
                    <span className="truncate text-xs leading-4 text-melun-neutral-950">{business.email}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
