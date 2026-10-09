import docs from "./docs.json"

/** One section of a docs page: the unit that gets searched, sent to the model, and cited. */
export type DocChunk = {
  /** The section's heading, or the page title for a page's opening. */
  title: string
  page: string
  /** The page's one-line description from the docs index. Searched, not sent. */
  summary: string
  url: string
  text: string
}

const MAX_CHUNK = 4000
const MAX_RESULTS = 5
const MAX_TOTAL = 20_000
// BM25's usual constants.
const K1 = 1.5
const B = 0.75

const STOPWORDS = new Set(
  "a an and are as at be by can do does for from how i in is it me my of on or that the this to what when where which who why with you your".split(
    " ",
  ),
)

// The same rule Mintlify uses for its heading anchors.
const anchor = (heading: string) =>
  heading.toLowerCase().replaceAll(" ", "-").replaceAll(/[^a-zA-Z0-9-_#]/g, "")

// Just enough stemming for "audited" to find "audits" and "fees" to find "fee".
function stem(word: string) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3)
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1)
  return word
}

const tokenize = (text: string) =>
  (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).map(stem).filter((word) => word.length > 1 && !STOPWORDS.has(word))

/** Breaks a long section at line ends, so an API reference page doesn't arrive as one block. */
function pieces(text: string) {
  if (text.length <= MAX_CHUNK) return [text]
  const out: string[] = []
  let current = ""
  for (const line of text.split("\n")) {
    if (current && current.length + line.length + 1 > MAX_CHUNK) {
      out.push(current)
      current = ""
    }
    current = current ? `${current}\n${line}` : line
  }
  if (current) out.push(current)
  return out
}

const CHUNKS: DocChunk[] = docs.pages.flatMap((page) =>
  page.markdown.split(/\n(?=#{2,3} )/).flatMap((section) => {
    const heading = /^#{2,3} (.+)/.exec(section)?.[1].trim()
    return pieces(section).map((text) => ({
      title: heading ?? page.title,
      page: page.title,
      summary: page.description,
      url: heading ? `${page.url}#${anchor(heading)}` : page.url,
      text,
    }))
  }),
)

// Headings count three times: a section named after the question is usually the one that answers it.
const INDEX = CHUNKS.map((chunk) => {
  const words = tokenize(`${chunk.title} ${chunk.title} ${chunk.title} ${chunk.page} ${chunk.summary} ${chunk.text}`)
  const counts = new Map<string, number>()
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1)
  return { counts, length: words.length, heading: new Set(tokenize(chunk.title)) }
})

const AVERAGE_LENGTH = INDEX.reduce((total, entry) => total + entry.length, 0) / INDEX.length

const FREQUENCY = new Map<string, number>()
for (const { counts } of INDEX) {
  for (const word of counts.keys()) FREQUENCY.set(word, (FREQUENCY.get(word) ?? 0) + 1)
}

// What to hand over when nothing matches, so the model can say what the docs do cover.
const OVERVIEW = CHUNKS.filter((chunk) => /\/(introduction|resources\/faq)$/.test(chunk.url)).slice(0, 2)

/** The sections of Area's docs that best match a question, most relevant first. */
export function search(query: string): DocChunk[] {
  const words = [...new Set(tokenize(query))]

  const ranked = INDEX.map(({ counts, length, heading }, at) => {
    let score = 0
    for (const word of words) {
      const count = counts.get(word)
      if (!count) continue
      const rarity = Math.log(1 + (INDEX.length - FREQUENCY.get(word)! + 0.5) / (FREQUENCY.get(word)! + 0.5))
      score += (rarity * count * (K1 + 1)) / (count + K1 * (1 - B + (B * length) / AVERAGE_LENGTH))
    }
    // A heading that is exactly what was asked about beats one that only contains it, so
    // "What is restaking?" lands on the glossary's Restaking ahead of every section with the word in its name.
    const shared = words.filter((word) => heading.has(word)).length
    const closeness = shared / (words.length + heading.size - shared)
    return { at, score: score * (1 + closeness) }
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const results: DocChunk[] = []
  let total = 0
  for (const { at } of ranked) {
    const chunk = CHUNKS[at]
    if (total + chunk.text.length > MAX_TOTAL) continue
    results.push(chunk)
    total += chunk.text.length
    if (results.length === MAX_RESULTS) break
  }

  return results.length > 0 ? results : OVERVIEW
}
