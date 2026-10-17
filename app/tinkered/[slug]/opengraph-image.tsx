import { OG_SIZE, ogImage } from "@/lib/og/og-image"
import { getWriteup } from "@/lib/tinkered"

// The slugs come from the page's static params, which would otherwise make
// this prerender once per writeup and keep the same chart forever.
export const dynamic = "force-dynamic"

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const work = getWriteup(params.slug)
  return [
    {
      id: "chart",
      alt: `${work?.title ?? "Tinkered works"} by stephen diala, written over a hand-drawn sea chart`,
      size: OG_SIZE,
      contentType: "image/png",
    },
  ]
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = getWriteup(slug)
  return ogImage({ title: work?.title ?? "Tinkered works", eyebrow: work ? "Tinkered works" : undefined })
}
