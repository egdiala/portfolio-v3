import { isValidElement, type ComponentProps } from "react"
import { highlight, type LanguageName } from "sugar-high"
import { CopyButton } from "./copy-button"

const LANGUAGES: Record<string, { name: LanguageName; label: string }> = {
  tsx: { name: "typescript", label: "TSX" },
  ts: { name: "typescript", label: "TypeScript" },
  jsx: { name: "javascript", label: "JSX" },
  js: { name: "javascript", label: "JavaScript" },
  css: { name: "css", label: "CSS" },
  html: { name: "html", label: "HTML" },
  json: { name: "json", label: "JSON" },
  bash: { name: "shell", label: "Shell" },
  sh: { name: "shell", label: "Shell" },
}

// Focusable so the keyboard can scroll lines that overflow.
const preClassName =
  "overflow-x-auto px-4 py-3.5 font-mono text-[0.8125rem] leading-6 [tab-size:2] outline-none focus-visible:ring-[3px] focus-visible:ring-foreground"

export function CodeBlock({ children, ...props }: ComponentProps<"pre">) {
  const element = isValidElement<{ className?: string; children?: unknown }>(children)
    ? children
    : null
  const source = element?.props.children

  if (typeof source !== "string") {
    return (
      <pre {...props} tabIndex={0} className={`my-6 rounded-xl border bg-white ${preClassName} focus-visible:ring-offset-2 focus-visible:ring-offset-background`}>
        {children}
      </pre>
    )
  }

  const fence = /language-(\S+)/.exec(element?.props.className ?? "")?.[1] ?? ""
  const language = LANGUAGES[fence]
  const code = source.replace(/\n$/, "")

  return (
    <div className="my-6 overflow-hidden rounded-xl border bg-white">
      <div className="flex h-11 items-center justify-between border-b ps-4 pe-0.5">
        <span className="font-mono text-xs text-neutral-500">{language?.label ?? "Code"}</span>
        <CopyButton code={code} />
      </div>
      <pre {...props} tabIndex={0} className={`${preClassName} rounded-b-xl focus-visible:ring-inset`}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code, { lang: language?.name }) }} />
      </pre>
    </div>
  )
}
