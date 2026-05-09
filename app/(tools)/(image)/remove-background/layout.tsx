import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Background from Image - Free Background Remover",
  description:
    "Remove backgrounds from images instantly using AI. Create transparent PNG images for free. No signup required, works entirely in your browser.",
  keywords: [
    "remove background",
    "background remover",
    "transparent background",
    "remove image background",
    "png transparent",
    "cutout image",
    "photo background eraser",
    "AI background removal",
  ],
  alternates: {
    canonical: "https://softzar.com/remove-background/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
