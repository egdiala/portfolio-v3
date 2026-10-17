"use client"

import { useContext } from "react"
import { PlaygroundContext } from "../context"

export function usePlayground() {
  const context = useContext(PlaygroundContext)
  if (!context) throw new Error("Playground parts must render inside <Playground>.")
  return context
}
