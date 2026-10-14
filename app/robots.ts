import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/lab/", "/where"] },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  }
}
