"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CreditCard, Calculator, TrendingDown, Calendar, DollarSign, Target } from "lucide-react";

interface PayoffResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  months: number;
  payoffDate: Date;
  schedule: PaymentScheduleItem[];
}

interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function calculateFixedPayment(
  balance: number,
  apr: number,
  monthlyPayment: number
): PayoffResult | null {
  if (balance <= 0 || apr < 0 || monthlyPayment <= 0) return null;

  const monthlyRate = apr / 100 / 12;
  const minPayment = balance * monthlyRate;

  if (monthlyPayment <= minPayment) {
    return null; // Payment too low to ever pay off
  }

  const schedule: PaymentScheduleItem[] = [];
  let remainingBalance = balance;
  let totalInterest = 0;
  let month = 0;

  while (remainingBalance > 0.01 && month < 600) {
    month++;
    const interestCharge = remainingBalance * monthlyRate;
    const actualPayment = Math.min(monthlyPayment, remainingBalance + interestCharge);
    const principalPayment = actualPayment - interestCharge;
    remainingBalance -= principalPayment;
    totalInterest += interestCharge;

    schedule.push({
      month,
      payment: actualPayment,
      principal: principalPayment,
      interest: interestCharge,
      balance: Math.max(0, remainingBalance),
    });
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    monthlyPayment,
    totalPayments: balance + totalInterest,
    totalInterest,
    months: month,
    payoffDate,
    schedule,
  };
}

function calculatePayoffTime(
  balance: number,
  apr: number,
  targetMonths: number
): PayoffResult | null {
  if (balance <= 0 || apr < 0 || targetMonths <= 0) return null;

  const monthlyRate = apr / 100 / 12;
  
  // Formula: P = (r * PV) / (1 - (1 + r)^-n)
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = balance / targetMonths;
  } else {
    monthlyPayment =
      (monthlyRate * balance) / (1 - Math.pow(1 + monthlyRate, -targetMonths));
  }

  return calculateFixedPayment(balance, apr, monthlyPayment);
}

export default function CreditCardPayoffCalculatorPage() {
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("19.99");
  const [mode, setMode] = useState<"payment" | "time">("payment");
  const [monthlyPayment, setMonthlyPayment] = useState("200");
  const [targetMonths, setTargetMonths] = useState("24");
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const result = useMemo(() => {
    const balanceNum = parseFloat(balance);
    const aprNum = parseFloat(apr);

    if (mode === "payment") {
      const paymentNum = parseFloat(monthlyPayment);
      return calculateFixedPayment(balanceNum, aprNum, paymentNum);
    } else {
      const monthsNum = parseInt(targetMonths);
      return calculatePayoffTime(balanceNum, aprNum, monthsNum);
    }
  }, [balance, apr, mode, monthlyPayment, targetMonths]);

  const minimumPayment = useMemo(() => {
    const balanceNum = parseFloat(balance);
    const aprNum = parseFloat(apr);
    if (isNaN(balanceNum) || isNaN(aprNum)) return 0;
    const monthlyRate = aprNum / 100 / 12;
    return Math.max(balanceNum * 0.02, balanceNum * monthlyRate + 10);
  }, [balance, apr]);

  const faqs = [
    {
      question: "How is credit card interest calculated?",
      answer:
        "Credit card interest is typically calculated using the average daily balance method. Your APR is divided by 365 to get a daily rate, which is multiplied by your balance each day. This calculator uses monthly compounding (APR ÷ 12) for simplicity, which closely approximates actual credit card interest.",
    },
    {
      question: "What is the minimum payment on a credit card?",
      answer:
        "Minimum payments are usually the greater of: a flat amount ($25-$35), or a percentage of your balance (1-3%), or the interest charges plus fees. Paying only minimums can take decades to pay off debt and cost thousands in interest.",
    },
    {
      question: "How can I pay off credit card debt faster?",
      answer:
        "Key strategies include: paying more than the minimum, using the avalanche method (highest APR first) or snowball method (smallest balance first), transferring to a 0% APR card, negotiating a lower rate, and avoiding new charges while paying down debt.",
    },
    {
      question: "What is a good APR for a credit card?",
      answer:
        "Average credit card APRs range from 15-25%. Cards for excellent credit may offer 12-15%, while subprime cards can exceed 25%. Introductory 0% APR offers (12-21 months) can help pay off debt interest-free if you qualify.",
    },
    {
      question: "Should I close my credit card after paying it off?",
      answer:
        "Generally, keeping the card open is better for your credit score. Closing it reduces your available credit (hurting utilization ratio) and shortens your credit history. Consider keeping it with a small recurring charge and autopay.",
    },
    {
      question: "What is the debt avalanche vs snowball method?",
      answer:
        "The avalanche method pays off highest-APR debts first, minimizing total interest. The snowball method pays off smallest balances first, providing psychological wins. Mathematically, avalanche saves more money, but snowball can help maintain motivation.",
    },
  ];

  const howToSteps = [
    {
      name: "Enter your balance",
      text: "Input your current credit card balance. This is the amount you owe before interest charges.",
    },
    {
      name: "Enter your APR",
      text: "Input your card's annual percentage rate. Find this on your statement or card agreement. Typical rates range from 15-25%.",
    },
    {
      name: "Choose calculation mode",
      text: "Select whether you want to calculate payoff time based on monthly payment, or monthly payment based on target payoff time.",
    },
    {
      name: "Enter payment or time goal",
      text: "Input either your monthly payment amount or your target months to be debt-free.",
    },
    {
      name: "Review your payoff plan",
      text: "See your total interest cost, payoff date, and full amortization schedule. Adjust values to find your optimal strategy.",
    },
  ];

  const content = `
## Credit Card Payoff Calculator: Your Path to Debt Freedom

Carrying credit card debt can be expensive and stressful. This calculator helps you create a clear payoff plan by showing exactly how long it will take to become debt-free and how much interest you'll pay. Use it to explore different payment scenarios and find the fastest, most affordable path out of debt.

### Understanding Credit Card Interest

Credit card interest compounds, meaning you pay interest on your interest. Here's how it works:

**Daily Periodic Rate**: Your APR divided by 365. For a 20% APR, that's about 0.055% daily.

**Average Daily Balance**: Your balance is tracked each day. Interest accrues on this average.

**Monthly Finance Charge**: Daily interest accumulated over the billing cycle appears on your statement.

For a $5,000 balance at 20% APR:
- Monthly interest: $5,000 × (20%/12) = $83.33
- After one year of minimums: You might still owe $4,500+ depending on payment structure

### The True Cost of Minimum Payments

Minimum payments are designed to keep you in debt. Here's a real example:

**$5,000 balance at 19.99% APR**
- Minimum payment (2%): ~$100/month
- Time to pay off: 30+ years
- Total interest paid: ~$7,500
- Total paid: ~$12,500 (2.5× the original balance)

**Same balance with $200/month payment**
- Time to pay off: ~32 months
- Total interest paid: ~$1,400
- Total paid: ~$6,400

Doubling your payment cuts interest by over 80% and pays off debt 10× faster!

### Payment Strategies That Work

**The Avalanche Method**
Pay minimums on all cards, then put extra money toward the highest-APR card. This mathematically minimizes total interest paid.

**The Snowball Method**
Pay minimums on all cards, then put extra money toward the smallest balance. Quick wins provide motivation, though you'll pay slightly more interest.

**Balance Transfer**
Move debt to a 0% APR promotional card. You'll pay a 3-5% transfer fee but save all interest during the promotional period (typically 12-21 months).

**Debt Consolidation Loan**
A personal loan at a lower fixed rate can simplify multiple card payments and reduce total interest. Works best with good credit.

### How Much Should You Pay Monthly?

**The Minimum**: Never a good strategy. You'll stay in debt for decades.

**2× Minimum**: Cuts payoff time dramatically. A good starting point.

**3× Minimum or More**: Aggressive payoff. You'll be debt-free much faster with minimal interest.

**Target-Based**: Use this calculator to find the exact payment needed to be debt-free by a specific date.

### Understanding Your APR

**Purchase APR**: The rate charged on normal purchases. This is what most people focus on.

**Cash Advance APR**: Usually 5-10% higher than purchase APR. Interest starts immediately (no grace period).

**Penalty APR**: Triggered by late payments. Can exceed 29% and apply to your entire balance.

**Promotional APR**: Temporary 0% rates for new cardholders or balance transfers. Rates jump after the promotional period.

### Tips to Lower Your Interest Rate

**Ask for a rate reduction**: Call customer service and request a lower APR. Success rates are surprisingly high, especially with good payment history.

**Transfer to a 0% card**: Many cards offer 12-21 months at 0% APR on transfers. Pay off the balance before the promotional period ends.

**Improve your credit score**: Higher scores qualify for lower rates. Check for errors on your credit report and reduce utilization.

**Consider a personal loan**: Fixed-rate personal loans often have lower rates than credit cards, especially for good credit.

### Building Your Payoff Plan

1. **List all debts**: Balance, APR, and minimum payment for each card
2. **Choose a strategy**: Avalanche (highest APR first) or snowball (smallest balance first)
3. **Set a target**: Use this calculator to find a realistic monthly payment
4. **Automate payments**: Set up autopay to never miss a due date
5. **Track progress**: Monitor your declining balances for motivation
6. **Avoid new debt**: Stop using cards while paying off debt

### The Psychology of Debt Payoff

Paying off debt is as much psychological as mathematical. Consider:

**Visual progress tracking**: Mark off milestones to stay motivated
**Celebrate wins**: Acknowledge each card you pay off
**Build an emergency fund**: $1,000 prevents new debt from emergencies
**Find your "why"**: Connect debt freedom to your goals (home, retirement, peace of mind)

### When to Seek Professional Help

Consider credit counseling or debt management if:
- Minimum payments exceed 20% of your income
- You're using credit cards for necessities
- You're considering bankruptcy
- Creditors are calling or threatening legal action

Non-profit credit counseling agencies can negotiate lower rates and create manageable payment plans.

### After You're Debt-Free

Once you pay off your cards:
- **Keep one card active**: Use it for small purchases and pay in full
- **Build emergency savings**: 3-6 months of expenses prevents future debt
- **Invest the difference**: Redirect former debt payments to retirement accounts
- **Maintain good habits**: The discipline you built pays dividends forever

### Using This Calculator

Enter your balance and APR, then:
- **Payment mode**: See how long a specific monthly payment takes to eliminate debt
- **Time mode**: Find the monthly payment needed to be debt-free by a target date

Review the full amortization schedule to see exactly where each payment goes. Experiment with different scenarios to find your optimal strategy.

Your debt-free date is calculable and achievable. Let's find it together.
  `;

  return (
    <ToolLayout
      title="Credit Card Payoff Calculator"
      description="Calculate how long to pay off credit card debt and how much interest you'll pay. Find the optimal payment strategy to become debt-free faster."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      faqs={faqs}
      howToSteps={howToSteps}
      content={content}
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Credit Card Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Current Balance ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Annual Interest Rate (APR %)</label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.01"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="19.99"
              />
            </div>
          </div>

          {minimumPayment > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              Estimated minimum payment: {formatCurrency(minimumPayment)}
            </p>
          )}
        </div>

        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("payment")}
            className={`px-4 py-3 rounded-lg font-medium transition-colors text-left flex-1 min-w-[200px] ${
              mode === "payment"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div>Fixed Monthly Payment</div>
            <div className={`text-xs ${mode === "payment" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              Calculate payoff time
            </div>
          </button>
          <button
            onClick={() => setMode("time")}
            className={`px-4 py-3 rounded-lg font-medium transition-colors text-left flex-1 min-w-[200px] ${
              mode === "time"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div>Target Payoff Time</div>
            <div className={`text-xs ${mode === "time" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              Calculate required payment
            </div>
          </button>
        </div>

        {/* Payment/Time Input */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            {mode === "payment" ? "Monthly Payment" : "Target Payoff Time"}
          </h2>

          {mode === "payment" ? (
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Payment ($)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="200"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Must be greater than monthly interest charge to make progress.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Months to Pay Off</label>
              <input
                type="number"
                min="1"
                max="360"
                step="1"
                value={targetMonths}
                onChange={(e) => setTargetMonths(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="24"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the number of months you want to be debt-free in.
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="w-4 h-4" />
                  Monthly Payment
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(result.monthlyPayment)}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  Payoff Time
                </div>
                <div className="text-2xl font-bold">
                  {result.months} months
                </div>
                <div className="text-xs text-muted-foreground">
                  ({(result.months / 12).toFixed(1)} years)
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingDown className="w-4 h-4" />
                  Total Interest
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(result.totalInterest)}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Target className="w-4 h-4" />
                  Debt-Free Date
                </div>
                <div className="text-2xl font-bold">
                  {formatDate(result.payoffDate)}
                </div>
              </div>
            </div>

            {/* Total Cost Breakdown */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Total Cost Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Original Balance:</span>
                  <span className="font-bold">{formatCurrency(parseFloat(balance))}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span>Total Interest:</span>
                  <span className="font-bold">+{formatCurrency(result.totalInterest)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total Payments:</span>
                  <span className="font-bold">{formatCurrency(result.totalPayments)}</span>
                </div>
              </div>

              {/* Visual breakdown */}
              <div className="mt-6">
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-primary"
                    style={{ width: `${(parseFloat(balance) / result.totalPayments) * 100}%` }}
                    title="Principal"
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${(result.totalInterest / result.totalPayments) * 100}%` }}
                    title="Interest"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Principal: {((parseFloat(balance) / result.totalPayments) * 100).toFixed(1)}%</span>
                  <span>Interest: {((result.totalInterest / result.totalPayments) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payment Schedule</h3>
                <button
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="text-sm text-primary hover:underline"
                >
                  {showFullSchedule ? "Show Less" : "Show Full Schedule"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2">Month</th>
                      <th className="text-right py-2 px-2">Payment</th>
                      <th className="text-right py-2 px-2">Principal</th>
                      <th className="text-right py-2 px-2">Interest</th>
                      <th className="text-right py-2 px-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showFullSchedule ? result.schedule : result.schedule.slice(0, 12)).map((item) => (
                      <tr key={item.month} className="border-b border-border/50">
                        <td className="py-2 px-2">{item.month}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(item.payment)}</td>
                        <td className="text-right py-2 px-2 text-green-600">{formatCurrency(item.principal)}</td>
                        <td className="text-right py-2 px-2 text-red-600">{formatCurrency(item.interest)}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(item.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!showFullSchedule && result.schedule.length > 12 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing 12 of {result.schedule.length} months. Click &quot;Show Full Schedule&quot; to see all.
                </p>
              )}
            </div>
          </div>
        ) : (
          parseFloat(balance) > 0 && parseFloat(apr) >= 0 && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
              <p className="text-destructive font-medium">
                {mode === "payment"
                  ? "Payment is too low to pay off the balance. The payment must exceed the monthly interest charge."
                  : "Please enter valid values to calculate the required payment."}
              </p>
              {mode === "payment" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Monthly interest on your balance: {formatCurrency((parseFloat(balance) * parseFloat(apr)) / 100 / 12)}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
