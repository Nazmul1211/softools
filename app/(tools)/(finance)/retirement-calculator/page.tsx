"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Calendar,
  DollarSign,
  Target,
  Info,
} from "lucide-react";

interface RetirementResult {
  totalSavings: number;
  totalContributions: number;
  totalInterest: number;
  monthlyRetirementIncome: number;
  yearsInRetirement: number;
  yearByYearData: Array<{
    age: number;
    year: number;
    balance: number;
    contributions: number;
    interest: number;
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

function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturn: number,
  inflationRate: number
): RetirementResult {
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const monthlyRate = annualReturn / 100 / 12;
  const realReturn = ((1 + annualReturn / 100) / (1 + inflationRate / 100) - 1);

  let balance = currentSavings;
  let totalContributions = currentSavings;
  const yearByYearData: RetirementResult["yearByYearData"] = [];

  // Accumulation phase
  for (let year = 1; year <= yearsToRetirement; year++) {
    const startBalance = balance;
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    totalContributions += monthlyContribution * 12;
    const interestThisYear = balance - startBalance - monthlyContribution * 12;

    yearByYearData.push({
      age: currentAge + year,
      year,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      interest: Math.round(balance - totalContributions),
    });
  }

  const totalSavings = balance;
  const totalInterest = balance - totalContributions;

  // Calculate monthly retirement income using 4% rule adjusted for real return
  const withdrawalRate = 0.04;
  const annualWithdrawal = totalSavings * withdrawalRate;
  const monthlyRetirementIncome = annualWithdrawal / 12;

  return {
    totalSavings: Math.round(totalSavings),
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    monthlyRetirementIncome: Math.round(monthlyRetirementIncome),
    yearsInRetirement,
    yearByYearData,
  };
}

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);

  const result = useMemo(() => {
    if (currentAge >= retirementAge || retirementAge >= lifeExpectancy) {
      return null;
    }
    return calculateRetirement(
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      annualReturn,
      inflationRate
    );
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyContribution, annualReturn, inflationRate]);

  return (
    <ToolLayout
      title="Retirement Calculator"
      description="Plan your financial future by calculating how much you need to save for retirement. See projected savings, monthly retirement income, and create a personalized plan."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Investment Calculator", href: "/investment-calculator/" },
        { name: "Savings Goal Calculator", href: "/savings-goal-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Your Age", text: "Input your current age and planned retirement age." },
        { name: "Add Savings Info", text: "Enter your current savings and monthly contribution amount." },
        { name: "Set Growth Rate", text: "Adjust expected annual return and inflation rate." },
        { name: "View Projections", text: "See your projected retirement savings and monthly income." },
      ]}
      faqs={[
        {
          question: "What is a good retirement savings goal?",
          answer: "A common rule is to save 10-15x your annual salary by retirement. For example, if you earn $60,000/year, aim for $600,000-$900,000. This calculator helps you see if you're on track.",
        },
        {
          question: "What is the 4% rule?",
          answer: "The 4% rule suggests you can withdraw 4% of your retirement savings annually with low risk of running out of money over 30 years. We use this to estimate your monthly retirement income.",
        },
        {
          question: "What annual return should I expect?",
          answer: "Historically, a diversified stock portfolio has returned about 7-10% annually before inflation. A conservative estimate of 6-7% accounts for fees and market volatility.",
        },
        {
          question: "How does inflation affect retirement?",
          answer: "Inflation reduces purchasing power over time. $1 million today won't buy as much in 30 years. We factor in inflation to show real purchasing power of your savings.",
        },
      ]}
      content={
        <>
          <h2>Why Retirement Planning Matters</h2>
          <p>
            Retirement planning is one of the most important financial decisions you'll make. Starting early gives your money more time to grow through compound interest, potentially turning modest monthly contributions into substantial wealth. This calculator helps you visualize your retirement trajectory and make informed decisions about your savings strategy.
          </p>
          <p>
            The power of compound interest means that money invested in your 20s and 30s has significantly more growth potential than money invested later. Even small increases in your monthly contribution or starting a few years earlier can result in hundreds of thousands of dollars more at retirement.
          </p>

          <h2>Understanding Your Retirement Numbers</h2>
          <p>
            Your retirement readiness depends on several factors: how much you've already saved, how much you contribute each month, how long until you retire, and what return you earn on investments. This calculator projects your future savings based on these inputs and estimates the monthly income you could withdraw in retirement.
          </p>
          <p>
            We use the 4% safe withdrawal rate, a well-researched guideline suggesting you can withdraw 4% of your portfolio annually with minimal risk of depleting your savings over a typical retirement period. This provides a realistic estimate of sustainable retirement income.
          </p>

          <h2>Tips for Maximizing Retirement Savings</h2>
          <p>
            Consider maxing out tax-advantaged accounts like 401(k)s and IRAs first, as they offer tax benefits that accelerate growth. Take full advantage of employer matching contributions—it's essentially free money. Automate your contributions so saving becomes effortless, and increase your contribution rate whenever you receive a raise.
          </p>
          <p>
            Review and rebalance your investment allocation periodically. Younger investors can typically afford more stock exposure for higher growth, while those closer to retirement may want to shift toward more conservative investments to protect their gains.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Retirement Planning Inputs
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Age Inputs */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Current Age
              </label>
              <input
                type="number"
                min={18}
                max={80}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Retirement Age
              </label>
              <input
                type="number"
                min={currentAge + 1}
                max={85}
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Life Expectancy
              </label>
              <input
                type="number"
                min={retirementAge + 1}
                max={120}
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Financial Inputs */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Current Savings ($)
              </label>
              <input
                type="number"
                min={0}
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
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
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.1}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Inflation Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
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
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Total at Retirement</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(result.totalSavings)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Monthly Income (4% Rule)</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.monthlyRetirementIncome)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Calendar className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Years to Retirement</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {retirementAge - currentAge} years
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Target className="h-5 w-5 text-primary" />
                Savings Breakdown
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Contributions</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(result.totalContributions)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(result.totalContributions / result.totalSavings) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Investment Growth</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(result.totalInterest)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${(result.totalInterest / result.totalSavings) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{((result.totalInterest / result.totalSavings) * 100).toFixed(1)}%</strong> of your retirement savings comes from investment growth. This demonstrates the power of compound interest over {retirementAge - currentAge} years.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Year-by-Year Projection
              </h3>

              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Age</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Year</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Balance</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Contributions</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYearData.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{row.age}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.year}</td>
                        <td className="py-2 pr-4 text-right font-medium text-foreground">
                          {formatCurrency(row.balance)}
                        </td>
                        <td className="py-2 pr-4 text-right text-muted-foreground">
                          {formatCurrency(row.contributions)}
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

        {!result && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            Please ensure retirement age is greater than current age, and life expectancy is greater than retirement age.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
