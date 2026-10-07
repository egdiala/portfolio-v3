import { cn } from "@/lib/utils"
import { InViewEnter } from "./in-view-enter"
import { LoopVideo } from "../loop-video"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

type TinkeredWork = {
    name: string
    title: string
    className?: string
}

const TINKERED: TinkeredWork[] = [
    {
        name: "ai-chrome-extension-widget",
        title: "AI Chrome Extension Widget",
    },
    {
        name: "dynamic-island",
        title: "Dynamic Island",
    },
    {
        name: "ios-network-interaction",
        title: "iOS Network Interaction",
    },
    {
        name: "ask-area-ai-chat",
        title: "Ask Area AI Chat",
        className: "object-[25%_90%]"
    },
    {
        name: "memorybase-llm-overlay",
        title: "LLM Overlay for MemoryBase",
    },
    {
        name: "business-switcher",
        title: "Business Switcher",
    }
]

export const TinkeredWorks = () => {
    return (
        <Container as="section" className="overflow-x-clip px-5 py-16 @min-[40rem]/page:py-8 @min-[64rem]/page:px-0">
            <ContainerInner>
                <InViewEnter>
                    <SectionLink id="tinkered-works" className="text-base text-neutral-600 font-medium">
                        Things I've tinkered with
                    </SectionLink>
                </InViewEnter>
                {TINKERED.length > 0 ? (
                    <div className="@container/tinkered mt-6">
                        <ul className="grid grid-cols-1 gap-[clamp(0.9rem,1.8cqw,1.3rem)] @min-[701px]/tinkered:grid-cols-2 @min-[981px]/tinkered:grid-cols-3">
                            {TINKERED.map((work, index) => (
                                <InViewEnter key={work.name} as="li" delay={index * 40} className="min-w-0">
                                    <figure>
                                        <div className="aspect-video overflow-hidden rounded-2xl border">
                                            <LoopVideo
                                                name={work.name}
                                                label={work.title}
                                                className={cn("w-full h-full object-cover", work.className)}
                                            />
                                        </div>
                                        <figcaption className="pt-3 text-sm leading-snug text-pretty text-neutral-600">
                                            {work.title}
                                        </figcaption>
                                    </figure>
                                </InViewEnter>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </ContainerInner>
        </Container>
    )
}
