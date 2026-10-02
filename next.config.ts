import type { NextConfig } from "next";
import { MENU_IMAGE_MAX_AGE } from "./lib/image-cache";

const imageCacheControl = `public, max-age=${MENU_IMAGE_MAX_AGE}, immutable`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.private.blob.vercel-storage.com",
      },
    ],
    minimumCacheTTL: MENU_IMAGE_MAX_AGE,
  },
  headers: async () => [
    {
      source: "/uploads/menu/:path*",
      headers: [{ key: "Cache-Control", value: imageCacheControl }],
    },
    {
      source: "/ekke_img/:path*",
      headers: [{ key: "Cache-Control", value: imageCacheControl }],
    },
    {
      source: "/ekke-beer/:path*",
      headers: [{ key: "Cache-Control", value: imageCacheControl }],
    },
  ],
};

export default nextConfig;
