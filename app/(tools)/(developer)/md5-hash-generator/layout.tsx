import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MD5 Hash Generator - Generate MD5 Checksums Online",
  description:
    "Free online MD5 hash generator. Generate MD5 checksums for text strings instantly. Compare hashes and verify file integrity.",
  keywords: [
    "MD5 hash",
    "MD5 generator",
    "hash generator",
    "checksum",
    "MD5 encryption",
    "message digest",
    "hash calculator",
  ],
  openGraph: {
    title: "MD5 Hash Generator - Generate MD5 Checksums Online",
    description:
      "Generate MD5 hash values for text strings. Compare hashes and verify data integrity.",
    url: "https://softzar.com/md5-hash-generator/",
  },
};

export default function MD5HashGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
