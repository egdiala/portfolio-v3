"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { LayoutGroup, motion } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { Music, PLAYER_SPRING, TRACK } from "./music"
import { Ring } from "./ring"

export type IslandView = "idle" | "ring" | "music"

// Keyed by "from-to". The bigger the change in size, the less it bounces.
export const TUNED_BOUNCE: Record<string, number> = {
  idle: 0.5,
  "idle-ring": 0.5,
  "ring-idle": 0.5,
  "ring-music": 0.35,
  "music-ring": 0.35,
  "idle-music": 0.3,
  "music-idle": 0.3,
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

export function DynamicIsland({
  view,
  bounce,
  blur = true,
}: Readonly<{
  view: IslandView
  /** Overrides the tuned per-transition bounce with one value. */
  bounce?: number
  blur?: boolean
}>) {
  const time = useTimeScale()
  const [ref, width] = useWidth<HTMLDivElement>()
  const [shown, setShown] = useState(view)
  const [change, setChange] = useState<string>(view)
  const [expanded, setExpanded] = useState(false)
  const [resizedBy, setResizedBy] = useState<"view" | "player">("view")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)

  if (view !== shown) {
    setShown(view)
    setChange(`${shown}-${view}`)
    setExpanded(false)
    setResizedBy("view")
  }

  const collapse = useCallback((returnFocus: boolean) => {
    restoreFocus.current = returnFocus
    setResizedBy("player")
    setExpanded(false)
  }, [])

  useEffect(() => {
    if (expanded || !restoreFocus.current) return
    restoreFocus.current = false
    triggerRef.current?.focus({ preventScroll: true })
  }, [expanded])

  const spring = { type: "spring", bounce: bounce ?? TUNED_BOUNCE[change] ?? 0.5 } as const
  const settle = { type: "spring", duration: 0.4, bounce: 0, delay: 0.05 } as const
  const resize = time.transition(resizedBy === "player" ? PLAYER_SPRING : spring)

  return (
    <div ref={ref} className="flex w-full justify-center">
      {/* Ring re-renders on its own; the group makes the island measure with it. */}
      <LayoutGroup>
        <div className="relative">
          <motion.div
            layout
            transition={resize}
            style={{ borderRadius: 32 }}
            className="h-fit min-w-[100px] overflow-hidden bg-black text-white"
          >
            <motion.div
              key={view}
              initial={{ scale: 0.9, opacity: 0, filter: blur ? "blur(5px)" : "blur(0px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={time.transition({
                ...spring,
                delay: 0.05,
                opacity: settle,
                filter: settle,
              })}
            >
              {view === "ring" ? <Ring resize={resize} /> : null}
              {view === "music" ? (
                <Music maxWidth={width ?? 367} expanded={expanded} onCollapse={collapse} />
              ) : null}
              {view === "idle" ? <div className="h-7" /> : null}
            </motion.div>
          </motion.div>

          {view === "music" && !expanded ? (
            <button
              ref={triggerRef}
              type="button"
              onClick={() => {
                setResizedBy("player")
                setExpanded(true)
              }}
              className="absolute -inset-x-[3px] top-1/2 h-11 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <span className="sr-only">
                Expand now playing, {TRACK.title} by {TRACK.artist}
              </span>
            </button>
          ) : null}
        </div>
      </LayoutGroup>
    </div>
  )
}
