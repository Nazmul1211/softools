import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${siteConfig.name} — your go-to destination for free, easy-to-use online calculators and tools.`,
  alternates: {
    canonical: "https://softzar.com/about/",
  },
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

        {/* Entity definition for AI/LLM parsing */}
        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-3">What is Softzar?</h2>
          <p>
            Softzar is a comprehensive free online toolset offering calculators, PDF tools, 
            image converters, unit converters, and 50+ utilities. Launched in 2024, it serves 
            users worldwide with instant browser-based tools — no sign-up required, no data stored. 
            All calculations are performed locally for complete privacy and speed.
          </p>
        </div>

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
            Percentage, GPA, fraction, scientific, and equation solvers.
          </li>
          <li>
            <strong className="text-foreground">Finance Tools</strong> — Loan, EMI,
            mortgage, tax, and investment calculators.
          </li>
          <li>
            <strong className="text-foreground">Health &amp; Fitness</strong> —
            BMI, BMR, TDEE, calorie, and body composition calculators.
          </li>
          <li>
            <strong className="text-foreground">Unit Converters</strong> —
            Length, weight, temperature, volume, area, and speed converters.
          </li>
          <li>
            <strong className="text-foreground">Developer Tools</strong> — JSON
            formatters, Base64 encoders, UUID generators, regex testers, and hash generators.
          </li>
          <li>
            <strong className="text-foreground">Text Tools</strong> — Word counters,
            case converters, Lorem ipsum generators.
          </li>
          <li>
            <strong className="text-foreground">Date &amp; Time</strong> — Age calculators,
            date difference, time zone converters, countdown timers.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground">
          Why Choose Us?
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong className="text-foreground">100% Free</strong> — No hidden costs, no premium tiers</li>
          <li><strong className="text-foreground">Privacy First</strong> — All calculations happen in your browser</li>
          <li><strong className="text-foreground">No Sign-up</strong> — Use any tool instantly, no account needed</li>
          <li><strong className="text-foreground">Fast &amp; Modern</strong> — Built with Next.js for optimal performance</li>
          <li><strong className="text-foreground">Mobile Friendly</strong> — Works perfectly on phones and tablets</li>
          <li><strong className="text-foreground">Always Available</strong> — No downtime, no rate limits</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground">Get in Touch</h2>
        <p>
          Have a suggestion for a new tool or found a bug? We&apos;d love to hear
          from you. Visit our{" "}
          <Link href="/contact/" className="text-primary hover:underline">
            Contact page
          </Link>{" "}
          to get in touch.
        </p>
      </div>

      {/* Enhanced Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://softzar.com/#organization",
            name: "Softzar",
            alternateName: "Softzar Tools",
            url: "https://softzar.com",
            logo: {
              "@type": "ImageObject",
              url: "https://softzar.com/logo.png",
              width: 512,
              height: 512,
            },
            description: "Softzar is a comprehensive free online toolset offering calculators, converters, developer tools, and 50+ utilities. All tools run in your browser with no sign-up required.",
            foundingDate: "2024",
            sameAs: [
              "https://twitter.com/softzar",
              "https://github.com/softzar",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              url: "https://softzar.com/contact",
              availableLanguage: "English",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "US",
            },
            areaServed: "Worldwide",
            slogan: "Free online tools for everyone",
          }),
        }}
      />

      {/* WebSite Schema for sitelinks */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://softzar.com/#website",
            name: "Softzar",
            url: "https://softzar.com",
            description: "Free online calculators, converters, and utility tools",
            publisher: {
              "@id": "https://softzar.com/#organization",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://softzar.com/tools?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
