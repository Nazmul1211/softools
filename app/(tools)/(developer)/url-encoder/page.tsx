"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";

type Mode = "encode" | "decode";
type EncodeMethod = "component" | "full" | "plus";

export default function URLEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [encodeMethod, setEncodeMethod] = useState<EncodeMethod>("component");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const processText = useCallback(() => {
    setError("");
    try {
      if (mode === "encode") {
        let result: string;
        switch (encodeMethod) {
          case "component":
            result = encodeURIComponent(input);
            break;
          case "full":
            result = encodeURI(input);
            break;
          case "plus":
            result = encodeURIComponent(input).replace(/%20/g, "+");
            break;
          default:
            result = encodeURIComponent(input);
        }
        setOutput(result);
      } else {
        let result: string;
        switch (encodeMethod) {
          case "component":
            result = decodeURIComponent(input);
            break;
          case "full":
            result = decodeURI(input);
            break;
          case "plus":
            result = decodeURIComponent(input.replace(/\+/g, "%20"));
            break;
          default:
            result = decodeURIComponent(input);
        }
        setOutput(result);
      }
    } catch (e) {
      setError(`Invalid input for ${mode === "encode" ? "encoding" : "decoding"}. ${e instanceof Error ? e.message : ""}`);
      setOutput("");
    }
  }, [input, mode, encodeMethod]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  // Character encoding reference
  const commonEncodings = [
    { char: " ", encoded: "%20 or +" },
    { char: "!", encoded: "%21" },
    { char: "#", encoded: "%23" },
    { char: "$", encoded: "%24" },
    { char: "&", encoded: "%26" },
    { char: "'", encoded: "%27" },
    { char: "(", encoded: "%28" },
    { char: ")", encoded: "%29" },
    { char: "*", encoded: "%2A" },
    { char: "+", encoded: "%2B" },
    { char: ",", encoded: "%2C" },
    { char: "/", encoded: "%2F" },
    { char: ":", encoded: "%3A" },
    { char: ";", encoded: "%3B" },
    { char: "=", encoded: "%3D" },
    { char: "?", encoded: "%3F" },
    { char: "@", encoded: "%40" },
    { char: "[", encoded: "%5B" },
    { char: "]", encoded: "%5D" },
  ];

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode or decode URLs and query strings. Convert special characters to percent-encoded format for safe use in URLs."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      relatedTools={[
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "HTML Encoder", href: "/html-encoder" },
      ]}
      content={
        <>
          <h2>What is URL Encoding?</h2>
          <p>
            URL encoding, also known as percent-encoding, is a mechanism for encoding information 
            in a Uniform Resource Identifier (URI). It replaces unsafe ASCII characters with a &quot;%&quot; 
            followed by two hexadecimal digits representing the character&apos;s ASCII code.
          </p>

          <h2>Why Encode URLs?</h2>
          <ul>
            <li><strong>Safety:</strong> Reserved characters like &amp;, ?, = have special meaning in URLs</li>
            <li><strong>Special Characters:</strong> Non-ASCII characters must be encoded for compatibility</li>
            <li><strong>Spaces:</strong> URLs cannot contain spaces—they must be encoded as %20 or +</li>
            <li><strong>API Calls:</strong> Query parameters often contain characters that need encoding</li>
          </ul>

          <h2>Encoding Methods</h2>
          <ul>
            <li><strong>encodeURIComponent:</strong> Encodes everything except A-Z, a-z, 0-9, - _ . ! ~ * &apos; ( )</li>
            <li><strong>encodeURI:</strong> Preserves URL structure characters like : / ? # [ ] @</li>
            <li><strong>Space as +:</strong> Form data encoding where spaces become + instead of %20</li>
          </ul>

          <h2>Common Use Cases</h2>
          <ul>
            <li>Building API request URLs with query parameters</li>
            <li>Encoding form data for submission</li>
            <li>Creating bookmarklets and javascript: URLs</li>
            <li>Debugging URL-related issues</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-4">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === "encode"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === "decode"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Decode
            </button>
          </div>

          <div className="flex rounded-lg border border-border overflow-hidden">
            {[
              { value: "component" as const, label: "Component" },
              { value: "full" as const, label: "Full URI" },
              { value: "plus" as const, label: "Form Data" },
            ].map((method) => (
              <button
                key={method.value}
                onClick={() => setEncodeMethod(method.value)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  encodeMethod === method.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {mode === "encode" ? "Text to Encode" : "URL to Decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode (e.g., Hello World! How are you?)"
                : "Enter URL-encoded text (e.g., Hello%20World%21)"
            }
            className="w-full h-32 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={processText}>
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
          <Button variant="outline" onClick={swapInputOutput} disabled={!output}>
            Swap ⇄
          </Button>
          <Button variant="outline" onClick={clearAll}>
            Clear
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {mode === "encode" ? "Encoded Result" : "Decoded Result"}
              </span>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? "✓ Copied!" : "Copy"}
              </Button>
            </div>
            <div className="bg-background/50 rounded-lg p-3 font-mono text-sm break-all">
              {output}
            </div>
          </div>
        )}

        {/* Comparison if both exist */}
        {input && output && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Comparison</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Original ({input.length} chars)</p>
                <div className="bg-background/50 rounded-lg p-2 font-mono text-xs break-all max-h-24 overflow-auto">
                  {input}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {mode === "encode" ? "Encoded" : "Decoded"} ({output.length} chars)
                </p>
                <div className="bg-background/50 rounded-lg p-2 font-mono text-xs break-all max-h-24 overflow-auto">
                  {output}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Character Reference */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Common URL Encodings</h3>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
            {commonEncodings.map((item) => (
              <div
                key={item.char}
                className="bg-background/50 rounded-lg p-2 text-center"
              >
                <span className="font-mono text-lg text-primary">
                  {item.char === " " ? "␣" : item.char}
                </span>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {item.encoded}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Method Explanation */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Encoding Methods Explained</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-background/50 rounded-lg p-3">
              <p className="font-medium text-foreground mb-1">Component</p>
              <p className="text-xs text-muted-foreground">
                <code>encodeURIComponent()</code> - Encodes everything except alphanumeric 
                and <code>- _ . ! ~ * &apos; ( )</code>. Best for query parameters.
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="font-medium text-foreground mb-1">Full URI</p>
              <p className="text-xs text-muted-foreground">
                <code>encodeURI()</code> - Preserves URL structure characters. 
                Use for complete URLs with path and query.
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="font-medium text-foreground mb-1">Form Data</p>
              <p className="text-xs text-muted-foreground">
                <code>application/x-www-form-urlencoded</code> - Same as Component 
                but spaces become <code>+</code> instead of <code>%20</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
