"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
  Target,
  BarChart3,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

interface MarginResult {
  cost: number;
  revenue: number;
  profit: number;
  margin: number;
  markup: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateFromCostAndRevenue(cost: number, revenue: number): MarginResult {
  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return { cost, revenue, profit, margin, markup };
}

function calculateFromCostAndMargin(cost: number, margin: number): MarginResult {
  const revenue = margin < 100 ? cost / (1 - margin / 100) : cost;
  const profit = revenue - cost;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return { cost, revenue, profit, margin, markup };
}

function calculateFromCostAndMarkup(cost: number, markup: number): MarginResult {
  const profit = cost * (markup / 100);
  const revenue = cost + profit;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return { cost, revenue, profit, margin, markup };
}

function calculateFromRevenueAndMargin(revenue: number, margin: number): MarginResult {
  const profit = revenue * (margin / 100);
  const cost = revenue - profit;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;

  return { cost, revenue, profit, margin, markup };
}

type CalculationMode = "cost-revenue" | "cost-margin" | "cost-markup" | "revenue-margin";

export default function MarginCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("cost-revenue");
  const [cost, setCost] = useState(60);
  const [revenue, setRevenue] = useState(100);
  const [targetMargin, setTargetMargin] = useState(40);
  const [targetMarkup, setTargetMarkup] = useState(66.67);

  const result = useMemo(() => {
    switch (mode) {
      case "cost-revenue":
        return calculateFromCostAndRevenue(cost, revenue);
      case "cost-margin":
        return calculateFromCostAndMargin(cost, targetMargin);
      case "cost-markup":
        return calculateFromCostAndMarkup(cost, targetMarkup);
      case "revenue-margin":
        return calculateFromRevenueAndMargin(revenue, targetMargin);
      default:
        return calculateFromCostAndRevenue(cost, revenue);
    }
  }, [mode, cost, revenue, targetMargin, targetMarkup]);

  return (
    <ToolLayout
      title="Margin Calculator"
      description="Calculate profit margin, markup percentage, and profit from cost and selling price. Essential for business pricing decisions, understanding profitability, and financial planning."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Markup Calculator", href: "/markup-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Discount Calculator", href: "/discount-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
      ]}
      howToSteps={[
        { name: "Choose Calculation Mode", text: "Select what values you know (cost and revenue, cost and margin, etc.)." },
        { name: "Enter Known Values", text: "Input the values you have based on your chosen mode." },
        { name: "View Results", text: "See your profit, margin percentage, and markup instantly." },
        { name: "Compare Modes", text: "Try different modes to plan pricing strategies." },
      ]}
      faqs={[
        {
          question: "What is the difference between margin and markup?",
          answer: "Margin is calculated from the selling price (profit ÷ revenue × 100), while markup is calculated from the cost (profit ÷ cost × 100). For example, if cost is $60 and price is $100: margin is 40% ($40 ÷ $100), but markup is 66.67% ($40 ÷ $60). Margin is always lower than markup for the same item.",
        },
        {
          question: "Which should I use: margin or markup?",
          answer: "Margin is commonly used in financial statements and when discussing profitability (e.g., 'we have a 40% margin'). Markup is often used in retail and pricing decisions (e.g., 'we mark up products by 100%'). Know both to communicate effectively in different contexts.",
        },
        {
          question: "What is a good profit margin?",
          answer: "Good margins vary by industry. Retail typically sees 20-50% gross margins, software can reach 70-90%, while grocery stores operate on 1-3%. Net profit margins of 10%+ are generally considered good. Always compare to industry benchmarks.",
        },
        {
          question: "How do I convert between margin and markup?",
          answer: "Margin to Markup: Markup = Margin ÷ (1 - Margin). Markup to Margin: Margin = Markup ÷ (1 + Markup). For example: 40% margin = 40 ÷ 60 = 66.67% markup. 50% markup = 50 ÷ 150 = 33.33% margin.",
        },
      ]}
      content={
        <>
          <h2>Understanding Profit Margin</h2>
          <p>
            Profit margin measures what percentage of your revenue is actual profit. It's one of the most important metrics for understanding business profitability. A higher margin means you keep more of each dollar earned, while a lower margin means more goes to costs.
          </p>
          <p>
            The formula for profit margin is: <strong>Margin = (Revenue - Cost) ÷ Revenue × 100</strong>. This tells you what percentage of your selling price is profit. For example, if you sell something for $100 that cost you $60, your margin is 40%.
          </p>

          <h2>Margin vs. Markup: A Critical Distinction</h2>
          <p>
            Many people confuse margin and markup, but they're calculated differently and give different percentages for the same transaction. Markup is based on cost, while margin is based on selling price.
          </p>
          <ul>
            <li><strong>Margin:</strong> Profit ÷ Selling Price = 40 ÷ 100 = 40%</li>
            <li><strong>Markup:</strong> Profit ÷ Cost = 40 ÷ 60 = 66.67%</li>
          </ul>
          <p>
            Knowing this difference prevents costly pricing mistakes. If you want a 50% margin, you need a 100% markup. If you apply a 50% markup thinking it's the margin, you'll only achieve a 33.33% margin.
          </p>

          <h2>Types of Profit Margins</h2>
          <p>
            Businesses track several margin types for different purposes:
          </p>
          <ul>
            <li><strong>Gross Margin:</strong> Revenue minus cost of goods sold (COGS). Shows profitability before operating expenses.</li>
            <li><strong>Operating Margin:</strong> Revenue minus all operating expenses. Shows core business profitability.</li>
            <li><strong>Net Margin:</strong> Revenue minus all expenses including taxes. Shows overall profitability.</li>
          </ul>

          <h2>Using Margins for Pricing Decisions</h2>
          <p>
            Understanding your costs and required margins helps set profitable prices. Start with your cost, determine your target margin, and calculate the selling price. Remember to account for all costs including overhead, not just direct product costs.
          </p>
          <p>
            Compare your margins to industry standards and competitors. If your margins are significantly lower, you may need to reduce costs, increase prices, or reconsider your business model. Regularly reviewing margins helps identify problems early.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Margin Calculator
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Calculation Mode
            </label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => setMode("cost-revenue")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "cost-revenue"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Cost & Revenue
              </button>
              <button
                onClick={() => setMode("cost-margin")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "cost-margin"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Cost & Margin %
              </button>
              <button
                onClick={() => setMode("cost-markup")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "cost-markup"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Cost & Markup %
              </button>
              <button
                onClick={() => setMode("revenue-margin")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "revenue-margin"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Revenue & Margin %
              </button>
            </div>
          </div>

          {/* Dynamic Inputs based on mode */}
          <div className="grid gap-4 sm:grid-cols-2">
            {(mode === "cost-revenue" || mode === "cost-margin" || mode === "cost-markup") && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Cost
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {(mode === "cost-revenue" || mode === "revenue-margin") && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  {mode === "cost-revenue" ? "Selling Price (Revenue)" : "Revenue"}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {(mode === "cost-margin" || mode === "revenue-margin") && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  Target Margin (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={99.99}
                  step={0.01}
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {mode === "cost-markup" && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  Markup (%)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={targetMarkup}
                  onChange={(e) => setTargetMarkup(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground">Cost</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.cost)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Target className="h-6 w-6 text-indigo-500" />
                </div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(result.revenue)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.profit)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Percent className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Margin</p>
                <p className="text-lg font-bold text-foreground">
                  {result.margin.toFixed(2)}%
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <ArrowUpRight className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground">Markup</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {result.markup.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Revenue Breakdown
              </h3>

              <div className="space-y-4">
                {/* Stacked Bar */}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${result.revenue > 0 ? (result.cost / result.revenue) * 100 : 0}%`,
                      }}
                      title={`Cost: ${formatCurrency(result.cost)}`}
                    />
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{
                        width: `${result.revenue > 0 ? (result.profit / result.revenue) * 100 : 0}%`,
                      }}
                      title={`Profit: ${formatCurrency(result.profit)}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Cost ({result.revenue > 0 ? ((result.cost / result.revenue) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                    <span className="text-muted-foreground">
                      Profit ({result.margin.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Margin vs Markup Comparison */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Margin vs. Markup Comparison
              </h3>

              <div className="flex items-center justify-center gap-4 py-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <p className="text-3xl font-bold text-primary">{result.margin.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">of selling price</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Markup</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{result.markup.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">of cost</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  Selling at {formatCurrency(result.revenue)} with a cost of {formatCurrency(result.cost)} gives you a{" "}
                  <strong className="text-primary">{result.margin.toFixed(1)}% margin</strong> (profit as % of price) or{" "}
                  <strong className="text-amber-600 dark:text-amber-400">{result.markup.toFixed(1)}% markup</strong> (profit as % of cost).
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
