"use client"

import type { ComponentProps, FocusEvent } from "react"

// With mandatory snapping, the browser's own focus scroll on a peeking card gets
// snapped back, leaving the focused element half off-screen.
export function SnapRail({ onFocus, ...props }: ComponentProps<"div">) {
    function alignFocusedItem(event: FocusEvent<HTMLDivElement>) {
        onFocus?.(event)
        const { target, currentTarget: rail } = event
        // Pointer focus is skipped so a click on a peeking card isn't scrolled out from under the cursor.
        if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return

        const item = Array.from(rail.children).find((child) => child.contains(target))
        if (!(item instanceof HTMLElement)) return

        rail.scrollTo({ left: item.offsetLeft - Number.parseFloat(getComputedStyle(rail).scrollPaddingLeft) })
    }

    return <div {...props} onFocus={alignFocusedItem} />
}
