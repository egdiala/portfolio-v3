import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/metadata"
import { getWriteups } from "@/lib/tinkered"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/tinkered", ...getWriteups().map((work) => `/tinkered/${work.slug}`)]
  return paths.map((path) => ({ url: new URL(path, SITE_URL).href }))
}
