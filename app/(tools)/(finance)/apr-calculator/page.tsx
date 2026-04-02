"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Calculator, DollarSign, Percent, Receipt } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function monthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  if (termMonths <= 0 || principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

function estimateApr(principal: number, financedAmount: number, payment: number, termMonths: number): number {
  if (principal <= 0 || financedAmount <= 0 || payment <= 0 || termMonths <= 0) return 0;
  let low = 0;
  let high = 100;
  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const testPayment = monthlyPayment(financedAmount, mid, termMonths);
    if (testPayment > payment) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

export default function AprCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [termMonths, setTermMonths] = useState(60);
  const [fees, setFees] = useState(1200);

  const result = useMemo(() => {
    const principalAfterFees = Math.max(0, loanAmount - fees);
    const payment = monthlyPayment(loanAmount, interestRate, termMonths);
    const apr = estimateApr(loanAmount, principalAfterFees, payment, termMonths);
    const totalPaid = payment * termMonths;
    const totalFinanceCost = totalPaid - principalAfterFees;

    return { principalAfterFees, payment, apr, totalPaid, totalFinanceCost };
  }, [loanAmount, interestRate, termMonths, fees]);

  return (
    <ToolLayout
      title="APR Calculator"
      description="Estimate annual percentage rate by accounting for both interest and upfront loan fees. Compare loans using a clearer total borrowing cost metric."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Loan Calculator", href: "/loan-calculator/" },
        { name: "Auto Loan Calculator", href: "/auto-loan-calculator/" },
        { name: "Amortization Calculator", href: "/amortization-calculator/" },
        { name: "Simple Interest Calculator", href: "/simple-interest-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Loan Terms", text: "Input loan amount, nominal interest rate, and term." },
        { name: "Add Upfront Fees", text: "Include origination or processing fees paid at closing." },
        { name: "Review APR", text: "Compare APR to nominal interest rate." },
        { name: "Compare Offers", text: "Use APR to evaluate multiple lenders consistently." },
      ]}
      faqs={[
        {
          question: "What is APR?",
          answer:
            "APR (Annual Percentage Rate) reflects total annual borrowing cost, including interest and certain mandatory fees, making it better for comparing loan offers.",
        },
        {
          question: "Why is APR higher than interest rate?",
          answer:
            "APR is often higher because it includes fees in addition to interest. If fees are zero, APR and nominal interest rate can be very close.",
        },
        {
          question: "Does APR include all costs?",
          answer:
            "Not always. Some optional fees, penalties, and external costs may be excluded by lenders. Read disclosures carefully alongside APR.",
        },
      ]}
      content={
        <>
          <h2>APR vs nominal interest rate</h2>
          <p>
            The nominal interest rate is the stated rate applied to your balance. APR extends that by adding
            certain required financing costs, giving a more realistic borrowing metric. Two loans with the
            same nominal rate can have different APR values if fees differ.
          </p>
          <p>
            That is why APR is commonly used in consumer finance comparisons. It helps reduce confusion
            created by low advertised rates paired with large origination or processing charges.
          </p>

          <h2>Using APR for better loan comparisons</h2>
          <p>
            Compare offers using the same loan amount and term assumptions. A lower APR generally indicates a
            cheaper loan, but also review flexibility terms such as prepayment policy, late fees, and rate
            reset clauses.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-violet-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Calculator className="h-5 w-5 text-primary" /> APR Inputs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><DollarSign className="h-4 w-4" /> Loan Amount</label>
              <input type="number" min={0} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Percent className="h-4 w-4" /> Interest Rate (%)</label>
              <input type="number" min={0} step={0.01} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-muted-foreground">Term (months)</label>
              <input type="number" min={1} value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Receipt className="h-4 w-4" /> Upfront Fees</label>
              <input type="number" min={0} value={fees} onChange={(e) => setFees(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Estimated APR</p><p className="text-2xl font-bold">{result.apr.toFixed(2)}%</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Monthly Payment</p><p className="text-2xl font-bold">{formatCurrency(result.payment)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Amount Received</p><p className="text-2xl font-bold">{formatCurrency(result.principalAfterFees)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Total Finance Cost</p><p className="text-2xl font-bold">{formatCurrency(result.totalFinanceCost)}</p></div>
        </div>
      </div>
    </ToolLayout>
  );
}
