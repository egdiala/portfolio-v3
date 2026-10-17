import Link from "next/link"
import { ARTICLES, formatMonth } from "@/lib/figured-out"
import { InViewEnter } from "./in-view-enter"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

export const FiguredOut = () => {
    return (
        <Container as="section" className="px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <InViewEnter>
                    <SectionLink id="things-i-have-figured-out" className="text-base text-neutral-600 font-medium">
                        Things I&apos;ve figured out
                    </SectionLink>
                </InViewEnter>
                <ol aria-labelledby="things-i-have-figured-out" className="mt-6 divide-y divide-border">
                    {ARTICLES.map((article, index) => (
                        <InViewEnter key={article.slug} as="li" delay={index * 40}>
                            <Link
                                href={`/figured-out/${article.slug}`}
                                className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 rounded-sm py-4 outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <span className="font-medium text-pretty underline decoration-transparent underline-offset-2 transition-colors duration-100 ease-out group-hover:decoration-neutral-400">
                                    {article.title}
                                </span>
                                <time
                                    dateTime={article.publishedAt}
                                    className="text-end text-sm text-neutral-600 tabular-nums whitespace-nowrap"
                                >
                                    {formatMonth(article.publishedAt)}
                                </time>
                                <span className="col-span-2 mt-1 text-pretty text-neutral-600">{article.summary}</span>
                            </Link>
                        </InViewEnter>
                    ))}
                </ol>
            </ContainerInner>
        </Container>
    )
}
