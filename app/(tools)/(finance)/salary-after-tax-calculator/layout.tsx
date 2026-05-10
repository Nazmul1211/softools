import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salary After Tax Calculator | Calculate Your Net Take-Home Pay',
  description: 'Calculate your net salary after federal, state, and local taxes. Includes FICA, deductions, and tax withholding. Estimate your actual take-home pay.',
  keywords: [
    'salary after tax calculator',
    'net salary calculator',
    'take home pay calculator',
    'income tax calculator',
    'paycheck calculator',
    'after tax salary',
    'net pay calculator',
    'tax withholding calculator',
  ],
  openGraph: {
    title: 'Salary After Tax Calculator | Calculate Your Net Take-Home Pay',
    description: 'Calculate your net salary after all taxes and deductions. Get accurate take-home pay estimates.',
    type: 'website',
    url: 'https://softzar.com/salary-after-tax-calculator/',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
