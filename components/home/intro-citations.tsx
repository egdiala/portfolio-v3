"use client"

import {
    createContext,
    use,
    useEffect,
    useEffectEvent,
    useId,
    useRef,
    useState,
    type PointerEvent,
    type ReactNode,
    type RefObject,
} from "react"
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Transition, type Variants } from "motion/react"
import { EXPERIENCE } from "@/lib/experience"
import { cn } from "@/lib/utils"

type CitationId = "moniepoint" | "bless" | "eigenexplorer"

type Citation = {
    label: string
    href: string
    domain: string
    emoji: string
    role: string
    dates: string
    summary: string
    // The link's resting look. Its underline goes full strength while its note is open.
    className: string
}

function stint(company: string) {
    const entry = EXPERIENCE.find((item) => item.company === company)
    if (!entry) throw new Error(`No experience entry for ${company}`)
    return { role: entry.role, dates: entry.dates }
}

// Document order, so a later link's note slides in from below.
const ORDER: CitationId[] = ["moniepoint", "bless", "eigenexplorer"]

const CITATIONS: Record<CitationId, Citation> = {
    moniepoint: {
        label: "Moniepoint",
        href: "https://moniepoint.com",
        domain: "moniepoint.com",
        emoji: "🦄",
        ...stint("Moniepoint"),
        summary: "A digital banking and payments ecosystem for African businesses and individuals, with over 20 million accounts.",
        className: "text-moniepoint decoration-current",
    },
    bless: {
        label: "Bless",
        href: "https://bless.network/",
        domain: "bless.network",
        emoji: "🙏🏽",
        // One role across both, listed under EigenExplorer.
        ...stint("EigenExplorer"),
        summary: "The dashboard for Bless, a network that pools everyday devices into one shared computer.",
        className: "text-zinc-700 decoration-neutral-400 hover:decoration-current",
    },
    eigenexplorer: {
        label: "EigenExplorer",
        href: "https://docs.eigenexplorer.com/",
        domain: "docs.eigenexplorer.com",
        emoji: "✴︎",
        ...stint("EigenExplorer"),
        summary:
            "A data and DeFi platform for the EigenLayer ecosystem. At its peak, it handled over a million data requests a month from developers, users, and EigenLayer itself.",
        className: "text-zinc-700 decoration-neutral-400 hover:decoration-current",
    },
}

const OPEN_DELAY = 75
// Long enough to cross the rest of the line to the note, or to reach the next link and glide there.
const CLOSE_DELAY = 400
const WARM = 300
const FADE_OUT = 120

const NOTE_WIDTH = 240
const NOTE_GAP = 48
// The note's rule and padding, which its content doesn't get.
const NOTE_INSET = 17
const CARD_WIDTH = 320
const GUTTER = 20
// The sticky navbar covers this much of the viewport's top.
const TOP_INSET = 80

const instant: Transition = { duration: 0 }
const glide: Transition = { type: "spring", duration: 0.35, bounce: 0 }
const swap: Transition = { type: "spring", duration: 0.3, bounce: 0 }
const enter: Transition = { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
const exit: Transition = { duration: 0.12, ease: [0.4, 0, 1, 1] }

type Box = { left: number; top: number; right: number; bottom: number; width: number; height: number }

type Anchor = {
    // The link, relative to the prose.
    link: Box
    // The prose, in the viewport.
    prose: Box
    viewport: { width: number; height: number }
}

// fresh: opens with its entrance. glide: already open, moves to another link. instant: keyboard, or a warm reopen.
type Mode = "fresh" | "glide" | "instant"

// The note needs the margin; narrower windows get a card under the link.
type Layout = "note" | "card"

type State = {
    active: CitationId | null
    // Stays on the last link while the note fades out, so it doesn't empty mid-exit.
    shown: CitationId | null
    direction: 1 | -1
    mode: Mode
    layout: Layout
    anchor: Anchor | null
    // The shown content's height in this layout, measured before it renders.
    height: number
}

type Citations = State & {
    reduced: boolean
    show: (id: CitationId, from: "pointer" | "focus") => void
    hide: () => void
    keep: () => void
    close: () => void
    registerLink: (id: CitationId) => (el: HTMLAnchorElement | null) => void
    registerRig: (layout: Layout, id: CitationId) => (el: HTMLDivElement | null) => void
}

const CitationsContext = createContext<Citations | null>(null)

function useCitations() {
    const context = use(CitationsContext)
    if (!context) throw new Error("useCitations must be used within IntroCitations")
    return context
}

function box(r: DOMRect, origin = { left: 0, top: 0 }): Box {
    const left = r.left - origin.left
    const top = r.top - origin.top
    return { left, top, right: left + r.width, bottom: top + r.height, width: r.width, height: r.height }
}

function useCitationsState(): [Citations, RefObject<HTMLDivElement | null>] {
    const reduced = useReducedMotion() ?? false
    const [state, setState] = useState<State>({
        active: null,
        shown: null,
        direction: 1,
        mode: "fresh",
        layout: "note",
        anchor: null,
        height: 0,
    })
    const prose = useRef<HTMLDivElement>(null)
    const links = useRef(new Map<CitationId, HTMLAnchorElement>())
    const rigs = useRef(new Map<string, HTMLDivElement>())
    const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
    const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
    const current = useRef<CitationId | null>(null)
    const last = useRef<CitationId | null>(null)
    const closedAt = useRef(-Infinity)

    const clear = () => {
        clearTimeout(openTimer.current)
        clearTimeout(closeTimer.current)
    }

    const open = (id: CitationId, mode: Mode) => {
        const link = links.current.get(id)
        if (!link || !prose.current) return
        const p = prose.current.getBoundingClientRect()
        const viewport = { width: document.documentElement.clientWidth, height: window.innerHeight }
        const layout: Layout = p.right + NOTE_GAP + NOTE_WIDTH <= viewport.width - GUTTER ? "note" : "card"
        const from = last.current
        current.current = id
        last.current = id
        setState({
            active: id,
            shown: id,
            direction: from && ORDER.indexOf(id) < ORDER.indexOf(from) ? -1 : 1,
            mode,
            layout,
            anchor: { link: box(link.getBoundingClientRect(), p), prose: box(p), viewport },
            height: rigs.current.get(`${layout}:${id}`)?.offsetHeight ?? 0,
        })
    }

    const shut = () => {
        clear()
        if (current.current === null) return
        current.current = null
        closedAt.current = performance.now()
        setState((s) => ({ ...s, active: null }))
    }

    const dismiss = useEffectEvent((e?: KeyboardEvent) => {
        if (!e || e.key === "Escape") shut()
    })

    useEffect(() => {
        if (state.active === null) return
        const onKey = (e: KeyboardEvent) => dismiss(e)
        // The note is placed for this scroll position and window size.
        const onMove = () => dismiss()
        window.addEventListener("keydown", onKey)
        window.addEventListener("scroll", onMove, { passive: true })
        window.addEventListener("resize", onMove)
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("scroll", onMove)
            window.removeEventListener("resize", onMove)
        }
    }, [state.active])

    useEffect(() => clear, [])

    const citations: Citations = {
        ...state,
        reduced,
        show(id, from) {
            clear()
            if (from === "focus") return open(id, "instant")
            if (current.current !== null) {
                if (current.current !== id) open(id, "glide")
                return
            }
            const since = performance.now() - closedAt.current
            // Still fading out: pick it up from where it is. Gone but recent: skip a second entrance.
            if (since < FADE_OUT) return open(id, "glide")
            if (since < WARM) return open(id, "instant")
            openTimer.current = setTimeout(() => open(id, "fresh"), OPEN_DELAY)
        },
        hide() {
            clear()
            closeTimer.current = setTimeout(shut, CLOSE_DELAY)
        },
        keep() {
            clearTimeout(closeTimer.current)
        },
        close: shut,
        registerLink: (id) => (el) => {
            if (el) links.current.set(id, el)
            else links.current.delete(id)
        },
        registerRig: (layout, id) => (el) => {
            if (el) rigs.current.set(`${layout}:${id}`, el)
            else rigs.current.delete(`${layout}:${id}`)
        },
    }
    return [citations, prose]
}

// A tap fires pointer events too, and should just follow the link.
function fromMouse(e: PointerEvent) {
    return e.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

function openSite(id: CitationId | null) {
    if (id) window.open(CITATIONS[id].href, "_blank", "noopener,noreferrer")
}

function Details({ citation }: Readonly<{ citation: Citation }>) {
    return (
        <>
            <div className="flex items-baseline gap-2 text-[13px] leading-5 text-neutral-500">
                <span aria-hidden="true">{citation.emoji}</span>
                <span>{citation.label}</span>
                <span className="ms-auto tabular-nums">{citation.dates}</span>
            </div>
            <div className="mt-1 text-sm leading-5 font-medium text-foreground">{citation.role}</div>
            <p className="mt-1 text-[13px] leading-[1.45] text-neutral-600">{citation.summary}</p>
            <div className="mt-2 flex items-center gap-1 text-xs leading-4 text-neutral-500">
                <span>{citation.domain}</span>
                <span aria-hidden="true">↗</span>
            </div>
        </>
    )
}

// Shared by the rig and the popovers, so what's measured is what's shown.
function Body({ layout, id }: Readonly<{ layout: Layout; id: CitationId }>) {
    return (
        <div className={layout === "note" ? "pb-0.5" : "px-3.5 py-3"}>
            <Details citation={CITATIONS[id]} />
        </div>
    )
}

// Every link's content laid out once, unseen, so a popover knows its height before it opens.
function Rig() {
    const c = useCitations()
    return (
        <div aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 h-0 overflow-hidden">
            {ORDER.map((id) => (
                <div key={id}>
                    <div ref={c.registerRig("note", id)} style={{ width: NOTE_WIDTH - NOTE_INSET }}>
                        <Body layout="note" id={id} />
                    </div>
                    <div ref={c.registerRig("card", id)} style={{ width: CARD_WIDTH }}>
                        <Body layout="card" id={id} />
                    </div>
                </div>
            ))}
        </div>
    )
}

type SwapCustom = { direction: 1 | -1; slide: boolean; axis: "x" | "y"; distance: number; blur: string }

const swapVariants: Variants = {
    enter: ({ direction, slide, axis, distance, blur }: SwapCustom) =>
        slide ? { [axis]: distance * direction, opacity: 0, filter: blur } : { x: 0, y: 0, opacity: 1 },
    center: { x: 0, y: 0, opacity: 1, filter: "blur(0px)" },
    exit: ({ direction, slide, axis, distance, blur }: SwapCustom) =>
        slide ? { [axis]: -distance * direction, opacity: 0, filter: blur } : { opacity: 0, transition: instant },
}

// The content change when moving between links: the new one comes from the side the pointer is heading.
function Swap({ layout, axis, distance }: Readonly<{ layout: Layout; axis: "x" | "y"; distance: number }>) {
    const c = useCitations()
    const custom: SwapCustom = {
        direction: c.direction,
        slide: c.mode === "glide",
        axis,
        distance,
        blur: c.reduced ? "blur(0px)" : "blur(2px)",
    }
    return (
        <AnimatePresence mode="popLayout" initial={false} custom={custom}>
            {c.shown ? (
                <motion.div key={c.shown} custom={custom} variants={swapVariants} initial="enter" animate="center" exit="exit" transition={swap}>
                    <Body layout={layout} id={c.shown} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

function usePointer() {
    const c = useCitations()
    return {
        onPointerEnter: (e: PointerEvent) => fromMouse(e) && c.keep(),
        onPointerLeave: (e: PointerEvent) => fromMouse(e) && c.hide(),
    }
}

function Note() {
    const c = useCitations()
    const pointer = usePointer()
    const a = c.anchor
    const isOpen = c.active !== null
    const moving = c.mode === "glide" && !c.reduced ? glide : instant
    const left = (a?.prose.width ?? 0) + NOTE_GAP
    let fade = exit
    if (isOpen) fade = c.mode === "instant" ? instant : enter

    return (
        <>
            {/* From the end of the text column to the note, level with the link, so it never crosses the line's words. */}
            <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 h-px origin-left bg-neutral-300"
                style={{ left: left - NOTE_GAP + 12, width: NOTE_GAP - 24 }}
                initial={false}
                animate={{ y: a ? a.link.top + a.link.height / 2 : 0, scaleX: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ y: moving, scaleX: fade, opacity: fade }}
            />
            {/* Keeps the note open while the pointer crosses the gap to it. */}
            <div
                aria-hidden="true"
                className="absolute"
                style={{
                    left: left - NOTE_GAP,
                    width: NOTE_GAP,
                    top: a?.link.top ?? 0,
                    height: a?.link.height ?? 0,
                    pointerEvents: isOpen ? "auto" : "none",
                }}
                {...pointer}
            />
            <motion.div
                aria-hidden="true"
                data-slot="citation"
                className="absolute top-0 z-10"
                style={{ left, width: NOTE_WIDTH, pointerEvents: isOpen ? "auto" : "none" }}
                initial={false}
                animate={{ y: a ? a.link.top - 1 : 0 }}
                transition={moving}
                {...pointer}
                onClick={() => openSite(c.shown)}
            >
                <motion.div
                    className="cursor-pointer border-s border-neutral-300 ps-4 select-none"
                    initial={false}
                    animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                    transition={fade}
                >
                    <motion.div className="relative overflow-hidden" initial={false} animate={{ height: c.height }} transition={moving}>
                        <Swap layout="note" axis="y" distance={10} />
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    )
}

// Under the link unless it won't fit and there's more room above, kept inside the viewport's gutters.
function place(anchor: Anchor, height: number) {
    const { link, prose, viewport } = anchor
    const gap = 8
    const min = GUTTER - prose.left
    const max = Math.max(min, viewport.width - GUTTER - CARD_WIDTH - prose.left)
    const x = Math.min(Math.max(link.left, min), max)
    const roomBelow = viewport.height - (prose.top + link.bottom)
    const roomAbove = prose.top + link.top - TOP_INSET
    const above = roomBelow < height + gap + 16 && roomAbove > roomBelow
    const originX = Math.min(Math.max(link.left + link.width / 2 - x, 0), CARD_WIDTH)
    return {
        x,
        y: above ? link.top - gap - height : link.bottom + gap,
        above,
        origin: `${originX}px ${above ? "100%" : "0%"}`,
    }
}

function Card() {
    const c = useCitations()
    const pointer = usePointer()
    const placement = c.anchor ? place(c.anchor, c.height) : null
    const isOpen = c.active !== null
    const moving = c.mode === "glide" && !c.reduced ? glide : instant
    let fade = exit
    if (isOpen) fade = c.mode === "instant" ? instant : enter

    return (
        <motion.div
            aria-hidden="true"
            data-slot="citation"
            className="absolute top-0 left-0 z-10"
            style={{ width: CARD_WIDTH, pointerEvents: isOpen ? "auto" : "none" }}
            initial={false}
            animate={{ x: placement?.x ?? 0, y: placement?.y ?? 0 }}
            transition={moving}
            {...pointer}
            onClick={() => openSite(c.shown)}
        >
            <motion.div
                className="cursor-pointer rounded-xl bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_1px_3px_rgb(0_0_0/0.06),0_12px_32px_-12px_rgb(0_0_0/0.18)] select-none"
                style={{ transformOrigin: placement?.origin }}
                initial={false}
                animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: placement?.above ? 4 : -4, scale: 0.98 }}
                transition={fade}
            >
                <motion.div className="relative overflow-hidden rounded-[inherit]" initial={false} animate={{ height: c.height }} transition={moving}>
                    <Swap layout="card" axis="x" distance={16} />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export function CitationLink({ id }: Readonly<{ id: CitationId }>) {
    const c = useCitations()
    const descriptionId = useId()
    const citation = CITATIONS[id]

    return (
        <>
            <a
                ref={c.registerLink(id)}
                href={citation.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby={descriptionId}
                onPointerEnter={(e) => fromMouse(e) && c.show(id, "pointer")}
                onPointerLeave={(e) => fromMouse(e) && c.hide()}
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && c.show(id, "focus")}
                onBlur={c.close}
                className={cn(
                    "underline underline-offset-2 transition-[text-decoration-color] duration-150 ease-out",
                    citation.className,
                    c.active === id && "decoration-current",
                )}
            >
                {citation.label}
                <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span id={descriptionId} hidden>{`${citation.role}, ${citation.dates}. ${citation.summary}`}</span>
        </>
    )
}

/** The intro's prose, with one note for all its company links that follows the pointer between them. */
export function IntroCitations({ className, children }: Readonly<{ className?: string; children: ReactNode }>) {
    const [citations, prose] = useCitationsState()

    return (
        <CitationsContext value={citations}>
            {/* Reduced motion drops every transform here and keeps the fades, without branching the first render. */}
            <MotionConfig reducedMotion="user">
                {/* The note sits beside the paragraphs, not inside one: each paragraph's entrance leaves it a containing block. */}
                <div ref={prose} className={cn("relative", className)}>
                    {children}
                    <Rig />
                    {citations.layout === "note" ? <Note /> : <Card />}
                </div>
            </MotionConfig>
        </CitationsContext>
    )
}
