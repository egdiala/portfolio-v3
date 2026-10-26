import { EXPERIENCE } from "@/lib/experience"
import { InViewEnter } from "./in-view-enter"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

export const Experience = () => {
    return (
        <Container as="section" data-track-section="experience" className="px-5 py-16 @min-[40rem]/page:py-8">
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
