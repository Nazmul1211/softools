"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Wallet,
  PiggyBank,
  ArrowUpRight,
} from "lucide-react";

interface InvestmentResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  yearByYearData: Array<{
    year: number;
    balance: number;
    contributions: number;
    interest: number;
    yearlyContribution: number;
    yearlyInterest: number;
  }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateInvestment(
  initialInvestment: number,
  monthlyContribution: number,
  years: number,
  annualReturn: number,
  compoundingFrequency: number
): InvestmentResult {
  const periodicRate = annualReturn / 100 / compoundingFrequency;
  const periodsPerYear = compoundingFrequency;
  const monthsPerPeriod = 12 / periodsPerYear;

  let balance = initialInvestment;
  let totalContributions = initialInvestment;
  const yearByYearData: InvestmentResult["yearByYearData"] = [];

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    let yearlyContribution = 0;

    for (let period = 1; period <= periodsPerYear; period++) {
      // Add interest
      balance = balance * (1 + periodicRate);
      
      // Add monthly contributions for this period
      const contributionsThisPeriod = monthlyContribution * monthsPerPeriod;
      balance += contributionsThisPeriod;
      yearlyContribution += contributionsThisPeriod;
    }

    totalContributions += yearlyContribution;
    const totalInterestSoFar = balance - totalContributions;
    const yearlyInterest = balance - startBalance - yearlyContribution;

    yearByYearData.push({
      year,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      interest: Math.round(totalInterestSoFar),
      yearlyContribution: Math.round(yearlyContribution),
      yearlyInterest: Math.round(yearlyInterest),
    });
  }

  return {
    finalBalance: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(balance - totalContributions),
    yearByYearData,
  };
}

export default function InvestmentCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12); // Monthly

  const result = useMemo(() => {
    if (years <= 0) return null;
    return calculateInvestment(
      initialInvestment,
      monthlyContribution,
      years,
      annualReturn,
      compoundingFrequency
    );
  }, [initialInvestment, monthlyContribution, years, annualReturn, compoundingFrequency]);

  const returnMultiple = result ? (result.finalBalance / result.totalContributions).toFixed(2) : "0";

  return (
    <ToolLayout
      title="Investment Calculator"
      description="Calculate how your investments will grow over time with compound interest. Enter your initial investment, monthly contributions, and expected returns to see projections."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Retirement Calculator", href: "/retirement-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
        { name: "Savings Goal Calculator", href: "/savings-goal-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Starting Amount", text: "Input your initial investment amount to begin with." },
        { name: "Set Contributions", text: "Add your planned monthly contribution amount." },
        { name: "Choose Timeframe", text: "Select how many years you plan to invest." },
        { name: "View Growth", text: "See your projected balance and detailed breakdown." },
      ]}
      faqs={[
        {
          question: "What is a realistic annual return for investments?",
          answer: "The S&P 500 has historically returned about 10% annually on average before inflation. After adjusting for inflation, the real return is closer to 7%. Individual results vary based on investment choices and market conditions.",
        },
        {
          question: "How does compounding frequency affect returns?",
          answer: "More frequent compounding (daily vs yearly) results in slightly higher returns because interest earns interest sooner. However, the difference is usually small—the bigger factors are your contribution amount and time in the market.",
        },
        {
          question: "Should I invest a lump sum or dollar-cost average?",
          answer: "Statistically, lump sum investing tends to outperform because markets generally rise over time. However, dollar-cost averaging (regular contributions) reduces timing risk and is more practical for most people building wealth over time.",
        },
        {
          question: "What's the Rule of 72?",
          answer: "The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by your annual return rate. At 8% return, your money doubles approximately every 9 years (72 ÷ 8 = 9).",
        },
      ]}
      content={
        <>
          <h2>Understanding Investment Growth</h2>
          <p>
            Investment growth is powered by compound interest—earning returns not just on your original investment, but also on previously earned returns. This snowball effect can turn modest regular investments into substantial wealth over time. The key factors are: starting early, contributing consistently, and letting time work in your favor.
          </p>
          <p>
            This calculator shows how your money grows year by year, breaking down the contributions you make versus the interest your investments earn. Understanding this split helps you appreciate why starting early matters so much—the longer your money compounds, the more of your final balance comes from investment growth rather than your own contributions.
          </p>

          <h2>Building an Investment Strategy</h2>
          <p>
            Successful investing combines several principles: diversification (spreading risk across different assets), consistency (regular contributions regardless of market conditions), and patience (staying invested through market ups and downs). Index funds tracking broad market indices offer a simple, low-cost way to achieve diversification.
          </p>
          <p>
            Consider tax-advantaged accounts like 401(k)s and IRAs first, as they allow your investments to grow tax-deferred or tax-free. Take full advantage of any employer matching—it's an immediate 100% return on your money. After maxing out tax-advantaged space, taxable brokerage accounts offer flexibility for additional investments.
          </p>

          <h2>Managing Investment Risk</h2>
          <p>
            Higher expected returns come with higher volatility. Stock-heavy portfolios offer better long-term growth but can lose 20-40% in bad years. Your risk tolerance and time horizon should guide your asset allocation. Younger investors with decades until retirement can typically afford more stock exposure, while those closer to needing their money should consider more bonds.
          </p>
          <p>
            Remember that this calculator shows a smooth growth curve based on average returns. Real markets don't work that way—there will be good years and bad years. The key is staying invested and continuing to contribute, especially during downturns when you're buying at lower prices.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Investment Parameters
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Initial Investment ($)
              </label>
              <input
                type="number"
                min={0}
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                min={0}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Investment Period (Years)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Compounding Frequency
              </label>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                <option value={1}>Annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Final Balance</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(result.finalBalance)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <PiggyBank className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalContributions)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <ArrowUpRight className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Return Multiple</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {returnMultiple}x
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Growth Visualization
              </h3>

              <div className="space-y-4">
                {/* Stacked Bar */}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(result.totalContributions / result.finalBalance) * 100}%`,
                      }}
                      title={`Contributions: ${formatCurrency(result.totalContributions)}`}
                    />
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{
                        width: `${(result.totalInterest / result.finalBalance) * 100}%`,
                      }}
                      title={`Interest: ${formatCurrency(result.totalInterest)}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Contributions ({((result.totalContributions / result.finalBalance) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                    <span className="text-muted-foreground">
                      Interest Earned ({((result.totalInterest / result.finalBalance) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">
                    After {years} years, your {formatCurrency(result.totalContributions)} in contributions has grown to{" "}
                    <strong className="text-foreground">{formatCurrency(result.finalBalance)}</strong>. That's{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(result.totalInterest)}</strong> earned through compound growth!
                  </p>
                </div>
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Year-by-Year Breakdown
              </h3>

              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Year</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Balance</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Year Contribution</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Year Interest</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYearData.map((row) => (
                      <tr key={row.year} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{row.year}</td>
                        <td className="py-2 pr-4 text-right font-medium text-foreground">
                          {formatCurrency(row.balance)}
                        </td>
                        <td className="py-2 pr-4 text-right text-muted-foreground">
                          {formatCurrency(row.yearlyContribution)}
                        </td>
                        <td className="py-2 pr-4 text-right text-blue-600 dark:text-blue-400">
                          {formatCurrency(row.yearlyInterest)}
                        </td>
                        <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(row.interest)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
