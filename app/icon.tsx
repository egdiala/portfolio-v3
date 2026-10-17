import { ImageResponse } from "next/og"
import { monogram } from "@/lib/og/monogram.mjs"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default async function Icon() {
  const { element, options } = await monogram(size.width)
  return new ImageResponse(element, options)
}
