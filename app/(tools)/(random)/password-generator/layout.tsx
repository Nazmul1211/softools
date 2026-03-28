import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator - Create Strong Secure Passwords",
  description:
    "Generate strong, secure passwords instantly. Customize length, include uppercase, lowercase, numbers, and symbols. Free password generator with strength indicator.",
  keywords: [
    "password generator",
    "secure password",
    "random password",
    "strong password",
    "password creator",
    "generate password",
    "password strength",
    "online password generator",
  ],
  openGraph: {
    title: "Free Password Generator - Create Secure Passwords",
    description: "Generate strong, random passwords that are difficult to crack. Customize your password with various options and check its strength instantly.",
    type: "website",
  },
};

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
