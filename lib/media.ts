/**
 * The blob store mirrors `public/`, so a path like `videos/area.mp4` or
 * `tinkered/dynamic-island/cover.jpg` keeps its folders. It's served from
 * `/media`, which next.config.ts rewrites to the store using `MEDIA_URL`.
 */
export function media(path: string) {
  return `/media/${path}`
}
