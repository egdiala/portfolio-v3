import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Tokens added to the theme in globals.css. tailwind-merge reads an unknown `text-*`
// as a colour, and would drop a custom size whenever a real colour follows it.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["mmb-2xs", "mmb-xs", "mmb-sm"],
      shadow: ["mmb-overlay-popup", "mmb-overlay-inner-popup"],
      animate: ["mmb-bounce-ball"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
