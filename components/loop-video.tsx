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
    eager = false,
}: Readonly<{
    name: string
    className?: string
    label?: string
    /** Not inside a link, so it can offer native controls when reduced motion stops autoplay. */
    standalone?: boolean
    /** On screen at load, so its poster is in the server HTML instead of waiting to be near. */
    eager?: boolean
}>) {
    const ref = useRef<HTMLVideoElement>(null)
    const prefersReducedMotion = useReducedMotion()
    // A poster downloads as soon as it's set, whatever `preload` says, so it waits until the video is near.
    const [near, setNear] = useState(eager)
    // The server can't know the motion preference, so sources and controls wait until hydration is done.
    const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
    const ready = hydrated && near && prefersReducedMotion === false
    const controls = hydrated && Boolean(prefersReducedMotion) && standalone

    useEffect(() => {
        const video = ref.current
        if (!video || near) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) setNear(true)
            },
            { rootMargin: "200px 40% 200px 40%", threshold: 0 },
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [near])

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
            poster={near ? media(`videos/${name}.jpg`) : undefined}
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
