"use client"

import { BusinessAvatar } from "./business-avatar"
import { IconSettings } from "./icons"
import type { Business } from "./types"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

/** The business you're in, at the top of the menu. In the app, the gear opens its settings. */
export function BusinessHeader({ business }: Readonly<{ business: Business }>) {
  return (
    <div className="flex items-center gap-2 p-4">
      <BusinessAvatar business={business} decorative className="size-9 rounded-full" imageClassName="object-cover" />
      <div className="grid flex-1 text-left text-sm">
        <span className="truncate text-sm leading-5 font-medium text-melun-teal-950">{business.name}</span>
        <span className="truncate text-xs leading-4 text-melun-neutral-950">{business.email}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" type="button" aria-label="Business settings">
            <IconSettings className="shrink-0 text-melun-neutral-800" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          Business settings
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
