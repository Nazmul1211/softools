"use client";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { ImageFormatConverter } from "@/components/tools/ImageFormatConverter";

export default function PngToWebpConverterPage() {
  return (
    <ToolLayout
      title="PNG to WEBP Converter"
      description="Convert PNG images to WEBP for smaller file sizes and better web performance. Fast browser conversion with quality control."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "WEBP to PNG Converter", href: "/webp-to-png-converter/" },
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image Resizer", href: "/image-resizer/" },
      ]}
      howToSteps={[
        { name: "Upload PNG", text: "Choose a PNG image from your device." },
        { name: "Adjust Quality", text: "Set WEBP quality for your target size and clarity." },
        { name: "Convert and Download", text: "Convert to WEBP and download immediately." },
      ]}
      faqs={[
        {
          question: "Why should I convert PNG to WEBP?",
          answer:
            "WEBP usually offers smaller file size than PNG, which helps pages load faster and improves bandwidth usage.",
        },
        {
          question: "Can WEBP keep transparency?",
          answer:
            "Yes. WEBP supports transparency, so many transparent PNG images can be converted without losing alpha.",
        },
        {
          question: "Does lower quality always mean smaller file size?",
          answer:
            "In most cases yes. Lower WEBP quality increases compression and reduces size, but can soften image detail.",
        },
      ]}
      content={
        <>
          <h2>Convert PNG to WEBP for Better Web Performance</h2>
          <p>
            WEBP is a modern image format designed for efficient compression. Use this tool to convert PNG assets into WEBP and reduce page weight for faster loading experiences.
          </p>
          <h2>PNG to WEBP Use Cases</h2>
          <ul>
            <li>Optimizing product images and blog graphics</li>
            <li>Improving Core Web Vitals with lighter media files</li>
            <li>Publishing transparent images with lower storage cost</li>
          </ul>
        </>
      }
    >
      <ImageFormatConverter
        accept="image/png,.png"
        uploadDescription="Upload PNG files and convert them to WEBP (up to 40MB)"
        outputMimeType="image/webp"
        outputExtension="webp"
        outputLabel="WEBP"
      />
    </ToolLayout>
  );
}
