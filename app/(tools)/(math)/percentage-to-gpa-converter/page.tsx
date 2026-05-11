"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

const faqs: FAQItem[] = [
  {
    question: "Is percentage to GPA conversion universal?",
    answer:
      "No. Schools use different grading policies. Use this tool for quick planning estimates, then confirm with your institution scale.",
  },
  {
    question: "Why show 4.0, 5.0, and 10.0 scales?",
    answer:
      "These are common GPA scales used across different countries and institutions.",
  },
  {
    question: "Does this include weighted GPA?",
    answer:
      "No. This conversion is unweighted and based on percentage only.",
  },
];

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function toLetterGrade(percentage: number): string {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 60) return "D";
  return "F";
}

function mapToScale(percentage: number, scale: 4 | 5 | 10): number {
  return (clampPercentage(percentage) / 100) * scale;
}

export default function PercentageToGPAConverterPage() {
  const [percentageInput, setPercentageInput] = useState("85");
  const [targetScale, setTargetScale] = useState<4 | 5 | 10>(4);

  const result = useMemo(() => {
    const percentage = Number.parseFloat(percentageInput);
    if (!Number.isFinite(percentage) || percentage < 0) return null;

    const clamped = clampPercentage(percentage);
    const gpa4 = mapToScale(clamped, 4);
    const gpa5 = mapToScale(clamped, 5);
    const gpa10 = mapToScale(clamped, 10);

    const selectedValue =
      targetScale === 4 ? gpa4 : targetScale === 5 ? gpa5 : gpa10;

    return {
      percentage: clamped,
      gpa4,
      gpa5,
      gpa10,
      selectedValue,
      letterGrade: toLetterGrade(clamped),
    };
  }, [percentageInput, targetScale]);

  return (
    <ToolLayout
      title="Percentage to GPA Converter"
      slug="percentage-to-gpa-converter"
      description="Convert percentage grades into GPA estimates across 4.0, 5.0, and 10.0 scales."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter percentage", text: "Input your percentage score from 0 to 100." },
        { name: "Choose target scale", text: "Select whether you need 4.0, 5.0, or 10.0 output focus." },
        { name: "Review conversions", text: "See all scale conversions plus letter grade estimate." },
      ]}
      relatedTools={[
        { name: "CGPA to Percentage Converter", href: "/cgpa-to-percentage-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "Weighted Grade Calculator", href: "/weighted-grade-calculator/" },
      ]}
      content={
        <>
          <h2>Important note</h2>
          <p>
            GPA standards vary by board and university. This tool provides a quick normalized conversion method to support planning
            and comparison.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Percentage Score"
            type="number"
            min={0}
            max={100}
            step="0.01"
            suffix="%"
            value={percentageInput}
            onChange={(event) => setPercentageInput(event.target.value)}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Target Scale</label>
            <select
              value={targetScale}
              onChange={(event) => setTargetScale(Number(event.target.value) as 4 | 5 | 10)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            >
              <option value={4}>4.0 Scale</option>
              <option value={5}>5.0 Scale</option>
              <option value={10}>10.0 Scale</option>
            </select>
          </div>
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard label={`GPA (${targetScale.toFixed(1)} scale)`} value={result.selectedValue.toFixed(2)} highlight />
            <ResultCard label="Estimated Letter Grade" value={result.letterGrade} />
            <ResultCard label="4.0 Scale GPA" value={result.gpa4.toFixed(2)} />
            <ResultCard label="5.0 Scale GPA" value={result.gpa5.toFixed(2)} />
            <ResultCard label="10.0 Scale GPA" value={result.gpa10.toFixed(2)} />
            <ResultCard label="Input Percentage" value={`${result.percentage.toFixed(2)}%`} />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter a valid percentage to convert.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
