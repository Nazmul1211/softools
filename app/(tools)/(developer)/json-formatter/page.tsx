"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Code, Copy, Check, Trash2, Download, Upload, AlertCircle, CheckCircle, Minimize2, Maximize2 } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "What is JSON?",
    answer: "JSON (JavaScript Object Notation) is a lightweight data format used to store and exchange data. It's human-readable and easy for machines to parse. JSON uses key-value pairs and arrays to structure data, making it the standard format for APIs, configuration files, and data storage in web applications."
  },
  {
    question: "How do I fix invalid JSON?",
    answer: "Common JSON errors include: missing commas between elements, trailing commas (not allowed), using single quotes instead of double quotes, unquoted keys (all keys must be in double quotes), and missing brackets or braces. Our validator shows the exact location and type of error to help you fix it quickly."
  },
  {
    question: "What's the difference between minified and formatted JSON?",
    answer: "Formatted (prettified) JSON includes whitespace, indentation, and line breaks for human readability. Minified JSON removes all unnecessary whitespace to reduce file size for transmission. Both are valid JSON; formatting is just for convenience. Minified JSON can be 10-30% smaller in file size."
  },
  {
    question: "Can I format JSON with special characters?",
    answer: "Yes, JSON supports Unicode characters. Special characters within strings should be escaped (like \\n for newline, \\\" for quotes). Non-ASCII Unicode characters can be included directly or as escape sequences (\\uXXXX). Our formatter handles these correctly and preserves the data integrity."
  },
  {
    question: "What JSON syntax rules must I follow?",
    answer: "Key rules: 1) Keys must be strings in double quotes. 2) Strings must use double quotes (not single). 3) No trailing commas after the last element. 4) Numbers cannot have leading zeros (except 0.x). 5) Only these value types: string, number, object, array, true, false, null. 6) No comments allowed in standard JSON."
  },
  {
    question: "How large of a JSON file can I format?",
    answer: "Our browser-based tool can handle JSON files up to several megabytes. For very large files (10MB+), formatting may be slow. There's no server upload—all processing happens locally in your browser, so your data remains private. For extremely large files, consider using a desktop tool or command-line utility."
  },
];

const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "gaming", "coding"],
  "isActive": true,
  "balance": 1250.50
}`;

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON to format");
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError(null);
    } catch (e) {
      const err = e as SyntaxError;
      setError(`Invalid JSON: ${err.message}`);
      setOutput("");
    }
  }, [input, indentSize]);

  const minifyJSON = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON to minify");
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (e) {
      const err = e as SyntaxError;
      setError(`Invalid JSON: ${err.message}`);
      setOutput("");
    }
  }, [input]);

  const validateJSON = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter JSON to validate");
      return;
    }

    try {
      JSON.parse(input);
      setError(null);
      setOutput("✓ Valid JSON");
    } catch (e) {
      const err = e as SyntaxError;
      setError(`Invalid JSON: ${err.message}`);
      setOutput("");
    }
  }, [input]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output || input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const loadSample = () => {
    setInput(sampleJSON);
    setError(null);
    setOutput("");
  };

  const downloadJSON = () => {
    const content = output || input;
    if (!content) return;
    
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setError(null);
      setOutput("");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, beautify, validate, and minify JSON data instantly. Our free online tool includes syntax highlighting and detailed error messages to help you work with JSON more efficiently."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "UUID Generator", href: "/uuid-generator" },
        { name: "Password Generator", href: "/password-generator" },
        { name: "Regex Tester", href: "/regex-tester" },
        { name: "Color Converter", href: "/color-converter" },
      ]}
      content={
        <>
          <h2>What is JSON?</h2>
          <p>
            JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that&apos;s easy for humans to read and write, and easy for machines to parse and generate. Despite its name, JSON is language-independent and is used extensively across all modern programming languages.
          </p>
          <p>
            JSON has become the de facto standard for data exchange on the web, particularly for REST APIs, configuration files, and storing structured data in databases like MongoDB.
          </p>

          <h2>JSON Syntax Rules</h2>
          <p>
            JSON has simple but strict syntax rules that must be followed:
          </p>
          
          <h3>Data Types</h3>
          <ul>
            <li><strong>Strings:</strong> Must be in double quotes (&quot;text&quot;)</li>
            <li><strong>Numbers:</strong> Integer or floating point (42, 3.14, -17)</li>
            <li><strong>Booleans:</strong> true or false (lowercase)</li>
            <li><strong>Null:</strong> null (lowercase)</li>
            <li><strong>Arrays:</strong> Ordered lists in square brackets [1, 2, 3]</li>
            <li><strong>Objects:</strong> Key-value pairs in curly braces {`{"key": "value"}`}</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li><strong>Trailing commas:</strong> {`{"a": 1,}`} is invalid—no comma after last item</li>
            <li><strong>Single quotes:</strong> {`{'key': 'value'}`} is invalid—must use double quotes</li>
            <li><strong>Unquoted keys:</strong> {`{key: "value"}`} is invalid—keys must be quoted</li>
            <li><strong>Comments:</strong> // or /* */ are not allowed in JSON</li>
            <li><strong>Undefined:</strong> undefined is not a valid JSON value</li>
          </ul>

          <h2>JSON vs Other Formats</h2>
          
          <h3>JSON vs XML</h3>
          <p>
            JSON is generally preferred over XML for most modern applications because it&apos;s more compact, easier to read, and faster to parse. XML has more features (attributes, namespaces, comments) but at the cost of verbosity.
          </p>

          <h3>JSON vs YAML</h3>
          <p>
            YAML is a superset of JSON that allows comments and more human-friendly syntax. YAML is popular for configuration files, while JSON is preferred for data exchange due to its simplicity and universal support.
          </p>

          <h2>Working with JSON in JavaScript</h2>
          <p>
            JavaScript provides built-in methods for working with JSON:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`// Parse JSON string to object
const data = JSON.parse('{"name":"John"}');

// Convert object to JSON string
const json = JSON.stringify({name: "John"});

// Pretty print with 2-space indent
const pretty = JSON.stringify(data, null, 2);`}</code>
          </pre>

          <h2>JSON Best Practices</h2>
          <ul>
            <li><strong>Use consistent naming:</strong> camelCase or snake_case, but be consistent</li>
            <li><strong>Keep it flat:</strong> Avoid deeply nested structures when possible</li>
            <li><strong>Use arrays for ordered collections:</strong> When order matters</li>
            <li><strong>Include ISO 8601 dates:</strong> &quot;2024-03-14T12:00:00Z&quot;</li>
            <li><strong>Validate input:</strong> Always validate JSON from external sources</li>
            <li><strong>Handle errors gracefully:</strong> Wrap JSON.parse in try-catch</li>
          </ul>

          <h2>JSON in APIs</h2>
          <p>
            JSON is the standard format for REST APIs. When working with APIs:
          </p>
          <ul>
            <li>Set the Content-Type header to application/json</li>
            <li>Use JSON.stringify() when sending data</li>
            <li>Handle HTTP error responses properly</li>
            <li>Validate response structure before using data</li>
          </ul>

          <h2>Performance Considerations</h2>
          <p>
            For large JSON files, consider:
          </p>
          <ul>
            <li><strong>Streaming parsers:</strong> For files too large for memory</li>
            <li><strong>Minification:</strong> Remove whitespace to reduce transfer size</li>
            <li><strong>Compression:</strong> Use gzip for network transfer</li>
            <li><strong>Pagination:</strong> Split large arrays into smaller chunks</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={formatJSON} variant="primary" size="sm">
            <Maximize2 className="h-4 w-4 mr-1" />
            Format
          </Button>
          <Button onClick={minifyJSON} variant="outline" size="sm">
            <Minimize2 className="h-4 w-4 mr-1" />
            Minify
          </Button>
          <Button onClick={validateJSON} variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Validate
          </Button>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={downloadJSON} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button onClick={clearAll} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-1.5 text-sm text-foreground"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
          <button onClick={loadSample} className="text-sm text-primary hover:underline">
            Load Sample
          </button>
          <label className="text-sm text-primary hover:underline cursor-pointer">
            <Upload className="h-4 w-4 inline mr-1" />
            Upload File
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Input/Output Areas */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Input JSON
            </label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder="Paste your JSON here..."
              className="w-full h-80 rounded-xl border border-border bg-white dark:bg-muted/30 p-4 font-mono text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              Output
              {error && <AlertCircle className="h-4 w-4 text-red-500" />}
              {output && !error && <CheckCircle className="h-4 w-4 text-green-500" />}
            </label>
            <textarea
              value={error ? "" : output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className={`w-full h-80 rounded-xl border p-4 font-mono text-sm resize-none ${
                error
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-border bg-muted/30"
              } text-foreground placeholder-muted-foreground`}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Error</p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1 font-mono">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            JSON Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              All keys must be strings in double quotes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              No trailing commas after the last element
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use double quotes for strings, not single quotes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Comments are not allowed in standard JSON
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
