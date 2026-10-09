export type OverlayMode = "syncing" | "ready" | "attached"

export type MemoryKind = "project" | "chat"

export type Memory = {
  id: string
  title: string
  description: string
  kind: MemoryKind
}

/** Where a memory stands in the chat: untouched, attached to the next message, or already sent. */
export type MemoryState = "idle" | "pending" | "sent"

export type PopupTab = "all" | "attached"

export type MemoryFilter = "all" | MemoryKind
