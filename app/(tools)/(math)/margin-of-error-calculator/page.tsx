"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";

type CalculationMode = "proportion" | "mean";
type ConfidenceLevel = 90 | 95 | 99;

interface MarginResult {
  mode: CalculationMode;
  confidenceLevel: ConfidenceLevel;
  zValue: number;
  sampleSize: number;
  baseMargin: number;
  adjustedMargin: number;
  finitePopulationCorrection: number;
  hasFinitePopulation: boolean;
}

const Z_VALUES: Record<ConfidenceLevel, number> = {
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

const faqs: FAQItem[] = [
  {
    question: "What does margin of error represent?",
    answer:
      "Margin of error is the plus-minus range around an estimate at a chosen confidence level. If a survey estimate is 52% with ±3%, the confidence interval is roughly 49% to 55%. It quantifies sampling uncertainty, not all possible error sources. Design flaws, non-response bias, and measurement issues can add additional uncertainty beyond the reported margin.",
  },
  {
    question: "How does sample size affect margin of error?",
    answer:
      "Margin of error shrinks with the square root of sample size. That means doubling sample size does not cut error in half. To reduce margin of error by half, you generally need about four times the sample size. This non-linear relationship explains why very high precision can become expensive in large-scale surveys and experiments.",
  },
  {
    question: "Why does confidence level change margin of error?",
    answer:
      "Higher confidence levels use larger critical values (z-scores), which widens intervals and increases margin of error. For example, 99% confidence has a higher z value than 95%, so uncertainty bounds are wider. You gain more certainty that the interval captures the true parameter, but you sacrifice precision.",
  },
  {
    question: "What is a typical margin of error in polling?",
    answer:
      "A common public-opinion benchmark is around ±3 percentage points at 95% confidence, often requiring roughly 1,000 responses for a large population. Smaller samples produce wider margins. Poll quality also depends on sampling method, weighting, and representativeness, so two polls with the same numeric margin can still differ in reliability.",
  },
  {
    question: "Should I apply finite population correction?",
    answer:
      "Apply finite population correction when your sample is a noticeable fraction of the total population, especially in small or closed populations. If population size is very large compared with sample size, the correction has little impact. In internal audits, school studies, and small customer lists, FPC can materially reduce estimated margin of error.",
  },
  {
    question: "Can I use this for means and percentages?",
    answer:
      "Yes. This calculator supports both proportion mode (percentages) and mean mode (continuous values). Proportion mode needs estimated proportion and sample size. Mean mode needs standard deviation and sample size. Choose the mode that matches your outcome type to ensure formulas and interpretation are correct.",
  },
];

function formatNumber(value: number, decimals = 4): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

function computeFinitePopulationCorrection(sampleSize: number, populationSize: number): number {
  if (populationSize <= 1 || sampleSize >= populationSize) return 0;
  return Math.sqrt((populationSize - sampleSize) / (populationSize - 1));
}

export default function MarginOfErrorCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("proportion");
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);
  const [sampleSize, setSampleSize] = useState("385");
  const [populationSize, setPopulationSize] = useState("");

  // Proportion mode input
  const [estimatedProportion, setEstimatedProportion] = useState("50");

  // Mean mode input
  const [stdDev, setStdDev] = useState("15");

  const result = useMemo<MarginResult | null>(() => {
    const n = Number.parseInt(sampleSize, 10);
    if (!Number.isFinite(n) || n <= 1) return null;

    const z = Z_VALUES[confidenceLevel];
    const population = Number.parseFloat(populationSize);
    const hasFinitePopulation = Number.isFinite(population) && population > 1;
    const fpc = hasFinitePopulation && population > n
      ? computeFinitePopulationCorrection(n, population)
      : 1;

    if (mode === "proportion") {
      const proportionPercent = Number.parseFloat(estimatedProportion);
      if (
        !Number.isFinite(proportionPercent) ||
        proportionPercent <= 0 ||
        proportionPercent >= 100
      ) {
        return null;
      }
      const p = proportionPercent / 100;
      const baseMargin = z * Math.sqrt((p * (1 - p)) / n);
      const adjustedMargin = baseMargin * fpc;

      return {
        mode,
        confidenceLevel,
        zValue: z,
        sampleSize: n,
        baseMargin,
        adjustedMargin,
        finitePopulationCorrection: fpc,
        hasFinitePopulation: hasFinitePopulation && population > n,
      };
    }

    const sigma = Number.parseFloat(stdDev);
    if (!Number.isFinite(sigma) || sigma <= 0) return null;

    const baseMargin = z * (sigma / Math.sqrt(n));
    const adjustedMargin = baseMargin * fpc;

    return {
      mode,
      confidenceLevel,
      zValue: z,
      sampleSize: n,
      baseMargin,
      adjustedMargin,
      finitePopulationCorrection: fpc,
      hasFinitePopulation: hasFinitePopulation && population > n,
    };
  }, [mode, confidenceLevel, sampleSize, populationSize, estimatedProportion, stdDev]);

  return (
    <ToolLayout
      title="Margin of Error Calculator"
      description="Compute margin of error for survey percentages and mean estimates. Set confidence level, sample size, and variability assumptions to measure estimate precision."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Choose outcome type",
          text: "Select Proportion for percentages or Mean for continuous values.",
        },
        {
          name: "Set confidence level",
          text: "Choose 90%, 95%, or 99% based on your reporting standard.",
        },
        {
          name: "Enter sample and variability inputs",
          text: "Provide sample size and either estimated proportion or standard deviation.",
        },
        {
          name: "Review adjusted precision",
          text: "Use finite population correction when population size is known and limited.",
        },
      ]}
      relatedTools={[
        { name: "Sample Size Calculator", href: "/sample-size-calculator" },
        { name: "Confidence Interval Calculator", href: "/confidence-interval-calculator" },
        { name: "P-Value Calculator", href: "/p-value-calculator" },
        { name: "Z-Score Calculator", href: "/z-score-calculator" },
        { name: "Variance Calculator", href: "/variance-calculator" },
      ]}
      content={
        <>
          <h2>What This Tool Does</h2>
          <p>
            This calculator estimates <strong>margin of error</strong>, the uncertainty range around a sample
            estimate at a chosen confidence level. It supports two workflows: proportion estimates (polling,
            conversion rates, yes/no outcomes) and mean estimates (continuous measurements such as score or time).
            Margin of error is central to interpreting whether differences are likely meaningful or likely due to
            sampling variation.
          </p>

          <h2>Formulas Used</h2>
          <h3>For Proportions</h3>
          <p><strong>ME = z × √(p(1−p)/n)</strong></p>
          <ul>
            <li><strong>p</strong>: estimated proportion (decimal)</li>
            <li><strong>n</strong>: sample size</li>
            <li><strong>z</strong>: critical value for confidence level</li>
          </ul>

          <h3>For Means</h3>
          <p><strong>ME = z × (σ/√n)</strong></p>
          <ul>
            <li><strong>σ</strong>: estimated standard deviation</li>
            <li><strong>n</strong>: sample size</li>
          </ul>

          <h3>Finite Population Correction (optional)</h3>
          <p>
            When population size N is limited and sample size n is substantial, adjusted margin is:
            <strong> ME_adj = ME × √((N−n)/(N−1))</strong>.
          </p>

          <h2>Worked Example</h2>
          <p>
            Suppose a proportion estimate uses n = 400, p = 0.50, and 95% confidence (z = 1.96):
          </p>
          <ul>
            <li>ME = 1.96 × √(0.5 × 0.5 / 400)</li>
            <li>ME = 1.96 × 0.025 = 0.049</li>
            <li>Margin of error ≈ <strong>±4.9%</strong></li>
          </ul>

          <h2>How to Read the Result</h2>
          <ul>
            <li>
              If estimate = 52% and ME = ±4.9%, confidence interval is approximately 47.1% to 56.9%.
            </li>
            <li>
              Narrower margins mean higher precision and usually require larger sample sizes.
            </li>
            <li>
              Margin of error reflects random sampling uncertainty, not systematic bias.
            </li>
          </ul>

          <h2>Sources and References</h2>
          <ul>
            <li>Cochran, W. G. <em>Sampling Techniques</em>.</li>
            <li>NIST/SEMATECH e-Handbook of Statistical Methods — Confidence Intervals.</li>
            <li>Lohr, S. <em>Sampling: Design and Analysis</em>.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Calculation Mode</label>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              onClick={() => setMode("proportion")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                mode === "proportion"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Proportion
            </button>
            <button
              onClick={() => setMode("mean")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                mode === "mean"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mean
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Confidence Level</label>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
            {([90, 95, 99] as ConfidenceLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setConfidenceLevel(level)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  confidenceLevel === level
                    ? "bg-white text-foreground shadow-sm dark:bg-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {level}%
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Sample Size (n)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="2"
              step="1"
              value={sampleSize}
              onChange={(event) => setSampleSize(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Population Size (optional)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="2"
              step="1"
              value={populationSize}
              onChange={(event) => setPopulationSize(event.target.value)}
              placeholder="Leave blank for large population"
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
        </div>

        {mode === "proportion" ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Estimated Proportion (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              max="99.99"
              step="0.01"
              value={estimatedProportion}
              onChange={(event) => setEstimatedProportion(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Standard Deviation (σ)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.0001"
              step="0.0001"
              value={stdDev}
              onChange={(event) => setStdDev(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
        )}

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Margin of Error {result.mode === "proportion" ? "(percentage points)" : "(units)"}
              </p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                ±
                {result.mode === "proportion"
                  ? `${formatNumber(result.adjustedMargin * 100, 3)}%`
                  : formatNumber(result.adjustedMargin, 4)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold text-foreground">{result.confidenceLevel}%</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Z Value</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.zValue, 3)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Base Margin</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.mode === "proportion"
                    ? `${formatNumber(result.baseMargin * 100, 3)}%`
                    : formatNumber(result.baseMargin, 4)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">FPC Factor</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(result.finitePopulationCorrection, 4)}
                </p>
              </div>
            </div>

            {result.hasFinitePopulation && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Finite population correction has been applied because population size exceeds sample size and is finite.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid numeric values to calculate margin of error.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

