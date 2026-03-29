"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

interface StatisticsResult {
  mean: number;
  median: number;
  mode: number[] | null;
  range: number;
  min: number;
  max: number;
  sum: number;
  count: number;
  sortedData: number[];
}

export default function AverageCalculator() {
  const [input, setInput] = useState("");

  const result = useMemo<StatisticsResult | null>(() => {
    // Parse input - support comma, space, or newline separated values
    const numbers = input
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));

    if (numbers.length === 0) {
      return null;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const count = numbers.length;
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const mean = sum / count;

    // Median
    let median: number;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const frequency: Record<number, number> = {};
    let maxFreq = 0;
    for (const n of numbers) {
      frequency[n] = (frequency[n] || 0) + 1;
      maxFreq = Math.max(maxFreq, frequency[n]);
    }

    let mode: number[] | null = null;
    if (maxFreq > 1) {
      mode = Object.entries(frequency)
        .filter(([, freq]) => freq === maxFreq)
        .map(([val]) => parseFloat(val));
    }

    return {
      mean,
      median,
      mode,
      range: sorted[count - 1] - sorted[0],
      min: sorted[0],
      max: sorted[count - 1],
      sum,
      count,
      sortedData: sorted,
    };
  }, [input]);

  const reset = () => {
    setInput("");
  };

  const formatNumber = (n: number) => {
    return Number.isInteger(n) ? n.toString() : n.toFixed(4);
  };

  return (
    <ToolLayout
      title="Average Calculator"
      description="Calculate the mean, median, mode, and range of any set of numbers. Perfect for statistics homework, data analysis, and quick calculations."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Standard Deviation Calculator", href: "/standard-deviation-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Scientific Calculator", href: "/scientific-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Averages and Central Tendency</h2>
          <p>
            Central tendency refers to the middle or typical value of a data set. There are three main 
            measures of central tendency: mean, median, and mode. Each has its own use cases and advantages.
          </p>

          <h2>Mean (Arithmetic Average)</h2>
          <p>
            The mean is the sum of all values divided by the number of values. It&apos;s the most commonly 
            used measure of average.
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            Mean = (x₁ + x₂ + ... + xₙ) / n
          </p>
          <p>
            <strong>Best used when:</strong> Data is evenly distributed without extreme outliers.
          </p>

          <h2>Median</h2>
          <p>
            The median is the middle value when data is arranged in order. For an even number of values, 
            it&apos;s the average of the two middle values.
          </p>
          <p>
            <strong>Best used when:</strong> Data has outliers or is skewed. Median is more robust to 
            extreme values than mean.
          </p>

          <h2>Mode</h2>
          <p>
            The mode is the value that appears most frequently in a data set. A data set can have one 
            mode (unimodal), multiple modes (multimodal), or no mode (if all values appear equally).
          </p>
          <p>
            <strong>Best used when:</strong> Finding the most common value, especially in categorical data.
          </p>

          <h2>Range</h2>
          <p>
            The range is the difference between the maximum and minimum values. It provides a simple 
            measure of spread or variability.
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            Range = Maximum − Minimum
          </p>

          <h2>When to Use Each Measure</h2>
          <ul>
            <li><strong>Mean:</strong> Test scores, heights, temperatures (symmetric data)</li>
            <li><strong>Median:</strong> Income, house prices, ages (skewed data)</li>
            <li><strong>Mode:</strong> Favorite colors, shoe sizes, survey responses (categorical data)</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground dark:text-zinc-300 mb-2">
            Enter Numbers
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 10, 20, 30, 40, 50"
            className="w-full h-32 rounded-lg border border-border bg-white dark:bg-muted px-4 py-3 text-foreground placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:text-foreground dark:placeholder-zinc-500"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Separate values with commas, spaces, or enter one per line
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
              <ResultCard label="Mean (Average)" value={formatNumber(result.mean)} highlight />
              <ResultCard label="Median" value={formatNumber(result.median)} />
            </ResultsGrid>

            <ResultsGrid columns={2}>
              <ResultCard
                label="Mode"
                value={result.mode ? result.mode.map(formatNumber).join(", ") : "No mode"}
                subValue={result.mode ? `Appears most frequently` : "All values appear equally"}
              />
              <ResultCard label="Range" value={formatNumber(result.range)} />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">Additional Statistics</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-lg font-semibold text-foreground">{result.count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sum</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.sum)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Minimum</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.min)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maximum</p>
                  <p className="text-lg font-semibold text-foreground">{formatNumber(result.max)}</p>
                </div>
              </div>
            </div>

            {/* Sorted Data */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Sorted Data (ascending)</p>
              <p className="text-sm text-muted-foreground font-mono break-all">
                {result.sortedData.map(formatNumber).join(", ")}
              </p>
            </div>

            {/* Visual representation for small datasets */}
            {result.count <= 20 && (
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground mb-3">Data Visualization</p>
                <div className="flex items-end gap-1 h-24">
                  {result.sortedData.map((val, i) => {
                    const height = ((val - result.min) / (result.max - result.min || 1)) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-primary/70 rounded-t transition-all hover:bg-primary"
                        style={{ height: `${Math.max(10, height)}%` }}
                        title={formatNumber(val)}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Min: {formatNumber(result.min)}</span>
                  <span>Max: {formatNumber(result.max)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
