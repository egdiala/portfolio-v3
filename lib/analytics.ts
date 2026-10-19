import { init, track } from "@pug-sh/browser"

/** Every event the site sends, so names and properties stay consistent. */
export type AnalyticsEvents = {
  section_viewed: { section: string }
  clip_viewed: { clip: string }
  demo_interacted: { demo: string; via: "click" | "keyboard" | "hover" }
  note_finished: { slug: string; seconds: number }
  outbound_click: { url: string }
  project_link_clicked: { project: string; status: string }
  contact_click: { method: string }
  contact_hovered: { port: string }
  // Pug's well-known media events. Its own `position` field is a protobuf Duration the browser SDK
  // can't send (it drops bigints), so positions go in plain-number properties instead.
  audio_started: { audioId: string }
  audio_play: { audioId: string; source: "episode" | "moment" | "mini_player"; moment?: string; positionSeconds: number }
  audio_pause: { audioId: string; positionSeconds: number; listenedSeconds: number }
  audio_completed: { audioId: string }
  podcast_progress: { audioId: string; percent: number }
  podcast_moment_completed: { audioId: string; moment: string }
  podcast_error: { audioId: string }
}

type Props = Record<string, string | number | boolean>
const send = track as (event: string, props?: Props, options?: { immediate?: boolean }) => void

const PROJECT_ID = process.env.NEXT_PUBLIC_PUG_PROJECT_ID
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUG_PUBLIC_KEY
// Vercel sets this to "production" on egdiala.dev only. Everywhere else events are logged, not sent.
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
const OPT_OUT_KEY = "analytics-opt-out"

let enabled = false

/** egdiala.dev/?notrack stops counting this browser; /?track undoes it. */
function optedOut() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.has("notrack")) localStorage.setItem(OPT_OUT_KEY, "1")
    if (params.has("track")) localStorage.removeItem(OPT_OUT_KEY)
    return localStorage.getItem(OPT_OUT_KEY) === "1"
  } catch {
    return false
  }
}

export function initAnalytics() {
  if (enabled || !PROJECT_ID || !PUBLIC_KEY || optedOut()) return

  init(PROJECT_ID, {
    apiKey: PUBLIC_KEY,
    // No pageView: it fires on each of Next's history calls, so Back counts twice and the title is the previous page's.
    autoCapture: { click: true, scroll: true, form: true, rageClick: true, deadClick: true },
    excludeAutomatedBrowsers: true,
    dryRun: !isProduction,
    // /where is only for me, so my visits stay out.
    beforeSend: (event) => (window.location.pathname === "/where" ? null : event),
  })
  enabled = true
}

export function isAnalyticsEnabled() {
  return enabled
}

export function trackEvent<K extends keyof AnalyticsEvents>(
  name: K,
  props: AnalyticsEvents[K],
  options?: { immediate?: boolean },
) {
  if (!enabled) return
  const clean = Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as Props
  if (!isProduction) console.info("[analytics]", name, clean)
  send(name, clean, options)
}

export function trackPageView() {
  if (!enabled) return
  if (!isProduction) console.info("[analytics]", "page_view", window.location.pathname)
  send("page_view")
}
