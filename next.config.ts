import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
    authInterrupts: true,
  },
  images: {
    domains: ["images.prismic.io"],
  },
};

export default nextConfig;
