import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator — Debt-Free Plan | Softzar",
  description:
    "Calculate how long to pay off credit card debt and total interest cost. Find the optimal monthly payment to become debt-free faster with our free calculator.",
  keywords: [
    "credit card payoff calculator",
    "debt payoff calculator",
    "credit card interest calculator",
    "debt free calculator",
    "pay off credit card",
    "credit card payment calculator",
    "debt repayment calculator",
    "credit card debt",
  ],
  openGraph: {
    title: "Credit Card Payoff Calculator — Debt-Free Plan",
    description:
      "Calculate how long to pay off credit card debt and total interest cost. Find the optimal payment strategy to become debt-free faster.",
    type: "website",
  },
};

export default function CreditCardPayoffCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
