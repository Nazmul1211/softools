import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scientific Calculator - Advanced Math Functions Online",
  description:
    "Free online scientific calculator with trigonometry, logarithms, exponents, roots, and advanced math functions. Calculate sin, cos, tan, log, ln, powers, and more instantly.",
  keywords: [
    "scientific calculator",
    "online calculator",
    "trigonometry calculator",
    "logarithm calculator",
    "sin cos tan",
    "math calculator",
    "advanced calculator",
    "engineering calculator",
  ],
  openGraph: {
    title: "Free Scientific Calculator Online",
    description: "Full-featured scientific calculator with trigonometric, logarithmic, and exponential functions. Perfect for students, engineers, and scientists.",
    type: "website",
  },
};

export default function ScientificCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
