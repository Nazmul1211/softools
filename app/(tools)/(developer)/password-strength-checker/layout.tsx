import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Strength Checker — Test How Strong Your Password Is | SoftZaR",
  description:
    "Check your password strength instantly. See estimated crack time, entropy score, and get improvement suggestions. Your password never leaves your browser — 100% private. Free security tool.",
  keywords: [
    "password strength checker",
    "password strength tester",
    "how strong is my password",
    "password security checker",
    "password entropy calculator",
    "password crack time",
    "check password strength",
    "password strength meter",
  ],
  openGraph: {
    title: "Password Strength Checker — How Strong Is Your Password?",
    description:
      "Test password strength with estimated crack time, entropy score, and improvement tips. 100% private — processed in your browser only.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Strength Checker | SoftZaR",
    description:
      "Check how strong your password is. Get crack time estimates, entropy scores, and security tips. 100% private.",
  },
};

export default function PasswordStrengthCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
