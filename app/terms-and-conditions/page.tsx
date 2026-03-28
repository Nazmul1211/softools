import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Read the terms and conditions for using ${siteConfig.name}. Understand your rights and responsibilities.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Terms and Conditions
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: March 27, 2026
      </p>

      <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="mt-3">
            By accessing and using {siteConfig.name}, you accept and agree to be
            bound by these Terms and Conditions. If you do not agree, please do
            not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Use of Service
          </h2>
          <p className="mt-3">
            {siteConfig.name} provides free online tools and calculators for
            informational and educational purposes. You agree to use our services
            only for lawful purposes and in accordance with these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Accuracy of Results
          </h2>
          <p className="mt-3">
            While we strive to ensure the accuracy of our tools and calculators,
            results are provided &quot;as is&quot; and should not be relied upon
            as professional advice. Always verify important calculations with a
            qualified professional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Intellectual Property
          </h2>
          <p className="mt-3">
            All content, design, code, and branding on {siteConfig.name} are the
            intellectual property of {siteConfig.name} and are protected by
            copyright laws. You may not reproduce, distribute, or modify any
            part of this website without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Limitation of Liability
          </h2>
          <p className="mt-3">
            {siteConfig.name} shall not be liable for any direct, indirect,
            incidental, consequential, or punitive damages arising from your use
            of the website or any tools provided. You use our services at your
            own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Third-Party Links
          </h2>
          <p className="mt-3">
            Our website may contain links to third-party websites. We are not
            responsible for the content, privacy practices, or terms of any
            external sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Modifications
          </h2>
          <p className="mt-3">
            We reserve the right to modify these Terms and Conditions at any
            time. Changes will be effective immediately upon posting. Your
            continued use of the website constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            8. Contact
          </h2>
          <p className="mt-3">
            For questions about these Terms, please contact us at{" "}
            <a
              href="mailto:contact@softzar.com"
              className="text-primary hover:underline"
            >
              contact@softzar.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
