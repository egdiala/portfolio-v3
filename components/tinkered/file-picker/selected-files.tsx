"use client"

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  type AnimationPlaybackControls,
} from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import { useDropzoneContext } from "./dropzone"
import {
  HINT_MS,
  iconSwap,
  nameLayout,
  progressExit,
  progressSpring,
  statusSwap,
  swapTransition,
  sweepPress,
  sweepRelease,
  TAP_MS,
} from "./constants"
import { IconCheckCircle, IconClose, IconInfo, IconPdf, IconTrash } from "./icons"
import type { UploadState } from "./types"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Spinner2 } from "./ui/spinner"

// Truncates so a long name gives way to the status on narrow screens, where Try again would otherwise be cut off.
const fileNameClassName = "min-w-0 truncate font-sans text-base leading-6 font-normal tracking-wide text-melun-teal-950"
const statusClassName = "font-sans text-sm leading-5 font-normal tracking-wide text-melun-neutral-950"
// The 20px button keeps its look; the ::before around it makes a 44px target. It reaches 8px left, into
// the gap, so it never covers Try again, and 16px right, past the row's edge.
const iconButtonClassName =
  "relative grid size-5 cursor-pointer place-content-center rounded-full p-0.5 transition-[background-color,scale] duration-150 ease-out outline-none before:absolute before:-inset-y-3 before:-right-4 before:-left-2 focus-visible:ring-[3px] focus-visible:ring-melun-teal-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-98"

type FocusTarget = "cancel" | "trash"

function isHoldKey(event: KeyboardEvent) {
  return event.key === " " || event.key === "Enter"
}

/**
 * Melun's DropzoneSelectedFiles. The row under the dropzone shows each picked
 * file as uploading, completed or failed. On a completed file, holding the
 * trash sweeps a red copy of the row across it, and the file goes when the
 * sweep reaches the end.
 */
export function DropzoneSelectedFiles({
  state,
  progress,
  onCancel,
  onRetry,
  onRemove,
}: Readonly<{
  state?: UploadState
  progress: number
  onCancel: () => void
  onRetry: () => void
  onRemove: () => void
}>) {
  const { src } = useDropzoneContext()
  const time = useTimeScale()
  const id = useId()
  const path = useMotionValue(100)
  const clipPath = useMotionTemplate`inset(0px ${path}% 0px 0px)`
  const sweep = useRef<AnimationPlaybackControls | null>(null)
  const holding = useRef(false)
  const pressedAt = useRef(0)
  const [hint, setHint] = useState(false)
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const rowsRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<FocusTarget | null>(null)
  const showHint = hint && state === "completed"

  // The button that had focus is still mounted here (AnimatePresence waits for it to leave),
  // so this notes which button should take focus once it's gone.
  useLayoutEffect(() => {
    if (rowsRef.current?.contains(document.activeElement)) {
      pendingFocus.current = state === "uploading" ? "cancel" : "trash"
    }
  }, [state])

  useEffect(
    () => () => {
      clearTimeout(hintTimer.current)
      sweep.current?.stop()
    },
    [],
  )

  const focusWhen = useCallback(
    (target: FocusTarget) => (node: HTMLButtonElement | null) => {
      if (node && pendingFocus.current === target) {
        pendingFocus.current = null
        node.focus()
      }
    },
    [],
  )

  const handleRetry = useCallback(() => {
    pendingFocus.current = "cancel"
    onRetry()
  }, [onRetry])

  const handleDelete = useCallback(() => {
    holding.current = true
    pressedAt.current = performance.now()
    clearTimeout(hintTimer.current)
    setHint(false)
    sweep.current?.stop()
    sweep.current = animate(path, 0, {
      ...time.transition(sweepPress),
      onComplete: () => {
        if (!holding.current) return
        holding.current = false
        onRemove()
      },
    })
  }, [path, time, onRemove])

  const handleReset = useCallback(() => {
    if (!holding.current) return
    holding.current = false
    sweep.current?.stop()
    sweep.current = animate(path, 100, time.transition(sweepRelease))
    // A tap does nothing on its own, so say what does.
    if (performance.now() - pressedAt.current < TAP_MS) {
      setHint(true)
      hintTimer.current = setTimeout(() => setHint(false), time.ms(HINT_MS))
    }
  }, [path, time])

  const content = useMemo(() => {
    if (showHint) {
      return (
        <div className="flex items-center gap-2">
          <span className={statusClassName}>Hold to remove</span>
        </div>
      )
    }
    switch (state) {
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <IconCheckCircle className="size-4 text-melun-green-500" />
            <span className={statusClassName}>Completed</span>
          </div>
        )
      case "failed":
        // Try again sits in a 24px line clipped top and bottom, so an outer focus ring gets cut off.
        // Its ::before is the hit area and the focus ring both, drawn inset.
        return (
          <div className="flex items-center gap-2">
            <IconInfo className="size-4 text-melun-red-400" />
            <span className={cn(statusClassName, "text-melun-red-600")}>Failed</span>
            <span className="size-1 rounded-full bg-melun-neutral-500" />
            <Button
              type="button"
              size="sm"
              variant="link-black"
              onClick={handleRetry}
              className="before:absolute before:-inset-x-1.5 before:-inset-y-0.5 before:rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:before:inset-ring-2 focus-visible:before:inset-ring-melun-teal-950"
            >
              Try again
            </Button>
          </div>
        )
      case "uploading":
        return (
          <div className="flex items-center gap-2">
            <Spinner2 />
            <span className={statusClassName}>Uploading…</span>
          </div>
        )
      default:
        return <></>
    }
  }, [state, showHint, handleRetry])

  const iconContent = useMemo(() => {
    switch (state) {
      case "completed":
        return (
          <button
            ref={focusWhen("trash")}
            type="button"
            aria-label="Hold to remove file"
            onPointerDown={handleDelete}
            onPointerUp={handleReset}
            onPointerLeave={handleReset}
            onPointerCancel={handleReset}
            onKeyDown={(event) => {
              if (!isHoldKey(event)) return
              event.preventDefault()
              if (!event.repeat) handleDelete()
            }}
            onKeyUp={(event) => {
              if (isHoldKey(event)) handleReset()
            }}
            onBlur={handleReset}
            onContextMenu={(event) => event.preventDefault()}
            className={`${iconButtonClassName} touch-none select-none hover:bg-melun-red-50`}
          >
            <IconTrash className="size-4 text-melun-red-400" />
          </button>
        )
      case "failed":
        return (
          <button
            ref={focusWhen("trash")}
            type="button"
            aria-label="Remove file"
            onClick={onRemove}
            className={`${iconButtonClassName} hover:bg-melun-red-50`}
          >
            <IconTrash className="size-4 text-melun-red-400" />
          </button>
        )
      case "uploading":
        return (
          <button
            ref={focusWhen("cancel")}
            type="button"
            aria-label="Cancel upload"
            onClick={onCancel}
            className={`${iconButtonClassName} hover:bg-melun-neutral-100`}
          >
            <IconClose className="size-4 text-melun-neutral-800" />
          </button>
        )
      default:
        return <></>
    }
  }, [state, onCancel, onRemove, handleDelete, handleReset, focusWhen])

  const names = src?.map((file) => file.name).join(", ")
  const announcement = {
    uploading: `Uploading ${names}`,
    completed: `${names} uploaded`,
    failed: `${names} failed to upload`,
  }

  return (
    <AnimatePresence>
      {src && (
        <div ref={rowsRef} className="mt-2 flex flex-col gap-1">
          <AnimatePresence>
            {src.map((item, index) => (
              <motion.div
                key={index}
                className="relative inset-0 flex h-15 items-center gap-2 rounded-full bg-white p-3 inset-ring-1 inset-ring-melun-neutral-300"
              >
                <motion.div
                  style={{ clipPath }}
                  aria-hidden="true"
                  className="absolute inset-0 z-1 flex h-15 items-center gap-2 rounded-full bg-transparent p-3 inset-ring-1 inset-ring-melun-red-500"
                >
                  <IconPdf id={`${id}-${index}-sweep`} className="shrink-0" />
                  <div className="flex flex-1 items-center gap-2 overflow-hidden">
                    <span className={fileNameClassName}>{item.name}</span>
                    {/* Invisible stand-ins for the status and the button, so this name truncates where the one underneath does. */}
                    <span className="invisible size-1 shrink-0" />
                    <div className="invisible shrink-0">{content}</div>
                  </div>
                  <span className="invisible size-5 shrink-0" />
                </motion.div>
                <IconPdf id={`${id}-${index}`} className="shrink-0" />
                {/* Clipped only top and bottom: that hides the bar's 6px rise, and Try again's ring can still reach sideways. */}
                <div className="grid min-w-0 flex-1 gap-1 overflow-y-clip">
                  <motion.div
                    layout
                    transition={time.transition(nameLayout)}
                    className="flex w-full min-w-0 items-center gap-2"
                  >
                    <span title={item.name} className={fileNameClassName}>
                      {item.name}
                    </span>
                    <span className="size-1 shrink-0 rounded-full bg-melun-neutral-500" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showHint ? "hint" : state}
                        {...statusSwap}
                        transition={time.transition(swapTransition)}
                        className="z-0 shrink-0"
                      >
                        {content}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                  <AnimatePresence mode="popLayout">
                    {state === "uploading" && (
                      <motion.div
                        key="progress"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6, transition: time.transition(progressExit) }}
                        transition={time.transition(progressSpring)}
                      >
                        <Progress value={progress} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state === "uploading" ? "icon-x" : "icon-trash"}
                    {...iconSwap}
                    transition={time.transition(swapTransition)}
                    className="isolate z-10"
                  >
                    {iconContent}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          <p className="sr-only" aria-live="polite">
            {state ? announcement[state] : ""}
          </p>
        </div>
      )}
    </AnimatePresence>
  )
}
