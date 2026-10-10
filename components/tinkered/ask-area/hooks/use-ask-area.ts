"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { MAX_QUESTIONS } from "../constants"
import type { ChatMessage } from "../types"

const FAILURES: Record<string, string> = {
  rate_limited: "That's a lot of questions in a short time. Give it a few minutes, then ask again.",
  unconfigured: "Ask Area isn't connected to its AI on this page yet.",
  exhausted: "Ask Area has used up its free answers for now. Please try again later.",
  declined: "I can't help with that one. Try asking me something about Area.",
}
const UNREACHABLE = "I couldn't reach Area's docs just now. Please try again."

let lastId = 0
const nextId = () => ++lastId

/**
 * One conversation with the docs. It starts over whenever the chat is reopened,
 * as it does in the app, so `asked` is owned by the caller and outlives it.
 */
export function useAskArea(asked: number, onAsked: () => void, starter?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const latest = useRef(messages)
  const started = useRef(false)
  const atLimit = asked >= MAX_QUESTIONS

  useEffect(() => {
    latest.current = messages
  }, [messages])

  const isLoading = messages.some((message) => message.loading)

  const send = useCallback(
    async (question: string) => {
      const text = question.trim()
      if (!text || latest.current.some((message) => message.loading) || atLimit) return

      const history = latest.current
        .filter((message) => !message.failed)
        .map((message) => ({ role: message.sender === "me" ? "user" : "assistant", content: message.message }))

      onAsked()
      const pending: ChatMessage[] = [
        { id: nextId(), sender: "me", message: text },
        { id: nextId(), sender: "ai", message: "", loading: true },
      ]
      latest.current = [...latest.current, ...pending]
      setMessages(latest.current)

      let reply: Pick<ChatMessage, "message" | "references" | "failed">
      try {
        const response = await fetch("/api/ask-area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        })
        const body = await response.json()
        reply = response.ok
          ? { message: body.answer, references: body.references }
          : { message: FAILURES[body.error] ?? UNREACHABLE, failed: true }
      } catch {
        reply = { message: UNREACHABLE, failed: true }
      }

      setMessages((current) =>
        current.map((message) => (message.id === pending[1].id ? { ...message, ...reply, loading: false } : message)),
      )
    },
    [atLimit, onAsked],
  )

  // A shortcut row in the menu opens the chat with its question already asked.
  useEffect(() => {
    if (!starter || started.current) return
    started.current = true
    void send(starter)
  }, [starter, send])

  return { messages, isLoading, atLimit, send }
}
