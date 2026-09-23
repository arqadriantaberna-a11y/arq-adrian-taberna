import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryBasePath = "/arq-adrian-taberna";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? repositoryBasePath : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? repositoryBasePath : "",
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
