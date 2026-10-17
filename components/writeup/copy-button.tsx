"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { Check, Copy } from "lucide-react"

const swap = {
  initial: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  transition: { type: "spring", duration: 0.3, bounce: 0 },
} as const

export function CopyButton({ code }: Readonly<{ code: string }>) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(id)
  }, [copied])

  const copy = () => {
    navigator.clipboard?.writeText(code).then(
      () => setCopied(true),
      () => setCopied(false),
    )
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group/copy relative inline-flex size-11 cursor-pointer items-center justify-center text-neutral-500 transition-[color,scale] duration-150 ease-out outline-none hover:text-foreground active:scale-[0.96]"
    >
      <span className="sr-only">Copy code</span>
      <span
        aria-hidden="true"
        className="absolute size-8 rounded-full transition-colors duration-150 ease-out group-hover/copy:bg-neutral-100 group-focus-visible/copy:ring-[3px] group-focus-visible/copy:ring-foreground"
      />
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span key="copied" {...swap} className="relative flex">
              <Check aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </motion.span>
          ) : (
            <motion.span key="copy" {...swap} className="relative flex">
              <Copy aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </MotionConfig>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  )
}
