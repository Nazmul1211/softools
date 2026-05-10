import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Self-Employment Tax Calculator | Calculate SE Tax for Freelancers',
  description: 'Calculate self-employment tax (Social Security and Medicare). Estimate quarterly tax payments for 1099 contractors and business owners.',
  keywords: [
    'self-employment tax calculator',
    'se tax calculator',
    'quarterly estimated tax',
    '1099 tax calculator',
    'contractor tax calculator',
    'social security tax self-employed',
    'medicare tax freelance',
    'schedule se calculator',
  ],
  openGraph: {
    title: 'Self-Employment Tax Calculator | Calculate SE Tax',
    description: 'Calculate self-employment taxes and quarterly estimated payments for freelancers and contractors.',
    type: 'website',
    url: 'https://softzar.com/self-employment-tax-calculator/',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
