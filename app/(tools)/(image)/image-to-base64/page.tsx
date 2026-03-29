"use client";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { ImageToBase64Tool } from "@/components/tools/ImageToBase64Tool";

export default function ImageToBase64Page() {
  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description="Encode image files into Base64 Data URIs for web development, API payloads, and inline assets. Secure browser-based conversion."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Base64 Encoder/Decoder", href: "/base64-encoder/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "Image Compressor", href: "/image-compressor/" },
      ]}
      howToSteps={[
        { name: "Upload Image", text: "Choose your image file from device storage." },
        { name: "Convert", text: "Generate a Base64 Data URI in one click." },
        { name: "Copy or Download", text: "Copy Base64 output or download as text file." },
      ]}
      faqs={[
        {
          question: "What is an image Base64 Data URI?",
          answer:
            "It is a text representation of image binary data prefixed with mime info, often used in inline HTML/CSS.",
        },
        {
          question: "Does Base64 increase file size?",
          answer:
            "Yes. Base64 encoding usually increases size by around 33% compared to binary files.",
        },
        {
          question: "Is image conversion private on this tool?",
          answer:
            "Yes. All processing happens in your browser and files are not uploaded.",
        },
      ]}
      content={
        <>
          <h2>Convert Images to Base64 Data URI</h2>
          <p>
            This Image to Base64 converter helps developers and creators embed image data directly into code and payloads. It supports common formats and runs fully in-browser.
          </p>
          <h2>Common Uses for Image Base64</h2>
          <ul>
            <li>Embedding icons and assets directly in HTML or CSS</li>
            <li>Sending image data in JSON payloads</li>
            <li>Testing APIs or prototypes quickly without file hosting</li>
          </ul>
        </>
      }
    >
      <ImageToBase64Tool />
    </ToolLayout>
  );
}
