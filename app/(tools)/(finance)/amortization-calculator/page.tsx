"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingDown,
  PiggyBank,
  BarChart3,
  Table,
  Download,
} from "lucide-react";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

interface AmortizationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
  yearlyBreakdown: Array<{
    year: number;
    totalPrincipal: number;
    totalInterest: number;
    endingBalance: number;
  }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateAmortization(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number = 0
): AmortizationResult {
  const monthlyRate = annualRate / 100 / 12;
  
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const schedule: AmortizationRow[] = [];
  const yearlyBreakdown: AmortizationResult["yearlyBreakdown"] = [];
  
  let balance = principal;
  let totalInterestPaid = 0;
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;

  for (let month = 1; month <= termMonths && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment + extraPayment;
    
    // Ensure we don't overpay
    if (principalPayment > balance) {
      principalPayment = balance;
    }
    
    balance = Math.max(0, balance - principalPayment);
    totalInterestPaid += interestPayment;
    yearlyPrincipal += principalPayment;
    yearlyInterest += interestPayment;

    schedule.push({
      month,
      payment: principalPayment + interestPayment,
      principal: principalPayment,
      interest: interestPayment,
      totalInterest: totalInterestPaid,
      balance,
    });

    // Yearly summary
    if (month % 12 === 0 || balance === 0) {
      yearlyBreakdown.push({
        year: Math.ceil(month / 12),
        totalPrincipal: yearlyPrincipal,
        totalInterest: yearlyInterest,
        endingBalance: balance,
      });
      yearlyPrincipal = 0;
      yearlyInterest = 0;
    }

    if (balance === 0) break;
  }

  return {
    monthlyPayment: monthlyPayment + extraPayment,
    totalPayment: schedule.reduce((sum, row) => sum + row.payment, 0),
    totalInterest: totalInterestPaid,
    schedule,
    yearlyBreakdown,
  };
}

export default function AmortizationCalculatorPage() {
  const [principal, setPrincipal] = useState(250000);
  const [annualRate, setAnnualRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [extraPayment, setExtraPayment] = useState(0);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("yearly");

  const result = useMemo(() => {
    if (principal <= 0 || termYears <= 0) return null;
    return calculateAmortization(principal, annualRate, termYears * 12, extraPayment);
  }, [principal, annualRate, termYears, extraPayment]);

  const interestSavings = useMemo(() => {
    if (!result || extraPayment <= 0) return null;
    const withoutExtra = calculateAmortization(principal, annualRate, termYears * 12, 0);
    return {
      interestSaved: withoutExtra.totalInterest - result.totalInterest,
      monthsSaved: withoutExtra.schedule.length - result.schedule.length,
    };
  }, [result, principal, annualRate, termYears, extraPayment]);

  return (
    <ToolLayout
      title="Amortization Calculator"
      description="View your complete loan amortization schedule showing how each payment is split between principal and interest. Understand exactly how your mortgage or loan is paid off over time."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Mortgage Calculator", href: "/mortgage-calculator/" },
        { name: "Loan Calculator", href: "/loan-calculator/" },
        { name: "Auto Loan Calculator", href: "/auto-loan-calculator/" },
        { name: "Simple Interest Calculator", href: "/simple-interest-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Loan Amount", text: "Input the total principal amount of your loan or mortgage." },
        { name: "Set Interest Rate", text: "Enter the annual interest rate (APR) for your loan." },
        { name: "Choose Loan Term", text: "Select the length of your loan in years." },
        { name: "View Schedule", text: "See your complete payment schedule with principal and interest breakdown." },
      ]}
      faqs={[
        {
          question: "What is loan amortization?",
          answer: "Amortization is the process of spreading out a loan into a series of fixed payments over time. Each payment covers both interest and principal, with early payments going mostly toward interest and later payments going mostly toward principal. This is why paying extra early in a loan saves more money.",
        },
        {
          question: "Why do I pay more interest at the start of my loan?",
          answer: "Interest is calculated on the remaining balance. When you start with a large balance, the interest portion is larger. As you pay down principal, less interest accrues each month. This is called front-loaded interest and is typical of amortizing loans.",
        },
        {
          question: "How do extra payments affect my loan?",
          answer: "Extra payments go directly to principal, reducing your balance faster. This means less interest accrues in future months, saving you money and potentially shortening your loan term. Even small extra payments can save thousands over the life of a mortgage.",
        },
        {
          question: "What's the difference between amortization and simple interest?",
          answer: "Simple interest is calculated only on the original principal. Amortizing loans calculate interest on the remaining balance each period, which decreases as you pay down principal. Most mortgages and auto loans use amortization.",
        },
      ]}
      content={
        <>
          <h2>Understanding Amortization Schedules</h2>
          <p>
            An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and interest that comprise each payment until the loan is paid off at the end of its term. Understanding your amortization schedule helps you see exactly where your money goes each month and plan strategies to pay off your loan faster.
          </p>
          <p>
            In the early years of a mortgage, you might be surprised to see that most of your payment goes toward interest rather than building equity. For a 30-year mortgage at 6.5%, roughly 80% of your first payment goes to interest. This ratio gradually shifts until, near the end, nearly all of your payment reduces principal.
          </p>

          <h2>The Mathematics Behind Amortization</h2>
          <p>
            The monthly payment formula for an amortizing loan is: M = P × [r(1+r)^n] / [(1+r)^n - 1], where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the number of payments. This formula ensures equal payments throughout the loan term while accounting for compound interest.
          </p>
          <p>
            Each month, interest is calculated on the remaining balance: Interest = Balance × Monthly Rate. The rest of your payment reduces the principal. This is why the principal portion grows over time—as the balance decreases, less interest accrues.
          </p>

          <h2>Strategies to Pay Off Your Loan Faster</h2>
          <p>
            Making extra principal payments is the most effective way to reduce your loan term and total interest. Consider these approaches:
          </p>
          <ul>
            <li><strong>Bi-weekly payments:</strong> Pay half your monthly amount every two weeks. This results in 26 half-payments (13 full payments) per year instead of 12.</li>
            <li><strong>Round up payments:</strong> If your payment is $1,847, pay $1,900 or $2,000 monthly.</li>
            <li><strong>Annual lump sums:</strong> Apply tax refunds, bonuses, or windfalls directly to principal.</li>
            <li><strong>Refinance to shorter term:</strong> A 15-year mortgage has higher payments but much lower total interest.</li>
          </ul>

          <h2>When Amortization Works Against You</h2>
          <p>
            If you sell or refinance early in your loan term, you've paid mostly interest and built little equity. This is important to consider when deciding how long you plan to stay in a home or keep a loan. For short ownership periods, the interest-heavy early payments mean less financial benefit from homeownership.
          </p>
          <p>
            Similarly, extending a loan term (like refinancing from 20 years remaining to a new 30-year loan) resets the amortization clock, front-loading interest again. While this lowers monthly payments, it often increases total interest paid significantly.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Loan Details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Loan Amount
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
                max={30}
                step={0.125}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Loan Term (Years)
              </label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <PiggyBank className="h-4 w-4" />
                Extra Monthly Payment
              </label>
              <input
                type="number"
                min={0}
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
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
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(result.monthlyPayment)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total of Payments</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalPayment)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Calendar className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Payoff Time</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.ceil(result.schedule.length / 12)} yrs {result.schedule.length % 12} mo
                </p>
              </div>
            </div>

            {/* Interest Savings Alert */}
            {interestSavings && interestSavings.interestSaved > 0 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  💰 With {formatCurrency(extraPayment)}/month extra, you save{" "}
                  <strong>{formatCurrency(interestSavings.interestSaved)}</strong> in interest and pay off your loan{" "}
                  <strong>{Math.floor(interestSavings.monthsSaved / 12)} years and {interestSavings.monthsSaved % 12} months</strong> early!
                </p>
              </div>
            )}

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Payment Breakdown
              </h3>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(principal / result.totalPayment) * 100}%`,
                      }}
                      title={`Principal: ${formatCurrency(principal)}`}
                    />
                    <div
                      className="bg-red-500 transition-all"
                      style={{
                        width: `${(result.totalInterest / result.totalPayment) * 100}%`,
                      }}
                      title={`Interest: ${formatCurrency(result.totalInterest)}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Principal: {formatCurrency(principal)} ({((principal / result.totalPayment) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500" />
                    <span className="text-muted-foreground">
                      Interest: {formatCurrency(result.totalInterest)} ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Table className="h-5 w-5 text-primary" />
                  Amortization Schedule
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("yearly")}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === "yearly"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Yearly
                  </button>
                  <button
                    onClick={() => setViewMode("monthly")}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      viewMode === "monthly"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-auto">
                {viewMode === "yearly" ? (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">Year</th>
                        <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Principal Paid</th>
                        <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Interest Paid</th>
                        <th className="pb-2 text-right font-medium text-muted-foreground">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="border-b border-border/50">
                          <td className="py-2 pr-4 text-foreground">{row.year}</td>
                          <td className="py-2 pr-4 text-right text-blue-600 dark:text-blue-400">
                            {formatCurrency(row.totalPrincipal)}
                          </td>
                          <td className="py-2 pr-4 text-right text-red-600 dark:text-red-400">
                            {formatCurrency(row.totalInterest)}
                          </td>
                          <td className="py-2 text-right text-muted-foreground">
                            {formatCurrency(row.endingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b border-border text-left">
                        <th className="pb-2 pr-4 font-medium text-muted-foreground">Month</th>
                        <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Payment</th>
                        <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Principal</th>
                        <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Interest</th>
                        <th className="pb-2 text-right font-medium text-muted-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.slice(0, 120).map((row) => (
                        <tr key={row.month} className="border-b border-border/50">
                          <td className="py-2 pr-4 text-foreground">{row.month}</td>
                          <td className="py-2 pr-4 text-right text-foreground">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="py-2 pr-4 text-right text-blue-600 dark:text-blue-400">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="py-2 pr-4 text-right text-red-600 dark:text-red-400">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="py-2 text-right text-muted-foreground">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                      {result.schedule.length > 120 && (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-muted-foreground">
                            Showing first 120 months. Full schedule contains {result.schedule.length} payments.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
