"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { BarChart3, Target, Info, ArrowRight, Calculator, BookOpen } from "lucide-react";

/* ─── FAQ Data ──────────────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "What is a confidence interval in simple terms?",
    answer:
      "A confidence interval is a range of values that is likely to contain the true population parameter based on sample data. For example, a 95% confidence interval of [48, 52] for average test scores means: if you repeated the sampling process 100 times, approximately 95 of those intervals would contain the true population mean. It does NOT mean there is a 95% probability that the true mean falls within this specific interval — the true mean either is or isn't in the interval. This is a common misconception clarified by Neyman (1937), who developed the confidence interval framework.",
  },
  {
    question: "What is the difference between 90%, 95%, and 99% confidence levels?",
    answer:
      "The confidence level determines how wide your interval is. A 95% confidence level (the most common in research) uses a z-score of 1.96, producing a moderately wide interval. A 99% level (z = 2.576) produces a wider interval but offers greater confidence the true value is captured. A 90% level (z = 1.645) produces a narrower interval with less confidence. The trade-off is: higher confidence = wider interval = less precision. In medical research, 95% is standard; in preliminary studies, 90% is acceptable; and in high-stakes decisions, 99% is preferred.",
  },
  {
    question: "When should I use a z-distribution vs. a t-distribution?",
    answer:
      "Use the z-distribution when: (1) the population standard deviation is known, or (2) the sample size is large (n ≥ 30). Use the t-distribution when: (1) the population standard deviation is unknown and you must estimate it from the sample, AND (2) the sample size is small (n < 30). The t-distribution has heavier tails than the z-distribution, producing wider confidence intervals for small samples. As n increases, the t-distribution converges to the z-distribution. William Sealy Gosset (publishing as 'Student') developed the t-distribution in 1908 while working at the Guinness brewery.",
  },
  {
    question: "How does sample size affect the confidence interval?",
    answer:
      "The margin of error is inversely proportional to the square root of the sample size: ME = z × (σ/√n). Doubling the sample size reduces the margin of error by approximately 29% (not 50%). To cut the margin of error in half, you need to quadruple your sample size. This is why diminishing returns make very large samples expensive relative to accuracy gains. For example, going from n=100 to n=400 halves the margin of error, but going from n=400 to n=1600 only halves it again — with 4× the cost.",
  },
  {
    question: "What is the margin of error and how is it calculated?",
    answer:
      "The margin of error (ME) is the radius of the confidence interval — the amount added to and subtracted from the sample statistic to create the interval. For means: ME = z × (σ/√n), where z is the critical value, σ is the standard deviation, and n is the sample size. For proportions: ME = z × √(p̂(1−p̂)/n), where p̂ is the sample proportion. A typical political poll with n=1,000 and p̂=0.50 at 95% confidence has ME = 1.96 × √(0.25/1000) = ±3.1 percentage points.",
  },
  {
    question: "Can I calculate a confidence interval for proportions (percentages)?",
    answer:
      "Yes. This calculator supports both means and proportions. For proportions (like survey results or pass/fail rates), enter the number of successes and total sample size. The formula is: CI = p̂ ± z × √(p̂(1−p̂)/n), where p̂ = successes/n. This uses the Wald method, which is accurate for large samples (np̂ ≥ 5 and n(1−p̂) ≥ 5). For small samples, the Wilson score interval or Clopper-Pearson (exact) method is more reliable.",
  },
];

/* ─── Types ─────────────────────────────────────── */

type CalcType = "mean" | "proportion";
type ConfLevel = 90 | 95 | 99;

/* ─── Constants ─────────────────────────────────── */

const Z_SCORES: Record<ConfLevel, number> = {
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

// T-distribution critical values for common small sample sizes (two-tailed)
const T_TABLE: Record<number, Record<ConfLevel, number>> = {
  2: { 90: 2.920, 95: 4.303, 99: 9.925 },
  3: { 90: 2.353, 95: 3.182, 99: 5.841 },
  4: { 90: 2.132, 95: 2.776, 99: 4.604 },
  5: { 90: 2.015, 95: 2.571, 99: 4.032 },
  6: { 90: 1.943, 95: 2.447, 99: 3.707 },
  7: { 90: 1.895, 95: 2.365, 99: 3.499 },
  8: { 90: 1.860, 95: 2.306, 99: 3.355 },
  9: { 90: 1.833, 95: 2.262, 99: 3.250 },
  10: { 90: 1.812, 95: 2.228, 99: 3.169 },
  15: { 90: 1.761, 95: 2.145, 99: 2.977 },
  20: { 90: 1.729, 95: 2.093, 99: 2.861 },
  25: { 90: 1.711, 95: 2.064, 99: 2.797 },
  30: { 90: 1.699, 95: 2.045, 99: 2.756 },
  40: { 90: 1.684, 95: 2.021, 99: 2.704 },
  50: { 90: 1.676, 95: 2.009, 99: 2.678 },
  60: { 90: 1.671, 95: 2.000, 99: 2.660 },
  80: { 90: 1.664, 95: 1.990, 99: 2.639 },
  100: { 90: 1.660, 95: 1.984, 99: 2.626 },
  120: { 90: 1.658, 95: 1.980, 99: 2.617 },
};

function getTValue(df: number, confLevel: ConfLevel): number {
  if (df >= 120) return Z_SCORES[confLevel];
  const keys = Object.keys(T_TABLE).map(Number).sort((a, b) => a - b);
  // Find closest df in the table
  let closest = keys[0];
  for (const k of keys) {
    if (k <= df) closest = k;
    else break;
  }
  return T_TABLE[closest]?.[confLevel] ?? Z_SCORES[confLevel];
}

/* ─── Component ────────────────────────────────── */

export default function ConfidenceIntervalCalculator() {
  const [calcType, setCalcType] = useState<CalcType>("mean");
  const [confLevel, setConfLevel] = useState<ConfLevel>(95);

  /* Mean inputs */
  const [sampleMean, setSampleMean] = useState("50");
  const [sampleSize, setSampleSize] = useState("100");
  const [stdDev, setStdDev] = useState("10");
  const [usePopStdDev, setUsePopStdDev] = useState(true);

  /* Proportion inputs */
  const [successes, setSuccesses] = useState("60");
  const [totalTrials, setTotalTrials] = useState("100");

  const results = useMemo(() => {
    if (calcType === "mean") {
      const x̄ = parseFloat(sampleMean);
      const n = parseInt(sampleSize);
      const σ = parseFloat(stdDev);
      if (isNaN(x̄) || isNaN(n) || isNaN(σ) || n <= 1 || σ <= 0) return null;

      const criticalValue = usePopStdDev || n >= 30
        ? Z_SCORES[confLevel]
        : getTValue(n - 1, confLevel);
      const standardError = σ / Math.sqrt(n);
      const marginOfError = criticalValue * standardError;
      const lowerBound = x̄ - marginOfError;
      const upperBound = x̄ + marginOfError;
      const distribution = usePopStdDev || n >= 30 ? "z" : "t";

      return {
        type: "mean" as const,
        sampleMean: x̄,
        sampleSize: n,
        stdDev: σ,
        criticalValue,
        standardError,
        marginOfError,
        lowerBound,
        upperBound,
        confLevel,
        distribution,
        df: n - 1,
      };
    }

    if (calcType === "proportion") {
      const x = parseInt(successes);
      const n = parseInt(totalTrials);
      if (isNaN(x) || isNaN(n) || n <= 0 || x < 0 || x > n) return null;

      const p̂ = x / n;
      const z = Z_SCORES[confLevel];
      const standardError = Math.sqrt((p̂ * (1 - p̂)) / n);
      const marginOfError = z * standardError;
      const lowerBound = Math.max(0, p̂ - marginOfError);
      const upperBound = Math.min(1, p̂ + marginOfError);
      const isValidWald = n * p̂ >= 5 && n * (1 - p̂) >= 5;

      return {
        type: "proportion" as const,
        proportion: p̂,
        successes: x,
        sampleSize: n,
        criticalValue: z,
        standardError,
        marginOfError,
        lowerBound,
        upperBound,
        confLevel,
        distribution: "z" as const,
        isValidWald,
      };
    }

    return null;
  }, [calcType, confLevel, sampleMean, sampleSize, stdDev, usePopStdDev, successes, totalTrials]);

  return (
    <ToolLayout
      title="Confidence Interval Calculator"
      description="Calculate confidence intervals for population means and proportions. Enter your sample data and choose a confidence level (90%, 95%, or 99%) to get the confidence interval, margin of error, and critical values with step-by-step explanations."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Select calculation type", text: "Choose between calculating a confidence interval for a mean (continuous data) or a proportion (success/failure data)." },
        { name: "Enter sample data", text: "For means: enter the sample mean, sample size, and standard deviation. For proportions: enter the number of successes and total trials." },
        { name: "Choose confidence level", text: "Select 90%, 95%, or 99% confidence level. The 95% level is standard for most research applications." },
        { name: "Interpret results", text: "Review the confidence interval, margin of error, and step-by-step formula breakdown. The interval shows the range likely to contain the true population value." },
      ]}
      relatedTools={[
        { name: "Standard Deviation Calculator", href: "/standard-deviation-calculator" },
        { name: "Probability Calculator", href: "/probability-calculator" },
        { name: "Average Calculator", href: "/average-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Grade Calculator", href: "/grade-calculator" },
      ]}
      content={
        <>
          <h2>What Is a Confidence Interval?</h2>
          <p>
            A <strong>confidence interval (CI)</strong> is a range of values, derived from sample data, that is likely to contain the true value of an unknown population parameter. It provides a measure of uncertainty around a sample estimate. Instead of saying &ldquo;the average is 50,&rdquo; a confidence interval says &ldquo;we are 95% confident the true average lies between 47.2 and 52.8.&rdquo; This concept was formalized by Jerzy Neyman in 1937 and is foundational to inferential statistics.
          </p>

          <h2>How Are Confidence Intervals Calculated?</h2>
          <h3>For a Population Mean</h3>
          <p><strong>CI = x̄ ± z × (σ / √n)</strong></p>
          <ul>
            <li><strong>x̄</strong> = sample mean</li>
            <li><strong>z</strong> = critical value (1.96 for 95% confidence)</li>
            <li><strong>σ</strong> = standard deviation (population or sample)</li>
            <li><strong>n</strong> = sample size</li>
          </ul>

          <h3>For a Population Proportion</h3>
          <p><strong>CI = p̂ ± z × √(p̂(1 − p̂) / n)</strong></p>
          <ul>
            <li><strong>p̂</strong> = sample proportion (successes / total)</li>
            <li><strong>z</strong> = critical value</li>
            <li><strong>n</strong> = sample size</li>
          </ul>

          <h3>Worked Example</h3>
          <p>A professor tests <strong>n = 36</strong> students and finds a mean score of <strong>x̄ = 78</strong> with a population standard deviation of <strong>σ = 12</strong>. At 95% confidence (z = 1.96):</p>
          <ul>
            <li>Standard Error: SE = 12 / √36 = 12 / 6 = <strong>2.0</strong></li>
            <li>Margin of Error: ME = 1.96 × 2.0 = <strong>3.92</strong></li>
            <li>95% CI: 78 ± 3.92 = <strong>[74.08, 81.92]</strong></li>
          </ul>
          <p>Interpretation: We are 95% confident the true population mean score lies between 74.08 and 81.92.</p>

          <h2>Understanding Your Results</h2>
          <p>The <strong>margin of error</strong> tells you the precision of your estimate — a smaller margin means more precision. It depends on three factors:</p>
          <ul>
            <li><strong>Confidence level:</strong> Higher confidence → wider interval → larger margin of error.</li>
            <li><strong>Sample size (n):</strong> Larger sample → narrower interval → smaller margin of error. The relationship follows √n, so quadrupling n halves the margin.</li>
            <li><strong>Variability (σ):</strong> More variability in the data → wider interval.</li>
          </ul>

          <h2>z-Distribution vs. t-Distribution</h2>
          <p>
            When the population standard deviation (σ) is <strong>known</strong> or the sample size is large (n ≥ 30), the z-distribution (standard normal) is used. When σ is <strong>unknown</strong> and n is small ({'<'} 30), the t-distribution is used instead. The t-distribution has heavier tails, producing wider intervals that account for the additional uncertainty of estimating σ from the sample. As degrees of freedom (df = n − 1) increase, the t-distribution approaches the z-distribution.
          </p>

          <h3>Critical Values Reference Table</h3>
          <table>
            <thead>
              <tr><th>Confidence Level</th><th>z-Score</th><th>Significance (α)</th><th>Tail Area</th></tr>
            </thead>
            <tbody>
              <tr><td>90%</td><td>1.645</td><td>0.10</td><td>0.05 each tail</td></tr>
              <tr><td>95%</td><td>1.960</td><td>0.05</td><td>0.025 each tail</td></tr>
              <tr><td>99%</td><td>2.576</td><td>0.01</td><td>0.005 each tail</td></tr>
            </tbody>
          </table>

          <h2>Common Misconceptions</h2>
          <ul>
            <li><strong>Wrong:</strong> &ldquo;There is a 95% probability that the true mean is in this interval.&rdquo; The true mean is either in the interval or it isn&apos;t — it&apos;s not random.</li>
            <li><strong>Correct:</strong> &ldquo;If we repeated this procedure many times, 95% of the resulting intervals would contain the true mean.&rdquo;</li>
            <li><strong>Wrong:</strong> &ldquo;A wider interval is better because it&apos;s more likely to contain the true value.&rdquo; Width is a trade-off with precision — a CI of [0, infinity] is always &ldquo;correct&rdquo; but useless.</li>
          </ul>

          <h2>Real-World Applications</h2>
          <ul>
            <li><strong>Political polling:</strong> &ldquo;Candidate A leads with 52% ± 3% at 95% confidence.&rdquo; The true support could be 49–55%.</li>
            <li><strong>Medical trials:</strong> &ldquo;The drug reduced symptoms by 15% ± 4%.&rdquo; If the CI includes 0%, the result is not statistically significant.</li>
            <li><strong>Quality control:</strong> &ldquo;Average weight of cereal boxes: 500g ± 2g.&rdquo; Ensures manufacturing stays within spec.</li>
            <li><strong>A/B testing:</strong> &ldquo;Version B increased conversion by 3.2% [95% CI: 1.1%, 5.3%].&rdquo; Since the CI doesn&apos;t include 0, the improvement is significant.</li>
          </ul>

          <h2>Sources and References</h2>
          <ul>
            <li>Neyman, J. (1937). &ldquo;Outline of a theory of statistical estimation based on the classical theory of probability.&rdquo; <em>Philosophical Transactions of the Royal Society A</em>, 236(767), 333–380.</li>
            <li>Moore, D.S., McCabe, G.P., &amp; Craig, B.A. (2017). <em>Introduction to the Practice of Statistics</em> (9th ed.). W.H. Freeman.</li>
            <li>Agresti, A. &amp; Coull, B.A. (1998). &ldquo;Approximate is better than &lsquo;exact&rsquo; for interval estimation of binomial proportions.&rdquo; <em>The American Statistician</em>, 52(2), 119–126.</li>
            <li>Student [Gosset, W.S.] (1908). &ldquo;The probable error of a mean.&rdquo; <em>Biometrika</em>, 6(1), 1–25.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Calc type toggle */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Calculation Type</label>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button onClick={() => setCalcType("mean")} className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${calcType === "mean" ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              Population Mean
            </button>
            <button onClick={() => setCalcType("proportion")} className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${calcType === "proportion" ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              Proportion
            </button>
          </div>
        </div>

        {/* Confidence level */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Confidence Level
          </label>
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {([90, 95, 99] as ConfLevel[]).map((level) => (
              <button key={level} onClick={() => setConfLevel(level)} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${confLevel === level ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {level}%
              </button>
            ))}
          </div>
        </div>

        {/* Mean inputs */}
        {calcType === "mean" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Sample Mean (x̄)</label>
              <input type="number" inputMode="decimal" value={sampleMean} onChange={(e) => setSampleMean(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Sample Size (n)</label>
                <input type="number" inputMode="numeric" value={sampleSize} onChange={(e) => setSampleSize(e.target.value)} min="2" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Standard Deviation (σ)</label>
                <input type="number" inputMode="decimal" value={stdDev} onChange={(e) => setStdDev(e.target.value)} min="0" step="0.01" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={usePopStdDev} onChange={(e) => setUsePopStdDev(e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
                Population σ known (z-distribution)
              </label>
            </div>
          </div>
        )}

        {/* Proportion inputs */}
        {calcType === "proportion" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Number of Successes (x)</label>
              <input type="number" inputMode="numeric" value={successes} onChange={(e) => setSuccesses(e.target.value)} min="0" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Total Trials (n)</label>
              <input type="number" inputMode="numeric" value={totalTrials} onChange={(e) => setTotalTrials(e.target.value)} min="1" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Primary result: CI */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground text-center mb-1">{results.confLevel}% Confidence Interval</p>
              <p className="text-3xl sm:text-4xl font-bold text-foreground text-center">
                [{results.type === "proportion" ? (results.lowerBound * 100).toFixed(2) + "%" : results.lowerBound.toFixed(4)},{" "}
                {results.type === "proportion" ? (results.upperBound * 100).toFixed(2) + "%" : results.upperBound.toFixed(4)}]
              </p>
              {results.type === "mean" && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {results.sampleMean.toFixed(4)} ± {results.marginOfError.toFixed(4)}
                </p>
              )}
              {results.type === "proportion" && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {(results.proportion * 100).toFixed(2)}% ± {(results.marginOfError * 100).toFixed(2)}%
                </p>
              )}
            </div>

            {/* CI visual bar */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <p className="text-xs text-muted-foreground mb-3 text-center uppercase tracking-wide">Visual Representation</p>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                {(() => {
                  const center = results.type === "proportion" ? results.proportion : results.sampleMean;
                  const half = results.marginOfError;
                  const rangeWidth = half * 4;
                  const start = center - half * 2;
                  const ciLeft = ((results.lowerBound - start) / rangeWidth) * 100;
                  const ciRight = ((results.upperBound - start) / rangeWidth) * 100;
                  const centerPos = ((center - start) / rangeWidth) * 100;
                  return (
                    <>
                      <div className="absolute h-full bg-primary/20 rounded-full" style={{ left: `${Math.max(0, ciLeft)}%`, width: `${Math.min(100, ciRight) - Math.max(0, ciLeft)}%` }} />
                      <div className="absolute top-0 h-full w-0.5 bg-primary" style={{ left: `${centerPos}%` }} />
                    </>
                  );
                })()}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{results.type === "proportion" ? (results.lowerBound * 100).toFixed(2) + "%" : results.lowerBound.toFixed(2)}</span>
                <span className="text-xs font-medium text-primary">{results.type === "proportion" ? (results.proportion * 100).toFixed(2) + "%" : results.sampleMean.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">{results.type === "proportion" ? (results.upperBound * 100).toFixed(2) + "%" : results.upperBound.toFixed(2)}</span>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Margin of Error</p>
                <p className="text-xl font-bold text-foreground">
                  ±{results.type === "proportion" ? (results.marginOfError * 100).toFixed(4) + "%" : results.marginOfError.toFixed(4)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Standard Error</p>
                <p className="text-xl font-bold text-foreground">{results.standardError.toFixed(4)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Critical Value ({results.distribution})</p>
                <p className="text-xl font-bold text-foreground">{results.criticalValue.toFixed(3)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Distribution</p>
                <p className="text-xl font-bold text-foreground">
                  {results.distribution === "z" ? "z (Normal)" : `t (df=${results.type === "mean" ? results.df : "—"})`}
                </p>
              </div>
            </div>

            {/* Step-by-step */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Step-by-Step Solution
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground font-mono">
                {results.type === "mean" ? (
                  <>
                    <p>1. SE = σ / √n = {results.stdDev} / √{results.sampleSize} = <strong>{results.standardError.toFixed(4)}</strong></p>
                    <p>2. {results.distribution}-score for {results.confLevel}% = <strong>{results.criticalValue.toFixed(3)}</strong></p>
                    <p>3. ME = {results.criticalValue.toFixed(3)} × {results.standardError.toFixed(4)} = <strong>{results.marginOfError.toFixed(4)}</strong></p>
                    <p>4. CI = {results.sampleMean} ± {results.marginOfError.toFixed(4)}</p>
                    <p className="font-bold text-foreground">   = [{results.lowerBound.toFixed(4)}, {results.upperBound.toFixed(4)}]</p>
                  </>
                ) : (
                  <>
                    <p>1. p̂ = {results.successes} / {results.sampleSize} = <strong>{results.proportion.toFixed(4)}</strong></p>
                    <p>2. SE = √(p̂(1−p̂) / n) = √({results.proportion.toFixed(4)} × {(1 - results.proportion).toFixed(4)} / {results.sampleSize}) = <strong>{results.standardError.toFixed(4)}</strong></p>
                    <p>3. z-score for {results.confLevel}% = <strong>{results.criticalValue.toFixed(3)}</strong></p>
                    <p>4. ME = {results.criticalValue.toFixed(3)} × {results.standardError.toFixed(4)} = <strong>{results.marginOfError.toFixed(4)}</strong></p>
                    <p>5. CI = {results.proportion.toFixed(4)} ± {results.marginOfError.toFixed(4)}</p>
                    <p className="font-bold text-foreground">   = [{results.lowerBound.toFixed(4)}, {results.upperBound.toFixed(4)}]</p>
                  </>
                )}
              </div>
            </div>

            {/* Warnings */}
            {results.type === "proportion" && !results.isValidWald && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4 flex gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Warning:</strong> np̂ or n(1−p̂) is less than 5. The Wald interval may not be reliable for small samples or extreme proportions. Consider using the Wilson score interval instead.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty */}
        {!results && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter valid sample data above to calculate the confidence interval</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
