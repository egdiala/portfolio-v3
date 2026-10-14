import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { updateTag } from "next/cache"
import { connection } from "next/server"

export type Where = {
  label: string
  timeZone: string
}

const FILE = path.join(process.cwd(), "data", "where.json")
const FALLBACK: Where = { label: "UTC+1", timeZone: "Etc/GMT-1" }

const PLACE = /^[\p{L}\p{N}][\p{L}\p{N} .,'’+-]{0,39}$/u

export function isTimeZone(value: string) {
  try {
    Intl.DateTimeFormat("en-GB", { timeZone: value })
    return true
  } catch {
    return false
  }
}

export function parseWhere(value: unknown): Where | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  if (typeof record.label !== "string" || typeof record.timeZone !== "string") return null
  const label = record.label.trim()
  if (label.length > 40 || (label && !PLACE.test(label)) || !isTimeZone(record.timeZone)) return null
  return { label, timeZone: record.timeZone }
}

function github() {
  const token = process.env.GITHUB_TOKEN
  if (!token) return null
  const owner = process.env.VERCEL_GIT_REPO_OWNER ?? process.env.GITHUB_REPOSITORY?.split("/")[0] ?? "egdiala"
  const repo = process.env.VERCEL_GIT_REPO_SLUG ?? process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "portfolio-v3"
  const branch = process.env.VERCEL_GIT_COMMIT_REF || "master"
  return { token, owner, repo, branch }
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
}

async function readDisk(): Promise<Where> {
  const raw = await readFile(FILE, "utf8")
  return parseWhere(JSON.parse(raw)) ?? FALLBACK
}

async function readGitHub(): Promise<Where> {
  const remote = github()
  if (!remote) return readDisk()
  const url = `https://api.github.com/repos/${remote.owner}/${remote.repo}/contents/data/where.json?ref=${remote.branch}`
  const response = await fetch(url, {
    headers: githubHeaders(remote.token),
    next: { tags: ["where"], revalidate: 60 },
  })
  if (!response.ok) return readDisk()
  const payload = (await response.json()) as { content?: string }
  if (!payload.content) return readDisk()
  const decoded = Buffer.from(payload.content, "base64").toString("utf8")
  return parseWhere(JSON.parse(decoded)) ?? FALLBACK
}

export async function getWhere(): Promise<Where> {
  try {
    if (process.env.VERCEL === "1" && github()) return await readGitHub()
    await connection()
    return await readDisk()
  } catch {
    return FALLBACK
  }
}

async function writeGitHub(body: string) {
  const remote = github()
  if (!remote) throw new Error("needs-token")
  const url = `https://api.github.com/repos/${remote.owner}/${remote.repo}/contents/data/where.json`
  const current = await fetch(`${url}?ref=${remote.branch}`, { headers: githubHeaders(remote.token), cache: "no-store" })
  if (!current.ok && current.status !== 404) throw new Error("github-write")
  const sha = current.ok ? ((await current.json()) as { sha?: string }).sha : undefined
  const response = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(remote.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Update the footer clock's place",
      content: Buffer.from(body).toString("base64"),
      branch: remote.branch,
      sha,
    }),
  })
  if (!response.ok) throw new Error("github-write")
}

export async function saveWhere(next: Where) {
  const body = `${JSON.stringify(next, null, 2)}\n`
  if (process.env.VERCEL === "1") {
    await writeGitHub(body)
    updateTag("where")
    return
  }
  await writeFile(FILE, body, "utf8")
}
