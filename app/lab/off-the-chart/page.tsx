import type { Metadata } from "next"
import { notFound } from "next/navigation"
import config from "@/lib/off-the-chart/config.json"
import type { ChartConfig } from "@/lib/off-the-chart/render"
import { Lab } from "./lab"

export const metadata: Metadata = {
  title: "Off the chart lab",
  robots: { index: false },
}

export default function OffTheChartLab() {
  if (process.env.NODE_ENV !== "development") notFound()
  return <Lab initial={config as ChartConfig} />
}
