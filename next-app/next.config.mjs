/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["utfs.io"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "www.yuvamanthan.org",
      },

      {
        protocol: "https",
        hostname: "media.licdn.com",
      },

      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
};

export default nextConfig;
