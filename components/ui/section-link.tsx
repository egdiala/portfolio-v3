import { LinkIcon } from "@/components/icons/link"
import { cn } from "@/lib/utils"

export function SectionLink({
  id,
  children,
  className,
}: Readonly<{
  id: string
  children: React.ReactNode
  className?: string
}>) {
  const labelId = `${id}-link`

  return (
    <div className="group relative flex items-center gap-2 @min-[80rem]/page:block">
      <a
        href={`#${id}`}
        aria-labelledby={`${labelId} ${id}`}
        className="relative shrink-0 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <LinkIcon aria-hidden="true" className="hidden @min-[80rem]/page:absolute @min-[80rem]/page:top-0 @min-[80rem]/page:-left-8 @min-[80rem]/page:block @min-[80rem]/page:opacity-0 @min-[80rem]/page:transition-opacity @min-[80rem]/page:duration-300 @min-[80rem]/page:group-hover:opacity-100 @min-[80rem]/page:focus-visible:opacity-100" />
        <span id={labelId} className="sr-only">
          Link to
        </span>
        <h2 id={id} className={cn("scroll-mt-36 text-balance", className)}>
          {children}
        </h2>
      </a>
    </div>
  )
}
