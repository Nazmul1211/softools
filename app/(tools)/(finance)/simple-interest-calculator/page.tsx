"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
  Info,
} from "lucide-react";

interface SimpleInterestResult {
  principal: number;
  interest: number;
  totalAmount: number;
  dailyInterest: number;
  monthlyInterest: number;
  yearlyInterest: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number,
  timeUnit: "years" | "months" | "days"
): SimpleInterestResult {
  // Convert time to years
  let timeInYears: number;
  switch (timeUnit) {
    case "months":
      timeInYears = time / 12;
      break;
    case "days":
      timeInYears = time / 365;
      break;
    default:
      timeInYears = time;
  }

  // Simple Interest Formula: I = P × R × T
  const interest = principal * (rate / 100) * timeInYears;
  const totalAmount = principal + interest;

  // Calculate interest breakdown
  const yearlyInterest = principal * (rate / 100);
  const monthlyInterest = yearlyInterest / 12;
  const dailyInterest = yearlyInterest / 365;

  return {
    principal,
    interest,
    totalAmount,
    dailyInterest,
    monthlyInterest,
    yearlyInterest,
  };
}

export default function SimpleInterestCalculatorPage() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(3);
  const [timeUnit, setTimeUnit] = useState<"years" | "months" | "days">("years");

  const result = useMemo(() => {
    if (principal <= 0 || time <= 0) return null;
    return calculateSimpleInterest(principal, rate, time, timeUnit);
  }, [principal, rate, time, timeUnit]);

  const interestPercentage = result
    ? ((result.interest / result.totalAmount) * 100).toFixed(1)
    : "0";

  return (
    <ToolLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest on loans, savings, and investments. Enter your principal amount, interest rate, and time period to see exactly how much interest you'll earn or pay."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Loan Calculator", href: "/loan-calculator/" },
        { name: "EMI Calculator", href: "/emi-calculator/" },
        { name: "Savings Calculator", href: "/savings-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Principal", text: "Input the initial amount of money (loan or investment)." },
        { name: "Set Interest Rate", text: "Enter the annual interest rate as a percentage." },
        { name: "Choose Time Period", text: "Select the duration in years, months, or days." },
        { name: "View Results", text: "See the total interest and final amount instantly." },
      ]}
      faqs={[
        {
          question: "What is simple interest?",
          answer: "Simple interest is calculated only on the original principal amount. Unlike compound interest, it doesn't earn 'interest on interest.' The formula is: Interest = Principal × Rate × Time. It's commonly used for short-term loans, car loans, and some personal loans.",
        },
        {
          question: "How is simple interest different from compound interest?",
          answer: "Simple interest is calculated only on the principal, while compound interest is calculated on both the principal and accumulated interest. Over time, compound interest grows faster. For short periods, the difference is small, but over years, compound interest can be significantly more.",
        },
        {
          question: "Where is simple interest commonly used?",
          answer: "Simple interest is used in car loans, short-term personal loans, some certificates of deposit (CDs), consumer installment loans, and some bonds. It's easier to calculate and often used when the loan term is relatively short.",
        },
        {
          question: "Is simple interest better for borrowers or lenders?",
          answer: "Simple interest is generally better for borrowers because you pay less total interest compared to compound interest over the same period. For savers and investors, compound interest is usually better as your money grows faster.",
        },
      ]}
      content={
        <>
          <h2>Understanding Simple Interest</h2>
          <p>
            Simple interest is one of the most straightforward ways to calculate interest on money. Whether you're borrowing or lending, simple interest applies only to the original principal amount, making it easy to understand and predict your total costs or earnings.
          </p>
          <p>
            The formula for simple interest is: <strong>I = P × R × T</strong>, where I is the interest, P is the principal (original amount), R is the annual interest rate (as a decimal), and T is the time in years. This calculator handles the math for you, including converting months or days to years.
          </p>

          <h2>Simple Interest Formula Breakdown</h2>
          <p>
            Let's break down each component:
          </p>
          <ul>
            <li><strong>Principal (P):</strong> The initial amount of money borrowed or invested</li>
            <li><strong>Rate (R):</strong> The annual interest rate, expressed as a percentage</li>
            <li><strong>Time (T):</strong> The length of time the money is borrowed or invested</li>
            <li><strong>Interest (I):</strong> The amount earned or paid on top of the principal</li>
          </ul>
          <p>
            For example, if you invest $10,000 at 5% for 3 years: I = $10,000 × 0.05 × 3 = $1,500. Your total after 3 years would be $11,500.
          </p>

          <h2>When Simple Interest Applies</h2>
          <p>
            Simple interest is most common in short-term lending scenarios. Auto loans often use simple interest, meaning your payment reduces the principal and you pay interest only on the remaining balance. Some personal loans and payday loans also use simple interest.
          </p>
          <p>
            Understanding whether your loan uses simple or compound interest can save you money. If you make extra payments on a simple interest loan, you directly reduce the principal and thus the total interest you'll pay over the loan term.
          </p>

          <h2>Simple vs. Compound Interest Comparison</h2>
          <p>
            For short time periods, simple and compound interest produce similar results. The difference becomes dramatic over longer periods. For a $10,000 investment at 5% over 10 years: simple interest yields $5,000, while compound interest (annually) yields about $6,289—a difference of nearly $1,300.
          </p>
          <p>
            When borrowing, you generally want simple interest. When saving or investing, you want compound interest. Always check which type applies to your financial products.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Calculate Simple Interest
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Principal Amount
              </label>
              <input
                type="number"
                min={0}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Time Period
              </label>
              <input
                type="number"
                min={0}
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Time Unit
              </label>
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as "years" | "months" | "days")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formula Display */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Formula Applied</span>
          </div>
          <code className="text-sm text-muted-foreground">
            Interest = Principal × Rate × Time = {formatCurrency(principal)} × {rate}% × {time} {timeUnit} = {result ? formatCurrency(result.interest) : "$0.00"}
          </code>
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Principal</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.principal)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.interest)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center sm:col-span-2 lg:col-span-1">
                <div className="mb-2 flex justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(result.totalAmount)}
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Amount Breakdown
              </h3>

              <div className="space-y-4">
                {/* Stacked Bar */}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(result.principal / result.totalAmount) * 100}%`,
                      }}
                      title={`Principal: ${formatCurrency(result.principal)}`}
                    />
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{
                        width: `${(result.interest / result.totalAmount) * 100}%`,
                      }}
                      title={`Interest: ${formatCurrency(result.interest)}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Principal ({((result.principal / result.totalAmount) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                    <span className="text-muted-foreground">
                      Interest ({interestPercentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interest Rate Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Interest Rate Breakdown
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-sm text-muted-foreground">Daily Interest</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(result.dailyInterest)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-sm text-muted-foreground">Monthly Interest</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(result.monthlyInterest)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-sm text-muted-foreground">Yearly Interest</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(result.yearlyInterest)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  At {rate}% annual interest on {formatCurrency(principal)}, you'll {rate > 0 ? "earn" : "pay"}{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(result.interest)}</strong> in simple interest over {time} {timeUnit}.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
