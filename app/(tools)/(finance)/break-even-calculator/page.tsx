"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Package,
  TrendingUp,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  profitAtTarget: number;
  isAboveBreakEven: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BreakEvenCalculatorPage() {
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [pricePerUnit, setPricePerUnit] = useState(100);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(40);
  const [targetUnits, setTargetUnits] = useState(1000);

  const result = useMemo((): BreakEvenResult | null => {
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    
    if (contributionMargin <= 0) {
      return null; // Can't break even if contribution margin is zero or negative
    }

    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;
    const contributionMarginRatio = (contributionMargin / pricePerUnit) * 100;
    const profitAtTarget = (targetUnits * contributionMargin) - fixedCosts;
    const isAboveBreakEven = targetUnits >= breakEvenUnits;

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
      profitAtTarget,
      isAboveBreakEven,
    };
  }, [fixedCosts, pricePerUnit, variableCostPerUnit, targetUnits]);

  // Generate data for the chart visualization
  const chartData = useMemo(() => {
    if (!result) return [];
    
    const maxUnits = Math.max(result.breakEvenUnits * 2, targetUnits * 1.5);
    const points = [];
    
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 20)) {
      const revenue = units * pricePerUnit;
      const totalCost = fixedCosts + (units * variableCostPerUnit);
      const profit = revenue - totalCost;
      points.push({ units, revenue, totalCost, profit });
    }
    
    return points;
  }, [result, fixedCosts, pricePerUnit, variableCostPerUnit, targetUnits]);

  return (
    <ToolLayout
      title="Break-Even Calculator"
      description="Calculate your break-even point to determine how many units you need to sell or how much revenue you need to cover all costs. Essential for pricing decisions and business planning."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Profit Calculator", href: "/profit-calculator/" },
        { name: "Margin Calculator", href: "/margin-calculator/" },
        { name: "Markup Calculator", href: "/markup-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Fixed Costs", text: "Input your total fixed costs (rent, salaries, insurance, etc.)." },
        { name: "Set Selling Price", text: "Enter your price per unit or average sale price." },
        { name: "Add Variable Costs", text: "Include cost per unit (materials, shipping, commission)." },
        { name: "View Break-Even", text: "See exactly how many units or dollars you need to break even." },
      ]}
      faqs={[
        {
          question: "What is the break-even point?",
          answer: "The break-even point is where total revenue equals total costs—you're not making a profit or loss. It tells you the minimum sales needed to cover all expenses. Selling above this point generates profit; below it results in losses.",
        },
        {
          question: "What's the difference between fixed and variable costs?",
          answer: "Fixed costs stay the same regardless of sales volume (rent, salaries, insurance). Variable costs change with each unit sold (materials, shipping, commissions). Understanding this split is crucial for accurate break-even analysis.",
        },
        {
          question: "What is contribution margin?",
          answer: "Contribution margin is selling price minus variable cost per unit. It's the amount each unit 'contributes' toward covering fixed costs and generating profit. Higher contribution margins mean reaching break-even faster.",
        },
        {
          question: "How can I lower my break-even point?",
          answer: "Lower break-even by: increasing prices (higher contribution margin), reducing variable costs per unit, or cutting fixed costs. Even small improvements in any area can significantly impact your break-even point.",
        },
      ]}
      content={
        <>
          <h2>Understanding Break-Even Analysis</h2>
          <p>
            Break-even analysis is a fundamental business calculation that determines when your revenue will cover all costs. At the break-even point, profit is zero—you're neither making nor losing money. Every unit sold beyond this point contributes directly to profit, while falling short means operating at a loss.
          </p>
          <p>
            The break-even formula is: <strong>Break-Even Units = Fixed Costs ÷ (Price - Variable Cost per Unit)</strong>. The denominator (Price - Variable Cost) is called the contribution margin, representing how much each sale contributes toward covering fixed costs.
          </p>

          <h2>Fixed vs. Variable Costs</h2>
          <p>
            Accurately categorizing costs is essential for break-even analysis:
          </p>
          <ul>
            <li><strong>Fixed Costs:</strong> Rent, salaries, insurance, loan payments, software subscriptions—costs that don't change with sales volume</li>
            <li><strong>Variable Costs:</strong> Raw materials, shipping, sales commissions, payment processing fees—costs that increase with each sale</li>
            <li><strong>Semi-Variable:</strong> Some costs have both components (utilities, overtime wages)—split them appropriately</li>
          </ul>

          <h2>Using Break-Even for Decision Making</h2>
          <p>
            Break-even analysis helps answer critical business questions: Is this product viable? Should I raise prices? Can I afford to hire? What happens if I discount? By modeling different scenarios, you can make data-driven decisions rather than guessing.
          </p>
          <p>
            For new products, calculate break-even before launch. Can you realistically sell that many units? What marketing investment is needed? If break-even seems unreachable, reconsider pricing, costs, or whether to proceed at all.
          </p>

          <h2>The Contribution Margin Ratio</h2>
          <p>
            The contribution margin ratio (CMR) shows what percentage of each sale goes toward covering fixed costs: <strong>CMR = (Price - Variable Cost) ÷ Price × 100</strong>. Higher ratios mean you keep more of each dollar.
          </p>
          <p>
            You can also calculate break-even in revenue terms: <strong>Break-Even Revenue = Fixed Costs ÷ CMR</strong>. This is useful when you sell multiple products at different prices—you can determine total revenue needed rather than units of a specific product.
          </p>

          <h2>Limitations of Break-Even Analysis</h2>
          <p>
            Break-even assumes costs are perfectly linear and fixed costs stay constant at all volumes—which isn't always true. Rent might increase if you need more space, and variable costs may decrease with bulk purchasing. Use break-even as a starting point, not the final word.
          </p>
          <p>
            Also consider time: how long will it take to reach break-even? A venture that breaks even in 3 months is very different from one taking 3 years. Factor in cash flow needs and the time value of money.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-amber-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Break-Even Calculator
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Total Fixed Costs
              </label>
              <input
                type="number"
                min={0}
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Rent, salaries, insurance, etc.</p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Selling Price per Unit
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Variable Cost per Unit
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Materials, shipping, commission</p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Package className="h-4 w-4" />
                Target Sales (Units)
              </label>
              <input
                type="number"
                min={0}
                value={targetUnits}
                onChange={(e) => setTargetUnits(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Your projected sales</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {!result && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-400">
              <strong>Cannot calculate break-even:</strong> Your variable cost per unit ({formatCurrency(variableCostPerUnit)}) must be less than your selling price ({formatCurrency(pricePerUnit)}). You're losing money on every sale.
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Break-Even Units</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(Math.ceil(result.breakEvenUnits))}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Break-Even Revenue</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.breakEvenRevenue)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Contribution Margin</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.contributionMargin)}
                </p>
                <p className="text-xs text-muted-foreground">per unit ({result.contributionMarginRatio.toFixed(1)}%)</p>
              </div>

              <div className={`rounded-xl border p-4 text-center ${result.isAboveBreakEven ? "border-emerald-500/50 bg-emerald-500/10" : "border-red-500/50 bg-red-500/10"}`}>
                <div className="mb-2 flex justify-center">
                  {result.isAboveBreakEven ? (
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Profit at {formatNumber(targetUnits)} Units</p>
                <p className={`text-2xl font-bold ${result.profitAtTarget >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(result.profitAtTarget)}
                </p>
              </div>
            </div>

            {/* Target vs Break-Even Comparison */}
            <div className={`rounded-xl border p-4 ${result.isAboveBreakEven ? "border-emerald-500/30 bg-emerald-500/10" : "border-amber-500/30 bg-amber-500/10"}`}>
              {result.isAboveBreakEven ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  ✅ Your target of <strong>{formatNumber(targetUnits)} units</strong> is <strong>{formatNumber(targetUnits - Math.ceil(result.breakEvenUnits))} units above</strong> break-even. You'll generate <strong>{formatCurrency(result.profitAtTarget)}</strong> in profit!
                </p>
              ) : (
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  ⚠️ Your target of <strong>{formatNumber(targetUnits)} units</strong> is <strong>{formatNumber(Math.ceil(result.breakEvenUnits) - targetUnits)} units below</strong> break-even. You need to sell <strong>{formatNumber(Math.ceil(result.breakEvenUnits) - targetUnits)} more units</strong> to avoid a loss.
                </p>
              )}
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Break-Even Visualization
              </h3>

              <div className="space-y-4">
                {/* Simple bar visualization */}
                <div className="relative h-24 rounded-lg bg-muted/30 overflow-hidden">
                  {/* Break-even line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                    style={{ left: `${Math.min((result.breakEvenUnits / (Math.max(result.breakEvenUnits, targetUnits) * 1.5)) * 100, 95)}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-primary">
                      Break-Even: {formatNumber(Math.ceil(result.breakEvenUnits))}
                    </div>
                  </div>

                  {/* Loss zone */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-red-500/20"
                    style={{ width: `${Math.min((result.breakEvenUnits / (Math.max(result.breakEvenUnits, targetUnits) * 1.5)) * 100, 95)}%` }}
                  />

                  {/* Profit zone */}
                  <div 
                    className="absolute top-0 bottom-0 right-0 bg-emerald-500/20"
                    style={{ left: `${Math.min((result.breakEvenUnits / (Math.max(result.breakEvenUnits, targetUnits) * 1.5)) * 100, 95)}%` }}
                  />

                  {/* Target marker */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${result.isAboveBreakEven ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ left: `calc(${Math.min((targetUnits / (Math.max(result.breakEvenUnits, targetUnits) * 1.5)) * 100, 95)}% - 8px)` }}
                  >
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-xs font-medium text-foreground">
                      Target: {formatNumber(targetUnits)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500/50" />
                    <span className="text-muted-foreground">Loss Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500/50" />
                    <span className="text-muted-foreground">Profit Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-0.5 bg-primary" />
                    <span className="text-muted-foreground">Break-Even Point</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Calculation Breakdown
              </h3>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Contribution Margin =</span>
                  <span className="text-foreground">{formatCurrency(pricePerUnit)}</span>
                  <span className="text-muted-foreground">−</span>
                  <span className="text-foreground">{formatCurrency(variableCostPerUnit)}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.contributionMargin)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Break-Even Units =</span>
                  <span className="text-foreground">{formatCurrency(fixedCosts)}</span>
                  <span className="text-muted-foreground">÷</span>
                  <span className="text-foreground">{formatCurrency(result.contributionMargin)}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-bold text-primary">{result.breakEvenUnits.toFixed(2)} units</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Break-Even Revenue =</span>
                  <span className="text-foreground">{result.breakEvenUnits.toFixed(2)}</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="text-foreground">{formatCurrency(pricePerUnit)}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(result.breakEvenRevenue)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
