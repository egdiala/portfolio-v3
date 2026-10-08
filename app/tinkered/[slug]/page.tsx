import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Container } from "@/components/ui/container"
import { pageMetadata } from "@/lib/metadata"
import { getAdjacentWriteups, getWriteup, getWriteups, type TinkeredWork } from "@/lib/tinkered"

export const dynamicParams = false

export function generateStaticParams() {
  return getWriteups().map((work) => ({ slug: work.slug }))
}

export async function generateMetadata(props: PageProps<"/tinkered/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const work = getWriteup(slug)
  if (!work) return {}

  return pageMetadata({
    title: work.title,
    description: work.description ?? work.summary ?? "",
    path: `/tinkered/${slug}`,
    type: "article",
  })
}

const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function AdjacentLink({ work, direction }: Readonly<{ work: TinkeredWork; direction: "previous" | "next" }>) {
  const next = direction === "next"

  return (
    <Link
      href={`/tinkered/${work.slug}`}
      rel={next ? "next" : "prev"}
      className={`group flex min-h-11 flex-col justify-center gap-1 rounded-lg py-2 ${next ? "col-start-2 items-end text-end" : "items-start"} ${focusRing}`}
    >
      <span className="text-sm text-neutral-600">
        {next ? "Next" : "Previous"}
      </span>
      <span className="font-medium text-pretty text-foreground underline decoration-transparent underline-offset-2 transition-colors duration-100 ease-out group-hover:decoration-neutral-400">
        {work.title}
      </span>
    </Link>
  )
}

export default async function TinkeredWriteup(props: PageProps<"/tinkered/[slug]">) {
  const { slug } = await props.params
  const work = getWriteup(slug)
  if (!work) notFound()

  const { default: Writeup } = await import(`@/content/tinkered/${slug}.mdx`)
  const { previous, next } = getAdjacentWriteups(slug)

  return (
    <Container as="article" className="px-5 pt-10 pb-24">
      <div className="mx-auto w-full max-w-[40rem]">
        <Link
          href="/tinkered"
          className={`rise-in -ms-1 inline-flex min-h-11 items-center gap-1.5 rounded-full ps-1 pe-2 text-sm text-neutral-600 transition-colors duration-100 ease-out hover:text-foreground ${focusRing}`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          Tinkered works
        </Link>

        <header className="mt-6">
          <h1
            className="rise-in text-xl leading-tight font-medium text-balance text-foreground"
            style={{ animationDelay: "60ms" }}
          >
            {work.title}
          </h1>
          {work.summary ? (
            <p
              className="rise-in mt-2 text-base leading-relaxed text-pretty text-neutral-600"
              style={{ animationDelay: "120ms" }}
            >
              {work.summary}
            </p>
          ) : null}
        </header>

        <div
          className="rise-in mt-10 text-base leading-relaxed text-pretty text-neutral-600 [&>:first-child]:mt-0"
          style={{ animationDelay: "180ms" }}
        >
          <Writeup />
        </div>

        {previous || next ? (
          <nav aria-label="More tinkered works" className="mt-16 grid grid-cols-2 gap-6 border-t pt-6">
            {previous ? <AdjacentLink work={previous} direction="previous" /> : null}
            {next ? <AdjacentLink work={next} direction="next" /> : null}
          </nav>
        ) : null}
      </div>
    </Container>
  )
}
