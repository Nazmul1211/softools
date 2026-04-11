"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";

type TailType = "left" | "right" | "two";

interface PValueResult {
  zStatistic: number;
  tail: TailType;
  pValue: number;
  alpha: number;
  significant: boolean;
  decision: string;
  interpretation: string;
  formula: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is a p-value?",
    answer:
      "A p-value is the probability of observing a test statistic at least as extreme as the one you obtained, assuming the null hypothesis is true. Smaller p-values indicate stronger evidence against the null hypothesis. A p-value does not measure effect size, practical importance, or the probability that the null hypothesis is true. It only measures compatibility of data with the null model.",
  },
  {
    question: "What is the difference between one-tailed and two-tailed tests?",
    answer:
      "A one-tailed test checks for an effect in a specific direction (greater than or less than), while a two-tailed test checks for any difference regardless of direction. Two-tailed tests split probability across both extremes and are generally more conservative. You should choose tail type before seeing results, based on research design and hypothesis wording.",
  },
  {
    question: "What does p < 0.05 actually mean?",
    answer:
      "It means that if the null hypothesis were true, data at least this extreme would occur less than 5% of the time under the assumed model. This threshold is a convention, not a universal law. In high-risk fields, stricter thresholds such as 0.01 may be preferred. In exploratory work, p-values should be interpreted alongside effect sizes and confidence intervals.",
  },
  {
    question: "Can a p-value prove my hypothesis is true?",
    answer:
      "No. A p-value can indicate whether data are inconsistent with the null hypothesis, but it cannot prove your alternative hypothesis. Statistical significance is not the same as truth, causality, or practical value. Good conclusions combine p-values with effect magnitude, confidence intervals, study quality, assumptions, and external evidence.",
  },
  {
    question: "Why can tiny effects become significant with large samples?",
    answer:
      "As sample size grows, standard errors shrink, making it easier to detect even very small differences. This can produce very small p-values for effects that are statistically significant but practically trivial. That is why reporting effect size and confidence intervals is critical, especially in large datasets and A/B testing environments.",
  },
  {
    question: "Should I use this calculator for t-tests too?",
    answer:
      "This tool computes p-values from z-statistics (normal distribution). For large samples this is often close to t-test results, but for small samples you should use t-distribution methods with degrees of freedom. If your workflow requires exact t-test p-values, use a dedicated t-test calculator or statistical package for full precision.",
  },
];

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX));
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function formatNumber(value: number, decimals = 6): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

function interpretPValue(pValue: number): string {
  if (pValue < 0.001) return "Very strong evidence against the null hypothesis";
  if (pValue < 0.01) return "Strong evidence against the null hypothesis";
  if (pValue < 0.05) return "Moderate evidence against the null hypothesis";
  if (pValue < 0.1) return "Weak evidence against the null hypothesis";
  return "Insufficient evidence to reject the null hypothesis";
}

export default function PValueCalculatorPage() {
  const [zStatistic, setZStatistic] = useState("1.96");
  const [tail, setTail] = useState<TailType>("two");
  const [alpha, setAlpha] = useState("0.05");

  const result = useMemo<PValueResult | null>(() => {
    const z = Number.parseFloat(zStatistic);
    const alphaValue = Number.parseFloat(alpha);
    if (!Number.isFinite(z) || !Number.isFinite(alphaValue) || alphaValue <= 0 || alphaValue >= 1) {
      return null;
    }

    let pValue = 0;
    let formula = "";

    if (tail === "left") {
      pValue = normalCdf(z);
      formula = "p = Φ(z)";
    } else if (tail === "right") {
      pValue = 1 - normalCdf(z);
      formula = "p = 1 − Φ(z)";
    } else {
      pValue = 2 * (1 - normalCdf(Math.abs(z)));
      formula = "p = 2 × (1 − Φ(|z|))";
    }

    const significant = pValue < alphaValue;
    const decision = significant
      ? "Reject the null hypothesis"
      : "Fail to reject the null hypothesis";

    return {
      zStatistic: z,
      tail,
      pValue,
      alpha: alphaValue,
      significant,
      decision,
      interpretation: interpretPValue(pValue),
      formula,
    };
  }, [zStatistic, tail, alpha]);

  return (
    <ToolLayout
      title="P-Value Calculator"
      description="Compute p-values from z-test statistics for left-tailed, right-tailed, and two-tailed hypothesis tests. Compare against alpha and get a clear significance decision."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter z-test statistic",
          text: "Input your computed z value from your hypothesis test.",
        },
        {
          name: "Choose tail direction",
          text: "Select left-tailed, right-tailed, or two-tailed based on your hypothesis.",
        },
        {
          name: "Set significance level",
          text: "Use alpha such as 0.10, 0.05, or 0.01 depending on your decision threshold.",
        },
        {
          name: "Interpret result",
          text: "Compare p-value with alpha to decide whether to reject the null hypothesis.",
        },
      ]}
      relatedTools={[
        { name: "Z-Score Calculator", href: "/z-score-calculator" },
        { name: "Confidence Interval Calculator", href: "/confidence-interval-calculator" },
        { name: "Sample Size Calculator", href: "/sample-size-calculator" },
        { name: "Margin of Error Calculator", href: "/margin-of-error-calculator" },
        { name: "Probability Calculator", href: "/probability-calculator" },
      ]}
      content={
        <>
          <h2>What Is a P-Value?</h2>
          <p>
            A <strong>p-value</strong> quantifies how surprising your observed statistic is under the null
            hypothesis. If the null hypothesis is true, the p-value is the probability of seeing a result as
            extreme or more extreme than the one observed. Small p-values suggest the data are less compatible
            with the null model and may justify rejection at a chosen significance level (alpha).
          </p>

          <h2>Tail Direction and Formula</h2>
          <p>
            For z-tests, p-values are derived from the standard normal cumulative distribution function Φ(z).
          </p>
          <ul>
            <li><strong>Left-tailed:</strong> p = Φ(z)</li>
            <li><strong>Right-tailed:</strong> p = 1 − Φ(z)</li>
            <li><strong>Two-tailed:</strong> p = 2 × (1 − Φ(|z|))</li>
          </ul>
          <p>
            Tail choice must match your hypothesis statement. If your alternative is directional, use one-tailed.
            If your alternative is simply &ldquo;different,&rdquo; use two-tailed.
          </p>

          <h3>Worked Example</h3>
          <p>
            Suppose your test yields z = 2.10 with a two-tailed hypothesis.
          </p>
          <ul>
            <li>Φ(2.10) ≈ 0.9821</li>
            <li>Upper tail = 1 − 0.9821 = 0.0179</li>
            <li>Two-tailed p = 2 × 0.0179 = 0.0358</li>
          </ul>
          <p>
            At alpha = 0.05, p = 0.0358 &lt; 0.05, so you reject the null hypothesis.
          </p>

          <h2>How to Interpret P-Values Responsibly</h2>
          <ul>
            <li><strong>P-value is not effect size:</strong> significance does not imply practical impact.</li>
            <li><strong>P-value is not certainty:</strong> it does not give the probability that the null is true.</li>
            <li><strong>Context matters:</strong> sample design, assumptions, and multiple testing can shift interpretation.</li>
            <li><strong>Use companion metrics:</strong> confidence intervals and effect sizes should be reported together.</li>
          </ul>

          <h2>Common Alpha Levels</h2>
          <table>
            <thead>
              <tr>
                <th>Alpha (α)</th>
                <th>Confidence Equivalent</th>
                <th>Typical Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0.10</td>
                <td>90%</td>
                <td>Exploratory analysis</td>
              </tr>
              <tr>
                <td>0.05</td>
                <td>95%</td>
                <td>General scientific reporting</td>
              </tr>
              <tr>
                <td>0.01</td>
                <td>99%</td>
                <td>High-stakes or strict inference</td>
              </tr>
            </tbody>
          </table>

          <h2>Sources and References</h2>
          <ul>
            <li>Fisher, R. A. <em>Statistical Methods for Research Workers</em>.</li>
            <li>Wasserstein, R. L., &amp; Lazar, N. A. (2016). The ASA Statement on p-values.</li>
            <li>NIST/SEMATECH e-Handbook of Statistical Methods — Hypothesis Testing.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Z-Test Statistic
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.0001"
            value={zStatistic}
            onChange={(event) => setZStatistic(event.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Tail Type</label>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
            <button
              onClick={() => setTail("left")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                tail === "left"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Left
            </button>
            <button
              onClick={() => setTail("two")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                tail === "two"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Two
            </button>
            <button
              onClick={() => setTail("right")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                tail === "right"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Right
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Significance Level (α)
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0.0001"
            max="0.9999"
            step="0.0001"
            value={alpha}
            onChange={(event) => setAlpha(event.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
          />
          <div className="mt-2 flex gap-2">
            {["0.10", "0.05", "0.01"].map((preset) => (
              <button
                key={preset}
                onClick={() => setAlpha(preset)}
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                α = {preset}
              </button>
            ))}
          </div>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">P-Value</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{formatNumber(result.pValue, 8)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{result.interpretation}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Tail Type</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.tail === "two" ? "Two-Tailed" : result.tail === "left" ? "Left-Tailed" : "Right-Tailed"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Alpha</p>
                <p className="text-lg font-semibold text-foreground">{formatNumber(result.alpha, 4)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Decision</p>
                <p className={`text-lg font-semibold ${result.significant ? "text-green-600" : "text-amber-600"}`}>
                  {result.significant ? "Significant" : "Not Significant"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Formula</p>
                <p className="text-sm font-semibold text-foreground">{result.formula}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-foreground">Inference</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.decision} because p ({formatNumber(result.pValue, 6)}){" "}
                {result.significant ? "<" : "≥"} α ({formatNumber(result.alpha, 4)}).
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter a valid z-statistic and an alpha value between 0 and 1 to see results.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

