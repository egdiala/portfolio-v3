import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Container } from "@/components/ui/container"
import { AdjacentLink } from "@/components/writeup/adjacent-link"
import { ARTICLES, formatDate, getAdjacentArticles, getArticle } from "@/lib/figured-out"
import { pageMetadata, SITE_URL } from "@/lib/metadata"

export const dynamicParams = false

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata(props: PageProps<"/figured-out/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const article = getArticle(slug)
  if (!article) return {}

  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/figured-out/${slug}`,
    type: "article",
  })
}

const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export default async function FiguredOutArticle(props: PageProps<"/figured-out/[slug]">) {
  const { slug } = await props.params
  const article = getArticle(slug)
  if (!article) notFound()

  const { default: Body } = await import(`@/content/figured-out/${slug}.mdx`)
  const { previous, next } = getAdjacentArticles(slug)

  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    url: new URL(`/figured-out/${slug}`, SITE_URL).href,
    author: { "@type": "Person", name: "Stephen Diala", url: SITE_URL.href },
  }

  return (
    <Container as="article" className="px-5 pt-10 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(posting).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto w-full max-w-[40rem]">
        <Link
          href="/#things-i-have-figured-out"
          className={`rise-in -ms-1 inline-flex min-h-11 items-center gap-1.5 rounded-full ps-1 pe-2 text-sm text-neutral-600 transition-colors duration-100 ease-out hover:text-foreground ${focusRing}`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          {"Things I've figured out"}
        </Link>

        <header className="mt-6">
          <h1
            className="rise-in text-xl leading-tight font-medium text-balance text-foreground"
            style={{ animationDelay: "60ms" }}
          >
            {article.title}
          </h1>
          <p className="rise-in mt-2 text-sm text-neutral-600" style={{ animationDelay: "120ms" }}>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
        </header>

        <div
          className="rise-in mt-10 text-base leading-relaxed text-pretty text-neutral-600 [&>:first-child]:mt-0"
          style={{ animationDelay: "180ms" }}
        >
          <Body />
        </div>

        {previous || next ? (
          <nav aria-label="More things I've figured out" className="mt-16 grid grid-cols-2 gap-6 border-t pt-6">
            {previous ? (
              <AdjacentLink href={`/figured-out/${previous.slug}`} title={previous.title} direction="previous" />
            ) : null}
            {next ? <AdjacentLink href={`/figured-out/${next.slug}`} title={next.title} direction="next" /> : null}
          </nav>
        ) : null}
      </div>
    </Container>
  )
}
