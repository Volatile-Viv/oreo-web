/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Required for static export
  trailingSlash: true, // Ensures correct file structure
  images: { unoptimized: true }, // Fixes issues with `next/image`
};

module.exports = nextConfig;