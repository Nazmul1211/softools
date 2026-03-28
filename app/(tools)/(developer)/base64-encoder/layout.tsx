import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Encode & Decode Base64 Online",
  description:
    "Free Base64 encoder and decoder. Convert text to Base64 or decode Base64 strings instantly. Support for UTF-8 encoding and file encoding options.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "encode Base64",
    "decode Base64",
    "Base64 converter",
    "text to Base64",
    "Base64 online",
  ],
  openGraph: {
    title: "Base64 Encoder/Decoder - Free Online Tool",
    description: "Encode text to Base64 or decode Base64 strings. Free online tool with UTF-8 support and instant conversion.",
    type: "website",
  },
};

export default function Base64EncoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
