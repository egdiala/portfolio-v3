"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

function formatTime(now: Date, timeZone: string, withSeconds: boolean) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hourCycle: "h23",
  }).format(now)
}

export function FooterClock({ timeZone, label }: Readonly<{ timeZone: string; label: string }>) {
  const reduce = useReducedMotion()
  const [now, setNow] = useState<Date | null>(null)
  const withSeconds = reduce !== true

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, withSeconds ? 1000 : 60_000)
    return () => window.clearInterval(id)
  }, [withSeconds])

  const time = now ? formatTime(now, timeZone, withSeconds) : "--:--:--"

  return (
    <p className={now ? "tabular-nums whitespace-nowrap" : "invisible tabular-nums whitespace-nowrap"}>
      <span aria-hidden="true">🌍 </span>
      <time dateTime={now?.toISOString()}>{time}</time>
      {label ? ` ${label}` : null}
    </p>
  )
}
