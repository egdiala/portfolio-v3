"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Playground, PlaygroundControls, PlaygroundStage, SegmentedControl } from "@/components/playground/playground"
import { ACCEPT, MAX_SIZE, SAMPLE_FILE_NAME } from "./constants"
import { Dropzone } from "./dropzone"
import { useMockUpload } from "./hooks/use-mock-upload"
import { DropzoneSelectedFiles } from "./selected-files"
import type { UploadResult } from "./types"

const RESULTS = [
  { value: "completed", label: "Completes" },
  { value: "failed", label: "Fails" },
] as const

function Demo() {
  const [result, setResult] = useState<UploadResult>("completed")
  const [files, setFiles] = useState<File[] | undefined>(() => [
    new File([], SAMPLE_FILE_NAME, { type: "application/pdf" }),
  ])
  const upload = useMockUpload(result)
  const { start, cancel } = upload
  const fieldRef = useRef<HTMLDivElement>(null)
  const dropzoneRef = useRef<HTMLButtonElement>(null)
  const refocusDropzone = useRef(false)

  // The sample file is already picked, so its upload starts with the demo.
  useEffect(() => {
    start()
  }, [start])

  // Removing the file takes the focused button with it, so focus lands on the dropzone instead.
  // The dropzone remounts when the file goes, so this waits for the new one.
  useEffect(() => {
    if (!refocusDropzone.current) return
    refocusDropzone.current = false
    dropzoneRef.current?.focus()
  }, [files])

  const clearFiles = useCallback(() => {
    refocusDropzone.current = fieldRef.current?.contains(document.activeElement) ?? false
    setFiles(undefined)
  }, [])

  const handleDrop = (picked: File[]) => {
    setFiles(picked)
    start()
  }

  const handleCancel = useCallback(() => {
    cancel()
    clearFiles()
  }, [cancel, clearFiles])

  return (
    <>
      <PlaygroundStage className="min-h-[26rem] items-start pt-12">
        <div ref={fieldRef} className="w-full max-w-md text-left">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-lg leading-6 font-medium tracking-wide text-black">
              Certificate of Incorporation
            </span>
            <p className="font-sans text-sm leading-5 font-normal tracking-wide text-melun-neutral-950">
              Upload your business CAC document for verification.
            </p>
          </div>
          <Dropzone
            ref={dropzoneRef}
            accept={ACCEPT}
            maxFiles={1}
            maxSize={MAX_SIZE}
            onDrop={handleDrop}
            src={files}
            className="mt-4"
          >
            <DropzoneSelectedFiles
              state={upload.state}
              progress={upload.progress}
              onCancel={handleCancel}
              onRetry={start}
              onRemove={clearFiles}
            />
          </Dropzone>
        </div>
      </PlaygroundStage>
      <PlaygroundControls>
        <SegmentedControl label="Upload result" value={result} options={RESULTS} onChange={setResult} />
      </PlaygroundControls>
    </>
  )
}

export function FilePickerPlayground() {
  return (
    <Playground caption="The upload is pretend and takes 3 to 5 seconds. Set Upload result to Fails to watch it give up, then press Try again. Once it completes, press and hold the trash to remove the file. Click the dropzone or drop a file on it to upload another. Only its name is used, and it stays in your browser.">
      <Demo />
    </Playground>
  )
}
