export type Article = {
  slug: string
  title: string
  /** The line under the title in the home list. */
  summary: string
  /** What search results and link previews show. */
  description: string
  /** First published, on Hashnode, as `YYYY-MM-DD`. */
  publishedAt: string
}

export const ARTICLES: Article[] = [
  {
    slug: "enforcing-ethereum-mainnet-in-a-wagmi-nextjs-app",
    title: "Enforcing Ethereum Mainnet in Wagmi + Next.js App",
    summary: "Creating dApps restricted to Mainnet using Wagmi and Next.js",
    description:
      "Learn how to enforce Ethereum Mainnet in a Wagmi + Next.js app, ensuring seamless user experience with smart chain detection and switching techniques",
    publishedAt: "2025-09-29",
  },
  {
    slug: "debugging-chronicles-resolving-the-iphone-blank-screen-bug-in-react",
    title: "Resolving the iPhone Blank Screen Bug in React",
    summary:
      "Blank screen in your web projects can be mysterious, particularly when there are no error logs in your browser console.",
    description:
      "Blank screen in your web projects can be mysterious, particularly when there are no error logs in your browser console.",
    publishedAt: "2024-01-05",
  },
]

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug)
}

export function getAdjacentArticles(slug: string) {
  const index = ARTICLES.findIndex((article) => article.slug === slug)

  return {
    previous: index > 0 ? ARTICLES[index - 1] : undefined,
    next: index >= 0 && index < ARTICLES.length - 1 ? ARTICLES[index + 1] : undefined,
  }
}

// UTC, so a date-only string can't slip a day in the reader's time zone.
const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

/** "Sep 2025", for the home list. */
export function formatMonth(date: string) {
  return month.format(new Date(date))
}

/** "Sep 29, 2025", for the article page. */
export function formatDate(date: string) {
  return day.format(new Date(date))
}
