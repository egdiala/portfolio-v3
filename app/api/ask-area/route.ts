import Anthropic from "@anthropic-ai/sdk"
import { answer, type Turn } from "@/lib/ask-area/answer"
import { MAX_QUESTION } from "@/lib/ask-area/limits"

export const maxDuration = 60

const MAX_TURNS = 6
const MAX_TURN_LENGTH = 2000
const WINDOW_MS = 5 * 60_000
const PER_VISITOR = 6
const PER_INSTANCE = 60

// Best effort only: this is one server instance's memory, and instances come and go.
// The limits that hold are the gateway's own (its free tier, or a budget once there are credits) and a firewall rule on this path.
const recent = new Map<string, number[]>()

function allow(visitor: string) {
  const now = Date.now()
  let total = 0
  for (const [key, times] of recent) {
    const fresh = times.filter((time) => now - time < WINDOW_MS)
    if (fresh.length > 0) recent.set(key, fresh)
    else recent.delete(key)
    total += fresh.length
  }

  const mine = recent.get(visitor) ?? []
  if (mine.length >= PER_VISITOR || total >= PER_INSTANCE) return false
  recent.set(visitor, [...mine, now])
  return true
}

// Browsers always send Origin on a POST. Anything without a matching one isn't the playground.
function fromThisSite(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin || !URL.canParse(origin)) return false
  return new URL(origin).host === request.headers.get("host")
}

function readTurns(value: unknown): Turn[] {
  if (!Array.isArray(value)) return []
  const turns = value
    .filter(
      (turn): turn is Turn =>
        typeof turn === "object" &&
        turn !== null &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.trim() !== "",
    )
    .slice(-MAX_TURNS)
    .map(({ role, content }) => ({ role, content: content.slice(0, MAX_TURN_LENGTH) }))
  // The conversation the model sees has to open with the visitor.
  const first = turns.findIndex((turn) => turn.role === "user")
  return first === -1 ? [] : turns.slice(first)
}

const refuse = (error: string, status: number) => Response.json({ error }, { status })

export async function POST(request: Request) {
  if (!fromThisSite(request)) return refuse("forbidden", 403)

  const body = (await request.json().catch(() => null)) as { message?: unknown; history?: unknown } | null
  const question = typeof body?.message === "string" ? body.message.trim() : ""
  if (!question || question.length > MAX_QUESTION) return refuse("invalid", 400)

  if (!process.env.AI_GATEWAY_API_KEY) return refuse("unconfigured", 503)

  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  if (!allow(visitor)) return refuse("rate_limited", 429)

  try {
    const result = await answer(question, readTurns(body?.history))
    if (result.status === "declined") return refuse("declined", 422)
    return Response.json({ answer: result.answer, references: result.references })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return refuse("rate_limited", 429)
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error("Ask Area: the gateway rejected its key.", error.status)
      return refuse("unconfigured", 503)
    }
    if (error instanceof Anthropic.APIConnectionError) return refuse("unavailable", 504)
    if (error instanceof Anthropic.APIError) {
      // The gateway's way of saying its free credit, or a budget, is spent.
      if (error.status === 402) return refuse("exhausted", 503)
      console.error("Ask Area: the gateway returned an error.", error.status, error.type)
      return refuse("unavailable", 502)
    }
    throw error
  }
}
