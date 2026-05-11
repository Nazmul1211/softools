"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";

type ThumbnailVariant = {
  label: string;
  file: string;
};

const variants: ThumbnailVariant[] = [
  { label: "Max Resolution", file: "maxresdefault.jpg" },
  { label: "Standard Definition", file: "sddefault.jpg" },
  { label: "High Quality", file: "hqdefault.jpg" },
  { label: "Medium Quality", file: "mqdefault.jpg" },
  { label: "Default", file: "default.jpg" },
];

const faqs: FAQItem[] = [
  {
    question: "How does the YouTube Thumbnail Downloader work?",
    answer:
      "Paste a YouTube watch URL, short URL, embed URL, or direct video ID. The tool extracts the video ID and builds official thumbnail image URLs from YouTube image hosts.",
  },
  {
    question: "Can I download HD thumbnails?",
    answer:
      "Yes. If available for the video, the max resolution image is shown first. You can also use SD, HQ, and default sizes.",
  },
  {
    question: "Do I need to sign in?",
    answer:
      "No. This tool runs in your browser and does not require an account or upload.",
  },
];

function parseVideoId(value: string): string | null {
  const input = value.trim();
  if (!input) return null;

  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?[^#\n\r]*v=([A-Za-z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export default function YouTubeThumbnailDownloaderPage() {
  const [urlOrId, setUrlOrId] = useState("");

  const videoId = useMemo(() => parseVideoId(urlOrId), [urlOrId]);
  const thumbnails = useMemo(
    () =>
      videoId
        ? variants.map((variant) => ({
            ...variant,
            url: `https://img.youtube.com/vi/${videoId}/${variant.file}`,
          }))
        : [],
    [videoId]
  );

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      slug="youtube-thumbnail-downloader"
      description="Extract and download YouTube thumbnail URLs in HD and standard sizes."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Paste YouTube URL", text: "Paste any watch URL, short link, embed link, or 11-character video ID." },
        { name: "Preview available sizes", text: "The tool shows max, SD, HQ, MQ, and default thumbnail variants." },
        { name: "Open or download", text: "Click open or download on the size you want." },
      ]}
      relatedTools={[
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "TikTok Money Calculator", href: "/tiktok-money-calculator/" },
        { name: "Instagram Engagement Rate Calculator", href: "/instagram-engagement-rate-calculator/" },
      ]}
      content={
        <>
          <h2>What this tool does</h2>
          <p>
            This YouTube Thumbnail Downloader extracts a video ID and generates direct image URLs for official YouTube thumbnail
            sizes. It is useful for content audits, design comparisons, and quick reference thumbnails.
          </p>
          <h2>Supported input formats</h2>
          <ul>
            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://youtu.be/VIDEO_ID</li>
            <li>https://www.youtube.com/embed/VIDEO_ID</li>
            <li>VIDEO_ID</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="YouTube URL or Video ID"
          value={urlOrId}
          onChange={(event) => setUrlOrId(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        />

        {urlOrId.trim() && !videoId && (
          <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Enter a valid YouTube URL or 11-character video ID.
          </p>
        )}

        {videoId && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Video ID: <strong className="text-foreground">{videoId}</strong>
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {thumbnails.map((item) => (
                <div key={item.file} className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">{item.label}</p>
                  <img
                    src={item.url}
                    alt={`${item.label} thumbnail preview`}
                    className="h-auto w-full rounded-lg border border-border"
                    loading="lazy"
                  />
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      Open
                    </a>
                    <a
                      href={item.url}
                      download={`${videoId}-${item.file}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
