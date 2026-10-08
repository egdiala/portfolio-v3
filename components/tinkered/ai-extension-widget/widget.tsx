"use client"

import { useCallback, useEffect, useId, useRef, useState, type ComponentProps } from "react"
import { AnimatePresence, LayoutGroup, motion, useReducedMotionConfig } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import {
  BulbIcon,
  ChevronLeftIcon,
  CloseIcon,
  MoreIcon,
  PencilIcon,
  SparklePencilIcon,
  WheelIcon,
} from "./icons"
import { RECOMMENDATIONS, RecommendationCard, type RecommendationStatus } from "./recommendations"
import { Score, toneFor } from "./score"

const BASE_SCORE = 46
const SCORE_PER_FIX = 18
/** How long the AI works on an accepted recommendation. */
const WORK_MS = 2000
/** How long the resolved card stays before the next one slides in. */
const SETTLE_MS = 1000

const slide = {
  enter: (direction: number) => ({ x: `${110 * direction}%`, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: `${-110 * direction}%`, opacity: 0 }),
}

const blurOut = { opacity: 0, filter: "blur(4px)" }

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#010101] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
const pressable = "transition-[scale,opacity] duration-150 ease-out active:scale-[0.96] aria-disabled:active:scale-100"
const label = "text-[0.8125rem]/5 font-medium"

function NavButton({ flip, className, ...props }: ComponentProps<"button"> & { flip?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "relative grid size-[1.875rem] cursor-pointer place-items-center rounded-full bg-[#F2F3F4] text-[#0D1C2E] after:absolute after:-inset-x-1.5 after:-inset-y-[7px] aria-disabled:cursor-not-allowed aria-disabled:text-[#A0A1A3]",
        pressable,
        focusRing,
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon className={flip ? "rotate-180" : undefined} />
    </button>
  )
}

/**
 * The closed pill and the open panel share a layoutId, so opening one morphs
 * it into the other. The score, the pencil, and the count have layoutIds of
 * their own and travel to their new places inside the panel.
 */
export function ListingWidget({
  shared = true,
}: Readonly<{
  /** Give the score, pencil, and count their own layoutIds. Read on mount. */
  shared?: boolean
}>) {
  const time = useTimeScale()
  const pieceId = (name: string) => (shared ? name : undefined)
  const id = useId()
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

  return (
    <LayoutGroup id={id}>
      <div className="grid place-items-center">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              ref={panelRef}
              key="panel"
              layoutId="widget"
              role="dialog"
              aria-label="Listing assistant"
              tabIndex={-1}
              transition={morph}
              style={{ borderRadius: 16 }}
              className="relative flex w-[18.9375rem] flex-col gap-4 overflow-hidden border border-[#F2F3F4] bg-white px-2 pt-2 pb-4 outline-none [grid-area:1/1]"
            >
              <motion.div
                layout="position"
                transition={morph}
                className="flex items-center justify-between border-b border-[#F2F3F4] pb-2"
              >
                <WheelIcon className="text-[#010101]" />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => close(true)}
                  className={cn(
                    "relative grid size-7 cursor-pointer place-items-center rounded-full bg-[#F2F3F4] text-[#0D1C2E] after:absolute after:-inset-2",
                    pressable,
                    focusRing,
                  )}
                >
                  <CloseIcon />
                </button>
              </motion.div>

              <motion.div layout="position" transition={morph} className="flex flex-col items-center gap-2">
                <p className="text-[0.8125rem]/5 font-semibold text-[#010101]">Listing Score</p>
                <Score layoutId={pieceId("score")} score={score} size="lg" rolling transition={morph} />
              </motion.div>

              <AnimatePresence mode="popLayout" initial={false}>
                {finished ? null : (
                  <motion.div
                    key="insight"
                    layout="position"
                    exit={blurOut}
                    transition={{ ...fade, layout: morph }}
                    className="flex items-start gap-1.5 rounded-lg bg-[#F2F3F4] p-2"
                  >
                    <BulbIcon className="shrink-0 text-[#343639]" />
                    <p className="flex-1 text-xs text-[#343639]">
                      <strong className="font-bold text-[#010101]">35% increase</strong> in visibility with
                      better SEO keywords and quality images. See recommendations below.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout="position" transition={morph} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5">
                  <motion.span layoutId={pieceId("pencil")} transition={morph} className="block text-[#010101]">
                    <PencilIcon />
                  </motion.span>
                  <span className="text-[0.8125rem]/5 font-semibold text-[#010101]">Recommendations</span>
                  <motion.span
                    layoutId={pieceId("count")}
                    initial={false}
                    animate={{ backgroundColor: tone.solid }}
                    transition={{ ...morph, backgroundColor: fade }}
                    className="grid size-[1.0625rem] place-items-center rounded-full text-[0.6875rem]/3 font-medium text-white tabular-nums"
                  >
                    {remaining}
                    <span className="sr-only"> left</span>
                  </motion.span>
                </div>

                <AnimatePresence mode="popLayout" initial={false}>
                  {finished ? null : (
                    <motion.div
                      key="queue"
                      layout="position"
                      exit={blurOut}
                      transition={{ ...fade, layout: morph }}
                      className="flex flex-col"
                    >
                      <div className="relative overflow-x-clip">
                        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                          <motion.div
                            key={index}
                            custom={direction}
                            variants={slide}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={slideSpring}
                            aria-label={`Recommendation ${index + 1} of ${RECOMMENDATIONS.length}`}
                            role="group"
                          >
                            <RecommendationCard index={index} status={statuses[index]} />
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <motion.div
                        layout="position"
                        transition={morph}
                        className="mt-2 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <button
                            type="button"
                            onClick={accept}
                            aria-disabled={busy}
                            className={cn(
                              "relative cursor-pointer rounded-lg bg-[#010101] px-2 py-1.5 text-white after:absolute after:-inset-1.5 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                              label,
                              pressable,
                              focusRing,
                            )}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={dismiss}
                            aria-disabled={busy}
                            className={cn(
                              "relative cursor-pointer rounded-sm text-[#343639] after:absolute after:-inset-x-1.5 after:-inset-y-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                              label,
                              pressable,
                              focusRing,
                            )}
                          >
                            Dismiss
                          </button>
                          <MoreIcon className="text-[#0D1C2E]" />
                        </div>
                        <div className="flex items-center gap-3">
                          <NavButton
                            aria-label="Previous recommendation"
                            aria-disabled={!canGoBack}
                            onClick={() => canGoBack && goTo(previous, index)}
                          />
                          <NavButton
                            flip
                            aria-label="Next recommendation"
                            aria-disabled={!canGoForward}
                            onClick={() => canGoForward && goTo(next, index)}
                          />
                        </div>
                      </motion.div>

                      <motion.div layout="position" transition={morph} className="mt-3 flex flex-col gap-3">
                        <hr className="border-[#E0E1E3]" />
                        <button
                          type="button"
                          onClick={() => close(true)}
                          className={cn(
                            "relative w-fit cursor-pointer rounded-lg bg-[#F2F3F4] px-2 py-1.5 text-[#010101] after:absolute after:-inset-1.5",
                            label,
                            pressable,
                            focusRing,
                          )}
                        >
                          Publish
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <motion.button
              ref={triggerRef}
              key="pill"
              layoutId="widget"
              type="button"
              aria-haspopup="dialog"
              aria-label={`Open listing assistant. Score ${score}, ${remaining} recommendations left.`}
              onClick={() => setOpen(true)}
              whileTap={{ scale: 0.95 }}
              transition={morph}
              style={{ borderRadius: 32 }}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 border border-[#F2F3F4] bg-white p-2 [grid-area:1/1]",
                focusRing,
              )}
            >
              <Score layoutId={pieceId("score")} score={score} size="sm" transition={morph} />
              <motion.span
                initial={false}
                animate={{ color: tone.solid }}
                transition={fade}
                className="relative isolate flex items-center gap-2 px-[13px] py-2"
              >
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, backgroundColor: tone.wash }}
                  animate={{ opacity: 1, backgroundColor: tone.wash }}
                  exit={{ opacity: 0, transition: tintOut }}
                  transition={{ ...fade, opacity: tintIn }}
                  className="absolute inset-0 -z-10 rounded-full"
                />
                <motion.span layoutId={pieceId("pencil")} transition={morph} className="block">
                  <SparklePencilIcon />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, borderColor: tone.track }}
                  animate={{ opacity: 1, borderColor: tone.track }}
                  exit={{ opacity: 0, transition: tintOut }}
                  transition={{ ...fade, opacity: tintIn }}
                  className="mr-px h-8 border-l"
                />
                <motion.span
                  layoutId={pieceId("count")}
                  initial={false}
                  animate={{ backgroundColor: tone.solid }}
                  transition={{ ...morph, backgroundColor: fade }}
                  className="grid size-8 place-items-center rounded-full text-xl font-medium text-white tabular-nums"
                >
                  {remaining}
                </motion.span>
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>
    </LayoutGroup>
  )
}
