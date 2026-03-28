import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fraction Calculator - Add, Subtract, Multiply & Divide Fractions",
  description:
    "Free fraction calculator to add, subtract, multiply, and divide fractions. Shows step-by-step solutions and simplifies results. Convert between fractions, decimals, and mixed numbers.",
  keywords: [
    "fraction calculator",
    "add fractions",
    "subtract fractions",
    "multiply fractions",
    "divide fractions",
    "simplify fractions",
    "mixed numbers",
    "fraction to decimal",
  ],
  openGraph: {
    title: "Fraction Calculator - Free Online Tool",
    description: "Calculate fractions with step-by-step solutions. Add, subtract, multiply, divide, and simplify fractions instantly.",
    type: "website",
  },
};

export default function FractionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
