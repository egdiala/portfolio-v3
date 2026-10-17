"use client"

import { BusinessAvatar } from "./business-avatar"
import { IconChevronExpand } from "./icons"
import type { Business } from "./types"
import { DropdownMenuTrigger } from "./ui/dropdown-menu"

// SidebarMenuButton's default variant at its lg size, without the Sidebar provider it reads its state from.
const menuButton =
  "flex h-16 w-full flex-1 cursor-pointer items-center gap-2 overflow-hidden rounded-none p-2 text-left text-sm ring-melun-ring outline-hidden transition-all duration-300 ease-out hover:bg-transparent focus-visible:ring-2 active:bg-transparent active:text-inherit [&>svg]:size-4 [&>svg]:shrink-0"

/** The active business at the top of the sidebar. */
export function SwitcherTrigger({ business }: Readonly<{ business: Business }>) {
  return (
    <DropdownMenuTrigger asChild>
      <button type="button" className={menuButton}>
        <BusinessAvatar
          business={business}
          decorative
          className="absolute top-3.5 left-[7px] size-9 rounded-full"
          imageClassName="object-cover"
        />
        <span className="ml-11 grid flex-1 text-left">
          <span className="truncate text-base leading-6 font-medium text-melun-teal-950">{business.name}</span>
          <span className="truncate text-sm leading-5 text-melun-neutral-950">{business.email}</span>
        </span>
        <IconChevronExpand className="shrink-0 text-melun-neutral-800" />
      </button>
    </DropdownMenuTrigger>
  )
}
