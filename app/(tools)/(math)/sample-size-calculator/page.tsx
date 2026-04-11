"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";

type CalculationMode = "proportion" | "mean";
type ConfidenceLevel = 90 | 95 | 99;

interface SampleSizeResult {
  mode: CalculationMode;
  confidenceLevel: ConfidenceLevel;
  zValue: number;
  initialSampleSize: number;
  adjustedSampleSize: number;
  recommendedSampleSize: number;
  hasFinitePopulation: boolean;
  populationSize: number | null;
  formula: string;
}

const Z_VALUES: Record<ConfidenceLevel, number> = {
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

const faqs: FAQItem[] = [
  {
    question: "Why does sample size matter so much?",
    answer:
      "Sample size drives statistical precision and decision reliability. Too small a sample increases uncertainty and widens confidence intervals, making conclusions unstable. A properly sized sample improves reproducibility and reduces random noise. In survey and experiment planning, sample size should be set before data collection to align with confidence level, acceptable error, and practical constraints such as budget and timeline.",
  },
  {
    question: "What is finite population correction?",
    answer:
      "Finite population correction (FPC) reduces required sample size when your target population is not very large. Standard formulas assume an effectively infinite population. If you sample a sizable fraction of a small population, uncertainty drops faster, and FPC adjusts the estimate accordingly. This is common in internal company surveys, classroom studies, or quality checks where total population size is known.",
  },
  {
    question: "Why is 50% used as default proportion?",
    answer:
      "When the true proportion is unknown, p = 0.50 is the most conservative assumption because it maximizes p(1−p), which produces the largest required sample size. Using 50% helps avoid underestimation and protects study quality. If you have historical data suggesting a different expected proportion, you can enter that value to produce a more tailored sample estimate.",
  },
  {
    question: "How does confidence level affect sample size?",
    answer:
      "Higher confidence levels require larger sample sizes because they use larger critical values (z). For example, moving from 95% to 99% confidence increases z from 1.96 to 2.576, which can substantially increase required observations. This reflects a tradeoff: more certainty about capturing the true parameter requires more data collection effort.",
  },
  {
    question: "Can I use this for A/B testing?",
    answer:
      "Yes, this tool is useful for early planning of A/B tests and conversion studies, especially in proportion mode. However, production-grade experiment design often also needs minimum detectable effect, baseline conversion rate, test power, and multiple-testing controls. Use this as a strong starting estimate, then refine with a dedicated power-analysis workflow when stakes are high.",
  },
  {
    question: "Should I always round up sample size?",
    answer:
      "Yes. Sample size formulas often return non-integer values, but data collection is discrete, so always round up to the next whole number. Rounding down can violate your target precision. Many teams also add a non-response buffer (for example 10% to 20%) to maintain effective sample size after dropouts, invalid responses, or missing data.",
  },
];

function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

export default function SampleSizeCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("proportion");
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(95);
  const [populationSize, setPopulationSize] = useState("");

  // Proportion inputs
  const [estimatedProportion, setEstimatedProportion] = useState("50");
  const [marginErrorPercent, setMarginErrorPercent] = useState("5");

  // Mean inputs
  const [stdDev, setStdDev] = useState("15");
  const [marginErrorUnits, setMarginErrorUnits] = useState("2");

  const result = useMemo<SampleSizeResult | null>(() => {
    const z = Z_VALUES[confidenceLevel];
    const population = Number.parseFloat(populationSize);
    const hasFinitePopulation = Number.isFinite(population) && population > 1;
    const populationValue = hasFinitePopulation ? population : null;

    if (mode === "proportion") {
      const proportionPercent = Number.parseFloat(estimatedProportion);
      const marginPercent = Number.parseFloat(marginErrorPercent);
      if (
        !Number.isFinite(proportionPercent) ||
        !Number.isFinite(marginPercent) ||
        proportionPercent <= 0 ||
        proportionPercent >= 100 ||
        marginPercent <= 0
      ) {
        return null;
      }

      const p = proportionPercent / 100;
      const margin = marginPercent / 100;
      const initialSampleSize = (z * z * p * (1 - p)) / (margin * margin);
      const adjustedSampleSize = hasFinitePopulation && populationValue
        ? (populationValue * initialSampleSize) / (populationValue + initialSampleSize - 1)
        : initialSampleSize;

      return {
        mode,
        confidenceLevel,
        zValue: z,
        initialSampleSize,
        adjustedSampleSize,
        recommendedSampleSize: Math.ceil(adjustedSampleSize),
        hasFinitePopulation,
        populationSize: populationValue,
        formula: "n = z² × p(1−p) / E²",
      };
    }

    const sigma = Number.parseFloat(stdDev);
    const margin = Number.parseFloat(marginErrorUnits);
    if (!Number.isFinite(sigma) || !Number.isFinite(margin) || sigma <= 0 || margin <= 0) {
      return null;
    }

    const initialSampleSize = Math.pow((z * sigma) / margin, 2);
    const adjustedSampleSize = hasFinitePopulation && populationValue
      ? (populationValue * initialSampleSize) / (populationValue + initialSampleSize - 1)
      : initialSampleSize;

    return {
      mode,
      confidenceLevel,
      zValue: z,
      initialSampleSize,
      adjustedSampleSize,
      recommendedSampleSize: Math.ceil(adjustedSampleSize),
      hasFinitePopulation,
      populationSize: populationValue,
      formula: "n = (z × σ / E)²",
    };
  }, [
    mode,
    confidenceLevel,
    populationSize,
    estimatedProportion,
    marginErrorPercent,
    stdDev,
    marginErrorUnits,
  ]);

  return (
    <ToolLayout
      title="Sample Size Calculator"
      description="Estimate the minimum sample size for surveys and studies. Choose proportion or mean mode, set confidence level and margin of error, then apply finite population correction when needed."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Select study mode",
          text: "Choose Proportion for yes/no style outcomes, or Mean for continuous measurements.",
        },
        {
          name: "Set confidence and error target",
          text: "Pick 90%, 95%, or 99% confidence, then enter your acceptable margin of error.",
        },
        {
          name: "Enter variability assumptions",
          text: "Use expected proportion for surveys or standard deviation for continuous measurements.",
        },
        {
          name: "Apply finite population correction if needed",
          text: "Provide known population size for small populations to get adjusted sample size.",
        },
      ]}
      relatedTools={[
        { name: "Margin of Error Calculator", href: "/margin-of-error-calculator" },
        { name: "Confidence Interval Calculator", href: "/confidence-interval-calculator" },
        { name: "P-Value Calculator", href: "/p-value-calculator" },
        { name: "Z-Score Calculator", href: "/z-score-calculator" },
        { name: "Variance Calculator", href: "/variance-calculator" },
      ]}
      content={
        <>
          <h2>What This Tool Calculates</h2>
          <p>
            This calculator estimates the minimum number of observations required to reach a target precision
            at a selected confidence level. It supports two common planning modes:
            <strong> proportion studies</strong> (survey percentages, conversion rates, pass/fail outcomes) and
            <strong> mean studies</strong> (continuous outcomes such as time, score, or weight). Proper sample-size
            planning is essential for credible statistical inference and helps avoid underpowered studies.
          </p>

          <h2>Sample Size Formulas</h2>
          <h3>For Proportions</h3>
          <p><strong>n = z² × p(1−p) / E²</strong></p>
          <ul>
            <li><strong>z</strong>: critical value for confidence level</li>
            <li><strong>p</strong>: expected proportion (as decimal)</li>
            <li><strong>E</strong>: desired margin of error (as decimal)</li>
          </ul>

          <h3>For Means</h3>
          <p><strong>n = (z × σ / E)²</strong></p>
          <ul>
            <li><strong>σ</strong>: standard deviation estimate</li>
            <li><strong>E</strong>: acceptable absolute error in original units</li>
          </ul>

          <h3>Finite Population Correction</h3>
          <p>
            If total population size is known and limited, adjusted sample size can be computed as:
            <strong> n_adj = (N × n) / (N + n − 1)</strong>.
          </p>

          <h2>Worked Example (Proportion)</h2>
          <p>
            Suppose you need a 95% confidence survey with ±5% margin of error and unknown true proportion,
            so you use p = 0.50.
          </p>
          <ul>
            <li>z = 1.96</li>
            <li>n = 1.96² × 0.5 × 0.5 / 0.05² ≈ 384.16</li>
            <li>Round up to <strong>385 responses</strong></li>
          </ul>

          <h2>Choosing Inputs Well</h2>
          <ul>
            <li>
              Use <strong>p = 50%</strong> if uncertain, to avoid underestimating required sample size.
            </li>
            <li>
              Use pilot or historical data for <strong>standard deviation</strong> in mean studies.
            </li>
            <li>
              Add a practical response-loss buffer (for example, +10% to +20%) for real-world collection.
            </li>
          </ul>

          <h2>Sources and References</h2>
          <ul>
            <li>Cochran, W. G. <em>Sampling Techniques</em>.</li>
            <li>Kish, L. <em>Survey Sampling</em>.</li>
            <li>NIST/SEMATECH e-Handbook of Statistical Methods — Sample Size Determination.</li>
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

        {mode === "proportion" ? (
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Margin of Error (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={marginErrorPercent}
                onChange={(event) => setMarginErrorPercent(event.target.value)}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Margin of Error (units)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0.0001"
                step="0.0001"
                value={marginErrorUnits}
                onChange={(event) => setMarginErrorUnits(event.target.value)}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
              />
            </div>
          </div>
        )}

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
            placeholder="Leave blank for large or unknown population"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
          />
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">Recommended Sample Size</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{result.recommendedSampleSize}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Formula used: {result.formula}
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
                <p className="text-xs text-muted-foreground">Initial n (infinite N)</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.initialSampleSize, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">
                  {result.hasFinitePopulation ? "Adjusted n (finite N)" : "Adjusted n"}
                </p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.adjustedSampleSize, 2)}</p>
              </div>
            </div>

            {result.hasFinitePopulation && result.populationSize && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Finite population correction applied with N = {formatNumber(result.populationSize, 0)}.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate required sample size.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

