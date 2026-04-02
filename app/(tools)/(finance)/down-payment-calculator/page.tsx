"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Calculator, DollarSign, Home, Percent } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function monthlyPayment(principal: number, annualRate: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const months = termYears * 12;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function DownPaymentCalculatorPage() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.75);
  const [termYears, setTermYears] = useState(30);
  const [annualTaxesInsurance, setAnnualTaxesInsurance] = useState(7200);

  const result = useMemo(() => {
    const downPayment = homePrice * (downPercent / 100);
    const loanAmount = Math.max(0, homePrice - downPayment);
    const principalAndInterest = monthlyPayment(loanAmount, interestRate, termYears);
    const taxesInsuranceMonthly = annualTaxesInsurance / 12;
    const pmiMonthly = downPercent < 20 ? loanAmount * 0.007 / 12 : 0;
    const estimatedMonthlyHousing = principalAndInterest + taxesInsuranceMonthly + pmiMonthly;

    return { downPayment, loanAmount, principalAndInterest, taxesInsuranceMonthly, pmiMonthly, estimatedMonthlyHousing };
  }, [homePrice, downPercent, interestRate, termYears, annualTaxesInsurance]);

  return (
    <ToolLayout
      title="Down Payment Calculator"
      description="Calculate down payment amount, financed loan amount, and estimated monthly housing cost including optional PMI assumptions."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Mortgage Calculator", href: "/mortgage-calculator/" },
        { name: "Loan Calculator", href: "/loan-calculator/" },
        { name: "Amortization Calculator", href: "/amortization-calculator/" },
        { name: "Auto Loan Calculator", href: "/auto-loan-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Home Price", text: "Input purchase price of the property." },
        { name: "Choose Down Payment %", text: "Set your expected upfront payment percentage." },
        { name: "Set Loan Assumptions", text: "Use your estimated mortgage rate and term." },
        { name: "Review Monthly Cost", text: "Check principal/interest, taxes/insurance, and PMI estimate." },
      ]}
      faqs={[
        {
          question: "How much down payment is ideal?",
          answer:
            "Many buyers target 20% to reduce borrowing cost and avoid PMI, but affordable and sustainable cash reserves are equally important.",
        },
        {
          question: "What is PMI and when does it apply?",
          answer:
            "PMI (private mortgage insurance) is commonly required when down payment is below 20% on conventional loans.",
        },
        {
          question: "Does this include all homeownership costs?",
          answer:
            "No. This is an estimate. Maintenance, HOA dues, utilities, and closing costs are not included unless you add them separately.",
        },
      ]}
      content={
        <>
          <h2>Why down payment planning matters</h2>
          <p>
            Your down payment directly affects loan size, monthly payment, and overall financing cost. A larger
            down payment lowers debt and interest, but also ties up cash that could be kept as an emergency reserve.
          </p>
          <p>
            This calculator helps balance affordability and risk by showing how down payment changes monthly housing
            cost. It can also highlight when PMI may apply under common lending assumptions.
          </p>

          <h2>Comparing scenarios before buying</h2>
          <p>
            Run multiple scenarios at different down payment levels and rates. This lets you compare how much extra
            monthly cash flow you preserve versus how much total interest you may pay over time.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Calculator className="h-5 w-5 text-primary" /> Home Purchase Inputs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Home className="h-4 w-4" /> Home Price</label><input type="number" min={0} value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Percent className="h-4 w-4" /> Down Payment %</label><input type="number" min={0} step={0.1} value={downPercent} onChange={(e) => setDownPercent(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Percent className="h-4 w-4" /> Interest Rate %</label><input type="number" min={0} step={0.01} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 text-sm font-medium text-muted-foreground">Loan Term (years)</label><input type="number" min={1} value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><DollarSign className="h-4 w-4" /> Annual Taxes + Insurance</label><input type="number" min={0} value={annualTaxesInsurance} onChange={(e) => setAnnualTaxesInsurance(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Down Payment</p><p className="text-2xl font-bold">{formatCurrency(result.downPayment)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Loan Amount</p><p className="text-2xl font-bold">{formatCurrency(result.loanAmount)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">P&I Monthly</p><p className="text-2xl font-bold">{formatCurrency(result.principalAndInterest)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Estimated Monthly Housing</p><p className="text-2xl font-bold">{formatCurrency(result.estimatedMonthlyHousing)}</p></div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          PMI estimate shown when down payment is below 20% using a simplified annual factor (0.7% of loan amount).
        </div>
      </div>
    </ToolLayout>
  );
}
