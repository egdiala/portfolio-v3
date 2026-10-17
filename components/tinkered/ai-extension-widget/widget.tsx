"use client"

import { useId } from "react"
import { AnimatePresence, LayoutGroup } from "motion/react"
import { ListingContext, useListing } from "./hooks/use-listing"
import { ListingPanel } from "./listing-panel"
import { ListingPill } from "./listing-pill"

/**
 * The closed pill and the open panel share a layoutId, so opening one morphs
 * it into the other. The score, the pencil, and the count have layoutIds of
 * their own and travel to their new places inside the panel.
 */
export function ListingWidget({
  shared = true,
}: Readonly<{
  /** Give the score, pencil, and count their own layoutIds. Read on mount. */
  shared?: boolean
}>) {
  const id = useId()
  const listing = useListing(shared)

  return (
    <ListingContext value={listing}>
      <LayoutGroup id={id}>
        <div className="grid place-items-center">
          <AnimatePresence initial={false}>
            {listing.open ? <ListingPanel key="panel" /> : <ListingPill key="pill" />}
          </AnimatePresence>
          <p role="status" className="sr-only">
            {listing.announcement}
          </p>
        </div>
      </LayoutGroup>
    </ListingContext>
  )
}
