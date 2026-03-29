import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter - Convert HEX, RGB, HSL Colors",
  description:
    "Free color converter to convert between HEX, RGB, HSL, and HSV color formats. Includes color picker, preview, and CSS code generation.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hsl converter",
    "color picker",
    "color code",
  ],
  openGraph: {
    title: "Color Converter - Convert HEX, RGB, HSL Colors",
    description: "Convert colors between HEX, RGB, HSL formats with live preview.",
    type: "website",
  },
};

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
