import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings Calculator - Calculate Future Savings & Interest",
  description:
    "Free savings calculator to project how your savings will grow over time. Calculate compound interest, monthly deposits, and reach your financial goals faster.",
  keywords: [
    "savings calculator",
    "savings growth calculator",
    "compound interest savings",
    "savings goal calculator",
    "future value calculator",
    "savings account calculator",
    "how much will I save",
    "savings interest calculator",
  ],
  openGraph: {
    title: "Savings Calculator - Calculate Future Savings & Interest",
    description:
      "Project your savings growth with compound interest. Free savings calculator to plan your financial future.",
    type: "website",
  },
};

export default function SavingsCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
