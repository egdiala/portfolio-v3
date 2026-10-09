import type { SVGProps } from "react"

export function DarkLightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" {...props}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor">
        <path d="M9,6v6c1.657,0,3-1.343,3-3s-1.343-3-3-3Z" fill="currentColor" stroke="none" />
        <path d="M9,12c-1.657,0-3-1.343-3-3s1.343-3,3-3V1.75C4.996,1.75,1.75,4.996,1.75,9s3.246,7.25,7.25,7.25v-4.25Z" fill="currentColor" stroke="none" />
        <circle cx="9" cy="9" r="7.25" />
      </g>
    </svg>
  )
}
