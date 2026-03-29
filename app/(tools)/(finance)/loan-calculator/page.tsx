"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { formatCurrency } from "@/lib/utils";

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculateLoan = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(loanTerm) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) {
      setResult(null);
      return;
    }

    if (r === 0) {
      const monthlyPayment = p / n;
      setResult({
        monthlyPayment,
        totalPayment: p,
        totalInterest: 0,
      });
      return;
    }

    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
    });
  };

  const reset = () => {
    setPrincipal("");
    setInterestRate("");
    setLoanTerm("");
    setResult(null);
  };

  return (
    <ToolLayout
      title="Loan Calculator"
      description="Calculate your monthly loan payments, total interest, and total amount payable. Works for mortgages, auto loans, personal loans, and more."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
        { name: "EMI Calculator", href: "/emi-calculator" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-01-12"
      howToSteps={[
        { name: "Enter Loan Amount", text: "Input the total principal amount you want to borrow." },
        { name: "Set Interest Rate", text: "Enter the annual interest rate (APR) as a percentage." },
        { name: "Choose Loan Term", text: "Specify the loan duration in years." },
        { name: "Calculate Payment", text: "Click Calculate to see your monthly payment, total interest, and total repayment amount." },
      ]}
      content={
        <>
          <h2>How Does a Loan Calculator Work?</h2>
          <p>
            A loan calculator uses the standard amortization formula to determine your fixed monthly payment based on three inputs: the loan principal (the amount you borrow), the annual interest rate, and the loan term (how many years you have to repay). The formula distributes payments so that you pay off both the principal and accumulated interest evenly over the life of the loan. Early payments are interest-heavy, while later payments apply more toward the principal — this is known as the <strong>amortization schedule</strong>.
          </p>

          <h2>The Loan Payment Formula</h2>
          <p>
            The standard fixed-rate loan payment formula is:
          </p>
          <p>
            <strong>M = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> – 1]</strong>
          </p>
          <ul>
            <li><strong>M</strong> = Monthly payment</li>
            <li><strong>P</strong> = Principal (loan amount)</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate / 12)</li>
            <li><strong>n</strong> = Total number of payments (years × 12)</li>
          </ul>

          <h2>Types of Loans This Calculator Supports</h2>
          <ul>
            <li><strong>Mortgage Loans:</strong> Typically 15–30 year terms with rates from 3% to 8%, used for purchasing homes and real estate.</li>
            <li><strong>Auto Loans:</strong> Usually 3–7 year terms with rates from 4% to 12%, used for financing vehicle purchases.</li>
            <li><strong>Personal Loans:</strong> Commonly 1–5 year terms with rates from 6% to 36%, used for debt consolidation, home improvements, or major purchases.</li>
            <li><strong>Student Loans:</strong> Federal student loans have fixed rates set by the government (currently around 5–7%), while private student loans have variable rates.</li>
          </ul>

          <h2>How to Reduce Your Total Interest Paid</h2>
          <ul>
            <li><strong>Make extra payments:</strong> Even an additional $50–$100 per month can save thousands in interest and shorten your loan term by years.</li>
            <li><strong>Choose a shorter term:</strong> A 15-year mortgage has a higher monthly payment than a 30-year mortgage, but you will pay significantly less total interest.</li>
            <li><strong>Refinance when rates drop:</strong> If interest rates fall 1% or more below your current rate, refinancing can yield substantial savings over the remaining loan term.</li>
            <li><strong>Improve your credit score:</strong> Lenders offer lower interest rates to borrowers with higher credit scores. Paying bills on time and reducing credit utilization can improve your score.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>What is the difference between APR and interest rate?</h3>
          <p>
            The interest rate is the cost of borrowing the principal. The Annual Percentage Rate (APR) includes the interest rate <em>plus</em> other charges such as origination fees, closing costs, and mortgage insurance. APR gives you a more accurate picture of the true cost of a loan.
          </p>

          <h3>Should I choose a fixed or variable rate?</h3>
          <p>
            A <strong>fixed rate</strong> stays the same for the entire loan term, making your payments predictable. A <strong>variable rate</strong> (also called adjustable rate) starts lower but can increase or decrease over time based on market conditions. Fixed rates are generally safer for long-term loans, while variable rates may benefit short-term borrowers.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Loan Amount"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter amount"
            suffix="$"
          />
          <Input
            label="Interest Rate"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Annual rate"
            suffix="%"
          />
          <Input
            label="Loan Term"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="Years"
            suffix="years"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={calculateLoan} size="lg">
            Calculate
          </Button>
          <Button onClick={reset} variant="outline" size="lg">
            Reset
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <ResultsGrid columns={3}>
              <ResultCard
                label="Monthly Payment"
                value={formatCurrency(result.monthlyPayment)}
                highlight
              />
              <ResultCard
                label="Total Interest"
                value={formatCurrency(result.totalInterest)}
              />
              <ResultCard
                label="Total Payment"
                value={formatCurrency(result.totalPayment)}
              />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
              <h3 className="font-medium text-foreground dark:text-foreground">
                Payment Breakdown
              </h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground dark:text-muted-foreground">Principal</span>
                  <span className="font-medium text-foreground dark:text-foreground">
                    {formatCurrency(parseFloat(principal))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground dark:text-muted-foreground">Interest</span>
                  <span className="font-medium text-foreground dark:text-foreground">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 dark:border-border">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-foreground dark:text-foreground">Total</span>
                    <span className="text-foreground dark:text-foreground">
                      {formatCurrency(result.totalPayment)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-4 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(parseFloat(principal) / result.totalPayment) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>
                    Principal:{" "}
                    {((parseFloat(principal) / result.totalPayment) * 100).toFixed(1)}%
                  </span>
                  <span>
                    Interest:{" "}
                    {((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
