import type { Reference } from "@/lib/ask-area/answer"

export type OrbitView = "orbit-menu" | "ask-area"

export type OrbitState = {
  isOpen: boolean
  view: OrbitView
  /** Where the container is coming from, which decides the size it starts at. */
  prevView: OrbitView | "closed"
  /** A question for Ask Area to send as it opens. */
  starter?: string
}

/** What the container's variants read to pick their sizes. */
export type OrbitCustom = Pick<OrbitState, "isOpen" | "prevView"> & { chatWidth: number }

export type AreaTheme = "system" | "dark" | "light"

export type ChatMessage = {
  id: number
  sender: "me" | "ai"
  message: string
  loading?: boolean
  /** A reply that explains a failure. Left out of what the model is told was said. */
  failed?: boolean
  references?: Reference[]
}
