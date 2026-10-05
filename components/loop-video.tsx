"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_URL ?? "/videos"

export function LoopVideo({ name, className }: Readonly<{ name: string; className?: string }>) {
    const ref = useRef<HTMLVideoElement>(null)
    const prefersReducedMotion = useReducedMotion()
    const [ready, setReady] = useState(false)

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
            preload="none"
            poster={`${mediaBase}/${name}.jpg`}
            className={className}
        >
            {ready ? (
                <>
                    <source src={`${mediaBase}/${name}.webm`} type="video/webm" />
                    <source src={`${mediaBase}/${name}.mp4`} type="video/mp4" />
                </>
            ) : null}
        </video>
    )
}
