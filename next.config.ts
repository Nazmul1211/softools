import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/category/:slug",
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
    ];
  },
};

export default nextConfig;
