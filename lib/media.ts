/**
 * The blob store mirrors `public/`, so a path like `videos/area.mp4` or
 * `tinkered/dynamic-island/cover.jpg` keeps its folders. It's served from
 * `/media`, which next.config.ts rewrites to the store using `MEDIA_URL`.
 * Local copies in `public/media/` (gitignored) are served before the rewrite,
 * so the dev server doesn't spend Blob transfer.
 */
export function media(path: string) {
  return `/media/${path}`
}
