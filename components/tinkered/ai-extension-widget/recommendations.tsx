"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"
import { media } from "@/lib/media"
import { InfoIcon, PhotoEditIcon, RefreshIcon } from "./icons"
import type { RecommendationStatus } from "./types"

export type { RecommendationStatus } from "./types"

const PHOTOS = [
  { src: media("tinkered/ai-chrome-extension-widget/buds-1.jpg"), alt: "Pink earbuds in an open charging case" },
  { src: media("tinkered/ai-chrome-extension-widget/buds-2.jpg"), alt: "Navy earbuds beside their charging case" },
  { src: media("tinkered/ai-chrome-extension-widget/buds-3.jpg"), alt: "White earbuds in an open charging case" },
]

const previewClassName = "rounded bg-[#E0E1E3] px-2 py-1 text-xs text-[#343639]"

export const RECOMMENDATIONS: ReadonlyArray<{
  title: string
  detail: string
  regenerate?: boolean
  preview: ReactNode
}> = [
  {
    title: "Title Optimization",
    detail: "Too generic and lacks key phrases that buyers commonly search for.",
    regenerate: true,
    preview: (
      <div className={previewClassName}>
        <p>
          <span className="sr-only">Current title: </span>
          <s>Bluetooth Earbuds with Charging Case</s>
        </p>
        <p className="font-bold text-[#010101]">
          <span className="sr-only">Suggested title: </span>
          Wireless Bluetooth Earbuds with Noise-Cancelling, Charging Case, 24-Hour Battery Life
        </p>
      </div>
    ),
  },
  {
    title: "Image Enhancements",
    detail: "Replace low-quality images for better clarity.",
    preview: (
      <ul className="grid grid-cols-3 gap-4">
        {PHOTOS.map((photo) => (
          <li key={photo.alt} className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={photo.src} alt={photo.alt} fill sizes="80px" className="object-cover" />
            <span className="absolute inset-0 bg-black/30" />
            <PhotoEditIcon className="absolute right-1 bottom-1 text-white" />
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Price Changes",
    detail: "Adjust price to $19.99 for competitiveness.",
    preview: (
      <p className={`flex gap-2 ${previewClassName}`}>
        <span className="sr-only">Current price: </span>
        <s>$39.99</s>
        <span className="sr-only">Suggested price: </span>
        <span className="font-bold text-[#010101]">$19.99</span>
      </p>
    ),
  },
]

// The info icon is 13px wide with a 4px gap; the title slides into its place.
const ICON_SHIFT = -17

/**
 * While the AI works, a conic gradient spins behind the card and the card
 * clips 2px off its edges, so the gradient shows as a border. Rotating a layer
 * keeps the spin on the compositor instead of repainting the gradient.
 */
export function RecommendationCard({
  index,
  status,
}: Readonly<{ index: number; status: RecommendationStatus }>) {
  const time = useTimeScale()
  const { title, detail, regenerate, preview } = RECOMMENDATIONS[index]
  const working = status === "working"
  const resolved = status === "accepted"
  const fade = time.transition({ type: "tween", ease: "easeOut", duration: 0.3 })

  return (
    <div className="relative isolate">
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: working ? 1 : 0 }}
        transition={fade}
        className="absolute inset-0 -z-10 overflow-hidden rounded-[10px]"
      >
        <span
          style={{ animationDuration: `${time.ms(3000)}ms`, animationPlayState: working ? "running" : "paused" }}
          className="absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-1/2 animate-spin bg-[conic-gradient(#ff4545,#00ff99,#006aff,#ff0095,#ff4545)] motion-reduce:animate-none"
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ clipPath: working ? "inset(2px round 8px)" : "inset(0px round 8px)" }}
        transition={time.transition({ type: "spring", duration: 0.3, bounce: 0 })}
        className="grid gap-2 rounded-lg bg-[#F2F3F4] p-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <motion.span
              initial={false}
              animate={{ opacity: resolved ? 0 : 1, scale: resolved ? 0.5 : 1 }}
              transition={fade}
              className="text-[#DC2828]"
            >
              <InfoIcon />
            </motion.span>
            <motion.span
              initial={false}
              animate={{ x: resolved ? ICON_SHIFT : 0 }}
              transition={time.transition({ type: "spring", duration: 0.4, bounce: 0, delay: resolved ? 0.3 : 0 })}
              className="text-xs font-semibold text-[#010101]"
            >
              {title}
            </motion.span>
          </div>
          {regenerate ? <RefreshIcon className="text-[#343639]" /> : null}
        </div>
        <p className="text-[0.6875rem]/3 font-medium text-[#343639]">{detail}</p>
        {preview}
      </motion.div>
    </div>
  )
}
