"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpIcon } from "@/components/icons/arrow-up"
import { AskAreaIcon } from "@/components/icons/ask-area"
import { ChevronRightIcon } from "@/components/icons/chevron-right"
import { XMarkIcon } from "@/components/icons/x-mark"
import { MAX_QUESTION } from "@/lib/ask-area/limits"
import { cn } from "@/lib/utils"
import { ChatBubble } from "./chat-bubble"
import { focusRing, headerButton, input, sendButton } from "./constants"
import { useAskArea } from "./hooks/use-ask-area"

export function AskArea({
  asked,
  onAsked,
  starter,
  onBack,
  onClose,
}: Readonly<{
  /** How many questions this page load has spent. It outlives the chat, which starts over each time it opens. */
  asked: number
  onAsked: () => void
  /** A question to send as the chat opens. */
  starter?: string
  onBack: () => void
  onClose: () => void
}>) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [isBottomVisible, setIsBottomVisible] = useState(true)
  const { messages, isLoading, atLimit, send } = useAskArea(asked, onAsked, starter)

  const canSend = query.trim() !== "" && !isLoading && !atLimit

  const sendMessage = () => {
    if (!canSend) return
    void send(query)
    setQuery("")
  }

  const scrollToBottom = () => {
    const viewport = viewportRef.current
    viewport?.scroll({ behavior: "smooth", top: viewport.scrollHeight })
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleScroll = () => {
      setIsBottomVisible(viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 2)
    }

    viewport.addEventListener("scroll", handleScroll)
    // New messages change the height without a scroll event.
    handleScroll()

    return () => viewport.removeEventListener("scroll", handleScroll)
  }, [messages])

  // The app focuses the input as the chat opens. Here that waits for a pointer that
  // doesn't raise a keyboard, and for focus that isn't busy in the controls below.
  useEffect(() => {
    const field = inputRef.current
    if (!field || !window.matchMedia("(pointer: fine)").matches) return
    const active = document.activeElement
    const stage = field.closest("[data-playground-stage]")
    if (!active || active === document.body || stage?.contains(active)) field.focus({ preventScroll: true })
  }, [])

  return (
    <div className="flex h-full flex-col bg-area-background-light">
      <div className="relative flex h-11 items-center gap-2 border-b border-b-area-contrast-high-8 px-4 py-3 text-area-contrast-low">
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={onBack}
          className={cn("flex items-center gap-1 rounded-sm", headerButton, focusRing)}
        >
          <ChevronRightIcon className="-rotate-180" />
          Back
        </motion.button>
        <div className="absolute inset-x-0 mx-auto flex w-fit items-center gap-2">
          <motion.span layoutId="ask-area-icon">
            <AskAreaIcon />
          </motion.span>
          <motion.span
            layoutId="ask-area-text"
            className="bg-[linear-gradient(90deg,var(--area-rose)_0%,var(--area-contrast-high)_100%)] bg-clip-text text-transparent"
          >
            Ask Area
          </motion.span>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={cn("ml-auto rounded-sm", headerButton, focusRing)}
        >
          <XMarkIcon />
        </motion.button>
      </div>
      <div className="flex h-full flex-col justify-between pb-1">
        <div className="relative h-[calc(380px-85px)] w-full">
          <div
            ref={viewportRef}
            role="log"
            aria-label="Conversation"
            tabIndex={0}
            className={cn(
              "size-full overflow-y-auto overscroll-contain [scrollbar-width:none] focus-visible:-outline-offset-2 [&::-webkit-scrollbar]:hidden",
              focusRing,
            )}
          >
            <div className="flex flex-1 flex-col gap-1 px-4 pt-2.5">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            {!isBottomVisible ? (
              <motion.button
                type="button"
                key="scroll-button"
                aria-label="Scroll to the latest message"
                initial={{ opacity: 0, filter: "blur(4px)", scale: 0.6 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(4px)", scale: 0.6 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToBottom}
                className={cn(
                  "absolute bottom-1 left-1/2 z-1 grid size-7 origin-bottom -translate-x-1/2 cursor-pointer place-content-center rounded-full border border-area-contrast-high/10",
                  focusRing,
                )}
              >
                <ArrowDown aria-hidden="true" className="size-5 text-area-contrast-high" />
              </motion.button>
            ) : null}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {!isBottomVisible ? (
              <motion.div
                key="scroll-bottom-overlay"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                className="pointer-events-none absolute bottom-0 flex h-5 w-full bg-linear-to-b from-area-background/0 from-0% via-area-background/20 via-20% to-area-background to-100%"
              />
            ) : null}
          </AnimatePresence>
        </div>
        <div className="relative h-9 px-1">
          <input
            ref={inputRef}
            type="text"
            aria-label="Ask Area a question"
            value={query}
            maxLength={MAX_QUESTION}
            disabled={atLimit}
            enterKeyHint="send"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              // Enter also confirms a word in an input method, which isn't a send.
              if (event.key === "Enter" && !event.nativeEvent.isComposing) sendMessage()
            }}
            placeholder={atLimit ? "That's every question for this visit." : "Type your questions here..."}
            className={input}
          />
          <button
            type="button"
            aria-label="Send"
            aria-disabled={!canSend}
            data-disabled={!canSend}
            onClick={sendMessage}
            className={cn(sendButton, focusRing)}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
