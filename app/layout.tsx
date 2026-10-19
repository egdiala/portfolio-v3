import type { Metadata, Viewport } from "next";
import { Asimovian, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { EpisodeAnalytics } from "@/components/said-out-loud/episode-analytics";
import { EpisodeProvider } from "@/components/said-out-loud/episode-provider";
import { MiniPlayer } from "@/components/said-out-loud/mini-player";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Only code blocks use it, so it shouldn't compete with the page's own fonts.
  preload: false,
});

const asimovian = Asimovian({
  variable: "--font-asimovian",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Stephen Diala", url: "https://x.com/e_diala" }],
  creator: "Stephen Diala",
  twitter: { card: "summary_large_image", creator: "@e_diala" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  // Light-only for now: this also keeps Chrome's auto dark mode from inverting the page.
  colorScheme: "only light",
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="pointer-fine:overscroll-y-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${asimovian.variable} antialiased`}
      >
        <a
          href="#content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-5 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Skip to content
        </a>
        <EpisodeProvider>
          <Navbar />
          <main id="content" tabIndex={-1} className="@container/page flex-1 scroll-mt-20 outline-none">
            {children}
          </main>
          <Footer />
          <MiniPlayer />
          <EpisodeAnalytics />
        </EpisodeProvider>
        <Analytics />
      </body>
    </html>
  );
}
