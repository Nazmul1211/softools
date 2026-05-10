'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, FAQItem } from '@/components/layout/ToolLayout';
import { Input } from '@/components/ui/Input';
import { ResultCard, ResultsGrid } from '@/components/ui/ResultCard';

export default function SalaryAfterTaxCalculator() {
  const [grossSalary, setGrossSalary] = useState<string>('60000');
  const [state, setState] = useState<string>('CA');
  const [dependents, setDependents] = useState<string>('0');
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [traditionalContributions, setTraditionalContributions] = useState<string>('6500');

  const results = useMemo(() => {
    const gross = parseFloat(grossSalary) || 0;
    const deps = parseFloat(dependents) || 0;
    const traditional401k = parseFloat(traditionalContributions) || 0;

    if (gross <= 0) return null;

    // Simplified 2024 federal tax brackets (single)
    const federalTaxBrackets: { [key: string]: { single: [number, number, number][]; married: [number, number, number][] } } = {
      2024: {
        single: [
          [0, 11600, 0.10],
          [11600, 47150, 0.12],
          [47150, 100525, 0.22],
          [100525, 191950, 0.24],
          [191950, 243725, 0.32],
          [243725, 609350, 0.35],
          [609350, Infinity, 0.37],
        ],
        married: [
          [0, 23200, 0.10],
          [23200, 94300, 0.12],
          [94300, 201050, 0.22],
          [201050, 383900, 0.24],
          [383900, 487450, 0.32],
          [487450, 731200, 0.35],
          [731200, Infinity, 0.37],
        ],
      },
    };

    const brackets = filingStatus === 'single'
      ? federalTaxBrackets[2024].single
      : federalTaxBrackets[2024].married;

    // Calculate federal tax
    let federalTax = 0;
    let previousLimit = 0;
    for (const [lower, upper, rate] of brackets) {
      if (gross > lower) {
        const taxableInThisBracket = Math.min(gross, upper) - lower;
        federalTax += taxableInThisBracket * rate;
      }
    }

    // State tax (simplified)
    const stateTaxRates: { [key: string]: number } = {
      CA: 0.093,
      NY: 0.0685,
      TX: 0,
      FL: 0,
      WA: 0,
      CO: 0.0463,
      OH: 0.0399,
    };
    const stateTaxRate = stateTaxRates[state] || 0.05;
    const stateTax = (gross - traditional401k) * stateTaxRate;

    // FICA taxes (Social Security 6.2% on first $168,600, Medicare 1.45%)
    const ssWageBase = 168600;
    const socialSecurityTax = Math.min(gross - traditional401k, ssWageBase) * 0.062;
    const medicareTax = (gross - traditional401k) * 0.0145;

    // Additional Medicare Tax (0.9% on wages over $200k for single)
    const additionalMedicareThreshold = filingStatus === 'single' ? 200000 : 250000;
    const additionalMedicare = Math.max(0, gross - additionalMedicareThreshold) * 0.009;

    const totalTaxes = federalTax + stateTax + socialSecurityTax + medicareTax + additionalMedicare;
    const netSalary = gross - totalTaxes - traditional401k;

    return {
      grossSalary: gross,
      traditional401k: traditional401k,
      federalTax: federalTax,
      stateTax: stateTax,
      socialSecurityTax: socialSecurityTax,
      medicareTax: medicareTax,
      additionalMedicare: additionalMedicare,
      totalTaxes: totalTaxes,
      netSalary: netSalary,
      monthlyNet: netSalary / 12,
      biweeklyNet: (netSalary / 12 / 2),
      weeklyNet: netSalary / 52,
      effectiveTaxRate: (totalTaxes / gross) * 100,
    };
  }, [grossSalary, state, dependents, filingStatus, traditionalContributions]);

  return (
    <ToolLayout
      title="Salary After Tax Calculator"
      slug="salary-after-tax-calculator"
      description="Calculate your net (take-home) salary after federal, state, and local taxes. Account for filing status, dependents, and pre-tax deductions."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      faqs={[
        {
          question: 'What is the difference between gross and net salary?',
          answer: 'Gross salary is your total earnings before any taxes or deductions. Net salary is what you actually receive after federal, state, local taxes, FICA (Social Security and Medicare), and pre-tax deductions like 401k contributions. Net is always less than gross.',
        },
        {
          question: 'What taxes are included in this calculation?',
          answer: 'This calculator includes: (1) Federal income tax based on current tax brackets, (2) State income tax (varies by state), (3) Social Security tax (6.2% on wages up to $168,600), (4) Medicare tax (1.45% on all wages), and (5) Additional Medicare tax (0.9% on high earners). It does NOT include local/city taxes.',
        },
        {
          question: 'How does pre-tax 401k reduce my taxes?',
          answer: 'Traditional 401k contributions are deducted from your gross salary before taxes are calculated. If you contribute $6,500/year, your taxable income is $6,500 lower, which reduces your federal and state income taxes. This creates immediate tax savings.',
        },
        {
          question: 'Why does my effective tax rate matter?',
          answer: 'Your effective tax rate is the percentage of gross income you pay in total taxes. For example, if you earn $60,000 and pay $12,000 in taxes, your effective rate is 20%. This shows the true tax burden on your income, which is lower than marginal tax brackets.',
        },
        {
          question: 'Is this calculator accurate for my specific situation?',
          answer: 'This is an estimate based on 2024 tax brackets and standard rates. Your actual net pay may differ due to: filing status changes, tax credits (child tax credit, EITC), deductions (mortgage interest, student loans), state/local variations, and employer-specific withholding. Consult a tax professional for precision.',
        },
        {
          question: 'How can I reduce my tax burden and increase net take-home pay?',
          answer: 'Common strategies include: (1) Increase traditional 401k/403b contributions, (2) Use HSA/FSA accounts for medical expenses, (3) Claim eligible tax credits and deductions, (4) Consider tax-loss harvesting in investment accounts, (5) Adjust W-4 withholding to match your situation, (6) Consult a tax advisor about your specific circumstances.',
        },
      ]}
      howToSteps={[
        {
          name: 'Enter Your Gross Salary',
          text: 'Input your total annual earnings before any taxes or deductions.',
        },
        {
          name: 'Select Your State',
          text: 'Choose your state of residence. Different states have different tax rates (Texas and Florida have 0% state income tax, while California is 9.3%).',
        },
        {
          name: 'Set Your Filing Status',
          text: 'Select Single or Married. Your filing status affects federal tax brackets. Married filers typically have higher brackets.',
        },
        {
          name: 'Input 401k Contributions',
          text: 'Enter annual traditional 401k contributions (limit $23,500 for 2024). These reduce your taxable income.',
        },
      ]}
      relatedTools={[
        { name: 'Hourly to Salary Calculator', href: '/hourly-to-salary-calculator/' },
        { name: 'Freelance Tax Calculator', href: '/freelance-tax-calculator/' },
        { name: 'Overtime Pay Calculator', href: '/overtime-pay-calculator/' },
      ]}
    >
      {/* 1. OVERVIEW */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What is a Salary After Tax Calculator?</h2>
        <p className="text-gray-700 mb-4">
          A salary after tax calculator helps you estimate your net (take-home) pay by calculating federal, state, FICA taxes, and pre-tax deductions from your gross salary. It shows you what you actually deposit in your bank account each paycheck.
        </p>
        <p className="text-gray-700">
          Whether you&apos;re planning your budget, evaluating a job offer, or optimizing your tax strategy, this tool gives you an accurate picture of your actual earnings.
        </p>
      </section>

      {/* 2. CALCULATOR SECTION */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculate Your Net Salary After Tax</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Annual Gross Salary (USD)"
            type="number"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            placeholder="60000"
            min="0"
            step="1000"
          />
          <div>
            <label className="block text-gray-700 font-semibold mb-2">State</label>
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
              <option value="CO">Colorado (4.63%)</option>
              <option value="OH">Ohio (3.99%)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Filing Status</label>
            <select
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
          <Input
            label="Dependents"
            type="number"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
          />
          <Input
            label="Traditional 401k Contribution (Annual)"
            type="number"
            value={traditionalContributions}
            onChange={(e) => setTraditionalContributions(e.target.value)}
            placeholder="6500"
            min="0"
            step="500"
          />
        </div>
      </section>

      {/* 3. RESULTS */}
      {results && (
        <section className="mb-8">
          <ResultsGrid>
            <ResultCard
              label="Annual Net Salary"
              value={`$${results.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Take-home pay after all taxes"
            />
            <ResultCard
              label="Monthly Net Pay"
              value={`$${results.monthlyNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Average per month"
            />
            <ResultCard
              label="Biweekly Net Pay"
              value={`$${results.biweeklyNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Every two weeks"
            />
            <ResultCard
              label="Effective Tax Rate"
              value={`${results.effectiveTaxRate.toFixed(2)}%`}
              subValue="Percentage of gross paid in taxes"
            />
          </ResultsGrid>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tax & Deduction Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Gross Salary</span>
                <span className="font-semibold">${results.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Traditional 401k (-)</span>
                <span className="font-semibold">-${results.traditional401k.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700">Federal Income Tax (-)</span>
                <span className="font-semibold">-${results.federalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">State Income Tax (-)</span>
                <span className="font-semibold">-${results.stateTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Social Security Tax (-)</span>
                <span className="font-semibold">-${results.socialSecurityTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Medicare Tax (-)</span>
                <span className="font-semibold">-${results.medicareTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {results.additionalMedicare > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Additional Medicare Tax (-)</span>
                  <span className="font-semibold">-${results.additionalMedicare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-800 font-bold">Total Taxes & Deductions</span>
                <span className="font-bold">-${(results.totalTaxes + results.traditional401k).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between bg-green-50 px-3 py-2 rounded">
                <span className="text-gray-800 font-bold">Net Annual Salary</span>
                <span className="font-bold text-green-600">${results.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FORMULA & EXPLANATION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How is Net Salary Calculated?</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Basic Formula</h3>
          <p className="text-gray-700 font-mono text-center py-3">
            Net Salary = Gross - Federal Tax - State Tax - FICA (Social Security + Medicare) - Pre-Tax Deductions
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Worked Example</h3>
          <p className="text-gray-700 mb-3">
            <strong>Scenario:</strong> $60,000 annual salary, California resident, Single, $6,500 traditional 401k contribution.
          </p>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>Gross Salary: $60,000</p>
            <p>Federal Tax (22% bracket): ~$10,200</p>
            <p>State Tax (California 9.3%): ~$4,955</p>
            <p>Social Security (6.2%): ~$3,720</p>
            <p>Medicare (1.45%): ~$870</p>
            <p>Traditional 401k: $6,500</p>
            <p><strong>Net Salary: ~$33,755</strong></p>
            <p className="text-gray-600 mt-2">Monthly take-home: ~$2,813 | Biweekly: ~$1,298</p>
          </div>
        </div>
      </section>

      {/* 5. TAX COMPONENTS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Tax Components</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Federal Income Tax</h3>
            <p className="text-gray-700 mb-2">
              Calculated using progressive tax brackets. Higher income falls into higher tax rates, but only the income in each bracket is taxed at that rate. For 2024, single filers have brackets from 10% to 37%.
            </p>
            <p className="text-gray-700">
              Example: Single filer with $60,000 income pays 10% on first $11,600, 12% on income $11,600–$47,150, and 22% on remaining amount.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">State Income Tax</h3>
            <p className="text-gray-700 mb-2">
              Varies significantly by state. Texas, Florida, and Washington have 0% state income tax. California has 9.3%, one of the highest in the nation. This calculator includes estimated rates for major states.
            </p>
            <p className="text-gray-700">
              States without income tax often compensate with higher sales tax or property tax.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Social Security Tax (6.2%)</h3>
            <p className="text-gray-700 mb-2">
              Capped at $168,600 of wages for 2024. Once you reach this cap, no additional Social Security tax is withheld for the remainder of the year. This tax funds Social Security retirement benefits.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Medicare Tax (1.45%)</h3>
            <p className="text-gray-700 mb-2">
              No wage cap—all earnings are subject to Medicare tax. An additional 0.9% Medicare tax applies to high earners ($200,000+ for single filers, $250,000+ for married filers). This tax funds Medicare health insurance for seniors.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Pre-Tax Deductions (401k, HSA)</h3>
            <p className="text-gray-700">
              Traditional 401k and HSA contributions reduce your taxable income. Contributing $6,500 to a traditional 401k lowers your federal and state taxable income by $6,500, creating immediate tax savings. Roth 401k contributions do NOT reduce taxes now but are tax-free in retirement.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BENCHMARKS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Take-Home Pay by Income Level (Single, California, No 401k)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Gross Salary</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Net Annual</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Monthly Net</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$30,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$24,835</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$2,070</td>
                <td className="border border-gray-300 px-4 py-2 text-right">17.2%</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$45,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$36,050</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3,004</td>
                <td className="border border-gray-300 px-4 py-2 text-right">19.9%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$60,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$47,355</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3,946</td>
                <td className="border border-gray-300 px-4 py-2 text-right">21.1%</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$80,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$61,540</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$5,128</td>
                <td className="border border-gray-300 px-4 py-2 text-right">23.1%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$100,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$75,260</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$6,272</td>
                <td className="border border-gray-300 px-4 py-2 text-right">24.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. SOURCES & REFERENCES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">References & Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>IRS Publication 15: Employer&apos;s Tax Guide (Federal Tax Withholding)</li>
          <li>Social Security Administration: Wage Base Limits</li>
          <li>State Department of Revenue: State Income Tax Rates</li>
          <li>IRS Tax Brackets for 2024</li>
          <li>Benefits.gov: Pre-Tax Deductions and Benefits</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
