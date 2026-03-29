"use client";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { ImageFormatConverter } from "@/components/tools/ImageFormatConverter";

export default function ImageToJPGConverterPage() {
  return (
    <ToolLayout
      title="Image to JPG Converter"
      description="Convert PNG, WEBP, GIF, and BMP images to JPG format online. Fast conversion with quality control and private browser-side processing."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "PNG to WEBP Converter", href: "/png-to-webp-converter/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image Resizer", href: "/image-resizer/" },
      ]}
      howToSteps={[
        { name: "Upload Image", text: "Choose an image file from your device." },
        { name: "Set Quality", text: "Adjust JPG quality level for file size and clarity." },
        { name: "Convert and Download", text: "Convert to JPG and download instantly." },
      ]}
      faqs={[
        {
          question: "Does JPG support transparency?",
          answer:
            "No. JPG does not support transparency. Transparent areas are flattened, typically onto a solid background.",
        },
        {
          question: "Can I reduce output file size?",
          answer:
            "Yes. Lower JPG quality settings generally produce smaller files with more compression.",
        },
        {
          question: "Is this tool free to use?",
          answer:
            "Yes. The converter is free and works directly in your browser without account signup.",
        },
      ]}
      content={
        <>
          <h2>Convert Any Image to JPG</h2>
          <p>
            This tool converts PNG, WEBP, GIF, and BMP images into JPG for better compatibility and smaller file size in many web and sharing workflows.
          </p>
          <h2>When to Use JPG</h2>
          <ul>
            <li>Photos and realistic images where smaller size is important</li>
            <li>Website uploads and social platforms that prefer JPG</li>
            <li>Email attachments where reduced file size helps delivery</li>
          </ul>
        </>
      }
    >
      <ImageFormatConverter
        accept="image/*,.png,.webp,.gif,.bmp"
        uploadDescription="Convert PNG, WEBP, GIF, and BMP files to JPG (up to 40MB)"
        outputMimeType="image/jpeg"
        outputExtension="jpg"
        outputLabel="JPG"
      />
    </ToolLayout>
  );
}
