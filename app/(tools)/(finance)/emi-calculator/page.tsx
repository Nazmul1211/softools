"use client";

import { useState, useEffect, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState<"months" | "years">("years");
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo<EMIResult | null>(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(interestRate);
    const tenureValue = parseFloat(tenure);

    if (isNaN(P) || isNaN(annualRate) || isNaN(tenureValue) || P <= 0 || annualRate < 0 || tenureValue <= 0) {
      return null;
    }

    const months = tenureType === "years" ? tenureValue * 12 : tenureValue;
    const monthlyRate = annualRate / 12 / 100;

    let emi: number;
    if (monthlyRate === 0) {
      emi = P / months;
    } else {
      emi = (P * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;

    // Generate amortization schedule
    const schedule: EMIResult["schedule"] = [];
    let balance = P;

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      schedule,
    };
  }, [principal, interestRate, tenure, tenureType]);

  const reset = () => {
    setPrincipal("");
    setInterestRate("");
    setTenure("");
    setShowSchedule(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <ToolLayout
      title="EMI Calculator"
      description="Calculate your Equated Monthly Installment (EMI) for any loan. Perfect for home loans, car loans, personal loans, and education loans."
      category={{ name: "Finance", slug: "finance" }}
      relatedTools={[
        { name: "Loan Calculator", href: "/loan-calculator" },
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
      ]}
      content={
        <>
          <h2>What is EMI (Equated Monthly Installment)?</h2>
          <p>
            EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is fully paid off along with interest.
          </p>

          <h2>How is EMI Calculated?</h2>
          <p>
            The EMI formula uses three variables: principal amount, interest rate, and loan tenure. The mathematical formula is:
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
          </p>
          <ul>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate / 12 / 100)</li>
            <li><strong>n</strong> = Number of monthly installments</li>
          </ul>

          <h2>Factors Affecting EMI</h2>
          <ul>
            <li><strong>Loan Amount:</strong> Higher principal means higher EMI</li>
            <li><strong>Interest Rate:</strong> Higher interest rate increases EMI and total cost</li>
            <li><strong>Loan Tenure:</strong> Longer tenure reduces EMI but increases total interest paid</li>
          </ul>

          <h2>Tips for Managing EMI</h2>
          <ul>
            <li>Keep your total EMI obligations under 40-50% of your monthly income</li>
            <li>Consider prepayment options to reduce interest burden</li>
            <li>Compare interest rates from multiple lenders before finalizing</li>
            <li>Choose the shortest tenure you can comfortably afford</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Loan Amount (Principal)"
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="Enter loan amount"
          suffix="$"
        />

        <Input
          label="Annual Interest Rate"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="Enter interest rate"
          suffix="%"
          step="0.01"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Loan Tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="Enter tenure"
          />
          <Select
            label="Tenure Type"
            id="tenureType"
            value={tenureType}
            onChange={(e) => setTenureType(e.target.value as "months" | "years")}
            options={[
              { value: "years", label: "Years" },
              { value: "months", label: "Months" },
            ]}
          />
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <ResultsGrid columns={3}>
              <ResultCard label="Monthly EMI" value={formatCurrency(result.emi)} highlight />
              <ResultCard label="Total Interest" value={formatCurrency(result.totalInterest)} />
              <ResultCard label="Total Payment" value={formatCurrency(result.totalPayment)} />
            </ResultsGrid>

            {/* Loan Breakdown Visual */}
            <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
              <p className="text-sm text-muted-foreground mb-3">Loan Breakdown</p>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  className="bg-primary"
                  style={{ width: `${(parseFloat(principal) / result.totalPayment) * 100}%` }}
                  title="Principal"
                />
                <div
                  className="bg-orange-500"
                  style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
                  title="Interest"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-primary inline-block" />
                  Principal ({((parseFloat(principal) / result.totalPayment) * 100).toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-orange-500 inline-block" />
                  Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Amortization Schedule Toggle */}
            <Button
              onClick={() => setShowSchedule(!showSchedule)}
              variant="outline"
              className="w-full"
            >
              {showSchedule ? "Hide" : "Show"} Amortization Schedule
            </Button>

            {showSchedule && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Month</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Principal</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Interest</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-muted/30">
                          <td className="px-4 py-2 text-foreground">{row.month}</td>
                          <td className="px-4 py-2 text-right text-foreground">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-2 text-right text-foreground">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-2 text-right text-foreground">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
