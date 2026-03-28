import { Tool } from "@/types/tool";

export const tools: Tool[] = [
  // Math Calculators
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, percentage increase/decrease, and more",
    category: "math",
    keywords: ["percentage", "percent", "calculate", "math"],
  },
  {
    slug: "college-gpa-calculator",
    name: "College GPA Calculator",
    description:
      "Calculate your college GPA by entering courses, credit hours, and grades on the 4.0 scale",
    category: "math",
    keywords: ["GPA", "college", "grade point average", "university", "credits", "grades"],
  },
  {
    slug: "high-school-gpa-calculator",
    name: "High School GPA Calculator",
    description:
      "Calculate weighted and unweighted high school GPA with support for Regular, Honors, and AP/IB courses",
    category: "math",
    keywords: ["GPA", "high school", "weighted", "unweighted", "AP", "honors", "IB"],
  },
  {
    slug: "cumulative-gpa-calculator",
    name: "Cumulative GPA Calculator",
    description:
      "Combine multiple semesters to calculate your overall cumulative GPA weighted by credit hours",
    category: "math",
    keywords: ["cumulative GPA", "semester", "overall GPA", "academic", "credits"],
  },
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    description:
      "Full-featured scientific calculator with trigonometry, logarithms, exponents, and advanced math functions",
    category: "math",
    keywords: ["scientific calculator", "sin", "cos", "tan", "log", "math", "calculator"],
  },
  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    description:
      "Add, subtract, multiply, and divide fractions with step-by-step solutions and simplification",
    category: "math",
    keywords: ["fraction", "fractions", "add fractions", "simplify", "math"],
  },

  // Finance Calculators
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    description:
      "Calculate monthly mortgage payments, total interest, and view amortization schedules",
    category: "finance",
    keywords: ["mortgage", "home loan", "house payment", "amortization", "interest"],
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    description: "Calculate loan payments, interest, and total cost",
    category: "finance",
    keywords: ["loan", "mortgage", "interest", "payment", "EMI"],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    description:
      "See how your money grows over time with compound interest, monthly contributions, and various compounding frequencies",
    category: "finance",
    keywords: ["compound interest", "investment", "savings", "growth", "interest rate", "money"],
  },
  {
    slug: "roi-calculator",
    name: "ROI Calculator",
    description:
      "Calculate your Return on Investment including basic ROI, annualized ROI, and net profit",
    category: "finance",
    keywords: ["ROI", "return on investment", "profit", "investment", "annualized"],
  },
  {
    slug: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    description:
      "Find out how much you need to save monthly to reach your financial goal with compound interest",
    category: "finance",
    keywords: ["savings", "goal", "monthly savings", "financial planning", "retirement"],
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    description:
      "Calculate tips and split bills easily. Perfect for restaurants, delivery, and service tipping",
    category: "finance",
    keywords: ["tip", "tip calculator", "bill split", "gratuity", "restaurant"],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    description:
      "Calculate sale prices, savings amount, and original prices from discounts and percentages",
    category: "finance",
    keywords: ["discount", "sale", "savings", "percentage off", "price"],
  },
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    description:
      "Convert salary between hourly, weekly, monthly, and annual rates. Estimate take-home pay",
    category: "finance",
    keywords: ["salary", "wage", "hourly rate", "annual salary", "income"],
  },

  // Health & Fitness Calculators
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index and healthy weight range",
    category: "health",
    keywords: ["BMI", "body mass index", "weight", "health"],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    description:
      "Calculate daily calorie needs based on age, weight, height, activity level, and fitness goals",
    category: "health",
    keywords: ["calories", "calorie calculator", "TDEE", "weight loss", "nutrition"],
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    description:
      "Calculate your Basal Metabolic Rate to understand how many calories your body burns at rest",
    category: "health",
    keywords: ["BMR", "basal metabolic rate", "metabolism", "calories", "resting"],
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    description:
      "Estimate your body fat percentage using multiple methods including Navy, BMI, and measurements",
    category: "health",
    keywords: ["body fat", "fat percentage", "body composition", "fitness"],
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    description:
      "Find your ideal body weight range based on height, gender, and different calculation methods",
    category: "health",
    keywords: ["ideal weight", "healthy weight", "target weight", "BMI"],
  },
  {
    slug: "due-date-calculator",
    name: "Due Date Calculator",
    description:
      "Calculate your pregnancy due date and track important milestones throughout your pregnancy",
    category: "health",
    keywords: ["due date", "pregnancy", "conception", "trimester", "baby"],
  },
  {
    slug: "sleep-calculator",
    name: "Sleep Calculator",
    description:
      "Find the best times to wake up or go to sleep based on sleep cycles for optimal rest",
    category: "health",
    keywords: ["sleep", "sleep cycles", "wake up", "bedtime", "REM"],
  },

  // Date & Time
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate your exact age in years, months, and days",
    category: "date-time",
    keywords: ["age", "birthday", "date", "years"],
  },
  {
    slug: "date-calculator",
    name: "Date Calculator",
    description:
      "Calculate the number of days between dates, add or subtract days from a date",
    category: "date-time",
    keywords: ["date", "days between", "calendar", "date difference"],
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    description:
      "Convert times between different time zones worldwide. Perfect for scheduling international meetings",
    category: "date-time",
    keywords: ["time zone", "convert", "world clock", "international time"],
  },
  {
    slug: "countdown-timer",
    name: "Countdown Timer",
    description:
      "Create countdown timers for events, deadlines, holidays, and special occasions",
    category: "date-time",
    keywords: ["countdown", "timer", "event", "deadline"],
  },

  // Random Generators
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    description: "Generate random numbers within any range",
    category: "random",
    keywords: ["random", "number", "generator", "RNG"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Generate strong, secure passwords with customizable length and character options",
    category: "random",
    keywords: ["password", "generator", "secure", "random password", "security"],
  },

  // Developer Tools
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format, validate, and beautify JSON data. Minify or prettify with syntax highlighting",
    category: "developer",
    keywords: ["JSON", "formatter", "validator", "beautify", "minify"],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description:
      "Encode text to Base64 or decode Base64 strings. Supports text and file encoding",
    category: "developer",
    keywords: ["base64", "encode", "decode", "converter"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description:
      "Generate unique UUIDs (v1, v4) for databases, APIs, and application development",
    category: "developer",
    keywords: ["UUID", "GUID", "generator", "unique ID"],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description:
      "Convert colors between HEX, RGB, HSL, and other formats. Includes color picker",
    category: "developer",
    keywords: ["color", "HEX", "RGB", "HSL", "converter", "picker"],
  },

  // Text Tools
  {
    slug: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs. Estimate reading and speaking time",
    category: "text",
    keywords: ["word count", "character count", "text analysis", "reading time"],
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    description:
      "Convert text between uppercase, lowercase, title case, sentence case, and more",
    category: "text",
    keywords: ["text case", "uppercase", "lowercase", "title case", "convert"],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description:
      "Generate placeholder text for design mockups, websites, and documents",
    category: "text",
    keywords: ["lorem ipsum", "placeholder", "dummy text", "filler text"],
  },

  // Unit Converters
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert between different units of measurement including length, weight, temperature, and more",
    category: "conversion",
    keywords: ["unit converter", "length", "weight", "temperature", "measurement"],
  },
];

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery))
  );
}
