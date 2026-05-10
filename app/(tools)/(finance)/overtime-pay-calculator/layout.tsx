import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Overtime Pay Calculator | Calculate Your Overtime Earnings',
  description: 'Calculate overtime pay at time-and-a-half or double-time rates. Includes gross pay, taxes, and net overtime earnings.',
  keywords: [
    'overtime pay calculator',
    'overtime earnings',
    'overtime rate calculator',
    'time and a half calculator',
    'double time pay calculator',
    'overtime gross pay',
    'hourly overtime calculator',
    'FLSA overtime rules',
  ],
  openGraph: {
    title: 'Overtime Pay Calculator | Calculate Overtime Earnings',
    description: 'Calculate overtime pay at 1.5x or 2x your hourly rate. Includes taxes and net earnings.',
    type: 'website',
    url: 'https://softzar.com/overtime-pay-calculator/',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
