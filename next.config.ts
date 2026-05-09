import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/category/:slug((?!review(?:/|$))[^/]+)",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/compress-image",
        destination: "/image-compressor/",
        permanent: true,
      },
      {
        source: "/resize-image",
        destination: "/image-resizer/",
        permanent: true,
      },
      {
        source: "/compress-pdf",
        destination: "/pdf-compressor/",
        permanent: true,
      },
      {
        source: "/merge-pdf",
        destination: "/pdf-merger/",
        permanent: true,
      },
      {
        source: "/split-pdf",
        destination: "/pdf-splitter/",
        permanent: true,
      },
      {
        source: "/adobe-premiere-pro-cc-2024",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-after-effects-latest",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-after-effects-2024",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-photoshop-for-macos",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-after-effects-cc-2023",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-premiere-pro-cc-2023",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-illustrator-cc-2023",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-photoshop-2025",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-illustrator-2025",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/adobe-illustrator-cc-2022",
        destination: "/review/",
        permanent: true,
      },
      {
        source: "/edius-free-download",
        destination: "/review/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
