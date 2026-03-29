"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type RootType = "2" | "3" | "4" | "5" | "n";

interface RootResult {
  result: number;
  isPerfect: boolean;
  simplified: string | null;
  inverse: number;
}

export default function SquareRootCalculator() {
  const [number, setNumber] = useState("");
  const [rootType, setRootType] = useState<RootType>("2");
  const [customRoot, setCustomRoot] = useState("");

  const result = useMemo<RootResult | null>(() => {
    const num = parseFloat(number);
    let n = rootType === "n" ? parseFloat(customRoot) : parseInt(rootType);

    if (isNaN(num) || isNaN(n) || n <= 0) {
      return null;
    }

    // Handle negative numbers with odd roots
    if (num < 0 && n % 2 === 0) {
      return null; // Even roots of negative numbers are undefined in real numbers
    }

    const absNum = Math.abs(num);
    const rootValue = Math.pow(absNum, 1 / n) * (num < 0 ? -1 : 1);

    // Check if it's a perfect nth root
    const roundedRoot = Math.round(rootValue);
    const isPerfect = Math.abs(Math.pow(roundedRoot, n) - absNum) < 0.0000001;

    // Try to simplify radical (basic simplification for square roots)
    let simplified: string | null = null;
    if (n === 2 && !isPerfect && num > 0) {
      // Find largest perfect square factor
      for (let i = Math.floor(Math.sqrt(num)); i > 1; i--) {
        const square = i * i;
        if (num % square === 0 && num / square !== 1) {
          const outside = i;
          const inside = num / square;
          simplified = `${outside}√${inside}`;
          break;
        }
      }
    }

    return {
      result: rootValue,
      isPerfect,
      simplified,
      inverse: Math.pow(num, n), // num^n
    };
  }, [number, rootType, customRoot]);

  const reset = () => {
    setNumber("");
    setCustomRoot("");
  };

  const getRootSymbol = () => {
    const n = rootType === "n" ? customRoot : rootType;
    if (n === "2") return "√";
    if (n === "3") return "∛";
    return `ⁿ√`;
  };

  return (
    <ToolLayout
      title="Square Root Calculator"
      description="Calculate square roots, cube roots, and any nth root of a number. Find perfect squares, simplify radicals, and learn step-by-step solutions."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Scientific Calculator", href: "/scientific-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Fraction Calculator", href: "/fraction-calculator" },
      ]}
      content={
        <>
          <h2>What is a Square Root?</h2>
          <p>
            A square root of a number x is a value y such that y² = x. For example, √9 = 3 because 3² = 9. 
            The symbol √ is called the radical sign. Every positive number has two square roots: one positive 
            (principal square root) and one negative.
          </p>

          <h2>Types of Roots</h2>
          <ul>
            <li><strong>Square Root (√):</strong> The number that multiplied by itself gives the original number</li>
            <li><strong>Cube Root (∛):</strong> The number that multiplied by itself three times gives the original</li>
            <li><strong>Nth Root:</strong> General case where the result raised to power n equals the original</li>
          </ul>

          <h2>Perfect Squares</h2>
          <p>
            A perfect square is a number whose square root is an integer. The first 15 perfect squares are:
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225
          </p>

          <h2>Perfect Cubes</h2>
          <p>
            A perfect cube is a number whose cube root is an integer. The first 10 perfect cubes are:
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            1, 8, 27, 64, 125, 216, 343, 512, 729, 1000
          </p>

          <h2>Properties of Square Roots</h2>
          <ul>
            <li>√(a × b) = √a × √b</li>
            <li>√(a / b) = √a / √b</li>
            <li>(√a)² = a</li>
            <li>√a² = |a| (absolute value)</li>
          </ul>

          <h2>Simplifying Radicals</h2>
          <p>
            A radical is in simplified form when the number under the radical sign has no perfect square 
            factors (other than 1). For example, √12 = √(4×3) = 2√3.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Number"
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Root Type"
            id="rootType"
            value={rootType}
            onChange={(e) => setRootType(e.target.value as RootType)}
            options={[
              { value: "2", label: "Square Root (√)" },
              { value: "3", label: "Cube Root (∛)" },
              { value: "4", label: "Fourth Root (⁴√)" },
              { value: "5", label: "Fifth Root (⁵√)" },
              { value: "n", label: "Custom nth Root" },
            ]}
          />
          {rootType === "n" && (
            <Input
              label="Root Index (n)"
              type="number"
              value={customRoot}
              onChange={(e) => setCustomRoot(e.target.value)}
              placeholder="Enter n"
            />
          )}
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {rootType === "2" ? "√" : rootType === "3" ? "∛" : `${rootType === "n" ? customRoot : rootType}√`}{number}
              </p>
              <p className="text-4xl font-bold text-primary">
                {result.isPerfect ? result.result : result.result.toFixed(8)}
              </p>
              {result.isPerfect && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Perfect {rootType === "2" ? "Square" : rootType === "3" ? "Cube" : "Power"}
                </span>
              )}
            </div>

            <ResultsGrid columns={2}>
              <ResultCard
                label={`Decimal Result`}
                value={result.result.toFixed(10)}
              />
              <ResultCard
                label="Inverse (x raised to n)"
                value={result.inverse.toLocaleString()}
                subValue={`${number}^${rootType === "n" ? customRoot : rootType}`}
              />
            </ResultsGrid>

            {result.simplified && (
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Simplified Form</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{result.simplified}</p>
              </div>
            )}

            {/* Verification */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Verification</p>
              <p className="text-sm text-muted-foreground">
                ({result.result.toFixed(6)})^{rootType === "n" ? customRoot : rootType} = {Math.pow(result.result, parseInt(rootType === "n" ? customRoot : rootType)).toFixed(6)} ≈ {number}
              </p>
            </div>
          </div>
        )}

        {number && parseFloat(number) < 0 && (rootType === "2" || rootType === "4") && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30 p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Even roots of negative numbers are not defined in the real number system. 
              They exist in the complex number system as imaginary numbers.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
