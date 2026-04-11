"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  Ruler,
  Package,
  DollarSign,
  Layers,
  RefreshCcw,
  Info,
  Calculator,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "How do I calculate how much concrete I need?",
    answer:
      "Measure the length, width, and depth (thickness) of the area to be filled. Multiply all three dimensions together to get the volume. If using feet and inches, convert the depth to feet first (divide inches by 12). The result is cubic feet. Divide cubic feet by 27 to get cubic yards, which is the standard unit for ordering ready-mix concrete. Our calculator automates all of this, including unit conversions, waste factor, and bag count estimation.",
  },
  {
    question: "How many bags of concrete do I need?",
    answer:
      "A standard 80-lb (36 kg) bag of concrete yields approximately 0.6 cubic feet (0.017 cubic meters) of mixed concrete. A 60-lb bag yields about 0.45 cubic feet, and a 40-lb bag yields about 0.3 cubic feet. To find the number of bags needed, divide your total cubic feet by the yield per bag. For example, a 4×8-foot slab that is 4 inches thick requires 10.67 cubic feet ÷ 0.6 = approximately 18 bags (80-lb). Our calculator includes this automatically.",
  },
  {
    question: "How much does concrete cost?",
    answer:
      "Ready-mix concrete typically costs $120–$160 per cubic yard for standard mixes, delivered. Prices vary by region, distance from the batch plant, order size, and concrete specification (higher PSI ratings cost more). Bagged concrete (80-lb bags from hardware stores) costs roughly $5–$7 per bag, which translates to $200–$280 per cubic yard — significantly more expensive for large projects. For orders over 3–4 cubic yards, ready-mix delivery is almost always more economical.",
  },
  {
    question: "Should I order extra concrete for waste?",
    answer:
      "Yes. Industry standard practice is to order 5–10% more concrete than your calculated volume. This accounts for spillage, uneven subgrade (the ground beneath the concrete), over-excavation, and the concrete that remains in the mixer chute and forms. A 10% overage is standard for most residential projects. For complex forms or sloped subgrade, consider 15%. Running short is far more costly than a small overage — a partial pour that sets before additional concrete arrives creates a cold joint, which is a structural weakness.",
  },
  {
    question: "What is the difference between cubic yards and cubic feet?",
    answer:
      "One cubic yard equals 27 cubic feet (3 feet × 3 feet × 3 feet). Cubic yards are the standard ordering unit for ready-mix concrete in the United States and Canada. Cubic feet are useful for smaller calculations and bag estimates. Cubic meters are the standard in most other countries. Our calculator provides results in all three units automatically.",
  },
  {
    question: "What thickness should I use for a concrete slab?",
    answer:
      "Standard residential slab thickness depends on the application: driveways require 4–6 inches (6 inches for heavy vehicles), patios and walkways use 4 inches, garage floors need 4–6 inches with thickened edges, and footings typically require 8–12 inches depending on soil conditions and load requirements. Building codes vary by jurisdiction — always verify local requirements before pouring. The American Concrete Institute (ACI) provides detailed specifications in ACI 332R-20 for residential construction.",
  },
];

// ─── Types ─────────────────────────────────────────
type ShapeType = "slab" | "footing" | "column" | "wall";
type UnitSystem = "imperial" | "metric";

// ─── Constants ─────────────────────────────────────
const SHAPES: { value: ShapeType; label: string; icon: string; description: string }[] = [
  { value: "slab", label: "Slab / Patio", icon: "▬", description: "Flat rectangular pour" },
  { value: "footing", label: "Footing / Trench", icon: "▭", description: "Deep narrow trench" },
  { value: "column", label: "Round Column", icon: "○", description: "Cylindrical pour (sonotubes)" },
  { value: "wall", label: "Wall", icon: "▯", description: "Vertical wall pour" },
];

const BAG_SIZES = [
  { weight: 80, yieldCuFt: 0.6, label: "80 lb" },
  { weight: 60, yieldCuFt: 0.45, label: "60 lb" },
  { weight: 40, yieldCuFt: 0.3, label: "40 lb" },
];

// ─── Helper Functions ──────────────────────────────
function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Component ─────────────────────────────────────
export default function ConcreteCalculator() {
  const [shape, setShape] = useState<ShapeType>("slab");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(10);
  const [depth, setDepth] = useState(4); // inches for imperial, cm for metric
  const [diameter, setDiameter] = useState(12); // inches or cm
  const [height, setHeight] = useState(48); // inches or cm for column height
  const [quantity, setQuantity] = useState(1);
  const [wasteFactor, setWasteFactor] = useState(10);
  const [costPerYard, setCostPerYard] = useState(140);

  const result = useMemo(() => {
    let volumeCuFt = 0;

    if (unitSystem === "imperial") {
      if (shape === "slab" || shape === "footing") {
        // length (ft) × width (ft) × depth (inches → ft)
        volumeCuFt = length * width * (depth / 12) * quantity;
      } else if (shape === "column") {
        // π × r² × height, all in feet
        const radiusFt = (diameter / 2) / 12;
        const heightFt = height / 12;
        volumeCuFt = Math.PI * radiusFt * radiusFt * heightFt * quantity;
      } else if (shape === "wall") {
        // length (ft) × height (ft) × thickness (inches → ft)
        volumeCuFt = length * (height / 12) * (depth / 12) * quantity;
      }
    } else {
      // Metric inputs: length/width in meters, depth/height in cm
      let volumeCuM = 0;
      if (shape === "slab" || shape === "footing") {
        volumeCuM = length * width * (depth / 100) * quantity;
      } else if (shape === "column") {
        const radiusM = (diameter / 100) / 2;
        const heightM = height / 100;
        volumeCuM = Math.PI * radiusM * radiusM * heightM * quantity;
      } else if (shape === "wall") {
        volumeCuM = length * (height / 100) * (depth / 100) * quantity;
      }
      // Convert to cubic feet for consistent bag calc
      volumeCuFt = volumeCuM * 35.3147;
    }

    if (volumeCuFt <= 0) return null;

    const wasteMultiplier = 1 + wasteFactor / 100;
    const volumeWithWaste = volumeCuFt * wasteMultiplier;
    const cubicYards = volumeWithWaste / 27;
    const cubicMeters = volumeWithWaste / 35.3147;

    const bags = BAG_SIZES.map((bag) => ({
      ...bag,
      count: Math.ceil(volumeWithWaste / bag.yieldCuFt),
    }));

    const estimatedCost = cubicYards * costPerYard;
    const weight = cubicYards * 4050; // ~4050 lbs per cubic yard

    return {
      volumeCuFt: Math.round(volumeWithWaste * 100) / 100,
      cubicYards: Math.round(cubicYards * 100) / 100,
      cubicMeters: Math.round(cubicMeters * 100) / 100,
      bags,
      estimatedCost: Math.round(estimatedCost),
      weight: Math.round(weight),
      rawVolumeCuFt: Math.round(volumeCuFt * 100) / 100,
      wasteVolumeCuFt: Math.round((volumeWithWaste - volumeCuFt) * 100) / 100,
    };
  }, [shape, unitSystem, length, width, depth, diameter, height, quantity, wasteFactor, costPerYard]);

  const reset = () => {
    setShape("slab");
    setLength(20);
    setWidth(10);
    setDepth(4);
    setDiameter(12);
    setHeight(48);
    setQuantity(1);
    setWasteFactor(10);
    setCostPerYard(140);
  };

  return (
    <ToolLayout
      title="Concrete Calculator"
      description="Calculate exactly how much concrete you need for slabs, footings, columns, and walls. Get results in cubic yards, cubic meters, number of bags, and estimated cost — with built-in waste factor."
      category={{ name: "Construction & Home", slug: "construction-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Select Shape", text: "Choose slab, footing, column, or wall to match your project." },
        { name: "Enter Dimensions", text: "Input length, width, and depth (or diameter and height for columns)." },
        { name: "Set Options", text: "Adjust waste factor and cost per yard for accurate estimates." },
        { name: "View Results", text: "See cubic yards, bags needed, estimated cost, and total weight." },
      ]}
      relatedTools={[
        { name: "Square Footage Calculator", href: "/square-footage-calculator/" },
        { name: "Volume Calculator", href: "/volume-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Unit Converter", href: "/unit-converter/" },
      ]}
      content={
        <>
          <h2>What Is a Concrete Calculator?</h2>
          <p>
            A concrete calculator estimates the volume of concrete required for a construction project based on the area's dimensions. It converts measurements into cubic yards (the standard ordering unit for ready-mix concrete in the United States) and provides equivalent values in cubic feet, cubic meters, and number of pre-mixed bags. Accurate concrete estimation is critical — ordering too little disrupts the pour and creates weak cold joints, while excessive overordering wastes money and creates disposal challenges for excess concrete.
          </p>

          <h2>How Is Concrete Volume Calculated?</h2>
          <h3>Rectangular Slabs & Footings</h3>
          <p>
            For rectangular areas (driveways, patios, sidewalks, slabs, and trench footings), the formula is:
          </p>
          <p>
            <strong>Volume (cu ft) = Length (ft) × Width (ft) × Depth (ft)</strong>
          </p>
          <p>
            To convert to cubic yards: <strong>Volume (cu yd) = Volume (cu ft) ÷ 27</strong>
          </p>

          <h3>Worked Example — Driveway Slab</h3>
          <p>
            A 20-foot long, 10-foot wide driveway with 4 inches of concrete:
          </p>
          <p>
            Volume = 20 × 10 × (4/12) = 20 × 10 × 0.333 = 66.67 cu ft = 66.67 ÷ 27 = <strong>2.47 cubic yards</strong>
          </p>
          <p>
            Adding 10% waste factor: 2.47 × 1.10 = <strong>2.72 cubic yards</strong>. Order 3 yards from your ready-mix supplier (minimum order is typically 1 yard).
          </p>

          <h3>Round Columns (Sonotubes)</h3>
          <p>
            For cylindrical forms like deck post footings and sonotubes:
          </p>
          <p>
            <strong>Volume = π × r² × h</strong>
          </p>
          <p>
            Where r is the radius (half the diameter) and h is the height, all in the same unit.
          </p>

          <h2>Understanding Concrete Bags vs. Ready-Mix</h2>
          <table>
            <thead>
              <tr><th>Option</th><th>Best For</th><th>Cost per Yard</th><th>Notes</th></tr>
            </thead>
            <tbody>
              <tr><td>80-lb bags</td><td>&lt; 0.5 cubic yards</td><td>$200–280</td><td>45 bags per yard; labor-intensive mixing</td></tr>
              <tr><td>60-lb bags</td><td>&lt; 0.25 cubic yards</td><td>$220–300</td><td>Easier to handle; more bags needed</td></tr>
              <tr><td>Ready-mix truck</td><td>&gt; 1 cubic yard</td><td>$120–160</td><td>Most economical for large pours</td></tr>
              <tr><td>Short-load truck</td><td>0.5–2 cubic yards</td><td>$150–200</td><td>Small truck; short-load fee may apply</td></tr>
            </tbody>
          </table>

          <h2>Recommended Slab Thickness by Application</h2>
          <table>
            <thead>
              <tr><th>Application</th><th>Min. Thickness</th><th>Recommended</th><th>PSI Rating</th></tr>
            </thead>
            <tbody>
              <tr><td>Walkways & paths</td><td>3.5 inches</td><td>4 inches</td><td>3,000 PSI</td></tr>
              <tr><td>Patios</td><td>3.5 inches</td><td>4 inches</td><td>3,000–3,500 PSI</td></tr>
              <tr><td>Driveways (cars)</td><td>4 inches</td><td>5 inches</td><td>3,500–4,000 PSI</td></tr>
              <tr><td>Driveways (trucks)</td><td>5 inches</td><td>6 inches</td><td>4,000+ PSI</td></tr>
              <tr><td>Garage floors</td><td>4 inches</td><td>5–6 inches</td><td>3,500–4,000 PSI</td></tr>
              <tr><td>Footings</td><td>8 inches</td><td>12 inches</td><td>3,000–4,500 PSI</td></tr>
            </tbody>
          </table>

          <h2>Tips for Accurate Concrete Estimation</h2>
          <ul>
            <li><strong>Measure twice, pour once:</strong> Verify all dimensions before placing your order. Digging inaccuracies are the #1 cause of shortfalls.</li>
            <li><strong>Account for subgrade variation:</strong> Soil compaction and grading are never perfect. A slab designed for 4 inches of concrete may actually need 4.5–5 inches in some spots.</li>
            <li><strong>Use the waste factor:</strong> 10% is standard for simple pours; use 15% for complex forms, slopes, or first-time pours.</li>
            <li><strong>Check local codes:</strong> Minimum thickness, rebar requirements, and soil prep vary by jurisdiction.</li>
            <li><strong>Time your pour:</strong> Concrete begins setting within 60–90 minutes. Ensure adequate labor and equipment are ready before the truck arrives.</li>
          </ul>

          <p>
            <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes. Actual requirements may differ based on site conditions, subgrade preparation, and local building codes. Always consult a licensed contractor for structural concrete projects.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>American Concrete Institute. (2020). ACI 332R-20 — Guide to Residential Concrete Construction.</li>
            <li>Portland Cement Association. (2021). Design and Control of Concrete Mixtures, 16th edition. PCA EB001.</li>
            <li>National Ready Mixed Concrete Association. (2023). Concrete in Practice — What, Why and How? CIP Series. nrmca.org.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Shape Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-amber-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            Project Specifications
          </h2>

          {/* Unit toggle */}
          <div className="flex gap-2 mb-4">
            {(["imperial", "metric"] as const).map((system) => (
              <button
                key={system}
                onClick={() => setUnitSystem(system)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  unitSystem === system
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {system === "imperial" ? "Imperial (ft/in)" : "Metric (m/cm)"}
              </button>
            ))}
          </div>

          {/* Shape selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {SHAPES.map((s) => (
              <button
                key={s.value}
                onClick={() => setShape(s.value)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  shape === s.value
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-2xl block mb-1">{s.icon}</span>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </button>
            ))}
          </div>

          {/* Dimension Inputs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(shape === "slab" || shape === "footing" || shape === "wall") && (
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Length ({unitSystem === "imperial" ? "feet" : "meters"})
                </label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {(shape === "slab" || shape === "footing") && (
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Width ({unitSystem === "imperial" ? "feet" : "meters"})
                </label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {(shape === "slab" || shape === "footing" || shape === "wall") && (
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  {shape === "wall" ? "Thickness" : "Depth"} ({unitSystem === "imperial" ? "inches" : "cm"})
                </label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {shape === "column" && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Diameter ({unitSystem === "imperial" ? "inches" : "cm"})
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={diameter}
                    onChange={(e) => setDiameter(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Height ({unitSystem === "imperial" ? "inches" : "cm"})
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            {shape === "wall" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Wall Height ({unitSystem === "imperial" ? "inches" : "cm"})
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Quantity (# of identical sections)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Waste Factor (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={wasteFactor}
                onChange={(e) => setWasteFactor(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Cost per Cubic Yard ($)
              </label>
              <input
                type="number"
                min={0}
                step={5}
                value={costPerYard}
                onChange={(e) => setCostPerYard(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Main Volume Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <Layers className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(result.cubicYards)} yd³
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (incl. {wasteFactor}% waste)
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Ruler className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Cubic Feet</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(result.volumeCuFt)} ft³
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Ruler className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Cubic Meters</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatNumber(result.cubicMeters)} m³
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <DollarSign className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(result.estimatedCost)}
                </p>
              </div>
            </div>

            {/* Bag Estimates */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Package className="h-5 w-5 text-primary" />
                Pre-Mixed Bag Estimates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.bags.map((bag) => (
                  <div key={bag.weight} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{bag.count}</p>
                    <p className="text-sm text-muted-foreground">{bag.label} bags</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ({bag.yieldCuFt} ft³ per bag)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Net volume:</strong> {formatNumber(result.rawVolumeCuFt)} cu ft
                    <span className="mx-2">|</span>
                    <strong>Waste allowance:</strong> +{formatNumber(result.wasteVolumeCuFt)} cu ft ({wasteFactor}%)
                    <span className="mx-2">|</span>
                    <strong>Estimated weight:</strong> {result.weight.toLocaleString()} lbs ({Math.round(result.weight / 2.205).toLocaleString()} kg)
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
