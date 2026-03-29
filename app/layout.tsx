import type { Metadata } from "next";
import { Inter, Poppins, Wallpoet } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import JourneyRefreshProvider from "@/components/JourneyRefreshProvider";
import GoogleAnalyticsPageView from "@/components/analytics/GoogleAnalyticsPageView";
import { siteConfig } from "@/config/site";
import Script from "next/script";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600"],
  subsets: ["latin"],
})

const wallpoet = Wallpoet({
  variable: "--font-wallpoet",
  weight: "400",
  subsets: ["latin"],
});

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-TK0DFSPQ1J";
const JOURNEY_SCRIPT_ID = "fc27acd2-7540-450f-8caa-a9e446f60ef5";
const JOURNEY_GROW_SITE_ID =
  "U2l0ZTpmYzI3YWNkMi03NTQwLTQ1MGYtOGNhYS1hOWU0NDZmNjBlZjU=";


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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
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
    <html
      lang="en"
      className={`${wallpoet.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          `}
        </Script>
        {/* End Google Analytics */}

        {/* Journey by Mediavine (Grow.me) - Site Verification & Monetization */}
        {/* Consolidated Script with optimized loading strategy */}
        <Script
          id="mediavine-journey"
          strategy="afterInteractive"
          data-grow-initializer=""
          data-site-id={JOURNEY_GROW_SITE_ID}
        >
          {`
            !(function(){
              window.growMe || (window.growMe = function(e){
                window.growMe._.push(e);
              }, window.growMe._ = []);
              
              var e = document.createElement("script");
              e.type = "text/javascript";
              e.src = "https://faves.grow.me/main.js";
              e.defer = true;
              e.setAttribute("data-grow-faves-site-id", "${JOURNEY_GROW_SITE_ID}");
              
              var t = document.getElementsByTagName("script")[0];
              t.parentNode.insertBefore(e, t);
            })();
          `}
        </Script>

        {/* Ads Script To run ads, we need to add the Journey ads script to your
        site. You can use our Grow for Wordpress plugin to automate this step.
        If you are not using Wordpress, find CMS-specific instructions here. */}
        <script
          type="text/javascript"
          async
          data-noptimize="1"
          data-cfasync="false"
          src={`https://scripts.scriptwrapper.com/tags/${JOURNEY_SCRIPT_ID}.js`}
        ></script>

        
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
              description:
                "Free online calculators, converters, and utility tools for everyone.",
              foundingDate: "2019",
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
              description:
                "Free online calculators, converters, and developer tools",
              publisher: { "@id": "https://softzar.com/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://softzar.com/tools?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.className} min-h-full flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <JourneyRefreshProvider>
            <Suspense fallback={null}>
              <GoogleAnalyticsPageView measurementId={GA_MEASUREMENT_ID} />
            </Suspense>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </JourneyRefreshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
