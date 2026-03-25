import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cleanHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
    return [
      {
        source: "/api/:path*",
        destination: `${cleanHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
