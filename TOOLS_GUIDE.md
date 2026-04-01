# TOOLS_GUIDE.md — Quick Reference

> **Full Guide:** See `TOOLS_GUIDE_STRUCTURED.md` for complete implementation standards.

---

## Implementation Workflow

### 1. Before Starting
- Read `MASTER_TOOLS_LIST.md` → Find ⬜ Todo tools, prioritize top 5 for this batch
- Read `WEB_STRUCTURE.md` → Understand constraints and tech stack
- Study 2-3 existing tools in codebase → Match patterns exactly

### 2. For Each Tool

**Create Files:**
```
app/(tools)/(category)/tool-name/
  ├── page.tsx    ← Main component ("use client")
  └── layout.tsx  ← Metadata export
```

**Required Elements:**
- ✅ 1000+ words of educational content (minimum)
- ✅ FAQs section (generates FAQPage schema)
- ✅ How-to steps (generates HowTo schema)
- ✅ Metadata: title, description, keywords, OpenGraph
- ✅ Mobile-responsive UI
- ✅ Error handling & input validation

### 3. After Implementation

1. **Add to `lib/tools.ts`** — Required for homepage/search/nav visibility
2. **Update `MASTER_TOOLS_LIST.md`** — Mark as ✅ Done
3. **Run build** — Verify no errors: `npm run build`

### 4. Quality Standards

- Tools must be client-side (no external APIs unless approved)
- Match existing codebase patterns exactly
- Don't modify Sanity.io schemas
- Compete with top 3 Google results for target keyword

---

## Key Files Reference

| File | What It Does |
|------|--------------|
| `lib/tools.ts` | **Add tools here** to appear on site |
| `config/site.ts` | Category IDs: math, finance, health, etc. |
| `components/layout/ToolLayout.tsx` | Shared layout with SEO schemas |
| `MASTER_TOOLS_LIST.md` | Track implementation status |

---

## Audit After Each Batch
Run `AUDIT_AGENT_PROMPT.md` checklist to verify quality.


