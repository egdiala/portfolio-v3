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
    <div className="group relative flex items-center gap-2 xl:block">
      <a
        href={`#${id}`}
        aria-labelledby={`${labelId} ${id}`}
        className="relative shrink-0 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <LinkIcon aria-hidden="true" className="hidden xl:block xl:absolute xl:top-0 xl:-left-8 xl:opacity-0 xl:transition-opacity xl:duration-300 xl:group-hover:opacity-100 xl:focus-visible:opacity-100" />
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
