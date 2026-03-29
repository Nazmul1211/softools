"use client";

import { useState, useMemo, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export default function ColorConverter() {
  const [hexInput, setHexInput] = useState("#3B82F6");
  const [rgbInput, setRgbInput] = useState({ r: "59", g: "130", b: "246" });
  const [hslInput, setHslInput] = useState({ h: "217", s: "91", l: "60" });
  const [colorValues, setColorValues] = useState<ColorValues | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Update all values when hex changes
  useEffect(() => {
    const rgb = hexToRgb(hexInput);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setColorValues({
        hex: hexInput.toUpperCase(),
        rgb,
        hsl,
        hsv,
      });
      setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
      setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
    }
  }, [hexInput]);

  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    const newRgb = { ...rgbInput, [channel]: value };
    setRgbInput(newRgb);
    
    const r = parseInt(newRgb.r) || 0;
    const g = parseInt(newRgb.g) || 0;
    const b = parseInt(newRgb.b) || 0;
    
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      setHexInput(rgbToHex(r, g, b));
    }
  };

  const handleHslChange = (channel: "h" | "s" | "l", value: string) => {
    const newHsl = { ...hslInput, [channel]: value };
    setHslInput(newHsl);
    
    const h = parseInt(newHsl.h) || 0;
    const s = parseInt(newHsl.s) || 0;
    const l = parseInt(newHsl.l) || 0;
    
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      const rgb = hslToRgb(h, s, l);
      setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const presetColors = [
    "#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4",
    "#3B82F6", "#8B5CF6", "#EC4899", "#000000", "#FFFFFF",
  ];

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB, HSL, and HSV formats. Includes a color picker, live preview, and easy copy-to-clipboard functionality for CSS."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "UUID Generator", href: "/uuid-generator" },
      ]}
      content={
        <>
          <h2>Color Format Overview</h2>
          
          <h3>HEX Colors</h3>
          <p>
            HEX colors use hexadecimal notation to represent RGB values. Each pair of digits represents 
            red, green, and blue channels (00-FF). Example: #FF5733
          </p>

          <h3>RGB Colors</h3>
          <p>
            RGB (Red, Green, Blue) uses decimal values from 0-255 for each channel. 
            CSS syntax: rgb(255, 87, 51)
          </p>

          <h3>HSL Colors</h3>
          <p>
            HSL (Hue, Saturation, Lightness) is often more intuitive for designers:
          </p>
          <ul>
            <li><strong>Hue:</strong> Color wheel position (0-360°)</li>
            <li><strong>Saturation:</strong> Color intensity (0-100%)</li>
            <li><strong>Lightness:</strong> Light/dark balance (0-100%)</li>
          </ul>

          <h3>HSV/HSB Colors</h3>
          <p>
            HSV (Hue, Saturation, Value) is similar to HSL but uses Value (brightness) instead of 
            Lightness. Common in design software like Photoshop.
          </p>

          <h2>When to Use Each Format</h2>
          <ul>
            <li><strong>HEX:</strong> Most common in web development, compact notation</li>
            <li><strong>RGB:</strong> When you need alpha transparency (RGBA)</li>
            <li><strong>HSL:</strong> When adjusting colors programmatically (easy to lighten/darken)</li>
            <li><strong>HSV:</strong> Common in design tools and color pickers</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Color Preview */}
        <div 
          className="h-32 rounded-xl border-2 border-border shadow-inner transition-colors"
          style={{ backgroundColor: hexInput }}
        />

        {/* Color Picker */}
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="w-16 h-12 rounded cursor-pointer border-0"
          />
          <span className="text-sm text-muted-foreground">Click to pick a color</span>
        </div>

        {/* Preset Colors */}
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setHexInput(color)}
              className="w-8 h-8 rounded-lg border border-border shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* HEX Input */}
        <div className="rounded-xl border border-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">HEX</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(hexInput.toUpperCase(), "hex")}
            >
              {copied === "hex" ? "✓ Copied" : "Copy"}
            </Button>
          </div>
          <Input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#000000"
          />
        </div>

        {/* RGB Input */}
        <div className="rounded-xl border border-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">RGB</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`, "rgb")}
            >
              {copied === "rgb" ? "✓ Copied" : "Copy"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              value={rgbInput.r}
              onChange={(e) => handleRgbChange("r", e.target.value)}
              placeholder="R"
              min="0"
              max="255"
            />
            <Input
              type="number"
              value={rgbInput.g}
              onChange={(e) => handleRgbChange("g", e.target.value)}
              placeholder="G"
              min="0"
              max="255"
            />
            <Input
              type="number"
              value={rgbInput.b}
              onChange={(e) => handleRgbChange("b", e.target.value)}
              placeholder="B"
              min="0"
              max="255"
            />
          </div>
          {colorValues && (
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
            </p>
          )}
        </div>

        {/* HSL Input */}
        <div className="rounded-xl border border-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">HSL</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`, "hsl")}
            >
              {copied === "hsl" ? "✓ Copied" : "Copy"}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              value={hslInput.h}
              onChange={(e) => handleHslChange("h", e.target.value)}
              placeholder="H"
              suffix="°"
              min="0"
              max="360"
            />
            <Input
              type="number"
              value={hslInput.s}
              onChange={(e) => handleHslChange("s", e.target.value)}
              placeholder="S"
              suffix="%"
              min="0"
              max="100"
            />
            <Input
              type="number"
              value={hslInput.l}
              onChange={(e) => handleHslChange("l", e.target.value)}
              placeholder="L"
              suffix="%"
              min="0"
              max="100"
            />
          </div>
          {colorValues && (
            <p className="text-sm text-muted-foreground mt-2 font-mono">
              hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)
            </p>
          )}
        </div>

        {/* HSV Display */}
        {colorValues && (
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">HSV / HSB</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`, "hsv")}
              >
                {copied === "hsv" ? "✓ Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              hsv({colorValues.hsv.h}°, {colorValues.hsv.s}%, {colorValues.hsv.v}%)
            </p>
          </div>
        )}

        {/* CSS Output */}
        {colorValues && (
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground mb-3">CSS Variables</p>
            <pre className="text-sm text-muted-foreground font-mono bg-background/50 p-3 rounded-lg overflow-x-auto">
{`--color-hex: ${colorValues.hex};
--color-rgb: ${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b};
--color-hsl: ${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%;`}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
