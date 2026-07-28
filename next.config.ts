import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
    // Uploaded photos come from a Supabase project whose subdomain is
    // only known at deploy time. If you use a custom storage domain,
    // add it above, or set `unoptimized: true` during local development.
  },
};

export default nextConfig;
