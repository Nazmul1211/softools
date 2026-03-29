"use client";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { ImageFormatConverter } from "@/components/tools/ImageFormatConverter";

export default function WebpToPngConverterPage() {
  return (
    <ToolLayout
      title="WEBP to PNG Converter"
      description="Convert WEBP images to PNG format online in seconds. Great for transparency workflows and broad compatibility."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "PNG to WEBP Converter", href: "/png-to-webp-converter/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image Resizer", href: "/image-resizer/" },
      ]}
      howToSteps={[
        { name: "Upload WEBP", text: "Select your WEBP image from device storage." },
        { name: "Convert", text: "Click convert to process WEBP into PNG." },
        { name: "Download PNG", text: "Download your PNG output immediately." },
      ]}
      faqs={[
        {
          question: "Why convert WEBP to PNG?",
          answer:
            "PNG is widely supported in editing tools and workflows that require lossless quality and transparency handling.",
        },
        {
          question: "Will transparency be preserved?",
          answer:
            "Yes. PNG supports alpha transparency and most transparent WEBP images keep transparency after conversion.",
        },
        {
          question: "Do I need to install software?",
          answer:
            "No. This converter runs in your browser and requires no installation.",
        },
      ]}
      content={
        <>
          <h2>Convert WEBP to PNG for Maximum Compatibility</h2>
          <p>
            WEBP offers strong compression, but many editing and publishing pipelines still rely on PNG. This tool converts WEBP to PNG quickly while keeping a clean result.
          </p>
          <h2>Best Use Cases</h2>
          <ul>
            <li>Preparing transparent assets for design software</li>
            <li>Using PNG in platforms with limited WEBP support</li>
            <li>Archiving images in a lossless format</li>
          </ul>
        </>
      }
    >
      <ImageFormatConverter
        accept="image/webp,.webp"
        uploadDescription="Upload WEBP files and convert them to PNG (up to 40MB)"
        outputMimeType="image/png"
        outputExtension="png"
        outputLabel="PNG"
      />
    </ToolLayout>
  );
}
