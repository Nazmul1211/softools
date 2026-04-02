"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Calculator, DollarSign, Percent, Wallet } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

const periodsPerYear: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

export default function PayrollCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState(28);
  const [hoursWorked, setHoursWorked] = useState(80);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [frequency, setFrequency] = useState<PayFrequency>("biweekly");
  const [taxRate, setTaxRate] = useState(22);
  const [otherDeductions, setOtherDeductions] = useState(120);

  const result = useMemo(() => {
    const regularPay = hourlyRate * hoursWorked;
    const overtimePay = hourlyRate * overtimeMultiplier * overtimeHours;
    const grossPay = regularPay + overtimePay;
    const taxWithholding = grossPay * (taxRate / 100);
    const netPay = Math.max(0, grossPay - taxWithholding - otherDeductions);

    const annualGross = grossPay * periodsPerYear[frequency];
    const annualNet = netPay * periodsPerYear[frequency];

    return { regularPay, overtimePay, grossPay, taxWithholding, netPay, annualGross, annualNet };
  }, [hourlyRate, hoursWorked, overtimeHours, overtimeMultiplier, frequency, taxRate, otherDeductions]);

  return (
    <ToolLayout
      title="Payroll Calculator"
      description="Estimate paycheck results from gross to net pay. Include overtime, tax withholding, and fixed deductions for realistic payroll planning."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Salary Calculator", href: "/salary-calculator/" },
        { name: "Tax Calculator", href: "/tax-calculator/" },
        { name: "Budget Calculator", href: "/savings-calculator/" },
        { name: "Break-Even Calculator", href: "/break-even-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Wage Inputs", text: "Add regular hourly rate and total worked hours." },
        { name: "Include Overtime", text: "Add overtime hours and overtime multiplier." },
        { name: "Set Deductions", text: "Use estimated tax rate and fixed deductions." },
        { name: "Review Net Pay", text: "See gross pay, withholdings, and take-home amount." },
      ]}
      faqs={[
        {
          question: "Is this payroll calculator exact?",
          answer:
            "It is an estimate. Actual payroll varies by location, filing status, benefit elections, and employer-specific rules.",
        },
        {
          question: "How should I choose tax rate?",
          answer:
            "Use your blended withholding estimate from prior paystubs, then adjust as needed. Conservative planning uses a slightly higher rate.",
        },
        {
          question: "Can this include benefits deductions?",
          answer:
            "Yes. Add recurring deductions such as insurance premiums or retirement contributions in the fixed deduction field.",
        },
      ]}
      content={
        <>
          <h2>Gross pay and net pay fundamentals</h2>
          <p>
            Gross pay is your earnings before taxes and deductions. Net pay is the amount you actually receive.
            Tracking both helps with budgeting, debt planning, and negotiating compensation.
          </p>
          <p>
            Payroll outcomes depend on work hours, overtime policy, tax setup, and recurring deductions such as
            benefits or retirement contributions. Small changes in withholding assumptions can significantly
            affect monthly cash flow.
          </p>

          <h2>Why payroll estimates are useful</h2>
          <p>
            Payroll estimates help employees forecast take-home pay and help managers model labor costs. Use
            this tool to test schedule changes, overtime scenarios, or pay-rate adjustments before decisions are made.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Calculator className="h-5 w-5 text-primary" /> Payroll Inputs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="mb-1 text-sm font-medium text-muted-foreground">Hourly Rate</label><input type="number" min={0} step={0.01} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 text-sm font-medium text-muted-foreground">Regular Hours</label><input type="number" min={0} step={0.5} value={hoursWorked} onChange={(e) => setHoursWorked(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 text-sm font-medium text-muted-foreground">Overtime Hours</label><input type="number" min={0} step={0.5} value={overtimeHours} onChange={(e) => setOvertimeHours(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 text-sm font-medium text-muted-foreground">OT Multiplier</label><input type="number" min={1} step={0.1} value={overtimeMultiplier} onChange={(e) => setOvertimeMultiplier(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div>
              <label className="mb-1 text-sm font-medium text-muted-foreground">Pay Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value as PayFrequency)} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="semimonthly">Semi-monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div><label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Percent className="h-4 w-4" /> Estimated Tax Rate</label><input type="number" min={0} step={0.1} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
            <div><label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><DollarSign className="h-4 w-4" /> Other Deductions</label><input type="number" min={0} step={0.01} value={otherDeductions} onChange={(e) => setOtherDeductions(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" /></div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Gross Pay</p><p className="text-2xl font-bold">{formatCurrency(result.grossPay)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Tax Withholding</p><p className="text-2xl font-bold">{formatCurrency(result.taxWithholding)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Net Pay</p><p className="text-2xl font-bold">{formatCurrency(result.netPay)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Annual Net (Est.)</p><p className="text-2xl font-bold">{formatCurrency(result.annualNet)}</p></div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground flex items-center gap-2"><Wallet className="h-4 w-4" /> Annual gross estimate: {formatCurrency(result.annualGross)}</div>
      </div>
    </ToolLayout>
  );
}
