# 09 — MASTER REFERENCE DESIGN ANALYSIS: IMPRESSION4U (https://impression4u.com/)

**Source Target:** [Impression4U](https://impression4u.com/) (Live Production Wholesale Storefront)  
**Inspection Date:** November 2026  
**Inspection Source:** Live DOM & Extracted Production CSS (`build/assets/app-Dxd80VvK.css`, 243 KB)  
**Purpose:** Master Technical Specification for the 1:1 Visual & Structural Recreation of Samyak Hair Accessories Storefront

---

## 1. Core Visual Identity & Design Tokens

Impression4U operates as the benchmark Sadar Bazar, Delhi wholesale hair accessories supplier. Its visual language balances commercial clarity with luxury aesthetics.

### 1.1 Extracted CSS Custom Properties (`:root`)

```css
:root {
  /* Surfaces & Canvas */
  --ground: #ffffff;
  --soft: #faf5ef;           /* Warm Sand Neutral Surface */
  --tint: #f4ebe0;           /* Soft Sand Border / Wash */
  --surface: #ffffff;

  /* Typography & Ink */
  --ink: #1b1613;            /* Deep Ink Charcoal (Primary Headings/Body) */
  --ink-2: #57504a;          /* Muted Secondary Charcoal */
  --ink-soft: #8c837b;       /* Subdued / Label Ink */

  /* Borders & Dividers */
  --line: #eee6dc;           /* Primary Divider & Card Edge */
  --line-2: #ded2c4;         /* Hover Border Edge */

  /* Brand Accents */
  --gold: #c2185b;           /* Deep Rose Accent (Badges, Active States) */
  --gold-br: #e91e63;        /* Bright Rose Highlight */
  --gold-wash: #fce4ec;      /* Pale Rose Wash */
  --rose: #b8324f;           /* Wine Rose Tone */
  --rose-wash: #fceaee;      /* Soft Blush */
  --green: #2e7a4c;          /* Wholesale Stock & MOQ Green */
  --green-wash: #e9f4ed;     /* Stock In-Hand Wash */

  /* Shadows */
  --shadow: 0 1px 2px #1b16130a, 0 6px 18px -10px #1b161324;
  --shadow-2: 0 2px 6px #1b16130f, 0 20px 44px -18px #1b16133d;

  /* Typography Stacks */
  --font: "Inter", "Nunito Sans", "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-display: "Bodoni Moda", Didot, "Playfair Display", Georgia, serif;
  --font-title: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;

  /* Corner Radii */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 12px;              /* Product & Section Card Radius: 12px */
  --r-xl: 24px;
  --r-pill: 100px;

  /* Layout Spacing */
  --gut: clamp(16px, 3.6vw, 42px);
  --maxw: 1340px;
}
```

---

## 2. Typography Rules & Heading Treatment

Impression4U uses a sophisticated pairing of clean sans-serif geometry with high-fashion editorial serif italics:

1. **Section Headlines (`.cw-title`, `.ptag-title`, `.sr-title`, `.tj-title`, `.qa-title`):**
   - Font Family: `Bodoni Moda, Didot, "Times New Roman", serif`
   - Weight: `400`
   - Size: `clamp(30px, min(3.2vw, 5.6svh), 50px)`
   - Line Height: `1.02`
   - Letter Spacing: `-0.02em`
   - **Signature Treatment:** The final keyword or accent word is wrapped in `<em>` with italic styling and gold/rose color:
     - `Find your <em>style</em>`
     - `This month’s <em>arrivals</em>`
     - `Best <em>Sellers</em>`
     - `Built for every <em>seller</em>`
     - `Trending <em>Now</em>`
     - `From Sadar Bazar to <em>10,000+ retailers.</em>`
     - `From trend <em>to your shelf.</em>`
     - `Before your <em>first order.</em>`

2. **Eyebrows (`.cw-eb`, `.ptag-eyebrow`, `.tj-eyebrow`, `.qa-eyebrow`):**
   - Font Family: `"Jost", "Helvetica Neue", var(--font)`
   - Text Transform: `UPPERCASE`
   - Letter Spacing: `.34em`
   - Font Size: `11px`
   - Font Weight: `500`
   - Color: `#8a6a3e` (Warm Ochre / Gold Accent)
   - Left Decorative Rule: `40px x 1px` hairline horizontal bar.

3. **Subtitles / Ledes (`.cw-sub`, `.tj-lede`, `.qa-lede`):**
   - Color: `#5b5149` (`var(--ink-2)`)
   - Font Size: `15px - 15.5px`
   - Font Weight: `300 - 400`
   - Line Height: `1.7 - 1.75`

---

## 3. Section Sequence & Architecture Blueprint

```
+===================================================================================+
| 01. STICKY HEADER & SEARCH BAR                                                    |
|     - Left: Hamburger Menu + Logo ("Samyak Hair")                                 |
|     - Center: Pill Search Bar (520px max-width, photo lens icon + search button)  |
|     - Right: Quick Links ("New Arrivals", "Best Sellers") + Account + Cart (Badge)|
+-----------------------------------------------------------------------------------+
| 02. HERO SHOWCASE SLIDER (.hl)                                                    |
|     - Deep Wine / Charcoal Canvas (#4C060E / #0B0A09)                             |
|     - Right: Full-bleed Model Photography with Smooth Linear Fade                 |
|     - Left: Serif Title ("Cat Eye, <em>elegance defined.</em>"), Subtitle, CTA    |
|     - Floating Product Pill Card ("Cat Eye Nail Set - View product")              |
|     - Slide Counter: "01 / 08" with Nav Arrows                                    |
+-----------------------------------------------------------------------------------+
| 03. CATEGORY SHOWCASE (.cw)                                                       |
|     - Background: #F4EFE6 (Warm Paper Sand)                                       |
|     - Header: "The collections" | "Find your <em>style</em>" | "Shop all styles →"|
|     - Asymmetric Grid: 1 Tall Lead Card (50% width) + 4 Tile Cards (25% each)     |
|     - Overlaid Count ("388 styles"), Title ("Hair Clips / <em>Clutchers</em>")    |
+-----------------------------------------------------------------------------------+
| 04. PRODUCT GRID 1: "This month’s arrivals" (.ptag)                               |
|     - Eyebrow: "JUST IN" | Title: "This month’s <em>arrivals</em>"                |
|     - 12-Card Grid (4 Col Desktop, 2 Col Mobile)                                  |
|     - Card: #EEE6DC border, 12px radius, #F6F1EB art canvas, discount badge       |
|     - Price stack + Unit price + Cream Add-to-Cart button (#F8F1EA)               |
+-----------------------------------------------------------------------------------+
| 05. PRODUCT GRID 2: "Best Sellers" (.ptag.alt)                                    |
|     - Eyebrow: "TOP REORDERS" | Title: "Best <em>Sellers</em>"                    |
|     - 12-Card Grid with high-turnover SKUs                                        |
+-----------------------------------------------------------------------------------+
| 06. CUSTOMER SEGMENTS: "Built for every seller" (.sx)                             |
|     - Background: #FDF8F9 (Soft Blush Sand)                                       |
|     - Title: "Built for every <em>seller</em>"                                    |
|     - 3 Interactive Cards: "Retail <em>shops</em>", "Online <em>sellers</em>",     |
|       "Salons & <em>Stylists</em>" with model photo and product thumbs            |
+-----------------------------------------------------------------------------------+
| 07. PRODUCT GRID 3: "Trending Now" (.ptag)                                        |
|     - Eyebrow: "IN HIGH DEMAND" | Title: "Trending <em>Now</em>"                  |
+-----------------------------------------------------------------------------------+
| 08. BRAND STORY & REVIEWS: "From Sadar Bazar to 10,000+ retailers." (.sr)         |
|     - Left: Year "2015", narrative, [Read our story →]                            |
|     - Right: Google Reviews score card ("4.9 ★★★★★ from 465 reviews ↗") + slides  |
+-----------------------------------------------------------------------------------+
| 09. HOW WE WORK: "From trend to your shelf." (.tj)                                |
|     - Background: #EDE5D9 (Sand Linen)                                            |
|     - Left: Model Editorial Photo with masked edge                                |
|     - Right: 4-Step Pipeline: 01 Spot, 02 Source, 03 Stock, 04 Ship               |
+-----------------------------------------------------------------------------------+
| 10. FAQ: "Before your first order." (.qa)                                         |
|     - Background: #FBF8F4 (Ivory Surface)                                         |
|     - Left: Contact box with dual CTAs: [WhatsApp us] and [Call +91 96678 44434]  |
|     - Right: Accordion with smooth circular plus/minus toggle                     |
+-----------------------------------------------------------------------------------+
| 11. FOOTER (footer.site)                                                          |
|     - Background: #1B1613 (Dark Charcoal Ink)                                     |
|     - Column 1: Brand Logo, Delhi Importer summary, Email Alert input + [Join]    |
|     - Columns 2-4: Shop, Orders & Help, Company                                   |
|     - Bottom Bar: Copyright, 100% Insured Shipping, Verified GST Badge            |
+===================================================================================+
```

---

## 4. Product Card Specification (1:1 Impression4U Recreation)

```css
/* Card Container */
.card {
  background: #ffffff;
  border: 1px solid #eee6dc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow .3s, border-color .3s, transform .3s cubic-bezier(.2,.7,.3,1);
}
.card:hover {
  border-color: #e2d5c6;
  box-shadow: 0 18px 40px -26px rgba(43, 33, 27, 0.35);
  transform: translateY(-2px);
}

/* Image Art Frame */
.card-art {
  aspect-ratio: 1 / 1;
  background: #f6f1eb;       /* Signature Impression4U Warm Neutral Image Canvas */
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* Sale Discount Pill */
.card-flag-off {
  position: absolute;
  top: 11px;
  left: 11px;
  background: #c2185b;       /* Impression4U Gold/Rose Accent */
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  z-index: 2;
}

/* Wishlist Heart */
.card .wish {
  position: absolute;
  top: 11px;
  right: 11px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: #1b1613;
  z-index: 2;
  cursor: pointer;
}

/* Card Body */
.card-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.card-sku {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #8c837b;
}

.card h3 {
  font-size: 13.5px;
  font-weight: 400;
  color: #2b211b;
  line-height: 1.35;
  margin: 0;
}

/* Price Stack */
.p-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
}
.p-now {
  font-size: 15px;
  font-weight: 700;
  color: #1b1613;
}
.p-was {
  font-size: 12px;
  color: #8c837b;
  text-decoration: line-through;
}
.p-unit {
  font-size: 11px;
  color: #57504a;
}

/* Add to Cart Button */
.btn-cart {
  width: 100%;
  height: 42px;
  background: #f8f1ea;       /* Warm Sand Button */
  border: 1px solid #e8dccd;
  border-radius: 8px;
  color: #2b211b;
  font-size: 13.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 8px;
  transition: background .2s, color .2s, border-color .2s;
}
.btn-cart:hover {
  background: #1b1613;
  color: #ffffff;
  border-color: #1b1613;
}
```

---

## 5. Responsive Matching Standards

- **Desktop (1440px):** Max container width `1340px`, 12-column grid for `.cw` category showcase (lead card spans 6, others span 3), 4-column product grids.
- **Laptop (1280px):** Proportional reduction in grid gap (`12px`), maintaining 4-column layout.
- **Tablet (768px):** Category grid shifts to 2 columns with lead card spanning full width; product grids shift to 3 columns; customer segments stack vertically.
- **Mobile (390px):** Strict 2-column product grid with 12px padding; pill search bar adapts with quick-clear; lead category card displays as compact banner; floating WhatsApp CTA offsets to `84px` above bottom bar.
