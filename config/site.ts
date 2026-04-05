export const siteConfig = {
  name: "SoftZaR",
  description:
    "Free online tools and calculators for everyday tasks. Math, finance, health, conversion tools and more.",
  url: "https://softzar.com",
  ogImage: "https://softzar.com/softzar-og.png",
  links: {
    twitter: "https://twitter.com/softzar",
    github: "https://github.com/softzar",
  },
  creator: "Softzar Team",
};

export const categories = [
  {
    id: "math" as const,
    slug: "math-calculators",
    name: "Math Calculators",
    description: "Mathematical calculations and equations",
    icon: "calculator",
  },
  {
    id: "finance" as const,
    slug: "finance-tools",
    name: "Finance Tools",
    description: "Financial calculators and planners",
    icon: "dollar-sign",
  },
  {
    id: "health" as const,
    slug: "health-fitness",
    name: "Health & Fitness",
    description: "BMI, calories, and health metrics",
    icon: "heart",
  },
  {
    id: "conversion" as const,
    slug: "unit-converters",
    name: "Unit Converters",
    description: "Convert between different units",
    icon: "arrows-right-left",
  },
  {
    id: "text" as const,
    slug: "text-tools",
    name: "Text Tools",
    description: "Text manipulation and formatting",
    icon: "text",
  },
  {
    id: "date-time" as const,
    slug: "date-time",
    name: "Date & Time",
    description: "Date calculations and timers",
    icon: "clock",
  },
  {
    id: "random" as const,
    slug: "random-generators",
    name: "Random Generators",
    description: "Random numbers, passwords, and more",
    icon: "shuffle",
  },
  {
    id: "developer" as const,
    slug: "developer-tools",
    name: "Developer Tools",
    description: "Tools for developers and programmers",
    icon: "code",
  },
  {
    id: "pdf" as const,
    slug: "pdf-tools",
    name: "PDF Tools",
    description: "Compress, merge, split and convert PDF files",
    icon: "file-text",
  },
  {
    id: "image" as const,
    slug: "image-tools",
    name: "Image Tools",
    description: "Compress, resize and optimize images",
    icon: "image",
  },
  {
    id: "gaming" as const,
    slug: "gaming-tools",
    name: "Gaming Tools",
    description: "Calculators and tools for gamers",
    icon: "gamepad-2",
  },
];
