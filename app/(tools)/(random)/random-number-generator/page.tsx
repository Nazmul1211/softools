"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);

  const generateNumbers = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const countNum = parseInt(count);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
      return;
    }

    if (minNum > maxNum) {
      return;
    }

    if (!allowDuplicates && countNum > maxNum - minNum + 1) {
      alert("Cannot generate that many unique numbers in the given range");
      return;
    }

    const numbers: number[] = [];

    if (allowDuplicates) {
      for (let i = 0; i < countNum; i++) {
        numbers.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
      }
    } else {
      const available = Array.from(
        { length: maxNum - minNum + 1 },
        (_, i) => minNum + i
      );
      for (let i = 0; i < countNum; i++) {
        const index = Math.floor(Math.random() * available.length);
        numbers.push(available[index]);
        available.splice(index, 1);
      }
    }

    setResults(numbers);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(", "));
  };

  return (
    <ToolLayout
      title="Random Number Generator"
      description="Generate random numbers within a specified range. Perfect for games, raffles, lottery picks, and random sampling."
      category={{ name: "Random Generators", slug: "random-generators" }}
      relatedTools={[
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
      ]}
      content={
        <>
          <h2>What is a Random Number Generator?</h2>
          <p>
            A random number generator (RNG) is a tool that produces numbers that lack any discernible pattern or predictability. In computing, truly random numbers are derived from physical phenomena (hardware RNG), while <strong>pseudo-random number generators (PRNGs)</strong> use mathematical algorithms to produce sequences of numbers that approximate randomness. This tool uses the browser&apos;s built-in <code>Math.random()</code> PRNG, which is sufficient for games, raffles, sampling, and general-purpose randomization.
          </p>

          <h2>How Does This Generator Work?</h2>
          <p>
            When you click &quot;Generate,&quot; the tool runs the following process:
          </p>
          <ul>
            <li><strong>With duplicates allowed:</strong> For each requested number, it generates a random decimal between 0 and 1, scales it to your specified range (minimum to maximum, inclusive), and rounds down to the nearest integer.</li>
            <li><strong>Without duplicates (unique numbers):</strong> It creates an array of all possible integers in the range, then uses the <strong>Fisher-Yates shuffle</strong> algorithm to randomly select numbers one at a time without replacement. This guarantees every generated number is unique.</li>
          </ul>
          <p>
            The formula for generating a random integer in a range is: <strong>Math.floor(Math.random() × (max − min + 1)) + min</strong>.
          </p>

          <h2>Common Use Cases</h2>
          <ul>
            <li><strong>Lottery and raffle draws:</strong> Generate unique winning numbers for contests, sweepstakes, or classroom activities without bias.</li>
            <li><strong>Board games and dice simulation:</strong> Simulate dice rolls (set min=1, max=6) or card draws for tabletop gaming sessions.</li>
            <li><strong>Statistical sampling:</strong> Randomly select participants from a numbered list for surveys, audits, or quality control inspections.</li>
            <li><strong>Decision making:</strong> When faced with multiple equal options, let a random number make the choice for you (e.g., picking a restaurant from a numbered list).</li>
            <li><strong>Educational exercises:</strong> Teachers can generate random math problems, quiz question orders, or student group assignments.</li>
            <li><strong>Cryptography consideration:</strong> Note that <code>Math.random()</code> is NOT cryptographically secure. For password generation, encryption keys, or security tokens, use <code>crypto.getRandomValues()</code> instead.</li>
          </ul>

          <h2>Understanding the Statistics</h2>
          <p>
            When you generate multiple numbers, this tool automatically calculates three useful statistics:
          </p>
          <ul>
            <li><strong>Sum:</strong> The total of all generated numbers. Useful for checking dice roll totals or aggregate values.</li>
            <li><strong>Average (Mean):</strong> The arithmetic mean of the generated numbers. Over many generations, this should approach the midpoint of your range (i.e., (min + max) / 2).</li>
            <li><strong>Range:</strong> The spread between the smallest and largest generated numbers. This gives you a sense of how dispersed the results are.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>Are these numbers truly random?</h3>
          <p>
            This tool uses a pseudo-random number generator (PRNG). While the numbers pass most statistical randomness tests and are perfectly suitable for games, raffles, and sampling, they are <em>not</em> cryptographically random. If you need cryptographic-grade randomness (for passwords, encryption, or security applications), you should use dedicated cryptographic libraries.
          </p>

          <h3>What is the maximum range I can use?</h3>
          <p>
            You can set any integer range. Practically, JavaScript handles integers safely up to 2<sup>53</sup> − 1 (about 9 quadrillion), so you have an enormous range available. For unique number generation, keep in mind that the range must contain at least as many values as the count you request.
          </p>

          <h3>Can I generate negative numbers?</h3>
          <p>
            Yes. Simply set the minimum value to a negative number (e.g., min = -50, max = 50) to generate random numbers across a range that includes negatives.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Minimum"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Min value"
          />
          <Input
            label="Maximum"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Max value"
          />
          <Input
            label="How Many?"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Count"
            min="1"
            max="100"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="duplicates"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label
            htmlFor="duplicates"
            className="text-sm text-foreground dark:text-zinc-300"
          >
            Allow duplicate numbers
          </label>
        </div>

        <div className="flex gap-3">
          <Button onClick={generateNumbers} size="lg">
            Generate
          </Button>
          {results.length > 0 && (
            <Button onClick={copyToClipboard} variant="outline" size="lg">
              Copy Results
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 dark:border-primary/50 dark:bg-primary/20">
              <p className="mb-3 text-sm font-medium text-primary dark:text-primary">
                Generated Numbers
              </p>
              <div className="flex flex-wrap gap-2">
                {results.map((num, index) => (
                  <span
                    key={index}
                    className="inline-flex min-w-[3rem] items-center justify-center rounded-lg bg-white px-3 py-2 text-lg font-bold text-primary/80 shadow-sm dark:bg-primary/20 dark:text-blue-100"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            {results.length > 1 && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Sum</p>
                  <p className="mt-1 text-xl font-bold text-foreground dark:text-foreground">
                    {results.reduce((a, b) => a + b, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Average</p>
                  <p className="mt-1 text-xl font-bold text-foreground dark:text-foreground">
                    {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Range</p>
                  <p className="mt-1 text-xl font-bold text-foreground dark:text-foreground">
                    {Math.min(...results)} - {Math.max(...results)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
