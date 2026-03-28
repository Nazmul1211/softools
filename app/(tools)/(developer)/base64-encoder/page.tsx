"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { ArrowRightLeft, Copy, Check, Trash2, Lock, Unlock } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "What is Base64 encoding?",
    answer: "Base64 is an encoding scheme that converts binary data into ASCII text using 64 printable characters (A-Z, a-z, 0-9, +, and /). It's used to safely transmit data through systems that only handle text, such as email attachments, embedding images in HTML/CSS, and storing binary data in JSON or XML."
  },
  {
    question: "Is Base64 encryption?",
    answer: "No, Base64 is encoding, not encryption. Encoding transforms data into another format for compatibility or transmission, while encryption scrambles data to protect it from unauthorized access. Base64-encoded data can be easily decoded by anyone—it provides no security. Never use Base64 to 'hide' sensitive data."
  },
  {
    question: "Why does Base64-encoded text become larger?",
    answer: "Base64 encoding increases data size by approximately 33%. This is because Base64 uses 6 bits per character (64 = 2^6) while the original binary uses 8 bits per byte. Every 3 bytes of input become 4 characters of Base64 output. The padding character '=' is added when the input length isn't divisible by 3."
  },
  {
    question: "What's the difference between standard and URL-safe Base64?",
    answer: "Standard Base64 uses '+' and '/' characters which have special meanings in URLs. URL-safe Base64 replaces these with '-' and '_' respectively, making the encoded string safe to use in URLs and filenames without additional encoding. The padding character '=' may also be omitted in URL-safe variants."
  },
  {
    question: "Can I encode images with Base64?",
    answer: "Yes, images can be encoded to Base64 for embedding directly in HTML or CSS using Data URIs (like 'data:image/png;base64,...'). This eliminates additional HTTP requests but increases HTML/CSS file size. It's best for small images like icons; larger images are more efficient as separate files."
  },
  {
    question: "What happens if I try to decode invalid Base64?",
    answer: "Attempting to decode invalid Base64 will result in an error or corrupted output. Invalid Base64 might have wrong characters, incorrect padding, or improper length. Our decoder will show an error message if the input isn't valid Base64. Ensure your input only contains valid Base64 characters (A-Z, a-z, 0-9, +, /, =)."
  },
];

export default function Base64Encoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);

  const encode = useCallback(() => {
    if (!input) {
      setError("Please enter text to encode");
      setOutput("");
      return;
    }

    try {
      // Use TextEncoder for proper UTF-8 handling
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      // Convert to binary string
      let binary = "";
      data.forEach(byte => {
        binary += String.fromCharCode(byte);
      });
      
      let encoded = btoa(binary);
      
      // Convert to URL-safe if needed
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }
      
      setOutput(encoded);
      setError(null);
    } catch (e) {
      setError("Encoding failed. Please check your input.");
      setOutput("");
    }
  }, [input, urlSafe]);

  const decode = useCallback(() => {
    if (!input) {
      setError("Please enter Base64 to decode");
      setOutput("");
      return;
    }

    try {
      let base64 = input;
      
      // Convert from URL-safe if needed
      if (urlSafe) {
        base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
        // Add padding if needed
        while (base64.length % 4) {
          base64 += "=";
        }
      }
      
      const binary = atob(base64);
      
      // Convert binary string to Uint8Array
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      // Decode as UTF-8
      const decoder = new TextDecoder("utf-8");
      const decoded = decoder.decode(bytes);
      
      setOutput(decoded);
      setError(null);
    } catch (e) {
      setError("Invalid Base64 input. Please check your input and try again.");
      setOutput("");
    }
  }, [input, urlSafe]);

  const handleProcess = () => {
    if (mode === "encode") {
      encode();
    } else {
      decode();
    }
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
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
    if (mode === "encode") {
      setInput("Hello, World! This is a sample text to encode.");
    } else {
      setInput("SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgdG8gZW5jb2RlLg==");
    }
    setError(null);
    setOutput("");
  };

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 strings instantly. Our free online tool supports UTF-8 encoding and URL-safe Base64 variants. All processing happens locally in your browser for privacy."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "UUID Generator", href: "/uuid-generator" },
        { name: "Password Generator", href: "/password-generator" },
        { name: "Text Case Converter", href: "/text-case-converter" },
        { name: "Word Counter", href: "/word-counter" },
      ]}
      content={
        <>
          <h2>What is Base64 Encoding?</h2>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 printable ASCII characters. It was designed to allow binary data to be transmitted through systems that only support text, such as email protocols and HTML documents.
          </p>
          <p>
            The name &quot;Base64&quot; comes from the 64 characters used in the encoding: uppercase A-Z (26), lowercase a-z (26), digits 0-9 (10), and two additional characters (typically + and /).
          </p>

          <h2>How Base64 Works</h2>
          <p>
            The encoding process converts every 3 bytes (24 bits) of input into 4 characters (6 bits each = 24 bits) of output:
          </p>
          <ol>
            <li>Take 3 input bytes (24 bits)</li>
            <li>Split into 4 groups of 6 bits each</li>
            <li>Convert each 6-bit group to its corresponding Base64 character</li>
            <li>If input isn&apos;t divisible by 3, add padding (=)</li>
          </ol>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`Example: "Man"
M = 77 = 01001101
a = 97 = 01100001
n = 110 = 01101110

Combined: 010011 010110 000101 101110
           T       W       F       u

"Man" → "TWFu"`}</code>
          </pre>

          <h2>Common Use Cases</h2>
          
          <h3>Embedding Images in HTML/CSS</h3>
          <p>
            Small images can be embedded directly in HTML or CSS using Data URIs:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`<img src="data:image/png;base64,iVBORw0KGgo..." />

.icon {
  background: url(data:image/svg+xml;base64,PHN2ZyB4...);
}`}</code>
          </pre>

          <h3>Email Attachments (MIME)</h3>
          <p>
            Email protocols like SMTP were designed for 7-bit ASCII text. Base64 encoding allows binary attachments (images, documents) to be transmitted safely through these text-only systems.
          </p>

          <h3>Storing Binary in JSON/XML</h3>
          <p>
            JSON and XML don&apos;t natively support binary data. Base64 encoding allows you to include binary data as a text string within these formats.
          </p>

          <h3>API Authentication</h3>
          <p>
            HTTP Basic Authentication encodes credentials (username:password) in Base64:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
// Decodes to: username:password`}</code>
          </pre>

          <h2>Base64 Variants</h2>
          
          <h3>Standard Base64 (RFC 4648)</h3>
          <p>
            Uses A-Z, a-z, 0-9, +, /, and = for padding. This is the most common variant used for email and general purposes.
          </p>

          <h3>URL-Safe Base64</h3>
          <p>
            Replaces + with - and / with _ to avoid URL encoding issues. The padding (=) is often omitted. Used in JWTs, URL parameters, and filenames.
          </p>

          <h3>MIME Base64</h3>
          <p>
            Same as standard but adds line breaks every 76 characters. Used in email encoding to comply with SMTP line length limits.
          </p>

          <h2>Important Considerations</h2>
          
          <h3>Size Increase</h3>
          <p>
            Base64 encoding increases data size by approximately 33%. For every 3 bytes of input, you get 4 bytes of output. Consider this overhead when encoding large files.
          </p>

          <h3>Not Encryption</h3>
          <p>
            Base64 is NOT encryption—it provides no security. Anyone can decode Base64 data. Never use it to &quot;protect&quot; sensitive information. Use proper encryption (AES, RSA) for security.
          </p>

          <h3>Character Encoding</h3>
          <p>
            When encoding text, be aware of character encoding (UTF-8, UTF-16, etc.). This tool uses UTF-8, which is the most common encoding for web applications. Decoding with the wrong character set can produce garbled output.
          </p>

          <h2>Base64 in JavaScript</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`// Encode (ASCII only)
btoa("Hello");  // "SGVsbG8="

// Decode
atob("SGVsbG8=");  // "Hello"

// For Unicode text
function encodeUnicode(str) {
  return btoa(encodeURIComponent(str)
    .replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode('0x' + p1)));
}

function decodeUnicode(str) {
  return decodeURIComponent(atob(str)
    .split('').map(c => 
      '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(''));
}`}</code>
          </pre>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => { setMode("encode"); setError(null); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              mode === "encode"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="h-4 w-4" />
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setError(null); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              mode === "decode"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Unlock className="h-4 w-4" />
            Decode
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">URL-safe Base64</span>
          </label>
          <button onClick={loadSample} className="text-sm text-primary hover:underline">
            Load Sample
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder={mode === "encode" 
              ? "Enter text to encode to Base64..." 
              : "Enter Base64 string to decode..."}
            className="w-full h-40 rounded-xl border border-border bg-white dark:bg-muted/30 p-4 font-mono text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleProcess} variant="primary">
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </Button>
          <Button onClick={swapMode} variant="outline">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Swap & Use Output
          </Button>
          <Button onClick={clearAll} variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground">
                {mode === "encode" ? "Base64 Output" : "Decoded Text"}
              </label>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-40 rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm text-foreground resize-none"
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {mode === "encode" 
                ? `${input.length} characters → ${output.length} characters (${Math.round((output.length / input.length - 1) * 100)}% increase)`
                : `${input.length} characters → ${output.length} characters`
              }
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3">
            {mode === "encode" ? "About Encoding" : "About Decoding"}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {mode === "encode" ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Base64 encoding increases data size by ~33%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  UTF-8 characters are fully supported
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use URL-safe mode for URLs, filenames, and JWTs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  This is encoding, NOT encryption—it&apos;s not secure
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Input must be valid Base64 (A-Z, a-z, 0-9, +, /, =)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Enable URL-safe mode if input uses - and _ instead of + and /
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Output is decoded as UTF-8 text
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Invalid input will show an error message
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
