"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RefreshCw, Copy, Check, Shield, ShieldAlert, ShieldCheck, Eye, EyeOff } from "lucide-react";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
}

const faqs: FAQItem[] = [
  {
    question: "What makes a password strong?",
    answer: "A strong password has at least 12-16 characters and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols. It should be random and not contain dictionary words, personal information, or common patterns. The longer and more random a password is, the harder it is to crack through brute force attacks."
  },
  {
    question: "How long should my password be?",
    answer: "Security experts recommend passwords be at least 12-16 characters for standard accounts and 20+ characters for high-security accounts like banking or email. Each additional character exponentially increases the time required to crack the password. A 16-character random password would take billions of years to crack with current technology."
  },
  {
    question: "Is it safe to use an online password generator?",
    answer: "Our password generator runs entirely in your browser using JavaScript's cryptographically secure random number generator (crypto.getRandomValues). No passwords are sent to any server or stored anywhere. The generation happens locally on your device, making it completely safe to use. Always verify this by checking that the page works offline."
  },
  {
    question: "Should I use a different password for every account?",
    answer: "Absolutely yes. Using the same password across multiple accounts is one of the biggest security risks. If one account is compromised, attackers can access all your other accounts (credential stuffing attacks). Use a unique password for every account and store them in a reputable password manager."
  },
  {
    question: "What is a password manager and should I use one?",
    answer: "A password manager is software that securely stores and manages all your passwords in an encrypted vault. You only need to remember one master password. Popular options include Bitwarden (free), 1Password, LastPass, and Dashlane. Using a password manager is highly recommended as it allows you to use unique, complex passwords for every account without having to remember them."
  },
  {
    question: "How often should I change my passwords?",
    answer: "Current security guidance suggests you don't need to change passwords regularly if they're strong and unique. Change passwords immediately if: you suspect a breach, the service reports a security incident, you've shared the password, or you've used the password on an untrusted device. Focus on using strong, unique passwords rather than frequent changes."
  },
];

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
    excludeSimilar: false,
  });

  const generatePassword = useCallback(() => {
    let chars = "";
    
    const uppercaseChars = options.excludeAmbiguous 
      ? "ABCDEFGHJKLMNPQRSTUVWXYZ" 
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = options.excludeAmbiguous 
      ? "abcdefghjkmnpqrstuvwxyz" 
      : "abcdefghijklmnopqrstuvwxyz";
    const numberChars = options.excludeAmbiguous 
      ? "23456789" 
      : "0123456789";
    const symbolChars = options.excludeSimilar 
      ? "!@#$%^&*()_+-=[]{}|;:,.<>?" 
      : "!@#$%^&*()_+-=[]{}|;:'\",.<>?/\\`~";

    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.symbols) chars += symbolChars;

    if (chars.length === 0) {
      chars = lowercaseChars; // Fallback to lowercase if nothing selected
    }

    // Use crypto.getRandomValues for cryptographically secure randomness
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);
    
    let newPassword = "";
    for (let i = 0; i < options.length; i++) {
      newPassword += chars[array[i] % chars.length];
    }

    // Ensure at least one character from each selected category
    const ensureCategory = (password: string, category: string): string => {
      if (category.length === 0) return password;
      const randomIndex = Math.floor(Math.random() * password.length);
      const randomChar = category[Math.floor(Math.random() * category.length)];
      return password.substring(0, randomIndex) + randomChar + password.substring(randomIndex + 1);
    };

    if (options.uppercase) newPassword = ensureCategory(newPassword, uppercaseChars);
    if (options.lowercase) newPassword = ensureCategory(newPassword, lowercaseChars);
    if (options.numbers) newPassword = ensureCategory(newPassword, numberChars);
    if (options.symbols) newPassword = ensureCategory(newPassword, symbolChars);

    setPassword(newPassword);
    setCopied(false);
  }, [options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const calculateStrength = (): { score: number; label: string; color: string } => {
    let score = 0;
    
    // Length scoring
    if (options.length >= 8) score += 1;
    if (options.length >= 12) score += 1;
    if (options.length >= 16) score += 1;
    if (options.length >= 20) score += 1;
    
    // Character variety scoring
    if (options.uppercase) score += 1;
    if (options.lowercase) score += 1;
    if (options.numbers) score += 1;
    if (options.symbols) score += 2;

    if (score <= 3) return { score: 25, label: "Weak", color: "bg-red-500" };
    if (score <= 5) return { score: 50, label: "Fair", color: "bg-yellow-500" };
    if (score <= 7) return { score: 75, label: "Strong", color: "bg-blue-500" };
    return { score: 100, label: "Very Strong", color: "bg-green-500" };
  };

  const strength = calculateStrength();

  const getStrengthIcon = () => {
    if (strength.score <= 25) return <ShieldAlert className="h-5 w-5 text-red-500" />;
    if (strength.score <= 50) return <Shield className="h-5 w-5 text-yellow-500" />;
    return <ShieldCheck className="h-5 w-5 text-green-500" />;
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate strong, secure, random passwords instantly. Customize length and character types for maximum security. All passwords are generated locally in your browser for complete privacy."
      category={{ name: "Random Generators", slug: "random-generators" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Random Number Generator", href: "/random-number-generator" },
        { name: "UUID Generator", href: "/uuid-generator" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator" },
        { name: "JSON Formatter", href: "/json-formatter" },
      ]}
      content={
        <>
          <h2>Why Strong Passwords Matter</h2>
          <p>
            In today&apos;s digital world, passwords are the first line of defense protecting your personal information, financial accounts, and digital identity. Weak passwords are one of the leading causes of data breaches, with hackers using sophisticated tools that can try billions of password combinations per second.
          </p>
          <p>
            A strong, randomly generated password is virtually impossible to guess and extremely difficult to crack through brute force attacks. Using our password generator ensures you create passwords that meet modern security standards.
          </p>

          <h2>How Password Cracking Works</h2>
          <p>
            Understanding how hackers attempt to crack passwords helps illustrate why strong passwords matter:
          </p>
          
          <h3>Brute Force Attacks</h3>
          <p>
            Attackers systematically try every possible combination of characters. A simple 6-character lowercase password has about 308 million possibilities, which a modern computer can try in seconds. A 16-character password with mixed characters has over 10^28 possibilities—effectively uncrackable.
          </p>

          <h3>Dictionary Attacks</h3>
          <p>
            Rather than trying every combination, attackers use lists of common words, phrases, and previously leaked passwords. This is why passwords based on dictionary words (even with simple substitutions like &quot;p@ssw0rd&quot;) are easily cracked.
          </p>

          <h3>Credential Stuffing</h3>
          <p>
            Hackers use stolen username/password combinations from data breaches to try logging into other services. If you reuse passwords, one breach compromises all your accounts.
          </p>

          <h2>Password Length vs. Complexity</h2>
          <p>
            While both matter, length is generally more important than complexity. Here&apos;s why:
          </p>
          <ul>
            <li>An 8-character password with all character types: ~6 quadrillion combinations</li>
            <li>A 16-character password with just lowercase: ~43 sextillion combinations</li>
            <li>A 16-character password with all character types: ~10 octillion combinations</li>
          </ul>
          <p>
            Each additional character multiplies the possible combinations exponentially. This is why security experts now recommend focusing on length (12+ characters minimum) while still including variety.
          </p>

          <h2>Best Practices for Password Security</h2>
          
          <h3>Do&apos;s</h3>
          <ul>
            <li><strong>Use unique passwords:</strong> Every account should have its own password</li>
            <li><strong>Use a password manager:</strong> Store passwords securely without memorizing them</li>
            <li><strong>Enable two-factor authentication (2FA):</strong> Adds an extra layer of security</li>
            <li><strong>Use at least 12 characters:</strong> Longer is better</li>
            <li><strong>Mix character types:</strong> Include uppercase, lowercase, numbers, and symbols</li>
            <li><strong>Check for breaches:</strong> Use services like Have I Been Pwned to check if your email appears in breaches</li>
          </ul>

          <h3>Don&apos;ts</h3>
          <ul>
            <li><strong>Don&apos;t use personal information:</strong> Names, birthdays, addresses are easily guessed</li>
            <li><strong>Don&apos;t use common patterns:</strong> &quot;123456&quot;, &quot;qwerty&quot;, &quot;password&quot; are the first guesses</li>
            <li><strong>Don&apos;t reuse passwords:</strong> One breach shouldn&apos;t compromise multiple accounts</li>
            <li><strong>Don&apos;t share passwords:</strong> Keep them private</li>
            <li><strong>Don&apos;t write them down insecurely:</strong> Use a password manager instead</li>
            <li><strong>Don&apos;t use dictionary words:</strong> Even with substitutions, they&apos;re predictable</li>
          </ul>

          <h2>Understanding Our Password Generator</h2>
          <p>
            Our password generator uses <code>crypto.getRandomValues()</code>, a cryptographically secure pseudo-random number generator (CSPRNG) built into modern browsers. This ensures the passwords generated are truly random and unpredictable, unlike regular <code>Math.random()</code> which can be predicted.
          </p>
          
          <h3>Options Explained</h3>
          <ul>
            <li><strong>Length:</strong> Number of characters in the password. We recommend at least 16 for important accounts.</li>
            <li><strong>Uppercase Letters:</strong> A-Z (26 characters)</li>
            <li><strong>Lowercase Letters:</strong> a-z (26 characters)</li>
            <li><strong>Numbers:</strong> 0-9 (10 characters)</li>
            <li><strong>Symbols:</strong> Special characters like !@#$%^&amp;* (30+ characters)</li>
            <li><strong>Exclude Ambiguous:</strong> Removes characters that look similar (I, l, 1, O, 0) for easier reading</li>
            <li><strong>Exclude Similar:</strong> Removes characters that might cause issues in some systems</li>
          </ul>

          <h2>Passphrases: An Alternative Approach</h2>
          <p>
            Passphrases are another secure option—using multiple random words instead of random characters. For example: &quot;correct-horse-battery-staple&quot; is more memorable than &quot;Tr0ub4dor&amp;3&quot; while being equally secure.
          </p>
          <p>
            A 4-word passphrase from a 7,776-word list provides about 51 bits of entropy, equivalent to a 10-character random password. Use 5-6 words for higher security needs.
          </p>

          <h2>Additional Security Measures</h2>
          <ul>
            <li><strong>Two-Factor Authentication (2FA):</strong> Even if your password is compromised, 2FA requires a second verification method</li>
            <li><strong>Security Keys:</strong> Hardware tokens like YubiKey provide the strongest protection</li>
            <li><strong>Biometric Authentication:</strong> Fingerprint or face recognition adds convenience and security</li>
            <li><strong>Single Sign-On (SSO):</strong> Using &quot;Sign in with Google/Apple&quot; can be more secure than weak passwords</li>
            <li><strong>Regular Security Audits:</strong> Periodically review your accounts and access</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Generated Password Display */}
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            {getStrengthIcon()}
            <span className={`text-sm font-medium ${
              strength.score <= 25 ? "text-red-500" :
              strength.score <= 50 ? "text-yellow-500" :
              strength.score <= 75 ? "text-blue-500" : "text-green-500"
            }`}>
              {strength.label}
            </span>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white dark:bg-muted/30 p-4">
              <code className="flex-1 text-lg font-mono text-foreground break-all select-all">
                {showPassword ? password : "•".repeat(password.length)}
              </code>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generatePassword}
            variant="primary"
            className="w-full mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Password
          </Button>
        </div>

        {/* Password Length */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              Password Length
            </label>
            <span className="text-sm font-bold text-primary">{options.length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={options.length}
            onChange={(e) => updateOption("length", parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Character Types</label>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "uppercase", label: "Uppercase (A-Z)", example: "ABCDEF" },
              { key: "lowercase", label: "Lowercase (a-z)", example: "abcdef" },
              { key: "numbers", label: "Numbers (0-9)", example: "123456" },
              { key: "symbols", label: "Symbols (!@#$)", example: "!@#$%^" },
            ].map(({ key, label, example }) => (
              <label
                key={key}
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
                  options[key as keyof PasswordOptions]
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white dark:bg-muted/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={options[key as keyof PasswordOptions] as boolean}
                  onChange={(e) => updateOption(key as keyof PasswordOptions, e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <p className="text-xs text-muted-foreground font-mono">{example}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Advanced Options</label>
          
          <div className="space-y-2">
            <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOption("excludeAmbiguous", e.target.checked)}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">Exclude Ambiguous Characters</span>
                <p className="text-xs text-muted-foreground">Removes I, l, 1, O, 0 which look similar</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => updateOption("excludeSimilar", e.target.checked)}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">Exclude Similar Symbols</span>
                <p className="text-xs text-muted-foreground">Removes quotes and backslashes that may cause issues</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security Tips */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Quick Security Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use a unique password for every account
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Store passwords in a password manager
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Enable two-factor authentication when available
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use at least 16 characters for important accounts
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
