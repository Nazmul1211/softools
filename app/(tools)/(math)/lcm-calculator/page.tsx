"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  Plus,
  X,
  Hash,
  ListOrdered,
} from "lucide-react";

interface LcmResult {
  lcm: number;
  gcd: number;
  primeFactors: Array<{ number: number; factors: Map<number, number> }>;
  lcmFactors: Map<number, number>;
  multiples: Array<{ number: number; multiples: number[] }>;
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

function lcmTwo(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmMultiple(numbers: number[]): number {
  return numbers.reduce((acc, n) => lcmTwo(acc, n), numbers[0]);
}

function gcdMultiple(numbers: number[]): number {
  return numbers.reduce((acc, n) => gcd(acc, n), numbers[0]);
}

function getPrimeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = Math.abs(n);
  
  // Factor out 2s
  while (num % 2 === 0) {
    factors.set(2, (factors.get(2) || 0) + 1);
    num /= 2;
  }
  
  // Factor out odd numbers
  for (let i = 3; i * i <= num; i += 2) {
    while (num % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1);
      num /= i;
    }
  }
  
  // If remaining number is prime > 2
  if (num > 2) {
    factors.set(num, 1);
  }
  
  return factors;
}

function formatFactors(factors: Map<number, number>): string {
  if (factors.size === 0) return "1";
  
  const parts: string[] = [];
  const sortedPrimes = Array.from(factors.keys()).sort((a, b) => a - b);
  
  for (const prime of sortedPrimes) {
    const power = factors.get(prime)!;
    if (power === 1) {
      parts.push(`${prime}`);
    } else {
      parts.push(`${prime}^${power}`);
    }
  }
  
  return parts.join(" × ");
}

function calculateLcm(numbers: number[]): LcmResult | null {
  const validNumbers = numbers.filter(n => n > 0 && Number.isInteger(n));
  if (validNumbers.length < 2) return null;
  
  // Calculate LCM and GCD
  const lcm = lcmMultiple(validNumbers);
  const gcdVal = gcdMultiple(validNumbers);
  
  // Get prime factors for each number
  const primeFactors = validNumbers.map(n => ({
    number: n,
    factors: getPrimeFactors(n),
  }));
  
  // Calculate LCM prime factorization (max power of each prime)
  const lcmFactors = new Map<number, number>();
  for (const { factors } of primeFactors) {
    for (const [prime, power] of factors) {
      const current = lcmFactors.get(prime) || 0;
      lcmFactors.set(prime, Math.max(current, power));
    }
  }
  
  // Generate first few multiples for visualization
  const maxMultiple = Math.min(lcm, 100);
  const multiples = validNumbers.map(n => ({
    number: n,
    multiples: Array.from({ length: Math.ceil(maxMultiple / n) }, (_, i) => n * (i + 1)),
  }));
  
  return {
    lcm,
    gcd: gcdVal,
    primeFactors,
    lcmFactors,
    multiples,
  };
}

export default function LcmCalculatorPage() {
  const [inputs, setInputs] = useState(["12", "18"]);

  const result = useMemo(() => {
    const numbers = inputs.map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0);
    return calculateLcm(numbers);
  }, [inputs]);

  const addInput = () => {
    if (inputs.length < 6) {
      setInputs([...inputs, ""]);
    }
  };

  const removeInput = (index: number) => {
    if (inputs.length > 2) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const updateInput = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const presets = [
    { label: "12, 18", values: ["12", "18"] },
    { label: "4, 6, 8", values: ["4", "6", "8"] },
    { label: "15, 20, 25", values: ["15", "20", "25"] },
    { label: "7, 11", values: ["7", "11"] },
  ];

  return (
    <ToolLayout
      title="LCM Calculator"
      description="Calculate the Least Common Multiple (LCM) of two or more numbers. See step-by-step solutions using prime factorization and listing methods to understand how LCM is found."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Fraction Calculator", href: "/fraction-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Square Root Calculator", href: "/square-root-calculator/" },
        { name: "Scientific Calculator", href: "/scientific-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Numbers", text: "Input two or more positive integers." },
        { name: "Add More Numbers", text: "Click '+' to add additional numbers if needed." },
        { name: "View LCM", text: "See the Least Common Multiple instantly." },
        { name: "Study Solution", text: "Understand the step-by-step prime factorization method." },
      ]}
      faqs={[
        {
          question: "What is the Least Common Multiple (LCM)?",
          answer: "The LCM is the smallest positive number that is divisible by all the given numbers. For example, the LCM of 4 and 6 is 12 because 12 is the smallest number that both 4 and 6 divide into evenly (12÷4=3, 12÷6=2).",
        },
        {
          question: "How do I find the LCM using prime factorization?",
          answer: "Factor each number into primes. For each prime factor that appears, take the highest power of that prime from any of the numbers. Multiply these together to get the LCM. For example: LCM(12,18) = 2² × 3² = 36, since 12 = 2² × 3 and 18 = 2 × 3².",
        },
        {
          question: "What is the relationship between LCM and GCD?",
          answer: "For two numbers a and b: LCM(a,b) × GCD(a,b) = a × b. This means if you know the GCD, you can find the LCM by: LCM = (a × b) ÷ GCD. For 12 and 18: GCD=6, so LCM = (12×18)÷6 = 36.",
        },
        {
          question: "When do I need to find the LCM?",
          answer: "LCM is used when adding or subtracting fractions (finding common denominators), scheduling events that repeat at different intervals, solving problems about cycles or patterns, and in many engineering and scientific calculations involving periodic phenomena.",
        },
      ]}
      content={
        <>
          <h2>Understanding Least Common Multiple</h2>
          <p>
            The Least Common Multiple (LCM) of two or more numbers is the smallest positive integer that is divisible by all of them. It's a fundamental concept in arithmetic that appears in fraction operations, scheduling problems, and many mathematical applications.
          </p>
          <p>
            For example, the LCM of 4 and 6 is 12. This means 12 is the smallest number that both 4 and 6 divide evenly into: 12 ÷ 4 = 3 and 12 ÷ 6 = 2. Other common multiples of 4 and 6 include 24, 36, 48, etc., but 12 is the <em>least</em> (smallest).
          </p>

          <h2>Methods for Finding LCM</h2>

          <h3>Method 1: Listing Multiples</h3>
          <p>
            List the multiples of each number until you find the first common one:
          </p>
          <ul>
            <li>Multiples of 4: 4, 8, <strong>12</strong>, 16, 20, 24...</li>
            <li>Multiples of 6: 6, <strong>12</strong>, 18, 24, 30...</li>
          </ul>
          <p>
            The first number appearing in both lists is 12, so LCM(4, 6) = 12. This method works well for small numbers but becomes tedious for larger ones.
          </p>

          <h3>Method 2: Prime Factorization</h3>
          <p>
            This is the most reliable method for any numbers:
          </p>
          <ol>
            <li>Factor each number into its prime factors</li>
            <li>For each prime, take the highest power appearing in any factorization</li>
            <li>Multiply these prime powers together</li>
          </ol>
          <p>
            Example for LCM(12, 18): 12 = 2² × 3 and 18 = 2 × 3². Taking the highest powers: 2² and 3², so LCM = 4 × 9 = 36.
          </p>

          <h3>Method 3: Using GCD</h3>
          <p>
            If you know the Greatest Common Divisor (GCD), you can find LCM using:
          </p>
          <p className="font-mono bg-muted p-3 rounded-lg text-center">
            LCM(a, b) = (a × b) ÷ GCD(a, b)
          </p>
          <p>
            For 12 and 18: GCD = 6, so LCM = (12 × 18) ÷ 6 = 216 ÷ 6 = 36.
          </p>

          <h2>LCM Applications</h2>
          <ul>
            <li><strong>Adding Fractions:</strong> To add 1/4 + 1/6, you need a common denominator. The LCM of 4 and 6 is 12, so: 3/12 + 2/12 = 5/12</li>
            <li><strong>Scheduling:</strong> If Bus A comes every 12 minutes and Bus B every 18 minutes, they'll arrive together every LCM(12,18) = 36 minutes</li>
            <li><strong>Gear Systems:</strong> Calculating when gears with different tooth counts realign</li>
            <li><strong>Music:</strong> Finding when rhythmic patterns align in polyrhythms</li>
          </ul>

          <h2>Properties of LCM</h2>
          <ul>
            <li>LCM(a, b) ≥ max(a, b) — the LCM is at least as large as the larger number</li>
            <li>LCM(a, a) = a — the LCM of a number with itself is the number</li>
            <li>LCM(a, 1) = a — the LCM with 1 is the number itself</li>
            <li>If GCD(a, b) = 1 (coprime), then LCM(a, b) = a × b</li>
            <li>LCM is associative: LCM(a, LCM(b, c)) = LCM(LCM(a, b), c)</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Enter Numbers
          </h2>

          <div className="space-y-3">
            {inputs.map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={value}
                  onChange={(e) => updateInput(index, e.target.value)}
                  placeholder={`Number ${index + 1}`}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
                {inputs.length > 2 && (
                  <button
                    onClick={() => removeInput(index)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {inputs.length < 6 && (
              <button
                onClick={addInput}
                className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Number
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setInputs(preset.values)}
                  className="rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <>
            {/* Main Results */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Least Common Multiple (LCM)</p>
                <p className="text-4xl font-bold text-primary">{result.lcm.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Greatest Common Divisor (GCD)</p>
                <p className="text-4xl font-bold text-foreground">{result.gcd.toLocaleString()}</p>
              </div>
            </div>

            {/* Prime Factorization Method */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Prime Factorization Method
              </h3>

              <div className="space-y-3">
                {result.primeFactors.map(({ number, factors }) => (
                  <div key={number} className="flex items-center gap-3 text-sm">
                    <span className="w-16 font-bold text-foreground">{number}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="font-mono text-foreground">
                      {factors.size > 0 ? formatFactors(factors) : "1 (prime)"}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-16 font-bold text-primary">LCM</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="font-mono text-primary font-medium">
                      {formatFactors(result.lcmFactors)} = {result.lcm.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                The LCM is found by taking the highest power of each prime factor that appears in any of the numbers.
              </p>
            </div>

            {/* Listing Multiples Method */}
            {result.lcm <= 100 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-primary" />
                  Listing Multiples Method
                </h3>

                <div className="space-y-3">
                  {result.multiples.map(({ number, multiples }) => (
                    <div key={number} className="text-sm">
                      <span className="font-medium text-foreground">Multiples of {number}: </span>
                      <span className="font-mono text-muted-foreground">
                        {multiples.map((m, i) => (
                          <span key={m}>
                            <span className={m === result.lcm ? "text-primary font-bold" : ""}>
                              {m}
                            </span>
                            {i < multiples.length - 1 && ", "}
                          </span>
                        ))}
                        {multiples[multiples.length - 1] < result.lcm && "..."}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  The first common multiple in all lists is <strong className="text-primary">{result.lcm}</strong>.
                </p>
              </div>
            )}

            {/* Relationship Formula */}
            {inputs.filter(s => parseInt(s) > 0).length === 2 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                  LCM-GCD Relationship
                </h4>
                <p className="text-sm text-foreground font-mono">
                  LCM × GCD = {inputs[0]} × {inputs[1]}
                </p>
                <p className="text-sm text-foreground font-mono">
                  {result.lcm} × {result.gcd} = {parseInt(inputs[0]) * parseInt(inputs[1])} ✓
                </p>
              </div>
            )}
          </>
        )}

        {/* Common LCM Values Reference */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Common LCM Values</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[
              { nums: "2, 3", lcm: 6 },
              { nums: "3, 4", lcm: 12 },
              { nums: "4, 5", lcm: 20 },
              { nums: "4, 6", lcm: 12 },
              { nums: "6, 8", lcm: 24 },
              { nums: "8, 12", lcm: 24 },
              { nums: "9, 12", lcm: 36 },
              { nums: "10, 15", lcm: 30 },
              { nums: "12, 18", lcm: 36 },
            ].map(({ nums, lcm }) => (
              <div
                key={nums}
                className="flex justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <span className="text-muted-foreground">LCM({nums})</span>
                <span className="font-mono font-medium text-foreground">{lcm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
