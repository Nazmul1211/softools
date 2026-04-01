"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  PiggyBank,
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";

interface SavingsResult {
  finalBalance: number;
  totalDeposits: number;
  totalInterest: number;
  yearByYearData: Array<{
    year: number;
    balance: number;
    deposits: number;
    interest: number;
    yearlyDeposits: number;
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

function calculateSavings(
  initialDeposit: number,
  monthlyDeposit: number,
  annualRate: number,
  years: number,
  compoundFrequency: number
): SavingsResult {
  const periodicRate = annualRate / 100 / compoundFrequency;
  const periodsPerYear = compoundFrequency;
  const monthsPerPeriod = 12 / periodsPerYear;

  let balance = initialDeposit;
  let totalDeposits = initialDeposit;
  const yearByYearData: SavingsResult["yearByYearData"] = [];

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    let yearlyDeposits = 0;

    for (let period = 1; period <= periodsPerYear; period++) {
      // Add monthly deposits for this period
      const depositsThisPeriod = monthlyDeposit * monthsPerPeriod;
      balance += depositsThisPeriod;
      yearlyDeposits += depositsThisPeriod;
      
      // Apply interest
      balance = balance * (1 + periodicRate);
    }

    totalDeposits += yearlyDeposits;
    const totalInterestSoFar = balance - totalDeposits;
    const yearlyInterest = balance - startBalance - yearlyDeposits;

    yearByYearData.push({
      year,
      balance: Math.round(balance),
      deposits: Math.round(totalDeposits),
      interest: Math.round(totalInterestSoFar),
      yearlyDeposits: Math.round(yearlyDeposits),
      yearlyInterest: Math.round(yearlyInterest),
    });
  }

  return {
    finalBalance: Math.round(balance),
    totalDeposits: Math.round(totalDeposits),
    totalInterest: Math.round(balance - totalDeposits),
    yearByYearData,
  };
}

export default function SavingsCalculatorPage() {
  const [initialDeposit, setInitialDeposit] = useState(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [annualRate, setAnnualRate] = useState(5);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState(12);

  const result = useMemo(() => {
    if (years <= 0) return null;
    return calculateSavings(
      initialDeposit,
      monthlyDeposit,
      annualRate,
      years,
      compoundFrequency
    );
  }, [initialDeposit, monthlyDeposit, annualRate, years, compoundFrequency]);

  const effectiveRate = result && result.totalDeposits > 0
    ? (((result.finalBalance - result.totalDeposits) / result.totalDeposits) * 100).toFixed(1)
    : "0";

  return (
    <ToolLayout
      title="Savings Calculator"
      description="Calculate how your savings will grow over time with compound interest. Enter your initial deposit, monthly contributions, and interest rate to project your future balance."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Investment Calculator", href: "/investment-calculator/" },
        { name: "Retirement Calculator", href: "/retirement-calculator/" },
        { name: "Savings Goal Calculator", href: "/savings-goal-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Starting Amount", text: "Input your initial deposit or current savings balance." },
        { name: "Set Monthly Deposits", text: "Add your planned monthly contribution amount." },
        { name: "Choose Interest Rate", text: "Enter your expected annual interest rate (APY)." },
        { name: "View Projections", text: "See your projected balance and interest earned over time." },
      ]}
      faqs={[
        {
          question: "What's a good savings account interest rate?",
          answer: "High-yield savings accounts typically offer 4-5% APY (as of 2024), while traditional banks may only offer 0.01-0.5%. Online banks and credit unions often have the best rates. Always compare rates and check for fees.",
        },
        {
          question: "How does compound frequency affect my savings?",
          answer: "More frequent compounding (daily vs monthly) earns slightly more interest because your interest starts earning interest sooner. However, the difference is usually small—the interest rate and your deposits matter more.",
        },
        {
          question: "How much should I save each month?",
          answer: "The 50/30/20 rule suggests saving 20% of your income. At minimum, aim for 3-6 months of expenses as an emergency fund, then consider retirement accounts and other goals. Any amount you can consistently save helps.",
        },
        {
          question: "What's the difference between APY and APR?",
          answer: "APY (Annual Percentage Yield) includes compound interest and shows what you'll actually earn. APR (Annual Percentage Rate) is the simple interest rate without compounding. For savings, always compare APY.",
        },
      ]}
      content={
        <>
          <h2>The Power of Compound Interest</h2>
          <p>
            Compound interest is often called the eighth wonder of the world—earning interest on your interest creates exponential growth over time. The earlier you start saving, the more time your money has to compound, making consistent saving one of the most powerful wealth-building strategies.
          </p>
          <p>
            This calculator shows how your money grows year by year, breaking down your deposits versus interest earned. Understanding this helps you appreciate why starting early matters: over long periods, you can earn more in interest than you actually deposited.
          </p>

          <h2>Building an Emergency Fund</h2>
          <p>
            Financial experts recommend having 3-6 months of living expenses in an easily accessible savings account before focusing on other goals. This emergency fund protects you from unexpected expenses like medical bills, car repairs, or job loss without going into debt.
          </p>
          <p>
            Keep your emergency fund in a high-yield savings account—it should be accessible within a few days but not so easy to spend that you're tempted. Once your emergency fund is complete, consider directing additional savings toward retirement accounts or other investments.
          </p>

          <h2>Maximizing Your Savings Rate</h2>
          <p>
            Shop around for the best interest rates. Online banks, credit unions, and money market accounts often offer significantly higher rates than traditional banks. Even a 1% difference compounds to thousands of dollars over time.
          </p>
          <p>
            Automate your savings by setting up automatic transfers on payday. This "pay yourself first" strategy ensures consistent saving before you have a chance to spend the money. Increase your contribution whenever you get a raise to accelerate your progress.
          </p>

          <h2>When to Consider Alternatives</h2>
          <p>
            Savings accounts are ideal for short-term goals and emergency funds due to their safety and liquidity. For longer-term goals (5+ years), consider tax-advantaged accounts like IRAs or 401(k)s, or diversified investment portfolios that historically offer higher returns despite more volatility.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <PiggyBank className="h-5 w-5 text-primary" />
            Savings Parameters
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Initial Deposit
              </label>
              <input
                type="number"
                min={0}
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Monthly Deposit
              </label>
              <input
                type="number"
                min={0}
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Annual Interest Rate (APY %)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Time Period (Years)
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

            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calculator className="h-4 w-4" />
                Compound Frequency
              </label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(Number(e.target.value))}
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
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Target className="h-8 w-8 text-primary" />
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
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalDeposits)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Percent className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Growth</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {effectiveRate}%
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Savings Breakdown
              </h3>

              <div className="space-y-4">
                {/* Stacked Bar */}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(result.totalDeposits / result.finalBalance) * 100}%`,
                      }}
                      title={`Deposits: ${formatCurrency(result.totalDeposits)}`}
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
                      Your Deposits ({((result.totalDeposits / result.finalBalance) * 100).toFixed(1)}%)
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
                    After {years} years of saving, your {formatCurrency(result.totalDeposits)} in deposits will grow to{" "}
                    <strong className="text-foreground">{formatCurrency(result.finalBalance)}</strong>. You'll earn{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(result.totalInterest)}</strong> in interest!
                  </p>
                </div>
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Year-by-Year Growth
              </h3>

              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Year</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Balance</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Year Deposits</th>
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
                          {formatCurrency(row.yearlyDeposits)}
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
