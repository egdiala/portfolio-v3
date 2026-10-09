"use client"

import { type ComponentProps } from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { blurOut, focusRing, label, pressable, slide } from "./constants"
import { useListingState } from "./hooks/use-listing"
import { ChevronLeftIcon, MoreIcon } from "./icons"
import { RECOMMENDATIONS, RecommendationCard } from "./recommendations"

function NavButton({ flip, className, ...props }: ComponentProps<"button"> & { flip?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "relative grid size-[1.875rem] cursor-pointer place-items-center rounded-full bg-[#F2F3F4] text-[#0D1C2E] after:absolute after:-inset-x-1.5 after:-inset-y-[7px] aria-disabled:cursor-not-allowed aria-disabled:text-[#A0A1A3]",
        pressable,
        focusRing,
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon className={flip ? "rotate-180" : undefined} />
    </button>
  )
}

export function ListingQueue() {
  const {
    finished,
    fade,
    morph,
    direction,
    index,
    statuses,
    slideSpring,
    accept,
    dismiss,
    busy,
    canGoBack,
    canGoForward,
    previous,
    next,
    goTo,
    close,
  } = useListingState()

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {finished ? null : (
        <motion.div
          key="queue"
          layout="position"
          exit={blurOut}
          transition={{ ...fade, layout: morph }}
          className="flex flex-col"
        >
          <div className="relative overflow-x-clip">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideSpring}
                aria-label={`Recommendation ${index + 1} of ${RECOMMENDATIONS.length}`}
                role="group"
              >
                <RecommendationCard index={index} status={statuses[index]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div layout="position" transition={morph} className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={accept}
                aria-disabled={busy}
                className={cn(
                  "relative cursor-pointer rounded-lg bg-[#010101] px-2 py-1.5 text-white after:absolute after:-inset-1.5 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                  label,
                  pressable,
                  focusRing,
                )}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={dismiss}
                aria-disabled={busy}
                className={cn(
                  "relative cursor-pointer rounded-sm text-[#343639] after:absolute after:-inset-x-1.5 after:-inset-y-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                  label,
                  pressable,
                  focusRing,
                )}
              >
                Dismiss
              </button>
              <MoreIcon className="text-[#0D1C2E]" />
            </div>
            <div className="flex items-center gap-3">
              <NavButton
                aria-label="Previous recommendation"
                aria-disabled={!canGoBack}
                onClick={() => canGoBack && previous !== undefined && goTo(previous, index)}
              />
              <NavButton
                flip
                aria-label="Next recommendation"
                aria-disabled={!canGoForward}
                onClick={() => canGoForward && next !== undefined && goTo(next, index)}
              />
            </div>
          </motion.div>

          <motion.div layout="position" transition={morph} className="mt-3 flex flex-col gap-3">
            <hr className="border-[#E0E1E3]" />
            <button
              type="button"
              onClick={() => close(true)}
              className={cn(
                "relative w-fit cursor-pointer rounded-lg bg-[#F2F3F4] px-2 py-1.5 text-[#010101] after:absolute after:-inset-1.5",
                label,
                pressable,
                focusRing,
              )}
            >
              Publish
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
