# 01 — SAMYAK WHOLESALE DESIGN SYSTEM SPECIFICATION

**Project:** Samyak Hair Accessories Storefront Redesign  
**Theme Engine:** Shopify Horizon 4.3.0  
**Design Benchmark:** [Impression4U](https://impression4u.com/) (Sadar Bazar Wholesale Standard)  
**Status:** Implemented & Locally Verified  
**Date:** November 2026

---

## 1. Executive Summary & Design Vision

The redesign of the **Samyak Hair Accessories** storefront transforms a previously inconsistent, pastel-cluttered retail template into a high-converting, professional B2B wholesale platform. 

Benchmarked against **Impression4U**, India's premier wholesale hair accessories destination, the new design system balances **wholesale commercial clarity** (minimum order quantities, tier pricing, GST transparency) with **contemporary luxury aesthetics** (clean typography, generous whitespace, warm neutral surfaces, and rich wine-rose accentuation).

```
                     ┌──────────────────────────────────────────────┐
                     │          SAMYAK BRAND DESIGN SYSTEM          │
                     └──────────────────────┬───────────────────────┘
                                            │
           ┌────────────────────────────────┼──────────────────────────────┐
           ▼                                ▼                              ▼
  [Palette Harmony]                [Typography System]             [Spatial & Cards]
  - Background: #FFFFFF            - Heading: System Display       - Card Radius: 8px
  - Surface Soft: #FBF8F8          - Body: System Sans-Serif       - Button Radius: 8px
  - Primary Accent: #8C2D43        - Eyebrow: 11px Bold 0.08em     - Grid Columns: 4 (Desk) / 2 (Mob)
  - Dark Neutral: #1A1A1A          - Ratio: Minor Third (1.2)      - Gap System: 16px - 28px
```

---

## 2. Color Architecture & Contrast Tokens

All tokens are defined in `config/settings_data.json` and propagated via CSS Custom Properties across the theme.

### 2.1 Core Palette Tokens

| Token Variable | Hex Value | Semantic Purpose | Contrast Ratio (vs Background) | WCAG 2.1 Compliance |
| :--- | :--- | :--- | :--- | :--- |
| `--color-background` | `#FFFFFF` | Primary canvas, cards, content wells | N/A (Base) | N/A |
| `--color-foreground` | `#1A1A1A` | Headings, primary body text, solid buttons | **16.1:1** | **AAA Pass** |
| `--color-palette-color1` | `#8C2D43` | Rich Wine Rose; wholesale accents, badges | **6.8:1** | **AAA Pass** |
| `--color-palette-color2` | `#EAE6E1` | Warm Luxury Sand; borders, dividers, subtle bars | 1.2:1 (Structural) | Decorative Pass |
| `Surface Subtle` | `#FBF8F8` | Soft blush tint for alternating sections, cards | 1.05:1 (Surface) | Decorative Pass |
| `Wholesale Success` | `#107C41` | Minimum order reached, inventory badges | **4.9:1** | **AA Pass** |
| `Wholesale Alert` | `#C53030` | Order threshold reminder, input errors | **5.4:1** | **AA Pass** |

### 2.2 Button Contrast Resolution (Fixing `SEC-DES-001` & `SEC-A11Y-001`)

The previous configuration produced invisible primary buttons due to an identical `#111111` background and text token:

```liquid
/* PREVIOUS (BROKEN): Contrast 1:1 — INVISIBLE */
palette_primary_button_background: "#111111"
palette_primary_button_text: "#111111"

/* CURRENT (FIXED): Contrast 16.1:1 — WCAG AAA */
palette_primary_button_background: "{{ settings.color_palette.foreground }}" /* #1A1A1A */
palette_primary_button_text: "{{ settings.color_palette.background }}" /* #FFFFFF */
primary_button_border_width: 1
primary_button_border_radius: 8px
```

---

## 3. Typography System

The typography hierarchy guarantees crisp readability across small wholesale package labels and high-impact hero headings.

```
+------------------------------------------------------------------------------------+
| Level        | Size Range (Fluid clamp) | Weight | Line Height | Case     | Letter |
+------------------------------------------------------------------------------------+
| H1 (Hero)    | clamp(30px, 4.8vw, 54px) | 800    | 1.15        | Normal   | -0.02em|
| H2 (Section) | clamp(24px, 3.4vw, 38px) | 800    | 1.20        | Normal   | -0.01em|
| H3 (Card)    | clamp(18px, 2.2vw, 22px) | 700    | 1.25        | Normal   | 0      |
| Eyebrow      | 11px - 12px              | 700    | 1.20        | UPPERCASE| +0.08em|
| Body Primary | clamp(14px, 1.8vw, 15px) | 400    | 1.55        | Normal   | 0      |
| Price Large  | clamp(15px, 2.0vw, 18px) | 700    | 1.00        | Normal   | 0      |
| Wholesale Tag| 10px - 11px              | 700    | 1.00        | UPPERCASE| +0.06em|
+------------------------------------------------------------------------------------+
```

---

## 4. Component Standards

### 4.1 Product Cards
- **Aspect Ratio:** 1:1 square adapt ratio for standardized hair clip and scrunchie display.
- **Card Background:** Clean white (`#FFFFFF`) or transparent, eliminating the previous turquoise `#accec7` tint.
- **Corner Radius:** `8px` (`--card-corner-radius: 8px`).
- **Hierarchy:**
  1. Gallery Media (with secondary image hover swap)
  2. Product Title (14px/15px, max 2 lines, truncated gracefully)
  3. Wholesale Unit Price (accented in `#8C2D43`, sale compare-at displayed first)
  4. Quick Add & Quantity Selector (aligned at card base)

### 4.2 Category Cards (B2B Lot Visuals)
- **Grid Layout:** 4 columns (Desktop) / 2 columns (Mobile).
- **Interactive State:** `translateY(-3px)` lift on hover with `rgba(140, 45, 67, 0.08)` drop shadow.
- **Badges:** Wholesale Lot counter badge displaying live dynamic product count per collection.

### 4.3 Wholesale Minimum Order Bar
- **Track Height:** 6px rounded pill track (`#1A1A1A` 12% opacity).
- **Progress Fill:** Fluid linear gradient (`#8C2D43` to `#B83B58`), morphing dynamically to `#107C41` upon achieving the ₹2,000 threshold.
- **Contextual Live Feedback:** Displays remaining amount required in Indian Rupee format (`₹XXX`).

### 4.4 Floating Quick WhatsApp Ordering CTA
- **Dimensions:** 52px circle on desktop, 48px on mobile.
- **Placement:** Fixed at `bottom: 24px; right: 24px;` (desktop) and `bottom: 84px; right: 16px;` (mobile to safely clear sticky add-to-cart bars and navigation drawers).
- **Accessibility:** `aria-label="Order Wholesale on WhatsApp"`, focus-visible ring with 3px offset.

---

## 5. Architectural Alignment with Impression4U Benchmark

| Evaluation Dimension | Impression4U (Reference) | Samyak Hair Accessories (New System) |
| :--- | :--- | :--- |
| **Wholesale Positioning** | Sadar Bazar Delhi wholesale importer | Direct China & Korea Importer, Vikaspuri New Delhi |
| **Minimum Order Enforcement** | Prominent announcement + cart validation | Real-time threshold progress bar + checkout lock |
| **Visual Atmosphere** | Clean white surfaces, luxury warm accents | `#FFFFFF` canvas, `#FBF8F8` cards, `#8C2D43` wine accents |
| **Category Accessibility** | 8–12 top categories with 1:1 image tiles | 8 primary curated category cards on homepage + 24 in directory |
| **B2B Trust Building** | GST invoicing, damage policy, unboxing rules | 4-pillar trust bar, customer segments, verified FAQ, 4.8★ reviews |
| **Direct Order Channels** | WhatsApp catalog sharing | Global floating WhatsApp CTA + Sectional 1-click catalog chats |
