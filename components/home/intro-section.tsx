"use client"

import { Mascot } from 'page-mascot'
import { Container, ContainerInner } from '@/components/ui/container'
import { EMAIL } from '@/lib/contact'
import { CitationLink, IntroCitations } from './intro-citations'

const mailClass =
    "inline-flex min-h-11 items-center rounded-sm text-foreground underline decoration-neutral-400 underline-offset-2 transition-[text-decoration-color] duration-150 ease-out outline-none hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

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
                    <p className="rise-in mb-4 text-sm leading-relaxed text-neutral-600" style={{ animationDelay: "70ms" }}>
                        <a href={`mailto:${EMAIL}`} className={mailClass}>Open to work</a>
                        <span aria-hidden="true"> · </span>
                        Last day at <CitationLink id="moniepoint" /> <span aria-hidden="true">🦄</span>, <span className="tabular-nums whitespace-nowrap">2 Nov 2026</span>
                    </p>
                    <div className="space-y-4 text-base leading-relaxed text-neutral-600">
                        <p className="rise-in" style={{ animationDelay: "140ms" }}>I spent this year on MonieDesk, the internal tool our support teams use every day. I care about how an interface looks, but more about how it feels: the timing of a transition, the weight of a hover, the moment something just works.</p>

                        <p className="rise-in" style={{ animationDelay: "210ms" }}>On the side, I&apos;m working on MemoryBase and building products with Melun Technologies, a small company I co-founded. Before that, I spent time in web3 and AI at <span className="whitespace-nowrap"><CitationLink id="bless" /> <span aria-hidden="true">🙏🏽</span> and <CitationLink id="eigenexplorer" /> <span aria-hidden="true">✴︎</span>.</span></p>

                        <p className="rise-in" style={{ animationDelay: "280ms" }}>I do my best work with <span className="whitespace-nowrap">headphones<span aria-hidden="true">🎧</span></span> on. Away from the keyboard, it&apos;s games, anime, and good food.</p>
                    </div>
                </IntroCitations>

            </ContainerInner>
        </Container>
    )
}
