import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-sans text-sm leading-5 font-medium whitespace-nowrap transition-all duration-500 ease-out outline-none select-none focus-visible:ring-[3px] focus-visible:ring-melun-ring/50 active:scale-98 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        ghost: "text-melun-teal-950 hover:bg-melun-neutral-100 data-[state=open]:bg-melun-neutral-100",
      },
      size: {
        icon: "size-9",
        "icon-sm": "size-8 place-content-center",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "icon",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
