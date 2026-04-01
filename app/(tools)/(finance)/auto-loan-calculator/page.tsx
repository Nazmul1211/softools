"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Car,
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingDown,
  PiggyBank,
  BarChart3,
} from "lucide-react";

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
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

function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateAutoLoan(
  vehiclePrice: number,
  downPayment: number,
  tradeInValue: number,
  interestRate: number,
  loanTermMonths: number,
  salesTaxRate: number
): LoanResult {
  const taxableAmount = vehiclePrice - tradeInValue;
  const salesTax = (taxableAmount * salesTaxRate) / 100;
  const loanAmount = vehiclePrice + salesTax - downPayment - tradeInValue;
  
  if (loanAmount <= 0 || loanTermMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      amortizationSchedule: [],
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  let monthlyPayment: number;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / loanTermMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  }

  const totalPayment = monthlyPayment * loanTermMonths;
  const totalInterest = totalPayment - loanAmount;

  // Generate amortization schedule
  const amortizationSchedule: LoanResult["amortizationSchedule"] = [];
  let balance = loanAmount;

  for (let month = 1; month <= loanTermMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    amortizationSchedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance,
    });
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    amortizationSchedule,
  };
}

export default function AutoLoanCalculatorPage() {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [salesTaxRate, setSalesTaxRate] = useState(7);

  const result = useMemo(() => {
    return calculateAutoLoan(
      vehiclePrice,
      downPayment,
      tradeInValue,
      interestRate,
      loanTermMonths,
      salesTaxRate
    );
  }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTermMonths, salesTaxRate]);

  const loanAmount = vehiclePrice + (vehiclePrice - tradeInValue) * salesTaxRate / 100 - downPayment - tradeInValue;

  return (
    <ToolLayout
      title="Auto Loan Calculator"
      description="Calculate your monthly car payment, total interest, and view a complete amortization schedule. Enter your vehicle price, down payment, and loan terms to see exactly what you'll pay."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Loan Calculator", href: "/loan-calculator/" },
        { name: "Mortgage Calculator", href: "/mortgage-calculator/" },
        { name: "EMI Calculator", href: "/emi-calculator/" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Vehicle Price", text: "Input the total price of the vehicle you're considering." },
        { name: "Add Down Payment", text: "Enter your down payment amount and trade-in value if applicable." },
        { name: "Set Loan Terms", text: "Choose your interest rate and loan term length." },
        { name: "Review Results", text: "See your monthly payment and total cost breakdown." },
      ]}
      faqs={[
        {
          question: "What is a good interest rate for an auto loan?",
          answer: "Auto loan rates vary based on credit score, loan term, and whether the car is new or used. As of 2024, excellent credit (750+) may get rates from 4-6%, good credit (700-749) may see 6-9%, and fair credit (650-699) might see 9-14%. Always shop around at multiple lenders.",
        },
        {
          question: "Should I choose a shorter or longer loan term?",
          answer: "Shorter loan terms (36-48 months) have higher monthly payments but lower total interest. Longer terms (60-84 months) have lower monthly payments but you'll pay more interest overall and risk being 'underwater' on your loan. Try to keep it under 60 months.",
        },
        {
          question: "How much should I put down on a car?",
          answer: "A 20% down payment is ideal as it reduces your loan amount, lowers monthly payments, helps you avoid being underwater, and may get you better interest rates. At minimum, aim for 10% to offset immediate depreciation.",
        },
        {
          question: "What fees are not included in this calculator?",
          answer: "This calculator estimates principal and interest. Additional costs may include: dealer fees, registration, title fees, documentation fees, and extended warranty. Always get the full out-the-door price from dealers.",
        },
      ]}
      content={
        <>
          <h2>Understanding Auto Loans</h2>
          <p>
            An auto loan is a secured loan used to purchase a vehicle, where the car itself serves as collateral. Understanding how auto loans work helps you make smarter financing decisions and potentially save thousands of dollars over the life of your loan.
          </p>
          <p>
            The key factors affecting your auto loan are the loan amount (vehicle price minus down payment and trade-in), interest rate (APR), and loan term. Each of these significantly impacts both your monthly payment and total cost of ownership.
          </p>

          <h2>How to Get the Best Auto Loan Rate</h2>
          <p>
            Start by checking your credit score before shopping. Higher scores qualify for better rates. Get pre-approved from your bank, credit union, or online lenders before visiting dealerships—this gives you negotiating power and a baseline to compare dealer financing.
          </p>
          <p>
            Credit unions often offer the most competitive auto loan rates. Consider timing your purchase at month-end or year-end when dealers are motivated to meet quotas. Always negotiate the total price, not just the monthly payment.
          </p>

          <h2>New vs. Used Car Loans</h2>
          <p>
            New car loans typically have lower interest rates (2-4% lower on average) than used car loans because new cars are less risky for lenders. However, new cars depreciate faster—often 20-30% in the first year. Used cars 2-3 years old often provide the best value balance.
          </p>
          <p>
            When financing a used car, be cautious of longer loan terms on older vehicles. You don't want to still be making payments when the car needs major repairs. Aim for loan terms where you'll pay off the car before any major maintenance milestones.
          </p>

          <h2>Total Cost of Car Ownership</h2>
          <p>
            Beyond the loan payment, factor in insurance (which varies by vehicle), fuel costs, maintenance, and registration. Some vehicles cost significantly more to insure or maintain. Research the total cost of ownership for any vehicle you're considering.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Car className="h-5 w-5 text-primary" />
            Loan Details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Vehicle Price
              </label>
              <input
                type="number"
                min={0}
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <PiggyBank className="h-4 w-4" />
                Down Payment
              </label>
              <input
                type="number"
                min={0}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Car className="h-4 w-4" />
                Trade-In Value
              </label>
              <input
                type="number"
                min={0}
                value={tradeInValue}
                onChange={(e) => setTradeInValue(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Interest Rate (APR %)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Loan Term (Months)
              </label>
              <select
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                <option value={24}>24 months (2 years)</option>
                <option value={36}>36 months (3 years)</option>
                <option value={48}>48 months (4 years)</option>
                <option value={60}>60 months (5 years)</option>
                <option value={72}>72 months (6 years)</option>
                <option value={84}>84 months (7 years)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Sales Tax Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={15}
                step={0.1}
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result.monthlyPayment > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrencyPrecise(result.monthlyPayment)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(loanAmount)}
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
                  <BarChart3 className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.totalPayment)}
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Payment Breakdown
              </h3>

              <div className="space-y-4">
                {/* Stacked Bar */}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(loanAmount / result.totalPayment) * 100}%`,
                      }}
                      title={`Principal: ${formatCurrency(loanAmount)}`}
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
                      Principal ({((loanAmount / result.totalPayment) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500" />
                    <span className="text-muted-foreground">
                      Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">
                    Over {loanTermMonths} months, you'll pay{" "}
                    <strong className="text-foreground">{formatCurrency(result.totalPayment)}</strong> total.
                    That includes{" "}
                    <strong className="text-red-600 dark:text-red-400">{formatCurrency(result.totalInterest)}</strong> in interest charges.
                  </p>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Amortization Schedule
              </h3>

              <div className="max-h-80 overflow-auto">
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
                    {result.amortizationSchedule.map((row) => (
                      <tr key={row.month} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{row.month}</td>
                        <td className="py-2 pr-4 text-right text-foreground">
                          {formatCurrencyPrecise(row.payment)}
                        </td>
                        <td className="py-2 pr-4 text-right text-blue-600 dark:text-blue-400">
                          {formatCurrencyPrecise(row.principal)}
                        </td>
                        <td className="py-2 pr-4 text-right text-red-600 dark:text-red-400">
                          {formatCurrencyPrecise(row.interest)}
                        </td>
                        <td className="py-2 text-right text-muted-foreground">
                          {formatCurrencyPrecise(row.balance)}
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
