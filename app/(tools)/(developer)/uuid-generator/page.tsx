"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Key, Copy, Check, Trash2, RefreshCw, Plus, Minus } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "What is a UUID?",
    answer: "UUID (Universally Unique Identifier) is a 128-bit identifier that's virtually guaranteed to be unique across all time and space. It's represented as a 36-character string in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. UUIDs are used as primary keys in databases, unique identifiers in APIs, and for tracking objects across distributed systems."
  },
  {
    question: "What's the difference between UUID v1 and v4?",
    answer: "UUID v1 is generated using a timestamp and MAC address, making it time-ordered but potentially revealing information about when and where it was created. UUID v4 is completely random (122 bits of randomness), making it more secure but not time-ordered. UUID v4 is more commonly used today for its simplicity and privacy."
  },
  {
    question: "What's the difference between UUID and GUID?",
    answer: "UUID (Universally Unique Identifier) and GUID (Globally Unique Identifier) are effectively the same thing. GUID is Microsoft's term for UUID, commonly used in Windows and .NET. Both follow the same format and generation algorithms."
  },
  {
    question: "How unique are UUIDs really?",
    answer: "Extremely unique. The probability of generating two identical UUID v4s is about 1 in 5.3 × 10^36. To have a 50% chance of a collision, you'd need to generate about 2.71 quintillion UUIDs. For practical purposes, you can consider UUIDs unique."
  },
  {
    question: "Should I use UUIDs as database primary keys?",
    answer: "UUIDs work well for distributed systems and when security is important (unpredictable IDs). However, they're larger than auto-incrementing integers (16 bytes vs 4-8 bytes), can be slower to index, and make debugging harder. Consider your specific needs: UUID v4 for security, UUID v1/v7 for time-ordering, or auto-increment for simplicity."
  },
  {
    question: "What are the different UUID versions?",
    answer: "Version 1: timestamp + MAC address. Version 2: DCE security (rare). Version 3: MD5 hash of namespace + name. Version 4: random (most common). Version 5: SHA-1 hash of namespace + name. Version 6/7/8: newer standards for better database performance."
  },
];

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<string>("1");
  const [format, setFormat] = useState<"standard" | "uppercase" | "nohyphen" | "braces">("standard");
  const [copied, setCopied] = useState(false);

  const generateUUIDv4 = (): string => {
    // Generate UUID v4 using crypto API
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    
    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
    
    // Convert to hex string
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    
    // Format as UUID
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const formatUUID = (uuid: string): string => {
    switch (format) {
      case "uppercase":
        return uuid.toUpperCase();
      case "nohyphen":
        return uuid.replace(/-/g, "");
      case "braces":
        return `{${uuid}}`;
      default:
        return uuid;
    }
  };

  const generate = useCallback(() => {
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    const newUuids = Array.from({ length: num }, () => formatUUID(generateUUIDv4()));
    setUuids(newUuids);
  }, [count, format]);

  const addMore = () => {
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    const newUuids = Array.from({ length: num }, () => formatUUID(generateUUIDv4()));
    setUuids([...uuids, ...newUuids]);
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyOne = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const removeOne = (index: number) => {
    setUuids(uuids.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setUuids([]);
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUIDs (Universally Unique Identifiers) instantly. Create single or bulk UUID v4 identifiers with customizable formatting options. All UUIDs are generated locally using cryptographically secure random numbers."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Password Generator", href: "/password-generator" },
        { name: "Random Number Generator", href: "/random-number-generator" },
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "Hash Generator", href: "/hash-generator" },
      ]}
      content={
        <>
          <h2>What is a UUID?</h2>
          <p>
            A UUID (Universally Unique Identifier), also known as GUID (Globally Unique Identifier) in Microsoft systems, is a 128-bit identifier designed to be unique across all computers and time. UUIDs are represented as 32 hexadecimal digits, displayed in five groups separated by hyphens: 8-4-4-4-12.
          </p>
          <p>
            <strong>Example:</strong> <code>550e8400-e29b-41d4-a716-446655440000</code>
          </p>

          <h2>UUID Versions Explained</h2>
          
          <h3>UUID v1 - Time-based</h3>
          <p>
            Generated from a timestamp and MAC address. Useful when you need time-ordered identifiers, but reveals information about when and where the UUID was created.
          </p>
          <ul>
            <li>Time-ordered (can be sorted chronologically)</li>
            <li>Contains timestamp information</li>
            <li>Not ideal for security-sensitive applications</li>
          </ul>

          <h3>UUID v4 - Random (Most Common)</h3>
          <p>
            Generated entirely from random numbers (122 bits of randomness). This is the most commonly used version because it&apos;s simple, secure, and doesn&apos;t reveal any information.
          </p>
          <ul>
            <li>Completely random</li>
            <li>No timestamp or location information</li>
            <li>Used by this generator</li>
          </ul>

          <h3>UUID v5 - Name-based (SHA-1)</h3>
          <p>
            Generated by hashing a namespace identifier and a name. The same namespace + name always produces the same UUID, making it useful for deterministic UUID generation.
          </p>

          <h3>UUID v7 - Time-ordered Random (Newest)</h3>
          <p>
            A newer standard that combines timestamp ordering with random data. Better for database performance than v4 while still being secure. Gaining adoption in modern systems.
          </p>

          <h2>UUID Structure</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
│        │    │    │    │
│        │    │    │    └─ 12 random hex digits (48 bits)
│        │    │    └────── N = variant (8, 9, a, or b)
│        │    └─────────── M = version (1-5, 7)
│        └──────────────── 4 random hex digits
└───────────────────────── 8 random hex digits

Total: 32 hex digits + 4 hyphens = 36 characters`}</code>
          </pre>

          <h2>Common Use Cases</h2>
          
          <h3>Database Primary Keys</h3>
          <p>
            UUIDs are often used as primary keys in databases, especially in distributed systems where multiple nodes need to generate IDs without coordination.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`}</code>
          </pre>

          <h3>API Resource Identifiers</h3>
          <p>
            Using UUIDs for API resources makes URLs unpredictable, preventing enumeration attacks:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`// Predictable (bad for security)
GET /api/users/123

// Unpredictable (better)
GET /api/users/550e8400-e29b-41d4-a716-446655440000`}</code>
          </pre>

          <h3>File and Object Naming</h3>
          <p>
            UUIDs are useful for naming uploaded files or objects to avoid conflicts:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`// Instead of: photo.jpg (could conflict)
// Use: 550e8400-e29b-41d4-a716-446655440000.jpg`}</code>
          </pre>

          <h2>UUID vs Auto-Increment</h2>
          
          <h3>UUID Advantages</h3>
          <ul>
            <li>Can be generated anywhere without coordination</li>
            <li>Unpredictable (better security)</li>
            <li>Works across distributed systems</li>
            <li>No central authority needed</li>
          </ul>

          <h3>UUID Disadvantages</h3>
          <ul>
            <li>Larger storage (16 bytes vs 4-8 bytes)</li>
            <li>Slower to index than integers</li>
            <li>Harder to read and debug</li>
            <li>Not human-friendly for support tickets</li>
          </ul>

          <h2>UUID in Different Languages</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`// JavaScript
crypto.randomUUID();

// Python
import uuid
uuid.uuid4()

// Java
UUID.randomUUID()

// C# (.NET)
Guid.NewGuid()

// PHP
Str::uuid()  // Laravel
bin2hex(random_bytes(16))  // Manual`}</code>
          </pre>

          <h2>Collision Probability</h2>
          <p>
            UUID v4 has 122 random bits, giving about 5.3 × 10^36 possible values. The probability of generating two identical UUIDs is astronomically low:
          </p>
          <ul>
            <li>After 1 billion UUIDs: 0.00000000000000000000002% chance of collision</li>
            <li>To have 50% collision chance: need ~2.71 quintillion UUIDs</li>
            <li>For practical purposes, UUIDs are unique</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Number of UUIDs"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="100"
            placeholder="1"
          />
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="standard">Standard (lowercase)</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="nohyphen">No hyphens</option>
              <option value="braces">{"{braces}"}</option>
            </select>
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={generate} variant="primary" className="flex-1 sm:flex-none">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate UUIDs
          </Button>
          {uuids.length > 0 && (
            <>
              <Button onClick={addMore} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </Button>
              <Button onClick={copyAll} variant="outline">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied All" : "Copy All"}
              </Button>
              <Button onClick={clearAll} variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </>
          )}
        </div>

        {/* UUID List */}
        {uuids.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border overflow-hidden">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <code className="text-sm text-foreground font-mono select-all">
                  {uuid}
                </code>
                <div className="flex gap-1 shrink-0 ml-4">
                  <button
                    onClick={() => copyOne(uuid)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeOne(index)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* UUID Count */}
        {uuids.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {uuids.length} UUID{uuids.length !== 1 ? "s" : ""} generated
          </p>
        )}

        {/* Info Box */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            About UUID v4
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Generated using cryptographically secure random numbers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              122 bits of randomness = 5.3 × 10^36 possible values
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Collision probability is effectively zero
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              All processing happens locally in your browser
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
