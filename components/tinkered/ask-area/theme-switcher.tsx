"use client"

import { useState, useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronExpandYIcon } from "@/components/icons/chevron-expand-y"
import { DarkLightIcon } from "@/components/icons/dark-light"
import { MoonStarsIcon } from "@/components/icons/moon-stars"
import { SunIcon } from "@/components/icons/sun"
import { cn } from "@/lib/utils"
import { focusRing } from "./constants"
import type { AreaTheme } from "./types"

const NEXT: Record<AreaTheme, AreaTheme> = { system: "dark", dark: "light", light: "system" }
const LABEL: Record<AreaTheme, string> = { system: "System", dark: "Dark", light: "Light" }

const DARK_QUERY = "(prefers-color-scheme: dark)"

function subscribe(notify: () => void) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener("change", notify)
  return () => query.removeEventListener("change", notify)
}

/** The playground's own theme. It starts on System, like the app, and never touches the site around it. */
export function useAreaTheme() {
  const [theme, setTheme] = useState<AreaTheme>("system")
  const systemIsDark = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  )

  return {
    theme,
    isDark: theme === "dark" || (theme === "system" && systemIsDark),
    cycle: () => setTheme((current) => NEXT[current]),
  }
}

export function ThemeSwitcherButton({ theme, onCycle }: Readonly<{ theme: AreaTheme; onCycle: () => void }>) {
  return (
    <button
      type="button"
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[NEXT[theme]]}.`}
      onClick={onCycle}
      className={cn(
        "flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-area-contrast-low transition-colors duration-300 ease-area-out hover:bg-area-contrast-high-6 hover:text-area-contrast-high focus-visible:-outline-offset-2",
        focusRing,
      )}
    >
      <div className="relative flex h-7 flex-1 items-center gap-2 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={theme}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            className="absolute left-0 flex items-center justify-center"
          >
            {theme === "system" ? <DarkLightIcon className="size-4.5" /> : null}
            {theme === "dark" ? <MoonStarsIcon className="size-4.5" /> : null}
            {theme === "light" ? <SunIcon /> : null}
          </motion.div>
        </AnimatePresence>
        <span className="ml-6.5">Theme {LABEL[theme]}</span>
      </div>
      <ChevronExpandYIcon className="size-3" />
    </button>
  )
}
