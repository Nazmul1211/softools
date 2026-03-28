"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Calculator, Delete, RotateCcw, History } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "What functions does this scientific calculator support?",
    answer: "This calculator supports basic arithmetic (+, -, ×, ÷), trigonometric functions (sin, cos, tan and their inverses), logarithms (log base 10 and natural log), exponentials (e^x, 10^x), powers and roots (x², x³, √, ∛, x^y), constants (π, e), factorials (n!), and percentage calculations."
  },
  {
    question: "Are the trigonometric functions in degrees or radians?",
    answer: "You can toggle between degrees (DEG) and radians (RAD) mode using the button at the top of the calculator. In degree mode, sin(90) = 1. In radian mode, sin(π/2) = 1. Most everyday calculations use degrees, while calculus and advanced math typically use radians."
  },
  {
    question: "What is the difference between log and ln?",
    answer: "log (or log₁₀) is the logarithm base 10—it tells you what power of 10 gives you that number (log(100) = 2 because 10² = 100). ln is the natural logarithm base e (≈2.718)—it's used extensively in calculus, physics, and natural growth calculations."
  },
  {
    question: "How do I calculate powers and roots?",
    answer: "For squares, use x². For cubes, use x³. For any power, use x^y (enter the base, press x^y, enter the exponent). For square roots, use √. For cube roots, use ∛. For any root, use ʸ√x (this calculates the y-th root of x)."
  },
  {
    question: "What is factorial (n!) and when is it used?",
    answer: "Factorial (n!) multiplies all positive integers from 1 to n. For example, 5! = 5×4×3×2×1 = 120. Factorials are used in probability, combinatorics, and statistics. Note: factorials grow very quickly—even 20! is over 2 quintillion."
  },
  {
    question: "Why does my calculation show 'Error'?",
    answer: "Common errors include: division by zero, taking the square root of a negative number (in real number mode), logarithm of zero or negative numbers, tan of 90° (undefined), and factorial of negative or non-integer numbers. Check your input values and try again."
  },
];

type AngleMode = "DEG" | "RAD";

interface HistoryItem {
  expression: string;
  result: string;
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [lastResult, setLastResult] = useState<number | null>(null);

  const toRadians = (deg: number): number => (deg * Math.PI) / 180;
  const toDegrees = (rad: number): number => (rad * 180) / Math.PI;

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const evaluateExpression = useCallback((expr: string): number => {
    try {
      // Replace mathematical notation with JavaScript equivalents
      let sanitized = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, `(${Math.PI})`)
        .replace(/e(?![x\d])/g, `(${Math.E})`)
        .replace(/(\d+)!/g, (_, n) => `(${factorial(parseInt(n))})`)
        .replace(/√\(([^)]+)\)/g, "Math.sqrt($1)")
        .replace(/∛\(([^)]+)\)/g, "Math.cbrt($1)")
        .replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, "Math.pow($1,$2)")
        .replace(/log\(([^)]+)\)/g, "Math.log10($1)")
        .replace(/ln\(([^)]+)\)/g, "Math.log($1)")
        .replace(/abs\(([^)]+)\)/g, "Math.abs($1)");

      // Handle trigonometric functions based on angle mode
      if (angleMode === "DEG") {
        sanitized = sanitized
          .replace(/sin\(([^)]+)\)/g, "Math.sin(($1)*Math.PI/180)")
          .replace(/cos\(([^)]+)\)/g, "Math.cos(($1)*Math.PI/180)")
          .replace(/tan\(([^)]+)\)/g, "Math.tan(($1)*Math.PI/180)")
          .replace(/asin\(([^)]+)\)/g, "(Math.asin($1)*180/Math.PI)")
          .replace(/acos\(([^)]+)\)/g, "(Math.acos($1)*180/Math.PI)")
          .replace(/atan\(([^)]+)\)/g, "(Math.atan($1)*180/Math.PI)");
      } else {
        sanitized = sanitized
          .replace(/sin\(([^)]+)\)/g, "Math.sin($1)")
          .replace(/cos\(([^)]+)\)/g, "Math.cos($1)")
          .replace(/tan\(([^)]+)\)/g, "Math.tan($1)")
          .replace(/asin\(([^)]+)\)/g, "Math.asin($1)")
          .replace(/acos\(([^)]+)\)/g, "Math.acos($1)")
          .replace(/atan\(([^)]+)\)/g, "Math.atan($1)");
      }

      // Handle exp and power of 10
      sanitized = sanitized
        .replace(/exp\(([^)]+)\)/g, "Math.exp($1)")
        .replace(/10\^([^)]+)/g, "Math.pow(10,$1)");

      // Validate: only allow safe characters
      if (!/^[\d\s+\-*/.()Math.sincotaglqrtbexpPIE,]+$/.test(sanitized)) {
        return NaN;
      }

      // Use Function constructor for safe evaluation
      const result = new Function(`"use strict"; return (${sanitized})`)();
      return typeof result === "number" ? result : NaN;
    } catch {
      return NaN;
    }
  }, [angleMode]);

  const handleNumber = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    setExpression(expression + num);
  };

  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setDisplay(op);
    setExpression(expression + op);
  };

  const handleFunction = (func: string) => {
    if (display === "Error") return;
    const funcMap: { [key: string]: string } = {
      "sin": "sin(",
      "cos": "cos(",
      "tan": "tan(",
      "asin": "asin(",
      "acos": "acos(",
      "atan": "atan(",
      "log": "log(",
      "ln": "ln(",
      "√": "√(",
      "∛": "∛(",
      "exp": "exp(",
      "abs": "abs(",
    };
    const f = funcMap[func] || func;
    setDisplay(f);
    setExpression(expression + f);
  };

  const handleConstant = (constant: string) => {
    if (display === "Error") {
      setDisplay(constant);
      setExpression(constant);
    } else {
      setDisplay(constant);
      setExpression(expression + constant);
    }
  };

  const handleSquare = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) {
      const result = num * num;
      setDisplay(result.toString());
      setExpression(`(${expression})^2`);
    }
  };

  const handleCube = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) {
      const result = num * num * num;
      setDisplay(result.toString());
      setExpression(`(${expression})^3`);
    }
  };

  const handleFactorial = () => {
    const num = parseFloat(display);
    if (!isNaN(num) && num >= 0 && Number.isInteger(num)) {
      const result = factorial(num);
      setDisplay(result.toString());
      setExpression(`${expression}!`);
    } else {
      setDisplay("Error");
    }
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) {
      const result = num / 100;
      setDisplay(result.toString());
      setExpression(`(${expression}/100)`);
    }
  };

  const handleReciprocal = () => {
    const num = parseFloat(display);
    if (!isNaN(num) && num !== 0) {
      const result = 1 / num;
      setDisplay(result.toString());
      setExpression(`(1/${expression})`);
    } else {
      setDisplay("Error");
    }
  };

  const handlePlusMinus = () => {
    if (display !== "0" && display !== "Error") {
      if (display.startsWith("-")) {
        setDisplay(display.slice(1));
      } else {
        setDisplay("-" + display);
      }
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".") && display !== "Error") {
      setDisplay(display + ".");
      setExpression(expression + ".");
    }
  };

  const handleParenthesis = (paren: string) => {
    if (display === "Error") {
      setDisplay(paren);
      setExpression(paren);
    } else {
      setDisplay(paren);
      setExpression(expression + paren);
    }
  };

  const calculate = () => {
    if (!expression) return;
    
    const result = evaluateExpression(expression);
    
    if (isNaN(result) || !isFinite(result)) {
      setDisplay("Error");
    } else {
      const formattedResult = result.toPrecision(10).replace(/\.?0+$/, "");
      setDisplay(formattedResult);
      setLastResult(result);
      setHistory([{ expression, result: formattedResult }, ...history.slice(0, 19)]);
      setExpression(formattedResult);
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const backspace = () => {
    if (display.length > 1 && display !== "Error") {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const memoryAdd = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) setMemory(memory + num);
  };

  const memorySubtract = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) setMemory(memory - num);
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setExpression(expression + memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const useHistoryItem = (item: HistoryItem) => {
    setDisplay(item.result);
    setExpression(item.result);
    setShowHistory(false);
  };

  const buttonClass = (type: "number" | "operator" | "function" | "equals" | "clear") => {
    const base = "h-12 rounded-lg font-medium text-sm transition-all active:scale-95 ";
    switch (type) {
      case "number":
        return base + "bg-white dark:bg-muted/50 border border-border text-foreground hover:bg-muted";
      case "operator":
        return base + "bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20";
      case "function":
        return base + "bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 text-xs";
      case "equals":
        return base + "bg-primary text-white hover:bg-primary/90";
      case "clear":
        return base + "bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20";
    }
  };

  return (
    <ToolLayout
      title="Scientific Calculator"
      description="Free online scientific calculator with trigonometric, logarithmic, and exponential functions. Calculate sin, cos, tan, log, ln, powers, roots, factorials, and more. Perfect for students, engineers, and scientists."
      category={{ name: "Math", slug: "math-calculators" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Fraction Calculator", href: "/fraction-calculator" },
        { name: "College GPA Calculator", href: "/college-gpa-calculator" },
        { name: "Loan Calculator", href: "/loan-calculator" },
        { name: "Unit Converter", href: "/unit-converter" },
      ]}
      content={
        <>
          <h2>About the Scientific Calculator</h2>
          <p>
            This full-featured scientific calculator provides all the mathematical functions needed for academic, engineering, and everyday calculations. Unlike basic calculators, it includes trigonometric functions, logarithms, exponentials, and advanced operations that are essential for science and mathematics.
          </p>

          <h2>Trigonometric Functions</h2>
          <p>
            Trigonometry deals with the relationships between angles and sides of triangles. Our calculator supports all six trigonometric functions:
          </p>
          
          <h3>Primary Functions</h3>
          <ul>
            <li><strong>Sine (sin):</strong> Opposite / Hypotenuse. sin(30°) = 0.5</li>
            <li><strong>Cosine (cos):</strong> Adjacent / Hypotenuse. cos(60°) = 0.5</li>
            <li><strong>Tangent (tan):</strong> Opposite / Adjacent = sin/cos. tan(45°) = 1</li>
          </ul>

          <h3>Inverse Functions</h3>
          <ul>
            <li><strong>Arcsine (asin):</strong> Returns the angle whose sine is x</li>
            <li><strong>Arccosine (acos):</strong> Returns the angle whose cosine is x</li>
            <li><strong>Arctangent (atan):</strong> Returns the angle whose tangent is x</li>
          </ul>

          <h3>Degrees vs Radians</h3>
          <p>
            Degrees divide a circle into 360 parts, while radians use the ratio of arc length to radius. One full rotation = 360° = 2π radians. Toggle between modes using the DEG/RAD button.
          </p>

          <h2>Logarithmic Functions</h2>
          <p>
            Logarithms answer the question: &quot;To what power must I raise the base to get this number?&quot;
          </p>
          <ul>
            <li><strong>log (base 10):</strong> Common logarithm. log(100) = 2 because 10² = 100</li>
            <li><strong>ln (natural log):</strong> Logarithm base e ≈ 2.718. ln(e) = 1</li>
          </ul>
          <p>
            Logarithms are used in measuring sound (decibels), earthquakes (Richter scale), and pH levels, as well as in financial calculations and data science.
          </p>

          <h2>Exponential Functions</h2>
          <ul>
            <li><strong>e^x:</strong> Raises Euler&apos;s number to the power x. The inverse of ln(x).</li>
            <li><strong>10^x:</strong> Raises 10 to the power x. The inverse of log(x).</li>
            <li><strong>x^y:</strong> Raises x to any power y.</li>
          </ul>

          <h2>Powers and Roots</h2>
          <ul>
            <li><strong>x²:</strong> Square - multiply number by itself</li>
            <li><strong>x³:</strong> Cube - number × number × number</li>
            <li><strong>√:</strong> Square root - what number times itself equals x?</li>
            <li><strong>∛:</strong> Cube root - what number cubed equals x?</li>
          </ul>

          <h2>Special Functions</h2>
          <ul>
            <li><strong>Factorial (n!):</strong> Product of all positive integers up to n. 5! = 120</li>
            <li><strong>Reciprocal (1/x):</strong> Divides 1 by the number</li>
            <li><strong>Absolute value (|x|):</strong> Distance from zero, always positive</li>
            <li><strong>Percentage (%):</strong> Divides by 100</li>
          </ul>

          <h2>Mathematical Constants</h2>
          <ul>
            <li><strong>π (Pi):</strong> ≈ 3.14159... The ratio of circumference to diameter</li>
            <li><strong>e (Euler&apos;s number):</strong> ≈ 2.71828... The base of natural logarithms</li>
          </ul>

          <h2>Memory Functions</h2>
          <p>
            The calculator includes memory functions for storing intermediate results:
          </p>
          <ul>
            <li><strong>MC:</strong> Memory Clear - sets memory to 0</li>
            <li><strong>MR:</strong> Memory Recall - displays stored value</li>
            <li><strong>M+:</strong> Memory Add - adds display to memory</li>
            <li><strong>M-:</strong> Memory Subtract - subtracts display from memory</li>
          </ul>

          <h2>Order of Operations</h2>
          <p>
            The calculator follows standard mathematical order of operations (PEMDAS/BODMAS):
          </p>
          <ol>
            <li>Parentheses/Brackets</li>
            <li>Exponents/Orders (powers, roots)</li>
            <li>Multiplication and Division (left to right)</li>
            <li>Addition and Subtraction (left to right)</li>
          </ol>
        </>
      }
    >
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setAngleMode(angleMode === "DEG" ? "RAD" : "DEG")}
            className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80"
          >
            {angleMode}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              title="History"
            >
              <History className="h-4 w-4" />
            </button>
            {memory !== 0 && (
              <span className="text-xs text-muted-foreground self-center">M</span>
            )}
          </div>
        </div>

        {/* Display */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="text-xs text-muted-foreground h-6 overflow-hidden text-right truncate">
            {expression || "\u00A0"}
          </div>
          <div className="text-3xl font-mono text-right text-foreground truncate">
            {display}
          </div>
        </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-3 max-h-40 overflow-y-auto">
            <div className="text-xs text-muted-foreground mb-2">History</div>
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => useHistoryItem(item)}
                className="w-full text-left text-sm py-1 hover:bg-muted rounded px-2"
              >
                <span className="text-muted-foreground">{item.expression} = </span>
                <span className="text-foreground font-medium">{item.result}</span>
              </button>
            ))}
          </div>
        )}

        {/* Calculator Buttons */}
        <div className="grid grid-cols-5 gap-1.5">
          {/* Row 1: Memory & Clear */}
          <button onClick={memoryClear} className={buttonClass("function")}>MC</button>
          <button onClick={memoryRecall} className={buttonClass("function")}>MR</button>
          <button onClick={memoryAdd} className={buttonClass("function")}>M+</button>
          <button onClick={memorySubtract} className={buttonClass("function")}>M-</button>
          <button onClick={clear} className={buttonClass("clear")}>AC</button>

          {/* Row 2: Scientific Functions */}
          <button onClick={() => handleFunction("sin")} className={buttonClass("function")}>sin</button>
          <button onClick={() => handleFunction("cos")} className={buttonClass("function")}>cos</button>
          <button onClick={() => handleFunction("tan")} className={buttonClass("function")}>tan</button>
          <button onClick={() => handleFunction("log")} className={buttonClass("function")}>log</button>
          <button onClick={() => handleFunction("ln")} className={buttonClass("function")}>ln</button>

          {/* Row 3: More Functions */}
          <button onClick={() => handleFunction("asin")} className={buttonClass("function")}>sin⁻¹</button>
          <button onClick={() => handleFunction("acos")} className={buttonClass("function")}>cos⁻¹</button>
          <button onClick={() => handleFunction("atan")} className={buttonClass("function")}>tan⁻¹</button>
          <button onClick={() => handleFunction("exp")} className={buttonClass("function")}>eˣ</button>
          <button onClick={() => handleConstant("10^")} className={buttonClass("function")}>10ˣ</button>

          {/* Row 4: Powers & Roots */}
          <button onClick={handleSquare} className={buttonClass("function")}>x²</button>
          <button onClick={handleCube} className={buttonClass("function")}>x³</button>
          <button onClick={() => handleFunction("√")} className={buttonClass("function")}>√</button>
          <button onClick={() => handleFunction("∛")} className={buttonClass("function")}>∛</button>
          <button onClick={() => handleOperator("^")} className={buttonClass("function")}>xʸ</button>

          {/* Row 5: Special & Parentheses */}
          <button onClick={() => handleConstant("π")} className={buttonClass("function")}>π</button>
          <button onClick={() => handleConstant("e")} className={buttonClass("function")}>e</button>
          <button onClick={() => handleParenthesis("(")} className={buttonClass("operator")}>(</button>
          <button onClick={() => handleParenthesis(")")} className={buttonClass("operator")}>)</button>
          <button onClick={backspace} className={buttonClass("clear")}><Delete className="h-4 w-4 mx-auto" /></button>

          {/* Row 6: Numbers 7-9 & Operators */}
          <button onClick={handleFactorial} className={buttonClass("function")}>n!</button>
          <button onClick={() => handleNumber("7")} className={buttonClass("number")}>7</button>
          <button onClick={() => handleNumber("8")} className={buttonClass("number")}>8</button>
          <button onClick={() => handleNumber("9")} className={buttonClass("number")}>9</button>
          <button onClick={() => handleOperator("÷")} className={buttonClass("operator")}>÷</button>

          {/* Row 7: Numbers 4-6 */}
          <button onClick={handleReciprocal} className={buttonClass("function")}>1/x</button>
          <button onClick={() => handleNumber("4")} className={buttonClass("number")}>4</button>
          <button onClick={() => handleNumber("5")} className={buttonClass("number")}>5</button>
          <button onClick={() => handleNumber("6")} className={buttonClass("number")}>6</button>
          <button onClick={() => handleOperator("×")} className={buttonClass("operator")}>×</button>

          {/* Row 8: Numbers 1-3 */}
          <button onClick={handlePercent} className={buttonClass("function")}>%</button>
          <button onClick={() => handleNumber("1")} className={buttonClass("number")}>1</button>
          <button onClick={() => handleNumber("2")} className={buttonClass("number")}>2</button>
          <button onClick={() => handleNumber("3")} className={buttonClass("number")}>3</button>
          <button onClick={() => handleOperator("-")} className={buttonClass("operator")}>−</button>

          {/* Row 9: 0 and Equals */}
          <button onClick={handlePlusMinus} className={buttonClass("function")}>±</button>
          <button onClick={() => handleNumber("0")} className={buttonClass("number")}>0</button>
          <button onClick={handleDecimal} className={buttonClass("number")}>.</button>
          <button onClick={calculate} className={buttonClass("equals")}>=</button>
          <button onClick={() => handleOperator("+")} className={buttonClass("operator")}>+</button>
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4 text-primary" />
            Calculator Tips
          </h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Toggle DEG/RAD for angle mode in trig functions</li>
            <li>• Use parentheses to control order of operations</li>
            <li>• Memory functions store values for later use</li>
            <li>• History shows recent calculations (click to reuse)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
