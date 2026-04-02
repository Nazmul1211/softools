"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Calculator, DollarSign, Percent, TrendingUp } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export default function InflationCalculatorPage() {
  const [amount, setAmount] = useState(100);
  const [annualRate, setAnnualRate] = useState(3);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const growthFactor = Math.pow(1 + annualRate / 100, years);
    const futurePrice = amount * growthFactor;
    const purchasingPower = growthFactor > 0 ? amount / growthFactor : amount;
    const totalIncrease = futurePrice - amount;

    return { futurePrice, purchasingPower, totalIncrease, growthFactor };
  }, [amount, annualRate, years]);

  return (
    <ToolLayout
      title="Inflation Calculator"
      description="Estimate how inflation affects prices and purchasing power over time. Quickly see future cost, buying power erosion, and total inflation impact."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Savings Calculator", href: "/savings-calculator/" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Simple Interest Calculator", href: "/simple-interest-calculator/" },
        { name: "Sales Tax Calculator", href: "/sales-tax-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Current Amount", text: "Start with today's price or budget amount." },
        { name: "Set Inflation Rate", text: "Use expected annual inflation percentage." },
        { name: "Choose Time Period", text: "Select how many years to project." },
        { name: "Review Results", text: "Compare future cost and lost purchasing power." },
      ]}
      faqs={[
        {
          question: "What does this inflation calculator show?",
          answer:
            "It projects how a current amount may change with compound annual inflation. You can see a future equivalent price and how much purchasing power is reduced over time.",
        },
        {
          question: "Why is inflation compounded?",
          answer:
            "Inflation compounds because each year’s price increase applies to the already increased amount from previous years, not the original value alone.",
        },
        {
          question: "Can I use this for budgeting?",
          answer:
            "Yes. It helps estimate future living costs, tuition, rent, or project budgets so you can plan savings and income targets more realistically.",
        },
      ]}
      content={
        <>
          <h2>What inflation means for real-world costs</h2>
          <p>
            Inflation is the gradual rise in the general price level of goods and services. When prices
            increase over time, each dollar buys fewer items than before. This is why long-term budgeting,
            retirement planning, and salary goals should always include an inflation adjustment.
          </p>
          <p>
            A 3% inflation rate may look small in one year, but over a decade it creates a meaningful
            difference in cost. Compounding is the key reason. Each year increases the new price, not the
            original one, so future values can drift much higher than expected.
          </p>

          <h2>How to use inflation projections in decisions</h2>
          <p>
            Use inflation-adjusted projections when comparing long-term options. For example, when setting
            savings goals, include expected future costs instead of today&apos;s prices. For contracts, evaluate
            whether fixed payments keep pace with expected inflation.
          </p>
          <p>
            This calculator provides directional guidance, not a guaranteed forecast. Actual inflation can
            vary by region, product category, and market cycle. Revisit your assumptions periodically and
            test best-case and worst-case scenarios.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Inflation Inputs
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" /> Current Amount
              </label>
              <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" /> Annual Inflation Rate
              </label>
              <input type="number" min={0} step={0.1} value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" /> Years
              </label>
              <input type="number" min={0} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Future Price</p>
            <p className="text-2xl font-bold">{formatCurrency(result.futurePrice)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Increase</p>
            <p className="text-2xl font-bold">{formatCurrency(result.totalIncrease)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Growth Multiplier</p>
            <p className="text-2xl font-bold">{result.growthFactor.toFixed(3)}x</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Buying Power of Same Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(result.purchasingPower)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Assumption summary: {formatPercent(annualRate)} annual inflation for {years} years.
        </div>
      </div>
    </ToolLayout>
  );
}
