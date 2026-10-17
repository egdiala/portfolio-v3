import type { SVGProps } from "react"

export function PauseIcon(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <rect x="3.75" y="2.75" width="3" height="10.5" rx="1" fill="currentColor" />
      <rect x="9.25" y="2.75" width="3" height="10.5" rx="1" fill="currentColor" />
    </svg>
  )
}
