"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { TrendingUp, Calculator, Target, Info, ArrowRight } from "lucide-react";

interface SlopeResult {
  slope: number | "undefined";
  rise: number;
  run: number;
  angle: number;
  percentGrade: number;
  yIntercept: number | null;
  slopeIntercept: string;
  pointSlope: string;
  standardForm: string;
  distance: number;
  midpoint: { x: number; y: number };
  perpSlope: number | "undefined" | 0;
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

function calculateSlope(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): SlopeResult | null {
  const rise = y2 - y1;
  const run = x2 - x1;

  const slope = run === 0 ? "undefined" : rise / run;
  const angle = run === 0 ? 90 : (Math.atan2(rise, run) * 180) / Math.PI;
  const percentGrade = run === 0 ? Infinity : (rise / run) * 100;
  const yIntercept = typeof slope === "number" ? y1 - slope * x1 : null;
  const distance = Math.sqrt(rise * rise + run * run);
  const midpoint = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };

  // Perpendicular slope
  let perpSlope: number | "undefined" | 0;
  if (slope === "undefined") {
    perpSlope = 0;
  } else if (slope === 0) {
    perpSlope = "undefined";
  } else {
    perpSlope = -1 / slope;
  }

  // Equation forms
  let slopeIntercept = "";
  let pointSlope = "";
  let standardForm = "";

  if (typeof slope === "number" && yIntercept !== null) {
    const sign = yIntercept >= 0 ? "+" : "-";
    slopeIntercept = `y = ${formatNumber(slope)}x ${sign} ${formatNumber(Math.abs(yIntercept))}`;
    
    const sign1 = y1 >= 0 ? "+" : "-";
    const sign2 = x1 >= 0 ? "-" : "+";
    pointSlope = `y ${sign1} ${Math.abs(y1)} = ${formatNumber(slope)}(x ${sign2} ${Math.abs(x1)})`;

    // Standard form: Ax + By = C
    const A = -rise;
    const B = run;
    const C = -rise * x1 + run * y1;
    const divisor = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C));
    const normA = A / divisor;
    const normB = B / divisor;
    const normC = C / divisor;
    const signB = normB >= 0 ? "+" : "-";
    standardForm = `${normA}x ${signB} ${Math.abs(normB)}y = ${normC}`;
  } else {
    slopeIntercept = "Undefined (vertical line)";
    pointSlope = `x = ${x1}`;
    standardForm = `x = ${x1}`;
  }

  return {
    slope,
    rise,
    run,
    angle,
    percentGrade,
    yIntercept,
    slopeIntercept,
    pointSlope,
    standardForm,
    distance,
    midpoint,
    perpSlope,
  };
}

export default function SlopeCalculatorPage() {
  const [x1, setX1] = useState("0");
  const [y1, setY1] = useState("0");
  const [x2, setX2] = useState("4");
  const [y2, setY2] = useState("3");
  const [mode, setMode] = useState<"points" | "riseRun" | "equation">("points");
  const [rise, setRise] = useState("3");
  const [run, setRun] = useState("4");
  const [eqSlope, setEqSlope] = useState("0.75");
  const [eqIntercept, setEqIntercept] = useState("0");

  const result = useMemo(() => {
    if (mode === "points") {
      const nX1 = parseFloat(x1);
      const nY1 = parseFloat(y1);
      const nX2 = parseFloat(x2);
      const nY2 = parseFloat(y2);
      if ([nX1, nY1, nX2, nY2].some(isNaN)) return null;
      return calculateSlope(nX1, nY1, nX2, nY2);
    } else if (mode === "riseRun") {
      const nRise = parseFloat(rise);
      const nRun = parseFloat(run);
      if (isNaN(nRise) || isNaN(nRun)) return null;
      return calculateSlope(0, 0, nRun, nRise);
    } else {
      const m = parseFloat(eqSlope);
      const b = parseFloat(eqIntercept);
      if (isNaN(m) || isNaN(b)) return null;
      return calculateSlope(0, b, 1, m + b);
    }
  }, [mode, x1, y1, x2, y2, rise, run, eqSlope, eqIntercept]);

  const faqs = [
    {
      question: "What is slope in mathematics?",
      answer:
        "Slope is a measure of the steepness and direction of a line. It represents the rate of change between two points and is calculated as rise over run (vertical change divided by horizontal change). A positive slope indicates an upward trend, while a negative slope indicates a downward trend.",
    },
    {
      question: "How do you calculate slope from two points?",
      answer:
        "To calculate slope from two points (x₁, y₁) and (x₂, y₂), use the formula: m = (y₂ - y₁) / (x₂ - x₁). This gives you the rise (vertical change) divided by the run (horizontal change). If the run equals zero (vertical line), the slope is undefined.",
    },
    {
      question: "What does a slope of 0 mean?",
      answer:
        "A slope of 0 means the line is perfectly horizontal. There is no vertical change between any two points on the line - the y-value stays constant regardless of the x-value. The equation of a horizontal line is y = b, where b is the y-intercept.",
    },
    {
      question: "What is an undefined slope?",
      answer:
        "An undefined slope occurs when a line is perfectly vertical. In this case, the run (horizontal change) equals zero, and since division by zero is undefined, the slope has no numerical value. Vertical lines are written as x = a, where a is the x-coordinate.",
    },
    {
      question: "How do you find the perpendicular slope?",
      answer:
        "The perpendicular slope is the negative reciprocal of the original slope. If the original slope is m, the perpendicular slope is -1/m. For example, if a line has slope 2, the perpendicular slope is -1/2. If the original slope is 0 (horizontal), the perpendicular is undefined (vertical), and vice versa.",
    },
    {
      question: "What is slope-intercept form?",
      answer:
        "Slope-intercept form is y = mx + b, where m is the slope and b is the y-intercept. This form makes it easy to identify both the steepness of the line (m) and where it crosses the y-axis (b). It's one of the most common ways to express linear equations.",
    },
  ];

  const howToSteps = [
    {
      name: "Select calculation mode",
      text: "Choose whether to calculate slope from two points, rise and run values, or from an existing equation.",
    },
    {
      name: "Enter your values",
      text: "Input the coordinates for two points (x₁, y₁) and (x₂, y₂), or enter rise/run values, or the slope and y-intercept.",
    },
    {
      name: "View the slope results",
      text: "See the calculated slope as a decimal, fraction, angle in degrees, and percent grade.",
    },
    {
      name: "Review equation forms",
      text: "Get the line equation in slope-intercept form (y = mx + b), point-slope form, and standard form (Ax + By = C).",
    },
    {
      name: "Explore additional data",
      text: "View the perpendicular slope, distance between points, and midpoint coordinates for comprehensive analysis.",
    },
  ];

  const content = `
## Understanding Slope: The Foundation of Linear Mathematics

Slope is one of the most fundamental concepts in algebra, geometry, and calculus. Our slope calculator helps you quickly determine the steepness and direction of any line, whether you're working with coordinate points, rise and run values, or converting between equation forms.

### What is Slope?

Slope, often denoted by the letter **m**, measures how steep a line is and in which direction it travels. Mathematically, slope represents the ratio of vertical change (rise) to horizontal change (run) between any two points on a line:

**m = rise / run = (y₂ - y₁) / (x₂ - x₁)**

This ratio tells us several important things:
- **Magnitude**: How steep the line is (larger absolute values = steeper lines)
- **Direction**: Whether the line goes up (positive) or down (negative) as you move right
- **Rate of change**: How much y changes for every unit change in x

### Types of Slopes

Understanding the four types of slopes helps you interpret linear relationships:

**Positive Slope (m > 0)**: The line rises from left to right. Examples include income growth over time, increasing temperatures, or climbing a hill. A slope of 2 means y increases by 2 for every 1 unit increase in x.

**Negative Slope (m < 0)**: The line falls from left to right. Examples include depreciation, cooling temperatures, or descending a slope. A slope of -3 means y decreases by 3 for every 1 unit increase in x.

**Zero Slope (m = 0)**: The line is perfectly horizontal. The y-value remains constant regardless of x. Examples include a flat road or a constant speed. The equation is simply y = b.

**Undefined Slope**: The line is perfectly vertical. There's no horizontal change, making the ratio undefined (division by zero). Examples include walls or vertical poles. The equation is x = a.

### Slope Formulas and Equation Forms

Our calculator provides three essential equation forms:

**Slope-Intercept Form: y = mx + b**
- m = slope
- b = y-intercept (where the line crosses the y-axis)
- Most useful for graphing and understanding the line's behavior

**Point-Slope Form: y - y₁ = m(x - x₁)**
- Uses any point (x₁, y₁) on the line
- Helpful when you know the slope and one point
- Often used in calculus for tangent lines

**Standard Form: Ax + By = C**
- A, B, and C are integers with no common factors
- A is typically positive
- Useful for certain algebraic operations

### Real-World Applications of Slope

**Engineering and Construction**: Architects and engineers use slope to design ramps, roofs, and drainage systems. The Americans with Disabilities Act (ADA) requires wheelchair ramps to have a maximum slope of 1:12 (about 4.76 degrees).

**Economics and Finance**: Slope appears in cost functions, supply and demand curves, and marginal analysis. A steeper demand curve indicates more price sensitivity.

**Physics**: Velocity is the slope of a position-time graph. Acceleration is the slope of a velocity-time graph. Understanding slopes helps analyze motion and forces.

**Geography and Surveying**: Terrain slope affects water runoff, erosion, and land use. A 10% grade means a 10-foot rise per 100 feet of horizontal distance.

**Data Science**: The slope of a regression line indicates the strength and direction of relationships between variables.

### Percent Grade vs. Slope

While mathematically equivalent, slope and percent grade serve different purposes:

- **Slope** (as a ratio): Used in mathematics, expressed as rise/run or a decimal
- **Percent grade**: Used in road signs and construction, calculated as (rise/run) × 100%

A 6% road grade means for every 100 feet horizontally, the road rises 6 feet. This equals a slope of 0.06.

### The Perpendicular Slope Relationship

Two perpendicular lines (intersecting at 90°) have slopes that are negative reciprocals:
- If line 1 has slope m₁, line 2 has slope m₂ = -1/m₁
- The product of perpendicular slopes equals -1: m₁ × m₂ = -1

This relationship is crucial in:
- Finding equations of perpendicular lines
- Shortest distance problems
- Geometric constructions
- Computer graphics and game development

### Common Mistakes to Avoid

**Reversing rise and run**: Remember, slope = rise/run, not run/rise. Rise is always the vertical change (y₂ - y₁).

**Sign errors**: Be careful with negative coordinates. (-3 - 2) = -5, not -1.

**Confusing undefined and zero**: Zero slope is horizontal; undefined slope is vertical.

**Point order**: The order of points doesn't matter as long as you're consistent: (y₂ - y₁)/(x₂ - x₁) = (y₁ - y₂)/(x₁ - x₂).

### How to Use This Calculator

Our slope calculator offers three convenient modes:

1. **Two Points Mode**: Enter coordinates (x₁, y₁) and (x₂, y₂) to calculate slope and all related values
2. **Rise and Run Mode**: Directly input rise and run values for quick calculations
3. **Equation Mode**: Enter slope and y-intercept to see the line's properties

Each mode provides comprehensive results including decimal slope, angle in degrees, percent grade, all equation forms, perpendicular slope, distance, and midpoint.

Whether you're a student learning linear equations, a professional calculating grades, or anyone working with linear relationships, this calculator provides instant, accurate results for all your slope calculations.
  `;

  return (
    <ToolLayout
      title="Slope Calculator"
      description="Calculate the slope of a line from two points, rise and run, or equation form. Get slope in decimal, fraction, degrees, percent grade, plus all equation forms."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      faqs={faqs}
      howToSteps={howToSteps}
      content={content}
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "points", label: "Two Points" },
            { id: "riseRun", label: "Rise & Run" },
            { id: "equation", label: "Equation" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id as typeof mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            {mode === "points"
              ? "Enter Two Points"
              : mode === "riseRun"
              ? "Enter Rise and Run"
              : "Enter Equation Values"}
          </h2>

          {mode === "points" && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground">Point 1 (x₁, y₁)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">x₁</label>
                    <input
                      type="number"
                      value={x1}
                      onChange={(e) => setX1(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">y₁</label>
                    <input
                      type="number"
                      value={y1}
                      onChange={(e) => setY1(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground">Point 2 (x₂, y₂)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">x₂</label>
                    <input
                      type="number"
                      value={x2}
                      onChange={(e) => setX2(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">y₂</label>
                    <input
                      type="number"
                      value={y2}
                      onChange={(e) => setY2(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === "riseRun" && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Rise (Vertical Change)</label>
                <input
                  type="number"
                  value={rise}
                  onChange={(e) => setRise(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Run (Horizontal Change)</label>
                <input
                  type="number"
                  value={run}
                  onChange={(e) => setRun(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {mode === "equation" && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Slope (m)</label>
                <input
                  type="number"
                  step="any"
                  value={eqSlope}
                  onChange={(e) => setEqSlope(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Y-Intercept (b)</label>
                <input
                  type="number"
                  step="any"
                  value={eqIntercept}
                  onChange={(e) => setEqIntercept(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Main Slope Result */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Slope Results
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-background/80 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Slope (m)</div>
                  <div className="text-2xl font-bold text-primary">
                    {result.slope === "undefined" ? "Undefined" : formatNumber(result.slope)}
                  </div>
                </div>
                <div className="bg-background/80 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Rise / Run</div>
                  <div className="text-2xl font-bold">
                    {result.rise} / {result.run}
                  </div>
                </div>
                <div className="bg-background/80 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Angle</div>
                  <div className="text-2xl font-bold">{formatNumber(result.angle)}°</div>
                </div>
                <div className="bg-background/80 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Percent Grade</div>
                  <div className="text-2xl font-bold">
                    {result.percentGrade === Infinity
                      ? "∞"
                      : formatNumber(result.percentGrade) + "%"}
                  </div>
                </div>
              </div>
            </div>

            {/* Equation Forms */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Line Equations
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-muted-foreground min-w-[140px]">
                    Slope-Intercept:
                  </span>
                  <code className="px-3 py-2 bg-muted rounded-lg font-mono text-sm flex-1">
                    {result.slopeIntercept}
                  </code>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-muted-foreground min-w-[140px]">Point-Slope:</span>
                  <code className="px-3 py-2 bg-muted rounded-lg font-mono text-sm flex-1">
                    {result.pointSlope}
                  </code>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-muted-foreground min-w-[140px]">Standard Form:</span>
                  <code className="px-3 py-2 bg-muted rounded-lg font-mono text-sm flex-1">
                    {result.standardForm}
                  </code>
                </div>
              </div>
            </div>

            {/* Additional Properties */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Perpendicular Slope</span>
                </div>
                <div className="text-xl font-bold">
                  {result.perpSlope === "undefined"
                    ? "Undefined"
                    : result.perpSlope === 0
                    ? "0"
                    : formatNumber(result.perpSlope)}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Distance</span>
                </div>
                <div className="text-xl font-bold">{formatNumber(result.distance)}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Midpoint</span>
                </div>
                <div className="text-xl font-bold">
                  ({formatNumber(result.midpoint.x)}, {formatNumber(result.midpoint.y)})
                </div>
              </div>
            </div>

            {/* Visual Indicator */}
            <div className="bg-muted/50 border border-border rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Slope Direction</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-24 h-24 border-2 border-primary rounded-lg relative overflow-hidden"
                  title={`${result.angle}°`}
                >
                  <div
                    className="absolute left-1/2 top-1/2 w-20 h-0.5 bg-primary origin-left"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${-result.angle}deg)`,
                    }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.slope === "undefined" ? (
                    <span>Vertical line (undefined slope)</span>
                  ) : result.slope === 0 ? (
                    <span>Horizontal line (zero slope)</span>
                  ) : result.slope > 0 ? (
                    <span>Line rises from left to right (positive slope)</span>
                  ) : (
                    <span>Line falls from left to right (negative slope)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
