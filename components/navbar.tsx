"use client"

import { useRef, type PointerEvent } from "react"
import { motion, useReducedMotion } from "motion/react"
import { EMAIL } from "@/lib/contact"
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

// On hover the plane flies off along its heading and glides back in from behind.
const FLIGHT_MS = 900
const FLIGHT_TRAVEL = 28
const FLIGHT: Keyframe[] = [
  { transform: "translate(0, 0)", opacity: 1, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
  { transform: `translate(${FLIGHT_TRAVEL}px, ${-FLIGHT_TRAVEL}px)`, opacity: 0, offset: 0.4 },
  {
    transform: `translate(${-FLIGHT_TRAVEL}px, ${FLIGHT_TRAVEL}px)`,
    opacity: 0,
    offset: 0.4,
    easing: "cubic-bezier(0.32, 0.72, 0, 1)",
  },
  { transform: "translate(0, 0)", opacity: 1 },
]

function RavenButton() {
  const plane = useRef<HTMLSpanElement>(null)
  const flight = useRef<Animation | null>(null)
  const reduceMotion = useReducedMotion()

  // One flight per hover, mouse only: entering again mid-flight doesn't restart it, and leaving doesn't cut it short.
  const takeOff = (event: PointerEvent) => {
    if (reduceMotion || event.pointerType !== "mouse" || !plane.current) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    if (flight.current?.playState === "running") return
    flight.current = plane.current.animate(FLIGHT, FLIGHT_MS)
  }

  // px-4 by hand: the icon is no longer a direct child, so the button's has-[>svg]:px-4 doesn't apply.
  return (
    <Button size="lg" asChild className="relative px-4 after:absolute after:inset-x-0 after:-inset-y-0.5">
      <a href={`mailto:${EMAIL}`} onPointerEnter={takeOff}>
        Send a Raven
        {/* Holds the icon's place. The plane flies in a layer clipped to the pill, so the ::after hit area isn't clipped with it. */}
        <span className="size-4 shrink-0" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span ref={plane} className="absolute top-1/2 right-4 -mt-2 flex size-4">
            <PaperPlaneIcon />
          </span>
        </span>
      </a>
    </Button>
  )
}

export const Navbar = () => {
  return (
    <Container as="header" className="sticky top-0 z-50 px-5 pt-[calc(1rem+env(safe-area-inset-top))]">
      <NavbarBlur />
      <ContainerInner className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-3 pb-4">
        <NameMorph />
        <motion.div
          layout="position"
          className="ml-auto"
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <RavenButton />
        </motion.div>
      </ContainerInner>
    </Container>
  )
}
