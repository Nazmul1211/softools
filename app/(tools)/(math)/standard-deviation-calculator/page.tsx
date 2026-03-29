"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type DataType = "population" | "sample";

interface StatisticsResult {
  mean: number;
  variance: number;
  stdDev: number;
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  sumOfSquares: number;
  coefficientOfVariation: number;
}

export default function StandardDeviationCalculator() {
  const [input, setInput] = useState("");
  const [dataType, setDataType] = useState<DataType>("sample");

  const result = useMemo<StatisticsResult | null>(() => {
    // Parse input
    const numbers = input
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));

    if (numbers.length < 2) {
      return null;
    }

    const n = numbers.length;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Calculate sum of squared differences from mean
    const sumOfSquaredDiffs = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);

    // Population vs Sample variance
    // Population: divide by n
    // Sample: divide by (n-1) - Bessel's correction
    const variance = dataType === "population" 
      ? sumOfSquaredDiffs / n 
      : sumOfSquaredDiffs / (n - 1);

    const stdDev = Math.sqrt(variance);

    const sorted = [...numbers].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];

    // Sum of squares (Σx²)
    const sumOfSquares = numbers.reduce((acc, val) => acc + val * val, 0);

    // Coefficient of variation (CV)
    const coefficientOfVariation = (stdDev / mean) * 100;

    return {
      mean,
      variance,
      stdDev,
      count: n,
      sum,
      min,
      max,
      range: max - min,
      sumOfSquares,
      coefficientOfVariation,
    };
  }, [input, dataType]);

  const reset = () => {
    setInput("");
  };

  const formatNumber = (n: number, decimals = 6) => {
    if (Number.isInteger(n)) return n.toString();
    return n.toFixed(decimals);
  };

  return (
    <ToolLayout
      title="Standard Deviation Calculator"
      description="Calculate standard deviation, variance, mean, and other statistical measures for both population and sample data sets. Perfect for statistics homework and data analysis."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Average Calculator", href: "/average-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Scientific Calculator", href: "/scientific-calculator" },
      ]}
      content={
        <>
          <h2>What is Standard Deviation?</h2>
          <p>
            Standard deviation (σ or s) is a measure of how spread out numbers are from the mean. 
            A low standard deviation indicates that values tend to be close to the mean, while a 
            high standard deviation indicates that values are spread out over a wider range.
          </p>

          <h2>Population vs Sample</h2>
          <p>
            There are two types of standard deviation depending on your data:
          </p>
          <ul>
            <li>
              <strong>Population (σ):</strong> Use when you have data for the entire population. 
              Divide by N (total count).
            </li>
            <li>
              <strong>Sample (s):</strong> Use when you have a sample from a larger population. 
              Divide by (N-1) to correct for bias (Bessel&apos;s correction).
            </li>
          </ul>

          <h2>Formulas</h2>
          <h3>Population Standard Deviation (σ)</h3>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            σ = √[Σ(xᵢ - μ)² / N]
          </p>

          <h3>Sample Standard Deviation (s)</h3>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            s = √[Σ(xᵢ - x̄)² / (n-1)]
          </p>

          <h2>Variance</h2>
          <p>
            Variance is the square of standard deviation. It represents the average of squared 
            deviations from the mean. While mathematically useful, standard deviation is easier 
            to interpret because it&apos;s in the same units as the original data.
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            Variance = (Standard Deviation)²
          </p>

          <h2>Coefficient of Variation (CV)</h2>
          <p>
            The coefficient of variation is the ratio of standard deviation to mean, expressed 
            as a percentage. It allows comparison of variability between datasets with different 
            units or scales.
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            CV = (σ / μ) × 100%
          </p>

          <h2>Interpreting Standard Deviation</h2>
          <p>
            For normally distributed data (bell curve):
          </p>
          <ul>
            <li>~68% of values fall within 1 standard deviation of the mean</li>
            <li>~95% of values fall within 2 standard deviations</li>
            <li>~99.7% of values fall within 3 standard deviations</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <Select
          label="Data Type"
          id="dataType"
          value={dataType}
          onChange={(e) => setDataType(e.target.value as DataType)}
          options={[
            { value: "sample", label: "Sample (s) - Use n-1 for small datasets" },
            { value: "population", label: "Population (σ) - Use n for complete data" },
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-foreground dark:text-zinc-300 mb-2">
            Enter Data Values
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 10, 20, 30, 40, 50"
            className="w-full h-32 rounded-lg border border-border bg-white dark:bg-muted px-4 py-3 text-foreground placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:text-foreground dark:placeholder-zinc-500"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Enter at least 2 values. Separate with commas, spaces, or new lines.
          </p>
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <ResultsGrid columns={2}>
              <ResultCard
                label={`Standard Deviation (${dataType === "sample" ? "s" : "σ"})`}
                value={formatNumber(result.stdDev)}
                highlight
              />
              <ResultCard
                label={`Variance (${dataType === "sample" ? "s²" : "σ²"})`}
                value={formatNumber(result.variance)}
              />
            </ResultsGrid>

            <ResultsGrid columns={3}>
              <ResultCard label="Mean (x̄)" value={formatNumber(result.mean)} />
              <ResultCard label="Count (n)" value={result.count.toString()} />
              <ResultCard label="Sum (Σx)" value={formatNumber(result.sum)} />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">Additional Statistics</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Minimum</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.min)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maximum</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.max)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Range</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.range)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sum of Squares (Σx²)</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.sumOfSquares, 2)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Coefficient of Variation (CV)</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(result.coefficientOfVariation, 2)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Relative variability: {result.coefficientOfVariation < 15 ? "Low" : result.coefficientOfVariation < 30 ? "Moderate" : "High"}
              </p>
            </div>

            {/* Normal Distribution Context */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Normal Distribution Ranges</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">68% of data:</span> {formatNumber(result.mean - result.stdDev, 2)} to {formatNumber(result.mean + result.stdDev, 2)}
                </p>
                <p>
                  <span className="font-medium">95% of data:</span> {formatNumber(result.mean - 2 * result.stdDev, 2)} to {formatNumber(result.mean + 2 * result.stdDev, 2)}
                </p>
                <p>
                  <span className="font-medium">99.7% of data:</span> {formatNumber(result.mean - 3 * result.stdDev, 2)} to {formatNumber(result.mean + 3 * result.stdDev, 2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
