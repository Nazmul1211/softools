"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Calculator, TrendingUp, Target, Zap, Info } from "lucide-react";

interface QuadraticResult {
  discriminant: number;
  discriminantType: "positive" | "zero" | "negative";
  roots: { x1: string; x2: string } | { real: string; imaginary: string };
  vertex: { x: number; y: number };
  axisOfSymmetry: number;
  yIntercept: number;
  opensUpward: boolean;
  factored: string | null;
}

function formatNumber(n: number, decimals: number = 4): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(decimals).replace(/\.?0+$/, "");
}

function solveQuadratic(a: number, b: number, c: number): QuadraticResult | null {
  if (a === 0) return null;

  const discriminant = b * b - 4 * a * c;
  const axisOfSymmetry = -b / (2 * a);
  const vertexY = a * axisOfSymmetry * axisOfSymmetry + b * axisOfSymmetry + c;
  const yIntercept = c;
  const opensUpward = a > 0;

  let roots: QuadraticResult["roots"];
  let discriminantType: QuadraticResult["discriminantType"];
  let factored: string | null = null;

  if (discriminant > 0) {
    discriminantType = "positive";
    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    roots = { x1: formatNumber(x1), x2: formatNumber(x2) };

    // Try to create factored form for integer roots
    if (Number.isInteger(x1) && Number.isInteger(x2)) {
      const sign1 = -x1 >= 0 ? "+" : "-";
      const sign2 = -x2 >= 0 ? "+" : "-";
      const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
      factored = `${coef}(x ${sign1} ${Math.abs(x1)})(x ${sign2} ${Math.abs(x2)})`;
    }
  } else if (discriminant === 0) {
    discriminantType = "zero";
    const x = -b / (2 * a);
    roots = { x1: formatNumber(x), x2: formatNumber(x) };

    // Factored form for repeated root
    if (Number.isInteger(x)) {
      const sign = -x >= 0 ? "+" : "-";
      const coef = a === 1 ? "" : a === -1 ? "-" : `${a}`;
      factored = `${coef}(x ${sign} ${Math.abs(x)})²`;
    }
  } else {
    discriminantType = "negative";
    const realPart = -b / (2 * a);
    const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
    roots = {
      real: formatNumber(realPart),
      imaginary: formatNumber(Math.abs(imaginaryPart)),
    };
  }

  return {
    discriminant,
    discriminantType,
    roots,
    vertex: { x: axisOfSymmetry, y: vertexY },
    axisOfSymmetry,
    yIntercept,
    opensUpward,
    factored,
  };
}

export default function QuadraticCalculatorPage() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");

  const result = useMemo(() => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) return null;
    return solveQuadratic(numA, numB, numC);
  }, [a, b, c]);

  const equationDisplay = useMemo(() => {
    const numA = parseFloat(a) || 0;
    const numB = parseFloat(b) || 0;
    const numC = parseFloat(c) || 0;

    let parts: string[] = [];

    if (numA !== 0) {
      if (numA === 1) parts.push("x²");
      else if (numA === -1) parts.push("-x²");
      else parts.push(`${numA}x²`);
    }

    if (numB !== 0) {
      if (numB > 0 && parts.length > 0) parts.push("+");
      if (numB === 1) parts.push("x");
      else if (numB === -1) parts.push("-x");
      else parts.push(`${numB}x`);
    }

    if (numC !== 0) {
      if (numC > 0 && parts.length > 0) parts.push("+");
      parts.push(`${numC}`);
    }

    if (parts.length === 0) return "0 = 0";
    return parts.join(" ") + " = 0";
  }, [a, b, c]);

  return (
    <ToolLayout
      title="Quadratic Formula Calculator"
      description="Solve any quadratic equation of the form ax² + bx + c = 0 using the quadratic formula. Get the roots, discriminant, vertex, and axis of symmetry with step-by-step explanation."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "Scientific Calculator", href: "/scientific-calculator/" },
        { name: "Square Root Calculator", href: "/square-root-calculator/" },
        { name: "Fraction Calculator", href: "/fraction-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Coefficient a", text: "Input the coefficient of x² (cannot be zero)." },
        { name: "Enter Coefficient b", text: "Input the coefficient of x (can be any number)." },
        { name: "Enter Constant c", text: "Input the constant term (can be any number)." },
        { name: "View Results", text: "See the roots, discriminant, vertex, and other properties." },
      ]}
      faqs={[
        {
          question: "What is the quadratic formula?",
          answer: "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. It solves any quadratic equation ax² + bx + c = 0 by giving you the values of x where the equation equals zero. The ± symbol means there are typically two solutions.",
        },
        {
          question: "What is the discriminant and why does it matter?",
          answer: "The discriminant is b² - 4ac, the part under the square root in the quadratic formula. If it's positive, you get two real roots. If it's zero, you get one repeated root. If it's negative, you get two complex (imaginary) roots. The discriminant tells you what type of solutions to expect.",
        },
        {
          question: "What is the vertex of a parabola?",
          answer: "The vertex is the highest or lowest point on a parabola. For y = ax² + bx + c, the vertex x-coordinate is -b/(2a). If a > 0, the parabola opens upward and the vertex is the minimum. If a < 0, it opens downward and the vertex is the maximum.",
        },
        {
          question: "When should I use the quadratic formula vs. factoring?",
          answer: "Use factoring when the equation has nice integer roots (like x² - 5x + 6 = 0 factors to (x-2)(x-3)). Use the quadratic formula when factoring isn't obvious, when dealing with decimals, or when you need exact answers with radicals. The quadratic formula always works.",
        },
      ]}
      content={
        <>
          <h2>Understanding the Quadratic Formula</h2>
          <p>
            The quadratic formula is one of the most important formulas in algebra. It provides a universal method for solving any quadratic equation of the form ax² + bx + c = 0, where a, b, and c are coefficients and a ≠ 0. The formula is:
          </p>
          <p className="font-mono text-lg bg-muted p-4 rounded-lg text-center">
            x = (-b ± √(b² - 4ac)) / 2a
          </p>
          <p>
            This elegant formula was derived by completing the square on the general quadratic equation. It gives us both solutions (roots) at once—the ± symbol indicates we add the square root for one solution and subtract it for the other.
          </p>

          <h2>The Discriminant: Your Solution Predictor</h2>
          <p>
            The discriminant, denoted as Δ (delta) or D, is the expression under the square root: b² - 4ac. Before solving, the discriminant tells you exactly what kind of solutions to expect:
          </p>
          <ul>
            <li><strong>Δ &gt; 0 (Positive):</strong> Two distinct real roots. The parabola crosses the x-axis at two points.</li>
            <li><strong>Δ = 0 (Zero):</strong> One repeated real root (also called a double root). The parabola touches the x-axis at exactly one point—its vertex.</li>
            <li><strong>Δ &lt; 0 (Negative):</strong> Two complex conjugate roots. The parabola never touches the x-axis.</li>
          </ul>
          <p>
            The discriminant is incredibly useful in applications. In physics, it can determine whether a projectile will reach a certain height. In business, it can indicate whether break-even points exist.
          </p>

          <h2>Anatomy of a Parabola</h2>
          <p>
            Every quadratic equation y = ax² + bx + c graphs as a parabola. Understanding its key features helps you interpret solutions:
          </p>
          <ul>
            <li><strong>Vertex:</strong> The turning point at (-b/2a, f(-b/2a)). This is either the minimum (when a &gt; 0) or maximum (when a &lt; 0) of the function.</li>
            <li><strong>Axis of Symmetry:</strong> The vertical line x = -b/2a that passes through the vertex. The parabola is symmetric about this line.</li>
            <li><strong>Y-Intercept:</strong> The point (0, c) where the parabola crosses the y-axis.</li>
            <li><strong>X-Intercepts (Roots):</strong> The points where y = 0, which are exactly what the quadratic formula finds.</li>
            <li><strong>Direction:</strong> If a &gt; 0, the parabola opens upward (U-shape). If a &lt; 0, it opens downward (∩-shape).</li>
          </ul>

          <h2>Methods for Solving Quadratic Equations</h2>
          <p>
            While the quadratic formula always works, other methods may be faster in specific cases:
          </p>
          <ul>
            <li><strong>Factoring:</strong> If the equation factors nicely (like x² - 5x + 6 = (x-2)(x-3)), this is the fastest method. Works well when roots are integers or simple fractions.</li>
            <li><strong>Completing the Square:</strong> Useful for deriving the vertex form y = a(x-h)² + k. This method is how the quadratic formula itself was discovered.</li>
            <li><strong>Graphing:</strong> Visual method where solutions are x-intercepts. Good for estimation or when using technology.</li>
            <li><strong>Quadratic Formula:</strong> The universal method that works for all quadratic equations. Essential when other methods fail or when exact answers with radicals are needed.</li>
          </ul>

          <h2>Real-World Applications</h2>
          <p>
            Quadratic equations appear throughout science, engineering, and everyday life:
          </p>
          <ul>
            <li><strong>Projectile Motion:</strong> Height of a thrown ball follows h(t) = -16t² + v₀t + h₀</li>
            <li><strong>Business:</strong> Profit optimization and break-even analysis</li>
            <li><strong>Architecture:</strong> Parabolic arches and suspension bridge cables</li>
            <li><strong>Physics:</strong> Kinetic energy, optics (parabolic mirrors), acceleration</li>
            <li><strong>Engineering:</strong> Signal processing, control systems, structural analysis</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Enter Coefficients
          </h2>

          <div className="mb-4 text-center">
            <p className="text-lg font-mono text-foreground">{equationDisplay}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                a (coefficient of x²)
              </label>
              <input
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                placeholder="Enter a"
              />
              <p className="mt-1 text-xs text-muted-foreground">Cannot be zero</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                b (coefficient of x)
              </label>
              <input
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                placeholder="Enter b"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                c (constant term)
              </label>
              <input
                type="number"
                step="any"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                placeholder="Enter c"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result ? (
          <>
            {/* Main Result - Roots */}
            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Target className="h-5 w-5 text-primary" />
                Solutions (Roots)
              </h3>

              {"x1" in result.roots ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">First Root (x₁)</p>
                    <p className="text-3xl font-bold text-primary">{result.roots.x1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Second Root (x₂)</p>
                    <p className="text-3xl font-bold text-primary">{result.roots.x2}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Root 1</p>
                    <p className="text-2xl font-bold text-primary">
                      {result.roots.real} + {result.roots.imaginary}i
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Root 2</p>
                    <p className="text-2xl font-bold text-primary">
                      {result.roots.real} - {result.roots.imaginary}i
                    </p>
                  </div>
                </div>
              )}

              {result.factored && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">Factored Form</p>
                  <p className="font-mono text-foreground">{result.factored} = 0</p>
                </div>
              )}
            </div>

            {/* Discriminant */}
            <div className={`rounded-xl border p-4 ${
              result.discriminantType === "positive"
                ? "border-emerald-500/30 bg-emerald-500/10"
                : result.discriminantType === "zero"
                ? "border-amber-500/30 bg-amber-500/10"
                : "border-blue-500/30 bg-blue-500/10"
            }`}>
              <div className="flex items-start gap-3">
                <Zap className={`h-5 w-5 mt-0.5 ${
                  result.discriminantType === "positive"
                    ? "text-emerald-500"
                    : result.discriminantType === "zero"
                    ? "text-amber-500"
                    : "text-blue-500"
                }`} />
                <div>
                  <p className="font-semibold text-foreground">
                    Discriminant (Δ) = {formatNumber(result.discriminant)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.discriminantType === "positive" && "Δ > 0: Two distinct real roots"}
                    {result.discriminantType === "zero" && "Δ = 0: One repeated real root (double root)"}
                    {result.discriminantType === "negative" && "Δ < 0: Two complex conjugate roots"}
                  </p>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <TrendingUp className={`mx-auto h-6 w-6 mb-2 ${result.opensUpward ? "text-emerald-500" : "text-red-500 rotate-180"}`} />
                <p className="text-sm text-muted-foreground">Direction</p>
                <p className="font-bold text-foreground">
                  {result.opensUpward ? "Opens Upward" : "Opens Downward"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Target className="mx-auto h-6 w-6 mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Vertex</p>
                <p className="font-bold text-foreground">
                  ({formatNumber(result.vertex.x)}, {formatNumber(result.vertex.y)})
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Info className="mx-auto h-6 w-6 mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Axis of Symmetry</p>
                <p className="font-bold text-foreground">x = {formatNumber(result.axisOfSymmetry)}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Calculator className="mx-auto h-6 w-6 mb-2 text-amber-500" />
                <p className="text-sm text-muted-foreground">Y-Intercept</p>
                <p className="font-bold text-foreground">(0, {result.yIntercept})</p>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Step-by-Step Solution</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                  <div>
                    <p className="font-medium text-foreground">Identify coefficients</p>
                    <p className="font-mono text-muted-foreground">a = {a}, b = {b}, c = {c}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                  <div>
                    <p className="font-medium text-foreground">Calculate discriminant</p>
                    <p className="font-mono text-muted-foreground">
                      Δ = b² - 4ac = ({b})² - 4({a})({c}) = {formatNumber(result.discriminant)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                  <div>
                    <p className="font-medium text-foreground">Apply quadratic formula</p>
                    <p className="font-mono text-muted-foreground">
                      x = (-b ± √Δ) / 2a = (-({b}) ± √{formatNumber(result.discriminant)}) / 2({a})
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
                  <div>
                    <p className="font-medium text-foreground">Simplify</p>
                    {"x1" in result.roots ? (
                      <p className="font-mono text-muted-foreground">
                        x₁ = {result.roots.x1}, x₂ = {result.roots.x2}
                      </p>
                    ) : (
                      <p className="font-mono text-muted-foreground">
                        x = {result.roots.real} ± {result.roots.imaginary}i
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          parseFloat(a) === 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-amber-700 dark:text-amber-400">
                <strong>Note:</strong> When a = 0, the equation is linear (bx + c = 0), not quadratic. 
                {parseFloat(b) !== 0 && ` The solution is x = ${formatNumber(-parseFloat(c) / parseFloat(b))}.`}
              </p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
