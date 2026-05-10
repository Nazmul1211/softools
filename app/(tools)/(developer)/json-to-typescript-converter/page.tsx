"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Code2, Copy, Check } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How does the converter handle nested objects?",
    answer:
      "The converter recursively analyzes nested objects and creates interfaces for each level. For example, a user object with an address object will create both a User interface and an Address interface, with proper type references between them.",
  },
  {
    question: "What about arrays of objects?",
    answer:
      "Arrays of objects are detected and the generated type will use an array notation (T[]). If the array contains simple types (numbers, strings), it infers the primitive type. For arrays of objects, it creates an interface for the array element type.",
  },
  {
    question: "Can I customize the generated interface names?",
    answer:
      "The converter generates interface names based on your JSON structure. For root objects, you can manually rename them after generation. For nested properties, the converter capitalizes the property name to create the interface name (e.g., address becomes Address).",
  },
  {
    question: "Does it handle optional properties?",
    answer:
      "The converter marks all properties as required by default. To make properties optional in the generated TypeScript, manually add a ? after the property name in the interface (e.g., name?: string). In TypeScript, use Partial&lt;T&gt; to make all properties optional.",
  },
  {
    question: "What types does it support?",
    answer:
      "The converter supports: string, number, boolean, null, and objects. For complex types like Date or custom classes, you&apos;ll need to manually adjust the types after generation. Arrays are properly typed as T[] notation.",
  },
  {
    question: "Can I convert multiple JSON objects at once?",
    answer:
      "This tool converts one JSON object at a time. For multiple objects, convert them individually. If you have an array of objects, paste the array and the converter will create an interface for the array element type.",
  },
];

/* ────────────── Types ────────────── */

interface TypeInfo {
  type: "string" | "number" | "boolean" | "object" | "array" | "null" | "unknown";
  interfaceName?: string;
  isArray?: boolean;
  arrayOf?: string;
}

/* ────────────── Functions ────────────── */

function inferType(value: any): TypeInfo {
  if (value === null) {
    return { type: "null" };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: "array", arrayOf: "unknown" };
    }
    const firstElement = value[0];
    if (typeof firstElement === "object" && firstElement !== null) {
      return {
        type: "array",
        arrayOf: typeof firstElement === "object" ? "object" : typeof firstElement,
        isArray: true,
      };
    }
    return {
      type: "array",
      arrayOf: typeof firstElement,
      isArray: true,
    };
  }
  if (typeof value === "object") {
    return { type: "object" };
  }
  return { type: typeof value as any };
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateInterfaces(
  json: any,
  rootName: string = "Root"
): { interfaces: string[]; errors: string[] } {
  const interfaces: string[] = [];
  const errors: string[] = [];
  const seenInterfaces = new Set<string>();

  function generateInterface(obj: any, interfaceName: string): void {
    if (seenInterfaces.has(interfaceName)) {
      return;
    }
    seenInterfaces.add(interfaceName);

    if (typeof obj !== "object" || obj === null) {
      errors.push(`Cannot generate interface for non-object value: ${interfaceName}`);
      return;
    }

    const properties: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const typeInfo = inferType(value);

      if (typeInfo.type === "object") {
        const nestedInterfaceName = capitalizeFirstLetter(key);
        generateInterface(value, nestedInterfaceName);
        properties.push(`  ${key}: ${nestedInterfaceName};`);
      } else if (typeInfo.type === "array") {
        if (typeInfo.arrayOf === "object" && Array.isArray(value) && value.length > 0) {
          const nestedInterfaceName = capitalizeFirstLetter(key);
          generateInterface(value[0], nestedInterfaceName);
          properties.push(`  ${key}: ${nestedInterfaceName}[];`);
        } else {
          const arrayType = typeInfo.arrayOf || "unknown";
          properties.push(`  ${key}: ${arrayType}[];`);
        }
      } else if (typeInfo.type === "null") {
        properties.push(`  ${key}: null;`);
      } else {
        properties.push(`  ${key}: ${typeInfo.type};`);
      }
    }

    interfaces.push(`export interface ${interfaceName} {
${properties.join("\n")}
}`);
  }

  try {
    if (Array.isArray(json)) {
      if (json.length > 0) {
        generateInterface(json[0], rootName);
      }
    } else {
      generateInterface(json, rootName);
    }
  } catch (error) {
    errors.push(`Error generating interfaces: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { interfaces: interfaces.reverse(), errors };
}

/* ────────────────────── Component ────────────────────── */

export default function JSONToTypeScriptConverter() {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        isActive: true,
        address: {
          street: "123 Main St",
          city: "New York",
          zipCode: "10001",
        },
        tags: ["developer", "typescript"],
      },
      null,
      2
    )
  );

  const [rootInterfaceName, setRootInterfaceName] = useState<string>("User");
  const [copied, setCopied] = useState<boolean>(false);

  // Parse and generate TypeScript interfaces
  const { typeScriptOutput, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const { interfaces, errors } = generateInterfaces(parsed, rootInterfaceName);

      return {
        typeScriptOutput: interfaces.join("\n\n"),
        error: errors.length > 0 ? errors[0] : null,
      };
    } catch (e) {
      return {
        typeScriptOutput: "",
        error: e instanceof SyntaxError ? `Invalid JSON: ${e.message}` : "Unknown error",
      };
    }
  }, [jsonInput, rootInterfaceName]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typeScriptOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="JSON to TypeScript Converter"
      slug="json-to-typescript-converter"
      description="Convert JSON objects to strongly-typed TypeScript interfaces. Automatically generates interfaces for nested objects and arrays with proper typing."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Paste your JSON", text: "Enter valid JSON in the left panel. This can be a simple object or complex nested structure with arrays and nested objects." },
        { name: "Set interface name", text: "Enter the name for the root TypeScript interface. This becomes the main type exported from the generated code." },
        { name: "Review the output", text: "The right panel shows the generated TypeScript interfaces. Nested objects get their own interfaces automatically." },
        { name: "Copy to clipboard", text: "Click the Copy button to copy all generated interfaces. Paste them into your TypeScript project." },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "JSON Validator", href: "/json-validator" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "Regex Tester", href: "/regex-tester" },
        { name: "Color Converter", href: "/color-converter" },
      ]}
      content={
        <>
          <h2>What Is a JSON to TypeScript Converter?</h2>
          <p>
            A JSON to TypeScript converter analyzes JSON data and generates TypeScript interface definitions that match the structure. This eliminates manual type definition, ensures type safety, and enables IDE autocomplete and type checking. TypeScript uses these interfaces to validate that your code correctly uses API responses or data structures.
          </p>

          <h2>Why Use TypeScript Interfaces?</h2>
          <ul>
            <li><strong>Type safety:</strong> Catch errors at compile time, not runtime.</li>
            <li><strong>IDE support:</strong> Get autocomplete, inline documentation, and refactoring tools.</li>
            <li><strong>Self-documenting:</strong> Interfaces document the expected structure of data.</li>
            <li><strong>API contracts:</strong> Ensure API responses match expected types.</li>
            <li><strong>Refactoring safety:</strong> TypeScript warns when property names change.</li>
          </ul>

          <h2>Worked Example</h2>
          <p>
            Input JSON:
          </p>
          <pre><code>{`{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "posts": [
    {
      "title": "First Post",
      "content": "Hello world"
    }
  ]
}`}</code></pre>
          <p>
            Generated TypeScript:
          </p>
          <pre><code>{`export interface Posts {
  title: string;
  content: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  posts: Posts[];
}`}</code></pre>

          <h2>Understanding Generated Types</h2>
          <p>
            The converter infers types from JSON values:
          </p>
          <table>
            <thead>
              <tr>
                <th>JSON Value</th>
                <th>Inferred Type</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>&quot;text&quot;</td><td>string</td><td>name: string</td></tr>
              <tr><td>42</td><td>number</td><td>count: number</td></tr>
              <tr><td>true / false</td><td>boolean</td><td>active: boolean</td></tr>
              <tr><td>{}</td><td>object</td><td>address: Address</td></tr>
              <tr><td>[]</td><td>array</td><td>tags: string[]</td></tr>
              <tr><td>null</td><td>null</td><td>optional: null</td></tr>
            </tbody>
          </table>

          <h2>Handling Complex Structures</h2>
          <p>
            The converter handles:
          </p>
          <ul>
            <li><strong>Nested objects:</strong> Creates separate interfaces for each nesting level.</li>
            <li><strong>Arrays of primitives:</strong> Generates T[] notation (e.g., string[], number[]).</li>
            <li><strong>Arrays of objects:</strong> Creates interfaces for array elements.</li>
            <li><strong>Deep nesting:</strong> Recursively generates interfaces for all levels.</li>
            <li><strong>Naming:</strong> Uses property names to generate interface names (address → Address).</li>
          </ul>

          <h2>Limitations and Manual Adjustments</h2>
          <p>
            After generation, you may need to adjust:
          </p>
          <ul>
            <li><strong>Optional properties:</strong> Add ? suffix (e.g., nickname?: string)</li>
            <li><strong>Union types:</strong> For properties that can be multiple types (number | string)</li>
            <li><strong>Enums:</strong> For properties with fixed set of values</li>
            <li><strong>Date types:</strong> JSON represents dates as strings; manually change to Date type if needed</li>
            <li><strong>Generics:</strong> For reusable interfaces with type parameters</li>
          </ul>

          <h2>Best Practices</h2>
          <ul>
            <li><strong>Use representative data:</strong> Ensure JSON sample includes all possible properties.</li>
            <li><strong>Review generated names:</strong> Rename interfaces to match your naming conventions.</li>
            <li><strong>Add documentation:</strong> Use JSDoc comments above interfaces for clarity.</li>
            <li><strong>Use strict mode:</strong> Enable strict: true in tsconfig.json for strict type checking.</li>
            <li><strong>Handle edge cases:</strong> Manually add union types and optional properties.</li>
          </ul>

          <h2>TypeScript Features to Consider</h2>
          <ul>
            <li><strong>Readonly:</strong> Use readonly keyword for immutable properties</li>
            <li><strong>Utility types:</strong> Partial&lt;T&gt;, Pick&lt;T, K&gt;, Omit&lt;T, K&gt;</li>
            <li><strong>Intersection types:</strong> Combine multiple interfaces with &amp;</li>
            <li><strong>Generic constraints:</strong> Limit generic type parameters</li>
            <li><strong>Discriminated unions:</strong> For type-safe pattern matching</li>
          </ul>

          <h2>References</h2>
          <ul>
            <li>TypeScript Handbook: https://www.typescriptlang.org/docs/</li>
            <li>TypeScript Interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html</li>
            <li>JSON Specification: https://www.json.org/</li>
            <li>JSON Schema: https://json-schema.org/</li>
          </ul>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── JSON Input ── */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              JSON Input
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
              rows={20}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {jsonInput.length} characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Root Interface Name
            </label>
            <Input
              type="text"
              value={rootInterfaceName}
              onChange={(e) => setRootInterfaceName(e.target.value || "Root")}
              placeholder="User, Post, Response, etc."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This becomes the main exported interface name
            </p>
          </div>
        </div>

        {/* ── TypeScript Output ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              TypeScript Output
            </label>
            {typeScriptOutput && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-xs px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {error ? (
            <div className="rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </p>
            </div>
          ) : typeScriptOutput ? (
            <pre className="rounded-lg border border-border bg-muted/20 p-4 overflow-auto max-h-[600px] text-xs font-mono text-foreground whitespace-pre-wrap break-words">
              {typeScriptOutput}
            </pre>
          ) : (
            <div className="rounded-lg border border-border bg-muted/20 p-8 text-center text-muted-foreground min-h-[300px] flex items-center justify-center">
              <p className="text-sm">Enter valid JSON to generate TypeScript interfaces</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
