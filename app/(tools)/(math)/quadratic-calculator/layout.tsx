import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quadratic Formula Calculator - Solve ax² + bx + c = 0",
  description:
    "Free quadratic equation solver using the quadratic formula. Find roots, vertex, discriminant, and graph any quadratic equation ax² + bx + c = 0 instantly.",
  keywords: [
    "quadratic formula calculator",
    "quadratic equation solver",
    "solve quadratic equation",
    "quadratic roots",
    "discriminant calculator",
    "parabola calculator",
    "ax2 bx c solver",
    "algebra calculator",
  ],
  openGraph: {
    title: "Quadratic Formula Calculator - Solve ax² + bx + c = 0",
    description:
      "Solve any quadratic equation using the quadratic formula. Get roots, vertex, and discriminant analysis.",
    type: "website",
  },
};

export default function QuadraticCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
