"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Triangle, Calculator, Target, Info, CheckCircle } from "lucide-react";

interface PythagoreanResult {
  a: number;
  b: number;
  c: number;
  solved: "a" | "b" | "c";
  areaTriangle: number;
  perimeterTriangle: number;
  angleA: number;
  angleB: number;
  altitudeToHypotenuse: number;
  isPythagoreanTriple: boolean;
  tripleScaled: { a: number; b: number; c: number } | null;
}

function formatNumber(n: number, decimals: number = 4): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(decimals).replace(/\.?0+$/, "");
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function isPythagoreanTriple(a: number, b: number, c: number): boolean {
  if (!Number.isInteger(a) || !Number.isInteger(b) || !Number.isInteger(c)) return false;
  return a * a + b * b === c * c;
}

function getScaledTriple(a: number, b: number, c: number): { a: number; b: number; c: number } | null {
  const divisor = gcd(gcd(a, b), c);
  const scaledA = a / divisor;
  const scaledB = b / divisor;
  const scaledC = c / divisor;
  
  if (Number.isInteger(scaledA) && Number.isInteger(scaledB) && Number.isInteger(scaledC)) {
    if (scaledA * scaledA + scaledB * scaledB === scaledC * scaledC) {
      return { a: scaledA, b: scaledB, c: scaledC };
    }
  }
  return null;
}

function calculatePythagorean(
  mode: "findC" | "findA" | "findB",
  val1: number,
  val2: number
): PythagoreanResult | null {
  let a: number, b: number, c: number;
  let solved: "a" | "b" | "c";

  if (mode === "findC") {
    a = val1;
    b = val2;
    c = Math.sqrt(a * a + b * b);
    solved = "c";
  } else if (mode === "findA") {
    b = val1;
    c = val2;
    if (c <= b) return null;
    a = Math.sqrt(c * c - b * b);
    solved = "a";
  } else {
    a = val1;
    c = val2;
    if (c <= a) return null;
    b = Math.sqrt(c * c - a * a);
    solved = "b";
  }

  // Ensure a <= b for consistency
  if (a > b) [a, b] = [b, a];

  const areaTriangle = (a * b) / 2;
  const perimeterTriangle = a + b + c;
  const angleA = (Math.atan(a / b) * 180) / Math.PI;
  const angleB = 90 - angleA;
  const altitudeToHypotenuse = (a * b) / c;

  const isTriple = isPythagoreanTriple(Math.round(a), Math.round(b), Math.round(c));
  const tripleScaled = getScaledTriple(Math.round(a), Math.round(b), Math.round(c));

  return {
    a,
    b,
    c,
    solved,
    areaTriangle,
    perimeterTriangle,
    angleA,
    angleB,
    altitudeToHypotenuse,
    isPythagoreanTriple: isTriple,
    tripleScaled,
  };
}

export default function PythagoreanTheoremCalculatorPage() {
  const [mode, setMode] = useState<"findC" | "findA" | "findB">("findC");
  const [val1, setVal1] = useState("3");
  const [val2, setVal2] = useState("4");

  const result = useMemo(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2) || v1 <= 0 || v2 <= 0) return null;
    return calculatePythagorean(mode, v1, v2);
  }, [mode, val1, val2]);

  const getLabels = () => {
    if (mode === "findC") return { label1: "Side a", label2: "Side b", solving: "Hypotenuse c" };
    if (mode === "findA") return { label1: "Side b", label2: "Hypotenuse c", solving: "Side a" };
    return { label1: "Side a", label2: "Hypotenuse c", solving: "Side b" };
  };

  const labels = getLabels();

  const faqs = [
    {
      question: "What is the Pythagorean theorem?",
      answer:
        "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (the side opposite the right angle) equals the sum of the squares of the other two sides. The formula is a² + b² = c², where c is the hypotenuse and a and b are the two legs.",
    },
    {
      question: "How do you find the hypotenuse?",
      answer:
        "To find the hypotenuse (c) when you know both legs (a and b), use the formula c = √(a² + b²). For example, if a = 3 and b = 4, then c = √(9 + 16) = √25 = 5. This is the famous 3-4-5 right triangle.",
    },
    {
      question: "How do you find a missing leg?",
      answer:
        "To find a missing leg when you know the hypotenuse and one leg, rearrange the formula. If you know c and b, find a using a = √(c² - b²). The hypotenuse must be longer than either leg for a valid solution.",
    },
    {
      question: "What is a Pythagorean triple?",
      answer:
        "A Pythagorean triple is a set of three positive integers (a, b, c) that satisfy the equation a² + b² = c². Common examples include (3, 4, 5), (5, 12, 13), (8, 15, 17), and (7, 24, 25). Any multiple of a Pythagorean triple is also a triple.",
    },
    {
      question: "Does the Pythagorean theorem work for all triangles?",
      answer:
        "No, the Pythagorean theorem only applies to right triangles (triangles with a 90° angle). For other triangles, you need the Law of Cosines: c² = a² + b² - 2ab·cos(C), which generalizes the Pythagorean theorem.",
    },
    {
      question: "What are common Pythagorean triples to memorize?",
      answer:
        "The most common Pythagorean triples are: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), and (20, 21, 29). Multiples like (6, 8, 10) or (9, 12, 15) are also useful. These are frequently used in standardized tests and practical applications.",
    },
  ];

  const howToSteps = [
    {
      name: "Select what to calculate",
      text: "Choose whether you need to find the hypotenuse (c) or one of the legs (a or b).",
    },
    {
      name: "Enter the known values",
      text: "Input the two sides you know. For finding the hypotenuse, enter both legs. For finding a leg, enter the other leg and the hypotenuse.",
    },
    {
      name: "View the result",
      text: "The calculator instantly shows the missing side length along with the complete triangle visualization.",
    },
    {
      name: "Review additional properties",
      text: "Explore the triangle's area, perimeter, angles, and whether the sides form a Pythagorean triple.",
    },
    {
      name: "Apply to your problem",
      text: "Use the calculated values for construction, navigation, physics problems, or any application requiring right triangle calculations.",
    },
  ];

  const content = `
## The Pythagorean Theorem: A Cornerstone of Mathematics

The Pythagorean theorem is one of the most fundamental relationships in geometry, connecting the three sides of every right triangle. Our calculator helps you quickly solve for any missing side and provides additional insights about your triangle's properties.

### Understanding the Theorem

The Pythagorean theorem states that in any right triangle:

**a² + b² = c²**

Where:
- **a** and **b** are the two legs (the sides that form the right angle)
- **c** is the hypotenuse (the longest side, opposite the right angle)

This simple equation has profound implications and applications across mathematics, science, engineering, and everyday life.

### Historical Background

The theorem is named after the ancient Greek mathematician Pythagoras (c. 570–495 BCE), though evidence suggests the relationship was known to Babylonian mathematicians over 1,000 years earlier. The theorem appears in ancient Chinese, Indian, and Mesopotamian texts, making it one of the most widely discovered mathematical principles in human history.

Today, there are over 400 known proofs of the Pythagorean theorem, including algebraic proofs, geometric proofs, and even proofs using calculus. This abundance reflects the theorem's central importance to mathematics.

### How to Use the Formula

**Finding the Hypotenuse (c)**:
When you know both legs a and b:
- c = √(a² + b²)
- Example: If a = 5 and b = 12, then c = √(25 + 144) = √169 = 13

**Finding a Leg (a or b)**:
When you know the hypotenuse and one leg:
- a = √(c² - b²)
- b = √(c² - a²)
- Example: If c = 10 and b = 8, then a = √(100 - 64) = √36 = 6

### Pythagorean Triples

Pythagorean triples are sets of three positive integers that satisfy the theorem. These special combinations are useful because they produce exact integer results.

**Primitive Triples** (no common factors):
- (3, 4, 5) - The most famous triple
- (5, 12, 13)
- (8, 15, 17)
- (7, 24, 25)
- (20, 21, 29)
- (9, 40, 41)
- (12, 35, 37)
- (11, 60, 61)

**Generating Triples**:
For any integers m > n > 0, the formulas:
- a = m² - n²
- b = 2mn
- c = m² + n²

generate a Pythagorean triple. For m = 2, n = 1, we get the (3, 4, 5) triple.

### Real-World Applications

**Construction and Architecture**:
- Calculating roof pitches and rafter lengths
- Ensuring corners are square (the 3-4-5 method)
- Determining diagonal bracing lengths
- Planning staircases and ramps

**Navigation and Surveying**:
- Calculating distances in coordinate systems
- GPS positioning and triangulation
- Determining line-of-sight distances
- Measuring inaccessible distances

**Physics and Engineering**:
- Vector analysis and force decomposition
- Calculating resultant velocities
- Determining electrical impedance
- Analyzing structural forces

**Computer Graphics and Gaming**:
- Calculating distances between points
- Collision detection algorithms
- 3D rendering calculations
- Path-finding in games

**Everyday Life**:
- Determining TV screen sizes (diagonal measurement)
- Planning furniture placement
- Calculating travel distances
- Hanging pictures level

### The Distance Formula

The Pythagorean theorem extends directly to the distance formula in coordinate geometry:

**d = √[(x₂ - x₁)² + (y₂ - y₁)²]**

This formula calculates the straight-line distance between any two points (x₁, y₁) and (x₂, y₂) in a plane. It's essentially the Pythagorean theorem applied to the horizontal and vertical differences.

### 3D Extension

In three dimensions, the theorem extends to:

**d = √(a² + b² + c²)**

This calculates the space diagonal of a rectangular box or the distance between points in 3D space.

### The Converse Theorem

The converse of the Pythagorean theorem is equally important: If a² + b² = c² for the three sides of a triangle, then the triangle must be a right triangle. This property is used in construction to verify right angles.

**Angle Classifications**:
- If a² + b² = c²: Right triangle (90° angle)
- If a² + b² > c²: Acute triangle (all angles < 90°)
- If a² + b² < c²: Obtuse triangle (one angle > 90°)

### Special Right Triangles

Two special right triangles appear frequently in mathematics:

**45-45-90 Triangle** (Isoceles Right Triangle):
- Sides are in ratio 1 : 1 : √2
- If legs are both x, hypotenuse is x√2
- Common in squares and diagonal calculations

**30-60-90 Triangle**:
- Sides are in ratio 1 : √3 : 2
- If shortest side is x, middle side is x√3, hypotenuse is 2x
- Derived from equilateral triangles

### Common Mistakes to Avoid

**Confusing the hypotenuse**: The hypotenuse is always the longest side and opposite the right angle. It's always 'c' in the formula.

**Using for non-right triangles**: The theorem only works for right triangles. For other triangles, use the Law of Cosines.

**Forgetting to square**: Remember to square the values before adding, not add then square.

**Sign errors**: Since we're dealing with squares and square roots, all values must be positive.

### Calculator Features

Our Pythagorean theorem calculator provides:
- **Three calculation modes**: Find any missing side
- **Automatic validation**: Ensures the hypotenuse is longest
- **Triangle properties**: Area, perimeter, and angles
- **Triple detection**: Identifies Pythagorean triples
- **Altitude calculation**: Height to the hypotenuse
- **Visual representation**: See your triangle rendered

Whether you're a student learning geometry, a carpenter checking measurements, or an engineer analyzing structures, this calculator provides instant, accurate results for all your right triangle calculations.
  `;

  return (
    <ToolLayout
      title="Pythagorean Theorem Calculator"
      description="Calculate the missing side of a right triangle using the Pythagorean theorem (a² + b² = c²). Find the hypotenuse or legs instantly with full triangle analysis."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      faqs={faqs}
      howToSteps={howToSteps}
      content={content}
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "findC", label: "Find Hypotenuse (c)", desc: "Know a and b" },
            { id: "findA", label: "Find Leg (a)", desc: "Know b and c" },
            { id: "findB", label: "Find Leg (b)", desc: "Know a and c" },
          ].map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id as typeof mode)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                mode === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div>{label}</div>
              <div className={`text-xs ${mode === id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {desc}
              </div>
            </button>
          ))}
        </div>

        {/* Formula Display */}
        <div className="bg-muted/50 border border-border rounded-xl p-4">
          <div className="text-center">
            <span className="font-mono text-lg">
              {mode === "findC" && "c = √(a² + b²)"}
              {mode === "findA" && "a = √(c² - b²)"}
              {mode === "findB" && "b = √(c² - a²)"}
            </span>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Enter Known Values
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">{labels.label1}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{labels.label2}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter value"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Triangle className="w-5 h-5 text-primary" />
                {labels.solving}
              </h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatNumber(
                    result.solved === "c" ? result.c : result.solved === "a" ? result.a : result.b
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.solved === "c" && `c = √(${formatNumber(result.a)}² + ${formatNumber(result.b)}²)`}
                  {result.solved === "a" && `a = √(${formatNumber(result.c)}² - ${formatNumber(result.b)}²)`}
                  {result.solved === "b" && `b = √(${formatNumber(result.c)}² - ${formatNumber(result.a)}²)`}
                </div>
              </div>
            </div>

            {/* All Sides */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className={`bg-card border rounded-xl p-4 text-center ${result.solved === "a" ? "border-primary" : "border-border"}`}>
                <div className="text-sm text-muted-foreground mb-1">Side a</div>
                <div className="text-2xl font-bold">{formatNumber(result.a)}</div>
                {result.solved === "a" && (
                  <div className="text-xs text-primary mt-1">← Calculated</div>
                )}
              </div>
              <div className={`bg-card border rounded-xl p-4 text-center ${result.solved === "b" ? "border-primary" : "border-border"}`}>
                <div className="text-sm text-muted-foreground mb-1">Side b</div>
                <div className="text-2xl font-bold">{formatNumber(result.b)}</div>
                {result.solved === "b" && (
                  <div className="text-xs text-primary mt-1">← Calculated</div>
                )}
              </div>
              <div className={`bg-card border rounded-xl p-4 text-center ${result.solved === "c" ? "border-primary" : "border-border"}`}>
                <div className="text-sm text-muted-foreground mb-1">Hypotenuse c</div>
                <div className="text-2xl font-bold">{formatNumber(result.c)}</div>
                {result.solved === "c" && (
                  <div className="text-xs text-primary mt-1">← Calculated</div>
                )}
              </div>
            </div>

            {/* Triangle Properties */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Triangle Properties
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Area</div>
                  <div className="text-xl font-bold">{formatNumber(result.areaTriangle)}</div>
                  <div className="text-xs text-muted-foreground">square units</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Perimeter</div>
                  <div className="text-xl font-bold">{formatNumber(result.perimeterTriangle)}</div>
                  <div className="text-xs text-muted-foreground">units</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Altitude to c</div>
                  <div className="text-xl font-bold">{formatNumber(result.altitudeToHypotenuse)}</div>
                  <div className="text-xs text-muted-foreground">units</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Right Angle</div>
                  <div className="text-xl font-bold">90°</div>
                  <div className="text-xs text-muted-foreground">at vertex C</div>
                </div>
              </div>
            </div>

            {/* Angles */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Angles
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Angle A (opposite a)</div>
                  <div className="text-xl font-bold">{formatNumber(result.angleA)}°</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Angle B (opposite b)</div>
                  <div className="text-xl font-bold">{formatNumber(result.angleB)}°</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Angle C (right angle)</div>
                  <div className="text-xl font-bold">90°</div>
                </div>
              </div>
            </div>

            {/* Pythagorean Triple */}
            {result.isPythagoreanTriple && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">This is a Pythagorean Triple!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ({Math.round(result.a)}, {Math.round(result.b)}, {Math.round(result.c)}) are integers that satisfy a² + b² = c²
                </p>
                {result.tripleScaled && result.tripleScaled.a !== Math.round(result.a) && (
                  <p className="text-sm text-muted-foreground">
                    Primitive triple: ({result.tripleScaled.a}, {result.tripleScaled.b}, {result.tripleScaled.c})
                  </p>
                )}
              </div>
            )}

            {/* Visual Triangle */}
            <div className="bg-muted/50 border border-border rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Triangle Visualization</h3>
              <div className="flex justify-center">
                <svg viewBox="0 0 200 150" className="w-full max-w-md">
                  {/* Triangle */}
                  <polygon
                    points="20,130 180,130 20,30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  {/* Right angle indicator */}
                  <path
                    d="M 20,115 L 35,115 L 35,130"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-muted-foreground"
                  />
                  {/* Labels */}
                  <text x="100" y="145" textAnchor="middle" className="text-xs fill-current">
                    b = {formatNumber(result.b)}
                  </text>
                  <text x="5" y="80" textAnchor="middle" className="text-xs fill-current">
                    a = {formatNumber(result.a)}
                  </text>
                  <text x="110" y="75" textAnchor="middle" className="text-xs fill-current">
                    c = {formatNumber(result.c)}
                  </text>
                  {/* Vertices */}
                  <circle cx="20" cy="130" r="3" className="fill-primary" />
                  <circle cx="180" cy="130" r="3" className="fill-primary" />
                  <circle cx="20" cy="30" r="3" className="fill-primary" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
