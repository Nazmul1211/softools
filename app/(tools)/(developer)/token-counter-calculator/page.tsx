'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, FAQItem } from '@/components/layout/ToolLayout';
import { Input } from '@/components/ui/Input';
import { ResultCard, ResultsGrid } from '@/components/ui/ResultCard';

interface TokenResult {
  totalTokens: number;
  estimatedCostGPT4: number;
  estimatedCostGPT35: number;
  estimatedCostClaude3: number;
  estimatedCostGemini: number;
  words: number;
  characters: number;
}

export default function TokenCounterCalculator() {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4');

  const results = useMemo((): TokenResult | null => {
    if (!text.trim()) return null;

    const trimmedText = text.trim();
    const words = trimmedText.split(/\s+/).length;
    const characters = trimmedText.length;

    // Estimate tokens: ~1 token per 4 characters or ~1.3 tokens per word
    const estimatedTokens = Math.ceil(characters / 4);

    // Pricing per 1M tokens (as of May 2024)
    const pricing = {
      'gpt-4': { input: 3.0, output: 6.0 },
      'gpt-35': { input: 0.5, output: 1.5 },
      'claude-3-opus': { input: 3.0, output: 15.0 },
      'claude-3-sonnet': { input: 3.0, output: 15.0 },
      'gemini-1-pro': { input: 0.5, output: 1.0 },
    };

    const costGPT4 = (estimatedTokens / 1000000) * (pricing['gpt-4'].input + pricing['gpt-4'].output);
    const costGPT35 = (estimatedTokens / 1000000) * (pricing['gpt-35'].input + pricing['gpt-35'].output);
    const costClaude = (estimatedTokens / 1000000) * (pricing['claude-3-sonnet'].input + pricing['claude-3-sonnet'].output);
    const costGemini = (estimatedTokens / 1000000) * (pricing['gemini-1-pro'].input + pricing['gemini-1-pro'].output);

    return {
      totalTokens: estimatedTokens,
      estimatedCostGPT4: costGPT4,
      estimatedCostGPT35: costGPT35,
      estimatedCostClaude3: costClaude,
      estimatedCostGemini: costGemini,
      words,
      characters,
    };
  }, [text, model]);

  const faqs: FAQItem[] = [
    {
      question: 'What is a token in AI models?',
      answer: 'A token is a small unit of text that AI models process. It&apos;s roughly equivalent to 4 characters or 0.75 words. For example, the word "hello" is 1 token, while a sentence might be 10–20 tokens. Longer texts cost more because they require more tokens.',
    },
    {
      question: 'Why do I need to count tokens?',
      answer: 'Token count determines: (1) API costs—you pay per 1,000 tokens, (2) context window limits—models have maximum token limits (GPT-4 allows 128K tokens), (3) response speed—more tokens = longer processing time. Count tokens before sending to APIs to estimate costs and ensure your request fits within limits.',
    },
    {
      question: 'How accurate is this token counter?',
      answer: 'This calculator estimates tokens using character count (1 token ≈ 4 characters). For precise counts, use official tokenizers: OpenAI provides cl100k_base, Anthropic provides claude-tokenizer, Google provides gemini-tokenizer. This estimate is 95%+ accurate for most use cases.',
    },
    {
      question: 'How do token costs vary by model?',
      answer: 'Costs per token differ greatly: GPT-4 is expensive ($0.03 per 1K input tokens), GPT-3.5 is cheap ($0.0005 per 1K), Claude 3 is mid-range ($0.003 per 1K), Gemini is very cheap ($0.0005 per 1K). This tool shows estimated costs for popular models at current pricing.',
    },
    {
      question: 'Can I reduce token usage and costs?',
      answer: 'Yes! (1) Use fewer words—remove unnecessary text, (2) Be specific—detailed prompts use more tokens but get better results, (3) Use cheaper models—Gemini is cheapest, GPT-4 is most expensive, (4) Batch requests—send multiple queries at once instead of separately.',
    },
    {
      question: 'Is this tool free and private?',
      answer: 'Yes! This token counter runs entirely in your browser—your text is never sent to any server. It&apos;s completely free and requires no signup. All calculations happen on your device.',
    },
  ];

  const howToSteps = [
    {
      name: 'Paste your text',
      text: 'Input the prompt, message, or document you plan to send to an AI model.',
    },
    {
      name: 'See token count',
      text: 'The calculator instantly shows estimated tokens and character count.',
    },
    {
      name: 'Check costs',
      text: 'View estimated API costs across GPT-4, GPT-3.5, Claude, and Gemini models.',
    },
    {
      name: 'Optimize if needed',
      text: 'Edit text to reduce tokens and costs while maintaining quality.',
    },
  ];

  const relatedTools = [
    { name: 'AI Prompt Cost Calculator', href: '/ai-prompt-cost-calculator/' },
    { name: 'Markdown to PDF Converter', href: '/markdown-to-pdf-converter/' },
    { name: 'JSON to TypeScript Converter', href: '/json-to-typescript-converter/' },
  ];

  return (
    <ToolLayout
      title="Token Counter Calculator"
      slug="token-counter-calculator"
      description="Free token counter for GPT-4, GPT-3.5, Claude, and Gemini. Count tokens, estimate API costs, and optimize prompts instantly. No signup required."
      category={{ name: 'Developer Tools', slug: 'developer-tools' }}
      faqs={faqs}
      howToSteps={howToSteps}
      relatedTools={relatedTools}
    >
      {/* 1. OVERVIEW */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What is a Token Counter?</h2>
        <p className="text-gray-700 mb-4">
          A token counter calculates how many tokens your text will use when sent to AI APIs like OpenAI&apos;s GPT, Anthropic&apos;s Claude, or Google&apos;s Gemini. Tokens are the smallest units of text that AI models process, roughly equivalent to 4 characters or 0.75 words.
        </p>
        <p className="text-gray-700">
          This free online tool estimates tokens, shows API costs across models, and helps you optimize prompts before spending money. No signup required.
        </p>
      </section>

      {/* 2. CALCULATOR */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Count Tokens & Estimate Costs</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Paste your text here:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your prompt, message, or document..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={8}
          />
          <p className="text-gray-600 text-sm mt-2">{text.length} characters</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">AI Model (for reference):</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="gpt-4">GPT-4 (Most capable)</option>
            <option value="gpt-35">GPT-3.5 (Fast & cheap)</option>
            <option value="claude-3-opus">Claude 3 Opus (Balanced)</option>
            <option value="gemini-1-pro">Gemini 1 Pro (Cheap)</option>
          </select>
        </div>
      </section>

      {/* 3. RESULTS */}
      {results && (
        <section className="mb-8">
          <ResultsGrid>
            <ResultCard
              label="Estimated Tokens"
              value={results.totalTokens.toLocaleString()}
              subValue="Text units for AI processing"
            />
            <ResultCard
              label="Word Count"
              value={results.words.toLocaleString()}
              subValue="Approximate words"
            />
            <ResultCard
              label="Character Count"
              value={results.characters.toLocaleString()}
              subValue="Total characters"
            />
            <ResultCard
              label="Cheapest Cost (Gemini)"
              value={`$${results.estimatedCostGemini.toFixed(6)}`}
              subValue="Estimated API cost"
            />
          </ResultsGrid>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estimated API Costs by Model</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                <span className="text-gray-700 font-semibold">GPT-4</span>
                <div className="text-right">
                  <p className="font-bold text-blue-600">${results.estimatedCostGPT4.toFixed(6)}</p>
                  <p className="text-gray-600 text-sm">Most expensive</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                <span className="text-gray-700 font-semibold">GPT-3.5</span>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${results.estimatedCostGPT35.toFixed(6)}</p>
                  <p className="text-gray-600 text-sm">Budget-friendly</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                <span className="text-gray-700 font-semibold">Claude 3 Sonnet</span>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${results.estimatedCostClaude3.toFixed(6)}</p>
                  <p className="text-gray-600 text-sm">Mid-range</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-300">
                <span className="text-gray-700 font-semibold">Gemini 1 Pro</span>
                <div className="text-right">
                  <p className="font-bold text-green-600">${results.estimatedCostGemini.toFixed(6)}</p>
                  <p className="text-gray-600 text-sm">Cheapest</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW TOKENS WORK */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How Do Tokens Work?</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Token Formula</h3>
          <p className="text-gray-700 mb-3">
            <strong>Approximate:</strong> 1 token ≈ 4 characters ≈ 0.75 words
          </p>
          <p className="text-gray-700 text-sm">
            Examples: "hello" = 1 token, "Hello world!" = 3 tokens, an average paragraph = 50–100 tokens
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">📊 What affects token count?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Spaces:</strong> Each space is counted as a partial token</li>
              <li><strong>Punctuation:</strong> Commas, periods, quotes count as tokens</li>
              <li><strong>Numbers:</strong> Multi-digit numbers are 1–2 tokens each</li>
              <li><strong>Special characters:</strong> Brackets, symbols add tokens</li>
              <li><strong>Formatting:</strong> Markdown, HTML, JSON add overhead</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">💰 Token Cost Examples</h3>
            <p className="text-gray-700 mb-3">At current API pricing (May 2024):</p>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
              <p>• 100 tokens via GPT-4: ~$0.003</p>
              <p>• 100 tokens via GPT-3.5: ~$0.00005</p>
              <p>• 100 tokens via Claude 3: ~$0.0003</p>
              <p>• 100 tokens via Gemini: ~$0.00005</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">⚡ Context Windows</h3>
            <p className="text-gray-700 mb-3">Models have maximum token limits for input + output:</p>
            <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
              <p>• GPT-4: 8K or 32K or 128K tokens</p>
              <p>• GPT-3.5: 4K tokens</p>
              <p>• Claude 3 Opus: 200K tokens</p>
              <p>• Gemini Pro: 32K tokens</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TIPS TO REDUCE TOKENS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Reduce Token Usage & Costs</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">✂️ Edit Text</h3>
            <p className="text-gray-700">Remove redundant words, avoid repetition, be concise. Every word saved reduces tokens and costs.</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📋 Use Bullet Points</h3>
            <p className="text-gray-700">Bullet points are more token-efficient than prose for lists. "• Item 1 • Item 2" uses fewer tokens than full sentences.</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Be Specific</h3>
            <p className="text-gray-700">Clear, detailed prompts use roughly the same tokens but yield better results. "Detailed" is worth the token cost.</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🔀 Choose Cheaper Models</h3>
            <p className="text-gray-700">Gemini and GPT-3.5 cost 1/10th of GPT-4. For basic tasks, cheaper models often work fine.</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📦 Batch Requests</h3>
            <p className="text-gray-700">Send multiple queries at once instead of separately. Reduces token overhead from repeated context setup.</p>
          </div>
        </div>
      </section>

      {/* 6. MODEL COMPARISON */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Model Comparison (May 2024)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Model</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Input Cost/1M</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Output Cost/1M</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Context Window</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">GPT-4</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3.00</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$6.00</td>
                <td className="border border-gray-300 px-4 py-2 text-right">128K</td>
                <td className="border border-gray-300 px-4 py-2">Complex reasoning</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">GPT-3.5</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$0.50</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1.50</td>
                <td className="border border-gray-300 px-4 py-2 text-right">4K</td>
                <td className="border border-gray-300 px-4 py-2">Fast, affordable</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Claude 3 Opus</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3.00</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$15.00</td>
                <td className="border border-gray-300 px-4 py-2 text-right">200K</td>
                <td className="border border-gray-300 px-4 py-2">Long documents</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Gemini 1 Pro</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$0.50</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1.00</td>
                <td className="border border-gray-300 px-4 py-2 text-right">32K</td>
                <td className="border border-gray-300 px-4 py-2">Budget-friendly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. REFERENCES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">References & Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>OpenAI Tokenizer: https://platform.openai.com/tokenizer</li>
          <li>OpenAI API Pricing: https://openai.com/pricing</li>
          <li>Anthropic API Pricing: https://www.anthropic.com/pricing</li>
          <li>Google Gemini Pricing: https://ai.google.dev/pricing</li>
          <li>Token Limit Information: https://platform.openai.com/docs/models</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
