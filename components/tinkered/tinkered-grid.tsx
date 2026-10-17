import Link from "next/link"
import { InViewEnter } from "@/components/home/in-view-enter"
import { LoopVideo } from "@/components/loop-video"
import type { TinkeredWork } from "@/lib/tinkered"
import { cn } from "@/lib/utils"

function Preview({ work, decorative }: Readonly<{ work: TinkeredWork; decorative?: boolean }>) {
  return (
    <div aria-hidden={decorative || undefined} className="aspect-video overflow-hidden rounded-2xl border">
      <LoopVideo
        name={work.slug}
        label={decorative ? undefined : work.title}
        standalone={!decorative}
        className={cn("h-full w-full object-cover", work.videoClassName)}
      />
    </div>
  )
}

function WorkCard({ work }: Readonly<{ work: TinkeredWork }>) {
  if (!work.writeup) {
    return (
      <figure>
        <Preview work={work} />
        <figcaption className="pt-3 text-sm leading-snug text-pretty text-neutral-600">
          {work.title}
        </figcaption>
      </figure>
    )
  }

  return (
    <Link
      href={`/tinkered/${work.slug}`}
      className="group block rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <Preview work={work} decorative />
      <span className="flex items-baseline justify-between gap-3 pt-3 text-sm leading-snug">
        <span className="text-pretty text-neutral-600 transition-colors duration-100 ease-out group-hover:text-foreground">
          {work.title}
          <span className="sr-only">,</span>
        </span>
        <span className="shrink-0 text-neutral-600 underline decoration-neutral-400 underline-offset-2 transition-colors duration-100 ease-out group-hover:text-foreground group-hover:decoration-current">
          Read<span className="sr-only"> the writeup</span>
        </span>
      </span>
    </Link>
  )
}

export function TinkeredGrid({ works }: Readonly<{ works: TinkeredWork[] }>) {
  return (
    <div className="@container/tinkered">
      <ul className="grid grid-cols-1 gap-[clamp(0.9rem,1.8cqw,1.3rem)] @min-[701px]/tinkered:grid-cols-2 @min-[981px]/tinkered:grid-cols-3">
        {works.map((work, index) => (
          <InViewEnter key={work.slug} as="li" delay={index * 40} className="min-w-0">
            <WorkCard work={work} />
          </InViewEnter>
        ))}
      </ul>
    </div>
  )
}
