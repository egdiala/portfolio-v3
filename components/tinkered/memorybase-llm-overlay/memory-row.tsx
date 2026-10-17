"use client"

import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { focusRing, pop, trim } from "./constants"
import { useOverlayState } from "./hooks/use-overlay"
import {
  ChatIcon,
  CheckIcon,
  DoubleCheckIcon,
  ExternalLinkIcon,
  FolderIcon,
  PlusIcon,
  StarsIcon,
} from "./icons"
import type { Memory, MemoryState } from "./types"

const ROW: Record<MemoryState, string> = {
  idle: "cursor-pointer inset-ring-transparent after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:scale-90 after:rounded-lg after:bg-mmb-contrast-high/5 after:opacity-0 after:transition hover:after:scale-100 hover:after:opacity-100 motion-reduce:after:scale-100",
  pending: "cursor-pointer bg-mmb-primary/7 inset-ring-mmb-primary/20",
  sent: "bg-mmb-content/3 inset-ring-mmb-content/10",
}

const ACTION: Record<MemoryState, string> = {
  idle: "cursor-pointer bg-mmb-content/5 text-mmb-content",
  pending: "cursor-pointer bg-mmb-primary text-white",
  sent: "cursor-default bg-mmb-content/70 text-mmb-background-light",
}

const ICON = { idle: PlusIcon, pending: CheckIcon, sent: DoubleCheckIcon }

function actionLabel(state: MemoryState, title: string) {
  if (state === "sent") return `${title}, already in the conversation`
  return state === "pending" ? `Detach ${title}` : `Attach ${title}`
}

export function MemoryRow({ memory }: Readonly<{ memory: Memory }>) {
  const { stateOf, toggleMemory, popSpring, ms } = useOverlayState()
  const state = stateOf(memory)
  const KindIcon = memory.kind === "project" ? FolderIcon : ChatIcon
  const ActionIcon = ICON[state]
  const tint = { transitionDuration: `${ms(300)}ms` }

  return (
    <div
      style={tint}
      className={cn(
        "relative isolate flex items-center gap-5 rounded-lg px-2.5 pt-2.5 pb-3 inset-ring-1 transition-colors ease-out",
        ROW[state],
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <KindIcon className="shrink-0 text-mmb-content opacity-40" />
        <div className="grid min-w-0 content-start gap-1">
          <div className="flex items-center gap-2">
            <span className="line-clamp-1 text-mmb-sm font-medium text-mmb-content">
              {memory.title}
            </span>
            {state === "pending" ? (
              <span className="flex shrink-0 items-center gap-1 text-mmb-primary">
                <StarsIcon />
                <span className={cn("text-mmb-2xs font-medium", trim)}>Suggested</span>
              </span>
            ) : null}
          </div>
          <p className="line-clamp-3 text-mmb-2xs leading-4 text-mmb-content/40">
            {memory.description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span
          aria-hidden="true"
          className="grid size-7 place-content-center rounded-lg bg-mmb-content/5 text-mmb-content"
        >
          <ExternalLinkIcon />
        </span>
        {/* Its hit area is stretched over the whole row, so the row needs no click handler of its own. */}
        <button
          type="button"
          aria-label={actionLabel(state, memory.title)}
          aria-pressed={state !== "idle"}
          aria-disabled={state === "sent"}
          onClick={() => toggleMemory(memory)}
          style={tint}
          className={cn(
            "grid size-7 place-content-center rounded-lg transition-colors ease-out after:absolute after:inset-0 after:rounded-lg",
            ACTION[state],
            focusRing,
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              variants={pop}
              initial="hidden"
              animate="shown"
              exit="hidden"
              transition={popSpring}
              className="block"
            >
              <ActionIcon />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
