import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://mebel-backend.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
