"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { focusRing } from "./constants"
import { useListingState } from "./hooks/use-listing"
import { SparklePencilIcon } from "./icons"
import { Score } from "./score"

export function ListingPill() {
  const { triggerRef, pieceId, score, remaining, setOpen, morph, tone, fade, tintOut, tintIn } = useListingState()

  return (
    <motion.button
      ref={triggerRef}
      layoutId="widget"
      type="button"
      aria-haspopup="dialog"
      aria-label={`Open listing assistant. Score ${score}, ${remaining} recommendations left.`}
      onClick={() => setOpen(true)}
      whileTap={{ scale: 0.95 }}
      transition={morph}
      style={{ borderRadius: 32 }}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 border border-[#F2F3F4] bg-white p-2 [grid-area:1/1]",
        focusRing,
      )}
    >
      <Score layoutId={pieceId("score")} score={score} size="sm" transition={morph} />
      <motion.span
        initial={false}
        animate={{ color: tone.solid }}
        transition={fade}
        className="relative isolate flex items-center gap-2 px-[13px] py-2"
      >
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, backgroundColor: tone.wash }}
          animate={{ opacity: 1, backgroundColor: tone.wash }}
          exit={{ opacity: 0, transition: tintOut }}
          transition={{ ...fade, opacity: tintIn }}
          className="absolute inset-0 -z-10 rounded-full"
        />
        <motion.span layoutId={pieceId("pencil")} transition={morph} className="block">
          <SparklePencilIcon />
        </motion.span>
        <motion.span
          initial={{ opacity: 0, borderColor: tone.track }}
          animate={{ opacity: 1, borderColor: tone.track }}
          exit={{ opacity: 0, transition: tintOut }}
          transition={{ ...fade, opacity: tintIn }}
          className="mr-px h-8 border-l"
        />
        <motion.span
          layoutId={pieceId("count")}
          initial={false}
          animate={{ backgroundColor: tone.solid }}
          transition={{ ...morph, backgroundColor: fade }}
          className="grid size-8 place-items-center rounded-full text-xl font-medium text-white tabular-nums"
        >
          {remaining}
        </motion.span>
      </motion.span>
    </motion.button>
  )
}
