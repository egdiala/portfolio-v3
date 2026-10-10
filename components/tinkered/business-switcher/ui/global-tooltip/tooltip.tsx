"use client"

import * as React from "react"

import type { Align, Side } from "./position"
import { useGlobalTooltip } from "./provider"

type TooltipContextType = {
  content: React.ReactNode
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
  arrow: boolean
  setArrow: React.Dispatch<React.SetStateAction<boolean>>
  side: Side
  sideOffset: number
  align: Align
  alignOffset: number
  id: string
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined)

function useTooltip() {
  const context = React.useContext(TooltipContext)

  if (!context) {
    throw new Error("useTooltip must be used within a GlobalTooltip")
  }

  return context
}

type TooltipProps = {
  children: React.ReactNode
  side?: Side
  sideOffset?: number
  align?: Align
  alignOffset?: number
}

function GlobalTooltip({ children, side = "top", sideOffset = 10, align = "center", alignOffset = 0 }: TooltipProps) {
  const id = React.useId()
  const [content, setContent] = React.useState<React.ReactNode>(null)
  const [arrow, setArrow] = React.useState(true)

  return (
    <TooltipContext.Provider value={{ content, setContent, arrow, setArrow, side, sideOffset, align, alignOffset, id }}>
      {children}
    </TooltipContext.Provider>
  )
}

type TooltipContentProps = {
  children: React.ReactNode
  arrow?: boolean
}

/** Renders nothing in place. It hands its children to the provider's single overlay. */
function GlobalTooltipContent({ children, arrow = true }: TooltipContentProps) {
  const { setContent, setArrow } = useTooltip()

  React.useEffect(() => {
    setContent(children)
    setArrow(arrow)
  }, [children, setContent, setArrow, arrow])

  return null
}

type TooltipTriggerProps = {
  children: React.ReactElement
}

function GlobalTooltipTrigger({ children }: TooltipTriggerProps) {
  const { content, side, sideOffset, align, alignOffset, id, arrow } = useTooltip()
  const { showTooltip, hideTooltip, currentTooltip } = useGlobalTooltip()
  const triggerRef = React.useRef<HTMLElement>(null)

  const handleOpen = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()

    showTooltip({ content, rect, side, sideOffset, align, alignOffset, id, arrow })
  }, [showTooltip, content, side, sideOffset, align, alignOffset, id, arrow])

  const handleMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      ;(children.props as React.HTMLAttributes<HTMLElement>)?.onMouseEnter?.(e)
      handleOpen()
    },
    [handleOpen, children.props],
  )

  const handleMouseLeave = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      ;(children.props as React.HTMLAttributes<HTMLElement>)?.onMouseLeave?.(e)
      hideTooltip()
    },
    [hideTooltip, children.props],
  )

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      ;(children.props as React.HTMLAttributes<HTMLElement>)?.onFocus?.(e)
      handleOpen()
    },
    [handleOpen, children.props],
  )

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      ;(children.props as React.HTMLAttributes<HTMLElement>)?.onBlur?.(e)
      hideTooltip()
    },
    [hideTooltip, children.props],
  )

  React.useEffect(() => {
    if (currentTooltip?.id !== id) return
    if (!triggerRef.current) return

    if (currentTooltip.content === content && currentTooltip.arrow === arrow) return

    const rect = triggerRef.current.getBoundingClientRect()

    showTooltip({ content, rect, side, sideOffset, align, alignOffset, id, arrow })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, arrow, currentTooltip?.id])

  return React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    "data-state": currentTooltip?.id === id ? "open" : "closed",
    "data-side": side,
    "data-align": align,
    "data-slot": "tooltip-trigger",
  } as React.HTMLAttributes<HTMLElement>)
}

export {
  GlobalTooltip,
  GlobalTooltipContent,
  GlobalTooltipTrigger,
  useTooltip,
  type TooltipProps,
  type TooltipContentProps,
  type TooltipTriggerProps,
}
