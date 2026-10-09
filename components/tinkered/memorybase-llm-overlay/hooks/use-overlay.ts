"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useReducedMotionConfig } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { ATTACHED_MS, MEMORIES, POPUP_HEIGHT, POPUP_WIDTH, SYNC_MS } from "../constants"
import type { Memory, MemoryState, OverlayMode, PopupTab } from "../types"

type OverlayOptions = {
  mode: OverlayMode
  /** Keep a passing state (syncing, attached) on screen instead of letting it time out. */
  held: boolean
  onModeChange: (mode: OverlayMode) => void
  morph: boolean
  grow: boolean
  /** Room the popup has to open in. It is never wider than POPUP_WIDTH. */
  width: number | null
}

const byId = (id: string) => MEMORIES.find((memory) => memory.id === id) ?? []

export function useOverlay({ mode, held, onModeChange, morph, grow, width }: OverlayOptions) {
  const time = useTimeScale()
  const reduceMotion = useReducedMotionConfig()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<PopupTab>("all")
  const [direction, setDirection] = useState(1)
  const [pending, setPending] = useState<string[]>([])
  const [sent, setSent] = useState<string[]>([])
  const [attaches, setAttaches] = useState(0)
  const [announcement, setAnnouncement] = useState("")
  const anchorRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const changeMode = useRef(onModeChange)
  changeMode.current = onModeChange

  // The pill can't be opened while memory syncs, so an open popup goes with it.
  if (mode === "syncing" && open) setOpen(false)

  // Syncing and attached are passing states. Each attach restarts the wait.
  useEffect(() => {
    if (held || mode === "ready") return
    const timer = window.setTimeout(
      () => changeMode.current("ready"),
      time.ms(mode === "syncing" ? SYNC_MS : ATTACHED_MS),
    )
    return () => window.clearTimeout(timer)
  }, [mode, held, attaches, time])

  const close = useCallback((returnFocus: boolean) => {
    restoreFocus.current = returnFocus
    setOpen(false)
  }, [])

  useEffect(() => {
    if (open) {
      popupRef.current?.focus({ preventScroll: true })
      return
    }
    if (!restoreFocus.current) return
    restoreFocus.current = false
    pillRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const anchor = anchorRef.current
    const scope = anchor?.closest("[data-playground-stage]") ?? document

    const onPointerDown = (event: Event) => {
      if (!anchor?.contains(event.target as Node)) close(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(popupRef.current?.contains(document.activeElement) ?? false)
    }

    scope.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      scope.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  const toggle = () => {
    if (mode === "syncing") return
    setOpen((current) => !current)
  }

  const selectTab = (next: PopupTab) => {
    if (next === tab) return
    setDirection(tab === "attached" ? -1 : 1)
    setTab(next)
  }

  const stateOf = (memory: Memory): MemoryState => {
    if (sent.includes(memory.id)) return "sent"
    return pending.includes(memory.id) ? "pending" : "idle"
  }

  const toggleMemory = (memory: Memory) => {
    const state = stateOf(memory)
    if (state === "sent") return
    if (state === "pending") {
      setPending((current) => current.filter((id) => id !== memory.id))
      setAnnouncement(`${memory.title} detached.`)
      return
    }
    setPending((current) => [...current, memory.id])
    setAttaches((current) => current + 1)
    setAnnouncement(`${memory.title} attached.`)
    changeMode.current("attached")
  }

  // Sending a message takes its attachments with it.
  const send = () => {
    if (pending.length === 0) return
    setSent((current) => [...current, ...pending])
    setPending([])
    setAnnouncement(
      pending.length === 1
        ? "1 memory added to the conversation."
        : `${pending.length} memories added to the conversation.`,
    )
  }

  const size = { width: Math.min(POPUP_WIDTH, width ?? POPUP_WIDTH), height: POPUP_HEIGHT }

  return {
    mode,
    morph,
    // Width and height aren't transforms, so MotionConfig's reduced motion leaves them animating.
    growing: grow && !reduceMotion,
    size,
    open,
    toggle,
    tab,
    direction,
    selectTab,
    stateOf,
    toggleMemory,
    send,
    pendingMemories: pending.flatMap(byId),
    sentMemories: sent.flatMap(byId),
    attachedCount: pending.length + sent.length,
    announcement,
    anchorRef,
    pillRef,
    popupRef,
    ms: time.ms,
    openSpring: time.transition({ type: "spring", duration: 0.5, bounce: 0.15 }),
    slideSpring: time.transition({ type: "spring", duration: 0.5, bounce: 0 }),
    popSpring: time.transition({ type: "spring", duration: 0.3, bounce: 0 }),
  }
}

export const OverlayContext = createContext<ReturnType<typeof useOverlay> | null>(null)

export function useOverlayState() {
  const overlay = useContext(OverlayContext)
  if (!overlay) throw new Error("Overlay parts must render inside <LlmOverlay>.")
  return overlay
}
