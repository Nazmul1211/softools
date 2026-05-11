"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

const faqs: FAQItem[] = [
  {
    question: "Why compare multiple AI detectors?",
    answer:
      "Detectors use different models and can disagree. Comparing scores gives a clearer directional signal than relying on one tool.",
  },
  {
    question: "What does spread mean here?",
    answer:
      "Spread is the difference between the highest and lowest score. A wide spread means detectors disagree strongly.",
  },
  {
    question: "Does this confirm whether text is AI generated?",
    answer:
      "No. This is a comparison utility and not a definitive classifier.",
  },
];

function riskLabel(score: number): string {
  if (score >= 75) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export default function AIDetectorComparisonToolPage() {
  const [gptZeroScore, setGptZeroScore] = useState("45");
  const [turnitinScore, setTurnitinScore] = useState("38");
  const [originalityScore, setOriginalityScore] = useState("51");
  const [copyleaksScore, setCopyleaksScore] = useState("41");

  const result = useMemo(() => {
    const rawValues = [
      Number.parseFloat(gptZeroScore),
      Number.parseFloat(turnitinScore),
      Number.parseFloat(originalityScore),
      Number.parseFloat(copyleaksScore),
    ];

    const valid = rawValues.filter((value) => Number.isFinite(value) && value >= 0 && value <= 100);
    if (valid.length === 0) return null;

    const average = valid.reduce((sum, value) => sum + value, 0) / valid.length;
    const highest = Math.max(...valid);
    const lowest = Math.min(...valid);
    const spread = highest - lowest;
    const adjustedRiskScore = Math.max(0, Math.min(100, average + spread * 0.1));

    return {
      average,
      highest,
      lowest,
      spread,
      adjustedRiskScore,
      risk: riskLabel(adjustedRiskScore),
    };
  }, [gptZeroScore, turnitinScore, originalityScore, copyleaksScore]);

  return (
    <ToolLayout
      title="AI Detector Comparison Tool"
      slug="ai-detector-comparison-tool"
      description="Compare AI detector percentages and estimate a consensus risk score from combined inputs."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Collect scores", text: "Run your text through multiple AI detectors and note each percentage." },
        { name: "Enter percentages", text: "Input each detector score between 0 and 100." },
        { name: "Read consensus", text: "Review average, spread, and adjusted risk level." },
      ]}
      relatedTools={[
        { name: "AI Prompt Formatter", href: "/ai-prompt-formatter/" },
        { name: "Token Counter Calculator", href: "/token-counter-calculator/" },
        { name: "SQL Query Formatter", href: "/sql-query-formatter/" },
      ]}
      content={
        <>
          <h2>How consensus is estimated</h2>
          <p>
            The tool computes average detector score, then adjusts slightly based on disagreement spread. Larger spread increases uncertainty,
            so the adjusted score reflects both central tendency and variance.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="GPTZero Score (%)"
            type="number"
            min={0}
            max={100}
            value={gptZeroScore}
            onChange={(e) => setGptZeroScore(e.target.value)}
          />
          <Input
            label="Turnitin Score (%)"
            type="number"
            min={0}
            max={100}
            value={turnitinScore}
            onChange={(e) => setTurnitinScore(e.target.value)}
          />
          <Input
            label="Originality Score (%)"
            type="number"
            min={0}
            max={100}
            value={originalityScore}
            onChange={(e) => setOriginalityScore(e.target.value)}
          />
          <Input
            label="Copyleaks Score (%)"
            type="number"
            min={0}
            max={100}
            value={copyleaksScore}
            onChange={(e) => setCopyleaksScore(e.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard label="Consensus Risk" value={result.risk} highlight />
            <ResultCard label="Adjusted Risk Score" value={`${result.adjustedRiskScore.toFixed(1)}%`} />
            <ResultCard label="Average Score" value={`${result.average.toFixed(1)}%`} />
            <ResultCard label="Highest Score" value={`${result.highest.toFixed(1)}%`} />
            <ResultCard label="Lowest Score" value={`${result.lowest.toFixed(1)}%`} />
            <ResultCard label="Score Spread" value={`${result.spread.toFixed(1)}%`} />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Add at least one valid detector score between 0 and 100.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
