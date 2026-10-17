import type { SVGProps } from "react"

export function PlayIcon(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      {/* Sits half a unit right of center: a triangle's visual weight is left of its box. */}
      <path
        d="M5.5 3.73C5.5 2.96 6.33 2.48 7 2.86L12.98 7.13C13.65 7.51 13.65 8.49 12.98 8.87L7 13.14C6.33 13.52 5.5 13.04 5.5 12.27V3.73Z"
        fill="currentColor"
      />
    </svg>
  )
}
