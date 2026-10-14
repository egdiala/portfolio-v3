import { SITE_URL } from "@/lib/metadata"
import { getWhere } from "@/lib/where"
import { Container, ContainerInner } from "./ui/container"
import { FooterClock } from "./footer-clock"
import Link from "next/link"

const ELSEWHERE = [
  { href: "https://x.com/e_diala", label: "X" },
  { href: "https://github.com/egdiala", label: "GitHub" },
  { href: "https://www.linkedin.com/in/egwuchukwu-diala", label: "LinkedIn" },
]

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm px-0.5 text-neutral-600 underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out outline-none hover:text-foreground hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export async function Footer() {
  const where = await getWhere()

  return (
    <Container as="footer" className="px-5 pt-20 pb-[max(3rem,env(safe-area-inset-bottom))]">
      <ContainerInner className="flex flex-col items-start gap-1 text-sm text-neutral-600 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-6">
        <FooterClock timeZone={where.timeZone} label={where.label} />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:justify-self-center font-asimovian"
        >
          {SITE_URL.host}
        </Link>
        <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-4 sm:justify-self-end">
          {ELSEWHERE.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {item.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </nav>
      </ContainerInner>
    </Container>
  )
}
