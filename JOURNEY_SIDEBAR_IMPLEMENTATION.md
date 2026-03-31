# Journey / Mediavine Sidebar Implementation Guide

This guide explains the exact pattern used in this project to ensure Journey by Mediavine sidebar ads load reliably and stay visible.

## Goals

- Keep sidebar ads loadable on all supported pages
- Prevent ads from rendering under the sticky header
- Keep layout width consistent with header/footer (`max-w-7xl`)
- Reuse the same implementation across other websites

## Required Sidebar Markup (Do Not Rename IDs)

Journey/Mediavine targets these IDs. Keep them exactly:

```tsx
<aside id="secondary" className="hidden overflow-visible lg:block">
  <div className="sticky space-y-6" style={{ top: "var(--sticky-sidebar-top)", maxHeight: "500px" }}>
    <div id="sidebar_atf" className="widget" />
    <div id="sidebar_btf" className="widget" />
    <div id="mv-sidebar-stopper" />
  </div>
</aside>
```

### Why these matter

- `secondary`: standard sidebar container target
- `sidebar_atf`: above-the-fold ad slot
- `sidebar_btf`: below-the-fold ad slot
- `mv-sidebar-stopper`: Mediavine stopper anchor
- `widget` class: ad styling/placement compatibility

## Header Behavior (Revenue-Optimized)

Header behavior implemented:

- Header hides while user is actively scrolling (up or down)
- Header reappears only after scrolling stops briefly
- Header remains visible near top of page

Core logic used in `components/layout/Header.tsx`:

```tsx
const [isVisible, setIsVisible] = useState(true);
const scrollStopTimeoutRef = useRef<number | null>(null);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setCategoryDropdownOpen(false);
      setSearchOpen(false);
    }

    if (scrollStopTimeoutRef.current) {
      window.clearTimeout(scrollStopTimeoutRef.current);
    }

    scrollStopTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 80);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", handleScroll);
    if (scrollStopTimeoutRef.current) window.clearTimeout(scrollStopTimeoutRef.current);
  };
}, []);
```

Header animation class:

```tsx
<header className={`sticky top-0 z-50 ... transition-transform duration-300 ${
  isVisible ? "translate-y-0" : "-translate-y-full"
}`}>
```

## Prevent Sidebar Ads from Going Under Header

A CSS variable controls sticky offset globally:

In `app/globals.css`:

```css
:root {
  --sticky-sidebar-top: 80px;
}
```

In header effect:

```tsx
useEffect(() => {
  const root = document.documentElement;
  root.style.setProperty("--sticky-sidebar-top", isVisible ? "80px" : "16px");
}, [isVisible]);
```

Meaning:

- Header visible → sidebar stays below it (`80px`)
- Header hidden → sidebar can rise higher (`16px`) for maximum ad visibility

## Width Consistency Rule

Use this wrapper for listing/content pages to match header/footer width:

```tsx
<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
  ...
</div>
```

Avoid using plain `container` when exact width consistency is required.

## Where this pattern is applied in this project

- `components/layout/Sidebar.tsx`
- `components/layout/ToolLayout.tsx`
- `app/(category)/[slug]/page.tsx`
- `app/(content-preservation)/layout.tsx`
- `components/layout/Header.tsx`

## Copy Checklist for Another Website

1. Add the same sidebar IDs (`secondary`, `sidebar_atf`, `sidebar_btf`, `mv-sidebar-stopper`)
2. Add `--sticky-sidebar-top` in global CSS
3. Implement header hide-on-scroll + show-on-stop behavior
4. Update sticky sidebar `top` to use `var(--sticky-sidebar-top)`
5. Keep outer page wrappers aligned with `max-w-7xl`
6. Validate with production build

## Validation Steps

1. Load any page with sidebar in desktop view
2. Confirm ads appear in `sidebar_atf` / `sidebar_btf`
3. Scroll continuously: header should stay hidden
4. Stop scrolling: header should return smoothly
5. Confirm ad slots never sit under header






## full code example 

<!-- import React from 'react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside id="secondary" className={`overflow-visible ${className}`}>
      <div className="sticky top-24 space-y-6" style={{ maxHeight: '500px' }}>
        {/* ATF Ad Target - Journey/Mediavine */}
        <div id="sidebar_atf" className="widget" />

        {/* Optional: Add a simple widget between ads for better UX */}
        {/* You can uncomment this if needed */}
        {/* <div className="widget rounded-xl border border-border bg-white p-5 dark:bg-muted/50">
          <h3 className="font-semibold text-foreground">Advertisement</h3>
        </div> */}

        {/* BTF Ad Target - Journey/Mediavine */}
        <div id="sidebar_btf" className="widget" />

        {/* Sidebar Stopper - Journey/Mediavine */}
        <div id="mv-sidebar-stopper" />
      </div>
    </aside>
  )
}  -->
