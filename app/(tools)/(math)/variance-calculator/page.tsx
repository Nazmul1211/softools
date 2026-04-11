"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";

type DataType = "population" | "sample";

interface ContributionRow {
  value: number;
  deviation: number;
  squaredDeviation: number;
}

interface VarianceResult {
  dataType: DataType;
  count: number;
  sum: number;
  mean: number;
  min: number;
  max: number;
  range: number;
  sumSquaredDeviations: number;
  variance: number;
  stdDev: number;
  coefficientOfVariation: number | null;
  contributions: ContributionRow[];
}

const faqs: FAQItem[] = [
  {
    question: "What is variance in simple terms?",
    answer:
      "Variance measures how spread out values are around the mean. If values cluster tightly, variance is low. If values are widely scattered, variance is high. It is calculated from squared deviations from the mean, so larger gaps contribute disproportionately. Variance is foundational for standard deviation, confidence intervals, regression diagnostics, and many machine-learning methods.",
  },
  {
    question: "What is the difference between sample and population variance?",
    answer:
      "Population variance divides by N because you have the full population. Sample variance divides by N−1 (Bessel correction) to reduce downward bias when estimating population variance from a sample. If you collected all units in your target group, use population mode. If your data are only a subset, use sample mode for unbiased estimation.",
  },
  {
    question: "Why are deviations squared in variance?",
    answer:
      "Squaring ensures positive and negative deviations do not cancel out, and it gives more weight to larger differences from the mean. This makes variance sensitive to outliers, which can be useful for detecting instability. Because squaring changes units, standard deviation (the square root of variance) is often preferred for direct interpretation in original units.",
  },
  {
    question: "Can variance be negative?",
    answer:
      "No. Variance is always zero or positive because it is based on squared values. A variance of zero means all values are identical. If software returns a negative variance, it is usually a numerical precision issue or a calculation bug. In practical analytics, negative variance should be treated as invalid and investigated.",
  },
  {
    question: "How does variance relate to standard deviation?",
    answer:
      "Standard deviation is the square root of variance. Variance is useful algebraically in formulas and model fitting, while standard deviation is easier to interpret because it matches the units of the original data. Reporting both can be helpful: variance for statistical calculations and standard deviation for communication and decision making.",
  },
  {
    question: "When can variance be misleading?",
    answer:
      "Variance can be distorted by extreme outliers and by data with strong skewness or heavy tails. It also does not capture distribution shape, so two datasets may share variance but look very different. Pair variance with median, percentiles, and visualization (histogram or boxplot) for more complete understanding of variability.",
  },
];

function formatNumber(value: number, decimals = 6): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

export default function VarianceCalculatorPage() {
  const [dataType, setDataType] = useState<DataType>("sample");
  const [input, setInput] = useState("12, 15, 14, 10, 19, 17, 13, 16");

  const result = useMemo<VarianceResult | null>(() => {
    const values = input
      .split(/[,\s\n]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => Number.parseFloat(item))
      .filter((value) => Number.isFinite(value));

    if (values.length < 2) return null;

    const count = values.length;
    const sum = values.reduce((total, value) => total + value, 0);
    const mean = sum / count;
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;

    const contributions = values.map((value) => {
      const deviation = value - mean;
      const squaredDeviation = deviation * deviation;
      return { value, deviation, squaredDeviation };
    });

    const sumSquaredDeviations = contributions.reduce(
      (total, row) => total + row.squaredDeviation,
      0
    );

    const denominator = dataType === "population" ? count : count - 1;
    if (denominator <= 0) return null;

    const variance = sumSquaredDeviations / denominator;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : null;

    return {
      dataType,
      count,
      sum,
      mean,
      min,
      max,
      range,
      sumSquaredDeviations,
      variance,
      stdDev,
      coefficientOfVariation,
      contributions,
    };
  }, [input, dataType]);

  return (
    <ToolLayout
      title="Variance Calculator"
      description="Calculate population or sample variance from a dataset and see mean, standard deviation, and deviation breakdowns step by step."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your dataset",
          text: "Paste numbers separated by commas, spaces, or new lines.",
        },
        {
          name: "Choose data type",
          text: "Use Sample for partial data and Population when all values are included.",
        },
        {
          name: "Review variance and spread metrics",
          text: "Check variance, standard deviation, range, and coefficient of variation.",
        },
        {
          name: "Inspect squared deviations",
          text: "Use the contribution table to understand how each point affects total variance.",
        },
      ]}
      relatedTools={[
        { name: "Standard Deviation Calculator", href: "/standard-deviation-calculator" },
        { name: "Average Calculator", href: "/average-calculator" },
        { name: "Z-Score Calculator", href: "/z-score-calculator" },
        { name: "Confidence Interval Calculator", href: "/confidence-interval-calculator" },
        { name: "P-Value Calculator", href: "/p-value-calculator" },
      ]}
      content={
        <>
          <h2>What This Tool Does</h2>
          <p>
            This calculator computes variance from a numeric dataset and provides supporting spread metrics such
            as mean, standard deviation, range, and coefficient of variation. It supports both population and
            sample formulas so you can match your analysis context. A row-level deviation table is included to
            show how each observation contributes to total dispersion.
          </p>

          <h2>Variance Formulas</h2>
          <h3>Population Variance</h3>
          <p><strong>σ² = Σ(xᵢ − μ)² / N</strong></p>
          <h3>Sample Variance</h3>
          <p><strong>s² = Σ(xᵢ − x̄)² / (n − 1)</strong></p>
          <ul>
            <li><strong>xᵢ</strong>: each data value</li>
            <li><strong>μ or x̄</strong>: mean</li>
            <li><strong>N or n</strong>: number of observations</li>
          </ul>

          <h3>Worked Example</h3>
          <p>For values [4, 6, 8], mean = 6.</p>
          <ul>
            <li>Deviations: -2, 0, +2</li>
            <li>Squared deviations: 4, 0, 4</li>
            <li>Sum squared deviations = 8</li>
            <li>Population variance = 8/3 = 2.667</li>
            <li>Sample variance = 8/2 = 4.000</li>
          </ul>

          <h2>Interpreting Results</h2>
          <ul>
            <li>Higher variance indicates wider spread and less consistency around the mean.</li>
            <li>Lower variance indicates tighter clustering and greater consistency.</li>
            <li>Standard deviation is easier to interpret in original units, while variance is algebraically convenient.</li>
            <li>Compare coefficient of variation when datasets use different scales.</li>
          </ul>

          <h2>When to Use Population vs Sample Mode</h2>
          <p>
            Use <strong>population mode</strong> when the dataset includes every item in the target group.
            Use <strong>sample mode</strong> when data are a subset used to estimate broader population behavior.
            Sample mode uses n−1 to reduce estimation bias and is standard in inferential statistics.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>Rice, J. A. <em>Mathematical Statistics and Data Analysis</em>.</li>
            <li>Montgomery, D. C., &amp; Runger, G. C. <em>Applied Statistics and Probability for Engineers</em>.</li>
            <li>NIST/SEMATECH e-Handbook of Statistical Methods — Measures of Variation.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Data Type</label>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              onClick={() => setDataType("sample")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                dataType === "sample"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sample (n−1)
            </button>
            <button
              onClick={() => setDataType("population")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                dataType === "population"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Population (N)
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Enter Data Values
          </label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Example: 10, 15, 12, 18, 14"
            className="h-36 w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Enter at least 2 numbers. Commas, spaces, or line breaks are supported.
          </p>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">
                {result.dataType === "sample" ? "Sample Variance (s²)" : "Population Variance (σ²)"}
              </p>
              <p className="mt-1 text-3xl font-bold text-foreground">{formatNumber(result.variance, 6)}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Standard Deviation</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.stdDev, 6)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Mean</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.mean, 6)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="text-lg font-semibold text-foreground">{result.count}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Range</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.range, 6)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Additional Statistics</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Sum</p>
                  <p className="text-base font-semibold text-foreground">{formatNumber(result.sum, 6)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Minimum</p>
                  <p className="text-base font-semibold text-foreground">{formatNumber(result.min, 6)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maximum</p>
                  <p className="text-base font-semibold text-foreground">{formatNumber(result.max, 6)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coefficient of Variation</p>
                  <p className="text-base font-semibold text-foreground">
                    {result.coefficientOfVariation === null
                      ? "Undefined (mean is zero)"
                      : `${formatNumber(result.coefficientOfVariation, 2)}%`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-medium text-foreground">Deviation Contribution Table</p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-2 py-2 text-left font-medium text-muted-foreground">Value</th>
                      <th className="px-2 py-2 text-left font-medium text-muted-foreground">Deviation (x − mean)</th>
                      <th className="px-2 py-2 text-left font-medium text-muted-foreground">Squared Deviation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.contributions.slice(0, 12).map((row, index) => (
                      <tr key={`${row.value}-${index}`} className="border-b border-border/60">
                        <td className="px-2 py-2 text-foreground">{formatNumber(row.value, 6)}</td>
                        <td className="px-2 py-2 text-foreground">{formatNumber(row.deviation, 6)}</td>
                        <td className="px-2 py-2 text-foreground">{formatNumber(row.squaredDeviation, 6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Σ(x − mean)² = {formatNumber(result.sumSquaredDeviations, 6)}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Add at least two valid numbers to calculate variance.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

