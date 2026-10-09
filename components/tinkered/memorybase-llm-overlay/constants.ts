import type { Memory, MemoryFilter } from "./types"

/** How long memory takes to sync before the pill can be opened. */
export const SYNC_MS = 3000
/** How long the pill says "attached" before it settles back to "ready". */
export const ATTACHED_MS = 3000
export const BOUNCE_MS = 1200
export const MORPH_MS = 400

export const POPUP_WIDTH = 420
export const POPUP_HEIGHT = 380

export const MEMORIES: Memory[] = [
  {
    id: "react-testing",
    title: "React Testing and State Management",
    description:
      "Comprehensive Jest and React Testing Library patterns for Redux stores, async promises, and common debugging issues.",
    kind: "project",
  },
  {
    id: "data-processing",
    title: "Data Processing, CSV and FormData",
    description:
      "Approaches for large-scale CSV handling with Pandas/Polars, client-side CSV generation in React, and converting complex objects to FormData for uploads.",
    kind: "project",
  },
  {
    id: "use-effect-loop",
    title: "React useEffect Infinite Loop Debug",
    description:
      "Avoid infinite loops by not including state that the effect sets in its dependency array; include only values that trigger re-fetch like props. Resolve stale closures by using functional updates, refs, or memoized callbacks with proper dependencies.",
    kind: "chat",
  },
  {
    id: "typescript-generics",
    title: "TypeScript Generics and Conditional Types",
    description:
      "Key TypeScript type system concepts: generics with optional constraints, utility types for key extraction, and conditional types for type transformations and inference.",
    kind: "chat",
  },
  {
    id: "pandas-aggregation",
    title: "Pandas Data Processing and Aggregation",
    description:
      "Process large CSVs by chunking with pandas or using Polars for speed; parse dates with dayfirst or explicit format; handle missing dates and amounts before aggregation.",
    kind: "chat",
  },
  {
    id: "ui-components",
    title: "Frontend UI Components and Layout",
    description:
      "Techniques for CSS Grid, dynamic card rendering, image color extraction, and injecting React components into arbitrary DOM nodes.",
    kind: "project",
  },
  {
    id: "api-design",
    title: "API Design and Containerization",
    description:
      "Best practices for REST API versioning, error handling, pagination, and Docker multi-stage builds for reliable SaaS deployments.",
    kind: "project",
  },
  {
    id: "docker-deployment",
    title: "Docker Deployment Issues and Multi-stage Builds",
    description:
      "Use an appropriate Node base image, match image architecture to host, and employ multi-stage builds with a .dockerignore to keep the final container small.",
    kind: "chat",
  },
]

export const FILTERS = [
  { value: "all", label: "All" },
  { value: "project", label: "Projects" },
  { value: "chat", label: "Chats" },
] as const satisfies ReadonlyArray<{ value: MemoryFilter; label: string }>

export const slide = {
  enter: (direction: number) => ({ x: `${110 * direction}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${-110 * direction}%`, opacity: 0 }),
}

export const pop = {
  hidden: { opacity: 0, scale: 0.5 },
  shown: { opacity: 1, scale: 1 },
}

export const blurred = { opacity: 0, filter: "blur(4px)" }
export const sharp = { opacity: 1, filter: "blur(0px)" }

/** The card each tab's content sits on, below the tab strip. */
export const panel =
  "flex size-full flex-col overflow-hidden rounded-[14px] bg-mmb-background-light shadow-mmb-overlay-inner-popup"
export const scroller =
  "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-mmb-content focus-visible:ring-offset-2 focus-visible:ring-offset-mmb-background-light"
export const pressable = "transition-[scale] duration-150 ease-out active:scale-[0.96]"
export const trim = "[text-box:trim-both_cap_alphabetic]"
