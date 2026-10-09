import type { OrbitCustom } from "./types"

export const MENU = { width: 200, height: 240 }
export const CHAT = { width: 350, height: 380 }
/** How far above the orb's baseline the container rests. */
const LIFT = 48

export const MAX_QUESTIONS = 8

/** What the two shortcut rows ask on the visitor's behalf. */
export const STARTERS = {
  start: "How do I get started using Area?",
  restaking: "What is restaking?",
}

const closed = { height: 0, width: 0, opacity: 0 }
const menu = { ...MENU, bottom: LIFT, opacity: 1 }
const chat = (width: number) => ({ height: CHAT.height, width, bottom: LIFT, opacity: 1 })

// Each view enters at the size the other one had, so the swap reads as one container changing shape.
export const variants = {
  "orbit-menu": {
    initial: ({ prevView, chatWidth }: OrbitCustom) => (prevView === "ask-area" ? chat(chatWidth) : closed),
    animate: menu,
    exit: closed,
  },
  "ask-area": {
    initial: ({ prevView }: OrbitCustom) => (prevView === "closed" ? closed : menu),
    animate: ({ chatWidth }: OrbitCustom) => chat(chatWidth),
    exit: ({ isOpen }: OrbitCustom) => (isOpen ? menu : closed),
  },
}

export const spring = { type: "spring", duration: 0.5, bounce: 0.15 } as const

// Motion's own defaults for a scale and a fade, written out so the playground's speed control can slow them.
export const defaultScale = { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } as const
export const defaultFade = { type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.35, 1] } as const

export const focusRing = "outline-none focus-visible:outline-[1.5px] focus-visible:outline-area-contrast-high"

export const row =
  "flex h-8 w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left transition-colors duration-300 ease-area-out hover:bg-area-contrast-high-6 focus-visible:-outline-offset-2"

export const rowLabel = "text-[0.78125rem] whitespace-nowrap transition-colors duration-300 ease-area-out"

export const gradientText =
  "animate-area-gradient-text! bg-[linear-gradient(90deg,var(--area-rose)_0%,var(--area-contrast-low)_100%)] bg-clip-text text-transparent group-hover:bg-[linear-gradient(90deg,var(--area-rose)_0%,var(--area-contrast-high)_100%)]"

export const headerButton =
  "cursor-pointer text-area-contrast-low transition-colors duration-300 ease-area-out hover:text-area-contrast-high focus-visible:outline-offset-2"

export const input =
  "flex h-full w-full rounded-md border border-area-contrast-high-12 bg-area-contrast-high-3 px-3 py-1 pr-8.5 text-area-sm text-area-contrast-high caret-area-contrast-high outline-none inset-shadow-[0_1px_0_hsl(0_0%_0%/.02)] transition-all duration-200 ease-area-out placeholder:text-area-contrast-low disabled:cursor-not-allowed disabled:opacity-50 dark:border-transparent dark:bg-area-background-dark dark:shadow-[0_1px_0_var(--area-white-30)] ios:text-base"

export const sendButton =
  "absolute top-1/2 right-2 isolate inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-area-xs transition-all duration-300 ease-area-out select-none focus-visible:outline-offset-2 data-[disabled=false]:text-area-background data-[disabled=false]:[background:radial-gradient(100%_100%_at_50%_0%,var(--area-white-30)_0%,rgba(255,255,255,0)_100%),var(--area-contrast-high)] data-[disabled=false]:[box-shadow:0px_0px_0px_1px_var(--area-contrast-high),0px_50px_20px_-4px_rgba(0,0,0,0.01),0px_28px_17px_-3px_rgba(0,0,0,0.03),0px_13px_13px_-2px_rgba(0,0,0,0.05),0px_3px_7px_-1px_rgba(0,0,0,0.06),inset_0px_1px_0px_var(--area-white-30)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-area-contrast-high-10 data-[disabled=true]:text-area-contrast-low dark:data-[disabled=false]:[background:radial-gradient(100%_100%_at_50%_0%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_100%),var(--area-contrast-high-95)] dark:data-[disabled=false]:[box-shadow:0px_27px_11px_rgba(0,0,0,0.02),0px_15px_9px_rgba(0,0,0,0.08),0px_7px_7px_rgba(0,0,0,0.13),0px_2px_4px_rgba(0,0,0,0.15),inset_0px_1px_0px_#fff]"

export const referencePill =
  "relative isolate inline-flex h-5.5 w-fit max-w-full items-center justify-center rounded-sm px-1.5 text-area-xs whitespace-nowrap text-area-contrast-high shadow-area-sm inset-ring-1 inset-ring-white/3 transition-[background,translate] duration-200 select-none [background:radial-gradient(100%_100%_at_50%_0%,hsl(0_0%_100%/0.07)_0%,hsl(0_0%_100%/0)_100%),var(--area-background-light)] after:pointer-events-none after:absolute after:inset-[-1px] after:rounded-[inherit] after:bg-linear-to-b after:from-area-contrast-high/6.5 after:to-area-contrast-high/10 after:p-px after:[mask:linear-gradient(black,black)_content-box,linear-gradient(black,black)] after:[mask-composite:exclude] active:translate-y-px active:shadow-area-xs dark:inset-shadow-[1px_1px_0px_hsl(0_0%_100%/.08)] dark:after:hidden"
