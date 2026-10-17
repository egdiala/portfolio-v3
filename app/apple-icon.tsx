import { ImageResponse } from "next/og"
import { monogram } from "@/lib/og/monogram.mjs"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default async function AppleIcon() {
  const { element, options } = await monogram(size.width, { rounded: false })
  return new ImageResponse(element, options)
}
