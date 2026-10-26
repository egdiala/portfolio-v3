import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

export function IconCheckCircle(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.99997 1.11133C5.09886 1.11133 1.11108 5.09911 1.11108 10.0002C1.11108 14.9013 5.09886 18.8891 9.99997 18.8891C14.9011 18.8891 18.8889 14.9013 18.8889 10.0002C18.8889 5.09911 14.9011 1.11133 9.99997 1.11133ZM14.27 7.45355L9.54775 13.5647C9.39664 13.7602 9.16664 13.8791 8.91997 13.888C8.90886 13.888 8.89886 13.888 8.88886 13.888C8.65331 13.888 8.42775 13.788 8.26886 13.6124L5.76886 10.8347C5.46108 10.4924 5.48886 9.96577 5.83108 9.65688C6.17442 9.35022 6.69886 9.37688 7.00886 9.71911L8.83997 11.7547L12.9522 6.43355C13.2333 6.06911 13.7578 6.00244 14.1211 6.28355C14.4855 6.56466 14.5522 7.088 14.2711 7.45244L14.27 7.45355Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M12.4446 3.55566L3.55566 12.4446" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.55566 3.55566L12.4446 12.4446" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconInfo(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.00003 0.888672C4.07905 0.888672 0.888916 4.07881 0.888916 7.99978C0.888916 11.9208 4.07905 15.1109 8.00003 15.1109C11.921 15.1109 15.1111 11.9208 15.1111 7.99978C15.1111 4.07881 11.921 0.888672 8.00003 0.888672ZM8.66669 11.3331C8.66669 11.7012 8.36812 11.9998 8.00003 11.9998C7.63194 11.9998 7.33336 11.7012 7.33336 11.3331V8.44423H6.88892C6.52083 8.44423 6.22225 8.14565 6.22225 7.77756C6.22225 7.40947 6.52083 7.11089 6.88892 7.11089H7.55558C8.16847 7.11089 8.66669 7.60912 8.66669 8.22201V11.3331ZM8.00003 5.99978C7.50936 5.99978 7.11114 5.60067 7.11114 5.11089C7.11114 4.62112 7.50936 4.22201 8.00003 4.22201C8.49069 4.22201 8.88892 4.62112 8.88892 5.11089C8.88892 5.60067 8.49069 5.99978 8.00003 5.99978Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconTrash(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M3.70898 4.22245L5.76766 1.88466C6.12499 1.47577 6.75874 1.47578 7.10986 1.89356L9.10721 4.22245" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3926 2.00879L12.2904 4.22211" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        opacity="0.3"
        d="M12.2905 4.22266L11.8665 12.3204C11.8167 13.2627 11.0363 14.0004 10.0914 14.0004H5.91005C4.96427 14.0004 4.18471 13.2627 4.13493 12.3204L3.71094 4.22266H12.2905Z"
        fill="currentColor"
      />
      <path
        d="M12.2905 4.22266L11.8665 12.3204C11.8167 13.2627 11.0363 14.0004 10.0914 14.0004H5.91005C4.96427 14.0004 4.18471 13.2627 4.13493 12.3204L3.71094 4.22266H12.2905Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.55566 6.88867L6.77789 11.3331" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.44488 6.88867L9.22266 11.3331" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** The row shows two of these at once (the sweep copies the row), so the mask and filter ids are per instance. */
export function IconPdf({ id, ...props }: IconProps & { id: string }) {
  const mask = `${id}-mask`
  const pageShadow = `${id}-page-shadow`
  const labelShadow = `${id}-label-shadow`

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" {...props}>
      <circle cx="18" cy="18" r="18" fill="#F9F9FB" />
      <mask id={mask} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
        <circle cx="18" cy="18" r="18" fill="#D9D9D9" />
      </mask>
      <g mask={`url(#${mask})`}>
        <rect x="4" y="27.9932" width="4.9316" height="12.6979" transform="rotate(-76.1283 4 27.9932)" fill="#C10007" />
        <g filter={`url(#${pageShadow})`}>
          <path
            d="M28 38H12C9.79086 38 8 36.2091 8 34V10C8 7.79086 9.79086 6 12 6H20.5171C21.6227 6 22.679 6.45763 23.4352 7.26424L30.9181 15.246C31.6132 15.9874 32 16.9656 32 17.9818V34C32 36.2091 30.2091 38 28 38Z"
            fill="white"
          />
          <path
            d="M12 6.5H20.5166C21.484 6.5 22.4086 6.90067 23.0703 7.60645L30.5537 15.5879C31.1617 16.2365 31.4999 17.0924 31.5 17.9814V34C31.5 35.933 29.933 37.5 28 37.5H12C10.067 37.5 8.5 35.933 8.5 34V10C8.5 8.067 10.067 6.5 12 6.5Z"
            stroke="#FFC9C9"
          />
        </g>
        <path d="M22 7V13C22 15.2091 23.7909 17 26 17H31" stroke="#FFC9C9" />
        <path d="M4 20H26C27.1046 20 28 20.8954 28 22V26C28 27.1046 27.1046 28 26 28H4V20Z" fill="#FB2C36" />
        <g filter={`url(#${labelShadow})`}>
          <path
            d="M9.43084 26.5V21.388H11.2468C11.7908 21.388 12.2015 21.5293 12.4788 21.812C12.7562 22.0893 12.8948 22.484 12.8948 22.996C12.8948 23.5133 12.7428 23.908 12.4388 24.18C12.1348 24.452 11.6922 24.588 11.1108 24.588H10.1268V26.5H9.43084ZM10.1268 24.028H11.0308C11.4575 24.028 11.7615 23.94 11.9428 23.764C12.1242 23.588 12.2148 23.3293 12.2148 22.988C12.2148 22.316 11.8655 21.98 11.1668 21.98H10.1268V24.028ZM14.1746 26.5V21.388H16.0706C16.7959 21.388 17.3373 21.604 17.6946 22.036C18.0519 22.468 18.2306 23.0733 18.2306 23.852V23.868C18.2306 24.7267 18.0386 25.38 17.6546 25.828C17.2706 26.276 16.6919 26.5 15.9186 26.5H14.1746ZM14.8706 25.948H15.8306C16.4333 25.948 16.8679 25.7827 17.1346 25.452C17.4013 25.1213 17.5346 24.6307 17.5346 23.98V23.66C17.5346 23.1107 17.4199 22.6947 17.1906 22.412C16.9666 22.124 16.5666 21.98 15.9906 21.98H14.8706V25.948ZM19.5512 26.5V21.388H22.7672V21.988H20.2472V23.828H22.6072V24.412H20.2472V26.5H19.5512Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <filter id={pageShadow} x="7" y="5" width="35" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="1" dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.843137 0 0 0 0 0.85098 0 0 0 0.85 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="3" dy="3" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.843137 0 0 0 0 0.85098 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="5" dy="5" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.843137 0 0 0 0 0.85098 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="7" dy="8" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.997023 0 0 0 0 0.842977 0 0 0 0 0.850419 0 0 0 0.02 0" />
          <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow" result="shape" />
        </filter>
        <filter id={labelShadow} x="9.43091" y="21.3879" width="13.3362" height="5.61206" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
