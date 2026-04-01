"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Box,
  Circle,
  Triangle,
  Calculator,
  Cylinder,
} from "lucide-react";

type ShapeType =
  | "cube"
  | "rectangular"
  | "sphere"
  | "cylinder"
  | "cone"
  | "pyramid"
  | "hemisphere"
  | "prism"
  | "torus";

interface ShapeConfig {
  name: string;
  icon: React.ReactNode;
  inputs: Array<{ id: string; label: string; placeholder: string }>;
  formula: string;
  calculate: (values: Record<string, number>) => number | null;
}

const SHAPES: Record<ShapeType, ShapeConfig> = {
  cube: {
    name: "Cube",
    icon: <Box className="h-5 w-5" />,
    inputs: [{ id: "side", label: "Side Length", placeholder: "Enter side" }],
    formula: "V = s³",
    calculate: (v) => (v.side > 0 ? Math.pow(v.side, 3) : null),
  },
  rectangular: {
    name: "Rectangular Prism",
    icon: <Box className="h-5 w-5" />,
    inputs: [
      { id: "length", label: "Length", placeholder: "Enter length" },
      { id: "width", label: "Width", placeholder: "Enter width" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "V = l × w × h",
    calculate: (v) =>
      v.length > 0 && v.width > 0 && v.height > 0
        ? v.length * v.width * v.height
        : null,
  },
  sphere: {
    name: "Sphere",
    icon: <Circle className="h-5 w-5" />,
    inputs: [{ id: "radius", label: "Radius", placeholder: "Enter radius" }],
    formula: "V = (4/3)πr³",
    calculate: (v) =>
      v.radius > 0 ? (4 / 3) * Math.PI * Math.pow(v.radius, 3) : null,
  },
  cylinder: {
    name: "Cylinder",
    icon: <Cylinder className="h-5 w-5" />,
    inputs: [
      { id: "radius", label: "Radius", placeholder: "Enter radius" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "V = πr²h",
    calculate: (v) =>
      v.radius > 0 && v.height > 0
        ? Math.PI * Math.pow(v.radius, 2) * v.height
        : null,
  },
  cone: {
    name: "Cone",
    icon: <Triangle className="h-5 w-5" />,
    inputs: [
      { id: "radius", label: "Radius", placeholder: "Enter radius" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "V = (1/3)πr²h",
    calculate: (v) =>
      v.radius > 0 && v.height > 0
        ? (1 / 3) * Math.PI * Math.pow(v.radius, 2) * v.height
        : null,
  },
  pyramid: {
    name: "Rectangular Pyramid",
    icon: <Triangle className="h-5 w-5" />,
    inputs: [
      { id: "length", label: "Base Length", placeholder: "Enter length" },
      { id: "width", label: "Base Width", placeholder: "Enter width" },
      { id: "height", label: "Height", placeholder: "Enter height" },
    ],
    formula: "V = (1/3) × l × w × h",
    calculate: (v) =>
      v.length > 0 && v.width > 0 && v.height > 0
        ? (1 / 3) * v.length * v.width * v.height
        : null,
  },
  hemisphere: {
    name: "Hemisphere",
    icon: <Circle className="h-5 w-5" />,
    inputs: [{ id: "radius", label: "Radius", placeholder: "Enter radius" }],
    formula: "V = (2/3)πr³",
    calculate: (v) =>
      v.radius > 0 ? (2 / 3) * Math.PI * Math.pow(v.radius, 3) : null,
  },
  prism: {
    name: "Triangular Prism",
    icon: <Triangle className="h-5 w-5" />,
    inputs: [
      { id: "base", label: "Triangle Base", placeholder: "Enter base" },
      { id: "triangleHeight", label: "Triangle Height", placeholder: "Enter triangle height" },
      { id: "length", label: "Prism Length", placeholder: "Enter prism length" },
    ],
    formula: "V = (1/2) × b × h × l",
    calculate: (v) =>
      v.base > 0 && v.triangleHeight > 0 && v.length > 0
        ? 0.5 * v.base * v.triangleHeight * v.length
        : null,
  },
  torus: {
    name: "Torus (Donut)",
    icon: <Circle className="h-5 w-5" />,
    inputs: [
      { id: "majorRadius", label: "Major Radius (R)", placeholder: "Distance to center of tube" },
      { id: "minorRadius", label: "Minor Radius (r)", placeholder: "Tube radius" },
    ],
    formula: "V = 2π²Rr²",
    calculate: (v) =>
      v.majorRadius > 0 && v.minorRadius > 0
        ? 2 * Math.PI * Math.PI * v.majorRadius * Math.pow(v.minorRadius, 2)
        : null,
  },
};

function formatNumber(n: number): string {
  if (n >= 1000000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function VolumeCalculatorPage() {
  const [shape, setShape] = useState<ShapeType>("rectangular");
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
      title="Volume Calculator"
      description="Calculate the volume of any 3D shape including cubes, spheres, cylinders, cones, pyramids, and more. Get instant results with step-by-step formula breakdowns."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Area Calculator", href: "/area-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Square Root Calculator", href: "/square-root-calculator/" },
        { name: "Scientific Calculator", href: "/scientific-calculator/" },
      ]}
      howToSteps={[
        { name: "Select Shape", text: "Choose the 3D shape you want to calculate." },
        { name: "Enter Dimensions", text: "Input the required measurements for your shape." },
        { name: "Choose Unit", text: "Optionally select your measurement unit." },
        { name: "View Result", text: "See the calculated volume with formula breakdown." },
      ]}
      faqs={[
        {
          question: "What is volume and how is it measured?",
          answer: "Volume is the amount of three-dimensional space occupied by an object. It's measured in cubic units—cubic meters (m³), cubic feet (ft³), liters (L), gallons, etc. Unlike area (2D), volume accounts for length, width, AND height/depth.",
        },
        {
          question: "How do I convert between volume units?",
          answer: "Common conversions: 1 cubic meter = 1000 liters = 264.17 gallons. 1 cubic foot = 7.48 gallons = 28.32 liters. 1 liter = 0.264 gallons. For cubic conversions, remember to cube the linear factor (1 m = 100 cm, so 1 m³ = 1,000,000 cm³).",
        },
        {
          question: "Why do cones and pyramids use 1/3 in their formulas?",
          answer: "The 1/3 factor comes from calculus. A cone or pyramid has a volume exactly one-third of a cylinder or prism with the same base and height. Intuitively, the shape tapers to a point, so it can't hold as much as a full cylinder.",
        },
        {
          question: "How do I calculate volume of an irregular shape?",
          answer: "For irregular solids, use water displacement: submerge the object in water and measure the volume of water displaced. For complex shapes in math, break them into regular shapes (add volumes), or use calculus integration for curved surfaces.",
        },
      ]}
      content={
        <>
          <h2>Understanding Volume Calculations</h2>
          <p>
            Volume measures how much three-dimensional space an object occupies. While area deals with flat surfaces, volume adds the third dimension—making it essential for understanding capacity, displacement, and material quantities in real-world applications.
          </p>
          <p>
            Volume is always expressed in <strong>cubic units</strong>: cubic meters, cubic centimeters, cubic feet, or equivalent capacity measures like liters and gallons. When converting linear units to cubic, remember to cube the conversion factor (10 cm = 1 dm, but 1000 cm³ = 1 dm³).
          </p>

          <h2>Volume Formulas for Common 3D Shapes</h2>

          <h3>Cube and Rectangular Prism</h3>
          <p>
            The cube is the simplest 3D shape—all sides equal, giving V = s³. A rectangular prism (box) generalizes this to V = l × w × h. These formulas are intuitive: imagine stacking unit cubes to fill the space.
          </p>

          <h3>Sphere</h3>
          <p>
            The sphere volume formula V = (4/3)πr³ is derived through calculus by integrating circular cross-sections. A sphere has the minimum surface area for a given volume—that's why bubbles and planets are spherical.
          </p>

          <h3>Cylinder</h3>
          <p>
            A cylinder is essentially a stack of circles: V = πr²h. The πr² gives the area of the circular base, multiplied by height. This formula is crucial for tanks, pipes, cans, and any cylindrical container.
          </p>

          <h3>Cone and Pyramid</h3>
          <p>
            Both cones (V = ⅓πr²h) and pyramids (V = ⅓ × base area × h) share the ⅓ factor. This is because these shapes taper to a point—they contain exactly one-third the volume of a cylinder or prism with the same base and height.
          </p>

          <h2>Practical Applications of Volume</h2>
          <ul>
            <li><strong>Construction:</strong> Concrete, gravel, soil needed for projects</li>
            <li><strong>Shipping:</strong> Calculating box sizes, container capacity</li>
            <li><strong>Swimming Pools:</strong> Water volume for chemicals, heating costs</li>
            <li><strong>Cooking:</strong> Converting recipe measurements, container sizing</li>
            <li><strong>Medicine:</strong> Dosing based on body volume, fluid replacement</li>
            <li><strong>Manufacturing:</strong> Material requirements, mold design</li>
          </ul>

          <h2>Volume vs. Capacity</h2>
          <p>
            While mathematically identical, we typically use "volume" for solids (cubic meters of concrete) and "capacity" for liquids/gases (liters of water). Both measure 3D space, but capacity often uses units like liters, gallons, or fluid ounces rather than cubic units.
          </p>

          <h2>Tips for Accurate Volume Calculations</h2>
          <p>
            <strong>1. Consistent units matter more.</strong> In volume calculations, unit errors are cubed—a 10% error in length becomes a 33% error in volume.
          </p>
          <p>
            <strong>2. Consider practical capacity.</strong> A container's nominal volume differs from working capacity. Swimming pools aren't filled to the brim; tanks need air space.
          </p>
          <p>
            <strong>3. Break down complex shapes.</strong> Divide irregular objects into standard shapes, calculate each volume, then add or subtract as needed.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Shape Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Select 3D Shape
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
                <span className="text-center leading-tight">{SHAPES[key].name}</span>
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
            <p className="text-sm text-muted-foreground mb-2">Volume of {currentShape.name}</p>
            <p className="text-4xl font-bold text-primary">
              {formatNumber(result)} {unit}³
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {currentShape.formula.replace("V = ", "")} = {formatNumber(result)}
            </p>
          </div>
        )}

        {/* Quick Reference */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Volume Formulas Quick Reference</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Box className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Cube</p>
                <p className="font-mono text-muted-foreground">V = s³</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Box className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Rectangular Prism</p>
                <p className="font-mono text-muted-foreground">V = lwh</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Circle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Sphere</p>
                <p className="font-mono text-muted-foreground">V = (4/3)πr³</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Cylinder className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Cylinder</p>
                <p className="font-mono text-muted-foreground">V = πr²h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Triangle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Cone</p>
                <p className="font-mono text-muted-foreground">V = (1/3)πr²h</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Triangle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Pyramid</p>
                <p className="font-mono text-muted-foreground">V = (1/3)Bh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
