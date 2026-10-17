import * as React from "react"

import { cn } from "@/lib/utils"

interface ContainerProps extends React.ComponentProps<"div"> {
  as?: React.ElementType
}

function Container({ className, as: Comp = "div", ...props }: ContainerProps) {
  return (
    <Comp
      data-slot="container"
      className={cn("@container", className)}
      {...props}
    />
  )
}

function ContainerInner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container-inner"
      className={cn("mx-auto w-full max-w-5xl", className)}
      {...props}
    />
  )
}

export { Container, ContainerInner }
