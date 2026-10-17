// Snapshots Area's public docs into lib/ask-area/docs.json, which the Ask Area
// playground searches to ground its answers. Re-run to refresh:
//   node scripts/snapshot-area-docs.mjs
import { writeFile } from "node:fs/promises"

const INDEX = "https://docs.area.club/llms.txt"
const OUT = new URL("../lib/ask-area/docs.json", import.meta.url)

// Mintlify wraps every page in a pointer to the index and a hosting footer.
const PREAMBLE = /^(?:>[^\n]*\n)+\n*/
const FOOTER = /\n*This documentation is built and hosted on \[Mintlify\][^\n]*\n*$/

function clean(markdown) {
  return markdown
    .replace(PREAMBLE, "")
    .replace(FOOTER, "")
    // Components keep their title as a bold line; everything else about the tag goes.
    .replace(/<(?:Card|Step|Accordion|Update|Tab)\b[^>]*?\b(?:title|label)="([^"]+)"[^>]*>/g, "\n**$1**\n")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const index = await (await fetch(INDEX)).text()
const entries = [...index.matchAll(/^- \[([^\]]+)\]\((https:\/\/docs\.area\.club\/[^)]+)\.md\)(?::\s*(.*))?$/gm)]

const pages = []
for (const [, title, url, description = ""] of entries) {
  const response = await fetch(`${url}.md`)
  if (!response.ok) {
    console.warn(`skipped ${url} (${response.status})`)
    continue
  }
  pages.push({ title, description: description.trim(), url, markdown: clean(await response.text()) })
}

await writeFile(OUT, `${JSON.stringify({ source: INDEX, fetchedAt: new Date().toISOString().slice(0, 10), pages }, null, 2)}\n`)
console.log(`${pages.length} pages, ${pages.reduce((total, page) => total + page.markdown.length, 0)} characters`)
