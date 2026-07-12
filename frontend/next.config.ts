import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://oodo2026-backend.blacksky-e0f71111.centralindia.azurecontainerapps.io/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
