"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type UnitCategory = "length" | "weight" | "temperature" | "volume" | "area" | "speed" | "time";

interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

type UnitMap = Record<string, UnitDefinition>;

const unitCategories: Record<UnitCategory, { label: string; baseUnit: string; units: UnitMap }> = {
  length: {
    label: "📏 Length",
    baseUnit: "meter",
    units: {
      kilometer: { name: "Kilometer", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      meter: { name: "Meter", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
      centimeter: { name: "Centimeter", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      millimeter: { name: "Millimeter", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mile: { name: "Mile", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      yard: { name: "Yard", symbol: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      foot: { name: "Foot", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      inch: { name: "Inch", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      nauticalMile: { name: "Nautical Mile", symbol: "nmi", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
    },
  },
  weight: {
    label: "⚖️ Weight/Mass",
    baseUnit: "kilogram",
    units: {
      tonne: { name: "Metric Ton", symbol: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      kilogram: { name: "Kilogram", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
      gram: { name: "Gram", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      milligram: { name: "Milligram", symbol: "mg", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      pound: { name: "Pound", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      ounce: { name: "Ounce", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      stone: { name: "Stone", symbol: "st", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
    },
  },
  temperature: {
    label: "🌡️ Temperature",
    baseUnit: "celsius",
    units: {
      celsius: { name: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
      fahrenheit: { name: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      kelvin: { name: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
  },
  volume: {
    label: "🧊 Volume",
    baseUnit: "liter",
    units: {
      cubicMeter: { name: "Cubic Meter", symbol: "m³", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      liter: { name: "Liter", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
      milliliter: { name: "Milliliter", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      gallon: { name: "US Gallon", symbol: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      quart: { name: "US Quart", symbol: "qt", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      pint: { name: "US Pint", symbol: "pt", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      cup: { name: "US Cup", symbol: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      fluidOunce: { name: "US Fluid Ounce", symbol: "fl oz", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
      tablespoon: { name: "Tablespoon", symbol: "tbsp", toBase: (v) => v * 0.0147868, fromBase: (v) => v / 0.0147868 },
      teaspoon: { name: "Teaspoon", symbol: "tsp", toBase: (v) => v * 0.00492892, fromBase: (v) => v / 0.00492892 },
    },
  },
  area: {
    label: "📐 Area",
    baseUnit: "squareMeter",
    units: {
      squareKilometer: { name: "Square Kilometer", symbol: "km²", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      squareMeter: { name: "Square Meter", symbol: "m²", toBase: (v) => v, fromBase: (v) => v },
      squareCentimeter: { name: "Square Centimeter", symbol: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
      hectare: { name: "Hectare", symbol: "ha", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      acre: { name: "Acre", symbol: "ac", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      squareMile: { name: "Square Mile", symbol: "mi²", toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
      squareYard: { name: "Square Yard", symbol: "yd²", toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
      squareFoot: { name: "Square Foot", symbol: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      squareInch: { name: "Square Inch", symbol: "in²", toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    },
  },
  speed: {
    label: "🚀 Speed",
    baseUnit: "meterPerSecond",
    units: {
      meterPerSecond: { name: "Meter per Second", symbol: "m/s", toBase: (v) => v, fromBase: (v) => v },
      kilometerPerHour: { name: "Kilometer per Hour", symbol: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      milePerHour: { name: "Mile per Hour", symbol: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      footPerSecond: { name: "Foot per Second", symbol: "ft/s", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      knot: { name: "Knot", symbol: "kn", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    },
  },
  time: {
    label: "⏱️ Time",
    baseUnit: "second",
    units: {
      year: { name: "Year", symbol: "yr", toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
      month: { name: "Month (30 days)", symbol: "mo", toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
      week: { name: "Week", symbol: "wk", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      day: { name: "Day", symbol: "d", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      hour: { name: "Hour", symbol: "hr", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      minute: { name: "Minute", symbol: "min", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      second: { name: "Second", symbol: "s", toBase: (v) => v, fromBase: (v) => v },
      millisecond: { name: "Millisecond", symbol: "ms", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    },
  },
};

function formatNumber(num: number): string {
  if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999999) {
    return num.toExponential(6);
  }
  if (Number.isInteger(num)) return num.toLocaleString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [inputValue, setInputValue] = useState("1");

  const currentCategory = unitCategories[category];
  const unitOptions = Object.entries(currentCategory.units).map(([key, unit]) => ({
    value: key,
    label: `${unit.name} (${unit.symbol})`,
  }));

  // Convert value
  const result = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return null;

    const fromDef = currentCategory.units[fromUnit];
    const toDef = currentCategory.units[toUnit];
    if (!fromDef || !toDef) return null;

    const baseValue = fromDef.toBase(num);
    return toDef.fromBase(baseValue);
  }, [inputValue, fromUnit, toUnit, currentCategory]);

  // All conversions for the current value
  const allConversions = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return [];

    const fromDef = currentCategory.units[fromUnit];
    if (!fromDef) return [];

    const baseValue = fromDef.toBase(num);

    return Object.entries(currentCategory.units)
      .filter(([key]) => key !== fromUnit)
      .map(([key, unit]) => ({
        key,
        name: unit.name,
        symbol: unit.symbol,
        value: unit.fromBase(baseValue),
      }))
      .sort((a, b) => b.value - a.value);
  }, [inputValue, fromUnit, currentCategory]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const units = Object.keys(unitCategories[newCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement. Support for length, weight, temperature, volume, area, speed, and time conversions."
      category={{ name: "Unit Converters", slug: "unit-converters" }}
      relatedTools={[
        { name: "Temperature Converter", href: "/temperature-converter" },
        { name: "Length Converter", href: "/length-converter" },
        { name: "Weight Converter", href: "/weight-converter" },
      ]}
      content={
        <>
          <h2>About Unit Conversion</h2>
          <p>
            Unit conversion is the process of converting a measurement from one unit to another 
            within the same measurement system or between different systems. This tool supports 
            both the metric (SI) and imperial measurement systems.
          </p>

          <h2>Supported Categories</h2>
          <ul>
            <li><strong>Length:</strong> Kilometers, meters, miles, feet, inches, and more</li>
            <li><strong>Weight/Mass:</strong> Kilograms, grams, pounds, ounces, stones</li>
            <li><strong>Temperature:</strong> Celsius, Fahrenheit, and Kelvin</li>
            <li><strong>Volume:</strong> Liters, gallons, cups, tablespoons</li>
            <li><strong>Area:</strong> Square meters, acres, hectares, square feet</li>
            <li><strong>Speed:</strong> m/s, km/h, mph, knots</li>
            <li><strong>Time:</strong> Years, days, hours, minutes, seconds</li>
          </ul>

          <h2>Common Conversions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">From</th>
                <th className="text-left p-2 border-b">To</th>
                <th className="text-left p-2 border-b">Formula</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border-b">1 mile</td><td className="p-2 border-b">1.60934 km</td><td className="p-2 border-b">mi × 1.60934</td></tr>
              <tr><td className="p-2 border-b">1 kg</td><td className="p-2 border-b">2.20462 lbs</td><td className="p-2 border-b">kg × 2.20462</td></tr>
              <tr><td className="p-2 border-b">°C to °F</td><td className="p-2 border-b">°F</td><td className="p-2 border-b">(°C × 9/5) + 32</td></tr>
              <tr><td className="p-2 border-b">1 gallon</td><td className="p-2 border-b">3.78541 L</td><td className="p-2 border-b">gal × 3.78541</td></tr>
            </tbody>
          </table>

          <h2>Tips for Accurate Conversions</h2>
          <ul>
            <li>Double-check which unit system you&apos;re working with</li>
            <li>US and UK gallons are different (1 UK gallon ≈ 1.2 US gallons)</li>
            <li>Temperature conversions are not linear—use the correct formula</li>
            <li>For scientific work, be mindful of significant figures</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Category Selection */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(unitCategories) as [UnitCategory, typeof unitCategories[UnitCategory]][]).map(
            ([key, cat]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {cat.label}
              </button>
            )
          )}
        </div>

        {/* Conversion Input */}
        <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr] items-end">
          <div className="space-y-2">
            <Input
              label="Value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
            <Select
              label="From"
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              options={unitOptions}
            />
          </div>

          <button
            onClick={handleSwapUnits}
            className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors self-center mb-1"
            aria-label="Swap units"
          >
            ⇄
          </button>

          <div className="space-y-2">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-sm text-muted-foreground">Result</span>
              <p className="text-2xl font-bold text-primary">
                {result !== null ? formatNumber(result) : "—"}
              </p>
            </div>
            <Select
              label="To"
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              options={unitOptions}
            />
          </div>
        </div>

        {/* Conversion Formula */}
        {result !== null && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-lg">
              <span className="font-semibold">{inputValue} {currentCategory.units[fromUnit]?.symbol}</span>
              <span className="mx-3 text-muted-foreground">=</span>
              <span className="font-bold text-primary">{formatNumber(result)} {currentCategory.units[toUnit]?.symbol}</span>
            </p>
          </div>
        )}

        {/* All Conversions */}
        {allConversions.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              All {currentCategory.label.replace(/^[^ ]+ /, "")} Conversions
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allConversions.map((conv) => (
                <div
                  key={conv.key}
                  className={`flex justify-between items-center p-2 rounded-lg ${
                    conv.key === toUnit ? "bg-primary/10" : "bg-background/50"
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{conv.name}</span>
                  <span className="font-mono text-sm font-medium">
                    {formatNumber(conv.value)} {conv.symbol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Quick Reference</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <p className="font-medium text-foreground">Length</p>
              <p className="text-muted-foreground">1 inch = 2.54 cm</p>
              <p className="text-muted-foreground">1 foot = 30.48 cm</p>
              <p className="text-muted-foreground">1 mile = 1.609 km</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Weight</p>
              <p className="text-muted-foreground">1 oz = 28.35 g</p>
              <p className="text-muted-foreground">1 lb = 453.6 g</p>
              <p className="text-muted-foreground">1 kg = 2.205 lb</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Volume</p>
              <p className="text-muted-foreground">1 cup = 236.6 mL</p>
              <p className="text-muted-foreground">1 pint = 473.2 mL</p>
              <p className="text-muted-foreground">1 gallon = 3.785 L</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
