"use client"

import { createContext } from "react"
import type { PlaygroundContextValue } from "./types"

export const PlaygroundContext = createContext<PlaygroundContextValue | null>(null)
