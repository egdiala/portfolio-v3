import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

export function LogoIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.9215 1.11361C17.0421 0.816325 18.2381 1.04606 19.1669 1.73735L22.4778 4.20162C23.4341 4.91352 23.9972 6.03225 23.9975 7.22087L24 21.675C24.0001 22.2504 23.6304 22.762 23.0822 22.9446C22.5069 23.136 21.8731 22.9202 21.5366 22.4178L19.5814 19.4968L8.15748 22.4768C6.99866 22.7791 5.76347 22.5182 4.82812 21.7732L1.42352 19.0621C0.52519 18.3466 0.00282426 17.263 0.00246729 16.1178L1.82295e-07 8.23629C-0.000529709 6.52679 1.1542 5.03108 2.81373 4.59084L15.9215 1.11361ZM4.38528 6.71255C3.28628 7.0109 2.52397 8.00491 2.52385 9.13875V16.6494L5.05016 18.5342V10.0645C5.05022 9.49761 5.43198 9.00061 5.9815 8.85144L18.9449 5.33246L16.4186 3.4465L4.38528 6.71255Z"
      />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path d="M1.76001 7.00409L4.01001 10.0041L10.24 1.74609" {...stroke} />
    </svg>
  )
}

export function CheckSmallIcon(props: IconProps) {
  return (
    <svg width="5" height="4" viewBox="0 0 5 4" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.80765 1.25129L2.55765 3.75129C2.41995 3.90409 2.22565 3.99349 2.01955 3.99889C2.01275 3.99939 2.00685 3.99939 2.00005 3.99939C1.80185 3.99939 1.61045 3.92079 1.46975 3.77969L0.21975 2.52969C-0.07325 2.23669 -0.07325 1.76209 0.21975 1.46919C0.51275 1.17629 0.98735 1.17619 1.28025 1.46919L1.97165 2.16009L3.69235 0.247494C3.97065 -0.0591056 4.44335 -0.0845055 4.75195 0.191795C5.05955 0.469095 5.08495 0.943195 4.80765 1.25129Z" />
    </svg>
  )
}

export function DoubleCheckIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path d="M0.75 6.75009L2.7744 9.25409L7.5 2.99609" {...stroke} />
      <path d="M5.91162 8.49589L6.52462 9.25409L11.2502 2.99609" {...stroke} />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <g opacity="0.7">
        <path d="M10.75 6H1.25" {...stroke} />
        <path d="M6 10.75V1.25" {...stroke} />
      </g>
    </svg>
  )
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <g opacity="0.7">
        <path d="M5.26807 6.73176L11.0731 0.926758" {...stroke} />
        <path d="M11.25 4.5V0.75H7.5" {...stroke} />
        <path
          d="M9.25 6.285V8.75C9.25 9.855 8.355 10.75 7.25 10.75H3.25C2.145 10.75 1.25 9.855 1.25 8.75V4.75C1.25 3.645 2.145 2.75 3.25 2.75H5.715"
          {...stroke}
        />
      </g>
    </svg>
  )
}

export function StarsIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3.492 10.5078L2.546 10.8228L2.23 11.7698C2.128 12.0758 1.621 12.0758 1.519 11.7698L1.203 10.8228L0.257 10.5078C0.104 10.4568 0 10.3138 0 10.1518C0 9.98983 0.104 9.84683 0.257 9.79583L1.203 9.48083L1.519 8.53383C1.57 8.38083 1.713 8.27783 1.874 8.27783C2.035 8.27783 2.179 8.38183 2.229 8.53383L2.545 9.48083L3.491 9.79583C3.644 9.84683 3.748 9.98983 3.748 10.1518C3.748 10.3138 3.644 10.4568 3.491 10.5078H3.492Z" />
      <path d="M11.526 4.803L8.424 3.576L7.197 0.474C7.084 0.188 6.807 0 6.5 0C6.193 0 5.916 0.188 5.803 0.474L4.576 3.576L1.474 4.803C1.188 4.916 1 5.193 1 5.5C1 5.807 1.188 6.084 1.474 6.197L4.576 7.424L5.803 10.526C5.916 10.812 6.193 11 6.5 11C6.807 11 7.084 10.812 7.197 10.526L8.424 7.424L11.526 6.197C11.812 6.084 12 5.807 12 5.5C12 5.193 11.812 4.916 11.526 4.803Z" />
    </svg>
  )
}

export function FolderIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2.25 8.75V4.75C2.25 3.645 3.145 2.75 4.25 2.75H6.201C6.808 2.75 7.381 3.025 7.761 3.498L8.364 4.25H13.75C14.855 4.25 15.75 5.145 15.75 6.25V9.094"
        {...stroke}
      />
      <path
        d="M4.25 6.75H13.75C14.855 6.75 15.75 7.645 15.75 8.75V13.25C15.75 14.355 14.855 15.25 13.75 15.25H4.25C3.145 15.25 2.25 14.355 2.25 13.25V8.75C2.25 7.645 3.145 6.75 4.25 6.75Z"
        {...stroke}
      />
    </svg>
  )
}

export function FolderEmptyIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g opacity="0.4">
        <path
          d="M18.3333 6.99984C19.8067 6.99984 21 8.19317 21 9.6665V16.9998C21 18.4732 19.8067 19.6665 18.3333 19.6665H5.66667C4.19333 19.6665 3 18.4732 3 16.9998V6.33317C3 4.85984 4.19333 3.6665 5.66667 3.6665H8.1C8.88267 3.6665 9.62533 4.0105 10.132 4.6065L12.164 6.99984H18.3333Z"
          {...stroke}
        />
        <path
          d="M8.75 13C9.44 13 10 12.4404 10 11.75C10 11.0596 9.44 10.5 8.75 10.5C8.06 10.5 7.5 11.0596 7.5 11.75C7.5 12.4404 8.06 13 8.75 13Z"
          fill="currentColor"
        />
        <path
          d="M15.25 13C15.94 13 16.5 12.4404 16.5 11.75C16.5 11.0596 15.94 10.5 15.25 10.5C14.56 10.5 14 11.0596 14 11.75C14 12.4404 14.56 13 15.25 13Z"
          fill="currentColor"
        />
        <path
          d="M10.4444 16.6662H13.5554C13.9848 16.6662 14.3332 16.3178 14.3332 15.8885C14.3332 14.6005 13.2878 13.5552 11.9998 13.5552C10.7118 13.5552 9.6665 14.6005 9.6665 15.8885C9.6665 16.3178 10.015 16.6662 10.4444 16.6662Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export function ChatIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.1689 2.2521C5.3301 2.1578 2.25 5.449 2.25 9.2889V14.25C2.25 15.0784 2.9188 15.75 3.7473 15.75H8.2235C12.5515 15.75 15.8425 12.6695 15.748 8.8306C15.6595 5.237 12.7625 2.3404 9.1689 2.2521Z"
        {...stroke}
      />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path d="M15.7501 15.75L11.6387 11.6386" {...stroke} />
      <path
        d="M7.75 13.25C10.7875 13.25 13.25 10.7875 13.25 7.75C13.25 4.7125 10.7875 2.25 7.75 2.25C4.7125 2.25 2.25 4.7125 2.25 7.75C2.25 10.7875 4.7125 13.25 7.75 13.25Z"
        {...stroke}
      />
    </svg>
  )
}
