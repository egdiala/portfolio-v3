import { BoxArchiveIcon } from "../icons/box-archive"
import { LoopVideo } from "../loop-video"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"
import { SnapRail } from "./snap-rail"

type Work = {
    name: string
    title: string
    description: string
    link: { status: "live" | "archived"; href: string }
}

const WORK: Work[] = [
    {
        name: "memory-base-timeline",
        title: "MemoryBase",
        description:
            "A Chrome extension that gives ChatGPT, Claude, and Gemini one shared memory, so you never have to re-explain yourself when switching tools.",
        link: { status: "live", href: "https://memorybase.app" },
    },
    {
        name: "b402-ai-smart-wallet",
        title: "b402",
        description:
            "Payment rails that let people and AI agents send and trade crypto privately, with no gas fees to worry about.",
        link: { status: "live", href: "https://b402.ai" },
    },
    {
        name: "bless-airdrop",
        title: "Bless",
        description:
            "The dashboard for Bless, a network that pools everyday devices into one shared computer.",
        link: { status: "live", href: "https://bless.network" },
    },
    {
        name: "area-mainnet-enforcer",
        title: "Area",
        description:
            "A marketplace that let people put their staked ETH behind the specific Ethereum services they believed in, instead of handing that choice to a middleman.",
        link: { status: "archived", href: "https://docs.area.club" },
    },
    {
        name: "eigen-explorer",
        title: "EigenExplorer",
        description:
            "A data and DeFi platform for the EigenLayer ecosystem. At its peak, it handled over a million data requests a month from developers, users, and EigenLayer itself.",
        link: { status: "archived", href: "https://docs.eigenexplorer.com" },
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

function WorkDestination({ work }: Readonly<{ work: Work }>) {
    const archived = work.link.status === "archived"

    return (
        <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <a
                href={work.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-sm text-base underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out outline-none hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                {archived ? "Read the docs" : "Visit site"}
                <span className="sr-only"> for {work.title} (opens in a new tab)</span>
            </a>
            {archived ? <span className="text-sm text-neutral-600">Site offline</span> : null}
        </p>
    )
}

export const SelectedWork = () => {
    return (
        <Container as="section" className="overflow-x-clip px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <div className="rise-in" style={{ animationDelay: "200ms" }}>
                    <SectionLink id="things-i-have-shipped" className="text-base text-neutral-600 font-medium">
                        Things I&apos;ve shipped
                    </SectionLink>
                </div>
            </ContainerInner>
            <SnapRail
                aria-labelledby="things-i-have-shipped"
                className="rise-in relative -mx-5 mt-6 flex w-[calc(100%+2.5rem)] snap-x snap-mandatory items-start gap-6 overflow-x-auto overscroll-x-contain px-(--inset) pt-8 pb-14 scroll-px-(--inset) scrollbar-none [--inset:max(1.25rem,calc((100cqw_+_2.5rem_-_64rem)/2))] [--peek:2.75rem] [&::-webkit-scrollbar]:hidden"
                style={{ animationDelay: "280ms" }}
            >
                {WORK.map((work) => (
                    <article
                        key={work.title}
                        className="w-[min(100%,calc(100%_+_var(--inset)_-_1.5rem_-_var(--peek)))] shrink-0 snap-start"
                    >
                        <div className="relative">
                            {work.link.status === "archived" ? <ArchiveTab /> : null}
                            <div className="relative aspect-400/289 overflow-hidden rounded-2xl border">
                                <LoopVideo name={work.name} label={work.title} standalone className="h-full w-full object-cover" />
                            </div>
                        </div>
                        <div className="mt-4 max-w-[50ch]">
                            <div className="space-y-1.5">
                                <h3 className="text-base font-medium text-balance">{work.title}</h3>
                                <p className="text-base leading-relaxed text-pretty text-neutral-600">{work.description}</p>
                            </div>
                            <WorkDestination work={work} />
                        </div>
                    </article>
                ))}
            </SnapRail>
        </Container>
    )
}
