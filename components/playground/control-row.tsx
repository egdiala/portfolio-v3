import type { ReactNode } from "react"

export function ControlRow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
      {children}
    </div>
  )
}
