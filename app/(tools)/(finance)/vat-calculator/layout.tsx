import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VAT Calculator - Add or Remove Value Added Tax | Softzar",
  description:
    "Calculate VAT quickly by adding tax to a net amount or removing VAT from a gross price. Useful for invoices, pricing, and cross-border sales.",
  keywords: [
    "vat calculator",
    "value added tax calculator",
    "add vat",
    "remove vat",
    "vat inclusive calculator",
    "vat exclusive calculator",
  ],
  openGraph: {
    title: "VAT Calculator - Add or Remove Value Added Tax",
    description:
      "Instantly calculate VAT-inclusive and VAT-exclusive prices with configurable tax rates for invoices and pricing.",
    type: "website",
  },
};

export default function VatCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

