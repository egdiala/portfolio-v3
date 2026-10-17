"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useEpisode } from "./episode-provider"

/** While any of this is on screen, its own controls are, so the mini player stays away. */
export function HidesMiniPlayer({ className, children }: Readonly<{ className?: string; children: ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null)
  const { setInlineInView } = useEpisode()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInlineInView(Boolean(entry?.isIntersecting)))
    observer.observe(element)
    return () => {
      observer.disconnect()
      setInlineInView(false)
    }
  }, [setInlineInView])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
