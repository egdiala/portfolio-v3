"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import { Chart } from "@/components/off-the-chart/chart"
import { SegmentedControl, SliderControl } from "@/components/playground/playground"
import { Button } from "@/components/ui/button"
import { renderChart, type ChartConfig } from "@/lib/off-the-chart/render"

const STORAGE_KEY = "off-the-chart:saved"
const CHANGE_EVENT = "off-the-chart:saved"
const NO_SAVES: ChartConfig[] = []

let cachedRaw: string | null = null
let cachedSaves = NO_SAVES

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function readSaves() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedSaves = raw ? (JSON.parse(raw) as ChartConfig[]) : NO_SAVES
  }
  return cachedSaves
}

function writeSaves(saves: ChartConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

const MODES = [
  { value: "coast", label: "Coast" },
  { value: "island", label: "Island" },
] as const
const WINDS = [
  { value: 16, label: "16" },
  { value: 32, label: "32" },
] as const
const ROSES = [
  { value: 0, label: "0" },
  { value: 8, label: "8" },
  { value: 16, label: "16" },
] as const

const fixed = (digits: number) => (value: number) => value.toFixed(digits)
const percent = (value: number) => `${Math.round(value * 100)}%`

export function Lab({ initial }: Readonly<{ initial: ChartConfig }>) {
  const [config, setConfig] = useState(initial)
  const [status, setStatus] = useState("")
  const saves = useSyncExternalStore(subscribe, readSaves, () => NO_SAVES)
  const model = useMemo(() => renderChart(config), [config])

  const set =
    <K extends keyof ChartConfig>(key: K) =>
    (value: ChartConfig[K]) =>
      setConfig((current) => ({ ...current, [key]: value }))

  async function save() {
    const json = JSON.stringify(config, null, 2)
    await navigator.clipboard.writeText(json).catch(() => undefined)
    writeSaves([config, ...saves.filter((saved) => JSON.stringify(saved, null, 2) !== json)].slice(0, 12))

    const response = await fetch("/lab/off-the-chart/save", { method: "POST", body: json })
    if (!response.ok) {
      setStatus("Copied the config, but the file could not be written.")
      return
    }
    const { path } = (await response.json()) as { path: string }
    setStatus(`Wrote ${path} and copied the config.`)
  }

  return (
    <section className="px-5 pt-10 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="text-base font-medium text-foreground">Off the chart</h1>
          <p className="text-sm text-neutral-600">
            Click the chart for a new one · Seed{" "}
            <span className="font-mono text-foreground tabular-nums">{config.seed}</span>
          </p>
        </header>

        <button
          type="button"
          onClick={() => set("seed")(Math.floor(Math.random() * 1_000_000))}
          className="mt-4 block w-full cursor-pointer overflow-hidden rounded-2xl border bg-white outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Chart model={model} />
          <span className="sr-only">New variation</span>
        </button>

        <div className="mt-6 grid gap-6 @min-[52rem]/page:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="grid gap-x-8 rounded-2xl border bg-neutral-50 px-4 @min-[40rem]/page:grid-cols-2 [&>*]:border-b [&>*]:border-border">
            <SegmentedControl label="Mode" value={config.mode} options={MODES} onChange={set("mode")} />
            <SliderControl label="Roughness" value={config.roughness} min={0.15} max={0.45} step={0.01} format={fixed(2)} onChange={set("roughness")} />
            <SliderControl label="Surveyed" value={config.surveyed} min={0.35} max={0.8} step={0.01} format={percent} onChange={set("surveyed")} />
            <SliderControl label="Unsurveyed" value={config.unsurveyed} min={0.08} max={0.3} step={0.01} format={percent} onChange={set("unsurveyed")} />
            <SliderControl label="Waterlines" value={config.waterlines} min={0} max={7} onChange={set("waterlines")} />
            <SliderControl label="First offset" value={config.firstOffset} min={3} max={10} step={0.5} format={fixed(1)} onChange={set("firstOffset")} />
            <SliderControl label="Spacing" value={config.spacing} min={1.1} max={1.6} step={0.05} format={fixed(2)} onChange={set("spacing")} />
            <SegmentedControl label="Winds" value={config.winds} options={WINDS} onChange={set("winds")} />
            <SegmentedControl label="Satellite roses" value={config.roses} options={ROSES} onChange={set("roses")} />
            <SliderControl label="Rhumb strength" value={config.rhumbStrength} min={0.03} max={0.2} step={0.01} format={fixed(2)} onChange={set("rhumbStrength")} />
            <SliderControl label="Wander" value={config.wander} min={0} max={1} step={0.05} format={fixed(2)} onChange={set("wander")} />
            <SliderControl label="Ink" value={config.ink} min={0.6} max={1.6} step={0.05} format={fixed(2)} onChange={set("ink")} />
          </div>

          <aside className="flex flex-col gap-3">
            <Button size="lg" onClick={save}>
              Save
            </Button>
            <p aria-live="polite" className="min-h-5 text-sm text-pretty text-neutral-600">
              {status}
            </p>
            {saves.length > 0 ? (
              <>
                <h2 className="mt-2 text-sm text-neutral-600">Saved</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {saves.map((saved) => (
                    <li key={JSON.stringify(saved)}>
                      <button
                        type="button"
                        onClick={() => setConfig(saved)}
                        className="block w-full cursor-pointer overflow-hidden rounded-lg border bg-white outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <Chart model={renderChart(saved)} />
                        <span className="sr-only">
                          Apply {saved.mode} chart, seed {saved.seed}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}
