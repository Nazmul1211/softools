"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Circle,
  Square,
  Triangle,
  Hexagon,
  Calculator,
} from "lucide-react";

type ShapeType =
  | "rectangle"
  | "square"
  | "circle"
  | "triangle"
  | "trapezoid"
  | "ellipse"
  | "parallelogram"
  | "rhombus"
  | "sector";

interface ShapeConfig {
  name: string;
  icon: React.ReactNode;
  inputs: Array<{ id: string; label: string; placeholder: string }>;
  formula: string;
  calculate: (values: Record<string, number>) => number | null;
}

const SHAPES: Record<ShapeType, ShapeConfig> = {
  rectangle: {
    name: "Rectangle",
    icon: <Square className="h-5 w-5" />,
    inputs: [
      { id: "length", label: "Length", placeholder: "Enter length" },
      { id: "width", label: "Width", placeholder: "Enter width" },
    ],
    formula: "A = length × width",
    calculate: (v) => (v.length > 0 && v.width > 0 ? v.length * v.width : null),
  },
  square: {
    name: "Square",
    icon: <Square className="h-5 w-5" />,
    inputs: [{ id: "side", label: "Side Length", placeholder: "Enter side" }],
    formula: "A = side²",
    calculate: (v) => (v.side > 0 ? v.side * v.side : null),
  },
  circle: {
    name: "Circle",
    icon: <Circle className="h-5 w-5" />,
    inputs: [{ id: "radius", label: "Radius", placeholder: "Enter radius" }],
    formula: "A = π × r²",
    calculate: (v) => (v.radius > 0 ? Math.PI * v.radius * v.radius : null),
  },
  triangle: {
    name: "Triangle",
    icon: <Triangle className="h-5 w-5" />,
    inputs: [
      { id: "base", label: "Base", placeholder: "Enter base" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "A = ½ × base × height",
    calculate: (v) =>
      v.base > 0 && v.height > 0 ? 0.5 * v.base * v.height : null,
  },
  trapezoid: {
    name: "Trapezoid",
    icon: <Hexagon className="h-5 w-5" />,
    inputs: [
      { id: "base1", label: "Base 1 (a)", placeholder: "Enter first base" },
      { id: "base2", label: "Base 2 (b)", placeholder: "Enter second base" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "A = ½ × (a + b) × h",
    calculate: (v) =>
      v.base1 > 0 && v.base2 > 0 && v.height > 0
        ? 0.5 * (v.base1 + v.base2) * v.height
        : null,
  },
  ellipse: {
    name: "Ellipse",
    icon: <Circle className="h-5 w-5" />,
    inputs: [
      { id: "semiMajor", label: "Semi-Major Axis (a)", placeholder: "Enter a" },
      { id: "semiMinor", label: "Semi-Minor Axis (b)", placeholder: "Enter b" },
    ],
    formula: "A = π × a × b",
    calculate: (v) =>
      v.semiMajor > 0 && v.semiMinor > 0
        ? Math.PI * v.semiMajor * v.semiMinor
        : null,
  },
  parallelogram: {
    name: "Parallelogram",
    icon: <Square className="h-5 w-5" />,
    inputs: [
      { id: "base", label: "Base", placeholder: "Enter base" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "A = base × height",
    calculate: (v) => (v.base > 0 && v.height > 0 ? v.base * v.height : null),
  },
  rhombus: {
    name: "Rhombus",
    icon: <Square className="h-5 w-5 rotate-45" />,
    inputs: [
      { id: "d1", label: "Diagonal 1", placeholder: "Enter first diagonal" },
      { id: "d2", label: "Diagonal 2", placeholder: "Enter second diagonal" },
    ],
    formula: "A = ½ × d₁ × d₂",
    calculate: (v) => (v.d1 > 0 && v.d2 > 0 ? 0.5 * v.d1 * v.d2 : null),
  },
  sector: {
    name: "Circle Sector",
    icon: <Circle className="h-5 w-5" />,
    inputs: [
      { id: "radius", label: "Radius", placeholder: "Enter radius" },
      { id: "angle", label: "Angle (degrees)", placeholder: "Enter angle" },
    ],
    formula: "A = (θ/360) × π × r²",
    calculate: (v) =>
      v.radius > 0 && v.angle > 0
        ? (v.angle / 360) * Math.PI * v.radius * v.radius
        : null,
  },
};

function formatNumber(n: number): string {
  if (n >= 1000000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function AreaCalculatorPage() {
  const [shape, setShape] = useState<ShapeType>("rectangle");
  const [values, setValues] = useState<Record<string, string>>({});
  const [unit, setUnit] = useState("units");

  const currentShape = SHAPES[shape];

  const result = useMemo(() => {
    const numericValues: Record<string, number> = {};
    for (const input of currentShape.inputs) {
      numericValues[input.id] = parseFloat(values[input.id] || "0") || 0;
    }
    return currentShape.calculate(numericValues);
  }, [shape, values, currentShape]);

  const handleValueChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleShapeChange = (newShape: ShapeType) => {
    setShape(newShape);
    setValues({});
  };

  return (
    <ToolLayout
      title="Area Calculator"
      description="Calculate the area of any geometric shape including rectangles, circles, triangles, trapezoids, ellipses, and more. Get instant results with step-by-step formula breakdowns."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Volume Calculator", href: "/volume-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Square Root Calculator", href: "/square-root-calculator/" },
        { name: "Scientific Calculator", href: "/scientific-calculator/" },
      ]}
      howToSteps={[
        { name: "Select Shape", text: "Choose the geometric shape you want to calculate." },
        { name: "Enter Dimensions", text: "Input the required measurements for your shape." },
        { name: "Choose Unit", text: "Optionally select your measurement unit." },
        { name: "View Result", text: "See the calculated area with formula breakdown." },
      ]}
      faqs={[
        {
          question: "What is area and how is it measured?",
          answer: "Area is the amount of two-dimensional space inside a boundary. It's measured in square units—square meters (m²), square feet (ft²), square inches (in²), etc. To find area, you multiply two length measurements together, which is why the result is in 'squared' units.",
        },
        {
          question: "How do I calculate the area of an irregular shape?",
          answer: "For irregular shapes, divide them into regular shapes (rectangles, triangles, etc.), calculate each area separately, then add them together. Alternatively, use the grid method: overlay a grid and count full squares plus estimate partial squares. For curved irregular shapes, calculus integration is needed.",
        },
        {
          question: "What's the difference between area and perimeter?",
          answer: "Area measures the space inside a shape (square units), while perimeter measures the distance around the outside (linear units). For example, a room has an area in square feet (for flooring) and a perimeter in feet (for baseboards).",
        },
        {
          question: "Why is π (pi) used in circle area formulas?",
          answer: "Pi (π ≈ 3.14159) is the ratio of a circle's circumference to its diameter. It appears in circle area (πr²) because the area of a circle is exactly π times the area of a square built on the radius. This mathematical constant is fundamental to all circular geometry.",
        },
      ]}
      content={
        <>
          <h2>Understanding Area Calculations</h2>
          <p>
            Area is a fundamental measurement in geometry that tells us how much two-dimensional space a shape occupies. Whether you're calculating flooring for a room, sizing a garden bed, or solving geometry homework, understanding area formulas is essential.
          </p>
          <p>
            The key insight is that area is always measured in <strong>square units</strong>—square meters, square feet, square inches, acres, or hectares. This is because area represents a two-dimensional measurement (length × width), unlike perimeter which is one-dimensional.
          </p>

          <h2>Area Formulas for Common Shapes</h2>

          <h3>Rectangle and Square</h3>
          <p>
            The simplest area calculation is for rectangles: multiply length by width (A = l × w). A square is just a special rectangle where all sides are equal, so A = s². These formulas form the foundation for understanding area—imagine filling the shape with unit squares.
          </p>

          <h3>Triangle</h3>
          <p>
            A triangle's area is half of a rectangle with the same base and height: A = ½ × b × h. The height must be perpendicular to the base—it's the straight-line distance, not along a sloped side. This works for any triangle: scalene, isosceles, or equilateral.
          </p>

          <h3>Circle</h3>
          <p>
            The circle area formula A = πr² comes from calculus, but intuitively: if you cut a circle into thin wedges and rearrange them, they form a shape approaching a rectangle with width πr and height r, giving area πr². This explains why π appears in circle measurements.
          </p>

          <h3>Trapezoid</h3>
          <p>
            A trapezoid has two parallel sides (bases) of different lengths. The area formula A = ½(a + b) × h averages the bases and multiplies by height. This also works for rectangles (where a = b) and triangles (where one base is 0).
          </p>

          <h2>Practical Applications of Area</h2>
          <ul>
            <li><strong>Home Improvement:</strong> Calculate paint, flooring, wallpaper, or tile needed</li>
            <li><strong>Landscaping:</strong> Determine mulch, sod, or seed quantities for gardens</li>
            <li><strong>Real Estate:</strong> Understand property sizes, lot coverage, floor plans</li>
            <li><strong>Construction:</strong> Estimate materials for roofing, siding, concrete</li>
            <li><strong>Agriculture:</strong> Calculate field sizes, irrigation coverage, crop yields</li>
          </ul>

          <h2>Tips for Accurate Area Calculations</h2>
          <p>
            <strong>1. Use consistent units.</strong> Convert all measurements to the same unit before calculating. Mixing feet and inches leads to errors.
          </p>
          <p>
            <strong>2. Measure twice.</strong> Small measurement errors get squared in area calculations, magnifying mistakes.
          </p>
          <p>
            <strong>3. Break down complex shapes.</strong> Divide irregular areas into rectangles, triangles, and other simple shapes, calculate each, then sum.
          </p>
          <p>
            <strong>4. Add waste factor.</strong> For materials like flooring or fabric, add 10-15% extra for cuts, mistakes, and pattern matching.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Shape Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Select Shape
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
            {(Object.keys(SHAPES) as ShapeType[]).map((key) => (
              <button
                key={key}
                onClick={() => handleShapeChange(key)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition-all ${
                  shape === key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted"
                }`}
              >
                {SHAPES[key].icon}
                <span className="text-center">{SHAPES[key].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {currentShape.name} Dimensions
            </h3>
            <div>
              <label className="mr-2 text-sm text-muted-foreground">Unit:</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
              >
                <option value="units">Units</option>
                <option value="m">Meters (m)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
                <option value="yd">Yards (yd)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentShape.inputs.map((input) => (
              <div key={input.id}>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  {input.label}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={values[input.id] || ""}
                    onChange={(e) => handleValueChange(input.id, e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full rounded-l-lg border border-r-0 border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                  <span className="flex items-center rounded-r-lg border border-border bg-muted px-3 text-sm text-muted-foreground">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Formula:</strong>{" "}
              <span className="font-mono">{currentShape.formula}</span>
            </p>
          </div>
        </div>

        {/* Result Section */}
        {result !== null && (
          <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Area of {currentShape.name}</p>
            <p className="text-4xl font-bold text-primary">
              {formatNumber(result)} {unit}²
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {currentShape.formula.replace("A = ", "")} = {formatNumber(result)}
            </p>
          </div>
        )}

        {/* Quick Reference */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Area Formulas Quick Reference</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Square className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Rectangle</p>
                <p className="font-mono text-muted-foreground">A = l × w</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Square className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Square</p>
                <p className="font-mono text-muted-foreground">A = s²</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Circle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Circle</p>
                <p className="font-mono text-muted-foreground">A = πr²</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Triangle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Triangle</p>
                <p className="font-mono text-muted-foreground">A = ½bh</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Hexagon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Trapezoid</p>
                <p className="font-mono text-muted-foreground">A = ½(a+b)h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Circle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Ellipse</p>
                <p className="font-mono text-muted-foreground">A = πab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
