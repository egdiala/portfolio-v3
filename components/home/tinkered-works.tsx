import Link from "next/link"
import { HOME_TINKERED_COUNT, TINKERED_WORKS } from "@/lib/tinkered"
import { TinkeredGrid } from "../tinkered/tinkered-grid"
import { InViewEnter } from "./in-view-enter"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

export const TinkeredWorks = () => {
    return (
        <Container as="section" className="overflow-x-clip px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <InViewEnter className="flex items-center justify-between gap-4">
                    <SectionLink id="tinkered-works" className="text-base text-neutral-600 font-medium">
                        Things I&apos;ve tinkered with
                    </SectionLink>
                    <Link
                        href="/tinkered"
                        className="-me-1 inline-flex min-h-11 shrink-0 items-center rounded-sm px-1 text-sm text-neutral-600 underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out outline-none hover:text-foreground hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        See all<span className="sr-only"> tinkered works</span>
                    </Link>
                </InViewEnter>
                {TINKERED_WORKS.length > 0 ? (
                    <div className="mt-6">
                        <TinkeredGrid works={TINKERED_WORKS.slice(0, HOME_TINKERED_COUNT)} />
                    </div>
                ) : null}
            </ContainerInner>
        </Container>
    )
}
