"use client"

import { createContext, useContext, useRef, useState, type DragEvent, type ReactNode, type Ref } from "react"
import { UploadIcon } from "lucide-react"
import { useTimeScale } from "@/components/playground/time-scale"
import { cn } from "@/lib/utils"

type DropzoneContextType = {
  src?: File[]
  accept?: string
  maxSize?: number
  maxFiles?: number
}

const renderBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)}${units[unitIndex]}`
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)

function accepts(file: File, accept: string | undefined, maxSize: number | undefined) {
  if (maxSize && file.size > maxSize) return false
  if (!accept) return true
  const name = file.name.toLowerCase()
  return accept.split(",").some((extension) => name.endsWith(extension.trim()))
}

/**
 * Melun's Dropzone, with a file input and drag events in place of react-dropzone.
 * Clicking opens the file picker, dropping a file picks it, and the files go to
 * `onDrop`. `children` sit under the drop area. `ref` reaches the drop area's button.
 */
export function Dropzone({
  ref,
  accept,
  maxFiles = 1,
  maxSize,
  onDrop,
  src,
  className,
  children,
}: Readonly<{
  ref?: Ref<HTMLButtonElement>
  accept?: string
  maxFiles?: number
  maxSize?: number
  onDrop?: (files: File[]) => void
  src?: File[]
  className?: string
  children?: ReactNode
}>) {
  const time = useTimeScale()
  const inputRef = useRef<HTMLInputElement>(null)
  // Counts enters and leaves, since moving over a child fires a leave on the parent.
  const dragDepth = useRef(0)
  const [isDragActive, setIsDragActive] = useState(false)

  const take = (files: FileList | null) => {
    const picked = Array.from(files ?? []).slice(0, maxFiles)
    if (picked.length === 0 || !picked.every((file) => accepts(file, accept, maxSize))) return
    onDrop?.(picked)
  }

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault()
    dragDepth.current++
    setIsDragActive(true)
  }

  const onDragLeave = (event: DragEvent) => {
    event.preventDefault()
    dragDepth.current--
    if (dragDepth.current === 0) setIsDragActive(false)
  }

  const onDropFiles = (event: DragEvent) => {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragActive(false)
    take(event.dataTransfer.files)
  }

  return (
    <DropzoneContext key={JSON.stringify(src)} value={{ src, accept, maxSize, maxFiles }}>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles !== 1}
          tabIndex={-1}
          className="hidden"
          onChange={(event) => {
            take(event.target.files)
            // Picking the same file again should still count as a pick.
            event.target.value = ""
          }}
        />
        <button
          ref={ref}
          className={cn(
            "relative h-auto w-full flex-col overflow-hidden rounded-xl p-6",
            "inset-0 bg-melun-neutral-50 text-black inset-ring-1 inset-ring-transparent after:absolute after:inset-shadow-none hover:bg-white hover:inset-ring-melun-neutral-300 disabled:bg-melun-neutral-300 disabled:text-melun-neutral-700 disabled:after:inset-shadow-melun-neutral-300",
            "transition-all duration-200 ease-out",
            isDragActive && "ring-1 ring-melun-ring outline-none",
            className,
          )}
          style={{ transitionDuration: `${time.ms(200)}ms` }}
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={onDragEnter}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={onDragLeave}
          onDrop={onDropFiles}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </button>
        {children}
      </div>
    </DropzoneContext>
  )
}

export function useDropzoneContext() {
  const context = useContext(DropzoneContext)
  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone")
  }
  return context
}

const maxLabelItems = 3

const iconClassName =
  "relative mb-2 flex size-9 items-center justify-center rounded-full bg-white text-melun-neutral-800 inset-0 inset-ring-1 inset-ring-melun-neutral-300 after:absolute after:inset-shadow-none"

const titleClassName = "w-full truncate text-wrap font-sans text-base leading-6 font-normal tracking-wide"

const captionClassName =
  "w-full truncate text-wrap font-sans text-sm leading-5 font-normal tracking-wide text-melun-muted-foreground"

function DropzoneContent() {
  const { src } = useDropzoneContext()
  if (!src) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={iconClassName}>
        <UploadIcon size={16} aria-hidden="true" />
      </div>
      <p className={titleClassName}>
        {src.length > maxLabelItems
          ? `${new Intl.ListFormat("en").format(src.slice(0, maxLabelItems).map((file) => file.name))} and ${src.length - maxLabelItems} more`
          : new Intl.ListFormat("en").format(src.map((file) => file.name))}
      </p>
      <p className={captionClassName}>Drag and drop or click to replace</p>
    </div>
  )
}

function DropzoneEmptyState() {
  const { src, maxSize, maxFiles } = useDropzoneContext()
  if (src) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={iconClassName}>
        <UploadIcon size={16} aria-hidden="true" />
      </div>
      <p className={titleClassName}>Upload {maxFiles === 1 ? "file" : "files"}</p>
      <p className={captionClassName}>
        Drag & drop or click to browse {maxSize && <>(max. {renderBytes(maxSize)})</>}
      </p>
    </div>
  )
}
