"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

const faqs: FAQItem[] = [
  {
    question: "Why use a prompt formatter?",
    answer:
      "Structured prompts improve consistency and reduce ambiguity. Clear sections help AI systems follow your exact objective and output format.",
  },
  {
    question: "Which AI models can use this output?",
    answer:
      "The output works for ChatGPT, Claude, Gemini, Copilot, and most instruction-following models.",
  },
  {
    question: "Is my prompt data sent to a server?",
    answer:
      "No. Formatting runs in your browser.",
  },
];

function normalizeLineBreaks(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export default function AIPromptFormatterPage() {
  const [role, setRole] = useState("Expert assistant");
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState("");
  const [constraints, setConstraints] = useState("");
  const [outputFormat, setOutputFormat] = useState("Bullet list");
  const [rawNotes, setRawNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const formattedPrompt = useMemo(() => {
    const sections: string[] = [];
    if (role.trim()) sections.push(`Role:\n${normalizeLineBreaks(role)}`);
    if (objective.trim()) sections.push(`Objective:\n${normalizeLineBreaks(objective)}`);
    if (context.trim()) sections.push(`Context:\n${normalizeLineBreaks(context)}`);
    if (constraints.trim()) sections.push(`Constraints:\n${normalizeLineBreaks(constraints)}`);
    if (outputFormat.trim()) sections.push(`Output format:\n${normalizeLineBreaks(outputFormat)}`);
    if (rawNotes.trim()) sections.push(`Reference notes:\n${normalizeLineBreaks(rawNotes)}`);

    if (sections.length === 0) return "";
    return sections.join("\n\n");
  }, [role, objective, context, constraints, outputFormat, rawNotes]);

  const stats = useMemo(() => {
    if (!formattedPrompt) return null;
    const characters = formattedPrompt.length;
    const words = formattedPrompt.trim().split(/\s+/).length;
    const estimatedTokens = Math.ceil(characters / 4);
    return { characters, words, estimatedTokens };
  }, [formattedPrompt]);

  const handleCopy = async () => {
    if (!formattedPrompt) return;
    await navigator.clipboard.writeText(formattedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <ToolLayout
      title="AI Prompt Formatter"
      slug="ai-prompt-formatter"
      description="Build cleaner AI prompts with role, objective, context, constraints, and output format structure."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Fill prompt sections", text: "Add role, objective, context, constraints, and output format." },
        { name: "Review formatted prompt", text: "The tool combines fields into a consistent prompt structure." },
        { name: "Copy and run", text: "Copy the final prompt and use it in your AI model." },
      ]}
      relatedTools={[
        { name: "Token Counter Calculator", href: "/token-counter-calculator/" },
        { name: "AI Prompt Cost Calculator", href: "/ai-prompt-cost-calculator/" },
        { name: "SQL Query Formatter", href: "/sql-query-formatter/" },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Expert marketing analyst" />
          <Input label="Output Format" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} placeholder="Bullet list with 5 actions" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Objective</label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="What should the model accomplish?"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Context</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Background details, audience, or dataset context."
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Constraints</label>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Length limits, tone rules, forbidden topics, data boundaries."
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Reference Notes (optional)</label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Paste rough notes, transcript snippets, or requirements."
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Formatted Prompt</label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!formattedPrompt}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={formattedPrompt}
            readOnly
            className="w-full rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm text-foreground"
            rows={12}
          />
        </div>

        {stats && (
          <ResultsGrid columns={3}>
            <ResultCard label="Characters" value={stats.characters.toLocaleString()} />
            <ResultCard label="Words" value={stats.words.toLocaleString()} />
            <ResultCard label="Estimated Tokens" value={stats.estimatedTokens.toLocaleString()} />
          </ResultsGrid>
        )}
      </div>
    </ToolLayout>
  );
}
