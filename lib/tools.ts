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
  {
    slug: "quadratic-calculator",
    name: "Quadratic Formula Calculator",
    description:
      "Solve quadratic equations ax² + bx + c = 0 using the quadratic formula. Get roots, discriminant, vertex, and step-by-step solutions.",
    category: "math",
    keywords: ["quadratic formula", "quadratic equation", "solve quadratic", "roots", "discriminant", "parabola"],
  },
  {
    slug: "area-calculator",
    name: "Area Calculator",
    description:
      "Calculate the area of any geometric shape: circles, rectangles, triangles, trapezoids, and more with instant formula breakdowns.",
    category: "math",
    keywords: ["area calculator", "calculate area", "area of circle", "area of rectangle", "geometry"],
  },
  {
    slug: "volume-calculator",
    name: "Volume Calculator",
    description:
      "Calculate the volume of 3D shapes: cubes, spheres, cylinders, cones, pyramids, and more with step-by-step formulas.",
    category: "math",
    keywords: ["volume calculator", "calculate volume", "volume of sphere", "volume of cylinder", "3D shapes"],
  },
  {
    slug: "probability-calculator",
    name: "Probability Calculator",
    description:
      "Calculate probability for single and multiple events, conditional probability, complements, and at least one success scenarios.",
    category: "math",
    keywords: ["probability calculator", "calculate probability", "odds", "statistics", "conditional probability"],
  },
  {
    slug: "lcm-calculator",
    name: "LCM Calculator",
    description:
      "Find the Least Common Multiple of two or more numbers with step-by-step prime factorization and listing methods.",
    category: "math",
    keywords: ["lcm calculator", "least common multiple", "find lcm", "common multiple", "math"],
  },
  {
    slug: "slope-calculator",
    name: "Slope Calculator",
    description:
      "Calculate slope from two points, rise and run, or equation form. Get slope-intercept, point-slope, and standard form equations.",
    category: "math",
    keywords: ["slope calculator", "find slope", "rise over run", "slope formula", "line equation", "gradient"],
  },
  {
    slug: "pythagorean-theorem-calculator",
    name: "Pythagorean Theorem Calculator",
    description:
      "Calculate the missing side of a right triangle using a² + b² = c². Find hypotenuse or legs with angles and triangle properties.",
    category: "math",
    keywords: ["pythagorean theorem", "right triangle", "hypotenuse", "a2 + b2 = c2", "geometry"],
  },
  {
    slug: "triangle-calculator",
    name: "Triangle Calculator",
    description:
      "Solve any triangle using SSS, SAS, ASA, or AAS methods. Calculate area, perimeter, angles, altitudes, medians, and more.",
    category: "math",
    keywords: ["triangle calculator", "solve triangle", "triangle area", "law of cosines", "law of sines"],
  },
  {
    slug: "concrete-calculator",
    name: "Concrete Calculator",
    description:
      "Calculate how much concrete you need for slabs, footings, columns, and walls. Get results in cubic yards, bags, and estimated cost",
    category: "construction",
    keywords: ["concrete calculator", "concrete estimator", "cubic yards", "concrete bags", "concrete cost"],
  },
  {
    slug: "square-footage-calculator",
    name: "Square Footage Calculator",
    description:
      "Calculate the square footage of rooms, flooring, walls, and land. Supports rectangles, triangles, circles, and trapezoids",
    category: "construction",
    keywords: ["square footage", "area calculator", "sq ft", "room size", "flooring calculator"],
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
  {
    slug: "future-value-calculator",
    name: "Future Value Calculator",
    description:
      "Calculate the future value of investments with compound interest. Enter present value, interest rate, and time period to project growth",
    category: "finance",
    keywords: ["future value", "FV calculator", "investment growth", "compound interest", "time value of money"],
  },
  {
    slug: "present-value-calculator",
    name: "Present Value Calculator",
    description:
      "Calculate the present value of future money using discount rates. Determine how much future cash flows are worth today",
    category: "finance",
    keywords: ["present value", "PV calculator", "discount rate", "time value of money", "NPV"],
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
  {
    slug: "ovulation-calculator",
    name: "Ovulation Calculator",
    description:
      "Predict your most fertile days and ovulation date based on your menstrual cycle. Track fertility windows across multiple cycles",
    category: "health",
    keywords: ["ovulation calculator", "fertility calculator", "fertile days", "ovulation predictor", "conception"],
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
  {
    slug: "time-calculator",
    name: "Time Calculator",
    description:
      "Add and subtract time durations easily. Calculate hours, minutes, seconds and convert between time units for work hours and scheduling.",
    category: "date-time",
    keywords: ["time calculator", "add time", "subtract time", "hours calculator", "time duration"],
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
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description:
      "Rotate PDF pages 90°, 180°, or 270° online. Rotate all pages or select individual pages to fix orientation instantly",
    category: "pdf",
    keywords: ["rotate pdf", "rotate pdf pages", "pdf rotation", "fix pdf orientation", "turn pdf sideways"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF Converter",
    description:
      "Convert JPG, PNG, and WebP images to PDF. Combine multiple images into one PDF document with custom page size and margins",
    category: "pdf",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert image to pdf", "photo to pdf"],
  },
  {
    slug: "add-page-numbers-to-pdf",
    name: "Add Page Numbers to PDF",
    description:
      "Add page numbers to PDF files online. Choose position, format (Arabic, Roman, Page X of Y), and starting page. Free and private",
    category: "pdf",
    keywords: ["add page numbers to pdf", "pdf page numbers", "number pdf pages", "pdf page numbering"],
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
  {
    slug: "remove-background",
    name: "Remove Background",
    description:
      "Remove backgrounds from images instantly using AI. Create transparent PNG images for free in your browser",
    category: "image",
    keywords: ["remove background", "background remover", "transparent background", "cutout", "ai background removal"],
  },

  // Additional Finance Tools
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    description:
      "Plan your retirement by calculating future savings, required contributions, and retirement income using the 4% rule",
    category: "finance",
    keywords: ["retirement calculator", "retirement planning", "401k", "savings", "retirement income", "4% rule"],
  },
  {
    slug: "investment-calculator",
    name: "Investment Calculator",
    description:
      "Calculate investment growth with compound interest, various compounding frequencies, and monthly contributions",
    category: "finance",
    keywords: ["investment calculator", "compound growth", "investment returns", "portfolio growth", "compound interest"],
  },
  {
    slug: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    description:
      "Calculate monthly car payments, total interest, and view amortization schedule for auto loans",
    category: "finance",
    keywords: ["auto loan", "car loan", "car payment", "vehicle financing", "auto financing", "car loan calculator"],
  },
  {
    slug: "savings-calculator",
    name: "Savings Calculator",
    description:
      "Project how your savings will grow over time with compound interest and regular deposits",
    category: "finance",
    keywords: ["savings calculator", "savings growth", "compound interest", "savings account", "future savings"],
  },
  {
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    description:
      "Calculate simple interest on loans, savings, and investments using the I = P × R × T formula",
    category: "finance",
    keywords: ["simple interest", "interest calculator", "loan interest", "basic interest", "interest formula"],
  },
  {
    slug: "margin-calculator",
    name: "Margin Calculator",
    description:
      "Calculate profit margin, gross margin, and markup percentage for business pricing decisions",
    category: "finance",
    keywords: ["margin calculator", "profit margin", "gross margin", "markup", "business calculator", "pricing"],
  },
  {
    slug: "markup-calculator",
    name: "Markup Calculator",
    description:
      "Calculate selling price from cost and markup percentage for retail and wholesale pricing",
    category: "finance",
    keywords: ["markup calculator", "price markup", "retail markup", "selling price", "cost plus pricing"],
  },
  {
    slug: "amortization-calculator",
    name: "Amortization Calculator",
    description:
      "Generate complete loan amortization schedules showing monthly payments, interest, and principal breakdown over the life of your loan",
    category: "finance",
    keywords: ["amortization calculator", "amortization schedule", "loan amortization", "payment breakdown", "interest schedule"],
  },
  {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    description:
      "Calculate sales tax and total cost including tax. Includes US state tax rates and reverse tax calculation to find pre-tax price",
    category: "finance",
    keywords: ["sales tax calculator", "tax calculator", "state sales tax", "calculate tax", "reverse sales tax"],
  },
  {
    slug: "profit-calculator",
    name: "Profit Calculator",
    description:
      "Calculate gross profit, operating profit, and net profit margins for your business with visual profit breakdown analysis",
    category: "finance",
    keywords: ["profit calculator", "gross profit", "net profit", "operating profit", "profit margin", "business profit"],
  },
  {
    slug: "break-even-calculator",
    name: "Break-Even Calculator",
    description:
      "Calculate your break-even point in units and revenue. Determine how many sales you need to cover costs and start making profit",
    category: "finance",
    keywords: ["break-even calculator", "break-even point", "break-even analysis", "business calculator", "fixed costs"],
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    description:
      "Calculate how long to pay off credit card debt and total interest cost. Find the optimal payment strategy to become debt-free faster.",
    category: "finance",
    keywords: ["credit card payoff", "debt calculator", "pay off credit card", "interest calculator", "debt free"],
  },
  {
    slug: "401k-calculator",
    name: "401k Calculator",
    description:
      "Project your 401k retirement savings growth with employer matching, contribution limits, and year-by-year projections",
    category: "finance",
    keywords: ["401k calculator", "retirement calculator", "401k contribution", "employer match", "retirement savings"],
  },
  {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    description:
      "Estimate how inflation impacts purchasing power and future prices over time using annual inflation assumptions",
    category: "finance",
    keywords: ["inflation calculator", "purchasing power", "future value", "cost over time", "inflation rate"],
  },
  {
    slug: "apr-calculator",
    name: "APR Calculator",
    description:
      "Estimate annual percentage rate by including interest and upfront fees to compare true borrowing cost",
    category: "finance",
    keywords: ["apr calculator", "annual percentage rate", "loan fees", "borrow cost", "loan comparison"],
  },
  {
    slug: "payroll-calculator",
    name: "Payroll Calculator",
    description:
      "Calculate gross pay, estimated taxes, deductions, and take-home pay for common payroll schedules",
    category: "finance",
    keywords: ["payroll calculator", "take-home pay", "gross to net", "paycheck estimator", "salary payroll"],
  },
  {
    slug: "vat-calculator",
    name: "VAT Calculator",
    description:
      "Add or remove value-added tax from prices and calculate net, VAT amount, and gross totals instantly",
    category: "finance",
    keywords: ["vat calculator", "value added tax", "add vat", "remove vat", "vat inclusive"],
  },
  {
    slug: "down-payment-calculator",
    name: "Down Payment Calculator",
    description:
      "Estimate down payment amount, loan principal, and monthly housing costs for home purchase planning",
    category: "finance",
    keywords: ["down payment calculator", "mortgage down payment", "home loan", "pmi", "house affordability"],
  },

  // Additional Health Tools
  {
    slug: "calories-burned-calculator",
    name: "Calories Burned Calculator",
    description:
      "Calculate calories burned during exercise based on activity type, duration, and body weight using MET values",
    category: "health",
    keywords: ["calories burned", "exercise calculator", "workout calories", "MET", "activity calories"],
  },

  // Additional PDF Tools
  {
    slug: "pdf-to-word",
    name: "PDF to Word Converter",
    description:
      "Convert PDF files to editable Word documents (DOCX) for free. Extract text from PDFs in your browser",
    category: "pdf",
    keywords: ["pdf to word", "pdf to docx", "convert pdf", "pdf converter", "extract text"],
  },

  // Gaming Tools
  {
    slug: "atlas-earth-calculator",
    name: "Atlas Earth Calculator",
    description:
      "Calculate Atlas Earth earnings, badge boosts, parcel ROI, and optimize your virtual land investment strategy. Also known as AE Calculator.",
    category: "gaming",
    keywords: [
      "atlas earth calculator",
      "ae calculator",
      "atlas earth earnings",
      "atlas earth roi",
      "atlas earth rent",
      "atlas earth badges",
      "atlas earth parcels",
      "atlas bucks",
      "virtual land calculator",
    ],
  },

  // Phase 1 — New High-ROI Tools (April 2026)
  {
    slug: "protein-intake-calculator",
    name: "Protein Intake Calculator",
    description:
      "Calculate your optimal daily protein intake based on body weight, activity level, and fitness goals using evidence-based ISSN guidelines",
    category: "health",
    keywords: ["protein intake calculator", "daily protein", "protein per day", "protein for muscle", "how much protein"],
  },
  {
    slug: "heart-rate-zones-calculator",
    name: "Heart Rate Zones Calculator",
    description:
      "Calculate your 5 heart rate training zones based on age and resting heart rate using the Karvonen or standard percentage method",
    category: "health",
    keywords: ["heart rate zones", "training zones", "karvonen formula", "max heart rate", "zone 2 training", "target heart rate"],
  },
  {
    slug: "reading-time-calculator",
    name: "Reading Time Calculator",
    description:
      "Estimate reading time, speaking time, and readability score for any text. Perfect for bloggers, content creators, and presenters",
    category: "text",
    keywords: ["reading time calculator", "reading time estimator", "words to minutes", "speaking time", "article reading time"],
  },
  {
    slug: "freelance-rate-calculator",
    name: "Freelance Rate Calculator",
    description:
      "Calculate your ideal freelance hourly rate based on desired income, expenses, and billable hours with tax-adjusted estimates",
    category: "finance",
    keywords: ["freelance rate calculator", "freelance hourly rate", "contractor rate", "consulting rate", "freelance pricing"],
  },
  {
    slug: "password-strength-checker",
    name: "Password Strength Checker",
    description:
      "Check password strength with entropy analysis, crack time estimation, and improvement suggestions. 100% private — runs in your browser",
    category: "developer",
    keywords: ["password strength checker", "password tester", "how strong is my password", "password entropy", "password security"],
  },
  // Phase 2 — Batch 2
  {
    slug: "pace-calculator",
    name: "Pace Calculator",
    description:
      "Calculate running pace, finish time, or distance for any race. Supports miles and kilometers with 5K, 10K, half marathon, and marathon predictions",
    category: "health",
    keywords: ["pace calculator", "running pace", "race pace calculator", "marathon pace", "5k pace", "km per mile"],
  },
  {
    slug: "confidence-interval-calculator",
    name: "Confidence Interval Calculator",
    description:
      "Calculate confidence intervals for population means and proportions at 90%, 95%, or 99% confidence levels with step-by-step solutions",
    category: "math",
    keywords: ["confidence interval calculator", "margin of error", "z-score", "t-distribution", "statistics", "confidence level"],
  },
  {
    slug: "rent-vs-buy-calculator",
    name: "Rent vs Buy Calculator",
    description:
      "Compare the total cost of renting vs buying a home over 5–30 years including mortgage, taxes, maintenance, appreciation, and opportunity cost",
    category: "finance",
    keywords: ["rent vs buy calculator", "rent or buy", "should I rent or buy", "home buying calculator", "rent vs mortgage"],
  },
  {
    slug: "hours-calculator",
    name: "Hours Calculator",
    description:
      "Add, subtract, and calculate total hours, minutes, and seconds. Find duration between times and convert to decimal hours for payroll",
    category: "date-time",
    keywords: ["hours calculator", "add hours and minutes", "hours between times", "time calculator", "decimal hours", "work hours"],
  },
  {
    slug: "gcf-calculator",
    name: "GCF Calculator",
    description:
      "Find the Greatest Common Factor (GCF/GCD/HCF) of two or more numbers with step-by-step prime factorization and Euclidean algorithm solutions",
    category: "math",
    keywords: ["GCF calculator", "greatest common factor", "GCD", "greatest common divisor", "HCF", "Euclidean algorithm"],
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
