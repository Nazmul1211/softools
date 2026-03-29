"use client";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { ImageFormatConverter } from "@/components/tools/ImageFormatConverter";

export default function ImageToPNGConverterPage() {
  return (
    <ToolLayout
      title="Image to PNG Converter"
      description="Convert JPG, WEBP, GIF, and BMP images into PNG format instantly. Runs locally in your browser for speed and privacy."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "WEBP to PNG Converter", href: "/webp-to-png-converter/" },
        { name: "PNG to WEBP Converter", href: "/png-to-webp-converter/" },
        { name: "Image Resizer", href: "/image-resizer/" },
      ]}
      howToSteps={[
        { name: "Upload Image", text: "Drop or browse your image file." },
        { name: "Convert", text: "Click convert to process the file into PNG format." },
        { name: "Download", text: "Download your converted PNG file instantly." },
      ]}
      faqs={[
        {
          question: "Will image quality be preserved in PNG output?",
          answer:
            "PNG is a lossless format, so visual quality is preserved in most conversions. Output size may be larger than JPG.",
        },
        {
          question: "Is this converter private?",
          answer:
            "Yes. Conversion runs in your browser and your image file is not uploaded to any server.",
        },
        {
          question: "Which image formats can I convert to PNG?",
          answer:
            "You can convert common formats such as JPG, JPEG, WEBP, GIF, and BMP to PNG.",
        },
      ]}
      content={
        <>
          <h2>Convert Images to PNG Online</h2>
          <p>
            Use this free Image to PNG converter to create crisp, transparent-friendly PNG files from popular image formats. It is ideal for logos, UI assets, screenshots, and design files.
          </p>
          <h2>Benefits of PNG Format</h2>
          <ul>
            <li>Lossless quality for clean edges and sharp details</li>
            <li>Supports transparency for overlays and logos</li>
            <li>Widely supported across web, mobile, and design tools</li>
          </ul>
        </>
      }
    >
      <ImageFormatConverter
        accept="image/*,.jpg,.jpeg,.webp,.gif,.bmp"
        uploadDescription="Convert JPG, WEBP, GIF, and BMP files to PNG (up to 40MB)"
        outputMimeType="image/png"
        outputExtension="png"
        outputLabel="PNG"
      />
    </ToolLayout>
  );
}
