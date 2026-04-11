"use client";

import { ToolLayout } from "@/components/layout/ToolLayout";
import { ImageToBase64Tool } from "@/components/tools/ImageToBase64Tool";

export default function ImageToBase64Page() {
  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description="Encode image files into Base64 Data URIs for web development, API payloads, and inline embeds. Secure browser-based conversion with no server upload."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Base64 Encoder/Decoder", href: "/base64-encoder/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "PNG to WEBP Converter", href: "/png-to-webp-converter/" },
      ]}
      howToSteps={[
        { name: "Upload an image file", text: "Choose a supported image from your device to begin encoding." },
        { name: "Generate Base64 output", text: "Convert the image into a Base64 string or full Data URI format." },
        { name: "Copy for development use", text: "Copy encoded output for HTML, CSS, JSON, or API payload use cases." },
        { name: "Export text if needed", text: "Download encoded content as text for later implementation." },
      ]}
      faqs={[
        {
          question: "What is an image Base64 Data URI?",
          answer:
            "A Base64 Data URI is a text-encoded representation of binary image data prefixed with MIME metadata, such as data:image/png;base64,... . It allows browsers to render an image directly from inline text without requesting a separate file URL. This is useful for small assets in prototypes, email templates, and tightly scoped component bundles.",
        },
        {
          question: "Does Base64 increase file size?",
          answer:
            "Yes. Base64 encoding typically increases payload size by about 33 percent compared to the original binary file. That overhead comes from mapping binary bytes into ASCII-safe text characters. For this reason, Base64 is best for small inline assets or specific transport scenarios, not for large production images where external file delivery is usually more efficient.",
        },
        {
          question: "Is image conversion private on this tool?",
          answer:
            "Yes. Encoding is processed in your browser and does not require image upload to a conversion server. This approach helps protect confidential files and allows faster iteration for developers working with internal UI assets, customer mockups, or local test data. It also removes dependency on third-party upload queues.",
        },
        {
          question: "When should I use Base64 images in CSS or HTML?",
          answer:
            "Use Base64 inline images for very small assets such as icons, placeholders, or tiny decorative graphics where reducing extra HTTP requests may help in constrained contexts. For larger images, external files are usually better for caching and payload control. A practical rule is to keep inline Base64 limited and intentional in production code.",
        },
        {
          question: "Can Base64 improve performance?",
          answer:
            "It can in narrow scenarios, such as embedding tiny critical icons to avoid additional round trips. However, in many modern workflows, larger Base64 payloads increase bundle size and can hurt performance. Always evaluate with real page metrics. For media-heavy pages, optimized external formats like WEBP or JPG often deliver better overall loading behavior.",
        },
        {
          question: "What is the difference between raw Base64 and Data URI?",
          answer:
            "Raw Base64 is just encoded text, while a Data URI includes a MIME prefix and can be used directly in src attributes or CSS url() values. Example: raw output may start with iVBOR..., while Data URI starts with data:image/png;base64,iVBOR... . Your destination system determines which format you should use.",
        },
      ]}
      content={
        <>
          <h2>What This Image to Base64 Converter Does</h2>
          <p>
            This converter transforms image files into Base64 text so you can embed image data directly in code, markup, or payloads. It supports practical developer workflows such as prototype building, API testing, inline UI assets, and email template implementation. Processing is local to your browser for speed and privacy.
          </p>

          <h2>How Base64 Encoding Works</h2>
          <p>
            Base64 maps binary bytes into a set of ASCII-safe characters. This allows image data to be transported in systems that expect text-safe content, including JSON payloads and inline HTML attributes. When using Data URI format, the encoded output includes MIME metadata so browsers can interpret and render the image correctly without a separate URL request.
          </p>

          <h2>Format Comparison: External File vs Base64 Embed</h2>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Main Advantage</th>
                <th>Main Tradeoff</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>External image file</td>
                <td>Better caching and smaller HTML/CSS payload</td>
                <td>Extra file request</td>
                <td>Most production images</td>
              </tr>
              <tr>
                <td>Base64 Data URI</td>
                <td>Inline portability and fewer external dependencies</td>
                <td>Larger text payload</td>
                <td>Small assets and testing workflows</td>
              </tr>
            </tbody>
          </table>

          <h2>Size and Performance Tradeoff</h2>
          <p>
            Base64 is convenient but usually larger than binary delivery. If embedded excessively, it can bloat CSS, HTML, or JavaScript bundles. The best approach is selective usage: keep tiny critical assets inline when it simplifies delivery, and keep larger media as optimized external files. Performance should be validated against real page metrics and deployment targets.
          </p>

          <h2>Privacy and Security Considerations</h2>
          <p>
            Local conversion reduces data exposure because images are processed on-device in your active browser session. This matters for confidential product screenshots, internal prototypes, and client-owned media. Even with local conversion, teams should still treat encoded strings as sensitive if they represent non-public assets and avoid exposing them in logs or public repos.
          </p>

          <h2>Common Uses for Image Base64</h2>
          <ul>
            <li>Embedding icons and assets directly in HTML or CSS</li>
            <li>Sending image data in JSON payloads</li>
            <li>Testing APIs or prototypes quickly without file hosting</li>
            <li>Creating self-contained demo files for rapid client review</li>
            <li>Reducing tooling friction in development and QA environments</li>
          </ul>

          <h2>Implementation Tips</h2>
          <p>
            Keep Base64 usage intentional and documented. If output is used in CSS, verify that caching strategy still supports your performance goals. If output is used in API payloads, monitor payload size growth and response latency. For reusable assets, consider storing original files plus generated Base64 snippets so the pipeline stays maintainable over time.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>RFC 4648 — The Base16, Base32, and Base64 Data Encodings.</li>
            <li>MDN Web Docs — Data URLs and browser usage patterns.</li>
            <li>WHATWG URL Standard — Data URL parsing and behavior.</li>
          </ul>
        </>
      }
    >
      <ImageToBase64Tool />
    </ToolLayout>
  );
}
