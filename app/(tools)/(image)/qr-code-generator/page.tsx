"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Check,
  Copy,
  Download,
  Link as LinkIcon,
  Palette,
  QrCode,
  RefreshCcw,
  Shield,
  Sparkles,
} from "lucide-react";

type QRErrorCorrection = "L" | "M" | "Q" | "H";

function triggerDownload(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
}

function hexWithFallback(value: string, fallback: string): string {
  const normalized = value.trim();
  const isValidHex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(normalized);
  return isValidHex ? normalized : fallback;
}

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState("https://softzar.com/");
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(2);
  const [errorLevel, setErrorLevel] = useState<QRErrorCorrection>("M");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [pngDataUrl, setPngDataUrl] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const colorOptions = useMemo(
    () => ({
      dark: hexWithFallback(foreground, "#111827"),
      light: transparentBackground ? "#0000" : hexWithFallback(background, "#ffffff"),
    }),
    [background, foreground, transparentBackground]
  );

  const generateQRCode = useCallback(async () => {
    const value = text.trim();
    if (!value) {
      setError("Please enter text, URL, or contact details to generate a QR code.");
      setPngDataUrl("");
      setSvgMarkup("");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [png, svg] = await Promise.all([
        QRCode.toDataURL(value, {
          width: size,
          margin,
          errorCorrectionLevel: errorLevel,
          color: colorOptions,
        }),
        QRCode.toString(value, {
          type: "svg",
          width: size,
          margin,
          errorCorrectionLevel: errorLevel,
          color: colorOptions,
        }),
      ]);

      setPngDataUrl(png);
      setSvgMarkup(svg);
    } catch (caughtError) {
      console.error("Failed to generate QR code:", caughtError);
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate QR code.");
      setPngDataUrl("");
      setSvgMarkup("");
    } finally {
      setLoading(false);
    }
  }, [colorOptions, errorLevel, margin, size, text]);

  useEffect(() => {
    void generateQRCode();
  }, [generateQRCode]);

  const resetSettings = () => {
    setText("https://softzar.com/");
    setSize(512);
    setMargin(2);
    setErrorLevel("M");
    setForeground("#111827");
    setBackground("#ffffff");
    setTransparentBackground(false);
    setCopied(false);
  };

  const copyDataUrl = async () => {
    if (!pngDataUrl) return;

    try {
      await navigator.clipboard.writeText(pngDataUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (caughtError) {
      console.error("Failed to copy PNG data URL:", caughtError);
    }
  };

  const downloadSVG = () => {
    if (!svgMarkup) return;

    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "qr-code.svg");
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom QR codes for links, text, contact info, and campaign assets with instant PNG and SVG download support. Theme-ready and privacy-friendly."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image Cropper", href: "/image-cropper/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "URL Encoder/Decoder", href: "/url-encoder/" },
        { name: "Slug Generator", href: "/slug-generator/" },
      ]}
      howToSteps={[
        { name: "Enter Content", text: "Add URL, text, phone, or email content to encode." },
        { name: "Customize Design", text: "Set size, margin, error correction, and colors." },
        { name: "Download", text: "Export high-quality QR as PNG or SVG for web and print." },
      ]}
      faqs={[
        {
          question: "What data can a QR code store?",
          answer:
            "QR codes can store links, plain text, phone numbers, email addresses, and short structured data strings depending on your use case.",
        },
        {
          question: "Should I use PNG or SVG for QR codes?",
          answer:
            "Use PNG for quick sharing on social channels and messaging apps. Use SVG for print, scaling, and design workflows where crisp edges matter.",
        },
        {
          question: "What does error correction mean?",
          answer:
            "Error correction allows QR scanners to recover data even if part of the code is damaged or obscured. Higher levels increase resilience but can reduce data capacity.",
        },
        {
          question: "Can I use custom colors in QR codes safely?",
          answer:
            "Yes, but maintain strong contrast between foreground and background so cameras can scan reliably. Dark code on light background works best.",
        },
      ]}
      content={
        <>
          <h2>QR Codes as a Core Growth Asset for Modern Websites and Campaigns</h2>
          <p>
            QR codes are no longer a novelty feature. They are now a standard bridge between physical and digital experiences, and they matter for both user convenience and marketing performance. A well-designed QR code can connect packaging to product pages, posters to landing pages, class handouts to study resources, invoices to payment portals, and event materials to registration flows. For teams building high-converting user journeys, the QR code is often the shortest path from intent to action.
          </p>
          <p>
            When visitors can move from scan to destination in seconds, friction drops significantly. That improves completion rates for check-ins, downloads, purchases, and support interactions. The key is generating codes that are both visually on-brand and technically reliable across devices. This includes selecting appropriate size, quiet zone margin, and error correction level based on where the code will be placed.
          </p>

          <h2>Why High-Quality QR Output Matters for SEO, UX, and Conversion</h2>
          <p>
            Although QR graphics themselves do not directly rank in search results, they can influence SEO indirectly by improving traffic quality and engagement pathways. If your printed and offline assets send users to optimized pages with strong content and fast load times, that can support higher retention and better behavioral signals. A poor QR experience does the opposite by causing failed scans and abandoned sessions before users reach your content.
          </p>
          <p>
            Quality output matters especially when codes are resized or printed. Pixelated or low-contrast QR files frequently fail on lower-end cameras or under poor lighting conditions. SVG exports solve this by providing crisp vector edges at any scale, while PNG remains useful for quick digital deployment. Teams that maintain consistent export standards save time in production and avoid last-minute design fixes.
          </p>

          <h2>Design Principles for Scannable and Brand-Safe QR Codes</h2>
          <p>
            The best QR code strategy balances aesthetics with machine readability. Use dark foreground modules on a lighter background, and keep enough contrast to pass practical scan tests. Avoid placing the code over noisy textures or gradients that interfere with module boundaries. If brand color is required, test multiple phones and camera conditions before publishing. A code that looks premium but fails in real use is costly.
          </p>
          <p>
            Margin, also called the quiet zone, is another critical element. This empty space around the code helps scanners detect edges. Reducing margin too aggressively may break scanning in crowded layouts. Error correction level should match context. For product labels and outdoor material where damage risk is higher, use Q or H. For clean digital screens with short links, M is typically a strong default.
          </p>

          <h2>Use Cases That Deliver Measurable Value</h2>
          <ul>
            <li>Retail packaging that routes users to setup guides, warranty forms, and care instructions.</li>
            <li>Restaurant tables that open digital menus, feedback forms, or instant payment links.</li>
            <li>Events and webinars that connect attendees to schedules, maps, and speaker resources.</li>
            <li>Education workflows where students scan assignment links and downloadable handouts.</li>
            <li>Marketing campaigns that direct print traffic into dedicated landing funnels.</li>
            <li>Customer support touchpoints that launch troubleshooting articles and service forms.</li>
          </ul>
          <p>
            These use cases work best when each QR destination is purpose-built, mobile-optimized, and easy to understand at first glance. The code is only the entry point. The real performance gains happen when the landing experience matches user expectation immediately.
          </p>

          <h2>Operational Tips for Teams Managing Many QR Assets</h2>
          <p>
            Create naming conventions and maintain source records for every generated code. Teams often lose context when assets are shared without labels, which leads to reuse mistakes and outdated campaign links. If your organization manages multiple departments, define standard settings for code size, margin, and color contrast so outputs stay consistent regardless of who creates them. A simple checklist can prevent most scan reliability issues before distribution.
          </p>
          <p>
            Before final rollout, test each code on different screen sizes and camera qualities. Include at least one mid-range Android device and one recent iPhone in your validation process. Verify that the destination page loads quickly and that the expected action is visible above the fold. This quality pass protects campaign ROI and helps deliver a polished brand experience from first scan to conversion.
          </p>
          <p>
            In short, QR codes are a practical performance tool. When generated with strong technical settings and paired with relevant destinations, they create a faster, cleaner path from offline attention to online engagement.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-background to-cyan-500/10 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <QrCode className="h-5 w-5 text-primary" />
                Designer-Friendly QR Builder
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Generate reliable QR graphics for web, social, print, and packaging with export-ready PNG and SVG.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" />
              Client-Side Generation
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-muted/30">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <LinkIcon className="h-5 w-5 text-primary" />
              QR Content
            </h3>

            <label className="block text-sm text-muted-foreground">
              Text, URL, phone, email, or custom payload
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="https://example.com/offer"
                className="mt-1 h-32 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-muted-foreground">
                Size ({size}px)
                <input
                  type="range"
                  min={160}
                  max={1024}
                  step={16}
                  value={size}
                  onChange={(event) => setSize(Number(event.target.value))}
                  className="mt-2 w-full accent-primary"
                />
              </label>
              <label className="text-sm text-muted-foreground">
                Margin ({margin})
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={margin}
                  onChange={(event) => setMargin(Number(event.target.value))}
                  className="mt-2 w-full accent-primary"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-muted-foreground">
                Error correction
                <select
                  value={errorLevel}
                  onChange={(event) => setErrorLevel(event.target.value as QRErrorCorrection)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="L">L (Low, more capacity)</option>
                  <option value="M">M (Balanced)</option>
                  <option value="Q">Q (High recovery)</option>
                  <option value="H">H (Max recovery)</option>
                </select>
              </label>

              <div className="rounded-lg border border-border bg-background p-3">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Palette className="h-4 w-4 text-primary" />
                  Colors
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <label className="space-y-1">
                    Foreground
                    <input
                      type="color"
                      value={foreground}
                      onChange={(event) => setForeground(event.target.value)}
                      className="h-9 w-full rounded border border-border bg-transparent"
                    />
                  </label>
                  <label className="space-y-1">
                    Background
                    <input
                      type="color"
                      value={background}
                      onChange={(event) => setBackground(event.target.value)}
                      disabled={transparentBackground}
                      className="h-9 w-full rounded border border-border bg-transparent disabled:opacity-50"
                    />
                  </label>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={transparentBackground}
                onChange={(event) => setTransparentBackground(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Transparent background (PNG/SVG)
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void generateQRCode()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
              <button
                type="button"
                onClick={resetSettings}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-muted/30">
            <h3 className="mb-3 text-lg font-semibold text-foreground">QR Preview & Download</h3>
            <div
              className="grid min-h-[360px] place-items-center rounded-xl border border-border p-4"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%, transparent 75%, rgba(148,163,184,0.12) 75%, rgba(148,163,184,0.12)), linear-gradient(45deg, rgba(148,163,184,0.12) 25%, transparent 25%, transparent 75%, rgba(148,163,184,0.12) 75%, rgba(148,163,184,0.12))",
                backgroundPosition: "0 0, 12px 12px",
                backgroundSize: "24px 24px",
              }}
            >
              {pngDataUrl ? (
                <img
                  src={pngDataUrl}
                  alt="Generated QR code"
                  className="h-auto max-h-[320px] w-full max-w-[320px] rounded-lg border border-border bg-white p-2"
                />
              ) : (
                <p className="text-sm text-muted-foreground">Your QR code will appear here.</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => pngDataUrl && triggerDownload(pngDataUrl, "qr-code.png")}
                disabled={!pngDataUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                PNG
              </button>
              <button
                type="button"
                onClick={downloadSVG}
                disabled={!svgMarkup}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                SVG
              </button>
              <button
                type="button"
                onClick={() => void copyDataUrl()}
                disabled={!pngDataUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy Data URL"}
              </button>
              <button
                type="button"
                onClick={() => setText("https://softzar.com/tools/")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                <QrCode className="h-4 w-4" />
                Sample Value
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Tip: Keep high contrast between code and background for best scanning. Test the final QR on at least two devices before launching campaigns.
            </p>
          </section>
        </div>
      </div>
    </ToolLayout>
  );
}
