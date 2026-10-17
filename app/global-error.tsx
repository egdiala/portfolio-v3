"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import "./globals.css"

// Replaces the root layout when that fails, so it brings its own document, styles and title.
export default function GlobalError({
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
    <html lang="en">
      <body className="antialiased">
        <title>The site fell over — stephen diala</title>
        <main className="mx-auto w-full max-w-[40rem] px-5 pt-24 pb-24">
          <h1 className="text-xl leading-tight font-medium text-balance text-foreground">The site fell over</h1>
          <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-pretty text-neutral-600">
            Something broke before the page could load. Try again, or come back in a minute.
          </p>
          <Button size="lg" onClick={() => retry()} className="relative mt-8 after:absolute after:inset-x-0 after:-inset-y-0.5">
            Try again
          </Button>
        </main>
      </body>
    </html>
  )
}
