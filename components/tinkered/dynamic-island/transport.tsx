"use client"

import Image from "next/image"
import { motion, type Transition } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { TRACK } from "./constants"
import type { ReactNode, Ref } from "react"

export function Artwork({
  layoutId,
  size,
  radius,
  transition,
}: Readonly<{ layoutId: string; size: number; radius: number; transition: Transition }>) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={transition}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      style={{ width: size, height: size, borderRadius: radius }}
      className="relative block shrink-0 overflow-hidden bg-[#931117]"
    >
      <Image src={TRACK.cover} alt="" fill sizes="53px" className="object-cover" />
    </motion.span>
  )
}

export function TransportButton({
  label,
  onClick,
  children,
  ref,
}: Readonly<{ label: string; onClick: () => void; children: ReactNode; ref?: Ref<HTMLButtonElement> }>) {
  const time = useTimeScale()

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={time.transition({ type: "spring", stiffness: 550, damping: 30, restSpeed: 10 })}
      className="relative z-10 flex size-11 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {children}
    </motion.button>
  )
}
