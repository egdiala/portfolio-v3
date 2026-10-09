import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import { isValidElement, type ComponentProps, type ReactNode } from "react"
import { SectionLink } from "@/components/ui/section-link"
import { CodeBlock } from "@/components/writeup/code-block"

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

function slugify(node: ReactNode) {
  return textOf(node)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

const linkClassName =
  "rounded-sm text-foreground underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out outline-none hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function Anchor({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} className={linkClassName} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName} {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

const components = {
  h2: ({ children }) => (
    <div className="mt-12 mb-3">
      <SectionLink id={slugify(children)} className="text-base font-medium text-foreground">
        {children}
      </SectionLink>
    </div>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(children)} className="mt-8 mb-2 scroll-mt-36 font-medium text-balance text-foreground">
      {children}
    </h3>
  ),
  p: (props) => <p className="my-5" {...props} />,
  a: Anchor,
  strong: (props) => <strong className="font-medium text-foreground" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 ps-5 marker:text-neutral-400" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 ps-5 marker:text-neutral-500" {...props} />,
  li: (props) => <li className="ps-1" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-6 border-s-2 border-neutral-300 ps-4 text-neutral-700" {...props} />
  ),
  hr: () => <hr className="my-12 border-border" />,
  code: (props) => (
    <code
      className="rounded-md bg-neutral-200/60 px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
      {...props}
    />
  ),
  pre: CodeBlock,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
