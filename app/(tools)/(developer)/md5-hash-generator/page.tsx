"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";

// MD5 implementation (pure JavaScript - no external dependencies)
function md5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number): number {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number): number {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }

  function F(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number): number { return x ^ y ^ z; }
  function I(x: number, y: number, z: number): number { return y ^ (x | ~z); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(string: string): number[] {
    let lWordCount: number;
    const lMessageLength = string.length;
    const lNumberOfWordsTemp1 = lMessageLength + 8;
    const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
    const lWordArray: number[] = new Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number): string {
    let wordToHexValue = "";
    let wordToHexValueTemp = "";
    let lByte: number;
    let lCount: number;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemp = "0" + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export default function MD5HashGenerator() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [realtimeMode, setRealtimeMode] = useState(true);
  const [hashHistory, setHashHistory] = useState<Array<{ input: string; hash: string }>>([]);

  // Calculate hash in real-time
  useEffect(() => {
    if (realtimeMode && input) {
      setHash(md5(input));
    }
  }, [input, realtimeMode]);

  const generateHash = useCallback(() => {
    if (!input) return;
    const newHash = md5(input);
    setHash(newHash);
    setHashHistory((prev) => {
      const updated = [{ input: input.substring(0, 50), hash: newHash }, ...prev.filter(h => h.hash !== newHash)];
      return updated.slice(0, 10);
    });
  }, [input]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setHash("");
    setCompareHash("");
  };

  const hashesMatch = compareHash && hash && compareHash.toLowerCase().trim() === hash.toLowerCase();
  const hashesConflict = compareHash && hash && compareHash.toLowerCase().trim() !== hash.toLowerCase();

  return (
    <ToolLayout
      title="MD5 Hash Generator"
      description="Generate MD5 hash values for any text string. Compare hashes and verify data integrity with this free online tool."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      relatedTools={[
        { name: "SHA256 Generator", href: "/sha256-generator" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "Password Generator", href: "/password-generator" },
      ]}
      content={
        <>
          <h2>What is MD5?</h2>
          <p>
            MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that 
            produces a 128-bit (16-byte) hash value, typically represented as a 32-character 
            hexadecimal number. It was designed by Ronald Rivest in 1991.
          </p>

          <h2>Properties of MD5 Hashes</h2>
          <ul>
            <li><strong>Fixed Length:</strong> Always produces a 32-character hexadecimal string</li>
            <li><strong>One-Way:</strong> Cannot reverse the hash to get the original input</li>
            <li><strong>Deterministic:</strong> Same input always produces the same hash</li>
            <li><strong>Avalanche Effect:</strong> Small input changes create drastically different hashes</li>
          </ul>

          <h2>Common Uses</h2>
          <ul>
            <li><strong>File Integrity:</strong> Verify downloaded files haven&apos;t been modified</li>
            <li><strong>Checksums:</strong> Quick comparison of data blocks</li>
            <li><strong>Caching:</strong> Generate cache keys from content</li>
            <li><strong>Deduplication:</strong> Identify duplicate content</li>
          </ul>

          <h2>Security Considerations</h2>
          <p className="text-amber-600 dark:text-amber-400">
            ⚠️ MD5 is no longer considered cryptographically secure due to collision vulnerabilities. 
            For security-critical applications, use SHA-256 or SHA-3 instead.
          </p>

          <h2>MD5 vs Other Hash Functions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Algorithm</th>
                <th className="text-left p-2 border-b">Output Size</th>
                <th className="text-left p-2 border-b">Security</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border-b">MD5</td><td className="p-2 border-b">128 bits</td><td className="p-2 border-b">Weak</td></tr>
              <tr><td className="p-2 border-b">SHA-1</td><td className="p-2 border-b">160 bits</td><td className="p-2 border-b">Weak</td></tr>
              <tr><td className="p-2 border-b">SHA-256</td><td className="p-2 border-b">256 bits</td><td className="p-2 border-b">Strong</td></tr>
              <tr><td className="p-2 border-b">SHA-3</td><td className="p-2 border-b">Variable</td><td className="p-2 border-b">Strong</td></tr>
            </tbody>
          </table>
        </>
      }
    >
      <div className="space-y-6">
        {/* Settings */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={realtimeMode}
              onChange={(e) => setRealtimeMode(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Real-time hashing</span>
          </label>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Enter Text to Hash
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full h-32 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {input.length} characters | {new Blob([input]).size} bytes
          </p>
        </div>

        {/* Actions */}
        {!realtimeMode && (
          <div className="flex gap-2">
            <Button onClick={generateHash} disabled={!input}>
              Generate MD5 Hash
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>
        )}

        {/* Hash Result */}
        {hash && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">MD5 Hash (32 characters)</span>
              <Button onClick={() => copyToClipboard(hash)} variant="outline" size="sm">
                {copied ? "✓ Copied!" : "Copy"}
              </Button>
            </div>
            <div className="bg-background/50 rounded-lg p-3 font-mono text-lg break-all text-primary font-semibold tracking-wider">
              {hash}
            </div>
          </div>
        )}

        {/* Hash Comparison */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Compare Hash</h3>
          <input
            type="text"
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            placeholder="Paste a hash to compare..."
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
          {compareHash && (
            <div className={`mt-2 p-2 rounded-lg ${hashesMatch ? "bg-green-500/10 text-green-600" : hashesConflict ? "bg-red-500/10 text-red-500" : ""}`}>
              {hashesMatch && "✓ Hashes match!"}
              {hashesConflict && "✗ Hashes do not match"}
            </div>
          )}
        </div>

        {/* Visual Hash Representation */}
        {hash && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Hash Visualization</h3>
            <div className="flex flex-wrap gap-1">
              {hash.split("").map((char, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono"
                  style={{
                    backgroundColor: `hsl(${parseInt(char, 16) * 22.5}, 70%, ${50 + parseInt(char, 16)}%)`,
                    color: parseInt(char, 16) > 7 ? "#000" : "#fff",
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hash History */}
        {hashHistory.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Recent Hashes</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {hashHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm bg-background/50 rounded-lg p-2"
                >
                  <span className="text-muted-foreground truncate max-w-[100px]">
                    {item.input}...
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono text-xs text-primary flex-1 truncate">
                    {item.hash}
                  </span>
                  <Button
                    onClick={() => copyToClipboard(item.hash)}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Hashes */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Example MD5 Hashes</h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex flex-wrap items-center gap-2 bg-background/50 rounded-lg p-2">
              <span className="text-muted-foreground">&quot;hello&quot;</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-primary">5d41402abc4b2a76b9719d911017c592</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 bg-background/50 rounded-lg p-2">
              <span className="text-muted-foreground">&quot;Hello&quot;</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-primary">8b1a9953c4611296a827abf8c47804d7</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 bg-background/50 rounded-lg p-2">
              <span className="text-muted-foreground">&quot;password&quot;</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-primary">5f4dcc3b5aa765d61d8327deb882cf99</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Notice how &quot;hello&quot; and &quot;Hello&quot; produce completely different hashes.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
