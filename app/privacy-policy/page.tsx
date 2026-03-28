import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Read the privacy policy for ${siteConfig.name}. Learn how we handle your data and protect your privacy.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated: March 27, 2026
      </p>

      <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Introduction
          </h2>
          <p className="mt-3">
            Welcome to {siteConfig.name}. We are committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your information when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Information We Collect
          </h2>
          <p className="mt-3">
            Our tools run entirely in your browser. We do not collect, store, or
            process any personal data you enter into our calculators or tools.
          </p>
          <p className="mt-3">
            We may automatically collect limited, non-personal information such
            as browser type, operating system, referring URLs, and pages visited
            through analytics services to improve our website performance and
            user experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Cookies
          </h2>
          <p className="mt-3">
            We use cookies only for essential functionality such as saving your
            theme preference (light or dark mode). Third-party services like
            analytics or advertising providers may also use cookies. You can
            manage cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Third-Party Services
          </h2>
          <p className="mt-3">
            We may use third-party services (such as Google Analytics or ad
            networks) that collect, monitor, and analyze browsing data. These
            services have their own privacy policies governing the use of your
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Data Security
          </h2>
          <p className="mt-3">
            We take reasonable measures to protect our website and its users.
            However, no method of transmission over the internet is 100% secure.
            While we strive to use commercially acceptable means to protect your
            information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Children&apos;s Privacy
          </h2>
          <p className="mt-3">
            Our website is not directed at children under the age of 13. We do
            not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Changes to This Policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. Any changes will
            be posted on this page with a revised &quot;Last updated&quot; date.
            We encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            8. Contact Us
          </h2>
          <p className="mt-3">
            If you have questions or concerns about this Privacy Policy, please
            contact us at{" "}
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
