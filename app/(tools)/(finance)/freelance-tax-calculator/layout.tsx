import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Freelance Tax Calculator | Calculate Self-Employment Tax',
  description: 'Calculate your self-employment and income taxes for freelance, contractor, and side business income. Includes quarterly estimated tax payments.',
  keywords: [
    'freelance tax calculator',
    'self-employment tax calculator',
    'contractor tax calculator',
    '1099 tax calculator',
    'estimated quarterly taxes',
    'freelance income tax',
    'side hustle tax calculator',
    'business tax calculator',
  ],
  openGraph: {
    title: 'Freelance Tax Calculator | Calculate Self-Employment Tax',
    description: 'Calculate taxes for freelance income. Includes self-employment tax, quarterly payments, and deductions.',
    type: 'website',
    url: 'https://softzar.com/freelance-tax-calculator/',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
