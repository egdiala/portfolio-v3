import { writeFile } from "node:fs/promises"
import path from "node:path"
import { CHART_DEFAULTS, type ChartConfig } from "@/lib/off-the-chart/render"

const FILE = "lib/off-the-chart/config.json"

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 })

  const body = (await request.json()) as Partial<ChartConfig>
  const config = Object.fromEntries(
    Object.entries(CHART_DEFAULTS).map(([key, fallback]) => {
      const value = body[key as keyof ChartConfig]
      return [key, typeof value === typeof fallback ? value : fallback]
    }),
  )

  await writeFile(path.join(process.cwd(), FILE), `${JSON.stringify(config, null, 2)}\n`)
  return Response.json({ path: FILE })
}
