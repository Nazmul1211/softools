'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, FAQItem } from '@/components/layout/ToolLayout';
import { Input } from '@/components/ui/Input';
import { ResultCard, ResultsGrid } from '@/components/ui/ResultCard';

export default function SelfEmploymentTaxCalculator() {
  const [netIncome, setNetIncome] = useState<string>('50000');
  const [w2Income, setW2Income] = useState<string>('0');
  const [businessType, setBusinessType] = useState<string>('sole-proprietor');

  const results = useMemo(() => {
    const net = parseFloat(netIncome) || 0;
    const w2 = parseFloat(w2Income) || 0;

    if (net <= 0) return null;

    // Self-employment income calculation
    const seIncome = net * 0.9235; // 92.35% factor
    
    // Social Security tax (12.4% up to wage base $168,600 in 2024)
    const ssWageBase = 168600;
    const ssTax = Math.min(seIncome, ssWageBase) * 0.124;
    
    // Medicare tax (2.9% on all SE income)
    const medicareTax = seIncome * 0.029;
    
    // Additional Medicare tax (0.9% on SE income over $200k)
    const additionalMedicareThreshold = 200000;
    const additionalMedicare = Math.max(0, seIncome - additionalMedicareThreshold) * 0.009;
    
    // Total SE tax
    const totalSETax = ssTax + medicareTax + additionalMedicare;
    
    // SE tax deduction (50% of SE tax)
    const seDeduction = totalSETax / 2;
    
    // For combined income situation
    const totalIncomeBeforeTax = net + w2;
    const effectiveSERate = (totalSETax / totalIncomeBeforeTax) * 100;
    
    // Quarterly payment
    const quarterlyPayment = totalSETax / 4;

    return {
      netIncome: net,
      seIncome: seIncome,
      ssTax: ssTax,
      medicareTax: medicareTax,
      additionalMedicare: additionalMedicare,
      totalSETax: totalSETax,
      seDeduction: seDeduction,
      quarterlyPayment: quarterlyPayment,
      monthlyPayment: totalSETax / 12,
      effectiveRate: (totalSETax / net) * 100,
      effectiveSERate: effectiveSERate,
    };
  }, [netIncome, w2Income]);

  return (
    <ToolLayout
      title="Self-Employment Tax Calculator"
      slug="self-employment-tax-calculator"
      description="Calculate self-employment taxes (Social Security and Medicare) and quarterly estimated tax payments for freelancers, contractors, and business owners."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      faqs={[
        {
          question: 'What is self-employment (SE) tax?',
          answer: 'Self-employment tax is the Social Security and Medicare tax that self-employed people pay. It covers both the employee and employer portions (15.3% total: 12.4% Social Security + 2.9% Medicare). Employees have these split between them and their employer; self-employed people pay both halves.',
        },
        {
          question: 'Why is the SE income multiplied by 92.35%?',
          answer: 'The 92.35% factor represents the deduction of the employer-equivalent portion of SE tax. Self-employed people can deduct this amount from their income before calculating SE tax, which reduces their tax burden slightly compared to if SE tax were applied to 100% of income.',
        },
        {
          question: 'What is the Social Security wage base limit?',
          answer: 'For 2024, the Social Security wage base is $168,600. Only income up to this limit is subject to the 12.4% Social Security tax. Any income above $168,600 is NOT subject to Social Security tax (but IS subject to Medicare tax and income tax). This limit increases annually.',
        },
        {
          question: 'Is there a Medicare tax cap?',
          answer: 'No. Medicare tax (2.9%) applies to ALL self-employment income, with no wage base limit. Additionally, an extra 0.9% Medicare tax applies to SE income over $200,000. This is called the Additional Medicare Tax and has no cap.',
        },
        {
          question: 'When must I pay quarterly estimated taxes?',
          answer: 'You must pay estimated taxes quarterly if you expect to owe $1,000 or more. Quarterly due dates are April 15, June 15, September 15, and January 15. If you miss a deadline, you may face penalties and interest. Divide your annual SE tax by 4 to estimate each quarterly payment.',
        },
        {
          question: 'Can I deduct SE tax payments?',
          answer: 'Yes! You can deduct 50% of your SE tax as a business expense, which reduces your federal taxable income. This deduction is taken "above-the-line," meaning you get the benefit even if you don&apos;t itemize. This is included in this calculator as the "SE Deduction."',
        },
      ]}
      howToSteps={[
        {
          name: 'Calculate Your Net Self-Employment Income',
          text: 'Start with gross business revenue and subtract business expenses (rent, supplies, equipment, etc.). The result is your net self-employment income.',
        },
        {
          name: 'Enter Net Income in Calculator',
          text: 'Input your net self-employment income (after deductions). Do NOT include W-2 income from a day job.',
        },
        {
          name: 'Review Your SE Tax',
          text: 'The calculator shows your total SE tax, broken down by Social Security and Medicare components.',
        },
        {
          name: 'Plan Quarterly Payments',
          text: 'Use the quarterly payment amount to set aside funds or make estimated tax payments to the IRS by the due dates.',
        },
      ]}
      relatedTools={[
        { name: 'Freelance Tax Calculator', href: '/freelance-tax-calculator/' },
        { name: 'Salary After Tax Calculator', href: '/salary-after-tax-calculator/' },
        { name: 'Hourly to Salary Calculator', href: '/hourly-to-salary-calculator/' },
      ]}
    >
      {/* 1. OVERVIEW */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What is Self-Employment Tax?</h2>
        <p className="text-gray-700 mb-4">
          Self-employment (SE) tax is the Social Security and Medicare tax that self-employed people, freelancers, and business owners must pay. Unlike employees (where tax is split with the employer), self-employed people pay both the employee and employer portions, totaling 15.3%.
        </p>
        <p className="text-gray-700">
          This calculator helps you estimate your SE tax and quarterly estimated tax payments, which are required if you expect to owe $1,000 or more.
        </p>
      </section>

      {/* 2. CALCULATOR */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculate Self-Employment Tax</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Net Self-Employment Income (USD)"
            type="number"
            value={netIncome}
            onChange={(e) => setNetIncome(e.target.value)}
            placeholder="50000"
            min="0"
            step="1000"
          />
          <Input
            label="W-2 Income from Employment (Optional)"
            type="number"
            value={w2Income}
            onChange={(e) => setW2Income(e.target.value)}
            placeholder="0"
            min="0"
            step="1000"
          />
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Business Type (for reference)</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sole-proprietor">Sole Proprietor / Freelancer</option>
              <option value="s-corp">S-Corp</option>
              <option value="llc">LLC</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. RESULTS */}
      {results && (
        <section className="mb-8">
          <ResultsGrid>
            <ResultCard
              label="Total SE Tax"
              value={`$${results.totalSETax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Annual self-employment tax"
            />
            <ResultCard
              label="Quarterly Payment"
              value={`$${results.quarterlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Due: Apr 15, Jun 15, Sep 15, Jan 15"
            />
            <ResultCard
              label="Monthly Payment"
              value={`$${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="If paying monthly"
            />
            <ResultCard
              label="Effective SE Tax Rate"
              value={`${results.effectiveRate.toFixed(2)}%`}
              subValue="Percentage of net income"
            />
          </ResultsGrid>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">SE Tax Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Net Self-Employment Income</span>
                <span className="font-semibold">${results.netIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">SE Income (92.35% of net)</span>
                <span className="font-semibold">${results.seIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700">Social Security Tax (12.4%)</span>
                <span className="font-semibold">${results.ssTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Medicare Tax (2.9%)</span>
                <span className="font-semibold">${results.medicareTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {results.additionalMedicare > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Additional Medicare Tax (0.9%)</span>
                  <span className="font-semibold">${results.additionalMedicare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between bg-orange-50 px-3 py-2 rounded">
                <span className="text-gray-800 font-bold">Total SE Tax</span>
                <span className="font-bold text-orange-600">${results.totalSETax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">SE Tax Deduction (50% of SE tax)</span>
                <span className="font-semibold text-green-600">-${results.seDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW SE TAX IS CALCULATED */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How Self-Employment Tax is Calculated</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Step-by-Step Formula</h3>
          <div className="space-y-2 text-gray-700 text-sm font-mono">
            <p>1. SE Income = Net Income × 92.35%</p>
            <p>2. SS Tax = SE Income × 12.4% (capped at $168,600 wage base)</p>
            <p>3. Medicare Tax = SE Income × 2.9% (no cap)</p>
            <p>4. Additional Medicare = Max(0, SE Income - $200k) × 0.9%</p>
            <p>5. Total SE Tax = SS Tax + Medicare Tax + Additional Medicare</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Example</h3>
          <p className="text-gray-700 mb-3">
            <strong>Self-employed business owner with $60,000 net income</strong>
          </p>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>Net Income: $60,000</p>
            <p>SE Income: $60,000 × 0.9235 = $55,410</p>
            <p>Social Security Tax: $55,410 × 0.124 = $6,871</p>
            <p>Medicare Tax: $55,410 × 0.029 = $1,607</p>
            <p><strong>Total SE Tax: $8,478</strong></p>
            <p><strong>Quarterly Payment: $8,478 ÷ 4 = $2,119.50</strong></p>
            <p className="text-gray-600 mt-2">SE Deduction: $8,478 ÷ 2 = $4,239 (reduces taxable income)</p>
          </div>
        </div>
      </section>

      {/* 5. SE TAX COMPONENTS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding SE Tax Components</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">📊 Social Security Tax (12.4%)</h3>
            <p className="text-gray-700 mb-2">
              Capped at $168,600 of SE income (for 2024). Once you reach this cap, no additional Social Security tax is owed. This tax funds Social Security retirement, disability, and survivor benefits.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Example:</strong> $60,000 SE income × 12.4% = $7,440. If you had $200,000 SE income, only the first $168,600 is taxed: $168,600 × 12.4% = $20,906 (not the full $24,800).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">🏥 Medicare Tax (2.9%)</h3>
            <p className="text-gray-700 mb-2">
              No wage cap—ALL SE income is subject to the 2.9% Medicare tax. This funds Medicare health insurance for seniors and disabled individuals.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Example:</strong> $60,000 SE income × 2.9% = $1,740. Whether you earn $50,000 or $500,000, the full amount is taxed at 2.9%.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">💰 Additional Medicare Tax (0.9%)</h3>
            <p className="text-gray-700 mb-2">
              Applies to SE income over $200,000. This is part of the Affordable Care Act and goes toward expanding Medicare coverage and reducing the deficit.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Example:</strong> If you have $250,000 SE income: ($250,000 - $200,000) × 0.9% = $450 additional tax.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">📉 The 92.35% Factor</h3>
            <p className="text-gray-700">
              Self-employed people can deduct 50% of their SE tax from their income. This is why SE income is calculated as 92.35% of net income, not 100%. This gives a slight tax break and matches the employee/employer split for W-2 workers.
            </p>
          </div>
        </div>
      </section>

      {/* 6. QUARTERLY ESTIMATED TAX PAYMENTS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quarterly Estimated Tax Payments</h2>
        
        <div className="bg-purple-50 border border-purple-200 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Payment Deadlines</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-800">Q1 (Jan–Mar)</p>
              <p className="text-gray-700">Due: April 15</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Q2 (Apr–Jun)</p>
              <p className="text-gray-700">Due: June 15</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Q3 (Jul–Sep)</p>
              <p className="text-gray-700">Due: September 15</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Q4 (Oct–Dec)</p>
              <p className="text-gray-700">Due: January 15 (next year)</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-3">
          <strong>Do I need to pay quarterly?</strong> You must pay if you expect to owe $1,000 or more in estimated taxes. If you miss a payment, you may face penalties and interest, so setting up a payment schedule is important.
        </p>

        <p className="text-gray-700">
          <strong>How to pay:</strong> Use IRS Direct Pay, Electronic Federal Tax Payment System (EFTPS), credit/debit card, or mail Form 1040-ES with a check. Keep payment records for your tax file.
        </p>
      </section>

      {/* 7. SE TAX BY INCOME LEVEL */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Self-Employment Tax by Income Level</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Net Income</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total SE Tax</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Quarterly Payment</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Effective Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$25,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3,532</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$883</td>
                <td className="border border-gray-300 px-4 py-2 text-right">14.1%</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$40,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$5,651</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,413</td>
                <td className="border border-gray-300 px-4 py-2 text-right">14.1%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$60,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$8,478</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$2,120</td>
                <td className="border border-gray-300 px-4 py-2 text-right">14.1%</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$100,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$14,130</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3,533</td>
                <td className="border border-gray-300 px-4 py-2 text-right">14.1%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$200,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$28,260</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$7,065</td>
                <td className="border border-gray-300 px-4 py-2 text-right">14.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. RESOURCES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">References & Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>IRS Schedule SE: Self-Employment Tax</li>
          <li>IRS Publication 15-B: Employer&apos;s Tax Guide to Fringe Benefits</li>
          <li>IRS Form 1040-ES: Estimated Tax Payments</li>
          <li>Social Security Administration: Self-Employment Tax Information</li>
          <li>SCORE: Free Small Business Mentoring</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
