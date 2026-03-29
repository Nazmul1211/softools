"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

export default function ROICalculator() {
  const [invested, setInvested] = useState("5000");
  const [returned, setReturned] = useState("7500");
  const [years, setYears] = useState("2");

  const [roi, setRoi] = useState<number | null>(null);
  const [annualizedRoi, setAnnualizedRoi] = useState<number | null>(null);
  const [netProfit, setNetProfit] = useState<number | null>(null);

  useEffect(() => {
    const inv = parseFloat(invested);
    const ret = parseFloat(returned);
    const t = parseFloat(years);

    if (isNaN(inv) || isNaN(ret) || inv <= 0) {
      setRoi(null);
      setAnnualizedRoi(null);
      setNetProfit(null);
      return;
    }

    const profit = ret - inv;
    const roiValue = (profit / inv) * 100;

    setNetProfit(profit);
    setRoi(roiValue);

    if (!isNaN(t) && t > 0) {
      const annualized = (Math.pow(ret / inv, 1 / t) - 1) * 100;
      setAnnualizedRoi(annualized);
    } else {
      setAnnualizedRoi(null);
    }
  }, [invested, returned, years]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <ToolLayout
      title="ROI Calculator"
      description="Calculate your Return on Investment (ROI) to evaluate the profitability of any investment, business decision, or marketing campaign. Get both basic and annualized ROI."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
        { name: "Savings Goal Calculator", href: "/savings-goal-calculator" },
        { name: "Loan Calculator", href: "/loan-calculator" },
      ]}
      content={
        <>
          <h2>What is Return on Investment (ROI)?</h2>
          <p>
            Return on Investment (ROI) is a widely used financial metric that measures the profitability or efficiency of an investment relative to its initial cost. Whether you are buying stocks, starting a marketing campaign, or purchasing real estate, ROI tells you precisely how much value you gained (or lost) on your initial capital.
          </p>
          
          <h2>How to Calculate ROI</h2>
          <p>
            Calculating your basic ROI requires only two numbers: the <strong>Amount Invested</strong> and the <strong>Amount Returned</strong> (current value or final sale price). The standard ROI formula is as follows:
          </p>
          <ul>
            <li><strong>Net Profit</strong> = Amount Returned - Amount Invested</li>
            <li><strong>ROI (%)</strong> = (Net Profit / Amount Invested) × 100</li>
          </ul>
          
          <h3>What is Annualized ROI?</h3>
          <p>
            While standard ROI measures your total growth, it ignores the <em>time</em> it took to get there. For example, a 20% return over one year is excellent, but a 20% return over ten years is poor. 
            <strong>Annualized ROI</strong> levels the playing field by calculating the equivalent geometric average return <em>per year</em>. This is crucial for comparing investments held for different lengths of time.
          </p>

          <h2>What is a &quot;Good&quot; ROI?</h2>
          <p>
            A &quot;good&quot; ROI depends entirely on your risk tolerance and the asset class:
          </p>
          <ul>
            <li><strong>Stock Market (S&P 500):</strong> Historically averages around 7% to 10% annualized ROI before inflation.</li>
            <li><strong>Real Estate:</strong> Often targets 8% to 12% annual returns depending on leverage and rental yields.</li>
            <li><strong>Savings Accounts & CDs:</strong> Generally offer much lower, but guaranteed and risk-free, returns (e.g., 2% to 5%).</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Amount Invested"
            type="number"
            value={invested}
            onChange={(e) => setInvested(e.target.value)}
            placeholder="5000"
            suffix="$"
          />
          <Input
            label="Amount Returned"
            type="number"
            value={returned}
            onChange={(e) => setReturned(e.target.value)}
            placeholder="7500"
            suffix="$"
          />
          <Input
            label="Investment Period"
            type="number"
            step="0.5"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="2"
            suffix="yrs"
          />
        </div>

        {/* Results */}
        {roi !== null && netProfit !== null && (
          <ResultsGrid columns={3}>
            <ResultCard
              label="Return on Investment"
              value={`${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%`}
              highlight
            />
            <ResultCard label="Net Profit" value={formatCurrency(netProfit)} />
            {annualizedRoi !== null && (
              <ResultCard
                label="Annualized ROI"
                value={`${annualizedRoi >= 0 ? "+" : ""}${annualizedRoi.toFixed(2)}%`}
              />
            )}
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
