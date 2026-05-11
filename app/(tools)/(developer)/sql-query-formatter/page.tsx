"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";

const KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "JOIN",
  "ON",
  "AND",
  "OR",
  "UNION",
  "UNION ALL",
  "WITH",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
];

const faqs: FAQItem[] = [
  {
    question: "Does this formatter execute SQL?",
    answer: "No. It only formats text in your browser.",
  },
  {
    question: "Can I keep keywords lowercase?",
    answer:
      "Yes. You can switch keyword casing between uppercase and lowercase.",
  },
  {
    question: "Can I minify SQL after formatting?",
    answer:
      "Yes. The minified output removes extra spaces and line breaks for compact queries.",
  },
];

function keywordCase(value: string, mode: "upper" | "lower"): string {
  return mode === "upper" ? value.toUpperCase() : value.toLowerCase();
}

function formatSql(sql: string, mode: "upper" | "lower"): string {
  let output = sql.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
  if (!output) return "";

  const sortedKeywords = [...KEYWORDS].sort((a, b) => b.length - a.length);
  for (const keyword of sortedKeywords) {
    const escaped = keyword.replace(/\s+/g, "\\s+");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    output = output.replace(regex, `\n${keywordCase(keyword, mode)}`);
  }

  output = output
    .replace(/\n\s+/g, "\n")
    .replace(/,\s*/g, ",\n  ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  return output;
}

function minifySql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

export default function SQLQueryFormatterPage() {
  const [inputSql, setInputSql] = useState(
    "select id, email, created_at from users where status = 'active' and deleted_at is null order by created_at desc limit 100"
  );
  const [keywordMode, setKeywordMode] = useState<"upper" | "lower">("upper");
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const [copiedMinified, setCopiedMinified] = useState(false);

  const formatted = useMemo(
    () => formatSql(inputSql, keywordMode),
    [inputSql, keywordMode]
  );
  const minified = useMemo(() => minifySql(inputSql), [inputSql]);

  const copyText = async (
    text: string,
    type: "formatted" | "minified"
  ) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    if (type === "formatted") {
      setCopiedFormatted(true);
      setTimeout(() => setCopiedFormatted(false), 1200);
      return;
    }
    setCopiedMinified(true);
    setTimeout(() => setCopiedMinified(false), 1200);
  };

  return (
    <ToolLayout
      title="SQL Query Formatter"
      slug="sql-query-formatter"
      description="Beautify SQL queries for readability and generate compact minified SQL in one place."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Paste SQL", text: "Add your raw query in the input area." },
        { name: "Choose keyword case", text: "Select uppercase or lowercase SQL keyword style." },
        { name: "Copy output", text: "Use formatted SQL for readability or minified SQL for compact storage." },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter/" },
        { name: "Regex Generator", href: "/regex-generator/" },
        { name: "AI Prompt Formatter", href: "/ai-prompt-formatter/" },
      ]}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Input SQL</label>
          <textarea
            value={inputSql}
            onChange={(event) => setInputSql(event.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            rows={8}
            placeholder="Paste SQL query here"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">Keyword case:</span>
          <button
            type="button"
            onClick={() => setKeywordMode("upper")}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${keywordMode === "upper" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`}
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={() => setKeywordMode("lower")}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${keywordMode === "lower" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-muted"}`}
          >
            lowercase
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Formatted SQL</label>
            <button
              type="button"
              onClick={() => copyText(formatted, "formatted")}
              disabled={!formatted}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copiedFormatted ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={formatted}
            readOnly
            rows={10}
            className="w-full rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm text-foreground"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Minified SQL</label>
            <button
              type="button"
              onClick={() => copyText(minified, "minified")}
              disabled={!minified}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copiedMinified ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={minified}
            readOnly
            rows={4}
            className="w-full rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm text-foreground"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
