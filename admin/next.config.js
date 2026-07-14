/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Uploaded media is served from /uploads at the project root (see ../uploads/README.md).
  // In production, point this at wherever the uploads folder is actually hosted.
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
