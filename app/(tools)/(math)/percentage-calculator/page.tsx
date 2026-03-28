"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { RotateCcw } from "lucide-react";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<"whatIs" | "isWhatPercent" | "change">("whatIs");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null);
      return;
    }

    switch (mode) {
      case "whatIs":
        setResult((num1 / 100) * num2);
        break;
      case "isWhatPercent":
        setResult((num1 / num2) * 100);
        break;
      case "change":
        setResult(((num2 - num1) / num1) * 100);
        break;
    }
  };

  const reset = () => {
    setValue1("");
    setValue2("");
    setResult(null);
  };

  const modes = [
    { id: "whatIs" as const, label: "What is X% of Y?" },
    { id: "isWhatPercent" as const, label: "X is what % of Y?" },
    { id: "change" as const, label: "% Change" },
  ];

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate percentages easily. Find what percent a number is of another, calculate percentage increase/decrease, and more."
      category={{ name: "Math Calculators", slug: "math" }}
      relatedTools={[
        { name: "Loan Calculator", href: "/loan-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Percentages</h2>
          <p>
            A percentage is a mathematical way of expressing a number as a fraction of 100. It is widely used in finance, retail, statistics, and daily life to make comparing ratios simple and intuitive. The word &quot;percent&quot; comes from the Latin <em>per centum</em>, meaning &quot;by a hundred.&quot;
          </p>

          <h2>How to Calculate Percentages</h2>
          <p>
            Depending on what you are trying to find, there are three primary formulas you will use:
          </p>
          
          <h3>1. What is X% of Y?</h3>
          <p>
            To find a specific percentage of a whole number, convert the percentage to a decimal (divide by 100) and multiply by the total.
            <br />
            <strong>Formula:</strong> (X / 100) × Y
            <br />
            <strong>Example:</strong> What is 25% of 200? (25 / 100) × 200 = 50.
          </p>

          <h3>2. X is what % of Y?</h3>
          <p>
            To find what percentage one number represents compared to another, divide the part by the whole and multiply by 100.
            <br />
            <strong>Formula:</strong> (X / Y) × 100
            <br />
            <strong>Example:</strong> 50 is what percent of 200? (50 / 200) × 100 = 25%.
          </p>

          <h3>3. Percentage Change (Increase / Decrease)</h3>
          <p>
            To calculate how much a value has changed as a percentage of its original state, subtract the old value from the new value, divide by the old value, and multiply by 100.
            <br />
            <strong>Formula:</strong> ((New Value - Old Value) / Old Value) × 100
            <br />
            <strong>Example:</strong> If a stock goes from $100 to $125, what is the percentage change? ((125 - 100) / 100) × 100 = +25%.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); reset(); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mode === m.id
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-zinc-200 dark:bg-muted dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Input Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "whatIs" && (
            <>
              <Input
                label="Percentage"
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter percentage"
                suffix="%"
              />
              <Input
                label="Of Number"
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter number"
              />
            </>
          )}

          {mode === "isWhatPercent" && (
            <>
              <Input
                label="Number"
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter number"
              />
              <Input
                label="Of Total"
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter total"
              />
            </>
          )}

          {mode === "change" && (
            <>
              <Input
                label="From Value"
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Original value"
              />
              <Input
                label="To Value"
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="New value"
              />
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={calculate} size="lg">
            Calculate
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Results */}
        {result !== null && (
          <ResultsGrid columns={1}>
            <ResultCard
              label={
                mode === "whatIs"
                  ? `${value1}% of ${value2}`
                  : mode === "isWhatPercent"
                  ? `${value1} is what percent of ${value2}`
                  : `Percentage change from ${value1} to ${value2}`
              }
              value={
                mode === "change" && result >= 0
                  ? `+${result.toFixed(2)}`
                  : result.toFixed(2)
              }
              unit={mode !== "whatIs" ? "%" : undefined}
              highlight
            />
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
