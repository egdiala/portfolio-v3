import { OG_SIZE, ogImage } from "@/lib/og/og-image"

export const alt = "stephen diala, written over a hand-drawn sea chart"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogImage({ eyebrow: "Frontend engineer" })
}
