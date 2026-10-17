"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function Error({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string }
  retry: () => void
}>) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container as="section" className="px-5 pt-14 pb-24">
      <div className="mx-auto w-full max-w-[40rem]">
        <h1 className="rise-in text-xl leading-tight font-medium text-balance text-foreground">
          This page fell over
        </h1>
        <p
          className="rise-in mt-2 max-w-[52ch] text-base leading-relaxed text-pretty text-neutral-600"
          style={{ animationDelay: "60ms" }}
        >
          Something on it broke while it was loading. Trying again usually brings it back, and the rest of the site
          still works.
        </p>

        <div
          className="rise-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ animationDelay: "120ms" }}
        >
          <Button size="lg" onClick={() => retry()} className="relative after:absolute after:inset-x-0 after:-inset-y-0.5">
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full text-sm font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors duration-100 ease-out outline-none hover:text-foreground hover:decoration-neutral-500 focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  )
}
