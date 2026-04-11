import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ovulation Calculator — Track Fertile Days & Ovulation Date | SoftZaR",
  description:
    "Free ovulation calculator to predict your most fertile days and ovulation date. Enter your last period and cycle length to find your fertility window. Based on clinical menstrual cycle science.",
  keywords: [
    "ovulation calculator",
    "ovulation calendar",
    "fertility calculator",
    "fertile days calculator",
    "when do i ovulate",
    "ovulation predictor",
    "fertility window calculator",
    "conception calculator",
    "best days to conceive",
    "menstrual cycle calculator",
  ],
  openGraph: {
    title: "Ovulation Calculator — Track Fertile Days | SoftZaR",
    description: "Predict your most fertile days and ovulation date. Free and private.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ovulation Calculator | SoftZaR",
    description: "Track fertile days and predict ovulation. Free and instant.",
  },
  alternates: { canonical: "https://softzar.com/ovulation-calculator/" },
};

export default function OvulationCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
