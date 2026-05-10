import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Cost Calculator — Calculate API Pricing Costs | SoftZaR",
  description:
    "Calculate API costs for GPT-4, GPT-3.5, Claude, and Gemini. Get pricing estimates based on token count, model choice, and number of requests. Compare costs across AI providers.",
  keywords: [
    "AI prompt cost calculator",
    "GPT-4 pricing",
    "Claude API cost",
    "Gemini pricing",
    "API token calculator",
    "AI cost estimator",
    "LLM pricing calculator",
    "OpenAI cost calculator",
  ],
  openGraph: {
    title: "AI Prompt Cost Calculator — Estimate API Costs",
    description:
      "Calculate costs for GPT-4, Claude, Gemini, and other AI models. Compare pricing per token and total request costs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Cost Calculator | SoftZaR",
    description:
      "Estimate API costs for GPT-4, Claude, Gemini and more. Get precise pricing calculations.",
  },
  alternates: {
    canonical: "https://softzar.com/ai-prompt-cost-calculator/",
  },
};

export default function AIPromptCostCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
