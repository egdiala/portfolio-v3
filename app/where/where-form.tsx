"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import type { Where } from "@/lib/where"
import { updateWhere, type WhereState } from "./actions"

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground outline-none transition-colors duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function WhereForm({
  where,
  zones,
}: Readonly<{ where: Where; zones: string[] }>) {
  const [state, action, pending] = useActionState<WhereState, FormData>(updateWhere, null)

  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="label" className="text-sm font-medium">
          Place
        </label>
        <input
          id="label"
          name="label"
          defaultValue={state?.values?.label ?? where.label}
          required
          maxLength={40}
          autoComplete="off"
          // The only password field here is the passphrase, so managers would save this as the username.
          data-1p-ignore
          data-lpignore="true"
          className={fieldClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="timeZone" className="text-sm font-medium">
          Time zone
        </label>
        <input
          id="timeZone"
          name="timeZone"
          defaultValue={state?.values?.timeZone ?? where.timeZone}
          required
          list="time-zones"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          spellCheck={false}
          className={fieldClass}
        />
        <datalist id="time-zones">
          {zones.map((zone) => (
            <option key={zone} value={zone} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Passphrase
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="relative min-w-32 after:absolute after:inset-x-0 after:-inset-y-0.5"
      >
        {pending ? "Saving…" : "Save place"}
      </Button>
      {/* Always rendered, so screen readers are already listening when a message arrives. */}
      <div>
        <p role="alert" className="text-sm text-pretty text-neutral-600">
          {state?.error}
        </p>
        <p role="status" className="text-sm text-pretty">
          {state?.saved ? `The footer now keeps time for ${state.saved}.` : null}
        </p>
      </div>
    </form>
  )
}
