import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Interest Calculator - Calculate Interest Fast",
  description:
    "Free simple interest calculator to quickly calculate interest on loans, savings, and investments. Enter principal, rate, and time to get instant results.",
  keywords: [
    "simple interest calculator",
    "interest calculator",
    "calculate simple interest",
    "loan interest calculator",
    "simple interest formula",
    "basic interest calculator",
    "interest rate calculator",
  ],
  openGraph: {
    title: "Simple Interest Calculator - Calculate Interest Fast",
    description:
      "Calculate simple interest on loans and savings instantly. Free simple interest calculator with formula breakdown.",
    type: "website",
  },
};

export default function SimpleInterestCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
