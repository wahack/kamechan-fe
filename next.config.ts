import type { NextConfig } from "next";
import { withBaml } from "@boundaryml/baml-nextjs-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverComponentsExternalPackages: ["twitter-api-v2"]
  // },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@boundaryml/baml"],
};

export default withBaml()(nextConfig);
