"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { initAnalytics, isAnalyticsEnabled, trackEvent, trackPageView } from "@/lib/analytics"

const DEMO_HOVER_MS = 800
const CONTACT_HOVER_MS = 500
const SECTION_DWELL_MS = 1000
const CLIP_DWELL_MS = 1500

/**
 * Pug analytics for the whole site, driven by data attributes so components carry no analytics code:
 *
 *   data-track-section="shipped"      → section_viewed, once it has been on screen for 1s
 *   data-track-clip="dynamic-island"  → clip_viewed, once it has been on screen for 1.5s
 *   data-track-demo                   → demo_interacted, on first click, key press or 0.8s hover
 *   data-track-project="MemoryBase"   → project_link_clicked
 *   data-track-contact="github"       → contact_click, and contact_hovered after 0.5s
 *
 * Hovers and demo use count once per page view. Other external and mailto links are tracked on their own.
 */
export function Analytics() {
  const pathname = usePathname()
  const seen = useRef(new Set<string>())

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    seen.current.clear()
    trackPageView()
  }, [pathname])

  useEffect(() => {
    if (!isAnalyticsEnabled()) return

    const once = (key: string, send: () => void) => {
      if (seen.current.has(key)) return
      seen.current.add(key)
      send()
    }
    // One demo per tinkered page, so the page names it.
    const touchDemo = (target: EventTarget | null, via: "click" | "keyboard" | "hover") => {
      if (!(target instanceof Element) || !target.closest("[data-track-demo]")) return
      const demo = window.location.pathname
      once(`demo:${demo}`, () => trackEvent("demo_interacted", { demo, via }))
    }

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const project = event.target.closest<HTMLElement>("[data-track-project]")
      if (project) {
        const { trackProject = "", trackStatus = "" } = project.dataset
        trackEvent("project_link_clicked", { project: trackProject, status: trackStatus }, { immediate: true })
        return
      }
      const contact = event.target.closest<HTMLElement>("[data-track-contact]")
      if (contact) {
        trackEvent("contact_click", { method: contact.dataset.trackContact ?? "" }, { immediate: true })
        return
      }

      const link = event.target.closest("a[href]")
      if (!(link instanceof HTMLAnchorElement)) return
      const url = new URL(link.href)
      if (url.protocol === "mailto:") {
        trackEvent("contact_click", { method: "email_link" }, { immediate: true })
        return
      }
      if (!url.protocol.startsWith("http") || url.origin === window.location.origin) return
      // Sent at once, in case the link replaces this page.
      trackEvent("outbound_click", { url: url.origin + url.pathname }, { immediate: true })
    }

    let hovered: Element | null = null
    let hoverTimer: number | undefined
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return
      const target = event.target.closest("[data-track-demo], [data-track-contact]")
      if (target === hovered) return
      hovered = target
      window.clearTimeout(hoverTimer)
      if (!(target instanceof HTMLElement)) return

      const port = target.dataset.trackContact
      hoverTimer =
        port === undefined
          ? window.setTimeout(() => touchDemo(target, "hover"), DEMO_HOVER_MS)
          : window.setTimeout(() => once(`contact:${port}`, () => trackEvent("contact_hovered", { port })), CONTACT_HOVER_MS)
    }
    const onPointerDown = (event: PointerEvent) => touchDemo(event.target, "click")
    const onKeyDown = (event: KeyboardEvent) => touchDemo(event.target, "keyboard")

    document.addEventListener("click", onClick, { capture: true })
    document.addEventListener("pointerover", onPointerOver, { passive: true })
    document.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true })
    document.addEventListener("keydown", onKeyDown, { capture: true })
    return () => {
      window.clearTimeout(hoverTimer)
      document.removeEventListener("click", onClick, { capture: true })
      document.removeEventListener("pointerover", onPointerOver)
      document.removeEventListener("pointerdown", onPointerDown, { capture: true })
      document.removeEventListener("keydown", onKeyDown, { capture: true })
    }
  }, [])

  // Sections and clips count once they've properly been on screen for a moment (half visible, or
  // filling 40% of the screen when tall), so scrolling past doesn't count.
  useEffect(() => {
    if (!isAnalyticsEnabled()) return

    let observer: IntersectionObserver | undefined
    const timers = new Map<Element, number>()
    const isOnScreen = (entry: IntersectionObserverEntry) =>
      entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.4

    const frame = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const element = entry.target as HTMLElement
            if (!isOnScreen(entry)) {
              window.clearTimeout(timers.get(element))
              timers.delete(element)
              continue
            }
            if (timers.has(element)) continue

            const { trackSection: section, trackClip: clip } = element.dataset
            timers.set(
              element,
              window.setTimeout(
                () => {
                  observer?.unobserve(element)
                  if (section) trackEvent("section_viewed", { section })
                  else if (clip) trackEvent("clip_viewed", { clip })
                },
                section ? SECTION_DWELL_MS : CLIP_DWELL_MS,
              ),
            )
          }
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
      )
      for (const element of document.querySelectorAll("[data-track-section], [data-track-clip]")) {
        observer.observe(element)
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      for (const timer of timers.values()) window.clearTimeout(timer)
    }
  }, [pathname])

  return null
}
