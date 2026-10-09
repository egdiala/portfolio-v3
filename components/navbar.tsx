"use client"

import { motion } from "motion/react"
import { Button } from "./ui/button"
import { PaperPlaneIcon } from "./icons/paper-plane"
import { Container, ContainerInner } from "./ui/container"
import { NameMorph } from "./name-morph"

const BLUR_LAYERS = [
  {
    blur: "0.5px",
    mask: "linear-gradient(to top, transparent 0%, black 12.5%, black 25%, transparent 37.5%)",
  },
  {
    blur: "1px",
    mask: "linear-gradient(to top, transparent 12.5%, black 25%, black 37.5%, transparent 50%)",
  },
  {
    blur: "2px",
    mask: "linear-gradient(to top, transparent 25%, black 37.5%, black 50%, transparent 62.5%)",
  },
  {
    blur: "4px",
    mask: "linear-gradient(to top, transparent 37.5%, black 50%, black 62.5%, transparent 75%)",
  },
  {
    blur: "8px",
    mask: "linear-gradient(to top, transparent 50%, black 62.5%, black 75%, transparent 87.5%)",
  },
  {
    blur: "16px",
    mask: "linear-gradient(to top, transparent 62.5%, black 75%, black 87.5%, transparent 100%)",
  },
  {
    blur: "32px",
    mask: "linear-gradient(to top, transparent 75%, black 87.5%, black 100%)",
  },
  {
    blur: "64px",
    mask: "linear-gradient(to top, transparent 87.5%, black 100%)",
  },
]

const SCRIM_MASK = "linear-gradient(to bottom, black 0.5rem, transparent)"

function NavbarBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[calc(7.875rem+env(safe-area-inset-top))]"
    >
      {BLUR_LAYERS.map((layer, index) => (
        <div
          key={layer.blur}
          className="absolute inset-0"
          style={{
            zIndex: index + 1,
            backdropFilter: `blur(${layer.blur})`,
            WebkitBackdropFilter: `blur(${layer.blur})`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
      {/*
        iOS Safari draws the page behind the status bar and only covers it when the box pinned
        under the top edge has a solid background-color. Gradients and backdrop-filter don't
        count, and nothing may sit above this box there, so the nav holds the top padding.
      */}
      <div
        className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-background ios:h-[max(env(safe-area-inset-top),2rem)]"
        style={{
          zIndex: BLUR_LAYERS.length + 1,
          maskImage: SCRIM_MASK,
          WebkitMaskImage: SCRIM_MASK,
        }}
      />
    </div>
  )
}

export const Navbar = () => {
  return (
    <Container as="nav" className="sticky top-0 z-50 px-5 pt-[calc(1rem+env(safe-area-inset-top))]">
      <NavbarBlur />
      <ContainerInner className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-3 pb-4">
        <NameMorph />
        <motion.div
          layout="position"
          className="ml-auto"
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Button size="lg" asChild>
            <a href="https://www.linkedin.com/in/egwuchukwu-diala">
              Send a Raven <PaperPlaneIcon aria-hidden="true" />
            </a>
          </Button>
        </motion.div>
      </ContainerInner>
    </Container>
  )
}
