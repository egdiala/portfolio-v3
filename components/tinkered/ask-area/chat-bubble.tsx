"use client"

import Markdown from "markdown-to-jsx/react"
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"
import { focusRing, referencePill } from "./constants"
import { OrbitDots } from "./orbit-trigger"
import type { ChatMessage } from "./types"

const MARKDOWN = {
  // Answers come from a model, so nothing in them is trusted as markup.
  disableParsingRawHTML: true,
  overrides: { a: { props: { target: "_blank", rel: "noopener noreferrer" } } },
}

export function ChatBubble({ message }: Readonly<{ message: ChatMessage }>) {
  const time = useTimeScale()
  const fromAi = message.sender === "ai"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex flex-col gap-2 pb-3", fromAi ? "items-start" : "items-end")}
    >
      <div className={cn("flex w-full flex-col gap-1.5", fromAi ? "pr-4" : "pl-4")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={time.transition({ type: "spring", duration: 0.3, bounce: 0.15 })}
        >
          <div
            className={cn(
              "flex-1 rounded-b-md px-3 py-2.5",
              fromAi ? "origin-top-left rounded-tr-md bg-area-rose/13" : "origin-top-right rounded-tl-md bg-area-contrast-high/6",
            )}
          >
            <AnimatePresence mode="popLayout">
              {message.loading ? (
                <motion.div key="loader">
                  <OrbitDots className="py-1" />
                  <span className="sr-only">Ask Area is answering.</span>
                </motion.div>
              ) : (
                <motion.div key="message" className="text-area-base leading-4 font-normal text-area-contrast-high-90">
                  {fromAi ? (
                    <div className="area-prose">
                      <Markdown options={MARKDOWN}>{message.message}</Markdown>
                    </div>
                  ) : (
                    <p className="text-area-base leading-4 font-normal text-area-contrast-high-90">{message.message}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        {fromAi && !message.loading && message.references?.length ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {message.references.map((reference, index) => (
              <motion.div
                key={reference.url}
                viewport={{ once: true }}
                initial={{ x: 10, opacity: 0, filter: "blur(2px)" }}
                whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                transition={time.transition({ type: "tween", ease: "easeOut", duration: 0.3, delay: index * 0.2 })}
                className={referencePill}
              >
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("flex min-w-0 items-center gap-1 rounded-sm focus-visible:outline-offset-2", focusRing)}
                >
                  <span className="truncate">{reference.title}</span>
                  <ArrowUpRight aria-hidden="true" className="size-3 shrink-0" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
