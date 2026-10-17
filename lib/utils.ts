import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Tokens added to the theme in globals.css. tailwind-merge reads an unknown `text-*`
// as a color, and would drop a custom size whenever a real color follows it.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["mmb-2xs", "mmb-xs", "mmb-sm", "area-xs", "area-sm", "area-base"],
      font: ["area-sans"],
      radius: ["area-xs", "area-lg"],
      ease: ["area-out"],
      shadow: ["mmb-overlay-popup", "mmb-overlay-inner-popup", "area-xs", "area-sm", "area-md"],
      animate: ["mmb-bounce-ball", "area-ping"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
