"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, LayoutGroup, motion, type Transition } from "motion/react"

import { cn } from "@/lib/utils"
import { getTooltipPosition, type Align, type Side } from "./position"

export type TooltipData = {
  content: React.ReactNode
  rect: DOMRect
  side: Side
  sideOffset: number
  align: Align
  alignOffset: number
  id: string
  arrow: boolean
}

type GlobalTooltipContextType = {
  showTooltip: (data: TooltipData) => void
  hideTooltip: () => void
  currentTooltip: TooltipData | null
  transition: Transition
  globalId: string
}

const GlobalTooltipContext = React.createContext<GlobalTooltipContextType | undefined>(undefined)

function useGlobalTooltip() {
  const context = React.useContext(GlobalTooltipContext)

  if (!context) {
    throw new Error("useGlobalTooltip must be used within a GlobalTooltipProvider")
  }

  return context
}

type TooltipProviderProps = {
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
  transition?: Transition
}

/** One tooltip for every trigger inside it, so moving between triggers slides the tooltip instead of replacing it. */
function GlobalTooltipProvider({
  children,
  openDelay = 150,
  closeDelay = 100,
  transition = { type: "spring", stiffness: 300, damping: 25 },
}: TooltipProviderProps) {
  const globalId = React.useId()
  const [currentTooltip, setCurrentTooltip] = React.useState<TooltipData | null>(null)
  const timeoutRef = React.useRef<number>(null)
  const lastCloseTimeRef = React.useRef<number>(0)

  const showTooltip = React.useCallback(
    (data: TooltipData) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      if (currentTooltip !== null) {
        setCurrentTooltip(data)

        return
      }

      const now = Date.now()
      const delay = now - lastCloseTimeRef.current < closeDelay ? 0 : openDelay

      timeoutRef.current = window.setTimeout(() => setCurrentTooltip(data), delay)
    },
    [openDelay, closeDelay, currentTooltip],
  )

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setCurrentTooltip(null)
      lastCloseTimeRef.current = Date.now()
    }, closeDelay)
  }, [closeDelay])

  const hideImmediate = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setCurrentTooltip(null)
    lastCloseTimeRef.current = Date.now()
  }, [])

  React.useEffect(() => {
    window.addEventListener("scroll", hideImmediate, true)

    return () => window.removeEventListener("scroll", hideImmediate, true)
  }, [hideImmediate])

  return (
    <GlobalTooltipContext.Provider value={{ showTooltip, hideTooltip, currentTooltip, transition, globalId }}>
      <LayoutGroup>{children}</LayoutGroup>
      <TooltipOverlay />
    </GlobalTooltipContext.Provider>
  )
}

function TooltipArrow({ side }: { side: Side }) {
  return (
    <div
      className={cn(
        "absolute z-50 size-2.5 rotate-45 rounded-[2px] bg-melun-foreground",
        (side === "top" || side === "bottom") && "left-1/2 -translate-x-1/2",
        (side === "left" || side === "right") && "top-1/2 -translate-y-1/2",
        side === "top" && "-bottom-[3px]",
        side === "bottom" && "-top-[3px]",
        side === "left" && "-right-[3px]",
        side === "right" && "-left-[3px]",
      )}
    />
  )
}

// Only rendered after a hover or focus, so document is always there.
function TooltipPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body)
}

function TooltipOverlay() {
  const { currentTooltip, transition, globalId } = useGlobalTooltip()

  const position = React.useMemo(() => {
    if (!currentTooltip) return null

    return getTooltipPosition({
      rect: currentTooltip.rect,
      side: currentTooltip.side,
      sideOffset: currentTooltip.sideOffset,
      align: currentTooltip.align,
      alignOffset: currentTooltip.alignOffset,
    })
  }, [currentTooltip])

  return (
    <AnimatePresence>
      {currentTooltip && currentTooltip.content && position ? (
        <TooltipPortal>
          <motion.div
            data-slot="tooltip-overlay-container"
            className="fixed z-50"
            style={{ top: position.y, left: position.x, transform: position.transform }}
          >
            <motion.div
              data-slot="tooltip-overlay"
              layoutId={`tooltip-overlay-${globalId}`}
              initial={{ opacity: 0, scale: 0, ...position.initial }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, ...position.initial }}
              transition={transition}
              className="relative w-fit rounded-full bg-melun-foreground fill-melun-foreground px-3 py-1.5 text-xs text-balance text-melun-background [corner-shape:squircle]"
            >
              {currentTooltip.content}
              {currentTooltip.arrow ? <TooltipArrow side={currentTooltip.side} /> : null}
            </motion.div>
          </motion.div>
        </TooltipPortal>
      ) : null}
    </AnimatePresence>
  )
}

export { GlobalTooltipProvider, useGlobalTooltip, type TooltipProviderProps }
