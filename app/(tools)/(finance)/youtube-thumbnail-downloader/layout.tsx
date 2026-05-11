import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader - HD Thumbnail URLs | SoftZaR",
  description:
    "Download YouTube thumbnails in multiple resolutions. Paste a YouTube URL, preview available sizes, and open or save images instantly.",
  keywords: [
    "youtube thumbnail downloader",
    "youtube thumbnail url",
    "download youtube thumbnail",
    "youtube thumbnail extractor",
    "youtube thumbnail hd",
  ],
  openGraph: {
    title: "YouTube Thumbnail Downloader",
    description:
      "Get YouTube thumbnail image URLs in max resolution, SD, HQ, and default sizes.",
    type: "website",
    url: "https://softzar.com/youtube-thumbnail-downloader/",
  },
  alternates: {
    canonical: "https://softzar.com/youtube-thumbnail-downloader/",
  },
};

export default function YouTubeThumbnailDownloaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
