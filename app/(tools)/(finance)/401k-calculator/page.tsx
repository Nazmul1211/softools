"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
  PiggyBank,
  BarChart3,
  Building,
  Calendar,
  Gift,
  Wallet,
} from "lucide-react";

interface Contribution401kResult {
  yearlyContribution: number;
  yearlyEmployerMatch: number;
  totalYearlyContribution: number;
  futureValue: number;
  totalContributions: number;
  totalEmployerMatch: number;
  totalGrowth: number;
  yearByYearData: Array<{
    year: number;
    age: number;
    yourContribution: number;
    employerMatch: number;
    growth: number;
    balance: number;
  }>;
  taxSavings: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// 2024 401k contribution limits
const CONTRIBUTION_LIMIT_2024 = 23000;
const CATCH_UP_LIMIT_2024 = 7500; // Additional for 50+

function calculate401k(
  currentAge: number,
  retirementAge: number,
  currentSalary: number,
  contributionPercent: number,
  employerMatchPercent: number,
  employerMatchLimit: number,
  currentBalance: number,
  expectedReturn: number,
  salaryGrowth: number,
  taxBracket: number
): Contribution401kResult {
  const years = Math.max(0, retirementAge - currentAge);
  const yearByYearData: Contribution401kResult["yearByYearData"] = [];
  
  let balance = currentBalance;
  let salary = currentSalary;
  let totalContributions = 0;
  let totalEmployerMatch = 0;

  for (let i = 1; i <= years; i++) {
    const age = currentAge + i;
    const contributionLimit = age >= 50 ? CONTRIBUTION_LIMIT_2024 + CATCH_UP_LIMIT_2024 : CONTRIBUTION_LIMIT_2024;
    
    // Calculate yearly contribution (capped at IRS limit)
    let yourContribution = salary * (contributionPercent / 100);
    yourContribution = Math.min(yourContribution, contributionLimit);
    
    // Calculate employer match
    const matchableAmount = salary * (employerMatchLimit / 100);
    let employerMatch = Math.min(yourContribution, matchableAmount) * (employerMatchPercent / 100);
    
    // Add contributions
    balance += yourContribution + employerMatch;
    totalContributions += yourContribution;
    totalEmployerMatch += employerMatch;
    
    // Apply growth
    const growth = balance * (expectedReturn / 100);
    balance += growth;
    
    yearByYearData.push({
      year: i,
      age,
      yourContribution,
      employerMatch,
      growth,
      balance,
    });
    
    // Salary growth for next year
    salary = salary * (1 + salaryGrowth / 100);
  }

  // Calculate first year contribution for display
  const firstYearContribution = currentSalary * (contributionPercent / 100);
  const cappedFirstYearContribution = Math.min(firstYearContribution, 
    currentAge >= 50 ? CONTRIBUTION_LIMIT_2024 + CATCH_UP_LIMIT_2024 : CONTRIBUTION_LIMIT_2024);
  const matchableFirst = currentSalary * (employerMatchLimit / 100);
  const firstYearMatch = Math.min(cappedFirstYearContribution, matchableFirst) * (employerMatchPercent / 100);

  // Tax savings (on contributions only, not match)
  const taxSavings = cappedFirstYearContribution * (taxBracket / 100);

  return {
    yearlyContribution: cappedFirstYearContribution,
    yearlyEmployerMatch: firstYearMatch,
    totalYearlyContribution: cappedFirstYearContribution + firstYearMatch,
    futureValue: balance,
    totalContributions,
    totalEmployerMatch,
    totalGrowth: balance - totalContributions - totalEmployerMatch - currentBalance,
    yearByYearData,
    taxSavings,
  };
}

export default function Calculator401kPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSalary, setCurrentSalary] = useState(75000);
  const [contributionPercent, setContributionPercent] = useState(10);
  const [employerMatchPercent, setEmployerMatchPercent] = useState(50);
  const [employerMatchLimit, setEmployerMatchLimit] = useState(6);
  const [currentBalance, setCurrentBalance] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [salaryGrowth, setSalaryGrowth] = useState(3);
  const [taxBracket, setTaxBracket] = useState(22);

  const result = useMemo(() => {
    return calculate401k(
      currentAge,
      retirementAge,
      currentSalary,
      contributionPercent,
      employerMatchPercent,
      employerMatchLimit,
      currentBalance,
      expectedReturn,
      salaryGrowth,
      taxBracket
    );
  }, [
    currentAge, retirementAge, currentSalary, contributionPercent,
    employerMatchPercent, employerMatchLimit, currentBalance,
    expectedReturn, salaryGrowth, taxBracket
  ]);

  const contributionLimit = currentAge >= 50 
    ? CONTRIBUTION_LIMIT_2024 + CATCH_UP_LIMIT_2024 
    : CONTRIBUTION_LIMIT_2024;

  return (
    <ToolLayout
      title="401k Calculator"
      description="Calculate how your 401k retirement savings will grow over time. Factor in employer matching, contribution limits, expected returns, and see year-by-year projections for your retirement nest egg."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Retirement Calculator", href: "/retirement-calculator/" },
        { name: "Investment Calculator", href: "/investment-calculator/" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Savings Calculator", href: "/savings-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Your Details", text: "Input your current age, retirement age, and salary." },
        { name: "Set Contribution Rate", text: "Choose what percentage of your salary to contribute." },
        { name: "Add Employer Match", text: "Enter your employer's matching contribution details." },
        { name: "View Projections", text: "See your projected 401k balance at retirement." },
      ]}
      faqs={[
        {
          question: "What is the 401k contribution limit for 2024?",
          answer: "The IRS 401k contribution limit for 2024 is $23,000 for employee contributions. If you're 50 or older, you can contribute an additional $7,500 catch-up contribution, for a total of $30,500. Employer contributions don't count toward these limits.",
        },
        {
          question: "What is employer matching and how does it work?",
          answer: "Employer matching is free money your company adds to your 401k based on your contributions. A common match is '50% up to 6%' meaning your employer contributes 50 cents for every dollar you contribute, up to 6% of your salary. Always contribute enough to get the full match—it's an immediate 50-100% return.",
        },
        {
          question: "What is a good 401k contribution percentage?",
          answer: "Financial experts recommend saving 15-20% of income for retirement, including employer match. At minimum, contribute enough to get your full employer match. If you start in your 20s, 10-15% may be sufficient. Starting later requires higher percentages to catch up.",
        },
        {
          question: "Should I choose traditional or Roth 401k?",
          answer: "Traditional 401k contributions are pre-tax (tax deduction now, taxed at withdrawal). Roth 401k uses after-tax money (no deduction now, tax-free withdrawal). Choose Roth if you expect higher taxes in retirement. Traditional is better if your current tax rate is higher than expected retirement rate. Many people benefit from having both.",
        },
      ]}
      content={
        <>
          <h2>Understanding Your 401k</h2>
          <p>
            A 401k is an employer-sponsored retirement savings plan that allows you to save pre-tax dollars for retirement. Named after section 401(k) of the tax code, these plans offer significant tax advantages: your contributions reduce your taxable income today, and your investments grow tax-deferred until withdrawal in retirement.
          </p>
          <p>
            The power of a 401k comes from three sources: your contributions, employer matching (essentially free money), and compound growth over decades. Even modest contributions can grow to substantial sums given enough time—making it critical to start early and contribute consistently.
          </p>

          <h2>Maximizing Your Employer Match</h2>
          <p>
            Employer matching is the best return on investment you'll ever get—it's literally free money. If your employer matches 50% of your contributions up to 6% of salary, contributing that 6% gives you an immediate 50% return before any investment growth.
          </p>
          <p>
            Understanding your match formula is crucial. Common structures include:
          </p>
          <ul>
            <li><strong>Dollar-for-dollar up to X%:</strong> 100% match on contributions up to a percentage of salary</li>
            <li><strong>50 cents per dollar up to X%:</strong> 50% match on contributions up to a percentage</li>
            <li><strong>Tiered matching:</strong> Different rates at different contribution levels</li>
          </ul>
          <p>
            Always contribute at least enough to get your full match. Leaving matching money on the table is like declining part of your salary.
          </p>

          <h2>The Magic of Compound Growth</h2>
          <p>
            The earlier you start contributing, the more time compound interest has to work. At 7% annual returns, money doubles roughly every 10 years. Starting at 25 instead of 35 could mean the difference between $1 million and $500,000 at retirement—even with the same contribution rate.
          </p>
          <p>
            This calculator assumes reinvested returns and accounts for the powerful effect of compounding over your working years. Even small increases in contribution rate can dramatically impact your final balance due to decades of compound growth.
          </p>

          <h2>401k Tax Benefits</h2>
          <p>
            Traditional 401k contributions reduce your taxable income dollar-for-dollar. In a 22% tax bracket, contributing $10,000 saves $2,200 in federal taxes that year. Your money then grows tax-deferred—no taxes on dividends or capital gains until withdrawal.
          </p>
          <p>
            Withdrawals in retirement are taxed as ordinary income. The strategy is that many people are in lower tax brackets in retirement than during working years, making the tax deferral beneficial. However, required minimum distributions (RMDs) start at age 73.
          </p>

          <h2>Contribution Strategies by Age</h2>
          <p>
            <strong>20s-30s:</strong> Prioritize getting the full employer match. Aim for 10-15% total savings rate. Time is your biggest asset—aggressive growth investments make sense.
          </p>
          <p>
            <strong>40s:</strong> Increase contributions as income grows. Evaluate if you're on track for retirement goals. Consider catch-up contributions as you approach 50.
          </p>
          <p>
            <strong>50s-60s:</strong> Maximize contributions including catch-up contributions. Gradually shift to more conservative investments. Plan withdrawal strategies for retirement.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <PiggyBank className="h-5 w-5 text-primary" />
            401k Calculator
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Current Age
              </label>
              <input
                type="number"
                min={18}
                max={70}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Retirement Age
              </label>
              <input
                type="number"
                min={currentAge + 1}
                max={80}
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Annual Salary
              </label>
              <input
                type="number"
                min={0}
                value={currentSalary}
                onChange={(e) => setCurrentSalary(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Your Contribution (% of salary)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={contributionPercent}
                onChange={(e) => setContributionPercent(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                2024 limit: {formatCurrency(contributionLimit)}
              </p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Building className="h-4 w-4" />
                Employer Match (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={employerMatchPercent}
                onChange={(e) => setEmployerMatchPercent(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">% of your contribution matched</p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Match Limit (% of salary)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={employerMatchLimit}
                onChange={(e) => setEmployerMatchLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">Max salary % employer will match</p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Current 401k Balance
              </label>
              <input
                type="number"
                min={0}
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Expected Return (% per year)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Salary Growth (% per year)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={salaryGrowth}
                onChange={(e) => setSalaryGrowth(Number(e.target.value))}
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
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">401k at Retirement</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(result.futureValue)}
                </p>
                <p className="text-xs text-muted-foreground">at age {retirementAge}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Your Total Contributions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalContributions)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Gift className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Employer Match Total</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.totalEmployerMatch)}
                </p>
                <p className="text-xs text-muted-foreground">Free money!</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Investment Growth</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(result.totalGrowth)}
                </p>
              </div>
            </div>

            {/* First Year Breakdown */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">This Year's Contributions</h4>
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Your Contribution</p>
                  <p className="font-bold text-foreground">{formatCurrency(result.yearlyContribution)}/year</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(result.yearlyContribution / 12)}/month</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Employer Match</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.yearlyEmployerMatch)}/year</p>
                  <p className="text-xs text-muted-foreground">Free money from employer</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Tax Savings</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(result.taxSavings)}/year</p>
                  <p className="text-xs text-muted-foreground">At {taxBracket}% tax bracket</p>
                </div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Balance Composition at Retirement
              </h3>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-muted-foreground/50 transition-all"
                      style={{
                        width: `${(currentBalance / result.futureValue) * 100}%`,
                      }}
                      title={`Starting Balance: ${formatCurrency(currentBalance)}`}
                    />
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(result.totalContributions / result.futureValue) * 100}%`,
                      }}
                      title={`Your Contributions: ${formatCurrency(result.totalContributions)}`}
                    />
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{
                        width: `${(result.totalEmployerMatch / result.futureValue) * 100}%`,
                      }}
                      title={`Employer Match: ${formatCurrency(result.totalEmployerMatch)}`}
                    />
                    <div
                      className="bg-amber-500 transition-all"
                      style={{
                        width: `${(result.totalGrowth / result.futureValue) * 100}%`,
                      }}
                      title={`Investment Growth: ${formatCurrency(result.totalGrowth)}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-muted-foreground/50" />
                    <span className="text-muted-foreground">
                      Starting ({((currentBalance / result.futureValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Your Contributions ({((result.totalContributions / result.futureValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                    <span className="text-muted-foreground">
                      Employer Match ({((result.totalEmployerMatch / result.futureValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-amber-500" />
                    <span className="text-muted-foreground">
                      Growth ({((result.totalGrowth / result.futureValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Year-by-Year Projections
              </h3>

              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Year</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Age</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Your Contribution</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Employer Match</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Growth</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYearData.map((row) => (
                      <tr key={row.year} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{row.year}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{row.age}</td>
                        <td className="py-2 pr-4 text-right text-blue-600 dark:text-blue-400">
                          {formatCurrency(row.yourContribution)}
                        </td>
                        <td className="py-2 pr-4 text-right text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(row.employerMatch)}
                        </td>
                        <td className="py-2 pr-4 text-right text-amber-600 dark:text-amber-400">
                          {formatCurrency(row.growth)}
                        </td>
                        <td className="py-2 text-right font-medium text-foreground">
                          {formatCurrency(row.balance)}
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
