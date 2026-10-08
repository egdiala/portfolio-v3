import type { Metadata } from "next"
import Link from "next/link"
import { Chart } from "@/components/off-the-chart/chart"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import config from "@/lib/off-the-chart/config.json"
import { renderChart, type ChartConfig } from "@/lib/off-the-chart/render"

export const metadata: Metadata = {
  title: "Off the chart",
}

export default function NotFound() {
  const model = renderChart(config as ChartConfig)

  return (
    <Container as="section" className="px-5 pt-14 pb-24">
      <div className="mx-auto w-full max-w-[40rem]">
        <div className="rise-in overflow-hidden rounded-2xl border bg-white">
          <Chart model={model} animated />
        </div>

        <h1
          className="rise-in mt-10 text-xl leading-tight font-medium text-balance text-foreground"
          style={{ animationDelay: "60ms" }}
        >
          This page is off the chart
        </h1>
        <p
          className="rise-in mt-2 max-w-[52ch] text-base leading-relaxed text-pretty text-neutral-600"
          style={{ animationDelay: "120ms" }}
        >
          {"The link you followed sails past the last coast I've mapped. The page may have moved, or it was never here."}
        </p>

        <div
          className="rise-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
          style={{ animationDelay: "180ms" }}
        >
          <Button size="lg" asChild className="relative after:absolute after:inset-x-0 after:-inset-y-0.5">
            <Link href="/">Back to home</Link>
          </Button>
          <Link
            href="/tinkered"
            className="inline-flex min-h-11 items-center rounded-full text-sm font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors duration-100 ease-out outline-none hover:text-foreground hover:decoration-neutral-500 focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Browse tinkered works
          </Link>
        </div>
      </div>
    </Container>
  )
}
