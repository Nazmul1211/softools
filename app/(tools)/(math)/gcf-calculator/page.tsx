"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Calculator, BookOpen, Info, ArrowRight, Hash, Divide } from "lucide-react";

/* ─── FAQ Data ────────────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "What is the difference between GCF, GCD, and HCF?",
    answer:
      "GCF (Greatest Common Factor), GCD (Greatest Common Divisor), and HCF (Highest Common Factor) are three names for the same concept. GCF and GCD are used primarily in the United States, while HCF is more common in the UK, India, and Commonwealth countries. The mathematical definition is identical: the largest positive integer that divides each of the given numbers without a remainder. For example, GCF(12, 18) = GCD(12, 18) = HCF(12, 18) = 6.",
  },
  {
    question: "How do I find the GCF of three or more numbers?",
    answer:
      "To find the GCF of three or more numbers, apply the GCF function pairwise: GCF(a, b, c) = GCF(GCF(a, b), c). For example, GCF(12, 18, 24): Step 1: GCF(12, 18) = 6. Step 2: GCF(6, 24) = 6. So GCF(12, 18, 24) = 6. This works because the GCF operation is both commutative and associative, meaning the order doesn't matter. This calculator handles up to 10 numbers at once using this iterative approach.",
  },
  {
    question: "What is the relationship between GCF and LCM?",
    answer:
      "For any two positive integers a and b: GCF(a, b) × LCM(a, b) = a × b. This means you can find one if you know the other: LCM(a, b) = (a × b) / GCF(a, b). Example: For 12 and 18: GCF = 6, so LCM = (12 × 18) / 6 = 36. This identity is frequently used in competitive math (AMC, MATHCOUNTS) and is valid for all positive integer pairs. The relationship doesn't directly extend to three+ numbers without modification.",
  },
  {
    question: "When is the GCF of two numbers equal to 1?",
    answer:
      "When GCF(a, b) = 1, the numbers are called 'coprime' or 'relatively prime.' This means they share no common factors other than 1. Examples: GCF(15, 28) = 1 (15 = 3×5, 28 = 4×7 — no shared primes). Consecutive integers are always coprime: GCF(n, n+1) = 1 for any n. Any prime number p is coprime with any number that is not a multiple of p. In fraction simplification, a fraction a/b is already in lowest terms when GCF(a, b) = 1.",
  },
  {
    question: "How is the GCF used in simplifying fractions?",
    answer:
      "To simplify a fraction, divide both the numerator and denominator by their GCF. Example: Simplify 48/60. GCF(48, 60) = 12, so 48/60 = (48÷12)/(60÷12) = 4/5. This is the only reliable method for reducing fractions to their simplest form. It works because dividing both parts of a fraction by the same non-zero number produces an equivalent fraction. This is taught as early as 4th–5th grade in the US Common Core Standards (CCSS.Math.Content.4.NF.A.1).",
  },
  {
    question: "What is the Euclidean Algorithm and why is it efficient?",
    answer:
      "The Euclidean Algorithm finds GCF(a, b) by repeatedly replacing the larger number with the remainder of dividing the two: GCF(a, b) = GCF(b, a mod b), repeating until the remainder is 0. The last non-zero remainder is the GCF. Example: GCF(252, 105) → GCF(105, 42) → GCF(42, 21) → GCF(21, 0) → GCF = 21. It runs in O(log(min(a,b))) time, making it extremely efficient even for very large numbers. Euclid described this algorithm in Book VII of Elements (~300 BCE), making it one of the oldest known algorithms still in use.",
  },
];

/* ─── Types ─────────────────────────────────────── */

interface PrimeFactors {
  number: number;
  factors: Map<number, number>;
}

/* ─── Helpers ───────────────────────────────────── */

function gcdTwo(a: number, b: number): number {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function gcdMultiple(nums: number[]): number {
  return nums.reduce((a, b) => gcdTwo(a, b));
}

function lcmTwo(a: number, b: number): number {
  return Math.abs(a * b) / gcdTwo(a, b);
}

function lcmMultiple(nums: number[]): number {
  return nums.reduce((a, b) => lcmTwo(a, b));
}

function getPrimeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = Math.abs(Math.floor(n));
  if (num <= 1) return factors;

  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      num = num / d;
    }
  }
  if (num > 1) factors.set(num, (factors.get(num) || 0) + 1);
  return factors;
}

function formatFactors(factors: Map<number, number>): string {
  if (factors.size === 0) return "1";
  const parts: string[] = [];
  const sorted = Array.from(factors.entries()).sort((a, b) => a[0] - b[0]);
  for (const [prime, exp] of sorted) {
    parts.push(exp > 1 ? `${prime}^${exp}` : `${prime}`);
  }
  return parts.join(" × ");
}

function euclideanSteps(a: number, b: number): string[] {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  const steps: string[] = [];
  if (a < b) [a, b] = [b, a];
  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    steps.push(`${a} = ${q} × ${b} + ${r}`);
    a = b;
    b = r;
  }
  steps.push(`GCF = ${a}`);
  return steps;
}

function getFactorsList(n: number): number[] {
  const num = Math.abs(Math.floor(n));
  if (num <= 0) return [];
  const factors: number[] = [];
  for (let i = 1; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      factors.push(i);
      if (i !== num / i) factors.push(num / i);
    }
  }
  return factors.sort((a, b) => a - b);
}

/* ─── Component ────────────────────────────────── */

export default function GCFCalculator() {
  const [input, setInput] = useState("48, 60");

  const results = useMemo(() => {
    const raw = input
      .split(/[,\s;]+/)
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (raw.length < 2) return null;

    const nums = raw.slice(0, 10); // Max 10 numbers
    const gcf = gcdMultiple(nums);
    const lcm = lcmMultiple(nums);

    // Prime factorizations
    const primeFactorizations: PrimeFactors[] = nums.map((n) => ({
      number: n,
      factors: getPrimeFactors(n),
    }));

    // Get all unique primes
    const allPrimes = new Set<number>();
    primeFactorizations.forEach((pf) => pf.factors.forEach((_, prime) => allPrimes.add(prime)));
    const sortedPrimes = Array.from(allPrimes).sort((a, b) => a - b);

    // Common factors (shared primes with minimum powers)
    const commonFactors = new Map<number, number>();
    for (const prime of sortedPrimes) {
      const powers = primeFactorizations.map((pf) => pf.factors.get(prime) || 0);
      const minPow = Math.min(...powers);
      if (minPow > 0) commonFactors.set(prime, minPow);
    }

    // Euclidean steps (only for two numbers)
    const eucSteps = nums.length === 2 ? euclideanSteps(nums[0], nums[1]) : null;

    // Factors list (for visualization, only for 2 numbers)
    const factors1 = nums.length === 2 ? getFactorsList(nums[0]) : null;
    const factors2 = nums.length === 2 ? getFactorsList(nums[1]) : null;
    const commonFactorsList = factors1 && factors2 ? factors1.filter((f) => factors2.includes(f)) : null;

    return {
      numbers: nums,
      gcf,
      lcm,
      primeFactorizations,
      sortedPrimes,
      commonFactors,
      eucSteps,
      factors1,
      factors2,
      commonFactorsList,
    };
  }, [input]);

  return (
    <ToolLayout
      title="GCF Calculator"
      description="Find the Greatest Common Factor (GCF), also called Greatest Common Divisor (GCD) or Highest Common Factor (HCF), of two or more numbers. View step-by-step solutions using prime factorization, the listing method, and the Euclidean algorithm."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter your numbers", text: "Type two or more positive integers separated by commas, spaces, or semicolons. The calculator supports up to 10 numbers." },
        { name: "View the GCF result", text: "The GCF and LCM are calculated instantly. For two numbers, the product relationship GCF × LCM = a × b is also verified." },
        { name: "Study the step-by-step solutions", text: "Three methods are shown: prime factorization, the listing method (for two numbers), and the Euclidean Algorithm (for two numbers)." },
        { name: "Apply the result", text: "Use the GCF to simplify fractions, solve ratio problems, or distribute items into equal groups." },
      ]}
      relatedTools={[
        { name: "LCM Calculator", href: "/lcm-calculator" },
        { name: "Fraction Calculator", href: "/fraction-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Average Calculator", href: "/average-calculator" },
        { name: "Ratio Calculator", href: "/ratio-calculator" },
      ]}
      content={
        <>
          <h2>What Is the Greatest Common Factor (GCF)?</h2>
          <p>
            The <strong>Greatest Common Factor (GCF)</strong> of two or more integers is the largest positive integer that divides each of the given numbers without leaving a remainder. It is also known as the Greatest Common Divisor (GCD), Highest Common Factor (HCF), or Greatest Common Measure (GCM). For example, the factors of 12 are {"{1, 2, 3, 4, 6, 12}"} and the factors of 18 are {"{1, 2, 3, 6, 9, 18}"}. The largest factor they share is 6, so <strong>GCF(12, 18) = 6</strong>.
          </p>

          <h2>Three Methods to Find the GCF</h2>

          <h3>Method 1: Prime Factorization</h3>
          <p>Express each number as a product of prime factors. The GCF is the product of all shared primes raised to the <em>lowest</em> power they appear in any of the numbers.</p>
          <ul>
            <li>48 = 2⁴ × 3</li>
            <li>60 = 2² × 3 × 5</li>
            <li>Shared primes: 2 (min power 2) and 3 (min power 1)</li>
            <li><strong>GCF = 2² × 3 = 12</strong></li>
          </ul>

          <h3>Method 2: Listing Factors</h3>
          <p>List all factors of each number and identify the largest one that appears in both lists:</p>
          <ul>
            <li>Factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48</li>
            <li>Factors of 60: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60</li>
            <li>Common: 1, 2, 3, 4, 6, 12</li>
            <li><strong>GCF = 12</strong> (the largest common factor)</li>
          </ul>

          <h3>Method 3: Euclidean Algorithm</h3>
          <p>Repeatedly divide and take remainders until the remainder is 0. The last non-zero remainder is the GCF:</p>
          <ul>
            <li>60 = 1 × 48 + 12</li>
            <li>48 = 4 × 12 + 0</li>
            <li><strong>GCF = 12</strong></li>
          </ul>
          <p>The Euclidean Algorithm, described by Euclid in <em>Elements</em> (~300 BCE), is one of the oldest algorithms in mathematics and runs in O(log n) time — extremely efficient even for large numbers in the billions.</p>

          <h2>Understanding Your Results</h2>
          <p>The GCF tells you the largest &ldquo;unit&rdquo; that evenly divides all your numbers. Practical interpretation:</p>
          <ul>
            <li>GCF = 1: The numbers are <strong>coprime</strong> (relatively prime) — they share no common factors.</li>
            <li>GCF = one of the numbers: That number divides all the others evenly.</li>
            <li>GCF {'>'} 1: All numbers can be divided by the GCF to produce simpler values.</li>
          </ul>

          <h2>Real-World Applications</h2>
          <ul>
            <li><strong>Simplifying fractions:</strong> Divide numerator and denominator by their GCF. For 48/60: GCF(48,60) = 12, so 48/60 = 4/5.</li>
            <li><strong>Dividing objects into equal groups:</strong> You have 48 apples and 60 oranges. The largest number of identical gift baskets = GCF(48, 60) = 12 baskets, each with 4 apples and 5 oranges.</li>
            <li><strong>Tiling problems:</strong> You want to tile a 48×60 inch floor with square tiles. The largest square tile = GCF(48, 60) = 12 inches.</li>
            <li><strong>Cryptography:</strong> The RSA algorithm uses GCD computations to generate key pairs. The Euclidean Algorithm is central to computing modular inverses.</li>
          </ul>

          <h2>GCF × LCM Identity</h2>
          <p>For any two positive integers a and b:</p>
          <p><strong>GCF(a, b) × LCM(a, b) = a × b</strong></p>
          <p>This means: LCM(a, b) = (a × b) / GCF(a, b). Example: GCF(12, 18) = 6, so LCM(12, 18) = (12 × 18) / 6 = 36. This identity is frequently used in number theory and competitive mathematics.</p>

          <h2>Sources and References</h2>
          <ul>
            <li>Euclid (c. 300 BCE). <em>Elements</em>, Book VII, Propositions 1–2. Description of the Euclidean Algorithm.</li>
            <li>Knuth, D.E. (1997). <em>The Art of Computer Programming, Volume 2: Seminumerical Algorithms</em> (3rd ed.). Addison-Wesley. Analysis of GCD algorithms.</li>
            <li>Common Core State Standards Initiative. CCSS.Math.Content.4.NF.A.1 — Fraction equivalence and simplification using factors.</li>
            <li>Hardy, G.H. &amp; Wright, E.M. (2008). <em>An Introduction to the Theory of Numbers</em> (6th ed.). Oxford University Press.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            Enter Numbers (separated by commas or spaces)
          </label>
          <input
            type="text"
            inputMode="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 48, 60 or 12 18 24"
            className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground mt-1">Enter 2–10 positive integers. Separate with commas, spaces, or semicolons.</p>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Primary results */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Greatest Common Factor (GCF)</p>
                <p className="text-5xl font-bold text-foreground">{results.gcf}</p>
                <p className="text-xs text-muted-foreground mt-2">of {results.numbers.join(", ")}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Least Common Multiple (LCM)</p>
                <p className="text-5xl font-bold text-foreground">{results.lcm.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">GCF × LCM = {(results.gcf * results.lcm).toLocaleString()}</p>
              </div>
            </div>

            {/* Fraction simplification hint */}
            {results.numbers.length === 2 && results.gcf > 1 && (
              <div className="rounded-xl border border-border bg-emerald-50 dark:bg-emerald-950/20 p-4">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-1">
                  <Divide className="h-4 w-4" />
                  Fraction Simplification
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  {results.numbers[0]}/{results.numbers[1]} = {results.numbers[0] / results.gcf}/{results.numbers[1] / results.gcf} (÷ {results.gcf})
                </p>
              </div>
            )}

            {/* Method 1: Prime Factorization */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Method 1: Prime Factorization
              </h4>
              <div className="space-y-2 text-sm font-mono">
                {results.primeFactorizations.map((pf) => (
                  <p key={pf.number} className="text-muted-foreground">
                    {pf.number} = {pf.factors.size > 0 ? formatFactors(pf.factors) : "1 (no prime factors)"}
                  </p>
                ))}
                <hr className="border-border my-2" />
                <p className="text-muted-foreground">
                  Common primes (min power): {results.commonFactors.size > 0 ? formatFactors(results.commonFactors) : "none"}
                </p>
                <p className="font-bold text-foreground">
                  GCF = {results.commonFactors.size > 0 ? formatFactors(results.commonFactors) + " = " : ""}{results.gcf}
                </p>
              </div>
            </div>

            {/* Method 2: Listing factors (only for 2 numbers) */}
            {results.factors1 && results.factors2 && results.commonFactorsList && (
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Method 2: Listing Factors
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Factors of {results.numbers[0]}:</span>{" "}
                    {results.factors1.map((f, i) => (
                      <span key={f}>
                        <span className={results.commonFactorsList!.includes(f) ? "text-primary font-bold" : ""}>
                          {f}
                        </span>
                        {i < results.factors1!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Factors of {results.numbers[1]}:</span>{" "}
                    {results.factors2.map((f, i) => (
                      <span key={f}>
                        <span className={results.commonFactorsList!.includes(f) ? "text-primary font-bold" : ""}>
                          {f}
                        </span>
                        {i < results.factors2!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Common:</span>{" "}
                    {results.commonFactorsList.join(", ")}
                  </p>
                  <p className="font-bold text-foreground font-mono">GCF = {results.gcf}</p>
                </div>
              </div>
            )}

            {/* Method 3: Euclidean Algorithm (only for 2 numbers) */}
            {results.eucSteps && (
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Method 3: Euclidean Algorithm
                </h4>
                <div className="space-y-1 text-sm font-mono">
                  {results.eucSteps.map((step, i) => (
                    <p key={i} className={i === results.eucSteps!.length - 1 ? "font-bold text-foreground" : "text-muted-foreground"}>
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!results && (
          <div className="text-center py-12 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter at least two positive integers to find their GCF</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
