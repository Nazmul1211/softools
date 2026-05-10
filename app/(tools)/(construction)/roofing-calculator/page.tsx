"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Home, Ruler, Package, DollarSign } from "lucide-react";

type RoofType = "gable" | "hip" | "complex";

const roofTypeFactor: Record<RoofType, number> = {
  gable: 1,
  hip: 1.1,
  complex: 1.18,
};

const faqs: FAQItem[] = [
  {
    question: "How do I calculate roof area from house dimensions?",
    answer:
      "Start with footprint area (length × width), then apply a slope factor from roof pitch and a complexity factor for roof geometry. A steeper pitch increases true roof surface area compared with flat footprint area. This calculator automates that conversion so material estimates are closer to real ordering quantities.",
  },
  {
    question: "What is a roofing square?",
    answer:
      "A roofing square equals 100 square feet of roof coverage. Most shingles and roofing quotes are priced in squares. After calculating total roof area with waste included, divide by 100 to get the number of squares. This is the core unit for bundle estimates and cost planning.",
  },
  {
    question: "How many shingle bundles are in one square?",
    answer:
      "Most asphalt shingle products need about 3 bundles per roofing square, though premium products can differ. Always verify manufacturer packaging for the exact bundle coverage. This tool uses 3 bundles per square as a practical baseline to help you avoid under-ordering.",
  },
  {
    question: "How much waste should I include?",
    answer:
      "Simple gable roofs often use 8-12% waste, hips and valleys often need 12-15%, and complex roofs may need 15-20% depending on cuts and layout. Waste accounts for trimming, starter/edge pieces, breakage, and installation realities. Running short is usually more expensive than a modest overage.",
  },
  {
    question: "Can this estimate roofing cost too?",
    answer:
      "Yes. Enter material and labor cost per square to generate a first-pass total estimate. This helps compare bids and budget ranges. For final procurement, include accessories such as underlayment, drip edge, ventilation, flashing, and disposal costs based on local contractor pricing.",
  },
  {
    question: "Is this suitable for metal or tile roofs?",
    answer:
      "The geometry logic is still useful for area estimation, but bundle and accessory assumptions are tuned for common shingle workflows. If you are pricing metal panels or tile systems, keep the area output and substitute your own coverage, overlap, and waste assumptions from supplier specifications.",
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

export default function RoofingCalculatorPage() {
  const [roofType, setRoofType] = useState<RoofType>("gable");
  const [length, setLength] = useState(48);
  const [width, setWidth] = useState(32);
  const [pitchRise, setPitchRise] = useState(6);
  const [wastePercent, setWastePercent] = useState(12);
  const [materialCostPerSquare, setMaterialCostPerSquare] = useState(165);
  const [laborCostPerSquare, setLaborCostPerSquare] = useState(140);

  const result = useMemo(() => {
    const footprint = Math.max(0, length * width);
    const slopeFactor = Math.sqrt(12 ** 2 + pitchRise ** 2) / 12;
    const baseArea = footprint * slopeFactor * roofTypeFactor[roofType];
    const areaWithWaste = baseArea * (1 + Math.max(0, wastePercent) / 100);
    const squares = areaWithWaste / 100;
    const bundles = Math.ceil(squares * 3);
    const underlaymentRolls = Math.ceil(areaWithWaste / 400);
    const dripEdgeFeet = Math.ceil((2 * (length + width)) * (roofType === "complex" ? 1.15 : 1.05));
    const materialCost = squares * materialCostPerSquare;
    const laborCost = squares * laborCostPerSquare;
    const totalCost = materialCost + laborCost;

    return {
      footprint,
      slopeFactor,
      baseArea,
      areaWithWaste,
      squares,
      bundles,
      underlaymentRolls,
      dripEdgeFeet,
      materialCost,
      laborCost,
      totalCost,
    };
  }, [length, width, pitchRise, roofType, wastePercent, materialCostPerSquare, laborCostPerSquare]);

  return (
    <ToolLayout
      title="Roofing Calculator"
      slug="roofing-calculator"
      description="Estimate roof area, roofing squares, shingle bundles, accessory quantities, and budget range from roof dimensions, pitch, and waste factor."
      category={{ name: "Construction & Home", slug: "construction-calculators" }}
      relatedTools={[
        { name: "Square Footage Calculator", href: "/square-footage-calculator/" },
        { name: "Paint Calculator", href: "/paint-calculator/" },
        { name: "Flooring Calculator", href: "/flooring-calculator/" },
        { name: "Concrete Calculator", href: "/concrete-calculator/" },
      ]}
      howToSteps={[
        { name: "Add roof footprint", text: "Enter house length and width in feet." },
        { name: "Set pitch and type", text: "Choose roof geometry and rise-over-12 pitch." },
        { name: "Apply waste", text: "Use a realistic waste factor based on roof complexity." },
        { name: "Review materials", text: "Use squares, bundles, and cost outputs for planning." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this roofing calculator does</h2>
          <p>
            This calculator converts roof footprint dimensions into practical ordering quantities for roofing projects.
            It estimates sloped roof area, roofing squares, shingle bundles, underlayment rolls, drip edge length, and
            total budget based on your material and labor assumptions. That makes it useful for homeowner planning,
            contractor bid comparison, and pre-purchase quantity checks.
          </p>

          <h2>How the math works</h2>
          <p>
            The base of the calculation is footprint area (length × width). Because roofs are sloped surfaces, true
            area is larger than footprint area. A slope factor derived from pitch (rise over 12) scales footprint area
            to approximate roof surface coverage. Roof type factor then adjusts for geometry complexity, and waste
            percentage accounts for cuts, starter courses, valleys, and breakage.
          </p>

          <h2>Material planning metrics</h2>
          <ul>
            <li>Roofing squares: area ÷ 100 square feet.</li>
            <li>Shingle bundles: approximately 3 bundles per square.</li>
            <li>Underlayment rolls: estimated from roll coverage assumptions.</li>
            <li>Drip edge: perimeter-based estimate with complexity adjustment.</li>
          </ul>

          <h2>Cost interpretation guide</h2>
          <p>
            Use material and labor totals as a budget baseline, not as a signed quote. Contractor pricing can vary by
            region, tear-off complexity, deck repairs, ventilation upgrades, flashing conditions, and disposal fees.
            Still, this estimate helps identify outlier bids and set a realistic financing range before you request
            formal proposals.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>National Roofing Contractors Association installation guides.</li>
            <li>Asphalt Roofing Manufacturers Association best-practice documentation.</li>
            <li>International Residential Code (IRC) roof covering requirements.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Home, title: "Roof Geometry", sub: "Pitch-aware area conversion" },
            { icon: Ruler, title: "Coverage Planning", sub: "Squares + bundles + edge" },
            { icon: Package, title: "Material Baseline", sub: "Order-ready estimate" },
            { icon: DollarSign, title: "Budget Preview", sub: "Material + labor" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Roof Inputs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input label="Length (ft)" type="number" min={1} value={length} onChange={(e) => setLength(Number(e.target.value))} />
            <Input label="Width (ft)" type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
            <Input
              label="Pitch Rise (x/12)"
              type="number"
              min={1}
              max={20}
              value={pitchRise}
              onChange={(e) => setPitchRise(Number(e.target.value))}
            />
            <Select
              label="Roof Type"
              id="roof-type"
              value={roofType}
              onChange={(e) => setRoofType(e.target.value as RoofType)}
              options={[
                { value: "gable", label: "Gable" },
                { value: "hip", label: "Hip" },
                { value: "complex", label: "Complex / Multi-plane" },
              ]}
            />
            <Input
              label="Waste (%)"
              type="number"
              min={0}
              max={30}
              value={wastePercent}
              onChange={(e) => setWastePercent(Number(e.target.value))}
            />
            <Input
              label="Material Cost per Square ($)"
              type="number"
              min={0}
              value={materialCostPerSquare}
              onChange={(e) => setMaterialCostPerSquare(Number(e.target.value))}
            />
            <Input
              label="Labor Cost per Square ($)"
              type="number"
              min={0}
              value={laborCostPerSquare}
              onChange={(e) => setLaborCostPerSquare(Number(e.target.value))}
            />
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard label="Total Roof Area (with waste)" value={result.areaWithWaste.toFixed(1)} unit="sq ft" highlight />
          <ResultCard label="Roofing Squares" value={result.squares.toFixed(2)} />
          <ResultCard label="Shingle Bundles (est.)" value={result.bundles} />
          <ResultCard label="Underlayment Rolls (est.)" value={result.underlaymentRolls} />
          <ResultCard label="Drip Edge Length (est.)" value={result.dripEdgeFeet} unit="ft" />
          <ResultCard label="Total Estimated Cost" value={formatCurrency(result.totalCost)} />
        </ResultsGrid>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Base footprint: <strong className="text-foreground">{result.footprint.toFixed(0)} sq ft</strong> | Slope factor:{" "}
          <strong className="text-foreground">{result.slopeFactor.toFixed(3)}</strong> | Material-only cost:{" "}
          <strong className="text-foreground">{formatCurrency(result.materialCost)}</strong>
        </div>
      </div>
    </ToolLayout>
  );
}
