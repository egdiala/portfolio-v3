import { InViewEnter } from "./in-view-enter"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

const EXPERIENCE: Array<{ company: string; partner?: string; role: string; dates: string }> = [
    {
        company: "Moniepoint",
        role: "Frontend Engineer",
        dates: "2026 — Now",
    },
    {
        company: "Melun Technologies",
        role: "Co-founder",
        dates: "2025 — Now",
    },
    {
        company: "EigenExplorer",
        partner: "Blockless",
        role: "Frontend Engineer",
        dates: "Mar 2025 — 2026",
    },
    {
        company: "Zeno",
        role: "Senior Frontend Engineer",
        dates: "Jun 2024 — May 2025",
    },
    {
        company: "Enyata",
        role: "Senior Frontend Engineer",
        dates: "Feb 2023 — Nov 2024",
    },
]

export const Experience = () => {
    return (
        <Container as="section" className="px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <InViewEnter>
                    <SectionLink id="experience" className="text-base text-neutral-600 font-medium">
                        Experience
                    </SectionLink>
                </InViewEnter>
                <ol aria-labelledby="experience" className="mt-6 divide-y divide-border">
                    {EXPERIENCE.map((item, index) => (
                        <InViewEnter
                            key={item.company}
                            as="li"
                            delay={index * 40}
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 py-4"
                        >
                            <span className="font-medium text-pretty">
                                {item.company}
                                {item.partner ? (
                                    <>
                                        {" "}
                                        <span role="img" aria-label="together with">🫱🏻‍🫲🏾</span>{" "}
                                        {item.partner}
                                    </>
                                ) : null}
                            </span>
                            <span className="text-end text-sm text-neutral-600 tabular-nums whitespace-nowrap">
                                {item.dates}
                            </span>
                            <span className="col-span-2 mt-1 text-pretty text-neutral-600">{item.role}</span>
                        </InViewEnter>
                    ))}
                </ol>
            </ContainerInner>
        </Container>
    )
}
