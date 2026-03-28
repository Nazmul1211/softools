"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Equal, ArrowRight } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "How do I add fractions with different denominators?",
    answer: "To add fractions with different denominators: 1) Find the Least Common Denominator (LCD) - the smallest number both denominators divide into evenly. 2) Convert each fraction to an equivalent fraction with the LCD. 3) Add the numerators and keep the LCD. 4) Simplify if possible. Example: 1/3 + 1/4 → 4/12 + 3/12 = 7/12."
  },
  {
    question: "How do I multiply fractions?",
    answer: "Multiplying fractions is straightforward: multiply the numerators together to get the new numerator, and multiply the denominators together to get the new denominator. Then simplify if possible. Example: 2/3 × 3/4 = 6/12 = 1/2. You can also cross-cancel before multiplying to make simplification easier."
  },
  {
    question: "How do I divide fractions?",
    answer: "To divide fractions, multiply by the reciprocal (flip) of the second fraction. 'Keep, Change, Flip': Keep the first fraction, change ÷ to ×, flip the second fraction. Example: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6."
  },
  {
    question: "What is a mixed number and how do I convert it?",
    answer: "A mixed number has a whole number and a fraction (e.g., 2 1/3). To convert to an improper fraction: multiply the whole number by the denominator, add the numerator, keep the same denominator. 2 1/3 = (2×3 + 1)/3 = 7/3. To convert back: divide numerator by denominator—quotient is the whole number, remainder is the new numerator."
  },
  {
    question: "How do I simplify (reduce) a fraction?",
    answer: "To simplify a fraction, divide both the numerator and denominator by their Greatest Common Divisor (GCD). The GCD is the largest number that divides both evenly. Example: 12/18 → GCD is 6 → 12÷6 / 18÷6 = 2/3. A fraction is fully simplified when the GCD of numerator and denominator is 1."
  },
  {
    question: "How do I convert a fraction to a decimal?",
    answer: "Divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75. Some fractions result in repeating decimals (1/3 = 0.333...). To convert a decimal to a fraction, count decimal places and use that as the denominator power of 10, then simplify (0.75 = 75/100 = 3/4)."
  },
];

type Operation = "add" | "subtract" | "multiply" | "divide";

interface Fraction {
  numerator: number;
  denominator: number;
  whole?: number;
}

export default function FractionCalculator() {
  const [fraction1, setFraction1] = useState({ whole: "", num: "1", den: "2" });
  const [fraction2, setFraction2] = useState({ whole: "", num: "1", den: "4" });
  const [operation, setOperation] = useState<Operation>("add");

  // Greatest Common Divisor
  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Least Common Multiple
  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  // Simplify fraction
  const simplify = (num: number, den: number): { num: number; den: number } => {
    if (den === 0) return { num: 0, den: 1 };
    const divisor = gcd(num, den);
    let sNum = num / divisor;
    let sDen = den / divisor;
    // Ensure negative is in numerator
    if (sDen < 0) {
      sNum = -sNum;
      sDen = -sDen;
    }
    return { num: sNum, den: sDen };
  };

  // Convert mixed number to improper fraction
  const toImproper = (whole: number, num: number, den: number): { num: number; den: number } => {
    const sign = whole < 0 ? -1 : 1;
    const absWhole = Math.abs(whole);
    return { num: sign * (absWhole * den + num), den };
  };

  // Convert improper fraction to mixed number
  const toMixed = (num: number, den: number): { whole: number; num: number; den: number } => {
    if (den === 0) return { whole: 0, num: 0, den: 1 };
    const sign = (num < 0) !== (den < 0) ? -1 : 1;
    const absNum = Math.abs(num);
    const absDen = Math.abs(den);
    const whole = Math.floor(absNum / absDen);
    const remainder = absNum % absDen;
    return { whole: sign * whole, num: remainder, den: absDen };
  };

  const result = useMemo(() => {
    const w1 = parseInt(fraction1.whole) || 0;
    const n1 = parseInt(fraction1.num) || 0;
    const d1 = parseInt(fraction1.den) || 1;
    const w2 = parseInt(fraction2.whole) || 0;
    const n2 = parseInt(fraction2.num) || 0;
    const d2 = parseInt(fraction2.den) || 1;

    // Validate denominators
    if (d1 === 0 || d2 === 0) {
      return { error: "Denominator cannot be zero" };
    }

    // Convert to improper fractions
    const f1 = toImproper(w1, n1, d1);
    const f2 = toImproper(w2, n2, d2);

    let resultNum: number;
    let resultDen: number;
    let steps: string[] = [];

    // Add step showing initial fractions
    const f1Str = w1 !== 0 ? `${w1} ${n1}/${d1}` : `${n1}/${d1}`;
    const f2Str = w2 !== 0 ? `${w2} ${n2}/${d2}` : `${n2}/${d2}`;
    const opSymbol = operation === "add" ? "+" : operation === "subtract" ? "−" : operation === "multiply" ? "×" : "÷";

    steps.push(`${f1Str} ${opSymbol} ${f2Str}`);

    // Convert to improper if mixed
    if (w1 !== 0 || w2 !== 0) {
      steps.push(`Convert to improper: ${f1.num}/${f1.den} ${opSymbol} ${f2.num}/${f2.den}`);
    }

    switch (operation) {
      case "add":
      case "subtract": {
        const commonDen = lcm(f1.den, f2.den);
        const mult1 = commonDen / f1.den;
        const mult2 = commonDen / f2.den;
        const newNum1 = f1.num * mult1;
        const newNum2 = f2.num * mult2;
        
        if (commonDen !== f1.den || commonDen !== f2.den) {
          steps.push(`Find LCD: ${commonDen}`);
          steps.push(`Convert: ${newNum1}/${commonDen} ${opSymbol} ${newNum2}/${commonDen}`);
        }
        
        resultNum = operation === "add" ? newNum1 + newNum2 : newNum1 - newNum2;
        resultDen = commonDen;
        steps.push(`${operation === "add" ? "Add" : "Subtract"} numerators: ${resultNum}/${resultDen}`);
        break;
      }
      case "multiply": {
        resultNum = f1.num * f2.num;
        resultDen = f1.den * f2.den;
        steps.push(`Multiply: (${f1.num} × ${f2.num}) / (${f1.den} × ${f2.den}) = ${resultNum}/${resultDen}`);
        break;
      }
      case "divide": {
        if (f2.num === 0) {
          return { error: "Cannot divide by zero" };
        }
        resultNum = f1.num * f2.den;
        resultDen = f1.den * f2.num;
        steps.push(`Flip & multiply: ${f1.num}/${f1.den} × ${f2.den}/${f2.num} = ${resultNum}/${resultDen}`);
        break;
      }
    }

    // Simplify result
    const simplified = simplify(resultNum, resultDen);
    if (simplified.num !== resultNum || simplified.den !== resultDen) {
      steps.push(`Simplify: ${simplified.num}/${simplified.den}`);
    }

    // Convert to mixed if improper
    const mixed = toMixed(simplified.num, simplified.den);
    const decimal = simplified.num / simplified.den;

    return {
      fraction: simplified,
      mixed: Math.abs(simplified.num) >= simplified.den ? mixed : null,
      decimal: decimal,
      steps,
    };
  }, [fraction1, fraction2, operation]);

  const reset = () => {
    setFraction1({ whole: "", num: "1", den: "2" });
    setFraction2({ whole: "", num: "1", den: "4" });
    setOperation("add");
  };

  const handleInput = (
    setter: typeof setFraction1,
    field: "whole" | "num" | "den",
    value: string
  ) => {
    // Allow empty string, negative sign, or valid integers
    if (value === "" || value === "-" || /^-?\d*$/.test(value)) {
      setter((prev) => ({ ...prev, [field]: value }));
    }
  };

  const FractionInput = ({
    value,
    onChange,
    label,
  }: {
    value: { whole: string; num: string; den: string };
    onChange: typeof setFraction1;
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        {/* Whole number (optional) */}
        <input
          type="text"
          inputMode="numeric"
          value={value.whole}
          onChange={(e) => handleInput(onChange, "whole", e.target.value)}
          placeholder="0"
          className="w-14 h-12 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 text-center text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        
        {/* Fraction part */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={value.num}
            onChange={(e) => handleInput(onChange, "num", e.target.value)}
            placeholder="1"
            className="w-16 h-10 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 text-center text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="w-16 h-0.5 bg-foreground my-1" />
          <input
            type="text"
            inputMode="numeric"
            value={value.den}
            onChange={(e) => handleInput(onChange, "den", e.target.value)}
            placeholder="2"
            className="w-16 h-10 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 text-center text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Fraction Calculator"
      description="Calculate fractions with step-by-step solutions. Add, subtract, multiply, and divide fractions. Supports mixed numbers and automatically simplifies results. Convert between fractions, decimals, and mixed numbers."
      category={{ name: "Math", slug: "math-calculators" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Scientific Calculator", href: "/scientific-calculator" },
        { name: "College GPA Calculator", href: "/college-gpa-calculator" },
        { name: "Decimal to Fraction", href: "/decimal-to-fraction" },
        { name: "Ratio Calculator", href: "/ratio-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Fractions</h2>
          <p>
            A fraction represents a part of a whole, written as one number over another separated by a line. The top number (numerator) represents how many parts you have, while the bottom number (denominator) represents how many equal parts make up the whole.
          </p>

          <h2>Types of Fractions</h2>
          
          <h3>Proper Fractions</h3>
          <p>
            The numerator is smaller than the denominator, representing a value less than 1. Examples: 1/2, 3/4, 5/8.
          </p>

          <h3>Improper Fractions</h3>
          <p>
            The numerator is equal to or larger than the denominator, representing a value of 1 or more. Examples: 5/4, 7/3, 9/9.
          </p>

          <h3>Mixed Numbers</h3>
          <p>
            A combination of a whole number and a proper fraction. Examples: 1 1/2, 2 3/4, 5 1/8. This calculator accepts mixed numbers and can convert between formats.
          </p>

          <h2>Fraction Operations</h2>

          <h3>Adding Fractions</h3>
          <p>
            To add fractions with the same denominator, add the numerators and keep the denominator. For different denominators, first find a common denominator.
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            Same denominator: 1/4 + 2/4 = 3/4{"\n"}
            Different: 1/3 + 1/4 = 4/12 + 3/12 = 7/12
          </pre>

          <h3>Subtracting Fractions</h3>
          <p>
            Similar to addition—find a common denominator if needed, then subtract numerators.
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            3/4 − 1/4 = 2/4 = 1/2{"\n"}
            1/2 − 1/3 = 3/6 − 2/6 = 1/6
          </pre>

          <h3>Multiplying Fractions</h3>
          <p>
            Multiply numerators together and denominators together. No common denominator needed.
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2
          </pre>

          <h3>Dividing Fractions</h3>
          <p>
            Multiply by the reciprocal (flip the second fraction). &quot;Keep, Change, Flip&quot;
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6
          </pre>

          <h2>Finding Common Denominators</h2>
          <p>
            The Least Common Denominator (LCD) is the smallest number that both denominators divide into evenly. To find it:
          </p>
          <ol>
            <li>List multiples of each denominator</li>
            <li>Find the smallest number that appears in both lists</li>
            <li>Or calculate: LCD = (d1 × d2) / GCD(d1, d2)</li>
          </ol>

          <h2>Simplifying Fractions</h2>
          <p>
            To simplify (reduce) a fraction to its lowest terms:
          </p>
          <ol>
            <li>Find the Greatest Common Divisor (GCD) of numerator and denominator</li>
            <li>Divide both by the GCD</li>
          </ol>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            12/18: GCD(12,18) = 6{"\n"}
            12÷6 / 18÷6 = 2/3
          </pre>

          <h2>Converting Between Formats</h2>
          
          <h3>Mixed to Improper</h3>
          <p>
            Multiply whole number by denominator, add numerator, keep denominator.
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            2 3/4 = (2×4 + 3)/4 = 11/4
          </pre>

          <h3>Improper to Mixed</h3>
          <p>
            Divide numerator by denominator. Quotient is whole, remainder is numerator.
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            11/4 = 11÷4 = 2 remainder 3 = 2 3/4
          </pre>

          <h3>Fraction to Decimal</h3>
          <p>
            Divide numerator by denominator.
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            3/4 = 3 ÷ 4 = 0.75{"\n"}
            1/3 = 1 ÷ 3 = 0.333...
          </pre>
        </>
      }
    >
      <div className="space-y-6">
        {/* Fraction Inputs */}
        <div className="grid gap-6 sm:grid-cols-2">
          <FractionInput
            value={fraction1}
            onChange={setFraction1}
            label="First Fraction"
          />
          <FractionInput
            value={fraction2}
            onChange={setFraction2}
            label="Second Fraction"
          />
        </div>

        {/* Operation Selector */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Operation</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "add", label: "+", name: "Add" },
              { id: "subtract", label: "−", name: "Subtract" },
              { id: "multiply", label: "×", name: "Multiply" },
              { id: "divide", label: "÷", name: "Divide" },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id as Operation)}
                className={`py-3 rounded-lg border font-medium transition-all ${
                  operation === op.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span className="text-2xl">{op.label}</span>
                <span className="block text-xs mt-1">{op.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {"error" in result ? (
          <div className="rounded-xl border border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-red-600 dark:text-red-400">{result.error}</p>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
            {/* Main Result */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Result</p>
              <div className="flex items-center justify-center gap-4">
                {/* Fraction Display */}
                <div className="flex items-center gap-2">
                  {result.mixed && result.mixed.whole !== 0 && (
                    <span className="text-4xl font-bold text-primary">{result.mixed.whole}</span>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-primary">
                      {result.mixed ? result.mixed.num : result.fraction.num}
                    </span>
                    <div className="w-full h-0.5 bg-primary my-0.5" />
                    <span className="text-2xl font-bold text-primary">
                      {result.mixed ? result.mixed.den : result.fraction.den}
                    </span>
                  </div>
                </div>

                <Equal className="h-6 w-6 text-muted-foreground" />
                
                {/* Decimal */}
                <span className="text-2xl font-bold text-foreground">
                  {result.decimal.toFixed(6).replace(/\.?0+$/, "")}
                </span>
              </div>

              {/* Improper fraction if different from mixed */}
              {result.mixed && result.mixed.whole !== 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Improper: {result.fraction.num}/{result.fraction.den}
                </p>
              )}
            </div>

            {/* Steps */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-2">Solution Steps</p>
              <div className="space-y-1">
                {result.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-medium">{index + 1}.</span>
                    <span className="text-muted-foreground font-mono">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <Button onClick={reset} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Calculator
        </Button>

        {/* Quick Reference */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3">Quick Reference</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Add/Subtract:</span>
              <span className="text-foreground">Find common denominator first</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Multiply:</span>
              <span className="text-foreground">Num × Num, Den × Den</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Divide:</span>
              <span className="text-foreground">Keep, Change, Flip (multiply by reciprocal)</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
