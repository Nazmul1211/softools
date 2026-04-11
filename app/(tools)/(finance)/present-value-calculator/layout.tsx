import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Present Value Calculator — Discount Future Cash Flows | SoftZaR",
  description:
    "Calculate the present value of future money using discount rates. Determine how much future cash flows are worth today. Free PV calculator with annuity support.",
  keywords: [
    "present value calculator",
    "PV calculator",
    "present value of future money",
    "discount rate calculator",
    "time value of money",
    "net present value",
    "present value formula",
    "present value of annuity",
    "discounted cash flow",
    "NPV calculator",
  ],
  openGraph: {
    title: "Present Value Calculator — Discount Future Cash Flows | SoftZaR",
    description: "Calculate the present value of future money. Free and instant.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Present Value Calculator | SoftZaR",
    description: "Discount future cash flows to today's value. Free and instant.",
  },
  alternates: { canonical: "https://softzar.com/present-value-calculator/" },
};

export default function PresentValueCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
