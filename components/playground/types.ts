export type PlaygroundContextValue = {
  rate: number
  setRate: (rate: number) => void
}

export type SegmentedOption<T extends string | number> = {
  value: T
  label: string
}

export type SegmentedControlProps<T extends string | number> = {
  label: string
  value: T
  options: ReadonlyArray<SegmentedOption<T>>
  onChange: (value: T) => void
}

export type SliderControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

export type ToggleControlProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}
