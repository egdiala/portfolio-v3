"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useReducedMotionConfig } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { BASE_SCORE, SCORE_PER_FIX, SETTLE_MS, WORK_MS } from "../constants"
import { RECOMMENDATIONS } from "../recommendations"
import { toneFor } from "../score"
import type { RecommendationStatus } from "../types"

export function useListing(shared: boolean) {
  const time = useTimeScale()
  const pieceId = (name: string) => (shared ? name : undefined)
  const [open, setOpen] = useState(false)
  const [statuses, setStatuses] = useState<RecommendationStatus[]>(() => RECOMMENDATIONS.map(() => "pending"))
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [finished, setFinished] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const timers = useRef<number[]>([])

  const accepted = statuses.filter((status) => status === "accepted").length
  const score = BASE_SCORE + accepted * SCORE_PER_FIX
  const tone = toneFor(score)
  const remaining = statuses.filter((status) => status === "pending" || status === "working").length
  const pending = statuses.flatMap((status, at) => (status === "pending" ? [at] : []))
  const previous = pending.filter((at) => at < index).at(-1)
  const next = pending.find((at) => at > index)
  // Controls stay focusable while busy (aria-disabled, not disabled), so the
  // browser doesn't drop keyboard focus mid-flow.
  const busy = statuses[index] !== "pending"
  const canGoBack = !busy && previous !== undefined
  const canGoForward = !busy && next !== undefined

  const morph = time.transition({ type: "spring", stiffness: 300, damping: 30 })
  const fade = time.transition({ type: "tween", ease: "easeOut", duration: 0.3 })
  const slideSpring = time.transition({ type: "spring", duration: 0.5, bounce: 0 })
  // On close the pill starts out at the panel's size, so anything in it that
  // isn't shared starts out stretched. The tint waits until the pill has nearly landed.
  const reduceMotion = useReducedMotionConfig()
  const tintIn = time.transition({ type: "tween", ease: "easeOut", duration: 0.2, delay: reduceMotion ? 0 : 0.25 })
  const tintOut = time.transition({ type: "tween", ease: "easeOut", duration: 0.15 })

  useEffect(() => {
    const pendingTimers = timers.current
    return () => pendingTimers.forEach(clearTimeout)
  }, [])

  const close = useCallback((returnFocus: boolean) => {
    restoreFocus.current = returnFocus
    setOpen(false)
  }, [])

  useEffect(() => {
    if (open) {
      panelRef.current?.focus({ preventScroll: true })
      return
    }
    if (!restoreFocus.current) return
    restoreFocus.current = false
    triggerRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const scope = panel?.closest("[data-playground-stage]") ?? document

    const onPointerDown = (event: Event) => {
      if (!panel?.contains(event.target as Node)) close(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(panel?.contains(document.activeElement) ?? false)
    }

    scope.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      scope.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  const schedule = (milliseconds: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, time.ms(milliseconds)))
  }

  const mark = (at: number, status: RecommendationStatus) => {
    setStatuses((current) => current.map((value, position) => (position === at ? status : value)))
  }

  const goTo = (to: number, from: number) => {
    setDirection(to > from ? 1 : -1)
    setIndex(to)
  }

  // Prefer the next pending card, then fall back to an earlier one.
  const following = (from: number) => {
    const rest = pending.filter((at) => at !== from)
    return rest.find((at) => at > from) ?? rest.at(-1)
  }

  const moveOn = (from: number, to: number | undefined) => {
    if (to !== undefined) {
      goTo(to, from)
      return
    }
    setFinished(true)
    // The buttons are about to unmount; keep focus in the panel.
    const panel = panelRef.current
    if (panel?.contains(document.activeElement)) panel.focus({ preventScroll: true })
  }

  const accept = () => {
    if (busy) return
    const at = index
    const to = following(at)
    const { title } = RECOMMENDATIONS[at]
    mark(at, "working")
    setAnnouncement(`Applying ${title}.`)
    schedule(WORK_MS, () => {
      mark(at, "accepted")
      setAnnouncement(`${title} applied. Listing score ${score + SCORE_PER_FIX}.`)
    })
    schedule(WORK_MS + SETTLE_MS, () => moveOn(at, to))
  }

  const dismiss = () => {
    if (busy) return
    const at = index
    mark(at, "dismissed")
    setAnnouncement(`${RECOMMENDATIONS[at].title} dismissed.`)
    moveOn(at, following(at))
  }

  return {
    pieceId,
    open,
    setOpen,
    close,
    score,
    tone,
    remaining,
    index,
    direction,
    finished,
    statuses,
    busy,
    canGoBack,
    canGoForward,
    previous,
    next,
    accept,
    dismiss,
    goTo,
    announcement,
    triggerRef,
    panelRef,
    morph,
    fade,
    slideSpring,
    tintIn,
    tintOut,
  }
}

export const ListingContext = createContext<ReturnType<typeof useListing> | null>(null)

export function useListingState() {
  const listing = useContext(ListingContext)
  if (!listing) throw new Error("Listing parts must render inside <ListingWidget>.")
  return listing
}
