"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type CalculationType = "solve" | "simplify" | "scale";

interface RatioResult {
  type: CalculationType;
  result: string;
  explanation: string;
  a?: number;
  b?: number;
  c?: number;
  d?: number;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export default function RatioCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>("solve");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");

  const result = useMemo<RatioResult | null>(() => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    const numD = parseFloat(d);

    if (calcType === "simplify") {
      if (isNaN(numA) || isNaN(numB) || numB === 0) return null;
      
      const divisor = gcd(numA, numB);
      const simplifiedA = numA / divisor;
      const simplifiedB = numB / divisor;
      
      return {
        type: "simplify",
        result: `${simplifiedA} : ${simplifiedB}`,
        explanation: `${numA} : ${numB} divided by GCD (${divisor}) = ${simplifiedA} : ${simplifiedB}`,
        a: simplifiedA,
        b: simplifiedB,
      };
    }

    if (calcType === "scale") {
      if (isNaN(numA) || isNaN(numB) || isNaN(numC) || numB === 0) return null;
      
      const scaleFactor = numC / numA;
      const scaledB = numB * scaleFactor;
      
      return {
        type: "scale",
        result: `${numC} : ${scaledB.toFixed(4)}`,
        explanation: `Scale factor = ${numC} ÷ ${numA} = ${scaleFactor.toFixed(4)}, New B = ${numB} × ${scaleFactor.toFixed(4)} = ${scaledB.toFixed(4)}`,
        a: numC,
        b: scaledB,
      };
    }

    // Solve proportion A:B = C:D (find missing value)
    if (isNaN(numA) && !isNaN(numB) && !isNaN(numC) && !isNaN(numD)) {
      // Find A: A/B = C/D, so A = B × C / D
      if (numD === 0) return null;
      const answer = (numB * numC) / numD;
      return {
        type: "solve",
        result: answer.toFixed(4),
        explanation: `A = B × C ÷ D = ${numB} × ${numC} ÷ ${numD} = ${answer.toFixed(4)}`,
        a: answer,
        b: numB,
        c: numC,
        d: numD,
      };
    }

    if (!isNaN(numA) && isNaN(numB) && !isNaN(numC) && !isNaN(numD)) {
      // Find B: A/B = C/D, so B = A × D / C
      if (numC === 0) return null;
      const answer = (numA * numD) / numC;
      return {
        type: "solve",
        result: answer.toFixed(4),
        explanation: `B = A × D ÷ C = ${numA} × ${numD} ÷ ${numC} = ${answer.toFixed(4)}`,
        a: numA,
        b: answer,
        c: numC,
        d: numD,
      };
    }

    if (!isNaN(numA) && !isNaN(numB) && isNaN(numC) && !isNaN(numD)) {
      // Find C: A/B = C/D, so C = A × D / B
      if (numB === 0) return null;
      const answer = (numA * numD) / numB;
      return {
        type: "solve",
        result: answer.toFixed(4),
        explanation: `C = A × D ÷ B = ${numA} × ${numD} ÷ ${numB} = ${answer.toFixed(4)}`,
        a: numA,
        b: numB,
        c: answer,
        d: numD,
      };
    }

    if (!isNaN(numA) && !isNaN(numB) && !isNaN(numC) && isNaN(numD)) {
      // Find D: A/B = C/D, so D = B × C / A
      if (numA === 0) return null;
      const answer = (numB * numC) / numA;
      return {
        type: "solve",
        result: answer.toFixed(4),
        explanation: `D = B × C ÷ A = ${numB} × ${numC} ÷ ${numA} = ${answer.toFixed(4)}`,
        a: numA,
        b: numB,
        c: numC,
        d: answer,
      };
    }

    return null;
  }, [calcType, a, b, c, d]);

  const reset = () => {
    setA("");
    setB("");
    setC("");
    setD("");
  };

  return (
    <ToolLayout
      title="Ratio Calculator"
      description="Solve ratio and proportion problems easily. Find missing values, simplify ratios, and scale proportionally for cooking, DIY projects, and math homework."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Fraction Calculator", href: "/fraction-calculator" },
        { name: "Scientific Calculator", href: "/scientific-calculator" },
      ]}
      content={
        <>
          <h2>What is a Ratio?</h2>
          <p>
            A ratio is a comparison between two or more quantities. It shows how many times one value 
            contains another. Ratios are written as A:B or A/B and can be used to compare sizes, amounts, 
            or other measurable quantities.
          </p>

          <h2>What is a Proportion?</h2>
          <p>
            A proportion is an equation stating that two ratios are equal. If A:B = C:D, then A×D = B×C 
            (cross multiplication). This property is used to solve for unknown values.
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            A : B = C : D → A × D = B × C
          </p>

          <h2>How to Simplify Ratios</h2>
          <p>
            To simplify a ratio, divide both parts by their Greatest Common Divisor (GCD). For example:
          </p>
          <ul>
            <li>12 : 18 → GCD is 6 → 2 : 3</li>
            <li>24 : 36 → GCD is 12 → 2 : 3</li>
            <li>100 : 25 → GCD is 25 → 4 : 1</li>
          </ul>

          <h2>How to Solve Proportions</h2>
          <p>
            When you have three of four values in a proportion A:B = C:D, you can find the missing value:
          </p>
          <ul>
            <li><strong>Missing A:</strong> A = (B × C) ÷ D</li>
            <li><strong>Missing B:</strong> B = (A × D) ÷ C</li>
            <li><strong>Missing C:</strong> C = (A × D) ÷ B</li>
            <li><strong>Missing D:</strong> D = (B × C) ÷ A</li>
          </ul>

          <h2>Common Uses of Ratios</h2>
          <ul>
            <li><strong>Cooking:</strong> Scaling recipes up or down</li>
            <li><strong>Maps:</strong> Converting between map scale and real distances</li>
            <li><strong>Mixing:</strong> Paint colors, concrete, drinks</li>
            <li><strong>Finance:</strong> Price-to-earnings ratio, debt ratios</li>
            <li><strong>Photography:</strong> Aspect ratios (16:9, 4:3)</li>
          </ul>

          <h2>Golden Ratio</h2>
          <p>
            The golden ratio (φ ≈ 1.618) is a special ratio found in nature, art, and architecture. 
            A rectangle with sides in the golden ratio is considered aesthetically pleasing.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <Select
          label="Calculation Type"
          id="calcType"
          value={calcType}
          onChange={(e) => {
            setCalcType(e.target.value as CalculationType);
            reset();
          }}
          options={[
            { value: "solve", label: "Solve Proportion (A:B = C:D)" },
            { value: "simplify", label: "Simplify Ratio (A:B)" },
            { value: "scale", label: "Scale Ratio (A:B scaled to C:?)" },
          ]}
        />

        {calcType === "solve" && (
          <>
            <p className="text-sm text-muted-foreground">
              Enter any three values to find the fourth. Leave one field empty.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                label="A"
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="A"
                className="w-24"
              />
              <span className="text-2xl font-bold text-muted-foreground mt-6">:</span>
              <Input
                label="B"
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="B"
                className="w-24"
              />
              <span className="text-2xl font-bold text-muted-foreground mt-6">=</span>
              <Input
                label="C"
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                placeholder="C"
                className="w-24"
              />
              <span className="text-2xl font-bold text-muted-foreground mt-6">:</span>
              <Input
                label="D"
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                placeholder="D"
                className="w-24"
              />
            </div>
          </>
        )}

        {calcType === "simplify" && (
          <div className="flex items-center gap-2">
            <Input
              label="A"
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="First number"
            />
            <span className="text-2xl font-bold text-muted-foreground mt-6">:</span>
            <Input
              label="B"
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="Second number"
            />
          </div>
        )}

        {calcType === "scale" && (
          <>
            <p className="text-sm text-muted-foreground">
              Scale the ratio A:B to a new first value C
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                label="Original A"
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="A"
              />
              <span className="text-2xl font-bold text-muted-foreground mt-6">:</span>
              <Input
                label="Original B"
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="B"
              />
              <span className="text-xl text-muted-foreground mt-6">→</span>
              <Input
                label="New A"
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                placeholder="New value"
              />
              <span className="text-2xl font-bold text-muted-foreground mt-6">:</span>
              <span className="text-xl text-muted-foreground mt-6">?</span>
            </div>
          </>
        )}

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {calcType === "simplify" ? "Simplified Ratio" : calcType === "scale" ? "Scaled Ratio" : "Missing Value"}
              </p>
              <p className="text-4xl font-bold text-primary">
                {result.result}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Solution</p>
              <p className="text-sm text-muted-foreground">{result.explanation}</p>
            </div>

            {result.type === "solve" && result.a && result.b && result.c && result.d && (
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground mb-2">Verification (Cross Multiplication)</p>
                <p className="text-sm text-muted-foreground">
                  A × D = {(result.a * result.d).toFixed(4)}
                </p>
                <p className="text-sm text-muted-foreground">
                  B × C = {(result.b * result.c).toFixed(4)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ Both products are equal, confirming the proportion is correct
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
