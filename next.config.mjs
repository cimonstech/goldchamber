/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Use 'nextdev' for dev to avoid EPERM on .next\trace (common on Windows)
  distDir: process.env.NODE_ENV === "development" ? "nextdev" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
