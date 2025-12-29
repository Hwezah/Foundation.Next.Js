/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-3.listennotes.com",
        port: "",
        pathname: "/**", // Allows any path under this hostname
      },
      // You can add other hostnames here if needed
      // For example, if you also use img.youtube.com:
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // ... any other configurations you might have
};

export default nextConfig;
