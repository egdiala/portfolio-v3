"use server"

import { createHash, timingSafeEqual } from "node:crypto"
import { headers } from "next/headers"
import { isTimeZone, parseWhere, saveWhere } from "@/lib/where"

export type WhereState = { error?: string; saved?: string } | null

const WINDOW_MS = 15 * 60_000
const MAX_TRIES = 5
const recent = new Map<string, number[]>()

function tries(visitor: string) {
  const now = Date.now()
  const fresh = (recent.get(visitor) ?? []).filter((time) => now - time < WINDOW_MS)
  if (fresh.length > 0) recent.set(visitor, fresh)
  else recent.delete(visitor)
  return fresh.length
}

function noteFailure(visitor: string) {
  const fresh = recent.get(visitor) ?? []
  recent.set(visitor, [...fresh, Date.now()])
}

function matches(password: string, secret: string) {
  const left = createHash("sha256").update(password).digest()
  const right = createHash("sha256").update(secret).digest()
  return timingSafeEqual(left, right)
}

export async function updateWhere(_prev: WhereState, formData: FormData): Promise<WhereState> {
  const headerList = await headers()
  const visitor = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  if (tries(visitor) >= MAX_TRIES) return { error: "Too many tries. Wait a few minutes." }

  const secret = process.env.WHERE_SECRET
  if (!secret) return { error: "Set WHERE_SECRET on the server before saving a place." }

  const password = String(formData.get("password") ?? "")
  if (!matches(password, secret)) {
    noteFailure(visitor)
    return { error: "That passphrase doesn’t match." }
  }

  const label = String(formData.get("label") ?? "")
  const timeZone = String(formData.get("timeZone") ?? "").trim()
  if (!isTimeZone(timeZone)) return { error: "Pick a time zone from the list, like Africa/Lagos or Europe/London." }

  const next = parseWhere({ label, timeZone })
  if (!next) return { error: "Use a short place name, like Lagos or Lisbon." }
  if (!next.label) return { error: "Name the place. That’s what the footer shows next to the time." }

  try {
    await saveWhere(next)
  } catch (error) {
    if (error instanceof Error && error.message === "needs-token") {
      return { error: "On the live site this needs a GITHUB_TOKEN that can update this repo." }
    }
    return { error: "The place didn’t save. Try again in a moment." }
  }

  return { saved: `${next.label} · ${next.timeZone}` }
}
