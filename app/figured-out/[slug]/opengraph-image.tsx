import { OG_SIZE, ogImage } from "@/lib/og/og-image"
import { getArticle } from "@/lib/figured-out"

// The slugs come from the page's static params, which would otherwise make
// this prerender once per article and keep the same chart forever.
export const dynamic = "force-dynamic"

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  return [
    {
      id: "chart",
      alt: `${article?.title ?? "Things I've figured out"} by stephen diala, written over a hand-drawn sea chart`,
      size: OG_SIZE,
      contentType: "image/png",
    },
  ]
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  return ogImage({
    title: article?.title ?? "Things I've figured out",
    eyebrow: article ? "Things I've figured out" : undefined,
  })
}
