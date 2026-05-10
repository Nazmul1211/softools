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
  {
    id: "construction" as const,
    slug: "construction-calculators",
    name: "Construction & Home",
    description: "Construction, building, and home improvement calculators",
    icon: "hard-hat",
  },
];

export const categorySeoDescriptions: Record<string, string> = {
  "math-calculators":
    "Use Softzar free math calculators for percentages, equations, GPA, statistics, geometry, and more with fast, accurate results for school, work, and daily use.",
  "unit-converters":
    "Convert units instantly with Softzar converters for length, weight, temperature, and more. Get precise results for study, engineering, cooking, and daily use.",
  "text-tools":
    "Use Softzar text tools to count words, transform case, create slugs, and estimate reading time. Clean and format content quickly for writing and SEO workflows.",
  "date-time":
    "Plan schedules faster with Softzar date and time tools. Calculate business days, age, countdowns, time zones, and durations with accurate instant results.",
  "developer-tools":
    "Boost workflow with Softzar developer tools. Encode, validate, format, hash, test regex patterns, and generate UUIDs quickly in your browser for coding tasks.",
  "pdf-tools":
    "Work with PDFs online using Softzar PDF tools. Merge, split, compress, rotate, convert, and add page numbers securely, with no software installation required.",
  "image-tools":
    "Edit and optimize images online with Softzar image tools. Compress, resize, convert, crop, remove backgrounds, and generate QR codes quickly in your browser.",
  "gaming-tools":
    "Level up with Softzar gaming tools and calculators built for popular games. Get quick, reliable formulas and estimates to plan resources and strategies.",
};
