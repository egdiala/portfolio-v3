"use client"

import type { ComponentType, SVGProps } from "react"
import { motion } from "motion/react"
import { ArrowTopRightIcon } from "@/components/icons/arrow-top-right"
import { AskAreaIcon } from "@/components/icons/ask-area"
import { BookOpen4Icon } from "@/components/icons/book-open-4"
import { CircleCaretRightIcon } from "@/components/icons/circle-caret-right"
import { CircleQuestionIcon } from "@/components/icons/circle-question"
import { HeadsetIcon } from "@/components/icons/headset"
import { Plug2Icon } from "@/components/icons/plug-2"
import { cn } from "@/lib/utils"
import { STARTERS, focusRing, gradientText, row, rowLabel } from "./constants"
import { ThemeSwitcherButton } from "./theme-switcher"
import type { AreaTheme } from "./types"

type Icon = ComponentType<SVGProps<SVGSVGElement>>

// In the app these two open dialogs. Here they hand their question to Ask Area.
const SHORTCUTS: Array<{ label: string; icon: Icon; question: string }> = [
  { label: "Get started with Area", icon: CircleCaretRightIcon, question: STARTERS.start },
  { label: "What is Restaking?", icon: CircleQuestionIcon, question: STARTERS.restaking },
]

const LINKS: Array<{ label: string; icon: Icon; url: string }> = [
  { label: "Docs", icon: BookOpen4Icon, url: "https://docs.area.club/introduction" },
  { label: "API", icon: Plug2Icon, url: "https://docs.area.club/developers/api-reference/introduction" },
  { label: "Support", icon: HeadsetIcon, url: "https://t.me/+j9wUN_m0vhllNmVl" },
]

export function OrbitMenu({
  theme,
  onCycleTheme,
  onAsk,
}: Readonly<{
  theme: AreaTheme
  onCycleTheme: () => void
  /** Open Ask Area, optionally with a question already sent. */
  onAsk: (question?: string) => void
}>) {
  return (
    <>
      <ul className="flex-1 p-1">
        {SHORTCUTS.map((item) => (
          <li key={item.label}>
            <button type="button" onClick={() => onAsk(item.question)} className={cn("group", row, focusRing)}>
              <span>
                <item.icon className="text-area-contrast-low group-hover:text-area-contrast-high" />
              </span>
              <span className={cn(rowLabel, "text-area-contrast-low group-hover:text-area-contrast-high")}>
                {item.label}
              </span>
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => onAsk()}
            className={cn(
              "group animate-area-gradient hover:bg-[linear-gradient(90deg,rgba(255,135,217,0.1)_0%,rgba(144,197,255,0.1)_100%)]",
              row,
              focusRing,
            )}
          >
            <motion.span layoutId="ask-area-icon">
              <AskAreaIcon />
            </motion.span>
            <motion.span layoutId="ask-area-text" className={cn(rowLabel, gradientText)}>
              Ask Area
            </motion.span>
          </button>
        </li>
      </ul>
      <hr className="h-px w-full shrink-0 border-0 bg-area-contrast-high/10" />
      <ul className="flex-1 p-1">
        <li>
          <ThemeSwitcherButton theme={theme} onCycle={onCycleTheme} />
        </li>
        {LINKS.map((item) => (
          <li key={item.label}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(row, focusRing, "text-area-contrast-low hover:text-area-contrast-high")}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex flex-1 items-center gap-1 text-[0.78125rem] whitespace-nowrap">
                {item.label}
                <ArrowTopRightIcon className="translate-y-px" />
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
