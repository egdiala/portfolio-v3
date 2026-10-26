"use client"

import { Mascot } from 'page-mascot'
import { Container, ContainerInner } from '@/components/ui/container'
import { CitationLink, IntroCitations } from './intro-citations'

export const IntroSection = () => {
    return (
        <Container as="section" className="px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <div className="rise-in">
                    <Mascot
                        directions="/mascots/wizard-directions.webp"
                        reactions="/mascots/wizard-reactions.webp"
                        label="Stephen wizard"
                        key="stephen-wizard"
                        size={80}
                    />
                </div>

                <IntroCitations className="max-w-[50ch]">
                    <div className="space-y-4 text-base leading-relaxed text-neutral-600">
                        <p className="rise-in" style={{ animationDelay: "70ms" }}>I&apos;m a frontend engineer at <span className="whitespace-nowrap"><CitationLink id="moniepoint" /> <span aria-hidden="true">🦄</span>,</span> where I work on MonieDesk, the internal tool our support teams use every day. I care about how an interface looks, but more about how it feels: the timing of a transition, the weight of a hover, the moment something just works.</p>

                        <p className="rise-in" style={{ animationDelay: "140ms" }}>On the side, I&apos;m working on MemoryBase and building products with Melun Technologies, a small company I co-founded. Before that, I spent time in web3 and AI at <span className="whitespace-nowrap"><CitationLink id="bless" /> <span aria-hidden="true">🙏🏽</span> and <CitationLink id="eigenexplorer" /> <span aria-hidden="true">✴︎</span>.</span></p>

                        <p className="rise-in" style={{ animationDelay: "210ms" }}>I do my best work with <span className="whitespace-nowrap">headphones<span aria-hidden="true">🎧</span></span> on. Away from the keyboard, it&apos;s games, anime, and good food.</p>
                    </div>
                </IntroCitations>

            </ContainerInner>
        </Container>
    )
}
