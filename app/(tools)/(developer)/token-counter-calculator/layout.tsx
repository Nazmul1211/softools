import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Token Counter Calculator | Count Tokens for OpenAI, Claude, Gemini',
  description: 'Free token counter for GPT-4, GPT-3.5, Claude, Gemini. Count tokens before sending to AI APIs. Estimate costs instantly.',
  keywords: [
    'token counter',
    'openai token counter',
    'gpt token counter',
    'claude token counter',
    'gemini token counter',
    'token calculator',
    'free token counter',
    'ai token counter',
  ],
  openGraph: {
    title: 'Token Counter Calculator | Count Tokens for AI Models',
    description: 'Free online token counter for GPT, Claude, Gemini. No signup required.',
    type: 'website',
    url: 'https://softzar.com/token-counter-calculator/',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
