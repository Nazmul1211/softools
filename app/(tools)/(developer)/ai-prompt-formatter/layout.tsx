import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Formatter - Structured Prompt Builder | SoftZaR",
  description:
    "Format raw prompts into clear AI-ready structure with role, objective, context, constraints, and output format sections.",
  keywords: [
    "ai prompt formatter",
    "prompt builder",
    "chatgpt prompt formatter",
    "prompt template tool",
    "structured prompt generator",
  ],
  openGraph: {
    title: "AI Prompt Formatter",
    description:
      "Turn unstructured notes into clean prompts for ChatGPT, Claude, Gemini, and other AI tools.",
    type: "website",
    url: "https://softzar.com/ai-prompt-formatter/",
  },
  alternates: {
    canonical: "https://softzar.com/ai-prompt-formatter/",
  },
};

export default function AIPromptFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
