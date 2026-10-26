import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-sans text-sm leading-5 font-medium tracking-wide whitespace-nowrap transition-transform duration-150 ease-out outline-none select-none focus-visible:ring-[3px] focus-visible:ring-melun-teal-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-98 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        "link-black": "h-auto! p-0! text-melun-teal-950 underline-offset-4 hover:underline disabled:text-melun-neutral-700",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-full px-3 has-[>svg]:px-2.5",
      },
    },
    defaultVariants: {
      variant: "link-black",
      size: "sm",
    },
  },
)

function Button({ className, variant, size, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
