"use client"

import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"
import { MORPH_MS, panel, scroller, trim } from "./constants"
import { useOverlayState } from "./hooks/use-overlay"
import { FolderEmptyIcon } from "./icons"
import { MemoryRow } from "./memory-row"
import type { Memory } from "./types"

function Group({
  label,
  memories,
  className,
}: Readonly<{ label: string; memories: Memory[]; className: string }>) {
  const { morph, ms } = useOverlayState()

  return (
    <section className="flex flex-col gap-3">
      <p className={cn("pt-2.5 pl-4 text-mmb-2xs", trim, className)}>
        {label} (
        <TextMorph duration={ms(MORPH_MS)} disabled={!morph}>
          {memories.length}
        </TextMorph>
        )
      </p>
      <ul className="flex flex-col gap-1.5">
        {memories.map((memory) => (
          <li key={memory.id}>
            <MemoryRow memory={memory} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Attached() {
  const { pendingMemories, sentMemories } = useOverlayState()

  if (pendingMemories.length + sentMemories.length === 0) {
    return (
      <div className={cn(panel, "items-center justify-center gap-1")}>
        <FolderEmptyIcon className="text-mmb-content" />
        <p className="text-mmb-sm text-mmb-content/40">No memories attached</p>
      </div>
    )
  }

  return (
    <div className={panel}>
      <div className={cn(scroller, "gap-5 py-1.5")}>
        {pendingMemories.length > 0 ? (
          <Group label="New" memories={pendingMemories} className="text-mmb-primary" />
        ) : null}
        {sentMemories.length > 0 ? (
          <Group
            label="Already attached in conversation"
            memories={sentMemories}
            className="text-mmb-content/40"
          />
        ) : null}
      </div>
    </div>
  )
}
