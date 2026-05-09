I checked the repo, live pages, sitemap, and public search signals. Short answer: SoftZar should not chase more generic “calculator.net style” tools first. The easier Bing wins are narrow, country-aware tools plus fixing discovery/trust issues.

What I Found


The project has 121 registered tools in lib/tools.ts, but 122 tool pages exist. bank-statement-converter is live but missing from the registry, so it is not in the tools list or sitemap.

Live /tools/, /mortgage-calculator/, /sitemap.xml, and the IndexNow key all return 200.

Public search is still showing old SoftZar software/download identity and third-party trust-warning pages. That lowers Google probability until cleaned up.

Several SEO signals need tightening: many tool pages lack canonical URLs, ToolLayout derives schema URL from the title instead of the real slug, Organization schema points to missing /logo.png, and the bank statement page says “AI-powered” while the code appears to use local pattern parsing.

Bing exact site checks for current tool URLs did not surface obvious organic results, even though the pages are live. That suggests indexing/discovery is the first bottleneck, not just content volume.


Best Tool Gaps

Priority	Tool Cluster	Why It Can Rank	Target Countries	Bing Probability
1	Bank Statement Converter cluster	Already built, high commercial intent, hidden from sitemap	US, UK, Canada, Australia	High
2	US paycheck calculators by state	Search results show fresh small sites ranking; country-specific intent	US	High
3	UK salary/take-home pay 2026/27	Strong UK traffic, update-driven queries	UK	High
4	Construction/home calculators	Lower YMYL risk, useful evergreen searches	US, Canada, Australia	High
5	Business days/time card/work hours	Simple tools, strong office/search intent	US, UK, Canada	High
6	HEIC to JPG/PNG/PDF	Good iPhone/Windows search demand; add passport/USCIS guides	US, UK, Canada	Medium-high
7	PDF to Excel/OCR/extract text	High demand but tougher competitors	US/global	Medium
8	Developer utilities: JWT, cron, SQL formatter, JSON to CSV	Exact-match Bing potential, strong tech visitors	US, EU, India	Medium-high
9	Final grade/weighted grade/test score	Fits existing GPA cluster	US, Canada	High
10	Canada mortgage/stress test/CMHC tools	Country-specific finance intent	Canada	Medium-high

First 10 I’d Build Or Fix

Add bank-statement-converter to lib/tools.ts, sitemap, category links, and related tools.
Business Days Calculator.
Time Card Calculator.
Roofing Calculator.
Paint Calculator.
Flooring Calculator.
Tile Calculator.
HEIC to JPG Converter.
US Paycheck Calculator with state pages.
UK Salary Calculator 2026/27.

Before Building More

Fix these first because they directly affect Bing/Google trust:


Add canonical URLs to every tool page.

Fix schema URL generation in ToolLayout.tsx (line 98).

Change schema logo from /logo.png to /softzar-logo.png.

Remove or redirect old indexed download/software URLs, especially anything tied to “free download,” cracks, serials, or MOD APK language.

Use IndexNow after every new/updated/deleted URL, then verify in Bing Webmaster Tools.