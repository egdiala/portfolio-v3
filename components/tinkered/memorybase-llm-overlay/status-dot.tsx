"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { BOUNCE_MS } from "./constants"
import { useOverlayState } from "./hooks/use-overlay"
import { CheckSmallIcon } from "./icons"

export function StatusDot() {
  const { mode, ms, popSpring } = useOverlayState()

  return (
    // Keyed by mode, so the bounce always starts from rest and the check mounts fresh.
    <span
      key={mode}
      style={mode === "syncing" ? { animationDuration: `${ms(BOUNCE_MS)}ms` } : undefined}
      className={cn(
        "absolute top-px -right-px grid place-content-center rounded-full",
        mode === "syncing"
          ? "animate-mmb-bounce-ball bg-mmb-yellow motion-reduce:animate-none"
          : "bg-mmb-primary",
        mode === "attached" ? "size-2" : "size-1.5",
      )}
    >
      {mode === "attached" ? (
        <motion.span
          initial={{ scale: 0.7, opacity: 0, filter: "blur(4px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={popSpring}
          className="block text-white"
        >
          <CheckSmallIcon />
        </motion.span>
      ) : null}
    </span>
  )
}
