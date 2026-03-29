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
  {
    slug: "square-root-calculator",
    name: "Square Root Calculator",
    description:
      "Calculate square roots, cube roots, and nth roots with perfect square detection",
    category: "math",
    keywords: ["square root", "cube root", "nth root", "radical", "√"],
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    description:
      "Calculate mean, median, mode, and range from any set of numbers for statistics",
    category: "math",
    keywords: ["average", "mean", "median", "mode", "range", "statistics"],
  },
  {
    slug: "ratio-calculator",
    name: "Ratio Calculator",
    description:
      "Solve ratios and proportions, simplify ratios, and scale values proportionally",
    category: "math",
    keywords: ["ratio", "proportion", "scale", "simplify ratio"],
  },
  {
    slug: "standard-deviation-calculator",
    name: "Standard Deviation Calculator",
    description:
      "Calculate standard deviation, variance, and statistics for population and sample data",
    category: "math",
    keywords: ["standard deviation", "variance", "statistics", "population", "sample"],
  },
  {
    slug: "grade-calculator",
    name: "Grade Calculator",
    description:
      "Calculate weighted grades and find what score you need on your final exam",
    category: "math",
    keywords: ["grade calculator", "weighted grade", "final grade", "what grade do I need"],
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
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description:
      "Calculate Equated Monthly Installments for home loans, car loans, and personal loans with amortization schedule",
    category: "finance",
    keywords: ["EMI", "loan EMI", "monthly installment", "home loan", "car loan", "amortization"],
  },
  {
    slug: "tax-calculator",
    name: "Tax Calculator",
    description:
      "Estimate federal income tax, Social Security, Medicare, and take-home pay based on 2024 US tax brackets",
    category: "finance",
    keywords: ["tax", "income tax", "federal tax", "tax brackets", "take home pay", "FICA"],
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
  {
    slug: "tdee-calculator",
    name: "TDEE Calculator",
    description:
      "Calculate your Total Daily Energy Expenditure based on BMR and activity level for weight management",
    category: "health",
    keywords: ["TDEE", "total daily energy expenditure", "calories burned", "maintenance calories"],
  },
  {
    slug: "macro-calculator",
    name: "Macro Calculator",
    description:
      "Calculate optimal daily protein, carbohydrates, and fat intake based on your fitness goals",
    category: "health",
    keywords: ["macros", "macronutrients", "protein", "carbs", "fat", "IIFYM"],
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    description:
      "Calculate how much water you should drink daily based on your weight and activity level",
    category: "health",
    keywords: ["water intake", "hydration", "daily water", "water calculator"],
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
    slug: "json-validator",
    name: "JSON Validator",
    description:
      "Validate JSON syntax with line-aware error hints, then format or minify payloads instantly",
    category: "developer",
    keywords: ["JSON validator", "validate json", "json lint", "json syntax", "developer"],
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
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    description:
      "Encode or decode URLs and query strings. Convert special characters to percent-encoded format",
    category: "developer",
    keywords: ["URL encoder", "URL decoder", "percent encoding", "encodeURIComponent"],
  },
  {
    slug: "md5-hash-generator",
    name: "MD5 Hash Generator",
    description:
      "Generate MD5 hash values for text strings. Compare hashes and verify data integrity",
    category: "developer",
    keywords: ["MD5", "hash", "checksum", "hash generator", "message digest"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description:
      "Test and debug regular expressions with real-time matching and highlighting",
    category: "developer",
    keywords: ["regex", "regular expression", "pattern matching", "regex tester"],
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
    slug: "character-counter",
    name: "Character Counter",
    description:
      "Count characters, letters, numbers, and line length with platform-friendly text limit checks",
    category: "text",
    keywords: ["character counter", "character count", "text length", "seo title length", "meta description"],
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
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description:
      "Generate SEO-friendly URL slugs from titles and bulk text with normalization controls",
    category: "text",
    keywords: ["slug generator", "seo slug", "url slug", "slugify", "clean url"],
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

  // PDF Tools
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    description:
      "Compress PDF files to reduce file size while maintaining quality. Perfect for email attachments and uploads",
    category: "pdf",
    keywords: ["pdf compressor", "compress pdf", "reduce pdf size", "pdf optimizer"],
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description:
      "Merge multiple PDF files into a single document. Combine PDFs quickly and easily in your browser",
    category: "pdf",
    keywords: ["pdf merger", "merge pdf", "combine pdf", "join pdf"],
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    description:
      "Split PDF files into separate pages or extract specific pages from a PDF document",
    category: "pdf",
    keywords: ["pdf splitter", "split pdf", "extract pages", "separate pdf"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG Converter",
    description:
      "Convert PDF pages to high-quality JPG images. Extract images from PDF files easily",
    category: "pdf",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf", "pdf converter"],
  },

  // Image Tools
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress images to reduce file size without losing quality. Supports JPG, PNG, and WebP formats",
    category: "image",
    keywords: ["image compressor", "compress image", "reduce image size", "optimize image"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description:
      "Resize images to any dimension while maintaining aspect ratio. Perfect for social media and web",
    category: "image",
    keywords: ["image resizer", "resize image", "scale image", "image dimensions"],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description:
      "Crop images with pixel-perfect controls and aspect ratio presets using secure browser processing",
    category: "image",
    keywords: ["image cropper", "crop image", "photo crop", "crop jpg", "crop png"],
  },
  {
    slug: "image-to-png-converter",
    name: "Image to PNG Converter",
    description:
      "Convert JPG, WEBP, GIF, and BMP images to PNG format with browser-based processing",
    category: "image",
    keywords: ["image to png", "convert image to png", "png converter", "jpg to png"],
  },
  {
    slug: "image-to-jpg-converter",
    name: "Image to JPG Converter",
    description:
      "Convert PNG, WEBP, GIF, and BMP images to JPG format with quality control",
    category: "image",
    keywords: ["image to jpg", "convert image to jpg", "png to jpg", "jpg converter"],
  },
  {
    slug: "webp-to-png-converter",
    name: "WEBP to PNG Converter",
    description:
      "Convert WEBP images to PNG for compatibility and transparency workflows",
    category: "image",
    keywords: ["webp to png", "convert webp to png", "webp converter", "png format"],
  },
  {
    slug: "png-to-webp-converter",
    name: "PNG to WEBP Converter",
    description:
      "Convert PNG files to WEBP format to reduce image size while preserving quality",
    category: "image",
    keywords: ["png to webp", "convert png to webp", "webp converter", "image optimization"],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64 Converter",
    description:
      "Encode images as Base64 Data URIs for inline HTML, CSS, and API payloads",
    category: "image",
    keywords: ["image to base64", "base64 image", "data uri", "encode image"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description:
      "Create QR codes for URLs, text, and contact data with custom size, colors, and export formats",
    category: "image",
    keywords: ["qr code generator", "create qr code", "qr png", "qr svg", "custom qr"],
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
