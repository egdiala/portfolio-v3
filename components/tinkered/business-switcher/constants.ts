import type { Business } from "./types"

export const BUSINESSES: Business[] = [
  {
    name: "Acme Technology Limited",
    logo: "/tinkered/business-switcher/acme.png",
    email: "admin@acme.com",
    plan: "Enterprise",
  },
  {
    name: "Cursor AI",
    logo: "/tinkered/business-switcher/cursor.jpg",
    email: "hello@cursor.ai",
    plan: "AI",
  },
  {
    name: "Stripe",
    logo: "/tinkered/business-switcher/stripe.svg",
    email: "hello@stripe.com",
    plan: "Finance",
  },
  {
    name: "Netflix",
    logo: "/tinkered/business-switcher/netflix.jpg",
    email: "hello@netflix.com",
    plan: "Entertainment",
  },
]

/** The chevron's turn and the menu's open and close, both set in CSS. */
export const CHEVRON_MS = 200
export const MENU_MS = 150

export const heightSpring = { type: "spring", bounce: 0.1 } as const
export const tooltipSpring = { type: "spring", stiffness: 300, damping: 25 } as const

// Motion's own defaults for a scale, a fade and a layout change, written out so the playground's speed control can slow them.
export const defaultScale = { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } as const
export const defaultFade = { type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.35, 1] } as const
export const defaultLayout = { type: "tween", duration: 0.45, ease: [0.4, 0, 0.1, 1] } as const

/** The plus button unblurs as it arrives. */
export const addButtonSwap = {
  initial: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
}

/** The +4 avatar only fades and scales. */
export const overflowSwap = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}
