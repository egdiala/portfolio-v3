import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Server-only: the blob store is proxied through /media so its URL never reaches the client.
const mediaUrl = process.env.MEDIA_URL?.trim().replace(/\/+$/, "");

// Lets a phone on the same network use the dev server: Next only serves dev resources to hosts it knows.
const lanHosts =
  process.env.NODE_ENV === "development"
    ? Object.values(networkInterfaces())
        .flatMap((nets) => nets ?? [])
        .filter((net) => net.family === "IPv4" && !net.internal)
        .map((net) => net.address)
    : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: lanHosts,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async rewrites() {
    return mediaUrl ? [{ source: "/media/:path*", destination: `${mediaUrl}/:path*` }] : [];
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
