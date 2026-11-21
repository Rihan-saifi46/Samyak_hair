# Responsive Design & Multi-Device Audit Report
**Target Storefront:** Samyak Hair Accessories  
**Theme:** Horizon (Shopify OS 2.0, Version 4.3.0)  
**Viewport Breakpoints Analyzed:** Desktop (≥1200px), Laptop/Small Desktop (990px–1199px), Tablet (750px–989px), Mobile (<750px), Small Mobile (<380px)  

---

## 1. Breakpoint Architecture & Theme System

The Horizon theme utilizes modern CSS container queries (`@container`) and responsive media queries aligned around three primary Shopify standard thresholds:

```
Mobile / Narrow Viewports:   max-width: 749px
Tablet / Medium Viewports:   min-width: 750px and max-width: 989px
Desktop / Wide Viewports:    min-width: 990px (and min-width: 1200px for page width)
```

Additionally, Horizon features container query units (e.g. `60cqw`) on product cards and fluid typography using `clamp()` (e.g. `clamp(14px, 2.5vw, 26px)` in custom liquid blocks).

---

## 2. Multi-Device Responsive Evaluation

| Storefront Region | Desktop (≥1200px) | Tablet (750px–989px) | Mobile (<750px) | Key Responsive Observations |
| :--- | :---: | :---: | :---: | :--- |
| **Announcement Bars** | Clean ticker | Clean ticker | Cramped ticker | Two stacked tickers consume ~90px of vertical space on mobile screens. |
| **Header & Logo** | Tiny logo (36px) | Balanced | Heavy logo (55px) | Inverted height scaling makes desktop brand small and mobile header heavy. |
| **Header Navigation** | Horizontal menu bar | Switches to Drawer | Drawer menu | Red menu bar on desktop; mobile drawer menu is clean and functional. |
| **Injected Header Collections** | 4 columns (4 rows) | 3 columns | 2 columns (8 rows) | Extreme vertical scroll fatigue on mobile; pushes actual content far down. |
| **Product Card Grids** | 4-5 columns | 2-3 columns | 2 columns (`60cqw`) | Card layout scales well with container queries; placeholder cards displayed. |
| **Product Media Gallery** | 2-column grid | Carousel / Grid | Swipeable carousel | Adaptive image ratio and drag-zoom work cleanly across viewports. |
| **Product Sticky Bar** | Bottom right float | Bottom full bar | Bottom sticky bar | Mobile sticky bar has 1:1 invisible contrast on Add-to-Cart button. |
| **Cart Drawer** | Right panel (440px) | Right panel (440px) | Full-width sheet | Drawer behaves responsively, but Checkout button is invisible. |
| **Review Section** | 2-column grid | Stacks to 1 column | Single column | Breakpoint at 760px stacks summary card above review list cleanly. |
| **Instagram Banner** | Centered 560px | Centered 560px | Fluid width (100%-32px)| Breakpoint at 520px reduces icon size and typography smoothly. |
| **Footer Layout** | 4-column flex row | 2-column flex wrap | Stacks vertically | Raster contact graphic does not reflow; small mobile text unreadable. |

---

## 3. Detailed Responsive Findings & Issue Records

---

### Issue ID: `SEC-RESP-001`
- **Issue Title:** AI Collection Block Enforces 80% Desktop Width on Mobile, Squeezing 2-Column Grid
- **Priority:** **P2 — Medium**
- **Category:** Responsive Design / Layout Distortion
- **Affected Component:** AI Collection List Block (`ai_gen_block_68e7006`)
- **Exact File References:**
  - `blocks/ai_gen_block_68e7006.liquid` (lines 9-15, 68-80)
  - `sections/header-group.json` (lines 235, 260)
- **Status:** **Confirmed CSS Flaw**
- **Description:**  
  In `blocks/ai_gen_block_68e7006.liquid`, the outer block wrapper has its CSS width generated via:
  ```css
  .ai-collection-list-{{ ai_gen_id }} {
    display: block;
    width: {{ block.settings.desktop_width_percent }}%;
    max-width: 100%;
    color: {{ block.settings.text_color }};
  }
  ```
  In `sections/header-group.json`, both collection blocks have `"desktop_width_percent": 80`.  
  Crucially, inside the `@media screen and (max-width: 749px)` media query, there is **no reset** for `width: 100%`.  
  On an iPhone SE or standard smartphone (360px–390px viewport), the block is constrained to 80% of the screen (`~288px–312px`) and centered. Inside that narrow container, the CSS forces a 2-column grid (`columns_mobile: 2`) with a gap of 15px:
  ```
  Available width: ~290px - 15px gap = 275px / 2 = ~137px per card!
  ```
  This severely constrains the collection cards, causing titles to wrap onto 3 or 4 lines and rendering images tiny.
- **Potential Impact:**  
  Poor mobile readability and awkward side whitespace margins on mobile viewports.
- **Recommended Solution:**  
  Add `width: 100%;` to `.ai-collection-list-{{ ai_gen_id }}` inside `@media screen and (max-width: 749px)`.
- **Testing Required:**  
  Inspect collection list block on 360px, 375px, and 414px mobile emulators in DevTools.

---

### Issue ID: `SEC-RESP-002`
- **Issue Title:** Header Height Bloat and Sticky Scroll Fatigue on Mobile Devices
- **Priority:** **P2 — Medium**
- **Category:** Mobile UX / Viewport Space Allocation
- **Affected Components:** Mobile Sticky Header, Announcement Bars, Header Group
- **Exact File References:**
  - `sections/header-group.json` (lines 10-180)
  - `layout/theme.liquid` (lines 40-75)
- **Status:** **Confirmed Layout Defect**
- **Description:**  
  On mobile devices (where standard viewport height is only 667px–844px), the header stack consists of:
  1. Top announcement bar (`padding-block: 15px`, total height ~45px).
  2. Sticky primary header with mobile logo height 55px (`logo_height_mobile: 55`, total height ~75px).
  3. Secondary announcement bar (`padding-block: 15px 20px`, total height ~55px).
  4. Injected header collection lists (8 vertical rows of cards, consuming over 1,200px of vertical space!).  
  Even before reaching the 15 collection cards, the fixed header area consumes **~175px (over 25% of the mobile screen height)** on initial load.
- **Potential Impact:**  
  Severe mobile usability impairment; key products and calls to action are pushed completely off-screen.
- **Recommended Solution:**  
  Consolidate into a single lightweight announcement bar (height ≤ 32px), reduce mobile logo height to 38px, and remove the collection lists from `header-group.json`.
- **Testing Required:**  
  Measure total first-paint header height on mobile viewports (target: ≤ 90px combined header + announcement bar).

---

### Issue ID: `SEC-RESP-003`
- **Issue Title:** Raster Contact Card Graphic Text Illegible on Small Mobile Screens
- **Priority:** **P2 — Medium**
- **Category:** Responsive Images / Small Screen Usability
- **Affected Component:** Footer Contact Image Block (`image_AQXcat`)
- **Exact File References:**
  - `sections/footer-group.json` (lines 80-105)
- **Status:** **Confirmed Mobile Issue**
- **Description:**  
  Because `Pink_Contact_Card_with_Contact_Details.png` is an image containing small 12px–14px typography (GST number, phone numbers, warehouse address, business hours), when it scales down to fit a 320px–360px mobile width, the rasterized text becomes pixelated, blurry, and virtually unreadable without zooming in.
- **Potential Impact:**  
  Mobile buyers cannot decipher contact and compliance information.
- **Recommended Solution:**  
  Replace image with semantic Liquid text and CSS flex/grid layout that adapts fluidly without loss of resolution.
- **Testing Required:**  
  Verify text sharpness on physical iPhone and Android screens without pinch-to-zoom.

---

### Issue ID: `SEC-RESP-004`
- **Issue Title:** Hardcoded Custom Liquid Reviews Media Query Threshold Mismatch
- **Priority:** **P3 — Low**
- **Category:** Responsive Consistency / CSS Breakpoints
- **Affected Component:** Homepage Customer Reviews (`custom_liquid_fTMk68`)
- **Exact File References:**
  - `templates/index.json` (lines 780-800)
- **Status:** **Confirmed Architectural Inconsistency**
- **Description:**  
  In `custom_liquid_fTMk68`, the responsive media query breakpoint is set to `max-width: 760px`:
  ```css
  @media(max-width:760px) {
    .reviews-layout { grid-template-columns: 1fr; gap: 24px; }
    .review-list { grid-template-columns: 1fr; gap: 18px; }
  }
  ```
  The rest of the Horizon theme standardizes on `max-width: 749px` for mobile collapsing. At screen widths between 750px and 760px (a 10px tablet window), the reviews section collapses into mobile single-column while the rest of the store remains in desktop multi-column layout.
- **Potential Impact:**  
  Minor layout twitch on 750px–760px viewports (e.g. tablet portrait mode).
- **Recommended Solution:**  
  Align media query to `@media screen and (max-width: 749px)` to maintain global theme consistency.
- **Testing Required:**  
  Resize browser window from 740px to 770px and verify uniform breakpoint transitions.
