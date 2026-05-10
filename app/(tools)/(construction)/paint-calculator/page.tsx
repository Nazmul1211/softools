"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { PaintBucket, Home, Layers, DollarSign } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "How many square feet does one gallon of paint cover?",
    answer:
      "Most interior paints cover roughly 300-400 square feet per gallon per coat, depending on surface texture and product formulation. Smooth, primed surfaces usually achieve higher coverage. Rough, porous, or dark-to-light repaints often need more paint. This calculator lets you set your own coverage value to match your product label.",
  },
  {
    question: "Should I include doors and windows in wall area?",
    answer:
      "For cleaner estimates, subtract door and window area from total wall surface before applying coats. This prevents over-ordering on projects with many openings. The calculator includes configurable door/window counts and standard opening sizes so you can quickly adapt estimates for small or complex rooms.",
  },
  {
    question: "Do I need primer and how much?",
    answer:
      "Primer is commonly used for new drywall, stained surfaces, major color changes, and repaired patches. It helps improve topcoat adhesion and can reduce final paint usage in difficult scenarios. This calculator can estimate primer gallons separately so your materials plan includes both prep and finish coats.",
  },
  {
    question: "How much extra paint should I buy for waste?",
    answer:
      "A waste factor of 8-15% is common. Lower values suit simple rectangular rooms; higher values suit textured surfaces, complex cut-ins, and first-time DIY projects. A modest buffer helps avoid project delays from running short and leaves touch-up inventory for future repairs.",
  },
  {
    question: "Can I use this for exterior painting?",
    answer:
      "Yes, but adjust assumptions. Exterior surfaces often have lower practical coverage because of texture, weathered substrate, and application method. If using sprayers, transfer efficiency can vary. Keep a higher waste factor and use manufacturer-specific exterior coverage data for best planning accuracy.",
  },
  {
    question: "Why does real paint usage differ from estimates?",
    answer:
      "Actual usage depends on roller nap, spray vs brush method, surface prep quality, moisture conditions, and how aggressively the previous color bleeds through. This tool provides a planning baseline. For final purchasing, combine the estimate with your paint brand&apos;s technical data sheet and installer experience.",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PaintCalculatorPage() {
  const [length, setLength] = useState(16);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(9);
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(2);
  const [doorArea, setDoorArea] = useState(21);
  const [windowArea, setWindowArea] = useState(15);
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [coats, setCoats] = useState(2);
  const [coveragePerGallon, setCoveragePerGallon] = useState(350);
  const [wastePercent, setWastePercent] = useState(12);
  const [paintCostPerGallon, setPaintCostPerGallon] = useState(42);
  const [includePrimer, setIncludePrimer] = useState(true);
  const [primerCoverage, setPrimerCoverage] = useState(300);
  const [primerCostPerGallon, setPrimerCostPerGallon] = useState(28);

  const result = useMemo(() => {
    const wallArea = Math.max(0, 2 * (length + width) * height);
    const openingArea = Math.max(0, doors * doorArea + windows * windowArea);
    const paintableWallArea = Math.max(0, wallArea - openingArea);
    const ceilingArea = includeCeiling ? Math.max(0, length * width) : 0;
    const baseArea = paintableWallArea + ceilingArea;

    const areaWithCoats = baseArea * Math.max(1, coats);
    const areaWithWaste = areaWithCoats * (1 + Math.max(0, wastePercent) / 100);
    const paintGallons = Math.ceil(areaWithWaste / Math.max(1, coveragePerGallon));
    const primerGallons = includePrimer ? Math.ceil(baseArea / Math.max(1, primerCoverage)) : 0;

    const paintCost = paintGallons * paintCostPerGallon;
    const primerCost = primerGallons * primerCostPerGallon;

    return {
      wallArea,
      openingArea,
      baseArea,
      areaWithCoats,
      areaWithWaste,
      paintGallons,
      primerGallons,
      paintCost,
      primerCost,
      totalCost: paintCost + primerCost,
    };
  }, [
    length,
    width,
    height,
    doors,
    windows,
    doorArea,
    windowArea,
    includeCeiling,
    coats,
    coveragePerGallon,
    wastePercent,
    paintCostPerGallon,
    includePrimer,
    primerCoverage,
    primerCostPerGallon,
  ]);

  return (
    <ToolLayout
      title="Paint Calculator"
      slug="paint-calculator"
      description="Estimate paint gallons, primer quantity, and room painting cost from dimensions, openings, coats, and coverage assumptions."
      category={{ name: "Construction & Home", slug: "construction-calculators" }}
      relatedTools={[
        { name: "Flooring Calculator", href: "/flooring-calculator/" },
        { name: "Tile Calculator", href: "/tile-calculator/" },
        { name: "Square Footage Calculator", href: "/square-footage-calculator/" },
        { name: "Roofing Calculator", href: "/roofing-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter room dimensions", text: "Set length, width, and wall height." },
        { name: "Subtract openings", text: "Add doors/windows to refine paintable area." },
        { name: "Choose paint assumptions", text: "Set coats, coverage, waste, and cost per gallon." },
        { name: "Review gallons and budget", text: "Use paint/primer totals for shopping and planning." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this paint calculator does</h2>
          <p>
            This calculator estimates how much paint and primer you need for a room, then converts that into a budget
            estimate. It accounts for room geometry, doors/windows, number of coats, waste factor, and product
            coverage. That makes it useful for both DIY planning and professional pre-bid material checks.
          </p>

          <h2>How the paint area is calculated</h2>
          <p>
            Wall area is calculated as 2 × (length + width) × height. Opening area (doors and windows) is subtracted
            so coverage is not overstated. Ceiling area can be included or excluded. The net area is then multiplied by
            the number of coats and adjusted by a waste factor.
          </p>

          <h2>Why coat count and coverage matter</h2>
          <p>
            Coverage is product-specific and can vary with surface preparation, texture, and application method. A
            single coat may be enough for maintenance repainting, but color changes often need two coats or more.
            Accurate assumptions on coverage and coats prevent both under-ordering and excess inventory.
          </p>

          <h2>Primer planning</h2>
          <p>
            Primer is often essential on bare drywall, patched walls, or high-contrast color transitions. Estimating it
            separately improves cost visibility and helps avoid disruptions during prep. If your product is paint +
            primer in one and your surface is clean and stable, you can disable primer and rely on finish-coat totals.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>Paint manufacturer technical data sheets (coverage and application rates).</li>
            <li>Painting and Decorating Contractors of America (PDCA) best practices.</li>
            <li>Residential painting standards and contractor estimating guidance.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Home, title: "Room Geometry", sub: "Walls + optional ceiling" },
            { icon: Layers, title: "Coat-Aware", sub: "Single or multiple coats" },
            { icon: PaintBucket, title: "Material Estimate", sub: "Paint + optional primer" },
            { icon: DollarSign, title: "Cost Forecast", sub: "Shopping budget preview" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Paint Inputs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input label="Length (ft)" type="number" min={1} value={length} onChange={(e) => setLength(Number(e.target.value))} />
            <Input label="Width (ft)" type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
            <Input label="Height (ft)" type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            <Input label="Coats" type="number" min={1} value={coats} onChange={(e) => setCoats(Number(e.target.value))} />
            <Input label="Doors (count)" type="number" min={0} value={doors} onChange={(e) => setDoors(Number(e.target.value))} />
            <Input label="Door Area (sq ft)" type="number" min={0} value={doorArea} onChange={(e) => setDoorArea(Number(e.target.value))} />
            <Input label="Windows (count)" type="number" min={0} value={windows} onChange={(e) => setWindows(Number(e.target.value))} />
            <Input label="Window Area (sq ft)" type="number" min={0} value={windowArea} onChange={(e) => setWindowArea(Number(e.target.value))} />
            <Input
              label="Paint Coverage (sq ft/gal)"
              type="number"
              min={100}
              value={coveragePerGallon}
              onChange={(e) => setCoveragePerGallon(Number(e.target.value))}
            />
            <Input label="Waste (%)" type="number" min={0} value={wastePercent} onChange={(e) => setWastePercent(Number(e.target.value))} />
            <Input
              label="Paint Cost / Gallon ($)"
              type="number"
              min={0}
              value={paintCostPerGallon}
              onChange={(e) => setPaintCostPerGallon(Number(e.target.value))}
            />
            <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={includeCeiling}
                onChange={(event) => setIncludeCeiling(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Include ceiling
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={includePrimer}
                onChange={(event) => setIncludePrimer(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Include primer
            </label>
            {includePrimer && (
              <>
                <Input
                  label="Primer Coverage (sq ft/gal)"
                  type="number"
                  min={100}
                  value={primerCoverage}
                  onChange={(e) => setPrimerCoverage(Number(e.target.value))}
                />
                <Input
                  label="Primer Cost / Gallon ($)"
                  type="number"
                  min={0}
                  value={primerCostPerGallon}
                  onChange={(e) => setPrimerCostPerGallon(Number(e.target.value))}
                />
              </>
            )}
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard label="Paint Gallons Needed" value={result.paintGallons} highlight />
          <ResultCard label="Primer Gallons Needed" value={result.primerGallons} />
          <ResultCard label="Paintable Area (base)" value={result.baseArea.toFixed(1)} unit="sq ft" />
          <ResultCard label="Area with Coats + Waste" value={result.areaWithWaste.toFixed(1)} unit="sq ft" />
          <ResultCard label="Paint Cost" value={formatCurrency(result.paintCost)} />
          <ResultCard label="Total Estimated Cost" value={formatCurrency(result.totalCost)} />
        </ResultsGrid>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Openings deducted: <strong className="text-foreground">{result.openingArea.toFixed(1)} sq ft</strong> | Wall
          area before deductions: <strong className="text-foreground">{result.wallArea.toFixed(1)} sq ft</strong>
        </div>
      </div>
    </ToolLayout>
  );
}
