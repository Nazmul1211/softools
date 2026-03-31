# Journey / Mediavine Implementation Guide (Next.js & Softzar Pattern)

This guide completely documents the exact, heavily-tested pattern used in the Softzar project. It ensures Journey by Mediavine sidebar ads, in-content ads, and SPA route refreshes work reliably while maintaining our custom custom sticky header UI. 

Since this implementation currently works perfectly in the live Softzar site, this serves as the "ideal" template to replicate across other Next.js projects monetized by Journey.

## Goals

- Keep sidebar ads loadable and visible on all supported pages.
- Prevent ads from rendering under the sticky header (via dynamic CSS variables).
- Keep layout width consistent with header/footer (`max-w-7xl`).
- Allow Journey ads to automatically refresh on Next.js client-side route changes.
- Enable Journey to inject in-content ads.
- Reuse this exact same implementation architecture across other websites.

---

## 1. Required Sidebar Markup (Do Not Rename IDs)

Journey/Mediavine targets specific IDs and classes. Use this exact markup for your sidebars:

```tsx
<aside id="secondary" className="hidden overflow-visible lg:block">
  <div className="sticky space-y-6" style={{ top: "var(--sticky-sidebar-top)", maxHeight: "500px" }}>
    
    {/* ATF Ad Target - Journey/Mediavine */}
    <div id="sidebar_atf" className="widget" />
    
    {/* (Optional) You can place actual sidebar widgets or links here */}
    <div className="widget">...</div>
    
    {/* BTF Ad Target - Journey/Mediavine */}
    <div id="sidebar_btf" className="widget" />
    
    {/* Sidebar Stopper - Journey/Mediavine */}
    <div id="mv-sidebar-stopper" />
  </div>
</aside>
```

### Why these matter:
- `id="secondary"`: Standard container target for the sidebar script.
- `id="sidebar_atf"`: Above-the-fold ad slot injection point.
- `id="sidebar_btf"`: Below-the-fold ad slot injection point.
- `id="mv-sidebar-stopper"`: Mediavine stopper anchor so ads don't overlap the footer.
- `className="widget"`: Wraps content blocks to define injection boundaries.
- `className="sticky"`: We use our own sticky logic to manage the sidebar positioning relative to our intelligent header.

---

## 2. In-Content Ads (Targeting Content Area)

To allow Journey to inject ads within the main body content, you must properly wrap your primary content area. Do this using the ID `#journey-content-target` or `#content`.

### Layout Wrapper Approach
In a layout file (e.g., `app/(content-preservation)/layout.tsx`):
```tsx
<div id="journey-content-target" className="min-w-0">
  {children}
</div>
```

### Article Content Approach
In a specific page or layout presenting heavy text (e.g., `ToolLayout.tsx`):
```tsx
<article id="content" className="prose ...">
  {content}
</article>
```

### Manual Placeholder Injection
You can also manually place an internal placeholder for an in-content ad:
```tsx
{/* In-content Ad Placeholder */}
<div id="mv-incontent-ad" className="mt-6" />
```

---

## 3. SPA Navigation Support (Crucial for Next.js)

Because Next.js uses client-side routing, page navigations don't cause a hard refresh. Journey's script must be explicitly told to refresh the ads on route changes. 

### The `useJourneyRefresh` Hook
Create this hook (`hooks/useJourneyRefresh.ts`):

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    Grow?: {
      refresh?: () => void;
    };
  }
}

export function useJourneyRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.Grow && typeof window.Grow.refresh === 'function') {
      window.Grow.refresh();
    }
  }, [pathname]);
}
```

### The `JourneyRefreshProvider`
Create a provider component (`components/JourneyRefreshProvider.tsx`):

```tsx
'use client';

import { useJourneyRefresh } from '@/hooks/useJourneyRefresh';

export default function JourneyRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useJourneyRefresh();
  return <>{children}</>;
}
```

**Implementation:** Wrap your root `layout.tsx` body with `<JourneyRefreshProvider>` so every route change safely triggers `window.Grow.refresh()`.

---

## 4. Header Behavior (Revenue-Optimized)

To maximize Viewability without breaking UX, the header hides while the user is actively scrolling and reappears when scrolling stops.

Core logic used in `components/layout/Header.tsx`:

```tsx
const [isVisible, setIsVisible] = useState(true);
const scrollStopTimeoutRef = useRef<number | null>(null);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Show at top
    if (currentScrollY <= 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setCategoryDropdownOpen(false);
      setSearchOpen(false);
    }

    if (scrollStopTimeoutRef.current) window.clearTimeout(scrollStopTimeoutRef.current);

    // Reappear when scrolling stops
    scrollStopTimeoutRef.current = window.setTimeout(() => setIsVisible(true), 80);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", handleScroll);
    if (scrollStopTimeoutRef.current) window.clearTimeout(scrollStopTimeoutRef.current);
  };
}, []);
```

**Header Apperance Class:**
```tsx
<header className={`sticky top-0 z-50 ... transition-transform duration-300 ${
  isVisible ? "translate-y-0" : "-translate-y-full"
}`}>
```

---

## 5. Prevent Sidebar Ads from Going Under Header

This defines how our sticky sidebar interoperates with our animated sticky header.

In `app/globals.css`, set the baseline variable:
```css
:root {
  --sticky-sidebar-top: 80px;
}
```

In the header effect (`Header.tsx`), dynamically adjust this variable based on header visibility:
```tsx
useEffect(() => {
  const root = document.documentElement;
  // If header is visible, push sidebar down 80px. If hidden, let it rise to 16px.
  root.style.setProperty("--sticky-sidebar-top", isVisible ? "80px" : "16px");
}, [isVisible]);
```

---

## 6. Copy / Replication Checklist for New Projects

When copying this to a new Next.js project, execute these steps sequentially:

1. **SPA Hook:** Copy `hooks/useJourneyRefresh.ts` & `components/JourneyRefreshProvider.tsx`.
2. **Root Wrap:** Wrap the application in `layout.tsx` with `<JourneyRefreshProvider>`.
3. **Sidebar Markup:** Implement the `secondary` aside exactly as structured above.
4. **CSS Setup:** Add `--sticky-sidebar-top: 80px;` to global CSS.
5. **Header Sync:** Implement the scroll-hide header and the dynamic CSS variable updater.
6. **In-Content Wrappers:** Ensure the main content uses `id="journey-content-target"` or `id="content"`.

## 7. Validation Steps

1. Load any page with a sidebar on Desktop.
2. Confirm ads populate in `sidebar_atf` and `sidebar_btf`.
3. Scroll down continuously: the header should hide, and the sidebar should slide closer to the top of the monitor (`16px`).
4. Stop scrolling: the header should slide down gracefully, and the sidebar should smoothly shift down (`80px`) so no ad is hidden.
5. Click a navigation link: Validate that advertisements refresh without a hard page reload.
