"use client"

import { Mascot } from 'page-mascot'
import { Container, ContainerInner } from '@/components/ui/container'

export const IntroSection = () => {
    return (
        <Container as="section" className="px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <div className="home-enter">
                    <Mascot
                        directions="/mascots/wizard-directions.webp"
                        reactions="/mascots/wizard-reactions.webp"
                        label="Stephen wizard"
                        key="stephen-wizard"
                        size={80}
                    />
                </div>

                <div className="max-w-[50ch] space-y-4 text-base leading-relaxed text-neutral-600">
                    <p className="home-enter" style={{ animationDelay: "70ms" }}>I'm a frontend engineer at <span className="whitespace-nowrap"><a href="https://moniepoint.com" target="_blank" className="text-moniepoint underline decoration-current underline-offset-2 transition-colors duration-100 ease-out">Moniepoint</a> <span aria-hidden="true">🦄</span>,</span> where I work on MonieDesk, the internal tool our support teams use every day. I care about how an interface looks, but more about how it feels: the timing of a transition, the weight of a hover, the moment something just works.</p>

                    <p className="home-enter" style={{ animationDelay: "140ms" }}>On the side, I'm working on MemoryBase and building products with Melun Technologies, a small company I co-founded. Before that, I spent time in web3 and AI at <span className="whitespace-nowrap"><a href="https://bless.network/" target="_blank" className="text-zinc-700 underline decoration-neutral-400 hover:decoration-current underline-offset-2 transition-colors duration-100 ease-out">Bless</a> <span aria-hidden="true">🙏🏽</span> and <a href="https://docs.eigenexplorer.com/" target="_blank" className="text-zinc-700 underline decoration-neutral-400 hover:decoration-current underline-offset-2 transition-colors duration-100 ease-out">EigenExplorer</a> <span aria-hidden="true">✴︎</span>.</span></p>

                    <p className="home-enter" style={{ animationDelay: "210ms" }}>I do my best work with <span className="whitespace-nowrap">headphones<span aria-hidden="true">🎧</span></span> on. Away from the keyboard, it's games, anime, and good food.</p>
                </div>

            </ContainerInner>
        </Container>
    )
}