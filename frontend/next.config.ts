import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/api/:path*",
        destination: isDev
          ? "http://localhost:8000/:path*"
          : "https://mebel-backend.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
