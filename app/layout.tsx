import type { Metadata } from "next";
import { Inter, Wallpoet } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import JourneyRefreshProvider from "@/components/JourneyRefreshProvider";
import { siteConfig } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const wallpoet = Wallpoet({
  variable: "--font-wallpoet",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "calculator",
    "tools",
    "online calculator",
    "free tools",
    "percentage calculator",
    "BMI calculator",
    "loan calculator",
  ],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@softzar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${wallpoet.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Site-wide Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://softzar.com/#organization",
              name: "Softzar",
              url: "https://softzar.com",
              logo: "https://softzar.com/logo.png",
              description: "Free online calculators, converters, and utility tools for everyone.",
              foundingDate: "2024",
              sameAs: [
                "https://twitter.com/softzar",
                "https://github.com/softzar",
              ],
            }),
          }}
        />
        {/* WebSite Schema for sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://softzar.com/#website",
              name: "Softzar",
              url: "https://softzar.com",
              description: "Free online calculators, converters, and developer tools",
              publisher: { "@id": "https://softzar.com/#organization" },
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
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <JourneyRefreshProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </JourneyRefreshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
