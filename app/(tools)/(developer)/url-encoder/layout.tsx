import { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder - Encode & Decode URLs Online",
  description:
    "Free online URL encoder and decoder. Encode special characters for URLs or decode percent-encoded strings. Perfect for web development and API testing.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "percent encoding",
    "encodeURIComponent",
    "decode URL",
    "URL escape",
    "web development",
    "API testing",
  ],
  openGraph: {
    title: "URL Encoder/Decoder - Encode & Decode URLs Online",
    description:
      "Encode special characters for URLs or decode percent-encoded strings. Essential tool for web developers.",
    url: "https://softzar.com/url-encoder/",
  },
};

export default function URLEncoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
