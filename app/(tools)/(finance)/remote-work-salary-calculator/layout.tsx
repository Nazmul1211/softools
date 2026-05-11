import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remote Work Salary Calculator - Offer Adjustment vs Real Take Value | SoftZaR",
  description:
    "Compare remote salary offers by modeling pay adjustments, commute savings, home-office stipend, and remote work expenses.",
  keywords: [
    "remote work salary calculator",
    "remote salary adjustment calculator",
    "work from home salary calculator",
    "remote compensation calculator",
    "remote job offer calculator",
  ],
  openGraph: {
    title: "Remote Work Salary Calculator",
    description:
      "Estimate true remote compensation after salary adjustment, commute savings, and remote work costs.",
    type: "website",
    url: "https://softzar.com/remote-work-salary-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Work Salary Calculator | SoftZaR",
    description:
      "Evaluate remote offers with a true total-comp view, not base salary alone.",
  },
  alternates: {
    canonical: "https://softzar.com/remote-work-salary-calculator/",
  },
};

export default function RemoteWorkSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
