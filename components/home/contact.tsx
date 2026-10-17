import { EMAIL } from "@/lib/contact"
import { getWhere } from "@/lib/where"
import { ContactChart } from "../contact/contact-chart"
import { InViewEnter } from "./in-view-enter"
import { Container, ContainerInner } from "../ui/container"
import { SectionLink } from "../ui/section-link"

export const Contact = async () => {
    const where = await getWhere()

    return (
        <Container as="section" className="px-5 py-16 @min-[40rem]/page:py-8">
            <ContainerInner>
                <InViewEnter>
                    <SectionLink id="contact" className="text-base text-neutral-600 font-medium">
                        Contact
                    </SectionLink>
                </InViewEnter>
                <InViewEnter delay={40} className="mt-6">
                    <ContactChart where={where} />
                </InViewEnter>
                <InViewEnter delay={80}>
                    <p className="mt-3 max-w-[50ch] text-sm text-center mx-auto text-pretty text-neutral-600">
                        Anchored in {where.label}. Pick a port to plot a course, or write to {EMAIL}.
                    </p>
                </InViewEnter>
            </ContainerInner>
        </Container>
    )
}
