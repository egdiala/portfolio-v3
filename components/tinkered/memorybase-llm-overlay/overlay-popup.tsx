"use client"

import { useId } from "react"
import { AnimatePresence, motion } from "motion/react"
import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"
import { Attached } from "./attached"
import { MORPH_MS, blurred, focusRing, sharp, slide } from "./constants"
import { useOverlayState } from "./hooks/use-overlay"
import { Memories } from "./memories"

const tabClassName = "h-8 flex-1 cursor-pointer rounded-lg text-mmb-sm font-medium"

function PopupTabs({ id }: Readonly<{ id: string }>) {
  const { tab, selectTab, attachedCount, morph, ms } = useOverlayState()

  let attachedTone = "text-mmb-content/40"
  if (tab === "attached") {
    attachedTone = attachedCount > 0 ? "bg-mmb-primary/10 text-mmb-primary" : "bg-mmb-content/5 text-mmb-content"
  }

  return (
    <div role="tablist" aria-label="Memories" className="flex shrink-0 items-center p-1.5">
      <button
        type="button"
        role="tab"
        id={`${id}-all`}
        aria-selected={tab === "all"}
        aria-controls={`${id}-panel`}
        onClick={() => selectTab("all")}
        className={cn(
          tabClassName,
          tab === "all" ? "bg-mmb-content/5 text-mmb-content" : "text-mmb-content/40",
          focusRing,
        )}
      >
        All Memories
      </button>
      <button
        type="button"
        role="tab"
        id={`${id}-attached`}
        aria-label={`Attached, ${attachedCount}`}
        aria-selected={tab === "attached"}
        aria-controls={`${id}-panel`}
        onClick={() => selectTab("attached")}
        className={cn(tabClassName, attachedTone, focusRing)}
      >
        Attached (
        <TextMorph className="tabular-nums" duration={ms(MORPH_MS)} disabled={!morph}>
          {attachedCount}
        </TextMorph>
        )
      </button>
    </div>
  )
}

export function OverlayPopup() {
  const id = useId()
  const { open, popupRef, growing, size, openSpring, slideSpring, tab, direction } = useOverlayState()
  // Growing starts from nothing at the pill. Otherwise the popup fades in at full size.
  const closed = growing ? { ...blurred, y: 10, width: 0, height: 0 } : { ...blurred, y: 0, ...size }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="popup"
          ref={popupRef}
          role="dialog"
          aria-label="Memories"
          tabIndex={-1}
          initial={closed}
          animate={{ ...sharp, y: 0, ...size }}
          exit={closed}
          transition={openSpring}
          className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 overflow-clip rounded-[14px] bg-mmb-background-light shadow-mmb-overlay-popup outline-none"
        >
          {/* Laid out at full size and pinned to the bottom, so growing reveals the content instead of reflowing it. */}
          <div style={size} className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col">
            <PopupTabs id={id} />
            <div className="relative min-h-0 flex-1">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={tab}
                  role="tabpanel"
                  id={`${id}-panel`}
                  aria-labelledby={`${id}-${tab}`}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideSpring}
                  className="size-full"
                >
                  {tab === "attached" ? <Attached /> : <Memories />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
