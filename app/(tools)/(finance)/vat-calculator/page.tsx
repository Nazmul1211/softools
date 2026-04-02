"use client";

import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Calculator, DollarSign, Percent, Receipt } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type Mode = "add" | "remove";

export default function VatCalculatorPage() {
  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState(100);
  const [vatRate, setVatRate] = useState(20);

  const result = useMemo(() => {
    if (mode === "add") {
      const vatAmount = amount * (vatRate / 100);
      return { net: amount, vatAmount, gross: amount + vatAmount };
    }

    const net = amount / (1 + vatRate / 100);
    const vatAmount = amount - net;
    return { net, vatAmount, gross: amount };
  }, [mode, amount, vatRate]);

  return (
    <ToolLayout
      title="VAT Calculator"
      description="Add VAT to net prices or remove VAT from gross prices instantly. Perfect for invoicing, pricing, and tax-inclusive or tax-exclusive comparisons."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Sales Tax Calculator", href: "/sales-tax-calculator/" },
        { name: "Margin Calculator", href: "/margin-calculator/" },
        { name: "Markup Calculator", href: "/markup-calculator/" },
        { name: "Profit Calculator", href: "/profit-calculator/" },
      ]}
      howToSteps={[
        { name: "Choose Mode", text: "Select add VAT or remove VAT from gross." },
        { name: "Enter Amount", text: "Input the base amount for your mode." },
        { name: "Set VAT Rate", text: "Use your local VAT percentage." },
        { name: "Use Results", text: "Apply net, VAT amount, and gross total in invoices." },
      ]}
      faqs={[
        {
          question: "What is the difference between VAT-inclusive and VAT-exclusive pricing?",
          answer:
            "VAT-exclusive means VAT is added at checkout. VAT-inclusive means the displayed price already includes VAT.",
        },
        {
          question: "How do I remove VAT from a total?",
          answer:
            "Divide the gross total by (1 + VAT rate). The difference between gross and net is the VAT amount.",
        },
        {
          question: "Can I use any VAT rate?",
          answer:
            "Yes. Enter the exact rate relevant to your jurisdiction and product category.",
        },
      ]}
      content={
        <>
          <h2>Understanding VAT calculations</h2>
          <p>
            VAT (Value Added Tax) is a consumption tax applied at each stage of production and distribution.
            For many businesses, correctly switching between net and gross amounts is essential for invoicing,
            accounting, and margin reporting.
          </p>
          <p>
            This VAT calculator handles both directions: adding VAT to a net amount and extracting VAT from a
            VAT-inclusive total. That helps reduce manual mistakes and improves pricing consistency.
          </p>

          <h2>Common use cases</h2>
          <p>
            Use this tool when preparing quotations, validating supplier invoices, or checking whether listed
            prices are tax-inclusive. It is also useful for cross-border sales where tax treatment may vary.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-amber-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Calculator className="h-5 w-5 text-primary" /> VAT Inputs</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={() => setMode("add")} className={`rounded-lg border px-3 py-2 text-sm ${mode === "add" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>Add VAT</button>
            <button onClick={() => setMode("remove")} className={`rounded-lg border px-3 py-2 text-sm ${mode === "remove" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>Remove VAT</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><DollarSign className="h-4 w-4" /> {mode === "add" ? "Net Amount" : "Gross Amount"}</label>
              <input type="number" min={0} step={0.01} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground"><Percent className="h-4 w-4" /> VAT Rate (%)</label>
              <input type="number" min={0} step={0.01} value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Net</p><p className="text-2xl font-bold">{formatCurrency(result.net)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">VAT</p><p className="text-2xl font-bold">{formatCurrency(result.vatAmount)}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Gross</p><p className="text-2xl font-bold">{formatCurrency(result.gross)}</p></div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground flex items-center gap-2"><Receipt className="h-4 w-4" /> Mode: {mode === "add" ? "VAT added to net amount" : "VAT extracted from gross amount"}</div>
      </div>
    </ToolLayout>
  );
}
