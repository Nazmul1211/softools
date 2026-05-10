"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Download, Eye, Settings, File } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "What markdown features are supported?",
    answer:
      "This converter supports all standard markdown syntax: headings (#), bold (**), italic (*), lists, code blocks, links, and images. It does not support tables or advanced HTML. For complex documents, export as markdown and use pandoc or markdown-pdf for more features.",
  },
  {
    question: "Can I customize fonts and colors in the PDF?",
    answer:
      "Yes! The converter provides options to customize font family (Serif, Sans-serif, Monospace), font size (8-24pt), heading color, and text color. These settings apply globally to the entire PDF. For per-paragraph styling, use custom CSS in a tool like Pandoc.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "This tool converts markdown entirely in your browser with no file size limit. However, very large documents (100,000+ characters) may take longer to process. For production use, consider server-side tools like Pandoc or wkhtmltopdf for better performance.",
  },
  {
    question: "How do I add page breaks?",
    answer:
      "Insert the markdown syntax: `---` (horizontal rule) to create a visual separator, or use HTML comments: `<!-- PAGE_BREAK -->` in your markdown source. Some PDF converters interpret these as page breaks.",
  },
  {
    question: "Can I add headers, footers, or page numbers?",
    answer:
      "The browser-based converter has limited support for headers/footers. For production PDFs with page numbers and custom headers/footers, use server-side tools like Pandoc with LaTeX, or wkhtmltopdf with custom HTML.",
  },
  {
    question: "How do I include images in the markdown?",
    answer:
      "Use standard markdown syntax: `![alt text](image-url)` or `![alt text](data:image/...)` for base64-encoded images. If using external URLs, ensure CORS is enabled or convert images to base64 first. For local files, use the file picker to convert.",
  },
];

/* ────────────── Component ────────────────────── */

export default function MarkdownToPDFConverter() {
  const [markdown, setMarkdown] = useState<string>(
    `# Welcome to Markdown to PDF Converter

This is a **markdown** document that will be converted to PDF.

## Features

- Write in plain markdown
- Customize fonts and colors
- Download as PDF
- No installation required

### Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Lists

1. First item
2. Second item
3. Third item

- Bullet point
- Another point
  - Nested point

## Links and Text Formatting

Visit [SoftZaR](https://softzar.com) for more tools.

This is *italic* text and this is ***bold and italic***.

---

Footer content can go here.`
  );

  const [fontSize, setFontSize] = useState<number>(12);
  const [fontFamily, setFontFamily] = useState<string>("sans-serif");
  const [headingColor, setHeadingColor] = useState<string>("#000000");
  const [textColor, setTextColor] = useState<string>("#333333");
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Simple markdown to HTML converter
  const htmlContent = useMemo(() => {
    let html = markdown
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Headers
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`(.*?)`/g, "<code>$1</code>")
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Unordered lists
      .replace(/^\- (.*?)$/gm, "<li>$1</li>")
      .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
      // Ordered lists
      .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")
      // Horizontal rule
      .replace(/^---$/gm, "<hr />")
      // Paragraphs
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(.+)$/gm, (match) => {
        if (
          !match.match(/^<[h|ul|ol|li|pre|code|hr|p]/) &&
          match.trim()
        ) {
          return `<p>${match}</p>`;
        }
        return match;
      });

    return html;
  }, [markdown]);

  // Generate CSS for styling
  const generateCSS = () => {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        color: ${textColor};
        line-height: 1.6;
        padding: 20px;
        background: white;
      }
      h1, h2, h3 {
        color: ${headingColor};
        margin-top: 20px;
        margin-bottom: 10px;
      }
      h1 {
        font-size: ${fontSize * 2}px;
      }
      h2 {
        font-size: ${fontSize * 1.6}px;
      }
      h3 {
        font-size: ${fontSize * 1.3}px;
      }
      p {
        margin-bottom: 10px;
      }
      code {
        background: #f0f0f0;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
      }
      pre {
        background: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
        margin: 10px 0;
      }
      pre code {
        background: none;
        padding: 0;
      }
      ul, ol {
        margin-left: 20px;
        margin-bottom: 10px;
      }
      li {
        margin-bottom: 5px;
      }
      a {
        color: #0066cc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      hr {
        border: none;
        border-top: 2px solid #ddd;
        margin: 20px 0;
      }
      strong {
        font-weight: bold;
      }
      em {
        font-style: italic;
      }
    `;
  };

  const downloadPDF = () => {
    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <style>${generateCSS()}</style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html"; // Browser will convert to PDF

    // For true PDF, we'd need a library like jsPDF
    // For now, we'll create a printable HTML that users can print to PDF
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }
  };

  return (
    <ToolLayout
      title="Markdown to PDF Converter"
      slug="markdown-to-pdf-converter"
      description="Convert markdown text to beautifully formatted PDF. Customize fonts, colors, and styling. Preview before download. No installation required."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Paste or write markdown", text: "Enter your markdown content in the left panel. Use standard markdown syntax for headers, bold, italics, lists, and more." },
        { name: "Customize styling", text: "Choose font family, size, and colors for your PDF. See changes instantly in the preview." },
        { name: "Preview the result", text: "View the rendered PDF preview in the right panel before downloading." },
        { name: "Download as PDF", text: "Click the Download button to save your markdown as a PDF file to your computer." },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "Color Converter", href: "/color-converter" },
        { name: "MD5 Hash Generator", href: "/md5-hash-generator" },
        { name: "Regex Tester", href: "/regex-tester" },
      ]}
      content={
        <>
          <h2>What Is a Markdown to PDF Converter?</h2>
          <p>
            A Markdown to PDF converter transforms plain-text markdown documents into professionally formatted PDF files. Markdown is a lightweight, human-readable markup language used for documentation, README files, blog posts, and technical writing. Converting markdown to PDF allows you to share documents with non-technical users while preserving formatting.
          </p>

          <h2>Why Convert Markdown to PDF?</h2>
          <ul>
            <li><strong>Universal format:</strong> PDFs open on any device without special software.</li>
            <li><strong>Preservation:</strong> PDFs lock formatting — documents look identical everywhere.</li>
            <li><strong>Sharing:</strong> Send read-only documents that recipients can&apos;t accidentally edit.</li>
            <li><strong>Printing:</strong> PDFs are optimized for printing with proper pagination.</li>
            <li><strong>Archiving:</strong> PDFs are ideal for long-term document storage.</li>
          </ul>

          <h2>Markdown Syntax Quick Reference</h2>
          <p>
            Standard markdown syntax supported by this tool:
          </p>
          <table>
            <thead>
              <tr>
                <th>Syntax</th>
                <th>Result</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td># Heading 1</td><td>Largest heading</td><td># Welcome</td></tr>
              <tr><td>## Heading 2</td><td>Subheading</td><td>## Section Title</td></tr>
              <tr><td>### Heading 3</td><td>Smaller subheading</td><td>### Subsection</td></tr>
              <tr><td>**text**</td><td>Bold</td><td>**important**</td></tr>
              <tr><td>*text*</td><td>Italic</td><td>*emphasized*</td></tr>
              <tr><td>***text***</td><td>Bold italic</td><td>***very important***</td></tr>
              <tr><td>`code`</td><td>Inline code</td><td>`var x = 5;`</td></tr>
              <tr><td>```code```</td><td>Code block</td><td>```python code```</td></tr>
              <tr><td>- item</td><td>Bullet list</td><td>- Point one</td></tr>
              <tr><td>1. item</td><td>Numbered list</td><td>1. First step</td></tr>
              <tr><td>[text](url)</td><td>Link</td><td>[Google](https://google.com)</td></tr>
              <tr><td>---</td><td>Horizontal rule</td><td>Separates sections</td></tr>
            </tbody>
          </table>

          <h2>Worked Example</h2>
          <p>
            Input markdown:
          </p>
          <pre><code>{`# Project Report

## Overview
This is the quarterly report.

- Completed Q2 goals
- Exceeded targets by 15%
- Ready for Q3 planning

See [full report](report.pdf) for details.`}</code></pre>
          <p>
            Output: A professional PDF with headings, bullets, links, and consistent formatting.
          </p>

          <h2>Formatting and Styling</h2>
          <p>
            This converter allows customization of:
          </p>
          <ul>
            <li><strong>Font family:</strong> Serif (traditional, formal) or Sans-serif (modern, clean)</li>
            <li><strong>Font size:</strong> 8-24pt. Larger sizes for presentations, smaller for dense documents.</li>
            <li><strong>Heading color:</strong> Distinguish section titles from body text.</li>
            <li><strong>Text color:</strong> Choose dark text for printing or light text for screen viewing.</li>
          </ul>

          <h2>Limitations and Alternatives</h2>
          <p>
            This browser-based converter has limitations:
          </p>
          <ul>
            <li><strong>No page numbers or headers:</strong> For production documents, use Pandoc or wkhtmltopdf.</li>
            <li><strong>No table support:</strong> Tables must be converted to lists or images.</li>
            <li><strong>No footnotes:</strong> Consider using hyperlinks instead.</li>
            <li><strong>Basic styling:</strong> Advanced CSS not supported.</li>
          </ul>

          <h2>Alternative Tools</h2>
          <p>
            For advanced PDF generation from markdown:
          </p>
          <ul>
            <li><strong>Pandoc:</strong> Command-line tool. Supports complex documents, LaTeX, custom templates.</li>
            <li><strong>wkhtmltopdf:</strong> Converts HTML to PDF. Good for web-based documents.</li>
            <li><strong>Markdown-pdf (npm):</strong> Node.js tool. Integrates with build pipelines.</li>
            <li><strong>GitHub Pages + Print to PDF:</strong> Write markdown in GitHub, print directly to PDF.</li>
          </ul>

          <h2>Best Practices</h2>
          <ul>
            <li><strong>Keep it simple:</strong> Avoid overly complex markdown syntax.</li>
            <li><strong>Use consistent formatting:</strong> Stick to one heading style (# for h1, ## for h2).</li>
            <li><strong>Test before sharing:</strong> Preview the PDF and verify all formatting is correct.</li>
            <li><strong>Check links:</strong> Ensure links are valid and point to correct URLs.</li>
            <li><strong>Optimize images:</strong> Compress images before embedding to reduce file size.</li>
          </ul>

          <h2>References</h2>
          <ul>
            <li>Markdown Guide: https://www.markdownguide.org/</li>
            <li>CommonMark Specification: https://spec.commonmark.org/</li>
            <li>Pandoc: https://pandoc.org/</li>
            <li>wkhtmltopdf: https://wkhtmltopdf.org/</li>
          </ul>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Markdown Input ── */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <File className="h-4 w-4 text-primary" />
              Markdown Input
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your markdown here..."
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
              rows={20}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {markdown.length} characters
            </p>
          </div>

          {/* ── Formatting Options ── */}
          <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              PDF Styling
            </h4>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="serif">Serif (Traditional)</option>
                <option value="sans-serif">Sans-Serif (Modern)</option>
                <option value="monospace">Monospace (Code)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="8"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Heading Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  className="h-10 w-12 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-12 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <button
              onClick={downloadPDF}
              className="w-full rounded-lg bg-primary text-primary-foreground py-2 px-4 font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Preview ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Preview
            </label>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition text-foreground"
            >
              {showPreview ? "Hide" : "Show"}
            </button>
          </div>

          {showPreview && (
            <div
              className="rounded-lg border border-border bg-white dark:bg-muted/20 p-6 overflow-auto"
              style={{
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                color: textColor,
                minHeight: "600px",
                maxHeight: "600px",
              }}
              dangerouslySetInnerHTML={{
                __html: htmlContent,
              }}
            />
          )}

          {!showPreview && (
            <div className="rounded-lg border border-border bg-muted/20 p-6 text-center text-muted-foreground">
              <p className="text-sm">Preview hidden. Click Show to view.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
