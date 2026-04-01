import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LCM Calculator - Find Least Common Multiple",
  description:
    "Free LCM calculator to find the Least Common Multiple of two or more numbers. See step-by-step solutions using prime factorization and listing multiples methods.",
  keywords: [
    "lcm calculator",
    "least common multiple",
    "find lcm",
    "lcm of two numbers",
    "lowest common multiple",
    "common multiple calculator",
    "math calculator",
    "lcm finder",
  ],
  openGraph: {
    title: "LCM Calculator - Find Least Common Multiple",
    description:
      "Calculate the Least Common Multiple (LCM) of two or more numbers with step-by-step solutions.",
    type: "website",
  },
};

export default function LcmCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
