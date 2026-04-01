"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ArrowRight,
  Minus,
} from "lucide-react";

interface ProfitResult {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: number;
  operatingProfit: number;
  operatingMargin: number;
  otherExpenses: number;
  netProfit: number;
  netMargin: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return value.toFixed(2) + "%";
}

export default function ProfitCalculatorPage() {
  const [revenue, setRevenue] = useState(100000);
  const [cogs, setCogs] = useState(40000);
  const [operatingExpenses, setOperatingExpenses] = useState(25000);
  const [otherExpenses, setOtherExpenses] = useState(5000);

  const result = useMemo((): ProfitResult => {
    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingProfit = grossProfit - operatingExpenses;
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
    const netProfit = operatingProfit - otherExpenses;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      revenue,
      cogs,
      grossProfit,
      grossMargin,
      operatingExpenses,
      operatingProfit,
      operatingMargin,
      otherExpenses,
      netProfit,
      netMargin,
    };
  }, [revenue, cogs, operatingExpenses, otherExpenses]);

  const isProfitable = result.netProfit >= 0;

  return (
    <ToolLayout
      title="Profit Calculator"
      description="Calculate gross profit, operating profit, and net profit for your business. Understand your profit margins at every level and analyze your business profitability."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Margin Calculator", href: "/margin-calculator/" },
        { name: "Markup Calculator", href: "/markup-calculator/" },
        { name: "Break-Even Calculator", href: "/break-even-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Revenue", text: "Input your total sales revenue for the period." },
        { name: "Add Cost of Goods Sold", text: "Enter direct costs associated with producing your goods or services." },
        { name: "Add Operating Expenses", text: "Include overhead like rent, salaries, marketing, and utilities." },
        { name: "Review Profits", text: "See gross, operating, and net profit with margin percentages." },
      ]}
      faqs={[
        {
          question: "What's the difference between gross, operating, and net profit?",
          answer: "Gross profit is revenue minus cost of goods sold (COGS). Operating profit is gross profit minus operating expenses (rent, salaries, etc.). Net profit is what remains after all expenses including taxes and interest. Each shows profitability at different levels of the business.",
        },
        {
          question: "What is a good profit margin?",
          answer: "Good margins vary by industry. Retail averages 2-5% net margin, software can reach 20-30%, and professional services often see 15-25%. Gross margins should typically be 30-50% for product businesses. Compare to your industry benchmarks.",
        },
        {
          question: "What are cost of goods sold (COGS)?",
          answer: "COGS are direct costs to produce what you sell: raw materials, manufacturing labor, shipping to customers, packaging. It excludes indirect costs like office rent, marketing, and administrative salaries—those are operating expenses.",
        },
        {
          question: "How can I improve profit margins?",
          answer: "Increase prices if the market allows, reduce COGS through better supplier deals or efficiency, cut unnecessary operating expenses, increase volume to spread fixed costs, or focus on higher-margin products/services. Regularly analyze where money goes.",
        },
      ]}
      content={
        <>
          <h2>Understanding Business Profit</h2>
          <p>
            Profit is the financial gain remaining after all expenses are deducted from revenue. But not all profit is created equal—understanding the different levels of profit helps you identify where your business excels and where it needs improvement. This calculator breaks down your profit at three critical levels: gross, operating, and net.
          </p>
          <p>
            Each profit level tells a different story. Gross profit shows how efficiently you produce and price your products. Operating profit reveals how well you manage day-to-day business operations. Net profit is the bottom line—what's actually left for owners and reinvestment.
          </p>

          <h2>Gross Profit: Your Production Efficiency</h2>
          <p>
            Gross profit equals revenue minus cost of goods sold (COGS). It measures how efficiently you produce what you sell. A healthy gross margin indicates good pricing and efficient production. Low gross margins may signal pricing problems, high supplier costs, or production inefficiencies.
          </p>
          <p>
            Industry benchmarks for gross margin: Manufacturing 25-35%, retail 25-50%, software 70-85%, restaurants 60-70%. If your gross margin is below industry norms, focus on negotiating better supplier terms, reducing waste, or adjusting pricing.
          </p>

          <h2>Operating Profit: Business Management</h2>
          <p>
            Operating profit (also called EBIT - Earnings Before Interest and Taxes) is gross profit minus operating expenses. These include rent, utilities, salaries, marketing, insurance, and administrative costs. Operating margin shows how well you run the business day-to-day.
          </p>
          <p>
            Strong operating margins indicate efficient operations and good cost control. If your gross margin is healthy but operating margin is low, examine your operating expenses. Are you overspending on marketing with poor returns? Is your rent too high? Are you overstaffed?
          </p>

          <h2>Net Profit: The Bottom Line</h2>
          <p>
            Net profit is what remains after all expenses—including interest, taxes, depreciation, and one-time costs. This is the true measure of business success and what's available for dividends, reinvestment, or building reserves.
          </p>
          <p>
            Healthy businesses typically maintain 10-20% net profit margins, though this varies dramatically by industry. Grocery stores operate on 1-3% net margins with high volume, while software companies may reach 20-30% or higher. Consistency matters more than hitting any specific number.
          </p>

          <h2>Using Profit Analysis for Decision Making</h2>
          <p>
            Regularly calculating and tracking profit at all levels helps you make informed decisions: Should you raise prices? Cut costs? Invest in marketing? Hire more staff? By understanding where profit is made and lost, you can allocate resources effectively and grow sustainably.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Profit Calculator
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </label>
              <input
                type="number"
                min={0}
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                Cost of Goods Sold (COGS)
              </label>
              <input
                type="number"
                min={0}
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Direct costs: materials, production labor, shipping</p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                Operating Expenses
              </label>
              <input
                type="number"
                min={0}
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Rent, salaries, marketing, utilities, insurance</p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                Other Expenses (Interest, Taxes, etc.)
              </label>
              <input
                type="number"
                min={0}
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Interest, taxes, depreciation, one-time costs</p>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Gross Profit</span>
              <span className={`text-sm font-bold ${result.grossProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {formatPercent(result.grossMargin)} margin
              </span>
            </div>
            <p className={`text-2xl font-bold ${result.grossProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {formatCurrency(result.grossProfit)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Revenue − COGS</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Operating Profit</span>
              <span className={`text-sm font-bold ${result.operatingProfit >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                {formatPercent(result.operatingMargin)} margin
              </span>
            </div>
            <p className={`text-2xl font-bold ${result.operatingProfit >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
              {formatCurrency(result.operatingProfit)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Gross Profit − Operating Expenses</p>
          </div>

          <div className={`rounded-xl border p-4 ${isProfitable ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5" : "border-red-500/50 bg-red-500/10"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Net Profit</span>
              <span className={`text-sm font-bold ${isProfitable ? "text-primary" : "text-red-600 dark:text-red-400"}`}>
                {formatPercent(result.netMargin)} margin
              </span>
            </div>
            <p className={`text-2xl font-bold ${isProfitable ? "text-foreground" : "text-red-600 dark:text-red-400"}`}>
              {formatCurrency(result.netProfit)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Operating Profit − Other Expenses</p>
          </div>
        </div>

        {/* Profit Waterfall */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            Profit Breakdown (Waterfall)
          </h3>

          <div className="space-y-3">
            {/* Revenue */}
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm text-muted-foreground">Revenue</div>
              <div className="flex-1">
                <div className="h-8 bg-emerald-500 rounded" style={{ width: "100%" }} />
              </div>
              <div className="w-24 text-right text-sm font-medium text-foreground">{formatCurrency(result.revenue)}</div>
            </div>

            {/* COGS */}
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm text-muted-foreground">− COGS</div>
              <div className="flex-1">
                <div 
                  className="h-8 bg-red-400 rounded" 
                  style={{ width: `${result.revenue > 0 ? (result.cogs / result.revenue) * 100 : 0}%` }} 
                />
              </div>
              <div className="w-24 text-right text-sm font-medium text-red-600 dark:text-red-400">−{formatCurrency(result.cogs)}</div>
            </div>

            {/* Gross Profit */}
            <div className="flex items-center gap-3 py-1 border-t border-border">
              <div className="w-32 text-sm font-medium text-foreground">= Gross Profit</div>
              <div className="flex-1">
                <div 
                  className={`h-8 rounded ${result.grossProfit >= 0 ? "bg-emerald-400" : "bg-red-400"}`}
                  style={{ width: `${result.revenue > 0 ? Math.abs(result.grossProfit / result.revenue) * 100 : 0}%` }} 
                />
              </div>
              <div className={`w-24 text-right text-sm font-medium ${result.grossProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {formatCurrency(result.grossProfit)}
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm text-muted-foreground">− Operating Exp.</div>
              <div className="flex-1">
                <div 
                  className="h-8 bg-red-400 rounded" 
                  style={{ width: `${result.revenue > 0 ? (result.operatingExpenses / result.revenue) * 100 : 0}%` }} 
                />
              </div>
              <div className="w-24 text-right text-sm font-medium text-red-600 dark:text-red-400">−{formatCurrency(result.operatingExpenses)}</div>
            </div>

            {/* Operating Profit */}
            <div className="flex items-center gap-3 py-1 border-t border-border">
              <div className="w-32 text-sm font-medium text-foreground">= Operating Profit</div>
              <div className="flex-1">
                <div 
                  className={`h-8 rounded ${result.operatingProfit >= 0 ? "bg-blue-400" : "bg-red-400"}`}
                  style={{ width: `${result.revenue > 0 ? Math.abs(result.operatingProfit / result.revenue) * 100 : 0}%` }} 
                />
              </div>
              <div className={`w-24 text-right text-sm font-medium ${result.operatingProfit >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                {formatCurrency(result.operatingProfit)}
              </div>
            </div>

            {/* Other Expenses */}
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm text-muted-foreground">− Other Expenses</div>
              <div className="flex-1">
                <div 
                  className="h-8 bg-red-400 rounded" 
                  style={{ width: `${result.revenue > 0 ? (result.otherExpenses / result.revenue) * 100 : 0}%` }} 
                />
              </div>
              <div className="w-24 text-right text-sm font-medium text-red-600 dark:text-red-400">−{formatCurrency(result.otherExpenses)}</div>
            </div>

            {/* Net Profit */}
            <div className={`flex items-center gap-3 py-2 border-t-2 ${isProfitable ? "border-primary" : "border-red-500"}`}>
              <div className="w-32 text-sm font-bold text-foreground">= Net Profit</div>
              <div className="flex-1">
                <div 
                  className={`h-10 rounded ${isProfitable ? "bg-primary" : "bg-red-500"}`}
                  style={{ width: `${result.revenue > 0 ? Math.abs(result.netProfit / result.revenue) * 100 : 0}%` }} 
                />
              </div>
              <div className={`w-24 text-right text-lg font-bold ${isProfitable ? "text-foreground" : "text-red-600 dark:text-red-400"}`}>
                {formatCurrency(result.netProfit)}
              </div>
            </div>
          </div>
        </div>

        {/* Margin Comparison */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <PieChart className="h-5 w-5 text-primary" />
            Margin Analysis
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-emerald-500/10">
              <p className="text-sm text-muted-foreground mb-1">Gross Margin</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatPercent(result.grossMargin)}</p>
              <p className="text-xs text-muted-foreground mt-1">Production efficiency</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <p className="text-sm text-muted-foreground mb-1">Operating Margin</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatPercent(result.operatingMargin)}</p>
              <p className="text-xs text-muted-foreground mt-1">Operational efficiency</p>
            </div>
            <div className={`text-center p-4 rounded-lg ${isProfitable ? "bg-primary/10" : "bg-red-500/10"}`}>
              <p className="text-sm text-muted-foreground mb-1">Net Margin</p>
              <p className={`text-3xl font-bold ${isProfitable ? "text-primary" : "text-red-600 dark:text-red-400"}`}>{formatPercent(result.netMargin)}</p>
              <p className="text-xs text-muted-foreground mt-1">Overall profitability</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
