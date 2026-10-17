// Writes app/favicon.ico from the same monogram as app/icon.tsx, at 16, 32 and
// 48px. Next can't generate a favicon, so re-run this after changing
// lib/og/monogram.mjs, from the repo root:
//   node scripts/favicon.mjs
import { writeFile } from "node:fs/promises"
import { ImageResponse } from "next/og.js"
import { monogram } from "../lib/og/monogram.mjs"

const SIZES = [16, 32, 48]

const images = await Promise.all(
  SIZES.map(async (size) => {
    const { element, options } = await monogram(size)
    return Buffer.from(await new ImageResponse(element, options).arrayBuffer())
  }),
)

// An ICO is a directory of images. Each entry here holds a whole PNG, which every current browser reads.
const header = Buffer.alloc(6 + 16 * images.length)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(images.length, 4)
let offset = header.length
images.forEach((png, index) => {
  const entry = 6 + 16 * index
  header.writeUInt8(SIZES[index], entry)
  header.writeUInt8(SIZES[index], entry + 1)
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(png.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += png.length
})

await writeFile("app/favicon.ico", Buffer.concat([header, ...images]))
console.log(`app/favicon.ico: ${SIZES.join(", ")}px, ${offset} bytes`)
