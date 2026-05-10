"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Calculator, TrendingUp, Zap, DollarSign } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How are token counts estimated?",
    answer:
      "Token counting varies by model. Generally, 1 token ≈ 4 characters or 0.75 words. GPT models use BPE (Byte Pair Encoding) tokenization. For accurate counts, use OpenAI's tokenizer or provider-specific tools. This calculator provides estimates based on average conversion rates (1 token = 4 chars). For precise billing, always check your provider's token counting method.",
  },
  {
    question: "What&apos;s the difference between input and output tokens?",
    answer:
      "Input tokens are the prompt you send to the model. Output tokens are the response the model generates. Most providers charge differently for each. Input tokens are usually cheaper (e.g., GPT-4: $0.03/1K input vs $0.06/1K output). Always consider both when estimating costs, as long responses will significantly increase your bill.",
  },
  {
    question: "Why do prices vary between providers?",
    answer:
      "Pricing depends on model capability, infrastructure costs, and market positioning. GPT-4 is more expensive than GPT-3.5 because it&apos;s more capable and computationally expensive to run. Claude is priced competitively. Gemini offers budget options. Prices change frequently—check official pricing pages for current rates. Bulk usage often qualifies for discounts.",
  },
  {
    question: "How can I reduce API costs?",
    answer:
      "Use cheaper models (GPT-3.5 instead of GPT-4) when possible. Optimize prompts to minimize input tokens. Cache common system messages. Use streaming to process partial responses. Batch requests to reduce overhead. Implement rate limiting and prompt caching. For production, negotiate volume discounts. Monitor usage with cost tracking tools.",
  },
  {
    question: "What are&apos; token limits for each model?",
    answer:
      "GPT-4: up to 128K tokens total context. GPT-3.5: up to 16K tokens. Claude 3: up to 200K tokens. Gemini Pro: up to 32K tokens. Higher limits allow for longer conversations and larger document processing. Longer context increases cost, but enables more complex tasks without multiple requests.",
  },
  {
    question: "Does this calculator include rate limits and quotas?",
    answer:
      "This calculator only estimates direct token costs. Providers also enforce rate limits (requests/minute) and usage quotas. These don&apos;t add direct costs but may impact your ability to process large batches. Check your provider&apos;s documentation for rate limits and request quotas for your plan.",
  },
];

/* ────────────── Model Pricing Data ────────────── */

interface Model {
  id: string;
  name: string;
  provider: string;
  inputPrice: number; // per 1K tokens
  outputPrice: number; // per 1K tokens
}

const models: Model[] = [
  { id: "gpt-4", name: "GPT-4 Turbo", provider: "OpenAI", inputPrice: 0.03, outputPrice: 0.06 },
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", provider: "OpenAI", inputPrice: 0.0005, outputPrice: 0.0015 },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", inputPrice: 0.015, outputPrice: 0.075 },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", inputPrice: 0.003, outputPrice: 0.015 },
  { id: "gemini-pro", name: "Gemini 1.5 Pro", provider: "Google", inputPrice: 0.0035, outputPrice: 0.0105 },
  { id: "gemini-flash", name: "Gemini 1.5 Flash", provider: "Google", inputPrice: 0.000075, outputPrice: 0.0003 },
];

/* ────────────── Calculation Function ────────────── */

function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: Model,
  requests: number
) {
  const inputCost = (inputTokens / 1000) * model.inputPrice * requests;
  const outputCost = (outputTokens / 1000) * model.outputPrice * requests;
  const totalCost = inputCost + outputCost;
  return { inputCost, outputCost, totalCost };
}

/* ────────────────────── Component ────────────────────── */

export default function AIPromptCostCalculator() {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [requests, setRequests] = useState<number>(1);
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "gpt-4",
    "gpt-3.5",
    "claude-3-opus",
    "gemini-pro",
  ]);

  // Estimate tokens (1 token ≈ 4 characters)
  const inputTokens = Math.ceil(inputText.length / 4);
  const outputTokens = Math.ceil(outputText.length / 4);

  // Calculate costs for all models
  const costs = useMemo(() => {
    const modelMap = new Map(models.map((m) => [m.id, m]));
    return selectedModels
      .map((modelId) => {
        const model = modelMap.get(modelId);
        if (!model) return null;
        const { inputCost, outputCost, totalCost } = calculateCost(
          inputTokens,
          outputTokens,
          model,
          requests
        );
        return {
          model,
          inputCost,
          outputCost,
          totalCost,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [inputTokens, outputTokens, requests, selectedModels]);

  // Find cheapest and most expensive
  const cheapest = costs.length > 0 ? costs.reduce((a, b) => a.totalCost < b.totalCost ? a : b) : null;
  const mostExpensive = costs.length > 0 ? costs.reduce((a, b) => a.totalCost > b.totalCost ? a : b) : null;

  return (
    <ToolLayout
      title="AI Prompt Cost Calculator"
      slug="ai-prompt-cost-calculator"
      description="Calculate API costs based on token count, model choice, and number of requests. Compare pricing across GPT-4, GPT-3.5, Claude, Gemini, and other AI models."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter your prompt text", text: "Paste or type the prompt (input) you plan to send to the AI. The calculator estimates tokens at ~4 characters per token." },
        { name: "Estimate output length", text: "Enter expected output length in characters. For example, a typical response might be 500-1000 characters." },
        { name: "Set number of requests", text: "Specify how many times you plan to make this request. This multiplies the cost accordingly." },
        { name: "Select models to compare", text: "Choose which AI models you want to compare pricing for (GPT-4, Claude, Gemini, etc.)." },
        { name: "Review cost breakdown", text: "See input costs, output costs, and total costs. Identify the cheapest and most expensive options." },
      ]}
      relatedTools={[
        { name: "Token Counter Calculator", href: "/token-counter-calculator" },
        { name: "Password Strength Checker", href: "/password-strength-checker" },
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "Regex Tester", href: "/regex-tester" },
      ]}
      content={
        <>
          <h2>What Is an AI Prompt Cost Calculator?</h2>
          <p>
            An AI prompt cost calculator estimates the financial cost of using large language model APIs. It calculates costs based on three factors: input tokens (your prompt), output tokens (the model&apos;s response), and the pricing rates of different AI providers. Since API usage is billed per token, understanding token economics is critical for managing infrastructure costs.
          </p>

          <h2>How AI API Pricing Works</h2>
          <p>
            Most AI providers use a <strong>pay-per-token</strong> model:
          </p>
          <ul>
            <li><strong>Tokens</strong> are the smallest unit of text the model processes. Roughly 1 token = 4 characters = 0.75 words.</li>
            <li><strong>Input tokens</strong> are charged at one rate (cheaper).</li>
            <li><strong>Output tokens</strong> are charged at a higher rate because generation is computationally expensive.</li>
            <li><strong>Total cost</strong> = (Input Tokens / 1000 × Input Price) + (Output Tokens / 1000 × Output Price)</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            Say you send a 1,000-character prompt to GPT-4:
          </p>
          <ul>
            <li><strong>Input tokens:</strong> 1,000 ÷ 4 = 250 tokens</li>
            <li><strong>Input cost:</strong> (250 ÷ 1,000) × $0.03 = $0.0075</li>
            <li><strong>Expected output:</strong> 500 characters = 125 tokens</li>
            <li><strong>Output cost:</strong> (125 ÷ 1,000) × $0.06 = $0.0075</li>
            <li><strong>Total per request:</strong> $0.015</li>
            <li><strong>For 1,000 requests/month:</strong> $0.015 × 1,000 = $15</li>
          </ul>

          <h2>Model Pricing Comparison</h2>
          <p>
            Different AI providers charge vastly different rates. Here&apos;s a comparison (prices updated April 2026):
          </p>
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Input Price</th>
                <th>Output Price</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>GPT-4 Turbo</td><td>OpenAI</td><td>$0.03/1K</td><td>$0.06/1K</td><td>Complex reasoning</td></tr>
              <tr><td>GPT-3.5 Turbo</td><td>OpenAI</td><td>$0.0005/1K</td><td>$0.0015/1K</td><td>Budget-friendly</td></tr>
              <tr><td>Claude 3 Opus</td><td>Anthropic</td><td>$0.015/1K</td><td>$0.075/1K</td><td>Long context</td></tr>
              <tr><td>Claude 3 Sonnet</td><td>Anthropic</td><td>$0.003/1K</td><td>$0.015/1K</td><td>Balanced</td></tr>
              <tr><td>Gemini 1.5 Pro</td><td>Google</td><td>$0.0035/1K</td><td>$0.0105/1K</td><td>Multimodal</td></tr>
              <tr><td>Gemini 1.5 Flash</td><td>Google</td><td>$0.000075/1K</td><td>$0.0003/1K</td><td>Ultra-budget</td></tr>
            </tbody>
          </table>

          <h2>Cost Optimization Strategies</h2>
          <p>
            Reducing API costs requires both technical and strategic approaches:
          </p>
          <ul>
            <li><strong>Model selection:</strong> GPT-3.5 costs 60× less than GPT-4. Use weaker models when possible.</li>
            <li><strong>Prompt optimization:</strong> Shorter, more specific prompts use fewer tokens and get better responses.</li>
            <li><strong>Caching:</strong> Reuse responses when possible. Store common queries in a database.</li>
            <li><strong>Batching:</strong> Group similar requests to reduce overhead and negotiate volume discounts.</li>
            <li><strong>Output control:</strong> Use max_tokens parameter to prevent unnecessarily long responses.</li>
            <li><strong>Context management:</strong> Only include necessary conversation history in multi-turn interactions.</li>
          </ul>

          <h2>Token Counting Accuracy</h2>
          <p>
            This calculator estimates tokens at 1 token = 4 characters. In reality:
          </p>
          <ul>
            <li><strong>OpenAI models:</strong> Use Byte Pair Encoding. Average 1 token = 4 characters, but varies by language.</li>
            <li><strong>Claude:</strong> Uses similar tokenization. Approximately 1 token = 3.5 characters.</li>
            <li><strong>Gemini:</strong> Uses SentencePiece tokenization. Slightly different ratios.</li>
            <li><strong>For accurate counts:</strong> Use OpenAI&apos;s tokenizer library (tiktoken) or provider-specific tools.</li>
          </ul>

          <h2>Volume and Discount Considerations</h2>
          <p>
            For high-volume usage:
          </p>
          <ul>
            <li><strong>Free tier limits:</strong> OpenAI offers free credits ($18 for new users, valid 3 months).</li>
            <li><strong>Volume discounts:</strong> Contact sales for quotes at $100K+/month spending.</li>
            <li><strong>Reserved capacity:</strong> Some providers offer committed spend discounts.</li>
            <li><strong>Self-hosted alternatives:</strong> Open-source models (Llama, Mistral) run locally for no API costs, but require infrastructure.</li>
          </ul>

          <h2>Hidden Costs and Considerations</h2>
          <ul>
            <li><strong>Rate limiting:</strong> If you exceed rate limits, requests are queued or rejected, not billed.</li>
            <li><strong>Latency charges:</strong> Some providers charge more for priority processing.</li>
            <li><strong>API overheads:</strong> Each request has minimal overhead but adds up with millions of requests.</li>
            <li><strong>Monitoring tools:</strong> Services like Helicone or Braintrust track costs automatically.</li>
          </ul>

          <h2>References</h2>
          <ul>
            <li>OpenAI Pricing: https://openai.com/pricing</li>
            <li>Anthropic Claude Pricing: https://www.anthropic.com/pricing</li>
            <li>Google Gemini Pricing: https://ai.google.dev/pricing</li>
            <li>OpenAI Tokenizer: https://platform.openai.com/tokenizer</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Input Settings ── */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Input Text / Prompt
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your prompt here..."
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Estimated tokens: <strong>{inputTokens.toLocaleString()}</strong>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Expected Output / Response
            </label>
            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Estimated output text or response..."
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Estimated tokens: <strong>{outputTokens.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* ── Number of Requests ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Number of Requests
          </label>
          <Input
            type="number"
            value={requests}
            onChange={(e) => setRequests(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="w-full max-w-md"
          />
          <p className="text-xs text-muted-foreground mt-2">
            For example, 100 requests = 100 times this prompt will be sent
          </p>
        </div>

        {/* ── Model Selection ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Select Models to Compare</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {models.map((model) => (
              <label key={model.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedModels([...selectedModels, model.id]);
                    } else {
                      setSelectedModels(selectedModels.filter((m) => m !== model.id));
                    }
                  }}
                  className="h-4 w-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.provider}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        {costs.length > 0 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="Total Input Cost"
                value={`$${costs.reduce((sum, c) => sum + c.inputCost, 0).toFixed(4)}`}
              />
              <ResultCard
                label="Total Output Cost"
                value={`$${costs.reduce((sum, c) => sum + c.outputCost, 0).toFixed(4)}`}
              />
              <ResultCard
                label="Average Cost"
                value={`$${(costs.reduce((sum, c) => sum + c.totalCost, 0) / costs.length).toFixed(4)}`}
              />
            </div>

            {/* Detailed Cost Comparison */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">Input Cost</th>
                      <th className="px-4 py-3 text-right font-medium">Output Cost</th>
                      <th className="px-4 py-3 text-right font-medium">Total Cost</th>
                      <th className="px-4 py-3 text-center font-medium">vs Cheapest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs
                      .sort((a, b) => a.totalCost - b.totalCost)
                      .map((cost, idx) => {
                        const multiplier = cheapest ? cost.totalCost / cheapest.totalCost : 1;
                        return (
                          <tr
                            key={cost.model.id}
                            className={`border-b last:border-b-0 ${
                              idx === 0 ? "bg-green-50 dark:bg-green-950/20" : ""
                            }`}
                          >
                            <td className="px-4 py-3 font-medium">
                              <div>
                                <p>{cost.model.name}</p>
                                <p className="text-xs text-muted-foreground">{cost.model.provider}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              ${cost.inputCost.toFixed(4)}
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              ${cost.outputCost.toFixed(4)}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-semibold">
                              ${cost.totalCost.toFixed(4)}
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                              {multiplier.toFixed(1)}×
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights */}
            <div className="grid gap-4 md:grid-cols-2">
              {cheapest && (
                <div className="rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-5">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">💰 Cheapest Option</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>{cheapest.model.name}</strong> at <strong>${cheapest.totalCost.toFixed(4)}</strong> per request
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                    Monthly cost (1,000 requests): <strong>${(cheapest.totalCost * 1000).toFixed(2)}</strong>
                  </p>
                </div>
              )}

              {mostExpensive && cheapest && (
                <div className="rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-5">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">⚠️ Savings Opportunity</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    Switch from <strong>{mostExpensive.model.name}</strong> to <strong>{cheapest.model.name}</strong>
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                    Save <strong>${((mostExpensive.totalCost - cheapest.totalCost) * 1000).toFixed(2)}</strong> per 1,000 requests
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {costs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter prompt and response text to calculate costs</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
