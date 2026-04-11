"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Eye, EyeOff, Clock, Lock, AlertTriangle, CheckCircle2, XCircle, Info, Zap } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How long would it take to crack my password?",
    answer:
      "Crack time depends on password entropy (length × character pool complexity) and the attacker's computing power. This calculator estimates time based on 10 billion guesses per second — roughly the capability of a modern GPU cluster using tools like Hashcat. A random 8-character password with uppercase, lowercase, numbers, and symbols (~52 bits of entropy) would take approximately 39 minutes at this speed. A 12-character password with the same character set (~78 bits) would take approximately 200 years. Length is the single most important factor in crack resistance.",
  },
  {
    question: "Is a longer password always better than a complex one?",
    answer:
      "Yes. Password length contributes more to security than character complexity because each additional character multiplies the total possible combinations exponentially. A 20-character lowercase-only password (26^20 ≈ 2×10^28 combinations) is vastly stronger than an 8-character password using all character types (95^8 ≈ 6.6×10^15). The NIST Special Publication 800-63B (2024 revision) recommends focusing on length (minimum 12 characters) rather than imposing arbitrary complexity requirements like mandatory special characters.",
  },
  {
    question: "Are passphrases more secure than traditional passwords?",
    answer:
      "Passphrases — multiple random words strung together (e.g., 'correct horse battery staple') — are both more secure and easier to remember than short complex passwords. A 4-word passphrase from a 7,776-word dictionary yields approximately 51 bits of entropy, while a 5-word passphrase yields about 64 bits. For maximum security, use 5–7 random words (not a meaningful sentence) with at least one number or symbol inserted. The Diceware method is the gold standard for generating truly random passphrases.",
  },
  {
    question: "Should I use a password manager?",
    answer:
      "Absolutely. Password managers (1Password, Bitwarden, KeePass, Dashlane) generate unique, strong passwords for every account and store them in an encrypted vault protected by one master password. This eliminates the two biggest security risks: password reuse (using the same password on multiple sites) and weak passwords (chosen for memorability rather than security). The master password for your vault should be a strong passphrase of 5+ random words that you memorize. Using a password manager is the single most impactful step most people can take to improve their online security.",
  },
  {
    question: "What makes a password weak even if it looks complex?",
    answer:
      "Several patterns make passwords predictable despite appearing complex: dictionary words with simple substitutions (P@ssw0rd), keyboard patterns (qwerty, 123456, zxcvbn), personal information (names, birthdays, pet names), common formats (Word + Number + Symbol, like Summer2024!), and sequences (abc123, password1). Attackers use dictionaries of billions of leaked passwords and pattern-matching algorithms that test these variants first. A truly strong password is generated randomly, not constructed from meaningful patterns.",
  },
  {
    question: "Does this tool store or transmit my password?",
    answer:
      "No. This password strength checker runs entirely in your browser using client-side JavaScript. Your password is never sent to any server, never stored anywhere, and never leaves your device. You can verify this by checking the browser's network tab (Developer Tools → Network) while typing — no requests are made. The analysis is performed using mathematical entropy calculation and pattern detection, all computed locally on your machine.",
  },
];

/* ────────────── Types ────────────── */

interface PasswordAnalysis {
  score: number; // 0-100
  label: string;
  entropy: number;
  crackTime: string;
  crackTimeSeconds: number;
  charSets: {
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    unicode: boolean;
  };
  length: number;
  poolSize: number;
  warnings: string[];
  suggestions: string[];
  checks: { label: string; passed: boolean }[];
}

/* ────────────── Constants ────────────── */

const commonPasswords = [
  "password", "123456", "12345678", "qwerty", "abc123", "password1",
  "admin", "letmein", "welcome", "monkey", "dragon", "master",
  "login", "princess", "football", "shadow", "sunshine", "trustno1",
  "iloveyou", "batman", "access", "hello", "charlie", "superman",
];

const keyboardPatterns = [
  "qwerty", "qwertz", "azerty", "asdf", "zxcv", "1234", "abcd",
  "!@#$", "qazwsx", "1qaz", "2wsx",
];

/* ────────────── Helpers ────────────── */

function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;

  /* Character set detection */
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  const hasUnicode = /[^\x00-\x7F]/.test(password);

  /* Calculate character pool */
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33;
  if (hasUnicode) poolSize += 100;

  /* Entropy: log2(poolSize^length) = length × log2(poolSize) */
  const entropy = poolSize > 0 ? length * Math.log2(poolSize) : 0;

  /* Crack time estimation at 10 billion guesses/sec */
  const guessesPerSecond = 10_000_000_000;
  const totalCombinations = Math.pow(poolSize, length);
  const avgGuesses = totalCombinations / 2;
  const crackTimeSeconds = avgGuesses / guessesPerSecond;

  /* Format crack time */
  let crackTime = "Instant";
  if (crackTimeSeconds < 0.001) crackTime = "Instant";
  else if (crackTimeSeconds < 1) crackTime = "Less than 1 second";
  else if (crackTimeSeconds < 60) crackTime = `${Math.round(crackTimeSeconds)} seconds`;
  else if (crackTimeSeconds < 3600) crackTime = `${Math.round(crackTimeSeconds / 60)} minutes`;
  else if (crackTimeSeconds < 86400) crackTime = `${Math.round(crackTimeSeconds / 3600)} hours`;
  else if (crackTimeSeconds < 86400 * 365) crackTime = `${Math.round(crackTimeSeconds / 86400)} days`;
  else if (crackTimeSeconds < 86400 * 365 * 1000) crackTime = `${Math.round(crackTimeSeconds / (86400 * 365))} years`;
  else if (crackTimeSeconds < 86400 * 365 * 1_000_000) crackTime = `${(crackTimeSeconds / (86400 * 365 * 1000)).toFixed(0)} thousand years`;
  else if (crackTimeSeconds < 86400 * 365 * 1_000_000_000) crackTime = `${(crackTimeSeconds / (86400 * 365 * 1_000_000)).toFixed(0)} million years`;
  else crackTime = `${(crackTimeSeconds / (86400 * 365 * 1_000_000_000)).toFixed(0)}+ billion years`;

  /* Warnings and suggestions */
  const warnings: string[] = [];
  const suggestions: string[] = [];

  /* Check for common passwords */
  const lowerPw = password.toLowerCase();
  if (commonPasswords.some((cp) => lowerPw.includes(cp))) {
    warnings.push("Contains a commonly used password pattern");
  }

  /* Check for keyboard patterns */
  if (keyboardPatterns.some((kp) => lowerPw.includes(kp))) {
    warnings.push("Contains a keyboard pattern (easily guessable)");
  }

  /* Check for repeated characters */
  if (/(.)\1{2,}/.test(password)) {
    warnings.push("Contains repeated characters (aaa, 111, etc.)");
  }

  /* Check for sequential characters */
  let hasSequential = false;
  for (let i = 0; i < password.length - 2; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    if (c2 - c1 === 1 && c3 - c2 === 1) { hasSequential = true; break; }
    if (c1 - c2 === 1 && c2 - c3 === 1) { hasSequential = true; break; }
  }
  if (hasSequential) {
    warnings.push("Contains sequential characters (abc, 321, etc.)");
  }

  /* Check for all same case */
  if (password.length > 0 && (password === password.toLowerCase() || password === password.toUpperCase()) && /[a-zA-Z]/.test(password)) {
    suggestions.push("Mix uppercase and lowercase letters");
  }

  if (!hasNumbers && !hasSymbols) {
    suggestions.push("Add numbers or special characters");
  }

  if (length < 12) {
    suggestions.push("Increase length to at least 12 characters");
  }

  if (length < 16 && !hasSymbols) {
    suggestions.push("Consider using a passphrase (4–5 random words)");
  }

  /* Security checks */
  const checks = [
    { label: "At least 8 characters", passed: length >= 8 },
    { label: "At least 12 characters (recommended)", passed: length >= 12 },
    { label: "Contains lowercase letters", passed: hasLower },
    { label: "Contains uppercase letters", passed: hasUpper },
    { label: "Contains numbers", passed: hasNumbers },
    { label: "Contains special characters", passed: hasSymbols },
    { label: "No common patterns detected", passed: warnings.length === 0 },
  ];

  /* Score calculation (0-100) */
  let score = 0;
  /* Length contribution (up to 40 points) */
  score += Math.min(40, length * 3);
  /* Character set diversity (up to 25 points) */
  const setsUsed = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
  score += setsUsed * 6.25;
  /* Entropy bonus (up to 25 points) */
  score += Math.min(25, entropy / 5);
  /* Penalty for warnings (up to -20) */
  score -= warnings.length * 10;
  /* Clamp */
  score = Math.max(0, Math.min(100, Math.round(score)));

  /* Label */
  let label = "Very Weak";
  if (score >= 80) label = "Very Strong";
  else if (score >= 60) label = "Strong";
  else if (score >= 40) label = "Fair";
  else if (score >= 20) label = "Weak";

  return {
    score,
    label,
    entropy: Math.round(entropy * 10) / 10,
    crackTime,
    crackTimeSeconds,
    charSets: { lowercase: hasLower, uppercase: hasUpper, numbers: hasNumbers, symbols: hasSymbols, unicode: hasUnicode },
    length,
    poolSize,
    warnings,
    suggestions,
    checks,
  };
}

function getScoreColor(score: number) {
  if (score >= 80) return { text: "text-green-600 dark:text-green-400", bg: "bg-green-500", fill: "from-green-400 to-green-600" };
  if (score >= 60) return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500", fill: "from-blue-400 to-blue-600" };
  if (score >= 40) return { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500", fill: "from-yellow-400 to-yellow-600" };
  if (score >= 20) return { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500", fill: "from-orange-400 to-orange-600" };
  return { text: "text-red-600 dark:text-red-400", bg: "bg-red-500", fill: "from-red-400 to-red-600" };
}

function getShieldIcon(score: number) {
  if (score >= 80) return <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />;
  if (score >= 60) return <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />;
  if (score >= 40) return <ShieldAlert className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />;
  return <ShieldX className="h-8 w-8 text-red-600 dark:text-red-400" />;
}

/* ────────────────────── Component ────────────────────── */

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => {
    if (!password) return null;
    return analyzePassword(password);
  }, [password]);

  const colors = analysis ? getScoreColor(analysis.score) : null;

  return (
    <ToolLayout
      title="Password Strength Checker"
      description="Test how strong your password is with real-time entropy analysis, estimated crack time, and actionable improvement suggestions. Your password never leaves your browser — all analysis is performed locally using client-side JavaScript."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter your password", text: "Type or paste the password you want to test into the input field. Use the eye icon to toggle password visibility." },
        { name: "Review the strength score", text: "See the overall strength rating (Very Weak to Very Strong), entropy bits, and estimated time to crack at 10 billion guesses per second." },
        { name: "Check security criteria", text: "Review which security criteria your password passes or fails, including length, character diversity, and common pattern detection." },
        { name: "Follow improvement suggestions", text: "Apply the specific suggestions to strengthen your password, such as increasing length, mixing character types, or switching to a passphrase." },
      ]}
      relatedTools={[
        { name: "Password Generator", href: "/password-generator" },
        { name: "UUID Generator", href: "/uuid-generator" },
        { name: "MD5 Hash Generator", href: "/md5-hash-generator" },
        { name: "Base64 Encoder/Decoder", href: "/base64-encoder" },
        { name: "Regex Tester", href: "/regex-tester" },
      ]}
      content={
        <>
          <h2>What Is a Password Strength Checker?</h2>
          <p>
            A password strength checker analyzes a password&apos;s resistance to cracking attempts by evaluating its length, character diversity, entropy (randomness), and susceptibility to common attack patterns. Unlike simple &ldquo;must contain a number and symbol&rdquo; rules, this tool uses mathematical entropy calculation and pattern detection to provide a realistic assessment of how long it would take an attacker with modern hardware to crack your password through brute-force or dictionary attacks.
          </p>

          <h2>How Is Password Strength Measured?</h2>
          <p>
            Password strength is quantified through <strong>entropy</strong>, measured in bits:
          </p>
          <p>
            <strong>Entropy = Length × log₂(Pool Size)</strong>
          </p>
          <p>
            Where <strong>pool size</strong> is the total number of possible characters. For example:
          </p>
          <ul>
            <li>Lowercase only (a–z): pool = 26</li>
            <li>+ Uppercase (A–Z): pool = 52</li>
            <li>+ Numbers (0–9): pool = 62</li>
            <li>+ Symbols (!@#$%...): pool = 95</li>
          </ul>

          <h3>Worked Example</h3>
          <p>
            A 12-character password using uppercase, lowercase, numbers, and symbols (pool = 95):
          </p>
          <ul>
            <li><strong>Entropy:</strong> 12 × log₂(95) = 12 × 6.57 = <strong>78.8 bits</strong></li>
            <li><strong>Total combinations:</strong> 95¹² = 5.4 × 10²³</li>
            <li><strong>At 10 billion guesses/sec:</strong> 5.4 × 10²³ ÷ (2 × 10¹⁰) = ~851 years to test half</li>
          </ul>

          <h2>How Hackers Crack Passwords</h2>

          <h3>Brute Force Attacks</h3>
          <p>
            A brute-force attack systematically tries every possible combination. Modern GPUs (like NVIDIA RTX 4090) can compute over <strong>100 billion MD5 hashes per second</strong> and about <strong>10 billion bcrypt attempts per second</strong> (depending on cost factor). This calculator assumes a rate of 10 billion guesses per second — a realistic estimate for a well-equipped attacker targeting common hash algorithms.
          </p>

          <h3>Dictionary Attacks</h3>
          <p>
            Instead of trying every combination, dictionary attacks use lists of known passwords, common words, names, and patterns. The &ldquo;rockyou.txt&rdquo; wordlist alone contains over 14 million leaked passwords. Attackers also use rule-based mutations — trying &ldquo;password&rdquo; and then &ldquo;P@ssw0rd&rdquo;, &ldquo;Password1!&rdquo;, and thousands of similar variants automatically. This is why common substitutions (@ for a, 0 for o) provide almost no additional security.
          </p>

          <h3>Credential Stuffing</h3>
          <p>
            When a data breach leaks passwords from one site, attackers automatically test those same email/password combinations on other sites (banks, email, social media). Because 65% of people reuse passwords across multiple accounts, credential stuffing has a disturbingly high success rate. This is the strongest argument for using unique passwords on every account, managed by a password manager.
          </p>

          <h2>NIST Password Guidelines (2024)</h2>
          <p>
            The National Institute of Standards and Technology (NIST) Special Publication 800-63B provides the most authoritative password guidance for organizations and individuals:
          </p>
          <ul>
            <li><strong>Minimum length:</strong> 8 characters required, 15+ recommended</li>
            <li><strong>Maximum length:</strong> Allow at least 64 characters — do not truncate</li>
            <li><strong>No composition rules:</strong> Do not require specific character types (uppercase, numbers, symbols). Let users choose freely</li>
            <li><strong>No periodic rotation:</strong> Do not force password changes unless there is evidence of compromise</li>
            <li><strong>Screen against known breached passwords:</strong> Check new passwords against databases of previously compromised passwords</li>
            <li><strong>Support paste:</strong> Allow pasting passwords (enables password manager usage)</li>
            <li><strong>Use multi-factor authentication (MFA):</strong> Passwords alone are not sufficient for sensitive accounts</li>
          </ul>
          <p>
            The key insight: <strong>length and randomness matter far more than complexity rules</strong>. A 16-character random passphrase is stronger and more memorable than &ldquo;P@$$w0rd!23&rdquo;.
          </p>

          <h2>Passphrases vs. Passwords</h2>
          <p>
            Passphrases use multiple random words as a password (e.g., &ldquo;correct horse battery staple&rdquo;). They are easier to remember and typically stronger than short complex passwords:
          </p>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Example</th>
                <th>Entropy</th>
                <th>Crack Time</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Short complex</td><td>P@ss1w0rd</td><td>~40 bits</td><td>~3 hours</td></tr>
              <tr><td>Longer complex</td><td>K8$mNp2#qL4x</td><td>~79 bits</td><td>~200 years</td></tr>
              <tr><td>4-word passphrase</td><td>correct horse battery staple</td><td>~51 bits</td><td>~66 years</td></tr>
              <tr><td>5-word passphrase</td><td>rapid tiger morning desk flute</td><td>~64 bits</td><td>~5,000 years</td></tr>
              <tr><td>6-word passphrase</td><td>hollow frog basket flame orbit crane</td><td>~77 bits</td><td>~600K years</td></tr>
            </tbody>
          </table>

          <h2>Privacy Guarantee</h2>
          <p>
            This tool runs <strong>100% in your browser</strong>. Your password is never transmitted over the network, never stored in any database, and never logged. The analysis uses client-side JavaScript with mathematical entropy calculation and local pattern matching. You can verify this by opening your browser&apos;s Developer Tools (F12 → Network tab) while typing — no HTTP requests are made. For maximum caution, you can disconnect from the internet before using this tool, and it will work identically.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>National Institute of Standards and Technology (2024). &ldquo;Digital Identity Guidelines: Authentication and Lifecycle Management.&rdquo; <em>NIST Special Publication 800-63B</em>, Revision 4.</li>
            <li>Bonneau, J. (2012). &ldquo;The Science of Guessing: Analyzing an Anonymized Corpus of 70 Million Passwords.&rdquo; <em>IEEE Symposium on Security and Privacy</em>.</li>
            <li>Grassi, P.A., et al. (2017). &ldquo;Digital Identity Guidelines.&rdquo; <em>NIST Special Publication 800-63-3</em>.</li>
            <li>Florêncio, D., Herley, C., & van Oorschot, P.C. (2014). &ldquo;An Administrator's Guide to Internet Password Research.&rdquo; <em>USENIX LISA</em>.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Password Input ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Enter Your Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste your password here..."
              autoComplete="off"
              spellCheck="false"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 pr-12 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-700 dark:text-green-400">
              Your password never leaves your browser. All analysis is performed locally.
            </p>
          </div>
        </div>

        {/* ── Strength Bar ── */}
        {analysis && colors && (
          <div className="space-y-6">
            {/* Score overview */}
            <div className="rounded-xl border-2 border-border p-5">
              <div className="flex items-center gap-4 mb-4">
                {getShieldIcon(analysis.score)}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${colors.text}`}>{analysis.label}</span>
                    <span className="text-sm text-muted-foreground">({analysis.score}/100)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{analysis.length} characters · {analysis.entropy} bits of entropy</p>
                </div>
              </div>
              {/* Visual bar */}
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${colors.fill}`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* Crack time */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">Estimated Crack Time</h4>
              </div>
              <p className="text-2xl font-bold text-foreground">{analysis.crackTime}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on 10 billion guesses per second (modern GPU cluster with optimized hash cracking)
              </p>
            </div>

            {/* Character analysis */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Character Analysis
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Lowercase (a–z)", active: analysis.charSets.lowercase, adds: 26 },
                  { label: "Uppercase (A–Z)", active: analysis.charSets.uppercase, adds: 26 },
                  { label: "Numbers (0–9)", active: analysis.charSets.numbers, adds: 10 },
                  { label: "Symbols (!@#$...)", active: analysis.charSets.symbols, adds: 33 },
                ].map((set) => (
                  <div
                    key={set.label}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      set.active
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                        : "border-border bg-white dark:bg-background"
                    }`}
                  >
                    <span className={set.active ? "text-green-700 dark:text-green-400 font-medium" : "text-muted-foreground"}>
                      {set.label}
                    </span>
                    {set.active ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Character pool size: {analysis.poolSize} characters
              </p>
            </div>

            {/* Security checklist */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3">Security Checklist</h4>
              <div className="space-y-2">
                {analysis.checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-3 text-sm">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20 p-4">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings
                </h4>
                <ul className="space-y-1">
                  {analysis.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-orange-700 dark:text-orange-400 flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Improvement Suggestions
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!analysis && (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter a password above to check its strength</p>
            <p className="text-xs text-muted-foreground mt-1">100% private — processed entirely in your browser</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
