import { MOMENTS } from "@/lib/said-out-loud"
import { EpisodeCard } from "../said-out-loud/episode-card"
import { HidesMiniPlayer } from "../said-out-loud/hides-mini-player"
import { MomentRow } from "../said-out-loud/moment-row"
import { InViewEnter } from "./in-view-enter"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

export const SaidOutLoud = () => {
    return (
        <Container as="section" data-track-section="said-out-loud" className="px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <InViewEnter>
                    <SectionLink id="things-i-have-said-out-loud" className="text-base text-neutral-600 font-medium">
                        Things I&apos;ve said out loud
                    </SectionLink>
                </InViewEnter>
                <HidesMiniPlayer className="mt-6">
                    <InViewEnter delay={40}>
                        <EpisodeCard />
                    </InViewEnter>
                    <ol aria-label="Moments from the episode" className="mt-4 divide-y divide-border">
                        {MOMENTS.map((moment, index) => (
                            <InViewEnter key={moment.id} as="li" delay={80 + index * 40} className="relative">
                                <MomentRow moment={moment} />
                            </InViewEnter>
                        ))}
                    </ol>
                </HidesMiniPlayer>
            </ContainerInner>
        </Container>
    )
}
