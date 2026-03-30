import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter - Length, Weight, Temperature & More",
  description:
    "Free online unit converter. Convert between metric and imperial units for length, weight, temperature, volume, area, speed, and time. Fast and accurate conversions.",
  keywords: [
    "unit converter",
    "metric converter",
    "imperial converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "volume converter",
    "area converter",
    "speed converter",
    "measurement converter",
    "meters to feet",
    "kg to lbs",
    "celsius to fahrenheit",
  ],
  openGraph: {
    title: "Unit Converter - Length, Weight, Temperature & More",
    description:
      "Convert between metric and imperial units. Length, weight, temperature, volume, area, speed, and time conversions.",
    url: "https://softzar.com/unit-converter/",
  },
};

export default function UnitConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
