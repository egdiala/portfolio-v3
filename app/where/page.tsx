import type { Metadata } from "next"
import { getWhere } from "@/lib/where"
import { WhereForm } from "./where-form"

export const metadata: Metadata = {
  title: "Where",
  robots: { index: false, follow: false },
}

export default async function WherePage() {
  const where = await getWhere()
  const zones = Intl.supportedValuesOf("timeZone")

  return (
    <div className="px-5 py-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-balance text-2xl font-medium tracking-[-0.02em]">Where you are</h1>
        <p className="mt-3 text-pretty leading-relaxed text-neutral-600">
          The footer clock uses this place. Everyone else still sees your time, not theirs. This page isn’t linked
          from the site.
        </p>
        <WhereForm where={where} zones={zones} />
      </div>
    </div>
  )
}
