"use client"

import { useCallback, useEffect, useId, useRef } from "react"
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotionConfig } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { useWidth } from "@/components/tinkered/dynamic-island/hooks/use-width"
import { cn } from "@/lib/utils"
import { AskArea } from "./ask-area"
import { CHAT, defaultFade, defaultScale, spring, variants } from "./constants"
import { OrbitMenu } from "./orbit-menu"
import { OrbitTrigger } from "./orbit-trigger"
import { useAreaTheme } from "./theme-switcher"
import type { OrbitCustom, OrbitState } from "./types"

const CLOSED: OrbitState = { isOpen: false, view: "orbit-menu", prevView: "orbit-menu" }
const MENU: OrbitState = { isOpen: true, view: "orbit-menu", prevView: "orbit-menu" }

export function Orbit({
  state,
  onChange,
}: Readonly<{ state: OrbitState; onChange: (state: OrbitState) => void }>) {
  const time = useTimeScale()
  const reduceMotion = useReducedMotionConfig()
  const { theme, isDark, cycle } = useAreaTheme()
  const [columnRef, width] = useWidth<HTMLDivElement>()
  const containerRef = useRef<HTMLDivElement>(null)
  // Two containers are mounted during a swap. Only the one arriving sets this, so the one leaving can't clear it.
  const attachContainer = useCallback((node: HTMLDivElement | null) => {
    if (node) containerRef.current = node
  }, [])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  // Counted here, so going back to the menu and into the chat again doesn't start the count over.
  const asked = useRef(0)
  const layoutGroup = useId()

  const { isOpen, view } = state
  const custom: OrbitCustom = {
    isOpen,
    prevView: state.prevView,
    // The chat is never wider than the room it has.
    chatWidth: Math.min(CHAT.width, width ?? CHAT.width),
  }

  const close = useCallback(
    (returnFocus: boolean) => {
      restoreFocus.current = returnFocus
      onChange(CLOSED)
    },
    [onChange],
  )

  // Focus follows the container: into the menu as it opens, back to the orb when it closes from inside.
  // The chat places its own focus, and focus that is busy in the controls below is left alone.
  useEffect(() => {
    if (isOpen) {
      const active = document.activeElement
      const column = columnRef.current
      if (view === "orbit-menu" && (!active || active === document.body || column?.contains(active))) {
        containerRef.current?.focus({ preventScroll: true })
      }
      return
    }
    if (!restoreFocus.current) return
    restoreFocus.current = false
    triggerRef.current?.focus({ preventScroll: true })
  }, [isOpen, view, columnRef])

  useEffect(() => {
    if (!isOpen) return
    const scope = columnRef.current?.closest("[data-playground-stage]") ?? document

    const onPointerDown = (event: Event) => {
      if (!(event.target as Element).closest("[data-orbit]")) close(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(columnRef.current?.contains(document.activeElement) ?? false)
    }

    scope.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      scope.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, close, columnRef])

  return (
    <div
      className={cn(
        "area-theme flex size-full items-end justify-center bg-area-background px-4 pt-6 pb-10 font-area-sans text-area-base text-area-contrast-low slashed-zero transition-colors duration-300 ease-area-out",
        isDark && "dark",
      )}
    >
      <div ref={columnRef} className="relative w-full max-w-[350px]">
        <LayoutGroup id={layoutGroup}>
          {/* Width and height aren't transforms, so reduced motion has to stop them here. */}
          <MotionConfig transition={reduceMotion ? { duration: 0 } : time.transition(spring)}>
            <AnimatePresence initial={false} custom={custom}>
              {isOpen && (
                <motion.div
                  ref={attachContainer}
                  key={view}
                  data-orbit=""
                  role="group"
                  aria-label={view === "ask-area" ? "Ask Area" : "Area menu"}
                  tabIndex={-1}
                  className="absolute bottom-0 left-0 z-50 flex flex-col overflow-hidden rounded-area-lg bg-area-background-light shadow-area-md ring-1 inset-ring-1 ring-black/10 inset-shadow-2xs inset-shadow-white/10 inset-ring-white/4 outline-none"
                  variants={variants[view]}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={custom}
                >
                  {view === "orbit-menu" ? (
                    <OrbitMenu
                      theme={theme}
                      onCycleTheme={cycle}
                      onAsk={(starter) =>
                        onChange({ isOpen: true, view: "ask-area", prevView: "orbit-menu", starter })
                      }
                    />
                  ) : (
                    <AskArea
                      asked={asked}
                      starter={state.starter}
                      onBack={() => onChange({ isOpen: true, view: "orbit-menu", prevView: "ask-area" })}
                      onClose={() => close(true)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </MotionConfig>
        </LayoutGroup>
        <div data-orbit="" className="relative w-fit">
          <OrbitTrigger ref={triggerRef} isOpen={isOpen} onToggle={() => onChange(isOpen ? CLOSED : MENU)} />
          <AnimatePresence initial={false}>
            {!isOpen && (
              <motion.span
                key="orbit-pulse-indicator"
                aria-hidden="true"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ scale: time.transition(defaultScale), opacity: time.transition(defaultFade) }}
                className="pointer-events-none absolute top-0.75 right-0.75 size-2 rounded-full border border-area-rose bg-area-rose shadow-area-sm inset-shadow-2xs inset-shadow-white/25"
              >
                <span className="absolute inset-[-2px] animate-area-ping rounded-[inherit] bg-area-rose" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
