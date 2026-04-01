"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Triangle, Calculator, Target, Info, Ruler } from "lucide-react";

interface TriangleResult {
  a: number;
  b: number;
  c: number;
  angleA: number;
  angleB: number;
  angleC: number;
  area: number;
  perimeter: number;
  semiperimeter: number;
  inradius: number;
  circumradius: number;
  altitudeA: number;
  altitudeB: number;
  altitudeC: number;
  medianA: number;
  medianB: number;
  medianC: number;
  type: string;
  angleType: string;
  isValid: boolean;
}

function formatNumber(n: number, decimals: number = 4): string {
  if (!isFinite(n)) return "N/A";
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(decimals).replace(/\.?0+$/, "");
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function calculateTriangleFromSSS(a: number, b: number, c: number): TriangleResult | null {
  // Check triangle inequality
  if (a + b <= c || a + c <= b || b + c <= a) return null;
  if (a <= 0 || b <= 0 || c <= 0) return null;

  // Law of cosines to find angles
  const angleA = toDegrees(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  const angleB = toDegrees(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
  const angleC = 180 - angleA - angleB;

  return computeTriangleProperties(a, b, c, angleA, angleB, angleC);
}

function calculateTriangleFromSAS(a: number, angleC: number, b: number): TriangleResult | null {
  if (a <= 0 || b <= 0 || angleC <= 0 || angleC >= 180) return null;

  // Law of cosines to find third side
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(toRadians(angleC)));
  
  // Law of sines to find other angles
  const angleA = toDegrees(Math.asin((a * Math.sin(toRadians(angleC))) / c));
  const angleB = 180 - angleA - angleC;

  if (!isFinite(angleA) || !isFinite(angleB)) return null;

  return computeTriangleProperties(a, b, c, angleA, angleB, angleC);
}

function calculateTriangleFromASA(angleA: number, c: number, angleB: number): TriangleResult | null {
  const angleC = 180 - angleA - angleB;
  if (angleC <= 0 || angleA <= 0 || angleB <= 0 || c <= 0) return null;

  // Law of sines to find other sides
  const sinRatio = c / Math.sin(toRadians(angleC));
  const a = sinRatio * Math.sin(toRadians(angleA));
  const b = sinRatio * Math.sin(toRadians(angleB));

  return computeTriangleProperties(a, b, c, angleA, angleB, angleC);
}

function calculateTriangleFromAAS(angleA: number, angleB: number, a: number): TriangleResult | null {
  const angleC = 180 - angleA - angleB;
  if (angleC <= 0 || angleA <= 0 || angleB <= 0 || a <= 0) return null;

  // Law of sines
  const sinRatio = a / Math.sin(toRadians(angleA));
  const b = sinRatio * Math.sin(toRadians(angleB));
  const c = sinRatio * Math.sin(toRadians(angleC));

  return computeTriangleProperties(a, b, c, angleA, angleB, angleC);
}

function computeTriangleProperties(
  a: number, b: number, c: number,
  angleA: number, angleB: number, angleC: number
): TriangleResult {
  const perimeter = a + b + c;
  const semiperimeter = perimeter / 2;
  
  // Heron's formula for area
  const area = Math.sqrt(
    semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)
  );

  // Inradius: r = Area / s
  const inradius = area / semiperimeter;

  // Circumradius: R = abc / (4 * Area)
  const circumradius = (a * b * c) / (4 * area);

  // Altitudes: h = 2 * Area / base
  const altitudeA = (2 * area) / a;
  const altitudeB = (2 * area) / b;
  const altitudeC = (2 * area) / c;

  // Medians: m_a = 0.5 * sqrt(2b² + 2c² - a²)
  const medianA = 0.5 * Math.sqrt(2 * b * b + 2 * c * c - a * a);
  const medianB = 0.5 * Math.sqrt(2 * a * a + 2 * c * c - b * b);
  const medianC = 0.5 * Math.sqrt(2 * a * a + 2 * b * b - c * c);

  // Determine triangle type by sides
  let type = "Scalene";
  if (Math.abs(a - b) < 0.0001 && Math.abs(b - c) < 0.0001) {
    type = "Equilateral";
  } else if (Math.abs(a - b) < 0.0001 || Math.abs(b - c) < 0.0001 || Math.abs(a - c) < 0.0001) {
    type = "Isosceles";
  }

  // Determine triangle type by angles
  let angleType = "Acute";
  const maxAngle = Math.max(angleA, angleB, angleC);
  if (Math.abs(maxAngle - 90) < 0.01) {
    angleType = "Right";
  } else if (maxAngle > 90) {
    angleType = "Obtuse";
  }

  return {
    a, b, c,
    angleA, angleB, angleC,
    area, perimeter, semiperimeter,
    inradius, circumradius,
    altitudeA, altitudeB, altitudeC,
    medianA, medianB, medianC,
    type, angleType,
    isValid: true,
  };
}

type CalculationMode = "SSS" | "SAS" | "ASA" | "AAS";

export default function TriangleCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("SSS");
  const [values, setValues] = useState({
    a: "5", b: "6", c: "7",
    angleA: "60", angleB: "60", angleC: "60"
  });

  const result = useMemo(() => {
    const a = parseFloat(values.a);
    const b = parseFloat(values.b);
    const c = parseFloat(values.c);
    const angleA = parseFloat(values.angleA);
    const angleB = parseFloat(values.angleB);
    const angleC = parseFloat(values.angleC);

    switch (mode) {
      case "SSS":
        if ([a, b, c].some(isNaN)) return null;
        return calculateTriangleFromSSS(a, b, c);
      case "SAS":
        if ([a, angleC, b].some(isNaN)) return null;
        return calculateTriangleFromSAS(a, angleC, b);
      case "ASA":
        if ([angleA, c, angleB].some(isNaN)) return null;
        return calculateTriangleFromASA(angleA, c, angleB);
      case "AAS":
        if ([angleA, angleB, a].some(isNaN)) return null;
        return calculateTriangleFromAAS(angleA, angleB, a);
      default:
        return null;
    }
  }, [mode, values]);

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const faqs = [
    {
      question: "What is the triangle inequality theorem?",
      answer:
        "The triangle inequality theorem states that the sum of any two sides of a triangle must be greater than the third side. If a, b, and c are the sides, then a + b > c, a + c > b, and b + c > a must all be true for a valid triangle.",
    },
    {
      question: "What do SSS, SAS, ASA, and AAS mean?",
      answer:
        "These are congruence postulates: SSS (Side-Side-Side) uses all three sides; SAS (Side-Angle-Side) uses two sides and the included angle; ASA (Angle-Side-Angle) uses two angles and the included side; AAS (Angle-Angle-Side) uses two angles and a non-included side.",
    },
    {
      question: "How do you calculate the area of a triangle?",
      answer:
        "There are multiple methods: base × height / 2; Heron's formula: √[s(s-a)(s-b)(s-c)] where s is the semi-perimeter; or ½ab×sin(C) using two sides and the included angle.",
    },
    {
      question: "What is the difference between acute, right, and obtuse triangles?",
      answer:
        "An acute triangle has all angles less than 90°. A right triangle has one angle exactly 90°. An obtuse triangle has one angle greater than 90°. Every triangle must have angles that sum to exactly 180°.",
    },
    {
      question: "What is the circumradius and inradius?",
      answer:
        "The circumradius (R) is the radius of the circle that passes through all three vertices (circumscribed circle). The inradius (r) is the radius of the largest circle that fits inside the triangle (inscribed circle).",
    },
    {
      question: "How do you find a triangle's altitude?",
      answer:
        "The altitude (height) from a vertex perpendicular to the opposite side can be found using: h = 2 × Area / base. Each triangle has three altitudes, one from each vertex.",
    },
  ];

  const howToSteps = [
    {
      name: "Choose calculation method",
      text: "Select SSS (three sides), SAS (two sides and included angle), ASA (two angles and included side), or AAS (two angles and a side).",
    },
    {
      name: "Enter known values",
      text: "Input the measurements you know. For sides, enter lengths. For angles, enter degrees between 0 and 180.",
    },
    {
      name: "View calculated triangle",
      text: "See all sides, angles, and the triangle type (scalene, isosceles, or equilateral; acute, right, or obtuse).",
    },
    {
      name: "Explore properties",
      text: "Review area, perimeter, altitudes, medians, inradius, and circumradius for complete triangle analysis.",
    },
    {
      name: "Apply results",
      text: "Use the calculated values for geometry problems, construction, engineering, or design applications.",
    },
  ];

  const content = `
## Complete Triangle Calculator: Solve Any Triangle

This comprehensive triangle calculator solves triangles using any valid combination of sides and angles. Whether you know three sides (SSS), two sides and an angle (SAS), or two angles and a side (ASA/AAS), this tool calculates all remaining measurements plus area, perimeter, altitudes, medians, and more.

### Understanding Triangle Calculation Methods

**SSS (Side-Side-Side)**: When you know all three side lengths, the triangle is uniquely determined. The calculator uses the Law of Cosines to find all angles.

**SAS (Side-Angle-Side)**: When you know two sides and the angle between them (included angle), the Law of Cosines finds the third side, then the Law of Sines finds the remaining angles.

**ASA (Angle-Side-Angle)**: When you know two angles and the side between them, the third angle is 180° minus the other two. The Law of Sines then finds the remaining sides.

**AAS (Angle-Angle-Side)**: Similar to ASA, but the known side is not between the known angles. The same laws apply to solve the triangle.

### The Law of Cosines

The Law of Cosines generalizes the Pythagorean theorem to all triangles:

**c² = a² + b² - 2ab·cos(C)**

This formula relates any side to the other two sides and their included angle. It's essential for SSS and SAS calculations. When angle C equals 90°, the formula reduces to the Pythagorean theorem since cos(90°) = 0.

### The Law of Sines

The Law of Sines establishes a proportion between sides and their opposite angles:

**a/sin(A) = b/sin(B) = c/sin(C) = 2R**

Where R is the circumradius. This law is fundamental for ASA, AAS, and finding missing angles in SAS problems.

### Triangle Types by Sides

**Equilateral**: All three sides are equal (a = b = c). All angles are 60°. This is the most symmetric triangle.

**Isosceles**: Two sides are equal. The angles opposite equal sides are also equal. Many geometric proofs use isosceles triangles.

**Scalene**: All three sides have different lengths. All three angles are different. This is the most general triangle type.

### Triangle Types by Angles

**Acute Triangle**: All angles are less than 90°. For sides a ≤ b ≤ c, we have a² + b² > c².

**Right Triangle**: One angle equals exactly 90°. The Pythagorean theorem applies: a² + b² = c².

**Obtuse Triangle**: One angle exceeds 90°. For the largest side c, we have a² + b² < c².

### Area Formulas

**Base and Height**: Area = ½ × base × height. The most intuitive formula, requiring perpendicular height.

**Heron's Formula**: Area = √[s(s-a)(s-b)(s-c)], where s = (a+b+c)/2 is the semi-perimeter. Works with just the three sides.

**Two Sides and Included Angle**: Area = ½ × a × b × sin(C). Useful when you know SAS.

**Using Circumradius**: Area = abc/(4R). Relates area to sides and circumradius.

**Using Inradius**: Area = r × s, where r is inradius and s is semi-perimeter.

### Special Points and Circles

**Centroid**: The intersection of medians. Located at the "center of mass" of the triangle, dividing each median in a 2:1 ratio.

**Circumcenter**: The center of the circumscribed circle (circumcircle). Equidistant from all three vertices.

**Incenter**: The center of the inscribed circle (incircle). Equidistant from all three sides.

**Orthocenter**: The intersection of altitudes. Location depends on triangle type (inside for acute, on vertex for right, outside for obtuse).

### Altitudes, Medians, and Perpendicular Bisectors

**Altitudes**: Perpendicular segments from each vertex to the opposite side. Height formulas: h_a = 2·Area/a.

**Medians**: Segments from each vertex to the midpoint of the opposite side. Formula: m_a = ½√(2b² + 2c² - a²).

**Perpendicular Bisectors**: Lines through side midpoints perpendicular to that side. They meet at the circumcenter.

### Real-World Applications

**Architecture and Construction**: Triangles provide structural stability. Roof trusses, bridges, and building frames rely on triangular geometry.

**Navigation and Surveying**: Triangulation determines positions by measuring angles to known points. GPS uses similar principles in 3D.

**Engineering**: Stress analysis, force decomposition, and structural design all use triangle calculations.

**Computer Graphics**: 3D models consist of triangular meshes. Triangle calculations are fundamental to rendering.

**Art and Design**: Triangular compositions create visual interest. The golden triangle appears in classical art.

### The Triangle Inequality

For any valid triangle with sides a, b, c:
- a + b > c
- a + c > b  
- b + c > a

If any inequality fails, the sides cannot form a triangle. This calculator validates inputs automatically.

### Common Angle Relationships

**Sum of Angles**: A + B + C = 180° for any triangle.

**Exterior Angles**: An exterior angle equals the sum of the two non-adjacent interior angles.

**Largest Side vs. Angle**: The largest side is always opposite the largest angle.

### Special Triangles

**30-60-90 Triangle**: Sides in ratio 1 : √3 : 2. Half of an equilateral triangle.

**45-45-90 Triangle**: Sides in ratio 1 : 1 : √2. Half of a square.

**3-4-5 Triangle**: The simplest right triangle with integer sides.

**Golden Triangle**: Isosceles triangle with sides in golden ratio (1.618...).

### Using This Calculator

Enter your known values based on the selected method:
- **SSS**: All three side lengths
- **SAS**: Two sides and the angle between them
- **ASA**: Two angles and the side between them
- **AAS**: Two angles and any side

The calculator instantly provides all remaining values, including area, perimeter, all altitudes, all medians, inradius, circumradius, and classifications.

Whether you're solving geometry homework, designing structures, or analyzing spatial relationships, this triangle calculator provides complete solutions for any valid triangle configuration.
  `;

  return (
    <ToolLayout
      title="Triangle Calculator"
      description="Solve any triangle by entering sides and/or angles. Calculate area, perimeter, altitudes, medians, inradius, circumradius, and determine triangle type."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      faqs={faqs}
      howToSteps={howToSteps}
      content={content}
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "SSS", label: "SSS", desc: "3 sides" },
            { id: "SAS", label: "SAS", desc: "2 sides + included angle" },
            { id: "ASA", label: "ASA", desc: "2 angles + included side" },
            { id: "AAS", label: "AAS", desc: "2 angles + any side" },
          ].map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id as CalculationMode)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                mode === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div className="font-bold">{label}</div>
              <div className={`text-xs ${mode === id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {desc}
              </div>
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Enter Known Values
          </h2>

          {mode === "SSS" && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Side a</label>
                <input
                  type="number" min="0" step="any"
                  value={values.a}
                  onChange={(e) => updateValue("a", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Side b</label>
                <input
                  type="number" min="0" step="any"
                  value={values.b}
                  onChange={(e) => updateValue("b", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Side c</label>
                <input
                  type="number" min="0" step="any"
                  value={values.c}
                  onChange={(e) => updateValue("c", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {mode === "SAS" && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Side a</label>
                <input
                  type="number" min="0" step="any"
                  value={values.a}
                  onChange={(e) => updateValue("a", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Angle C (between a and b)</label>
                <input
                  type="number" min="0" max="180" step="any"
                  value={values.angleC}
                  onChange={(e) => updateValue("angleC", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="degrees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Side b</label>
                <input
                  type="number" min="0" step="any"
                  value={values.b}
                  onChange={(e) => updateValue("b", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {mode === "ASA" && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Angle A</label>
                <input
                  type="number" min="0" max="180" step="any"
                  value={values.angleA}
                  onChange={(e) => updateValue("angleA", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="degrees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Side c (between A and B)</label>
                <input
                  type="number" min="0" step="any"
                  value={values.c}
                  onChange={(e) => updateValue("c", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Angle B</label>
                <input
                  type="number" min="0" max="180" step="any"
                  value={values.angleB}
                  onChange={(e) => updateValue("angleB", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="degrees"
                />
              </div>
            </div>
          )}

          {mode === "AAS" && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Angle A</label>
                <input
                  type="number" min="0" max="180" step="any"
                  value={values.angleA}
                  onChange={(e) => updateValue("angleA", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="degrees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Angle B</label>
                <input
                  type="number" min="0" max="180" step="any"
                  value={values.angleB}
                  onChange={(e) => updateValue("angleB", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="degrees"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Side a (opposite angle A)</label>
                <input
                  type="number" min="0" step="any"
                  value={values.a}
                  onChange={(e) => updateValue("a", e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result ? (
          <div className="space-y-6">
            {/* Triangle Type */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Triangle className="w-5 h-5 text-primary" />
                    Triangle Type
                  </h2>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {result.type} {result.angleType} Triangle
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Valid Triangle</div>
                  <div className="text-lg font-medium text-green-600">✓ Yes</div>
                </div>
              </div>
            </div>

            {/* Sides and Angles */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-primary" />
                  Sides
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Side a:</span>
                    <span className="font-bold">{formatNumber(result.a)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side b:</span>
                    <span className="font-bold">{formatNumber(result.b)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side c:</span>
                    <span className="font-bold">{formatNumber(result.c)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Angles
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Angle A (opposite a):</span>
                    <span className="font-bold">{formatNumber(result.angleA)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Angle B (opposite b):</span>
                    <span className="font-bold">{formatNumber(result.angleB)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Angle C (opposite c):</span>
                    <span className="font-bold">{formatNumber(result.angleC)}°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Area and Perimeter */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Area</div>
                <div className="text-2xl font-bold text-primary">{formatNumber(result.area)}</div>
                <div className="text-xs text-muted-foreground">square units</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Perimeter</div>
                <div className="text-2xl font-bold">{formatNumber(result.perimeter)}</div>
                <div className="text-xs text-muted-foreground">units</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Inradius (r)</div>
                <div className="text-2xl font-bold">{formatNumber(result.inradius)}</div>
                <div className="text-xs text-muted-foreground">inscribed circle</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Circumradius (R)</div>
                <div className="text-2xl font-bold">{formatNumber(result.circumradius)}</div>
                <div className="text-xs text-muted-foreground">circumscribed circle</div>
              </div>
            </div>

            {/* Altitudes and Medians */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Altitudes (Heights)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Altitude to side a:</span>
                    <span className="font-bold">{formatNumber(result.altitudeA)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Altitude to side b:</span>
                    <span className="font-bold">{formatNumber(result.altitudeB)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Altitude to side c:</span>
                    <span className="font-bold">{formatNumber(result.altitudeC)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Medians
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Median to side a:</span>
                    <span className="font-bold">{formatNumber(result.medianA)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Median to side b:</span>
                    <span className="font-bold">{formatNumber(result.medianB)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Median to side c:</span>
                    <span className="font-bold">{formatNumber(result.medianC)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
            <p className="text-destructive font-medium">
              Invalid triangle. Please check your values and ensure they form a valid triangle.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Remember: The sum of any two sides must be greater than the third side, and angles must sum to 180°.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
