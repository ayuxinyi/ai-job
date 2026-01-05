import "./utils/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
