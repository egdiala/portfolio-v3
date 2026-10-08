"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useReducedMotion } from "motion/react"
import { media } from "@/lib/media"

const subscribeToNothing = () => () => {}

export function LoopVideo({
    name,
    className,
    label,
    standalone = false,
}: Readonly<{
    name: string
    className?: string
    label?: string
    /** Not inside a link, so it can offer native controls when reduced motion stops autoplay. */
    standalone?: boolean
}>) {
    const ref = useRef<HTMLVideoElement>(null)
    const prefersReducedMotion = useReducedMotion()
    const [ready, setReady] = useState(false)
    // The server can't know the motion preference, so controls wait until hydration is done.
    const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
    const controls = hydrated && Boolean(prefersReducedMotion) && standalone

    useEffect(() => {
        const video = ref.current
        if (!video || prefersReducedMotion !== false) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) setReady(true)
            },
            { rootMargin: "200px 40% 200px 40%", threshold: 0 },
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [prefersReducedMotion])

    useEffect(() => {
        const video = ref.current
        if (!video || !ready || prefersReducedMotion) return

        video.load()
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    video.play().catch(() => {})
                } else {
                    video.pause()
                }
            },
            { threshold: 0.25 },
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [ready, prefersReducedMotion])

    return (
        <video
            ref={ref}
            muted
            loop
            playsInline
            controls={controls}
            preload="none"
            poster={media(`videos/${name}.jpg`)}
            aria-label={label}
            className={className}
        >
            {ready || controls ? (
                <>
                    <source src={media(`videos/${name}.webm`)} type="video/webm" />
                    <source src={media(`videos/${name}.mp4`)} type="video/mp4" />
                </>
            ) : null}
        </video>
    )
}
