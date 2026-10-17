import type { DocChunk } from "./search"

const MAX_REFERENCES = 4

export type Reference = { title: string; url: string }

/** What the model is told to end every reply with. Mintlify's replies did the same job with `answer||sources`. */
export const SOURCES_INSTRUCTION = `End every reply with one last line in exactly this form:
SOURCES: 1, 3
List the numbers of the excerpts you used, or write SOURCES: none. Don't mention excerpt numbers anywhere else.`

// Smaller models sometimes dress the line in bold or put it at the end of their last sentence.
const SOURCES_LINE = /(?:^|\s)[*_`]*SOURCES[*_`]*\s*:[*_`]*\s*([^\n]*)$/i

/** Splits a reply into the answer a visitor reads and the excerpts it says it used. */
export function readSources(reply: string, chunks: DocChunk[]): { answer: string; references: Reference[] } {
  const text = reply.trim()
  const match = SOURCES_LINE.exec(text)
  if (!match) return { answer: text, references: [] }

  const references = new Map<string, Reference>()
  for (const number of match[1].match(/\d+/g) ?? []) {
    // A number the model made up points at nothing and is dropped.
    const chunk = chunks[Number(number) - 1]
    if (chunk && !references.has(chunk.url)) references.set(chunk.url, { title: chunk.title, url: chunk.url })
  }

  return { answer: text.slice(0, match.index).trim(), references: [...references.values()].slice(0, MAX_REFERENCES) }
}
