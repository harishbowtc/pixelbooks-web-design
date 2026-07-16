---
name: pixelbooks-style-guide
description: "Guidelines and patterns to ensure style consistency across PixelBooks portals (PB Admin, Publisher, Library Admin, Library User). Ensures layout wrapping with AppShell, responsive card grids, Recharts styles, and unified table controls."
---

# PixelBooks Style Guide & Design Token System

This skill enforces visual consistency across all PixelBooks portals by ensuring every new interface utilizes current patterns.

## Layout & Wrappers

- **Always use `AppShell`**: Every primary workspace view must be wrapped using the `<AppShell title="[Page Title]" subtitle="[Subtitle]">` component imported from `@/components/app-shell`. Do not build independent header or sidebar structures.
- **Dynamic Portals**: AppShell automatically adapts navigation tabs, branding labels, and user roles based on the route prefix:
  - `/publisher` or publisher routes -> Publisher views
  - `/library-admin` -> Library Admin views

## Color System

- All colors must utilize `oklch` formatting defined in `src/styles.css`.
- Use the registered tailwind theme tokens:
  - `var(--brand)`: Brand primary teal.
  - `var(--sidebar-highlight)`: Active/highlight state backgrounds.
  - `var(--border)`: Dividers and border strokes.
  - `var(--card)`: Card background surfaces.
- **Control Backgrounds**: Keep control backgrounds white (e.g., input bars, selector dropdown triggers, date pickers should use white backgrounds like `bg-white` or `bg-card` in light themes rather than gray backgrounds like `bg-background`).

## Controls & Components

1. **Stat/Metrics Cards**:
   - Wrap metrics in a flex card layout using standard styles:
     ```tsx
     <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md justify-between min-h-[140px]">
       {/* Icon + Label */}
       <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-highlight)] text-[var(--brand)]">
         <Icon size={18} />
       </span>
       {/* Value + Sub-label */}
     </div>
     ```
2. **Recharts Charts**:
   - Utilize CartesianGrid with horizontal strokes only: `vertical={false} stroke="var(--border)"`.
   - Tooltip style matching the standard dashboard:
     ```tsx
     <Tooltip
       cursor={{ fill: "color-mix(in oklab, var(--brand) 10%, transparent)" }}
       contentStyle={{
         background: "var(--card)",
         border: "1px solid var(--border)",
         borderRadius: 8,
         fontSize: 12,
       }}
     />
     ```
3. **Interactive Dropdowns**:
   - Always use the UI library’s dropdown primitive:
     ```tsx
     import {
       DropdownMenu,
       DropdownMenuTrigger,
       DropdownMenuContent,
       DropdownMenuItem,
     } from "@/components/ui/dropdown-menu";
     ```
4. **Book Covers (No Image Files)**:
   - Do NOT create or download image files for book covers in any case.
   - Use CSS gradients and centered initials (matching the styling from the publisher catalogue page).
   - The preferred ratio/size for book covers is 438 × 678 (width-to-height ratio of ~1:1.55, e.g., using `aspect-[438/678]` or classes like `w-11 h-17` / `w-10 h-15` or inline styles representing this ratio).
