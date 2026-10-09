export type TinkeredWork = {
  slug: string
  title: string
  /** Lede on the writeup. */
  summary?: string
  /** What search results and link previews show. */
  description?: string
  /** Tailwind object-position for the preview video, e.g. `object-[25%_90%]`. */
  videoClassName?: string
  /** True once `content/tinkered/<slug>.mdx` exists. */
  writeup?: boolean
}

export const TINKERED_WORKS: TinkeredWork[] = [
  {
    slug: "ai-chrome-extension-widget",
    title: "AI Chrome Extension Widget",
    summary:
      "A listing assistant that opens from a pill into a panel, scores the listing, and fixes it one recommendation at a time.",
    description:
      "A pill that unfolds into an AI listing assistant, rebuilt in React and Motion from @zuriks_'s After Effects concept. Accept a fix and watch the score roll up.",
    writeup: true,
  },
  {
    slug: "dynamic-island",
    title: "Dynamic Island",
    summary:
      "One black shape that becomes a ringer, a now-playing pill, and a full player, with a spring tuned for every change between them.",
    description:
      "Apple's Dynamic Island, rebuilt after Emil Kowalski's course, now with a swinging bell clapper and a music player of my own. Tune every spring in the playground.",
    writeup: true,
  },
  {
    slug: "ios-network-interaction",
    title: "iOS Network Interaction",
    summary:
      "The status bar's signal indicator, from airplane mode to searching to connected, built from four bars and one shared label.",
    description:
      "My iPhone's signal indicator, rebuilt in Motion for Emil Kowalski's course. The plane flies off, the bars go searching, and the carrier name settles in.",
    writeup: true,
  },
  {
    slug: "ask-area-ai-chat",
    title: "Ask Area AI Chat",
    summary:
      "A help menu that morphs into a chat grounded in Area's docs and back, with every answer ending in links to the pages it came from.",
    description:
      "Ask Area, the docs chat inside the Area app, designed by @guerriero_se and built by me. The menu becomes the chat the way the Dynamic Island changes state. Ask it something.",
    videoClassName: "object-[25%_90%]",
    writeup: true,
  },
  {
    slug: "memorybase-llm-overlay",
    title: "LLM Overlay for MemoryBase",
    summary:
      "A pill under the chat box on Claude, Gemini, and ChatGPT that opens into a panel for attaching context from your other AI chats.",
    description:
      "The MemoryBase overlay, designed by @guerriero_se and built by me in React and Motion. Watch memory sync, open the panel, and attach a memory.",
    writeup: true,
  },
  {
    slug: "business-switcher",
    title: "Business Switcher",
  },
]

export const HOME_TINKERED_COUNT = 6

export function getWriteups() {
  return TINKERED_WORKS.filter((work) => work.writeup)
}

export function getWriteup(slug: string) {
  return getWriteups().find((work) => work.slug === slug)
}

export function getAdjacentWriteups(slug: string) {
  const writeups = getWriteups()
  const index = writeups.findIndex((work) => work.slug === slug)

  return {
    previous: index > 0 ? writeups[index - 1] : undefined,
    next: index >= 0 && index < writeups.length - 1 ? writeups[index + 1] : undefined,
  }
}
