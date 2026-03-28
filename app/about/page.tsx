import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${siteConfig.name} — your go-to destination for free, easy-to-use online calculators and tools.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        About {siteConfig.name}
      </h1>
      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          {siteConfig.name} is a free online platform built to make everyday
          calculations and digital tasks simpler, faster, and more accessible for
          everyone. Whether you&apos;re a student, professional, or simply
          someone looking for a quick answer, our growing library of tools is
          designed to save you time and effort.
        </p>

        <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
        <p>
          We believe powerful tools should be free, private, and instantly
          available. That&apos;s why every calculator and utility on{" "}
          {siteConfig.name} runs entirely in your browser — no sign-ups, no data
          collection, no server-side processing. Your information stays with you.
        </p>

        <h2 className="text-2xl font-semibold text-foreground">
          What We Offer
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-foreground">Math Calculators</strong> —
            Percentage, fraction, and equation solvers.
          </li>
          <li>
            <strong className="text-foreground">Finance Tools</strong> — Loan,
            mortgage, and investment calculators.
          </li>
          <li>
            <strong className="text-foreground">Health &amp; Fitness</strong> —
            BMI, calorie, and body metric calculators.
          </li>
          <li>
            <strong className="text-foreground">Unit Converters</strong> —
            Length, weight, temperature, and more.
          </li>
          <li>
            <strong className="text-foreground">Developer Tools</strong> — JSON
            formatters, encoders, and generators.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground">
          Why Choose Us?
        </h2>
        <p>
          Unlike many online tool sites, we prioritize a clean, ad-light
          experience with modern design and lightning-fast performance. Every tool
          is carefully built, tested, and optimized for both desktop and mobile
          devices.
        </p>

        <h2 className="text-2xl font-semibold text-foreground">Get in Touch</h2>
        <p>
          Have a suggestion for a new tool or found a bug? We&apos;d love to hear
          from you. Visit our{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact page
          </a>{" "}
          to get in touch.
        </p>
      </div>
    </div>
  );
}
