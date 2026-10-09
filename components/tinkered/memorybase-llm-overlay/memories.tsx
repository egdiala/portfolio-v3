"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FILTERS, MEMORIES, panel, scroller } from "./constants"
import { SearchIcon } from "./icons"
import { MemoryRow } from "./memory-row"
import type { MemoryFilter } from "./types"

export function Memories() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<MemoryFilter>("all")

  const term = query.trim().toLowerCase()
  const results = MEMORIES.filter(
    (memory) =>
      (filter === "all" || memory.kind === filter) &&
      (memory.title.toLowerCase().includes(term) || memory.description.toLowerCase().includes(term)),
  )

  return (
    <div className={panel}>
      <label className="flex shrink-0 items-center gap-2 border-b border-mmb-contrast-high/8 px-5 transition-colors duration-150 ease-out focus-within:border-mmb-contrast-high/40">
        <SearchIcon className="size-4.5 shrink-0 text-mmb-contrast-low" />
        <span className="sr-only">Search memories</span>
        {/* iOS zooms the page when a focused field is under 16px. */}
        <input
          type="search"
          value={query}
          placeholder="Search context..."
          onChange={(event) => setQuery(event.target.value)}
          className="h-12.5 w-full min-w-0 flex-1 bg-transparent py-3 text-mmb-sm text-mmb-content caret-mmb-contrast-high outline-none placeholder:text-mmb-contrast-low ios:text-base [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      <div role="group" aria-label="Filter memories" className="flex shrink-0 items-center gap-2.5 px-4.5 py-4">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              "relative cursor-pointer rounded-sm text-mmb-2xs leading-5 font-medium outline-none after:absolute after:-inset-x-1 after:-inset-y-3 focus-visible:ring-2 focus-visible:ring-mmb-content focus-visible:ring-offset-2 focus-visible:ring-offset-mmb-background-light",
              filter === option.value ? "text-mmb-content" : "text-mmb-content/40",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {results.length > 0 ? (
        <ul className={cn(scroller, "gap-1.5 pb-1.5")}>
          {results.map((memory) => (
            <li key={memory.id}>
              <MemoryRow memory={memory} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="grid flex-1 place-content-center text-mmb-sm text-mmb-content/40">
          No memories found
        </p>
      )}
    </div>
  )
}
