"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  Percent,
  Target,
  Shuffle,
  PieChart,
  Info,
} from "lucide-react";

type CalculationType =
  | "single"
  | "aAndB"
  | "aOrB"
  | "conditional"
  | "complement"
  | "atLeastOne";

interface ProbabilityResult {
  probability: number;
  percentage: string;
  odds: string;
  explanation: string;
  formula: string;
}

function formatProbability(p: number): string {
  if (p === 0) return "0";
  if (p === 1) return "1";
  return p.toFixed(6).replace(/\.?0+$/, "");
}

function probabilityToOdds(p: number): string {
  if (p <= 0) return "0 : 1";
  if (p >= 1) return "1 : 0";
  const forEvent = p;
  const againstEvent = 1 - p;
  
  // Try to find nice ratio
  const ratio = forEvent / againstEvent;
  if (ratio >= 1) {
    return `${ratio.toFixed(2)} : 1`;
  } else {
    return `1 : ${(1 / ratio).toFixed(2)}`;
  }
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

function toFraction(decimal: number): string {
  if (decimal === 0) return "0";
  if (decimal === 1) return "1";
  
  // Try common denominators
  for (const denom of [2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 100]) {
    const numer = Math.round(decimal * denom);
    if (Math.abs(numer / denom - decimal) < 0.0001) {
      const g = gcd(numer, denom);
      return `${numer / g}/${denom / g}`;
    }
  }
  return decimal.toFixed(4);
}

export default function ProbabilityCalculatorPage() {
  const [calcType, setCalcType] = useState<CalculationType>("single");
  const [favorableOutcomes, setFavorableOutcomes] = useState("1");
  const [totalOutcomes, setTotalOutcomes] = useState("6");
  const [probA, setProbA] = useState("0.5");
  const [probB, setProbB] = useState("0.3");
  const [probAandB, setProbAandB] = useState("0.15");
  const [independent, setIndependent] = useState(true);
  const [trials, setTrials] = useState("3");

  const result = useMemo<ProbabilityResult | null>(() => {
    if (calcType === "single") {
      const favorable = parseFloat(favorableOutcomes);
      const total = parseFloat(totalOutcomes);
      if (isNaN(favorable) || isNaN(total) || total <= 0 || favorable < 0) return null;
      
      const p = Math.min(favorable / total, 1);
      return {
        probability: p,
        percentage: (p * 100).toFixed(2) + "%",
        odds: probabilityToOdds(p),
        formula: "P(A) = favorable outcomes / total outcomes",
        explanation: `P(A) = ${favorable} / ${total} = ${formatProbability(p)}`,
      };
    }

    const pA = parseFloat(probA);
    const pB = parseFloat(probB);
    
    if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) return null;

    if (calcType === "aAndB") {
      let p: number;
      let formula: string;
      let explanation: string;

      if (independent) {
        p = pA * pB;
        formula = "P(A ∩ B) = P(A) × P(B)   [Independent events]";
        explanation = `P(A ∩ B) = ${pA} × ${pB} = ${formatProbability(p)}`;
      } else {
        const pAB = parseFloat(probAandB);
        if (isNaN(pAB) || pAB < 0 || pAB > Math.min(pA, pB)) return null;
        p = pAB;
        formula = "P(A ∩ B) = given   [Dependent events]";
        explanation = `P(A ∩ B) = ${formatProbability(p)} (provided)`;
      }

      return {
        probability: p,
        percentage: (p * 100).toFixed(2) + "%",
        odds: probabilityToOdds(p),
        formula,
        explanation,
      };
    }

    if (calcType === "aOrB") {
      let pAB: number;
      if (independent) {
        pAB = pA * pB;
      } else {
        pAB = parseFloat(probAandB);
        if (isNaN(pAB) || pAB < 0) return null;
      }
      
      const p = pA + pB - pAB;
      return {
        probability: Math.min(Math.max(p, 0), 1),
        percentage: (Math.min(Math.max(p, 0), 1) * 100).toFixed(2) + "%",
        odds: probabilityToOdds(p),
        formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
        explanation: `P(A ∪ B) = ${pA} + ${pB} - ${formatProbability(pAB)} = ${formatProbability(p)}`,
      };
    }

    if (calcType === "conditional") {
      let pAB: number;
      if (independent) {
        pAB = pA * pB;
      } else {
        pAB = parseFloat(probAandB);
        if (isNaN(pAB) || pAB < 0) return null;
      }
      
      if (pB === 0) return null;
      const p = pAB / pB;
      return {
        probability: p,
        percentage: (p * 100).toFixed(2) + "%",
        odds: probabilityToOdds(p),
        formula: "P(A|B) = P(A ∩ B) / P(B)",
        explanation: `P(A|B) = ${formatProbability(pAB)} / ${pB} = ${formatProbability(p)}`,
      };
    }

    if (calcType === "complement") {
      const p = 1 - pA;
      return {
        probability: p,
        percentage: (p * 100).toFixed(2) + "%",
        odds: probabilityToOdds(p),
        formula: "P(A') = 1 - P(A)",
        explanation: `P(not A) = 1 - ${pA} = ${formatProbability(p)}`,
      };
    }

    if (calcType === "atLeastOne") {
      const n = parseInt(trials);
      if (isNaN(n) || n <= 0) return null;
      
      const pNone = Math.pow(1 - pA, n);
      const p = 1 - pNone;
      return {
        probability: p,
        percentage: (p * 100).toFixed(2) + "%",
        odds: probabilityToOdds(p),
        formula: "P(at least one) = 1 - P(none) = 1 - (1-p)ⁿ",
        explanation: `P(at least one in ${n} trials) = 1 - (1-${pA})^${n} = 1 - ${formatProbability(pNone)} = ${formatProbability(p)}`,
      };
    }

    return null;
  }, [calcType, favorableOutcomes, totalOutcomes, probA, probB, probAandB, independent, trials]);

  return (
    <ToolLayout
      title="Probability Calculator"
      description="Calculate probability for single events, multiple events (AND/OR), conditional probability, complements, and the probability of at least one success in multiple trials."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Standard Deviation Calculator", href: "/standard-deviation-calculator/" },
        { name: "Average Calculator", href: "/average-calculator/" },
        { name: "Scientific Calculator", href: "/scientific-calculator/" },
      ]}
      howToSteps={[
        { name: "Select Type", text: "Choose the type of probability calculation you need." },
        { name: "Enter Values", text: "Input the required probabilities or outcomes." },
        { name: "Specify Independence", text: "Indicate if events are independent or dependent." },
        { name: "View Results", text: "See probability as decimal, percentage, and odds." },
      ]}
      faqs={[
        {
          question: "What is probability and how is it calculated?",
          answer: "Probability measures how likely an event is to occur, ranging from 0 (impossible) to 1 (certain). The basic formula is P(A) = favorable outcomes / total outcomes. For example, the probability of rolling a 4 on a die is 1/6 ≈ 0.167 or 16.7%.",
        },
        {
          question: "What's the difference between independent and dependent events?",
          answer: "Independent events don't affect each other's probability (like coin flips). Dependent events do (like drawing cards without replacement). For independent events, P(A and B) = P(A) × P(B). For dependent events, you need to know P(A and B) directly or use conditional probability.",
        },
        {
          question: "How do I calculate 'A or B' probability?",
          answer: "Use the addition rule: P(A or B) = P(A) + P(B) - P(A and B). You subtract P(A and B) to avoid counting outcomes where both happen twice. For mutually exclusive events (can't happen together), P(A or B) = P(A) + P(B).",
        },
        {
          question: "What is conditional probability?",
          answer: "Conditional probability P(A|B) is the probability of A given that B has occurred. The formula is P(A|B) = P(A and B) / P(B). For example, the probability of a card being a King given it's a face card is P(King|Face) = (4/52) / (12/52) = 1/3.",
        },
      ]}
      content={
        <>
          <h2>Understanding Probability</h2>
          <p>
            Probability is the mathematical study of chance and uncertainty. It quantifies how likely an event is to occur, expressed as a number between 0 (impossible) and 1 (certain), or equivalently as a percentage from 0% to 100%.
          </p>
          <p>
            At its core, probability answers the question: "Out of all possible outcomes, what fraction are favorable?" This simple concept underlies everything from weather forecasting to medical diagnosis to financial risk assessment.
          </p>

          <h2>Basic Probability Formula</h2>
          <p>
            For equally likely outcomes, probability is straightforward:
          </p>
          <p className="font-mono text-lg bg-muted p-4 rounded-lg text-center">
            P(Event) = Number of favorable outcomes / Total number of outcomes
          </p>
          <p>
            For example, the probability of rolling a 6 on a fair die is 1/6 because there's one favorable outcome (rolling 6) out of six total possible outcomes.
          </p>

          <h2>Rules of Probability</h2>

          <h3>The Addition Rule (OR)</h3>
          <p>
            When you want the probability of A OR B (at least one happening):
          </p>
          <p className="font-mono bg-muted p-3 rounded-lg">
            P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
          </p>
          <p>
            We subtract P(A and B) because outcomes where both happen are counted twice. For mutually exclusive events (can't both occur), P(A or B) = P(A) + P(B).
          </p>

          <h3>The Multiplication Rule (AND)</h3>
          <p>
            For independent events (one doesn't affect the other):
          </p>
          <p className="font-mono bg-muted p-3 rounded-lg">
            P(A ∩ B) = P(A) × P(B)
          </p>
          <p>
            For dependent events, use: P(A and B) = P(A) × P(B|A), where P(B|A) is the probability of B given A occurred.
          </p>

          <h3>Complement Rule (NOT)</h3>
          <p>
            The probability of an event NOT happening:
          </p>
          <p className="font-mono bg-muted p-3 rounded-lg">
            P(A') = 1 - P(A)
          </p>
          <p>
            This is extremely useful. It's often easier to calculate "at least one" by computing 1 - P(none).
          </p>

          <h2>Probability vs. Odds</h2>
          <p>
            While probability is a ratio of favorable to total outcomes, odds compare favorable to unfavorable outcomes. If P(A) = 0.25 (1 in 4 chance), the odds are 1:3 (one favorable for every three unfavorable). Bookmakers often use odds rather than probabilities.
          </p>

          <h2>Real-World Applications</h2>
          <ul>
            <li><strong>Gaming:</strong> Understanding casino odds, poker probabilities, lottery chances</li>
            <li><strong>Insurance:</strong> Calculating risk premiums based on event likelihood</li>
            <li><strong>Medicine:</strong> Diagnostic test accuracy, treatment success rates</li>
            <li><strong>Weather:</strong> Rain probability, storm predictions</li>
            <li><strong>Finance:</strong> Risk assessment, option pricing, portfolio theory</li>
            <li><strong>Quality Control:</strong> Defect rates, acceptance sampling</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Calculator Type Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Calculation Type
          </h2>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { value: "single", label: "Single Event", desc: "P(A) = favorable / total" },
              { value: "aAndB", label: "A AND B", desc: "P(A ∩ B) - both events occur" },
              { value: "aOrB", label: "A OR B", desc: "P(A ∪ B) - at least one occurs" },
              { value: "conditional", label: "Conditional", desc: "P(A|B) - A given B occurred" },
              { value: "complement", label: "Complement", desc: "P(A') - event does NOT occur" },
              { value: "atLeastOne", label: "At Least One", desc: "Success in multiple trials" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setCalcType(type.value as CalculationType)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  calcType === type.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <p className={`font-medium ${calcType === type.value ? "text-primary" : "text-foreground"}`}>
                  {type.label}
                </p>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Enter Values</h3>

          {calcType === "single" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Favorable Outcomes
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={favorableOutcomes}
                  onChange={(e) => setFavorableOutcomes(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Total Outcomes
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={totalOutcomes}
                  onChange={(e) => setTotalOutcomes(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {(calcType === "aAndB" || calcType === "aOrB" || calcType === "conditional") && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    P(A) - Probability of A
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={probA}
                    onChange={(e) => setProbA(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    P(B) - Probability of B
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={probB}
                    onChange={(e) => setProbB(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="independent"
                  checked={independent}
                  onChange={(e) => setIndependent(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="independent" className="text-sm text-foreground">
                  Events are independent
                </label>
              </div>

              {!independent && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    P(A ∩ B) - Probability of both A and B
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={probAandB}
                    onChange={(e) => setProbAandB(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {calcType === "complement" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                P(A) - Probability of event A
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={probA}
                onChange={(e) => setProbA(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {calcType === "atLeastOne" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  P(success) - Single trial probability
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={probA}
                  onChange={(e) => setProbA(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Number of trials
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={trials}
                  onChange={(e) => setTrials(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        {result && (
          <>
            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
              <div className="grid gap-4 sm:grid-cols-3 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Probability</p>
                  <p className="text-3xl font-bold text-primary">{formatProbability(result.probability)}</p>
                  <p className="text-sm text-muted-foreground">({toFraction(result.probability)})</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-3xl font-bold text-foreground">{result.percentage}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Odds</p>
                  <p className="text-3xl font-bold text-foreground">{result.odds}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="mb-3 font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Solution
              </h4>
              <p className="text-sm font-mono text-muted-foreground mb-2">{result.formula}</p>
              <p className="text-sm text-foreground">{result.explanation}</p>
            </div>

            {/* Visual Probability Bar */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="mb-3 font-semibold text-foreground flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                Visual Representation
              </h4>
              <div className="h-8 w-full rounded-lg bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${result.probability * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>{result.percentage} chance</span>
                <span>100%</span>
              </div>
            </div>
          </>
        )}

        {/* Quick Examples */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-primary" />
            Common Probability Examples
          </h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground">Coin Flip (Heads)</p>
              <p className="text-muted-foreground">P = 1/2 = 50%</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground">Die Roll (specific number)</p>
              <p className="text-muted-foreground">P = 1/6 ≈ 16.67%</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground">Card (specific suit)</p>
              <p className="text-muted-foreground">P = 13/52 = 25%</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground">Card (specific card)</p>
              <p className="text-muted-foreground">P = 1/52 ≈ 1.92%</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground">Two heads in a row</p>
              <p className="text-muted-foreground">P = 1/4 = 25%</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-medium text-foreground">At least one 6 in 4 dice</p>
              <p className="text-muted-foreground">P ≈ 51.77%</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
