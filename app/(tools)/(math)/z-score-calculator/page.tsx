"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";

type CalculationMode = "raw-to-z" | "z-to-raw";

interface ZScoreResult {
  mode: CalculationMode;
  rawScore: number;
  mean: number;
  stdDev: number;
  zScore: number;
  percentile: number;
  belowProbability: number;
  aboveProbability: number;
  interpretation: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is a z-score in statistics?",
    answer:
      "A z-score (standard score) tells you how far a value is from the mean in units of standard deviation. A z-score of 0 means the value is exactly at the mean. A z-score of +1 means the value is one standard deviation above the mean, while -1 means one standard deviation below. This standardization lets you compare values from different scales, such as exam scores from different tests.",
  },
  {
    question: "What does a z-score of 2 mean?",
    answer:
      "A z-score of 2 means the value is two standard deviations above the mean. In a normal distribution, this corresponds to approximately the 97.7th percentile, so the value is higher than about 97.7% of observations. Only about 2.3% of observations are expected above that point. This is often treated as unusually high, though context matters in practical decisions.",
  },
  {
    question: "Can a z-score be negative?",
    answer:
      "Yes. Negative z-scores are common and simply indicate values below the mean. For example, a z-score of -1.5 means the value is 1.5 standard deviations below average. In a normal distribution, that corresponds to roughly the 6.7th percentile, meaning the value is higher than about 6.7% of observations and lower than about 93.3% of observations.",
  },
  {
    question: "How is percentile related to z-score?",
    answer:
      "Percentile is the cumulative probability to the left of a z-score under the standard normal curve. For example, z = 0 maps to the 50th percentile, z = 1 maps to about the 84th percentile, and z = -1 maps to about the 16th percentile. Z-scores provide distance from the mean, while percentiles provide ranking position relative to the full distribution.",
  },
  {
    question: "When should I avoid using z-scores?",
    answer:
      "Use caution when data are heavily skewed, strongly non-normal, or have influential outliers, because interpretation based on normal-distribution percentiles can become misleading. Also, if the standard deviation is very small or unstable, tiny changes in raw values can produce large z-score swings. In these cases, robust methods, nonparametric summaries, or transformation of the data may be more appropriate.",
  },
  {
    question: "Are z-scores used to detect outliers?",
    answer:
      "Yes, z-scores are often used for preliminary outlier screening. Common thresholds are |z| > 2 for unusual values and |z| > 3 for potential outliers. These are practical rules, not strict laws. Domain knowledge matters, and some workflows combine z-scores with boxplots, robust z-scores, or model-based diagnostics before deciding to remove or investigate a data point.",
  },
];

function erf(x: number): number {
  // Abramowitz and Stegun approximation (maximum error ~1.5e-7)
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

function formatNumber(value: number, decimals = 4): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

function describeZScore(z: number): string {
  const absZ = Math.abs(z);
  if (absZ < 0.5) return "Very close to the mean";
  if (absZ < 1) return z > 0 ? "Slightly above the mean" : "Slightly below the mean";
  if (absZ < 2) return z > 0 ? "Moderately above the mean" : "Moderately below the mean";
  if (absZ < 3) return z > 0 ? "Far above the mean (unusual)" : "Far below the mean (unusual)";
  return z > 0 ? "Extreme high outlier candidate" : "Extreme low outlier candidate";
}

export default function ZScoreCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("raw-to-z");
  const [rawScore, setRawScore] = useState("82");
  const [zInput, setZInput] = useState("1.2");
  const [mean, setMean] = useState("75");
  const [stdDev, setStdDev] = useState("10");

  const result = useMemo<ZScoreResult | null>(() => {
    const meanValue = Number.parseFloat(mean);
    const stdDevValue = Number.parseFloat(stdDev);
    if (!Number.isFinite(meanValue) || !Number.isFinite(stdDevValue) || stdDevValue <= 0) {
      return null;
    }

    let computedZ: number;
    let computedRaw: number;

    if (mode === "raw-to-z") {
      const rawValue = Number.parseFloat(rawScore);
      if (!Number.isFinite(rawValue)) return null;
      computedRaw = rawValue;
      computedZ = (rawValue - meanValue) / stdDevValue;
    } else {
      const zValue = Number.parseFloat(zInput);
      if (!Number.isFinite(zValue)) return null;
      computedZ = zValue;
      computedRaw = meanValue + zValue * stdDevValue;
    }

    const percentile = normalCdf(computedZ) * 100;
    const belowProbability = percentile;
    const aboveProbability = 100 - percentile;

    return {
      mode,
      rawScore: computedRaw,
      mean: meanValue,
      stdDev: stdDevValue,
      zScore: computedZ,
      percentile,
      belowProbability,
      aboveProbability,
      interpretation: describeZScore(computedZ),
    };
  }, [mode, rawScore, zInput, mean, stdDev]);

  return (
    <ToolLayout
      title="Z-Score Calculator"
      description="Convert raw values into z-scores, or convert z-scores back to raw values. Instantly see percentile rank, lower-tail probability, upper-tail probability, and interpretation."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Choose a mode",
          text: "Select Raw to Z if you have a score and want a z-value, or select Z to Raw if you want the original scale value.",
        },
        {
          name: "Enter distribution values",
          text: "Input the mean and standard deviation for your dataset or population.",
        },
        {
          name: "Enter the target value",
          text: "Provide either the raw value (for z conversion) or the z-score (for reverse conversion).",
        },
        {
          name: "Interpret the output",
          text: "Use z-score, percentile, and tail probabilities to understand relative position and rarity.",
        },
      ]}
      relatedTools={[
        { name: "P-Value Calculator", href: "/p-value-calculator" },
        { name: "Confidence Interval Calculator", href: "/confidence-interval-calculator" },
        { name: "Standard Deviation Calculator", href: "/standard-deviation-calculator" },
        { name: "Probability Calculator", href: "/probability-calculator" },
        { name: "Average Calculator", href: "/average-calculator" },
      ]}
      content={
        <>
          <h2>What Is a Z-Score?</h2>
          <p>
            A <strong>z-score</strong> is a standardized measurement that expresses how many standard deviations
            a value is above or below the mean. This normalization makes values from different datasets directly
            comparable. For example, a score of 82 may look strong in one class and average in another. Z-scores
            resolve that by accounting for both mean and spread (standard deviation). In many practical settings,
            z-scores are used for exam analysis, quality control, healthcare screening metrics, and financial risk
            monitoring.
          </p>

          <h2>Z-Score Formula and Reverse Formula</h2>
          <p>
            <strong>Forward conversion (raw to z):</strong> z = (x − μ) / σ
          </p>
          <ul>
            <li><strong>x</strong> = raw value</li>
            <li><strong>μ</strong> = mean</li>
            <li><strong>σ</strong> = standard deviation</li>
          </ul>
          <p>
            <strong>Reverse conversion (z to raw):</strong> x = μ + zσ
          </p>

          <h3>Worked Example</h3>
          <p>
            Suppose an exam has mean 75 and standard deviation 10, and a student scores 82.
          </p>
          <ul>
            <li>z = (82 − 75) / 10 = 0.7</li>
            <li>Percentile for z = 0.7 is about 75.8%</li>
            <li>This means the score is higher than about 75.8% of the group</li>
          </ul>

          <h2>How to Interpret Z-Score Ranges</h2>
          <table>
            <thead>
              <tr>
                <th>Z-Score Range</th>
                <th>Interpretation</th>
                <th>Typical Percentile Span</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>-0.5 to 0.5</td>
                <td>Near average</td>
                <td>31st to 69th</td>
              </tr>
              <tr>
                <td>0.5 to 1.5</td>
                <td>Above average</td>
                <td>69th to 93rd</td>
              </tr>
              <tr>
                <td>-1.5 to -0.5</td>
                <td>Below average</td>
                <td>7th to 31st</td>
              </tr>
              <tr>
                <td>|z| &gt; 2</td>
                <td>Unusual value</td>
                <td>Below 2.5th or above 97.5th</td>
              </tr>
              <tr>
                <td>|z| &gt; 3</td>
                <td>Potential extreme outlier</td>
                <td>Below 0.13th or above 99.87th</td>
              </tr>
            </tbody>
          </table>

          <h2>Percentile and Tail Probability</h2>
          <p>
            For normally distributed data, percentile is the probability of observing a value less than or equal
            to your z-score. Lower-tail probability answers &ldquo;how often values are at or below this point,&rdquo;
            while upper-tail probability answers &ldquo;how often values are above this point.&rdquo; These are useful
            for threshold design, test scoring, and anomaly monitoring.
          </p>

          <h2>Common Use Cases</h2>
          <ul>
            <li><strong>Education:</strong> Compare students across tests with different difficulty.</li>
            <li><strong>Manufacturing:</strong> Track deviation of process measurements from target.</li>
            <li><strong>Healthcare:</strong> Assess standardized growth and lab metrics.</li>
            <li><strong>Finance:</strong> Quantify how unusual price moves are versus recent volatility.</li>
            <li><strong>Research:</strong> Standardize variables before modeling or index construction.</li>
          </ul>

          <h2>Limitations and Good Practice</h2>
          <p>
            Z-score interpretation is strongest when data are approximately normal and standard deviation is stable.
            If data are skewed, heavy-tailed, or strongly seasonal, percentile mapping from a normal model may be
            less reliable. Pair z-scores with visual checks (histogram, QQ plot) and domain context before making
            high-impact decisions.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>NIST/SEMATECH e-Handbook of Statistical Methods — Standard Scores and Normal Distribution.</li>
            <li>Montgomery, D. C., &amp; Runger, G. C. <em>Applied Statistics and Probability for Engineers</em>.</li>
            <li>Freedman, D., Pisani, R., &amp; Purves, R. <em>Statistics</em> (W. W. Norton).</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Calculation Mode</label>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              onClick={() => setMode("raw-to-z")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === "raw-to-z"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Raw → Z
            </button>
            <button
              onClick={() => setMode("z-to-raw")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                mode === "z-to-raw"
                  ? "bg-white text-foreground shadow-sm dark:bg-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Z → Raw
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Mean (μ)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={mean}
              onChange={(event) => setMean(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Standard Deviation (σ)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.0001"
              value={stdDev}
              onChange={(event) => setStdDev(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
        </div>

        {mode === "raw-to-z" ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Raw Score (x)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={rawScore}
              onChange={(event) => setRawScore(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Z-Score
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={zInput}
              onChange={(event) => setZInput(event.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted/30"
            />
          </div>
        )}

        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-sm font-medium text-muted-foreground">
                {result.mode === "raw-to-z" ? "Computed Z-Score" : "Computed Raw Score"}
              </p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {result.mode === "raw-to-z" ? formatNumber(result.zScore) : formatNumber(result.rawScore)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{result.interpretation}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Z-Score</p>
                <p className="text-xl font-semibold text-foreground">{formatNumber(result.zScore)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Percentile</p>
                <p className="text-xl font-semibold text-foreground">{formatNumber(result.percentile, 2)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Below Probability</p>
                <p className="text-xl font-semibold text-foreground">{formatNumber(result.belowProbability, 2)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">Above Probability</p>
                <p className="text-xl font-semibold text-foreground">{formatNumber(result.aboveProbability, 2)}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid numeric inputs and a positive standard deviation to see results.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

