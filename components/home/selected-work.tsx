import { BoxArchiveIcon } from "../icons/box-archive"
import { LoopVideo } from "../loop-video"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

const WORK = [
    {
        name: "memory-base-timeline",
        title: "MemoryBase",
        isArchived: false,
        description:
            "A Chrome extension that gives ChatGPT, Claude, and Gemini one shared memory, so you never have to re-explain yourself when switching tools.",
    },
    {
        name: "b402-ai-smart-wallet",
        title: "b402",
        isArchived: false,
        description:
            "Payment rails that let people and AI agents send and trade crypto privately, with no gas fees to worry about.",
    },
    {
        name: "bless-airdrop",
        title: "Bless",
        isArchived: false,
        description:
            "The dashboard for Bless, a network that pools everyday devices into one shared computer.",
    },
    {
        name: "area-mainnet-enforcer",
        title: "Area",
        isArchived: true,
        description:
            "A marketplace that let people put their staked ETH behind the specific Ethereum services they believed in, instead of handing that choice to a middleman.",
    },
    {
        name: "eigen-explorer",
        title: "EigenExplorer",
        isArchived: true,
        description:
            "A data and DeFi platform for the EigenLayer ecosystem. At its peak, it handled over a million data requests a month from developers, users, and EigenLayer itself.",
    },
]

function ArchiveTab() {
    return (
        <span className="absolute bottom-full left-4 z-10 inline-flex translate-y-px items-center gap-1.5 rounded-t-lg border border-b-0 bg-background px-2.5 pt-1 pb-1.5 text-sm font-medium text-neutral-600">
            <BoxArchiveIcon className="size-4" />
            Archived
        </span>
    )
}

export const SelectedWork = () => {
    return (
        <Container as="section" className="overflow-x-clip px-5 sm:py-8 py-16">
            <ContainerInner>
                <SectionLink id="things-i-have-shipped" className="text-base text-neutral-600 font-medium">
                    Things I've shipped
                </SectionLink>
            </ContainerInner>
            <section
                aria-labelledby="things-i-have-shipped"
                tabIndex={0}
                className="relative -mx-5 mt-6 flex w-[calc(100%+2.5rem)] snap-x snap-mandatory items-start gap-6 overflow-x-auto overscroll-x-contain pt-8 pb-14 pl-5 pr-5 scroll-pl-5 scroll-pr-5 scrollbar-none [&::-webkit-scrollbar]:hidden lg:mx-0 lg:w-full lg:px-[max(0px,calc((100%-64rem)/2))] lg:scroll-px-[max(0px,calc((100%-64rem)/2))]"
            >
                {WORK.map((work) => (
                    <article
                        key={work.title}
                        className="flex-[0_0_100%] snap-start"
                    >
                        <div className="relative">
                            {work.isArchived ? <ArchiveTab /> : null}
                            <div className="relative aspect-400/289 overflow-hidden rounded-2xl border">
                                <LoopVideo name={work.name} className="h-full w-full object-cover" />
                            </div>
                        </div>
                        <div className="mt-4 max-w-[50ch] space-y-1.5">
                            <h3 className="text-base font-medium text-balance">{work.title}</h3>
                            <p className="text-base leading-relaxed text-pretty text-neutral-600">{work.description}</p>
                        </div>
                    </article>
                ))}
            </section>
        </Container>
    )
}
