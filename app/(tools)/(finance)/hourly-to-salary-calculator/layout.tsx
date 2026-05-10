import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hourly to Salary Calculator | Convert Hourly Rate to Annual Salary',
  description: 'Convert hourly pay to annual salary with our free calculator. Adjust for hours worked, paid time off, and holidays. Includes bonus, commission, and benefits estimates.',
  keywords: [
    'hourly to salary calculator',
    'hourly wage to annual salary',
    'hourly rate calculator',
    'convert hourly to salary',
    'hourly to annual salary',
    'wage to salary converter',
    'hourly pay calculator',
    'annual salary from hourly wage',
  ],
  openGraph: {
    title: 'Hourly to Salary Calculator | Instantly Convert Hourly Rate to Annual Salary',
    description: 'Quickly convert your hourly rate to an annual salary. Factor in PTO, overtime, bonuses, and benefits.',
    type: 'website',
    url: 'https://softzar.com/hourly-to-salary-calculator/',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
