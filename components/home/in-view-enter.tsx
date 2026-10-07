"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react"
import { cn } from "@/lib/utils"

type RevealState = "pending" | "armed" | "shown"

export function InViewEnter({
    as = "div",
    delay = 0,
    className,
    children,
}: Readonly<{
    as?: "div" | "li"
    delay?: number
    className?: string
    children: ReactNode
}>) {
    const ref = useRef<HTMLElement>(null)
    const [state, setState] = useState<RevealState>("pending")
    const [reduce, setReduce] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
        if (motion.matches) {
            setReduce(true)
            setState("shown")
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return
                if (entry.isIntersecting) {
                    setState("shown")
                    observer.disconnect()
                    return
                }
                if (entry.boundingClientRect.top > 0) {
                    setState((current) => (current === "shown" ? current : "armed"))
                }
            },
            { threshold: 0.2 },
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    const style: CSSProperties | undefined = state === "shown" && !reduce ? { animationDelay: `${delay}ms` } : undefined
    const shared = {
        "data-reveal": state,
        className: cn(!reduce && state === "shown" && "home-enter", className),
        style,
        children,
    }

    if (as === "li") {
        return <li ref={ref as Ref<HTMLLIElement>} {...shared} />
    }

    return <div ref={ref as Ref<HTMLDivElement>} {...shared} />
}
