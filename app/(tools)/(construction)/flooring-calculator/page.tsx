"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Grid2X2, Layers, Package, DollarSign, Plus, Trash2 } from "lucide-react";

type Pattern = "straight" | "diagonal" | "herringbone";

interface Room {
  id: number;
  name: string;
  length: number;
  width: number;
}

const patternWasteDefaults: Record<Pattern, number> = {
  straight: 8,
  diagonal: 12,
  herringbone: 15,
};

const faqs: FAQItem[] = [
  {
    question: "How do I estimate flooring quantity accurately?",
    answer:
      "Measure each room section, calculate area (length × width), and add all sections together. Then apply a waste factor based on layout pattern and room complexity. This calculator supports multiple rooms and waste assumptions so your order quantity is closer to real install conditions.",
  },
  {
    question: "How much waste should I add for flooring?",
    answer:
      "Straight installs often use 5-10% waste, diagonal layouts usually need around 10-15%, and herringbone or other complex patterns can need 12-18%. Waste covers perimeter cuts, pattern matching, and damaged boards. Ordering too little often causes delays and shade-lot mismatch risks.",
  },
  {
    question: "How many boxes of flooring do I need?",
    answer:
      "After calculating total area with waste, divide by the manufacturer&apos;s box coverage (square feet per box), then round up to a whole box. Flooring is sold in full cartons, and partial box ordering is uncommon. This calculator automatically rounds up to avoid under-ordering.",
  },
  {
    question: "Does this include underlayment and total cost?",
    answer:
      "Yes. You can estimate underlayment from total area and apply a per-square-foot underlayment price. Combined with flooring box cost, this gives a fast material budget baseline. You can then add trim, transitions, and labor separately for a fuller project estimate.",
  },
  {
    question: "Can I use this for laminate, vinyl, and engineered wood?",
    answer:
      "Yes. The geometry and box-coverage math is format-agnostic. You only need accurate product coverage per box and realistic waste assumptions for your layout. For specialty products with unique install instructions, keep the area result and apply manufacturer-specific requirements.",
  },
  {
    question: "Why do installers suggest extra boxes?",
    answer:
      "Beyond immediate waste, extra boxes support future repairs when exact color lot and product SKU may no longer be available. Keeping spare material is common best practice. This calculator gives planning quantities, but many pros still round up an additional box for long-term maintenance coverage.",
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

let roomCounter = 2;

export default function FlooringCalculatorPage() {
  const [rooms, setRooms] = useState<Room[]>([{ id: 1, name: "Room 1", length: 16, width: 12 }]);
  const [pattern, setPattern] = useState<Pattern>("straight");
  const [wastePercent, setWastePercent] = useState(patternWasteDefaults.straight);
  const [boxCoverage, setBoxCoverage] = useState(22.5);
  const [pricePerBox, setPricePerBox] = useState(62);
  const [underlaymentPricePerSqFt, setUnderlaymentPricePerSqFt] = useState(0.45);

  const result = useMemo(() => {
    const roomAreas = rooms.map((room) => ({
      ...room,
      area: Math.max(0, room.length * room.width),
    }));
    const totalArea = roomAreas.reduce((acc, room) => acc + room.area, 0);
    const wasteArea = totalArea * (Math.max(0, wastePercent) / 100);
    const totalWithWaste = totalArea + wasteArea;
    const boxes = Math.ceil(totalWithWaste / Math.max(0.0001, boxCoverage));
    const flooringCost = boxes * pricePerBox;
    const underlaymentCost = totalWithWaste * underlaymentPricePerSqFt;
    const totalCost = flooringCost + underlaymentCost;

    return {
      roomAreas,
      totalArea,
      wasteArea,
      totalWithWaste,
      boxes,
      flooringCost,
      underlaymentCost,
      totalCost,
    };
  }, [rooms, wastePercent, boxCoverage, pricePerBox, underlaymentPricePerSqFt]);

  const addRoom = () => {
    setRooms((prev) => [...prev, { id: roomCounter, name: `Room ${roomCounter}`, length: 12, width: 10 }]);
    roomCounter += 1;
  };

  const updateRoom = (id: number, patch: Partial<Room>) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...patch } : room)));
  };

  const removeRoom = (id: number) => {
    setRooms((prev) => (prev.length > 1 ? prev.filter((room) => room.id !== id) : prev));
  };

  return (
    <ToolLayout
      title="Flooring Calculator"
      slug="flooring-calculator"
      description="Estimate flooring area, waste-adjusted quantity, box count, underlayment, and material cost for laminate, vinyl, hardwood, or engineered flooring projects."
      category={{ name: "Construction & Home", slug: "construction-calculators" }}
      relatedTools={[
        { name: "Tile Calculator", href: "/tile-calculator/" },
        { name: "Paint Calculator", href: "/paint-calculator/" },
        { name: "Square Footage Calculator", href: "/square-footage-calculator/" },
        { name: "Roofing Calculator", href: "/roofing-calculator/" },
      ]}
      howToSteps={[
        { name: "Add room sections", text: "Enter each room or area separately for better accuracy." },
        { name: "Set pattern and waste", text: "Choose install style and adjust waste percentage." },
        { name: "Enter product details", text: "Use flooring box coverage and cost per box." },
        { name: "Review materials", text: "Use box count and cost output for ordering and budget." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this flooring calculator does</h2>
          <p>
            This calculator helps you estimate how much flooring to buy by combining room-by-room area measurement with
            layout waste assumptions. It then converts area into box count and material cost using your product&apos;s
            coverage per carton. You can also include underlayment pricing for a more complete material budget.
          </p>

          <h2>Room-by-room method</h2>
          <p>
            Instead of estimating one large rectangle, this tool supports multiple room sections. That improves
            planning for L-shapes, hallways, and combined living spaces. Each room area is calculated separately and
            summed into a project total before waste and packaging conversions are applied.
          </p>

          <h2>Waste and pattern effects</h2>
          <p>
            Installation pattern directly affects cutting waste. Straight layouts are generally most efficient.
            Diagonal and herringbone patterns create additional offcuts and require higher waste allowances. The pattern
            selector provides default waste guidance you can override based on installer experience and room complexity.
          </p>

          <h2>Cost planning</h2>
          <p>
            Flooring cost is computed from full-box quantity, and underlayment is estimated from waste-adjusted area.
            These values are strong first-pass budgeting inputs before adding trim pieces, transitions, moisture barrier
            details, and labor. They help you compare products and avoid budget surprises.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>Manufacturer installation guides for laminate, LVP, and engineered wood systems.</li>
            <li>National Wood Flooring Association layout and waste guidance.</li>
            <li>Residential flooring contractor estimating best practices.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Grid2X2, title: "Multi-Room Input", sub: "Accurate section-based totals" },
            { icon: Layers, title: "Pattern-Aware", sub: "Waste by install style" },
            { icon: Package, title: "Box Count", sub: "Coverage-based carton estimate" },
            { icon: DollarSign, title: "Budget View", sub: "Flooring + underlayment" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Room Sections</h2>
            <button
              onClick={addRoom}
              className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <Plus className="mr-1 inline h-4 w-4" />
              Add Room
            </button>
          </div>

          <div className="space-y-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="grid items-end gap-3 rounded-lg border border-border bg-muted/20 p-3 md:grid-cols-[1.2fr_1fr_1fr_auto]"
              >
                <Input
                  label="Section Name"
                  value={room.name}
                  onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                />
                <Input
                  label="Length (ft)"
                  type="number"
                  min={0}
                  value={room.length}
                  onChange={(e) => updateRoom(room.id, { length: Number(e.target.value) })}
                />
                <Input
                  label="Width (ft)"
                  type="number"
                  min={0}
                  value={room.width}
                  onChange={(e) => updateRoom(room.id, { width: Number(e.target.value) })}
                />
                <button
                  onClick={() => removeRoom(room.id)}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                  aria-label={`Remove ${room.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Product and Cost Inputs</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Install Pattern"
              id="pattern"
              value={pattern}
              onChange={(e) => {
                const next = e.target.value as Pattern;
                setPattern(next);
                setWastePercent(patternWasteDefaults[next]);
              }}
              options={[
                { value: "straight", label: "Straight / Staggered" },
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
              label="Coverage per Box (sq ft)"
              type="number"
              min={0.1}
              step={0.1}
              value={boxCoverage}
              onChange={(e) => setBoxCoverage(Number(e.target.value))}
            />
            <Input
              label="Price per Box ($)"
              type="number"
              min={0}
              value={pricePerBox}
              onChange={(e) => setPricePerBox(Number(e.target.value))}
            />
            <Input
              label="Underlayment $/sq ft"
              type="number"
              min={0}
              step={0.01}
              value={underlaymentPricePerSqFt}
              onChange={(e) => setUnderlaymentPricePerSqFt(Number(e.target.value))}
            />
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard label="Total Area" value={result.totalArea.toFixed(1)} unit="sq ft" highlight />
          <ResultCard label="Area with Waste" value={result.totalWithWaste.toFixed(1)} unit="sq ft" />
          <ResultCard label="Boxes Required" value={result.boxes} />
          <ResultCard label="Waste Area" value={result.wasteArea.toFixed(1)} unit="sq ft" />
          <ResultCard label="Flooring Cost" value={formatCurrency(result.flooringCost)} />
          <ResultCard label="Total Material Cost" value={formatCurrency(result.totalCost)} />
        </ResultsGrid>
      </div>
    </ToolLayout>
  );
}
