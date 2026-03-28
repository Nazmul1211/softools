"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { DollarSign, TrendingUp, Calendar, PiggyBank } from "lucide-react";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const faqs: FAQItem[] = [
  {
    question: "How is my monthly mortgage payment calculated?",
    answer: "Your monthly mortgage payment is calculated using the loan amount, interest rate, and loan term. The formula considers compound interest to determine a fixed payment that pays off both principal and interest over the life of the loan. The standard formula is: M = P × [r(1+r)^n] / [(1+r)^n – 1], where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the number of payments."
  },
  {
    question: "What's the difference between interest rate and APR?",
    answer: "The interest rate is the cost of borrowing the principal loan amount. APR (Annual Percentage Rate) includes the interest rate plus other costs such as broker fees, discount points, and closing costs, expressed as a yearly rate. APR gives you a more complete picture of the true cost of your mortgage, making it easier to compare loans from different lenders."
  },
  {
    question: "Should I choose a 15-year or 30-year mortgage?",
    answer: "A 15-year mortgage has higher monthly payments but saves significantly on total interest paid over the life of the loan. A 30-year mortgage offers lower monthly payments, making it more affordable month-to-month, but you'll pay more interest overall. Choose based on your budget, financial goals, and how long you plan to stay in the home. Many financial advisors suggest the 15-year option if you can afford it."
  },
  {
    question: "What is PMI and when do I need to pay it?",
    answer: "Private Mortgage Insurance (PMI) is typically required when your down payment is less than 20% of the home's purchase price. PMI protects the lender if you default on the loan. It usually costs between 0.5% to 1% of the entire loan amount annually. You can request to remove PMI once you've built 20% equity in your home."
  },
  {
    question: "How does the down payment affect my mortgage?",
    answer: "A larger down payment reduces your loan amount, resulting in lower monthly payments and less interest paid over time. With 20% or more down, you can avoid PMI, saving hundreds per month. However, a smaller down payment allows you to buy sooner and keep more cash for emergencies or investments. Consider your full financial picture when deciding."
  },
  {
    question: "What is an amortization schedule?",
    answer: "An amortization schedule is a complete table showing each mortgage payment throughout the loan term. It breaks down how much of each payment goes toward principal versus interest. In the early years, most of your payment goes toward interest. As you progress through the loan, more goes toward principal. This schedule helps you understand how your equity builds over time."
  },
];

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("350000");
  const [downPayment, setDownPayment] = useState("70000");
  const [downPaymentType, setDownPaymentType] = useState<"amount" | "percent">("amount");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [showAmortization, setShowAmortization] = useState(false);

  const results = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const rate = parseFloat(interestRate) / 100 / 12;
    const years = parseInt(loanTerm) || 30;
    const numPayments = years * 12;
    
    let down = 0;
    if (downPaymentType === "percent") {
      down = price * (parseFloat(downPayment) || 0) / 100;
    } else {
      down = parseFloat(downPayment) || 0;
    }
    
    const principal = price - down;
    
    if (principal <= 0 || rate <= 0) {
      return null;
    }

    // Monthly payment formula: M = P × [r(1+r)^n] / [(1+r)^n – 1]
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, numPayments)) / (Math.pow(1 + rate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const amortization: AmortizationRow[] = [];
    let balance = principal;
    
    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * rate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      amortization.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal,
      downPaymentAmount: down,
      downPaymentPercent: (down / price) * 100,
      amortization,
    };
  }, [homePrice, downPayment, downPaymentType, interestRate, loanTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyDetailed = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const reset = () => {
    setHomePrice("350000");
    setDownPayment("70000");
    setDownPaymentType("amount");
    setInterestRate("6.5");
    setLoanTerm("30");
    setShowAmortization(false);
  };

  return (
    <ToolLayout
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payment, total interest, and view a detailed amortization schedule. Make informed decisions about your home purchase with our free mortgage calculator."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Loan Calculator", href: "/loan-calculator" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Savings Goal Calculator", href: "/savings-goal-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Mortgage Payments</h2>
          <p>
            A mortgage is likely the largest financial commitment you&apos;ll ever make. Understanding how your monthly payment is calculated empowers you to make smarter decisions about home buying, refinancing, and long-term financial planning. This mortgage calculator breaks down exactly how much house you can afford and what you&apos;ll pay over the life of your loan.
          </p>

          <h2>How Does a Mortgage Work?</h2>
          <p>
            When you take out a mortgage, you&apos;re borrowing money from a lender to purchase a home. In exchange, you agree to repay the loan plus interest over a set period, typically 15 or 30 years. Your monthly payment consists of four main components, often called PITI:
          </p>
          <ul>
            <li><strong>Principal:</strong> The portion that goes toward paying down your loan balance</li>
            <li><strong>Interest:</strong> The cost of borrowing money from the lender</li>
            <li><strong>Taxes:</strong> Property taxes collected by your local government (not included in this calculator)</li>
            <li><strong>Insurance:</strong> Homeowners insurance and possibly PMI (not included in this calculator)</li>
          </ul>

          <h2>The Mortgage Payment Formula</h2>
          <p>
            The monthly mortgage payment is calculated using this formula:
          </p>
          <p>
            <strong>M = P × [r(1+r)ⁿ] / [(1+r)ⁿ – 1]</strong>
          </p>
          <p>Where:</p>
          <ul>
            <li><strong>M</strong> = Monthly payment</li>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
            <li><strong>n</strong> = Total number of payments (years × 12)</li>
          </ul>

          <h3>Example Calculation</h3>
          <p>
            For a $300,000 loan at 6.5% interest over 30 years:
          </p>
          <ul>
            <li>Principal (P) = $300,000</li>
            <li>Monthly rate (r) = 0.065 ÷ 12 = 0.00542</li>
            <li>Number of payments (n) = 30 × 12 = 360</li>
            <li>Monthly payment = <strong>$1,896.20</strong></li>
          </ul>

          <h2>Factors That Affect Your Mortgage Payment</h2>
          
          <h3>Home Price and Down Payment</h3>
          <p>
            The more you put down upfront, the less you need to borrow. A 20% down payment is traditionally recommended because it eliminates the need for Private Mortgage Insurance (PMI) and typically qualifies you for better interest rates. However, many buyers successfully purchase homes with as little as 3-5% down.
          </p>

          <h3>Interest Rate</h3>
          <p>
            Even small differences in interest rates significantly impact your total cost. A 0.5% lower rate on a $300,000 loan saves you over $30,000 in interest over 30 years. Factors affecting your rate include credit score, down payment amount, loan type, and current market conditions.
          </p>

          <h3>Loan Term</h3>
          <p>
            Shorter loan terms (15 years) have higher monthly payments but dramatically reduce total interest paid. Longer terms (30 years) offer lower monthly payments but cost more over time. Consider your monthly budget, retirement timeline, and financial goals when choosing.
          </p>

          <h2>Types of Mortgages</h2>
          
          <h3>Fixed-Rate Mortgages</h3>
          <p>
            The interest rate stays the same for the entire loan term. This provides predictable payments and protection against rising rates. Fixed-rate mortgages are ideal if you plan to stay in your home long-term and value payment stability.
          </p>

          <h3>Adjustable-Rate Mortgages (ARMs)</h3>
          <p>
            ARMs start with a lower fixed rate for an initial period (typically 5, 7, or 10 years), then adjust periodically based on market conditions. They can be beneficial if you plan to sell or refinance before the adjustment period, but carry the risk of higher payments if rates rise.
          </p>

          <h3>Government-Backed Loans</h3>
          <p>
            FHA, VA, and USDA loans offer benefits like lower down payments and more flexible credit requirements. FHA loans require as little as 3.5% down. VA loans for veterans may require no down payment. USDA loans serve rural home buyers with zero down payment options.
          </p>

          <h2>Tips for Getting the Best Mortgage</h2>
          <ul>
            <li><strong>Improve your credit score:</strong> A score of 740+ typically qualifies you for the best rates</li>
            <li><strong>Save for a larger down payment:</strong> 20% avoids PMI and gets better terms</li>
            <li><strong>Shop multiple lenders:</strong> Rates and fees vary significantly between lenders</li>
            <li><strong>Consider points:</strong> Paying points upfront can lower your rate if you&apos;ll stay in the home long enough</li>
            <li><strong>Get pre-approved:</strong> Shows sellers you&apos;re serious and know your budget</li>
            <li><strong>Lock your rate:</strong> Once you find a good rate, lock it to protect against increases</li>
          </ul>

          <h2>Hidden Costs of Homeownership</h2>
          <p>
            Your mortgage payment is just part of the total cost of owning a home. Budget for these additional expenses:
          </p>
          <ul>
            <li><strong>Property taxes:</strong> Typically 1-2% of home value annually</li>
            <li><strong>Homeowners insurance:</strong> $1,000-$3,000+ per year</li>
            <li><strong>PMI:</strong> 0.5-1% of loan amount annually if down payment is less than 20%</li>
            <li><strong>HOA fees:</strong> If applicable, can range from $100-$1,000+ monthly</li>
            <li><strong>Maintenance:</strong> Budget 1-2% of home value annually for repairs and upkeep</li>
            <li><strong>Utilities:</strong> Often higher than renting due to larger space</li>
          </ul>

          <h2>When to Refinance Your Mortgage</h2>
          <p>
            Refinancing replaces your current mortgage with a new one, potentially at better terms. Consider refinancing when:
          </p>
          <ul>
            <li>Interest rates have dropped at least 0.5-1% below your current rate</li>
            <li>Your credit score has significantly improved</li>
            <li>You want to switch from an ARM to a fixed-rate mortgage</li>
            <li>You need to tap into home equity for major expenses</li>
            <li>You want to shorten your loan term to pay off your home faster</li>
          </ul>
          <p>
            Calculate your break-even point by dividing closing costs by monthly savings to ensure refinancing makes financial sense.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Home Price & Down Payment */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Home Price"
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)}
            placeholder="350000"
            suffix="$"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                label="Down Payment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder={downPaymentType === "percent" ? "20" : "70000"}
                suffix={downPaymentType === "percent" ? "%" : "$"}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDownPaymentType("amount")}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  downPaymentType === "amount"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                $ Amount
              </button>
              <button
                onClick={() => setDownPaymentType("percent")}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  downPaymentType === "percent"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                % Percent
              </button>
            </div>
          </div>
        </div>

        {/* Interest Rate & Loan Term */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Interest Rate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="6.5"
            suffix="%"
          />
          <Select
            label="Loan Term"
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            options={[
              { value: "30", label: "30 years" },
              { value: "25", label: "25 years" },
              { value: "20", label: "20 years" },
              { value: "15", label: "15 years" },
              { value: "10", label: "10 years" },
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button onClick={reset} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 pt-4">
            {/* Main Results */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrencyDetailed(results.monthlyPayment)}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <ResultsGrid columns={3}>
              <ResultCard
                label="Loan Amount"
                value={formatCurrency(results.principal)}
              />
              <ResultCard
                label="Total Interest"
                value={formatCurrency(results.totalInterest)}
              />
              <ResultCard
                label="Total Payment"
                value={formatCurrency(results.totalPayment)}
              />
            </ResultsGrid>

            {/* Payment Breakdown */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                Loan Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home Price</span>
                  <span className="font-medium">{formatCurrency(parseFloat(homePrice))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Down Payment ({results.downPaymentPercent.toFixed(1)}%)</span>
                  <span className="font-medium text-green-600">-{formatCurrency(results.downPaymentAmount)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Loan Amount</span>
                  <span>{formatCurrency(results.principal)}</span>
                </div>
              </div>
            </div>

            {/* Interest vs Principal Visual */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Payment Breakdown Over {loanTerm} Years
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Principal</span>
                    <span className="font-medium">{formatCurrency(results.principal)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(results.principal / results.totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Toggle */}
            <Button 
              onClick={() => setShowAmortization(!showAmortization)}
              variant="outline"
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {showAmortization ? "Hide" : "Show"} Amortization Schedule
            </Button>

            {/* Amortization Schedule */}
            {showAmortization && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">Amortization Schedule</h3>
                  <p className="text-sm text-muted-foreground">Showing first 12 months & yearly summaries</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Month</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Payment</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Principal</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Interest</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {results.amortization.slice(0, 12).map((row) => (
                        <tr key={row.month} className="hover:bg-muted/20">
                          <td className="px-4 py-3">{row.month}</td>
                          <td className="px-4 py-3 text-right">{formatCurrencyDetailed(row.payment)}</td>
                          <td className="px-4 py-3 text-right text-green-600">{formatCurrencyDetailed(row.principal)}</td>
                          <td className="px-4 py-3 text-right text-orange-600">{formatCurrencyDetailed(row.interest)}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.balance)}</td>
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
