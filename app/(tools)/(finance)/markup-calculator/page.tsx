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
  ArrowUpRight,
  Tag,
  Info,
} from "lucide-react";

interface MarkupResult {
  cost: number;
  markup: number;
  markupAmount: number;
  sellingPrice: number;
  profit: number;
  margin: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateFromCostAndMarkup(cost: number, markup: number): MarkupResult {
  const markupAmount = cost * (markup / 100);
  const sellingPrice = cost + markupAmount;
  const profit = markupAmount;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return { cost, markup, markupAmount, sellingPrice, profit, margin };
}

function calculateFromCostAndPrice(cost: number, sellingPrice: number): MarkupResult {
  const profit = sellingPrice - cost;
  const markupAmount = profit;
  const markup = cost > 0 ? (profit / cost) * 100 : 0;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return { cost, markup, markupAmount, sellingPrice, profit, margin };
}

function calculateFromPriceAndMarkup(sellingPrice: number, markup: number): MarkupResult {
  const cost = sellingPrice / (1 + markup / 100);
  const markupAmount = sellingPrice - cost;
  const profit = markupAmount;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return { cost, markup, markupAmount, sellingPrice, profit, margin };
}

type CalculationMode = "cost-markup" | "cost-price" | "price-markup";

export default function MarkupCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("cost-markup");
  const [cost, setCost] = useState(75);
  const [markup, setMarkup] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(100);

  const result = useMemo(() => {
    switch (mode) {
      case "cost-markup":
        return calculateFromCostAndMarkup(cost, markup);
      case "cost-price":
        return calculateFromCostAndPrice(cost, sellingPrice);
      case "price-markup":
        return calculateFromPriceAndMarkup(sellingPrice, markup);
      default:
        return calculateFromCostAndMarkup(cost, markup);
    }
  }, [mode, cost, markup, sellingPrice]);

  // Common markup percentages for quick selection
  const commonMarkups = [25, 50, 75, 100, 150, 200];

  return (
    <ToolLayout
      title="Markup Calculator"
      description="Calculate selling price, markup percentage, and profit margin from your product cost. Essential for retail pricing, wholesale calculations, and business profitability planning."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Margin Calculator", href: "/margin-calculator/" },
        { name: "Discount Calculator", href: "/discount-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
      ]}
      howToSteps={[
        { name: "Choose Calculation Mode", text: "Select whether you want to calculate from cost and markup, cost and price, or price and markup." },
        { name: "Enter Known Values", text: "Input the values you have based on your chosen calculation mode." },
        { name: "View Results", text: "See your selling price, markup amount, and equivalent margin." },
        { name: "Use Quick Markups", text: "Try common markup percentages to compare pricing options." },
      ]}
      faqs={[
        {
          question: "What is markup in business?",
          answer: "Markup is the percentage added to a product's cost to determine its selling price. If a product costs $50 and you add a 50% markup, the markup amount is $25 and the selling price is $75. The formula is: Selling Price = Cost × (1 + Markup/100).",
        },
        {
          question: "What's a typical markup for retail?",
          answer: "Retail markups vary widely by industry. Clothing often uses 100-300% markup, electronics 30-50%, groceries 10-30%, and jewelry 100-400%. The right markup depends on your costs, competition, and target market.",
        },
        {
          question: "How is markup different from margin?",
          answer: "Markup is calculated on cost: (Price - Cost) ÷ Cost × 100. Margin is calculated on price: (Price - Cost) ÷ Price × 100. A 50% markup equals a 33.33% margin. A 100% markup equals a 50% margin.",
        },
        {
          question: "How do I determine the right markup for my products?",
          answer: "Consider: 1) Your total costs including overhead, 2) Competitor pricing, 3) Your target profit margin, 4) Market demand and price sensitivity. Start with covering costs plus desired profit, then adjust based on market response.",
        },
      ]}
      content={
        <>
          <h2>Understanding Markup Pricing</h2>
          <p>
            Markup is one of the most common pricing strategies in retail and wholesale. It's simply the percentage you add to your cost to arrive at a selling price. Understanding markup helps you price products profitably while staying competitive in your market.
          </p>
          <p>
            The markup formula is straightforward: <strong>Selling Price = Cost × (1 + Markup%/100)</strong>. For example, with a $50 cost and 100% markup: Selling Price = $50 × (1 + 1) = $100. Your profit would be $50.
          </p>

          <h2>Markup Strategies by Industry</h2>
          <p>
            Different industries use different standard markups based on factors like inventory turnover, spoilage risk, and competitive dynamics:
          </p>
          <ul>
            <li><strong>Grocery/Supermarket:</strong> 10-30% (high volume, low margins)</li>
            <li><strong>Electronics:</strong> 30-50% (competitive market, fast depreciation)</li>
            <li><strong>Clothing/Apparel:</strong> 100-300% (seasonal inventory, returns)</li>
            <li><strong>Jewelry:</strong> 100-400% (specialty items, craftsmanship)</li>
            <li><strong>Restaurants:</strong> 300-400% on food, 400-600% on beverages</li>
          </ul>

          <h2>The Keystoning Rule</h2>
          <p>
            "Keystoning" is the practice of marking up products by 100% (doubling the cost). If something costs you $50, you sell it for $100. This has been a retail standard for decades because it's simple and typically covers overhead costs while generating profit.
          </p>
          <p>
            However, keystoning doesn't work for all products. Low-margin categories like electronics may only support 30-40% markup, while specialty items might justify 200% or more. Always consider your specific costs and competitive environment.
          </p>

          <h2>Converting Between Markup and Margin</h2>
          <p>
            It's important to know both your markup and margin. The conversion formulas are:
          </p>
          <ul>
            <li><strong>Markup to Margin:</strong> Margin = Markup ÷ (100 + Markup) × 100</li>
            <li><strong>Margin to Markup:</strong> Markup = Margin ÷ (100 - Margin) × 100</li>
          </ul>
          <p>
            Quick reference: 50% markup = 33.33% margin. 100% markup = 50% margin. 200% markup = 66.67% margin.
          </p>

          <h2>Pricing Beyond Cost-Plus Markup</h2>
          <p>
            While markup pricing is straightforward, also consider value-based pricing (what customers will pay), competitive pricing (matching or undercutting competitors), and psychological pricing ($9.99 vs $10). The best pricing strategy often combines multiple approaches.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-amber-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Tag className="h-5 w-5 text-primary" />
            Markup Calculator
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Calculation Mode
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                onClick={() => setMode("cost-markup")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "cost-markup"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Cost + Markup %
              </button>
              <button
                onClick={() => setMode("cost-price")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "cost-price"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Cost + Selling Price
              </button>
              <button
                onClick={() => setMode("price-markup")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "price-markup"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                Price + Markup %
              </button>
            </div>
          </div>

          {/* Dynamic Inputs based on mode */}
          <div className="grid gap-4 sm:grid-cols-2">
            {(mode === "cost-markup" || mode === "cost-price") && (
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

            {(mode === "cost-markup" || mode === "price-markup") && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  Markup %
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {(mode === "cost-price" || mode === "price-markup") && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Selling Price
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Quick Markup Buttons */}
          {mode === "cost-markup" && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Quick Markup Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {commonMarkups.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMarkup(m)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      markup === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {m}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formula Display */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Formula Applied</span>
          </div>
          <code className="text-sm text-muted-foreground">
            {mode === "cost-markup" && (
              <>Selling Price = Cost × (1 + Markup/100) = {formatCurrency(result.cost)} × (1 + {result.markup}%/100) = {formatCurrency(result.sellingPrice)}</>
            )}
            {mode === "cost-price" && (
              <>Markup = (Price - Cost) ÷ Cost × 100 = ({formatCurrency(result.sellingPrice)} - {formatCurrency(result.cost)}) ÷ {formatCurrency(result.cost)} × 100 = {result.markup.toFixed(2)}%</>
            )}
            {mode === "price-markup" && (
              <>Cost = Price ÷ (1 + Markup/100) = {formatCurrency(result.sellingPrice)} ÷ (1 + {result.markup}%/100) = {formatCurrency(result.cost)}</>
            )}
          </code>
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-7 w-7 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Cost</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.cost)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <ArrowUpRight className="h-7 w-7 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Markup</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {result.markup.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  ({formatCurrency(result.markupAmount)})
                </p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Selling Price</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(result.sellingPrice)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Percent className="h-7 w-7 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Margin</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {result.margin.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Price Breakdown
              </h3>

              <div className="space-y-4">
                {/* Stacked Bar */}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-10">
                    <div
                      className="bg-blue-500 transition-all flex items-center justify-center"
                      style={{
                        width: `${result.sellingPrice > 0 ? (result.cost / result.sellingPrice) * 100 : 0}%`,
                      }}
                      title={`Cost: ${formatCurrency(result.cost)}`}
                    >
                      {result.sellingPrice > 0 && (result.cost / result.sellingPrice) * 100 > 20 && (
                        <span className="text-xs text-white font-medium">Cost</span>
                      )}
                    </div>
                    <div
                      className="bg-amber-500 transition-all flex items-center justify-center"
                      style={{
                        width: `${result.sellingPrice > 0 ? (result.profit / result.sellingPrice) * 100 : 0}%`,
                      }}
                      title={`Profit: ${formatCurrency(result.profit)}`}
                    >
                      {result.sellingPrice > 0 && (result.profit / result.sellingPrice) * 100 > 15 && (
                        <span className="text-xs text-white font-medium">Profit</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Cost: {formatCurrency(result.cost)} ({result.sellingPrice > 0 ? ((result.cost / result.sellingPrice) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-amber-500" />
                    <span className="text-muted-foreground">
                      Profit: {formatCurrency(result.profit)} ({result.margin.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Markup vs Margin Comparison */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Markup to Margin Conversion
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-amber-500/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Markup</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{result.markup.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Profit ÷ Cost</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Margin</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{result.margin.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Profit ÷ Price</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  A <strong className="text-amber-600 dark:text-amber-400">{result.markup.toFixed(1)}% markup</strong> on {formatCurrency(result.cost)} gives a selling price of{" "}
                  <strong className="text-foreground">{formatCurrency(result.sellingPrice)}</strong> with a{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">{result.margin.toFixed(1)}% profit margin</strong>.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
