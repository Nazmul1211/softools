"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Grid3X3, Package, DollarSign, Ruler } from "lucide-react";

type Pattern = "straight" | "diagonal" | "herringbone";

const patternWasteDefaults: Record<Pattern, number> = {
  straight: 10,
  diagonal: 14,
  herringbone: 16,
};

const faqs: FAQItem[] = [
  {
    question: "How do I calculate tile quantity for a floor or wall?",
    answer:
      "Measure the target area in square feet, adjust for layout waste, then divide by per-tile coverage to estimate piece count. Finally convert pieces to boxes based on tiles per carton. This calculator handles those steps automatically and adds thinset and grout planning inputs for practical ordering.",
  },
  {
    question: "Does grout joint width affect tile count?",
    answer:
      "Yes. Wider joints slightly increase module size, which can lower theoretical tile count, but real-world cuts and edge conditions still drive waste. This calculator includes grout joint input for better planning while preserving a waste factor to keep estimates realistic for install conditions.",
  },
  {
    question: "What waste percentage should I use for tile?",
    answer:
      "Straight layouts commonly use around 10%, diagonal around 12-15%, and complex patterns can need 15% or more. Waste covers perimeter cuts, breakage, matching, and installer trimming choices. If tile lead times are long or shade variations are possible, many installers intentionally round up beyond minimum waste.",
  },
  {
    question: "How many thinset and grout bags do I need?",
    answer:
      "Bag counts depend on trowel notch size, substrate flatness, tile format, and joint width. This tool uses configurable coverage assumptions so you can align estimates to your product data sheets. Always confirm final adhesive and grout quantities with manufacturer guidance for your specific tile system.",
  },
  {
    question: "Can I use this for walls, backsplashes, and showers?",
    answer:
      "Yes. Enter wall dimensions instead of floor dimensions and use appropriate waste assumptions for cut-heavy layouts around outlets, niches, and fixtures. For wet areas, include membrane and waterproofing materials separately because tile quantity alone is not a complete shower system estimate.",
  },
  {
    question: "Why do professionals recommend ordering extra tile?",
    answer:
      "Future repairs are the main reason. Tile styles are often discontinued, and dye lots can vary over time. A small overage now can prevent difficult matching problems later. This calculator provides planning quantities, but many installers still recommend at least one extra box for maintenance stock.",
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

export default function TileCalculatorPage() {
  const [areaLength, setAreaLength] = useState(14);
  const [areaWidth, setAreaWidth] = useState(10);
  const [tileLength, setTileLength] = useState(12);
  const [tileWidth, setTileWidth] = useState(12);
  const [groutJoint, setGroutJoint] = useState(0.125);
  const [pattern, setPattern] = useState<Pattern>("straight");
  const [wastePercent, setWastePercent] = useState(patternWasteDefaults.straight);
  const [tilesPerBox, setTilesPerBox] = useState(10);
  const [pricePerBox, setPricePerBox] = useState(34);
  const [thinsetCoverage, setThinsetCoverage] = useState(60);
  const [thinsetPricePerBag, setThinsetPricePerBag] = useState(18);
  const [groutCoverage, setGroutCoverage] = useState(200);
  const [groutPricePerBag, setGroutPricePerBag] = useState(22);

  const result = useMemo(() => {
    const baseArea = Math.max(0, areaLength * areaWidth);
    const areaWithWaste = baseArea * (1 + Math.max(0, wastePercent) / 100);

    const moduleLength = Math.max(0.1, tileLength + groutJoint);
    const moduleWidth = Math.max(0.1, tileWidth + groutJoint);
    const tileCoverageSqFt = (moduleLength * moduleWidth) / 144;

    const tilesNeeded = Math.ceil(areaWithWaste / tileCoverageSqFt);
    const boxesNeeded = Math.ceil(tilesNeeded / Math.max(1, tilesPerBox));

    const groutFactor = Math.max(0.5, groutJoint / 0.125);
    const groutBags = Math.ceil(areaWithWaste / Math.max(1, groutCoverage / groutFactor));
    const thinsetBags = Math.ceil(areaWithWaste / Math.max(1, thinsetCoverage));

    const tileCost = boxesNeeded * pricePerBox;
    const thinsetCost = thinsetBags * thinsetPricePerBag;
    const groutCost = groutBags * groutPricePerBag;
    const totalCost = tileCost + thinsetCost + groutCost;

    return {
      baseArea,
      areaWithWaste,
      tileCoverageSqFt,
      tilesNeeded,
      boxesNeeded,
      thinsetBags,
      groutBags,
      tileCost,
      thinsetCost,
      groutCost,
      totalCost,
    };
  }, [
    areaLength,
    areaWidth,
    tileLength,
    tileWidth,
    groutJoint,
    wastePercent,
    tilesPerBox,
    pricePerBox,
    thinsetCoverage,
    thinsetPricePerBag,
    groutCoverage,
    groutPricePerBag,
  ]);

  return (
    <ToolLayout
      title="Tile Calculator"
      slug="tile-calculator"
      description="Estimate tile quantity, boxes, thinset, grout, and total material budget from area dimensions, tile size, grout joints, and layout pattern."
      category={{ name: "Construction & Home", slug: "construction-calculators" }}
      relatedTools={[
        { name: "Flooring Calculator", href: "/flooring-calculator/" },
        { name: "Paint Calculator", href: "/paint-calculator/" },
        { name: "Square Footage Calculator", href: "/square-footage-calculator/" },
        { name: "Concrete Calculator", href: "/concrete-calculator/" },
      ]}
      howToSteps={[
        { name: "Set area dimensions", text: "Enter floor or wall dimensions in feet." },
        { name: "Define tile module", text: "Add tile size and grout joint assumptions." },
        { name: "Select layout pattern", text: "Use waste percentages matched to install style." },
        { name: "Review quantities", text: "Use tiles, boxes, thinset, and grout outputs to order." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this tile calculator does</h2>
          <p>
            This calculator turns room dimensions into practical tile ordering numbers. It estimates tile pieces, box
            count, thinset bags, grout bags, and an overall material budget. By combining layout pattern waste,
            grout-joint assumptions, and packaging details, it helps avoid costly under-ordering on flooring and wall
            tile projects.
          </p>

          <h2>Core calculation flow</h2>
          <p>
            The tool computes area in square feet, adds waste based on pattern complexity, and converts that
            waste-adjusted area into tile count using tile-module coverage. Module coverage includes grout joint width
            so piece-count assumptions are closer to real layout geometry.
          </p>

          <h2>Why pattern and grout settings matter</h2>
          <p>
            Diagonal and decorative patterns create more offcuts than straight layouts. Grout joints also alter module
            spacing. Together, these factors shift quantity and cost outcomes. The calculator exposes these variables so
            you can quickly test conservative vs aggressive ordering strategies before purchase.
          </p>

          <h2>Material budget interpretation</h2>
          <p>
            Tile cost usually dominates budget, but adhesive and grout can still be meaningful, especially on larger
            jobs. Use this output as a material baseline, then add trims, transitions, membrane, leveling systems, and
            labor for full project cost planning.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>Tile Council of North America (TCNA) installation handbook practices.</li>
            <li>ANSI tile installation standards for mortar and grout systems.</li>
            <li>Manufacturer technical sheets for thinset and grout coverage rates.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Grid3X3, title: "Tile Count", sub: "Module-based piece estimate" },
            { icon: Ruler, title: "Joint Aware", sub: "Grout spacing included" },
            { icon: Package, title: "Materials", sub: "Boxes + thinset + grout" },
            { icon: DollarSign, title: "Cost View", sub: "Combined material budget" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Tile Inputs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Area Length (ft)"
              type="number"
              min={0}
              value={areaLength}
              onChange={(e) => setAreaLength(Number(e.target.value))}
            />
            <Input
              label="Area Width (ft)"
              type="number"
              min={0}
              value={areaWidth}
              onChange={(e) => setAreaWidth(Number(e.target.value))}
            />
            <Input
              label="Tile Length (in)"
              type="number"
              min={0.1}
              value={tileLength}
              onChange={(e) => setTileLength(Number(e.target.value))}
            />
            <Input
              label="Tile Width (in)"
              type="number"
              min={0.1}
              value={tileWidth}
              onChange={(e) => setTileWidth(Number(e.target.value))}
            />
            <Input
              label="Grout Joint (in)"
              type="number"
              min={0.03}
              step={0.01}
              value={groutJoint}
              onChange={(e) => setGroutJoint(Number(e.target.value))}
            />
            <Select
              label="Pattern"
              id="pattern"
              value={pattern}
              onChange={(e) => {
                const next = e.target.value as Pattern;
                setPattern(next);
                setWastePercent(patternWasteDefaults[next]);
              }}
              options={[
                { value: "straight", label: "Straight" },
                { value: "diagonal", label: "Diagonal" },
                { value: "herringbone", label: "Herringbone / Complex" },
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
              label="Tiles per Box"
              type="number"
              min={1}
              value={tilesPerBox}
              onChange={(e) => setTilesPerBox(Number(e.target.value))}
            />
            <Input
              label="Price per Box ($)"
              type="number"
              min={0}
              value={pricePerBox}
              onChange={(e) => setPricePerBox(Number(e.target.value))}
            />
            <Input
              label="Thinset Coverage (sq ft/bag)"
              type="number"
              min={1}
              value={thinsetCoverage}
              onChange={(e) => setThinsetCoverage(Number(e.target.value))}
            />
            <Input
              label="Thinset Price / Bag ($)"
              type="number"
              min={0}
              value={thinsetPricePerBag}
              onChange={(e) => setThinsetPricePerBag(Number(e.target.value))}
            />
            <Input
              label="Grout Coverage (sq ft/bag)"
              type="number"
              min={1}
              value={groutCoverage}
              onChange={(e) => setGroutCoverage(Number(e.target.value))}
            />
            <Input
              label="Grout Price / Bag ($)"
              type="number"
              min={0}
              value={groutPricePerBag}
              onChange={(e) => setGroutPricePerBag(Number(e.target.value))}
            />
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard label="Area with Waste" value={result.areaWithWaste.toFixed(1)} unit="sq ft" highlight />
          <ResultCard label="Tile Coverage per Piece" value={result.tileCoverageSqFt.toFixed(3)} unit="sq ft" />
          <ResultCard label="Tiles Needed" value={result.tilesNeeded} />
          <ResultCard label="Boxes Needed" value={result.boxesNeeded} />
          <ResultCard label="Thinset Bags" value={result.thinsetBags} />
          <ResultCard label="Grout Bags" value={result.groutBags} />
          <ResultCard label="Tile Cost" value={formatCurrency(result.tileCost)} />
          <ResultCard label="Total Material Cost" value={formatCurrency(result.totalCost)} />
        </ResultsGrid>
      </div>
    </ToolLayout>
  );
}
