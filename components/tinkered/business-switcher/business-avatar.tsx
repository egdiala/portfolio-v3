import { media } from "@/lib/media"
import type { Business } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
}

export function BusinessAvatar({
  business,
  decorative = false,
  className,
  imageClassName,
}: Readonly<{
  business: Business
  /** The business's name is already printed beside the avatar. */
  decorative?: boolean
  className?: string
  imageClassName?: string
}>) {
  return (
    <Avatar className={className}>
      <AvatarImage src={media(business.logo)} alt={decorative ? "" : business.name} className={imageClassName} />
      <AvatarFallback aria-hidden={decorative || undefined}>{initials(business.name)}</AvatarFallback>
    </Avatar>
  )
}
