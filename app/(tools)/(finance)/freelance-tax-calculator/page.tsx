'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, FAQItem } from '@/components/layout/ToolLayout';
import { Input } from '@/components/ui/Input';
import { ResultCard, ResultsGrid } from '@/components/ui/ResultCard';

export default function FreelanceTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState<string>('50000');
  const [businessExpenses, setBusinessExpenses] = useState<string>('10000');
  const [state, setState] = useState<string>('CA');
  const [w2Income, setW2Income] = useState<string>('0');

  const results = useMemo(() => {
    const gross = parseFloat(grossIncome) || 0;
    const expenses = parseFloat(businessExpenses) || 0;
    const w2 = parseFloat(w2Income) || 0;
    const netBusiness = gross - expenses;

    if (gross <= 0) return null;

    // Self-employment tax: 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of net
    const seIncome = netBusiness * 0.9235;
    const seTax = seIncome * 0.153;
    const seDeduction = seTax / 2;

    // Federal income tax (simplified)
    const taxableIncome = netBusiness - seDeduction;
    let federalTax = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 11600) federalTax = taxableIncome * 0.10;
      else if (taxableIncome <= 47150) federalTax = 1160 + (taxableIncome - 11600) * 0.12;
      else if (taxableIncome <= 100525) federalTax = 5426 + (taxableIncome - 47150) * 0.22;
      else federalTax = 17168.50 + (taxableIncome - 100525) * 0.24;
    }

    // State tax
    const stateTaxRates: { [key: string]: number } = {
      CA: 0.093,
      NY: 0.0685,
      TX: 0,
      FL: 0,
      WA: 0,
    };
    const stateTaxRate = stateTaxRates[state] || 0.05;
    const stateTax = netBusiness * stateTaxRate;

    const totalTaxes = federalTax + seTax + stateTax;
    const netIncome = netBusiness - totalTaxes;
    const quarterlyPayment = totalTaxes / 4;

    return {
      grossIncome: gross,
      businessExpenses: expenses,
      netBusiness: netBusiness,
      federalTax: federalTax,
      seTax: seTax,
      stateTax: stateTax,
      totalTaxes: totalTaxes,
      netIncome: netIncome,
      monthlyNet: netIncome / 12,
      quarterlyPayment: quarterlyPayment,
      effectiveTaxRate: (totalTaxes / gross) * 100,
    };
  }, [grossIncome, businessExpenses, state, w2Income]);

  return (
    <ToolLayout
      title="Freelance Tax Calculator"
      slug="freelance-tax-calculator"
      description="Calculate self-employment taxes, quarterly estimated tax payments, and net income for freelance and contractor work."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      faqs={[
        {
          question: 'What is self-employment tax?',
          answer: 'Self-employment tax covers Social Security and Medicare for freelancers and self-employed individuals. It&apos;s 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of your net business income. Employees pay half through payroll withholding; self-employed people pay both halves.',
        },
        {
          question: 'Do I need to file quarterly estimated taxes?',
          answer: 'Yes, if you expect to owe $1,000 or more in taxes. You must pay estimated taxes quarterly (by April 15, June 15, September 15, and January 15) to avoid penalties and interest. Use this calculator to estimate your quarterly payment amount (divide annual tax by 4).',
        },
        {
          question: 'What business expenses can I deduct?',
          answer: 'Common deductible expenses include: home office rent/utilities, equipment and software, professional services, marketing and advertising, vehicle mileage, supplies, and insurance. Keep detailed receipts. Some expenses are fully deductible; others are depreciated over time. Consult a tax professional.',
        },
        {
          question: 'What&apos;s the difference between freelance and W-2 income?',
          answer: 'Freelance/1099 income: You pay self-employment tax (15.3%) on net income plus income taxes. W-2 income: Employer withholds taxes, and you split FICA taxes. Freelancers have more deductions but higher tax burden. Many people have both (side business + day job).',
        },
        {
          question: 'Can I deduct the self-employment tax I pay?',
          answer: 'Yes! You can deduct half of your self-employment tax from your income, which reduces your federal income tax. This calculator includes this deduction in the federal tax calculation. This is why your effective tax rate on freelance income is slightly lower than the 15.3% SE tax alone.',
        },
        {
          question: 'What records should I keep?',
          answer: 'Keep all receipts, invoices, bank statements, and mileage logs for at least 3 years. Use accounting software like QuickBooks, FreshBooks, or Wave to track income and expenses. Maintain a business mileage log if claiming vehicle deductions. Organize by category for easier tax filing.',
        },
      ]}
      howToSteps={[
        {
          name: 'Enter Your Gross Freelance Income',
          text: 'Total revenue from all freelance, contract, and self-employed work before any deductions.',
        },
        {
          name: 'Deduct Business Expenses',
          text: 'Subtract qualified business expenses: home office, equipment, supplies, professional services, marketing, vehicle mileage, and insurance.',
        },
        {
          name: 'Select Your State',
          text: 'Choose your state of residence for state income tax calculation. Some states have no income tax.',
        },
        {
          name: 'Use Quarterly Payment Amount',
          text: 'Divide the quarterly payment by 4 to set your estimated tax payment schedule. Pay by quarterly deadlines to avoid penalties.',
        },
      ]}
      relatedTools={[
        { name: 'Salary After Tax Calculator', href: '/salary-after-tax-calculator/' },
        { name: 'Self-Employment Tax Calculator', href: '/self-employment-tax-calculator/' },
        { name: 'Hourly to Salary Calculator', href: '/hourly-to-salary-calculator/' },
      ]}
    >
      {/* 1. OVERVIEW */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What is a Freelance Tax Calculator?</h2>
        <p className="text-gray-700 mb-4">
          A freelance tax calculator helps you estimate the taxes you owe on self-employment income, including self-employment tax (Social Security and Medicare), federal income tax, and state income tax. It calculates your quarterly estimated tax payments and net income.
        </p>
        <p className="text-gray-700">
          Whether you&apos;re a full-time freelancer, contractor, or running a side business, this tool ensures you understand your tax obligations and can plan your finances accordingly.
        </p>
      </section>

      {/* 2. CALCULATOR */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculate Your Freelance Taxes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Annual Gross Income (USD)"
            type="number"
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
            placeholder="50000"
            min="0"
            step="1000"
          />
          <Input
            label="Business Expenses (USD)"
            type="number"
            value={businessExpenses}
            onChange={(e) => setBusinessExpenses(e.target.value)}
            placeholder="10000"
            min="0"
            step="500"
          />
          <div>
            <label className="block text-gray-700 font-semibold mb-2">State of Residence</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CA">California (9.3%)</option>
              <option value="NY">New York (6.85%)</option>
              <option value="TX">Texas (0%)</option>
              <option value="FL">Florida (0%)</option>
              <option value="WA">Washington (0%)</option>
            </select>
          </div>
          <Input
            label="W-2 Income (Optional)"
            type="number"
            value={w2Income}
            onChange={(e) => setW2Income(e.target.value)}
            placeholder="0"
            min="0"
            step="1000"
          />
        </div>
      </section>

      {/* 3. RESULTS */}
      {results && (
        <section className="mb-8">
          <ResultsGrid>
            <ResultCard
              label="Annual Net Income"
              value={`$${results.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="After all taxes and expenses"
            />
            <ResultCard
              label="Total Taxes Due"
              value={`$${results.totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Federal, state, and self-employment"
            />
            <ResultCard
              label="Quarterly Payment"
              value={`$${results.quarterlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Estimated quarterly tax payment"
            />
            <ResultCard
              label="Effective Tax Rate"
              value={`${results.effectiveTaxRate.toFixed(2)}%`}
              subValue="Percentage of gross income"
            />
          </ResultsGrid>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tax Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Gross Income</span>
                <span className="font-semibold">${results.grossIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Business Expenses (-)</span>
                <span className="font-semibold">-${results.businessExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700">Self-Employment Tax</span>
                <span className="font-semibold">${results.seTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Federal Income Tax</span>
                <span className="font-semibold">${results.federalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">State Income Tax</span>
                <span className="font-semibold">${results.stateTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between bg-green-50 px-3 py-2 rounded">
                <span className="text-gray-800 font-bold">Net Annual Income</span>
                <span className="font-bold text-green-600">${results.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FORMULA */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Self-Employment Tax Formula</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Step-by-Step Calculation</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>1. Net Earnings = Gross Income - Business Expenses</p>
            <p>2. SE Income = Net Earnings × 92.35%</p>
            <p>3. SE Tax = SE Income × 15.3% (12.4% Social Security + 2.9% Medicare)</p>
            <p>4. SE Deduction = SE Tax ÷ 2 (deductible from income)</p>
            <p>5. Taxable Income = Net Earnings - SE Deduction</p>
            <p>6. Total Tax = Federal Tax + SE Tax + State Tax</p>
            <p>7. Net Income = Net Earnings - Total Tax</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Example Calculation</h3>
          <p className="text-gray-700 mb-3">
            <strong>Freelancer earning $50,000 with $10,000 in expenses (California)</strong>
          </p>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>Gross Income: $50,000</p>
            <p>Business Expenses: $10,000</p>
            <p>Net Earnings: $40,000</p>
            <p>SE Income: $40,000 × 0.9235 = $36,940</p>
            <p>SE Tax: $36,940 × 0.153 = $5,652</p>
            <p><strong>Quarterly Payment: $5,652 ÷ 4 = $1,413</strong></p>
          </div>
        </div>
      </section>

      {/* 5. KEY FACTORS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Maximizing Deductions & Reducing Tax Burden</h2>
        
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📝 Deductible Business Expenses</h3>
            <p className="text-gray-700 text-sm">
              Home office (rent/utilities), equipment and software, professional development, marketing and advertising, vehicle mileage (67¢/mile for 2024), business insurance, subscriptions, and contracted services.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">💰 Retirement Contributions</h3>
            <p className="text-gray-700 text-sm">
              SEP-IRA (up to 25% of net income), Solo 401k (up to $69,000 in 2024), or Solo Roth IRA. These reduce your taxable income and grow tax-deferred. Maximize contributions to lower taxes.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🏥 Health Insurance Deduction</h3>
            <p className="text-gray-700 text-sm">
              Self-employed individuals can deduct 100% of health insurance premiums paid for themselves and their family. This is an "above-the-line" deduction, reducing both income tax and self-employment tax.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BENCHMARKS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Effective Tax Rates by Income (California, No Expenses)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Gross Income</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total Tax</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Net Income</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Quarterly Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$25,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$5,100</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$19,900</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,275</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$50,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$11,850</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$38,150</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$2,963</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$75,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$18,950</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$56,050</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$4,738</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$100,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$26,450</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$73,550</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$6,613</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. RESOURCES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">References & Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>IRS Schedule SE: Self-Employment Tax</li>
          <li>IRS Form 1040-ES: Estimated Tax for Self-Employed Individuals</li>
          <li>IRS Publication 334: Tax Guide for Small Business</li>
          <li>SBA: Self-Employment Tax Information</li>
          <li>SCORE: Free Mentoring for Small Business Owners</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
