"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  Ruler,
  Plus,
  Trash2,
  Calculator,
  Maximize2,
  RefreshCcw,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "How do I calculate square footage?",
    answer:
      "For a rectangle or square, multiply length × width. For example, a room that is 12 feet long and 10 feet wide is 120 square feet (12 × 10 = 120). If your measurements include inches, convert them to decimal feet first: divide inches by 12 and add to the feet measurement. So 12 feet 6 inches = 12.5 feet. For non-rectangular shapes, our calculator provides formulas for triangles, circles, and trapezoids.",
  },
  {
    question: "How do I convert square feet to square meters?",
    answer:
      "Multiply square feet by 0.0929 to get square meters. For example, 500 sq ft × 0.0929 = 46.45 sq m. To convert square meters to square feet, multiply by 10.764. Our calculator provides automatic conversions between all common area units including square feet, square meters, square yards, and acres.",
  },
  {
    question: "How do I calculate square footage for an irregularly shaped room?",
    answer:
      "Break the irregular shape into smaller regular shapes (rectangles, triangles, etc.). Calculate the area of each shape separately, then add them together. For example, an L-shaped room can be divided into two rectangles. A room with a bay window can be calculated as a rectangle plus a triangle or trapezoid. Use our multi-area feature to add multiple shapes and get the total automatically.",
  },
  {
    question: "How much flooring do I need?",
    answer:
      "Calculate the total square footage of the area, then add 5–10% for waste (cutting, mistakes, and future repairs). For tile, add 10–15% because tiles must be cut at walls and transitions. For hardwood, add 5–10%. For carpet, rolls come in standard widths (12 or 15 feet), so calculate based on roll layout to minimize seams. Our calculator includes a waste factor to help you order the right amount.",
  },
  {
    question: "What is the difference between square feet and linear feet?",
    answer:
      "Square feet measures area (two dimensions — length × width), while linear feet measures only length (one dimension). If you buy 100 linear feet of fencing, that's the total length. If you buy 100 square feet of flooring, that covers a 10×10 foot area. Materials like crown molding, baseboards, and gutters are sold by linear foot, while flooring, paint coverage, and roofing are sold by square foot.",
  },
  {
    question: "How do I calculate wall square footage for painting?",
    answer:
      "Multiply the wall length × wall height to get the total wall area. For a room, add up all four walls, then subtract the area of doors (approximately 21 sq ft each for standard doors) and windows (approximately 15 sq ft each for standard windows). One gallon of paint typically covers 350–400 square feet with one coat. For two coats, double the area or halve the coverage per gallon.",
  },
];

// ─── Types ─────────────────────────────────────────
type AreaShape = "rectangle" | "triangle" | "circle" | "trapezoid";

interface AreaEntry {
  id: number;
  shape: AreaShape;
  label: string;
  // Rectangle
  length: number;
  width: number;
  // Triangle
  base: number;
  triangleHeight: number;
  // Circle
  radius: number;
  // Trapezoid
  topWidth: number;
  bottomWidth: number;
  trapHeight: number;
}

// ─── Constants ─────────────────────────────────────
const SHAPE_OPTIONS: { value: AreaShape; label: string; formula: string }[] = [
  { value: "rectangle", label: "Rectangle / Square", formula: "L × W" },
  { value: "triangle", label: "Triangle", formula: "½ × b × h" },
  { value: "circle", label: "Circle", formula: "π × r²" },
  { value: "trapezoid", label: "Trapezoid", formula: "½ × (a+b) × h" },
];

let nextId = 1;

function createArea(shape: AreaShape = "rectangle"): AreaEntry {
  return {
    id: nextId++,
    shape,
    label: `Area ${nextId - 1}`,
    length: 12,
    width: 10,
    base: 10,
    triangleHeight: 8,
    radius: 5,
    topWidth: 8,
    bottomWidth: 12,
    trapHeight: 6,
  };
}

function calculateArea(entry: AreaEntry): number {
  switch (entry.shape) {
    case "rectangle":
      return entry.length * entry.width;
    case "triangle":
      return 0.5 * entry.base * entry.triangleHeight;
    case "circle":
      return Math.PI * entry.radius * entry.radius;
    case "trapezoid":
      return 0.5 * (entry.topWidth + entry.bottomWidth) * entry.trapHeight;
    default:
      return 0;
  }
}

function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ─── Component ─────────────────────────────────────
export default function SquareFootageCalculator() {
  const [areas, setAreas] = useState<AreaEntry[]>([createArea()]);
  const [wasteFactor, setWasteFactor] = useState(10);

  const results = useMemo(() => {
    const areaResults = areas.map((entry) => ({
      ...entry,
      sqFt: calculateArea(entry),
    }));

    const totalSqFt = areaResults.reduce((sum, a) => sum + a.sqFt, 0);
    const wasteAmount = totalSqFt * (wasteFactor / 100);
    const totalWithWaste = totalSqFt + wasteAmount;

    return {
      areas: areaResults,
      totalSqFt,
      totalWithWaste,
      wasteAmount,
      sqMeters: totalSqFt * 0.0929,
      sqYards: totalSqFt / 9,
      acres: totalSqFt / 43560,
      sqMetersWithWaste: totalWithWaste * 0.0929,
      sqYardsWithWaste: totalWithWaste / 9,
    };
  }, [areas, wasteFactor]);

  const addArea = () => {
    setAreas((prev) => [...prev, createArea()]);
  };

  const removeArea = (id: number) => {
    if (areas.length <= 1) return;
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const updateArea = (id: number, updates: Partial<AreaEntry>) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const reset = () => {
    nextId = 1;
    setAreas([createArea()]);
    setWasteFactor(10);
  };

  return (
    <ToolLayout
      title="Square Footage Calculator"
      description="Calculate the square footage of any area — rooms, floors, walls, yards, and land. Supports rectangles, triangles, circles, and trapezoids. Add multiple areas for total square footage with waste factor."
      category={{ name: "Construction & Home", slug: "construction-calculators" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Select Shape", text: "Choose rectangle, triangle, circle, or trapezoid." },
        { name: "Enter Dimensions", text: "Input length, width, radius, or other measurements in feet." },
        { name: "Add More Areas", text: "Click 'Add Area' to calculate multiple sections and get a combined total." },
        { name: "View Results", text: "See total square footage with conversions to sq meters, sq yards, and acres." },
      ]}
      relatedTools={[
        { name: "Concrete Calculator", href: "/concrete-calculator/" },
        { name: "Volume Calculator", href: "/volume-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Unit Converter", href: "/unit-converter/" },
        { name: "Triangle Calculator", href: "/triangle-calculator/" },
      ]}
      content={
        <>
          <h2>What Is Square Footage?</h2>
          <p>
            Square footage is a measurement of area expressed in square feet (ft² or sq ft). One square foot equals the area of a square that is one foot long on each side — precisely 144 square inches or approximately 0.0929 square meters. Square footage is the standard unit of area measurement in the United States for real estate, construction, interior design, and landscaping. Understanding how to calculate square footage accurately is essential for home buying, renovation planning, flooring installation, painting estimates, and material ordering.
          </p>

          <h2>How to Calculate Square Footage</h2>
          <h3>Rectangle or Square</h3>
          <p>
            <strong>Area = Length × Width</strong>
          </p>
          <p>
            A room measuring 15 feet by 12 feet has an area of 180 square feet (15 × 12 = 180). If measurements include inches, convert to decimal feet first: 15 feet 6 inches = 15.5 feet.
          </p>

          <h3>Triangle</h3>
          <p>
            <strong>Area = ½ × Base × Height</strong>
          </p>
          <p>
            A triangular section with a 10-foot base and 8-foot height has an area of 40 square feet (0.5 × 10 × 8 = 40).
          </p>

          <h3>Circle</h3>
          <p>
            <strong>Area = π × r²</strong>
          </p>
          <p>
            A circular patio with a 6-foot radius has an area of approximately 113.1 square feet (3.14159 × 6² = 113.1).
          </p>

          <h3>Trapezoid</h3>
          <p>
            <strong>Area = ½ × (a + b) × h</strong>
          </p>
          <p>
            Where a and b are the parallel sides and h is the height between them. A trapezoid with parallel sides of 8 and 12 feet and a height of 6 feet has an area of 60 square feet.
          </p>

          <h2>Calculating Square Footage for Common Projects</h2>
          <h3>Flooring</h3>
          <p>
            Measure each room separately. For rectangular rooms, multiply length × width. For L-shaped rooms, divide into two rectangles and add the areas. Always add a waste factor: <strong>5–10% for hardwood and laminate, 10–15% for tile.</strong> This accounts for cuts at walls, pattern matching, and replacement pieces for future repairs.
          </p>

          <h3>Painting</h3>
          <p>
            For walls, multiply length × height for each wall, then subtract doors (~21 sq ft each) and windows (~15 sq ft each). One gallon of paint covers 350–400 sq ft with one coat. For ceilings, calculate length × width of the room.
          </p>

          <h3>Landscaping</h3>
          <p>
            Measure the yard or garden bed dimensions. For mulch, topsoil, or gravel, you&apos;ll also need to multiply by the desired depth to get cubic footage (or use our Concrete Calculator for volume calculations).
          </p>

          <h2>Square Footage Conversion Table</h2>
          <table>
            <thead>
              <tr><th>From</th><th>To</th><th>Multiply By</th></tr>
            </thead>
            <tbody>
              <tr><td>Square feet</td><td>Square meters</td><td>0.0929</td></tr>
              <tr><td>Square meters</td><td>Square feet</td><td>10.764</td></tr>
              <tr><td>Square feet</td><td>Square yards</td><td>0.1111 (÷9)</td></tr>
              <tr><td>Square feet</td><td>Acres</td><td>0.000023 (÷43,560)</td></tr>
              <tr><td>Acres</td><td>Square feet</td><td>43,560</td></tr>
              <tr><td>Square inches</td><td>Square feet</td><td>0.00694 (÷144)</td></tr>
            </tbody>
          </table>

          <h2>Common Room Sizes</h2>
          <table>
            <thead>
              <tr><th>Room Type</th><th>Typical Size</th><th>Square Footage</th></tr>
            </thead>
            <tbody>
              <tr><td>Small bedroom</td><td>10×10 ft</td><td>100 sq ft</td></tr>
              <tr><td>Standard bedroom</td><td>12×12 ft</td><td>144 sq ft</td></tr>
              <tr><td>Master bedroom</td><td>14×16 ft</td><td>224 sq ft</td></tr>
              <tr><td>Living room</td><td>12×18 ft</td><td>216 sq ft</td></tr>
              <tr><td>Kitchen</td><td>10×12 ft</td><td>120 sq ft</td></tr>
              <tr><td>Bathroom</td><td>5×8 ft</td><td>40 sq ft</td></tr>
              <tr><td>1-car garage</td><td>12×20 ft</td><td>240 sq ft</td></tr>
              <tr><td>2-car garage</td><td>20×24 ft</td><td>480 sq ft</td></tr>
            </tbody>
          </table>

          <h2>Sources and References</h2>
          <ul>
            <li>National Institute of Standards and Technology (NIST). (2023). The International System of Units, 9th edition. NIST SP 330.</li>
            <li>National Association of Home Builders. (2022). Typical Room Dimensions and Square Footage by Home Size. Housing Economics.</li>
            <li>Residential Construction Standards, International Residential Code (IRC). (2021). ICC Digital Codes.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Area Entries */}
        <div className="space-y-4">
          {areas.map((area, index) => (
            <div
              key={area.id}
              className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Calculator className="h-5 w-5 text-primary" />
                  {areas.length > 1 ? `Area ${index + 1}` : "Dimensions"}
                </h3>
                {areas.length > 1 && (
                  <button
                    onClick={() => removeArea(area.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label="Remove area"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Shape Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {SHAPE_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateArea(area.id, { shape: s.value })}
                    className={`text-left p-2.5 rounded-lg border text-sm transition-all ${
                      area.shape === s.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.formula}</p>
                  </button>
                ))}
              </div>

              {/* Dimension Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                {area.shape === "rectangle" && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Length (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.length}
                        onChange={(e) => updateArea(area.id, { length: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Width (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.width}
                        onChange={(e) => updateArea(area.id, { width: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {area.shape === "triangle" && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Base (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.base}
                        onChange={(e) => updateArea(area.id, { base: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Height (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.triangleHeight}
                        onChange={(e) => updateArea(area.id, { triangleHeight: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {area.shape === "circle" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-muted-foreground">
                      Radius (feet)
                    </label>
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={area.radius}
                      onChange={(e) => updateArea(area.id, { radius: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                )}

                {area.shape === "trapezoid" && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Top Width / Side a (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.topWidth}
                        onChange={(e) => updateArea(area.id, { topWidth: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Bottom Width / Side b (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.bottomWidth}
                        onChange={(e) => updateArea(area.id, { bottomWidth: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-muted-foreground">
                        Height (feet)
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={area.trapHeight}
                        onChange={(e) => updateArea(area.id, { trapHeight: Number(e.target.value) })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Area result for this entry */}
              {areas.length > 1 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    This area: <strong className="text-foreground">{formatNumber(results.areas.find(a => a.id === area.id)?.sqFt || 0)} sq ft</strong>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Area & Waste */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={addArea}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-primary/50 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Area
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-muted-foreground">Waste:</label>
            <input
              type="number"
              min={0}
              max={30}
              value={wasteFactor}
              onChange={(e) => setWasteFactor(Number(e.target.value))}
              className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none text-center"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>

          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted transition-colors"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        {/* Results */}
        {results.totalSqFt > 0 && (
          <>
            {/* Main Result */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Maximize2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Square Footage</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatNumber(results.totalSqFt)} sq ft
                  </p>
                  {wasteFactor > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      With {wasteFactor}% waste: <strong className="text-foreground">{formatNumber(results.totalWithWaste)} sq ft</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Unit Conversions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Square Meters</p>
                <p className="text-xl font-bold text-foreground">
                  {formatNumber(results.sqMeters)} m²
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Square Yards</p>
                <p className="text-xl font-bold text-foreground">
                  {formatNumber(results.sqYards)} yd²
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Acres</p>
                <p className="text-xl font-bold text-foreground">
                  {formatNumber(results.acres, 4)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Waste Allowance</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  +{formatNumber(results.wasteAmount)} ft²
                </p>
              </div>
            </div>

            {/* Per-Area Breakdown (if multiple) */}
            {areas.length > 1 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Ruler className="h-5 w-5 text-primary" />
                  Area Breakdown
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">#</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Shape</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Dimensions</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Area (sq ft)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.areas.map((area, index) => (
                      <tr key={area.id} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{index + 1}</td>
                        <td className="py-2 pr-4 capitalize text-foreground">{area.shape}</td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {area.shape === "rectangle" && `${area.length} × ${area.width} ft`}
                          {area.shape === "triangle" && `base ${area.base} × height ${area.triangleHeight} ft`}
                          {area.shape === "circle" && `radius ${area.radius} ft`}
                          {area.shape === "trapezoid" && `(${area.topWidth} + ${area.bottomWidth}) × ${area.trapHeight} ft`}
                        </td>
                        <td className="py-2 text-right font-medium text-foreground">
                          {formatNumber(area.sqFt)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="py-2 pr-4 text-foreground" colSpan={3}>Total</td>
                      <td className="py-2 text-right text-primary">{formatNumber(results.totalSqFt)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
