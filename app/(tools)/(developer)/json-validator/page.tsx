"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Copy,
  Download,
  FileJson,
  Minimize2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

interface ValidationErrorInfo {
  message: string;
  position?: number;
  line?: number;
  column?: number;
}

interface JsonMetrics {
  keys: number;
  objects: number;
  arrays: number;
  values: number;
  maxDepth: number;
}

const sampleJSON = `{
  "company": "Softzar",
  "domain": "https://softzar.com/",
  "active": true,
  "tools": [
    {
      "slug": "json-validator",
      "category": "developer",
      "features": ["validation", "formatting", "minification"]
    },
    {
      "slug": "slug-generator",
      "category": "text",
      "features": ["seo", "bulk mode", "normalization"]
    }
  ],
  "metadata": {
    "updatedAt": "2026-03-29",
    "owner": "Softzar Team"
  }
}`;

const faqs: FAQItem[] = [
  {
    question: "What does a JSON validator actually check?",
    answer:
      "A JSON validator checks whether your content follows strict JSON syntax rules. It catches invalid commas, quotes, brackets, unsupported values, and malformed structure so parsers and APIs can read it safely.",
  },
  {
    question: "Why line and column hints matter for debugging?",
    answer:
      "Line and column hints let you jump directly to the failing character. Instead of scanning large payloads manually, you can fix syntax errors quickly and avoid expensive trial-and-error cycles in development.",
  },
  {
    question: "Is formatting required for valid JSON?",
    answer:
      "No. Pretty formatting is optional for readability. Minified JSON without spaces is still valid as long as structure, quotes, and commas follow JSON rules.",
  },
  {
    question: "Can this validator handle large files?",
    answer:
      "Yes, for typical frontend payload sizes. Very large JSON files can still be validated, but performance depends on your browser memory and device capability.",
  },
];

function safeStringify(value: unknown, indent: number): string {
  return JSON.stringify(value, null, indent);
}

function getLineColumnFromPosition(text: string, position: number): { line: number; column: number } {
  const safePosition = Math.max(0, Math.min(position, text.length));
  const lines = text.slice(0, safePosition).split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

function parseErrorPosition(errorMessage: string): number | undefined {
  const positionMatch = errorMessage.match(/position\s+(\d+)/i);
  if (!positionMatch) return undefined;
  const parsed = Number.parseInt(positionMatch[1], 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function analyzeJSON(value: unknown): JsonMetrics {
  const metrics: JsonMetrics = {
    keys: 0,
    objects: 0,
    arrays: 0,
    values: 0,
    maxDepth: 0,
  };

  const visit = (node: unknown, depth: number) => {
    metrics.maxDepth = Math.max(metrics.maxDepth, depth);

    if (Array.isArray(node)) {
      metrics.arrays += 1;
      metrics.values += node.length;
      node.forEach((item) => visit(item, depth + 1));
      return;
    }

    if (node !== null && typeof node === "object") {
      metrics.objects += 1;
      const entries = Object.entries(node as Record<string, unknown>);
      metrics.keys += entries.length;
      entries.forEach(([, child]) => visit(child, depth + 1));
      return;
    }

    metrics.values += 1;
  };

  visit(value, 1);
  return metrics;
}

export default function JSONValidatorPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [errorInfo, setErrorInfo] = useState<ValidationErrorInfo | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [metrics, setMetrics] = useState<JsonMetrics>({
    keys: 0,
    objects: 0,
    arrays: 0,
    values: 0,
    maxDepth: 0,
  });
  const [copied, setCopied] = useState(false);

  const parsedPreview = useMemo(() => {
    if (!output) return "";
    return output.length > 2000 ? `${output.slice(0, 2000)}...` : output;
  }, [output]);

  const clearState = () => {
    setInput("");
    setOutput("");
    setErrorInfo(null);
    setIsValid(null);
    setMetrics({ keys: 0, objects: 0, arrays: 0, values: 0, maxDepth: 0 });
  };

  const loadSample = () => {
    setInput(sampleJSON);
    setOutput("");
    setErrorInfo(null);
    setIsValid(null);
  };

  const validateOnly = () => {
    if (!input.trim()) {
      setIsValid(false);
      setErrorInfo({ message: "Please add JSON content to validate." });
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input) as unknown;
      setIsValid(true);
      setErrorInfo(null);
      setMetrics(analyzeJSON(parsed));
      setOutput(safeStringify(parsed, 2));
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Invalid JSON.";
      const position = parseErrorPosition(message);
      const lineColumn = typeof position === "number" ? getLineColumnFromPosition(input, position) : undefined;

      setIsValid(false);
      setOutput("");
      setErrorInfo({
        message,
        position,
        line: lineColumn?.line,
        column: lineColumn?.column,
      });
      setMetrics({ keys: 0, objects: 0, arrays: 0, values: 0, maxDepth: 0 });
    }
  };

  const formatJSON = () => {
    if (!input.trim()) {
      setIsValid(false);
      setErrorInfo({ message: "Please add JSON content before formatting." });
      return;
    }

    try {
      const parsed = JSON.parse(input) as unknown;
      const formatted = safeStringify(parsed, 2);
      setOutput(formatted);
      setInput(formatted);
      setIsValid(true);
      setErrorInfo(null);
      setMetrics(analyzeJSON(parsed));
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Invalid JSON.";
      setIsValid(false);
      setErrorInfo({ message });
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      setIsValid(false);
      setErrorInfo({ message: "Please add JSON content before minifying." });
      return;
    }

    try {
      const parsed = JSON.parse(input) as unknown;
      const minified = safeStringify(parsed, 0);
      setOutput(minified);
      setInput(minified);
      setIsValid(true);
      setErrorInfo(null);
      setMetrics(analyzeJSON(parsed));
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Invalid JSON.";
      setIsValid(false);
      setErrorInfo({ message });
    }
  };

  const copyContent = async () => {
    const content = output || input;
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (caughtError) {
      console.error("Copy failed:", caughtError);
    }
  };

  const downloadJSON = () => {
    const content = output || input;
    if (!content) return;

    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "validated.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const text = typeof readerEvent.target?.result === "string" ? readerEvent.target.result : "";
      setInput(text);
      setOutput("");
      setErrorInfo(null);
      setIsValid(null);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <ToolLayout
      title="JSON Validator"
      description="Validate JSON syntax with line-aware error hints, then format or minify instantly. Browser-side processing keeps your payload private and fast."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter/" },
        { name: "Base64 Encoder/Decoder", href: "/base64-encoder/" },
        { name: "URL Encoder/Decoder", href: "/url-encoder/" },
        { name: "Regex Tester", href: "/regex-tester/" },
      ]}
      howToSteps={[
        { name: "Paste or Upload", text: "Insert JSON text or upload a JSON file." },
        { name: "Validate", text: "Run syntax validation and review line/column hints if errors exist." },
        { name: "Format or Minify", text: "Clean up output for readability or compact transfer payloads." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>Why JSON Validation Is a Non-Negotiable Step in Modern Development</h2>
          <p>
            JSON is the backbone of API communication, serverless events, configuration files, and front-end state exchange. Even small syntax mistakes can break entire workflows, trigger deployment failures, and cause confusing runtime behavior. That is why a dedicated JSON validator should be part of your daily development workflow. Validation is not just a formatting convenience. It is a reliability guardrail that protects integrations, reduces debugging time, and helps teams ship with confidence.
          </p>
          <p>
            In production systems, malformed JSON rarely fails in isolation. It often cascades into partial updates, missing data in dashboards, broken search indexing, and difficult-to-reproduce client errors. A fast validator with readable error messaging prevents these issues by catching structural mistakes before data moves into critical paths.
          </p>

          <h2>How JSON Validation Supports SEO and Site Performance at Scale</h2>
          <p>
            Teams focused on technical SEO frequently work with JSON payloads, from build-time content APIs to structured metadata generation. Invalid JSON in content pipelines can stop pages from rendering as expected, delay indexing, or break schema injection scripts. By validating responses before publishing, you reduce the risk of crawl issues and broken structured data that might impact search visibility.
          </p>
          <p>
            Validation also supports performance because malformed payloads trigger retries, fallback logic, and error boundaries that add unnecessary overhead. Clean payloads move through rendering and caching layers more predictably, which can help maintain smooth user experiences and stronger Core Web Vitals in real traffic scenarios.
          </p>

          <h2>Common JSON Errors Developers Face</h2>
          <ul>
            <li>Trailing commas after the last object property or array item.</li>
            <li>Single quotes instead of required double quotes around keys and strings.</li>
            <li>Missing commas between key-value pairs.</li>
            <li>Mismatched braces or brackets in nested objects.</li>
            <li>Unescaped control characters and invalid Unicode sequences.</li>
            <li>Comments inserted into strict JSON files.</li>
          </ul>
          <p>
            These issues are common because JSON looks simple but enforces strict grammar. A strong validator should surface exact failure context, including line and column references when possible, so engineers can fix errors in seconds rather than scanning large payloads manually.
          </p>

          <h2>Validation, Formatting, and Minification: Different Jobs, One Workflow</h2>
          <p>
            Validation answers one question: is this JSON syntactically correct? Formatting serves readability by adding indentation and line breaks for humans. Minification removes unnecessary whitespace to reduce payload size for transport. These operations complement each other. A practical workflow is to validate first, format for code review and debugging, then minify for production transfer where bandwidth matters.
          </p>
          <p>
            Keeping these capabilities in one tool speeds up iteration for API development, data migration, test fixture creation, and debugging webhook events. It also helps cross-functional teams communicate because everyone can work with a consistent representation of the same data.
          </p>

          <h2>Best Practices for JSON Quality in Team Environments</h2>
          <ol>
            <li>Validate payloads before committing config or fixture files.</li>
            <li>Use consistent key naming conventions across services.</li>
            <li>Keep nesting depth reasonable for maintainability and parsing clarity.</li>
            <li>Document required vs optional fields in shared contracts.</li>
            <li>Run automated schema checks in CI for critical endpoints.</li>
            <li>Use minified JSON only where transport size matters; keep formatted files for review.</li>
          </ol>
          <p>
            Teams that institutionalize JSON validation reduce avoidable incidents and speed up onboarding. New contributors can diagnose issues faster, while senior engineers spend less time on repetitive syntax support.
          </p>

          <h2>When to Use a Browser-Based Validator</h2>
          <p>
            A browser validator is perfect for quick checks during development, client-side troubleshooting, reviewing logs, and editing third-party payloads without modifying local dev environments. It is especially useful for distributed teams and support workflows where people may not have full IDE setups. With local browser processing, sensitive payloads can be reviewed rapidly without sending data to remote processing services.
          </p>
          <p>
            If your team handles high-volume data pipelines, pairing this validator with schema-level checks and test automation gives you a practical defense-in-depth model: syntax correctness first, contract correctness second, and business-rule correctness third.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/12 via-background to-amber-500/10 p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <FileJson className="h-5 w-5 text-primary" />
            Developer-Ready JSON Validation Workspace
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Validate JSON, inspect structural metrics, and export clean payloads for APIs, configs, and debugging.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={validateOnly} variant="primary" size="sm">
            <CheckSquare className="mr-1 h-4 w-4" />
            Validate
          </Button>
          <Button onClick={formatJSON} variant="outline" size="sm">
            <Sparkles className="mr-1 h-4 w-4" />
            Format
          </Button>
          <Button onClick={minifyJSON} variant="outline" size="sm">
            <Minimize2 className="mr-1 h-4 w-4" />
            Minify
          </Button>
          <Button onClick={() => void copyContent()} variant="outline" size="sm">
            <Copy className="mr-1 h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={downloadJSON} variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
          <Button onClick={clearState} variant="outline" size="sm">
            <Trash2 className="mr-1 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={loadSample} variant="outline" size="sm">
            <FileJson className="mr-1 h-4 w-4" />
            Sample
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted/50">
            <Upload className="h-4 w-4" />
            Upload
            <input type="file" accept=".json,application/json" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Input JSON</h3>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='{"message": "Paste your JSON here"}'
              className="h-80 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </section>

          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Validated Output</h3>
            <textarea
              value={output}
              readOnly
              placeholder="Validated or transformed JSON will appear here"
              className="h-80 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </section>
        </div>

        {isValid !== null && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              isValid
                ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            <div className="flex items-start gap-2">
              {isValid ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <AlertCircle className="mt-0.5 h-4 w-4" />}
              <div>
                <p className="font-medium">
                  {isValid ? "Valid JSON" : "Invalid JSON"}
                </p>
                {!isValid && errorInfo && <p className="mt-1">{errorInfo.message}</p>}
                {!isValid && errorInfo?.line && errorInfo?.column && (
                  <p className="mt-1 text-xs">
                    Line {errorInfo.line}, Column {errorInfo.column}
                    {typeof errorInfo.position === "number" ? ` (Position ${errorInfo.position})` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <ResultsGrid columns={4}>
          <ResultCard label="Keys" value={metrics.keys} />
          <ResultCard label="Objects" value={metrics.objects} />
          <ResultCard label="Arrays" value={metrics.arrays} />
          <ResultCard label="Values" value={metrics.values} />
          <ResultCard label="Max Depth" value={metrics.maxDepth} />
          <ResultCard label="Input Length" value={input.length} />
          <ResultCard label="Output Length" value={output.length} />
          <ResultCard label="Preview Snippet" value={parsedPreview ? `${parsedPreview.length} chars` : 0} />
        </ResultsGrid>
      </div>
    </ToolLayout>
  );
}
