"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

/** Goes at the end of an article. Sends note_finished with how long it took, so readers stand out from skimmers. */
export function ReadTracker({ slug }: Readonly<{ slug: string }>) {
  const marker = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = marker.current
    if (!element) return
    const openedAt = performance.now()
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      trackEvent("note_finished", { slug, seconds: Math.round((performance.now() - openedAt) / 1000) })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [slug])

  return <div ref={marker} aria-hidden="true" />
}
