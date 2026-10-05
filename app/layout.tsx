import type { Metadata, Viewport } from "next";
import { Asimovian, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  title: "stephen diala",
  description: "Frontend engineer at Moniepoint, working on MonieDesk.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="pointer-fine:overscroll-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${asimovian.variable} antialiased`}
      >
        <a
          href="#content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-5 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="content" className="min-h-[calc(100svh+8.75rem)] scroll-mt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
