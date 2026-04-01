import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Tax Calculator - Calculate Tax on Purchases",
  description:
    "Free sales tax calculator to instantly calculate sales tax on any purchase. Find the total price including tax or calculate the pre-tax price from a total.",
  keywords: [
    "sales tax calculator",
    "tax calculator",
    "calculate sales tax",
    "purchase tax",
    "tax rate calculator",
    "total with tax",
    "pre-tax price",
    "retail tax calculator",
  ],
  openGraph: {
    title: "Sales Tax Calculator - Calculate Tax on Purchases",
    description:
      "Calculate sales tax instantly. Find total price with tax or reverse calculate pre-tax amount.",
    type: "website",
  },
};

export default function SalesTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
