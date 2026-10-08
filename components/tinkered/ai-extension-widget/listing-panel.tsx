"use client"

import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { blurOut, focusRing, pressable } from "./constants"
import { useListingState } from "./hooks/use-listing"
import { BulbIcon, CloseIcon, PencilIcon, WheelIcon } from "./icons"
import { ListingQueue } from "./listing-queue"
import { Score } from "./score"

export function ListingPanel() {
  const { panelRef, pieceId, close, morph, score, finished, fade, tone, remaining } = useListingState()

  return (
    <motion.div
      ref={panelRef}
      layoutId="widget"
      role="dialog"
      aria-label="Listing assistant"
      tabIndex={-1}
      transition={morph}
      style={{ borderRadius: 16 }}
      className="relative flex w-[18.9375rem] flex-col gap-4 overflow-hidden border border-[#F2F3F4] bg-white px-2 pt-2 pb-4 outline-none [grid-area:1/1]"
    >
      <motion.div
        layout="position"
        transition={morph}
        className="flex items-center justify-between border-b border-[#F2F3F4] pb-2"
      >
        <WheelIcon className="text-[#010101]" />
        <button
          type="button"
          aria-label="Close"
          onClick={() => close(true)}
          className={cn(
            "relative grid size-7 cursor-pointer place-items-center rounded-full bg-[#F2F3F4] text-[#0D1C2E] after:absolute after:-inset-2",
            pressable,
            focusRing,
          )}
        >
          <CloseIcon />
        </button>
      </motion.div>

      <motion.div layout="position" transition={morph} className="flex flex-col items-center gap-2">
        <p className="text-[0.8125rem]/5 font-semibold text-[#010101]">Listing Score</p>
        <Score layoutId={pieceId("score")} score={score} size="lg" rolling transition={morph} />
      </motion.div>

      <AnimatePresence mode="popLayout" initial={false}>
        {finished ? null : (
          <motion.div
            key="insight"
            layout="position"
            exit={blurOut}
            transition={{ ...fade, layout: morph }}
            className="flex items-start gap-1.5 rounded-lg bg-[#F2F3F4] p-2"
          >
            <BulbIcon className="shrink-0 text-[#343639]" />
            <p className="flex-1 text-xs text-[#343639]">
              <strong className="font-bold text-[#010101]">35% increase</strong> in visibility with
              better SEO keywords and quality images. See recommendations below.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout="position" transition={morph} className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <motion.span layoutId={pieceId("pencil")} transition={morph} className="block text-[#010101]">
            <PencilIcon />
          </motion.span>
          <span className="text-[0.8125rem]/5 font-semibold text-[#010101]">Recommendations</span>
          <motion.span
            layoutId={pieceId("count")}
            initial={false}
            animate={{ backgroundColor: tone.solid }}
            transition={{ ...morph, backgroundColor: fade }}
            className="grid size-[1.0625rem] place-items-center rounded-full text-[0.6875rem]/3 font-medium text-white tabular-nums"
          >
            {remaining}
            <span className="sr-only"> left</span>
          </motion.span>
        </div>
        <ListingQueue />
      </motion.div>
    </motion.div>
  )
}
