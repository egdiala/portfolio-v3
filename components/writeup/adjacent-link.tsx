import Link from "next/link"

export function AdjacentLink({
  href,
  title,
  direction,
}: Readonly<{ href: string; title: string; direction: "previous" | "next" }>) {
  const next = direction === "next"

  return (
    <Link
      href={href}
      rel={next ? "next" : "prev"}
      className={`group flex min-h-11 flex-col justify-center gap-1 rounded-lg py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background ${next ? "col-start-2 items-end text-end" : "items-start"}`}
    >
      <span className="text-sm text-neutral-600">
        {next ? "Next" : "Previous"}
      </span>
      <span className="font-medium text-pretty text-foreground underline decoration-transparent underline-offset-2 transition-colors duration-100 ease-out group-hover:decoration-neutral-400">
        {title}
      </span>
    </Link>
  )
}
