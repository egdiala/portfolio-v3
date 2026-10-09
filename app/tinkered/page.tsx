import { TinkeredGrid } from "@/components/tinkered/tinkered-grid"
import { Container, ContainerInner } from "@/components/ui/container"
import { pageMetadata } from "@/lib/metadata"
import { TINKERED_WORKS } from "@/lib/tinkered"

export const metadata = pageMetadata({
  title: "Tinkered works",
  description:
    "Interaction studies rebuilt in React and Motion, from a Dynamic Island to an AI listing assistant. Most open into a playground where you can slow time to 0.1×.",
  path: "/tinkered",
})

export default function TinkeredIndex() {
  return (
    <Container as="section" className="px-5 pt-14 pb-24">
      <ContainerInner>
        <header className="max-w-[50ch]">
          <h1 className="rise-in text-base font-medium text-foreground">
            {"Things I've tinkered with"}
          </h1>
          <p
            className="rise-in mt-2 text-base leading-relaxed text-pretty text-neutral-600"
            style={{ animationDelay: "70ms" }}
          >
            Interaction studies and small components. The ones marked Read open into a writeup with
            a playground you can try.
          </p>
        </header>
        <div className="mt-10">
          <TinkeredGrid works={TINKERED_WORKS} />
        </div>
      </ContainerInner>
    </Container>
  )
}
