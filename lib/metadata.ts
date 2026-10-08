import type { Metadata } from "next"

export const SITE_NAME = "stephen diala"

export const SITE_DESCRIPTION =
  "Frontend engineer at Moniepoint who cares how an interface feels, down to the weight of a hover. A wizard will show you what I've shipped and tinkered with."

export const SITE_URL = new URL("https://egdiala.dev")

/**
 * A page's title, description, canonical URL, and Open Graph tags. Pages that
 * set `openGraph` replace the layout's whole object, so every page builds its
 * own here. Twitter fills its card from these, and the image comes from the
 * route's `opengraph-image`.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: Readonly<{ title: string; description: string; path: string; type?: "website" | "article" }>): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE_NAME, locale: "en_US", url: path, title, description },
  }
}
