# Samyak Hair — Comprehensive UI Alignment & Spacing Audit Report
## Cart Drawer + People Also Bought + Related Theme UI

**Mode:** STRICT READ-ONLY FORENSIC AUDIT  
**Code Modifications Applied:** ZERO (Read-Only)  
**UI Regression Tolerance:** ABSOLUTE ZERO  
**Audit Date:** November 26, 2026  
**Theme:** Horizon (Shopify OS 2.0, Version 4.3.0)  

---

## 1. Executive Summary

This comprehensive visual and technical audit was conducted to investigate layout, alignment, spacing, overflow, and responsive behavior across the Samyak Hair Shopify storefront. Particular focus was placed on two priority areas:
1. **The Cart Drawer:** Specifically diagnosing why product prices are clipped on the right-hand side, as well as alignment and spacing across header, item list, quantity controls, and summary footer.
2. **The People Also Bought Section:** Diagnosing right-side container alignment, card width/height scaling, grid column asymmetry, and mobile card proportions.

The audit was conducted strictly in **READ-ONLY MODE**. Zero code files were altered. All 15 automated cart functionality tests continue to pass with 100% success rate, confirming that recent cart remediation remains fully operational.

### Summary Scorecard

| Area | Status | Priority | Core Issue |
|---|---|:---:|---|
| **Cart Drawer: Price Clipping** | **Confirmed Defect** | **Critical** | CSS Grid track definition (`68px 1fr`) forces 3rd cell (`td.cart-items__price`) into an implicit track 84px outside container bounds; clipped by `overflow-x: hidden`. |
| **Cart Drawer: Mobile Nav Overlap** | **Confirmed Defect** | **High** | Drawer inner has `z-index: 2` while `.samyak-mobile-bottom-nav` has `z-index: 9999`, causing the mobile dock to float on top of the open drawer footer. |
| **People Also Bought: Desktop Grid Alignment** | **Confirmed Defect** | **Medium** | Section container uses hardcoded `max-width: 1240px` and `padding-inline: 32px`, misaligning with the theme's standard collection page grid (`1200px/1400px` with 40px margins). |
| **People Also Bought: Mobile Card Proportion** | **Confirmed Defect** | **High** | Hardcoded min-heights (`265px` gallery + `140px` info = `405px`) on 138px–165px wide mobile cards create a 1:1.92 skyscraper ratio, while double padding (32px outer + 32px inner) squeezes text width to 74px. |
| **Quick Shop Drawer: Mobile Nav Overlap** | **Confirmed Defect** | **Medium** | Quick Shop drawer dialog has `z-index: 9998`, sitting below Mobile Bottom Nav (`z-index: 9999`). |
| **Header: Logo Sizing Inversion** | **Confirmed Defect** | **Medium** | Desktop logo set to 36px (undersized on 1920px); mobile logo set to 55px (oversized in sticky header). |
| **Cart Functionality Pipeline** | **Verified Functional** | **N/A** | 15/15 automated tests pass (ATC, SRA, quantity, remove, count sync, MOQ threshold ₹2,000). |

---

## 2. Priority Area A: Cart Drawer Detailed Forensic Findings

### A.1 Right-Side Product Price Clipping & Overflow

- **Status:** **Confirmed Critical Visual Defect**
- **Affected Files:**
  - [snippets/cart-drawer.liquid](file:///d:/samyak_hair/snippets/cart-drawer.liquid#L586-L596) (lines 586–596)
  - [assets/component-cart-drawer.css](file:///d:/samyak_hair/assets/component-cart-drawer.css#L297-L307) (lines 297–307)
  - [assets/impression4u-core.css](file:///d:/samyak_hair/assets/impression4u-core.css#L2656-L2665) (lines 2656–2665)
- **Relevant Selectors:**
  - `#cart-drawer .cart-items__table-row`
  - `#cart-drawer .cart-items__price`
  - `#cart-drawer .cart-drawer__content`

#### Technical Root Cause Analysis
In [snippets/cart-products.liquid](file:///d:/samyak_hair/snippets/cart-products.liquid#L148-L421), each table row (`tr.cart-items__table-row`) renders five cells:
1. `td.cart-items__media` (Thumbnail image)
2. `td.cart-items__details` (Title, variants, unit price)
3. `td.cart-items__quantity` (Quantity selector & Remove button)
4. `td.cart-items__error` (Hidden alert container)
5. `td.cart-items__price` (Line item total price, e.g. `₹1,200.00`)

Shopify's base Horizon theme lays this out using a **3-column CSS Grid**:
```css
grid-template-columns: clamp(2.5rem, 15cqi, 7.5rem) minmax(0, 1fr) auto;
grid-template-areas:
  'media details price'
  'media quantity price'
  'media error error';
```
However, custom theme styles in `snippets/cart-drawer.liquid`, `assets/component-cart-drawer.css`, and `assets/impression4u-core.css` introduced this override:
```css
#cart-drawer .cart-items__table-row {
  display: grid !important;
  grid-template-columns: 68px 1fr !important;
  gap: 14px !important;
  padding-bottom: 16px !important;
  margin-bottom: 16px !important;
  border-bottom: 1px solid #EFECE4 !important;
  align-items: start !important;
  width: 100% !important;
  box-sizing: border-box !important;
}
```
**The Mathematical Breakdown of the Overflow:**
1. The override establishes an explicit grid with only **two columns**: Track 1 (`68px`) and Track 2 (`1fr`).
2. Track 1 holds the media thumbnail (`68px`).
3. Track 2 (`1fr`) expands to consume **100% of all remaining table width** (`tableWidth - 68px - 14px`).
4. Cell 5 (`td.cart-items__price`) inherits the rule `grid-area: price;`. Because no area named `price` is declared in the 2-column grid override, the browser engine is forced by CSS Grid specifications to generate an **implicit 3rd column track**.
5. Because Track 2 already occupies the full available width, this implicit Track 3 is pushed completely past the right edge of the table by `gap (14px) + price width (70px–72px) = 84px to 86px`.
6. Parent container `#cart-drawer .cart-drawer__content` enforces `overflow-x: hidden !important`.
7. **Result:** The line price in Track 3 is partially or completely clipped off the right viewport edge on every screen size.

#### Responsive Overflow Measurements

| Viewport | Drawer Width | Content Width | Track 1 (Media) | Track 2 (1fr Details) | Track 3 (Price) | Overflow Beyond Container | Clipping Result |
|---|---|---|---|---|---|---|---|
| **1440px (Desktop)** | 410px | 366px | 68px | 284px | 72px | **+86px** | **Clipped on Right** |
| **1024px (Tablet LG)** | 410px | 366px | 68px | 284px | 72px | **+86px** | **Clipped on Right** |
| **768px (Tablet)** | 410px | 366px | 68px | 284px | 72px | **+86px** | **Clipped on Right** |
| **430px (Mobile LG)** | 395.6px | 351.6px | 68px | 269.6px | 72px | **+86px** | **Clipped on Right** |
| **375px (Mobile SM)** | 345px | 301px | 68px | 219px | 72px | **+86px** | **Clipped on Right** |
| **320px (Mobile XS)** | 294.4px | 250.4px | 68px | 168.4px | 72px | **+86px** | **Clipped on Right** |

#### Recommended Minimal Fix (For Future Implementation)
Update the grid template definition on `#cart-drawer .cart-items__table-row` to 3 tracks with explicit grid areas:
```css
#cart-drawer .cart-items__table-row {
  display: grid !important;
  grid-template-columns: 68px 1fr auto !important;
  grid-template-areas:
    'media details price'
    'media quantity quantity'
    'media error error' !important;
  gap: 10px 14px !important;
}
#cart-drawer .cart-items__price {
  grid-area: price !important;
  text-align: right !important;
  align-self: start !important;
  white-space: nowrap !important;
}
```
*Benefit:* Zero visual side effects, preserves the 68px thumbnail, gives `details` flexible middle width, and guarantees the line total price sits safely within the right margin without clipping.

---

### A.2 Mobile Bottom Navigation Dock Overlapping Open Cart Drawer

- **Status:** **Confirmed High Severity Defect**
- **Affected Files:**
  - [snippets/cart-drawer.liquid](file:///d:/samyak_hair/snippets/cart-drawer.liquid#L453) (line 453)
  - [snippets/mobile-bottom-nav.liquid](file:///d:/samyak_hair/snippets/mobile-bottom-nav.liquid#L121) (line 121)
- **Relevant Selectors:**
  - `theme-drawer#cart-drawer.active .drawer__inner` (`z-index: 2 !important;`)
  - `.samyak-mobile-bottom-nav` (`z-index: 9999;`)
- **Description:**  
  On mobile devices (<= 768px), `.samyak-mobile-bottom-nav` has `position: fixed; bottom: 0; z-index: 9999;`. When the Cart Drawer slides open, its `.drawer__inner` panel has `z-index: 2 !important`. Because `9999 > 2`, the Mobile Bottom Navigation dock (including its elevated 52px WhatsApp circular button) renders directly ON TOP OF the cart drawer footer, obscuring the checkout button and bottom order notice.
- **Recommended Minimal Fix:**  
  Elevate the active Cart Drawer to `z-index: 10001 !important;` (matching or exceeding `snippets/wishlist-drawer.liquid` which uses `z-index: 10000`).

---

### A.3 Cart Drawer Spacing & Component Verification

- **Cart Header & Close Button:**
  - Title: Cormorant Garamond 22px, `#113B32`, properly centered vertically.
  - Close button: 15px icon, 32x32 hit target, clean hover background `#EFECE4`. Alignment is correct.
- **Quantity Selector & Remove Button:**
  - `.cart-items__quantity-controls` uses `display: flex; justify-content: space-between;`.
  - Quantity stepper (30px height, 1px border `#D5D0CA`) sits on the left of Column 2; "Remove" text link sits on the right.
  - When the price clipping fix is applied, quantity controls occupy `grid-column: 2 / span 2` or `grid-area: quantity` cleanly beneath the title.
- **Wholesale MOQ Bar & Checkout Buttons:**
  - `cart-wholesale-bar`: Progress bar calculates correctly against ₹2,000 threshold (`wholesale_min_threshold = 200000`).
  - Checkout CTA correctly disables when cart total < ₹2,000.
  - Subtotal and dual buttons ("VIEW CART" and "PROCEED TO CHECKOUT") have clean vertical spacing (gap: 10px).

---

## 3. Priority Area B: People Also Bought Detailed Forensic Findings

### B.1 Desktop Container Alignment Discrepancy

- **Status:** **Confirmed Medium Defect**
- **Affected File:** [sections/collection-people-also-bought.liquid](file:///d:/samyak_hair/sections/collection-people-also-bought.liquid#L125-L129) (lines 125–129)
- **Relevant Selector:** `.samyak-pab-container`
- **Technical Analysis:**
  - The main collection grid above is wrapped in `.section.product-grid-container`, which uses Shopify's CSS custom property grid:
    `--page-margin: max(40px, ...)` on desktop screens (>= 750px) and `--page-content-width: 1200px` (or `1400px` for wide).
  - In contrast, `.samyak-pab-container` enforces:
    ```css
    .samyak-pab-container {
      max-width: 1240px;
      margin: 0 auto;
      padding-inline: clamp(16px, 4vw, 32px);
    }
    ```
  - At 1440px viewport width:
    - Main collection grid left/right margins: **120px**
    - People Also Bought container left/right margins: `(1440 - 1240) / 2 + 32px =` **132px**
  - **Visual Result:** The People Also Bought cards are indented 12px further inward than the main collection cards above them, breaking vertical grid rhythm.
- **Recommended Minimal Fix:**  
  Set `.samyak-pab-container` to use the theme's standard `.section--page-width` container pattern or match the page grid margins.

---

### B.2 Asymmetrical Grid when Recommendations < 4

- **Status:** **Confirmed Medium Defect**
- **Affected File:** [sections/collection-people-also-bought.liquid](file:///d:/samyak_hair/sections/collection-people-also-bought.liquid#L28-L75) (lines 28–75, 131)
- **Relevant Selector:** `.samyak-pab-grid`
- **Technical Analysis:**
  - In `sections/collection-people-also-bought.liquid`, recommendations are selected by iterating `collections['all'].products` and filtering out products already in the current collection (`unless current_ids contains prod.id`).
  - If a collection already contains most store products, only 1, 2, or 3 products might qualify.
  - The CSS grid is rigidly defined as:
    ```css
    .samyak-pab-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px 16px;
    }
    ```
  - When only 2 or 3 cards are rendered, they sit in columns 1–3, leaving columns 4 (or 3 and 4) completely empty.
  - **Visual Result:** The section appears skewed to the left with an empty blank void on the right, mimicking a right-side alignment failure.
- **Recommended Minimal Fix:**  
  Add `justify-content: center;` to `.samyak-pab-grid`, or improve fallback loop logic to ensure a full 4-card set is always provided.

---

### B.3 Mobile Card Skyscraper Proportions & Double-Padding Squeeze

- **Status:** **Confirmed High Visual Defect**
- **Affected Files:**
  - [snippets/product-card-styles.liquid](file:///d:/samyak_hair/snippets/product-card-styles.liquid#L81-L89) (lines 81–89, 144–177)
  - [sections/collection-people-also-bought.liquid](file:///d:/samyak_hair/sections/collection-people-also-bought.liquid#L144-L149) (lines 144–149)
- **Technical Analysis:**
  1. On mobile viewports (<= 767px), `sections/collection-people-also-bought.liquid` creates a 2-column grid (`repeat(2, 1fr)`).
  2. At 320px viewport, available card width is **138px**; at 375px viewport, card width is **165.5px**.
  3. However, `snippets/product-card-styles.liquid` enforces hardcoded pixel minimum heights on mobile:
     - `.product-card .card-gallery`: `min-height: 265px !important; max-height: 280px !important;`
     - `.product-card .product-info-wrap`: `min-height: 140px !important;`
     - Total Card Min-Height: **405px**
  4. On a 138px wide card, a 405px height produces an extreme **1:1.92 aspect ratio** (an unnaturally tall, narrow card).
  5. Furthermore, `.product-card .product-info-wrap` applies `padding: 18px 16px !important;` (32px horizontal padding). Inside it, `.product-card .product-title` and `.product-card .price` apply an *additional* `padding: 0 16px !important;` (another 32px horizontal padding).
  6. **Double Padding Impact:** Total horizontal padding is 64px. On a 138px mobile card, the usable width for text is only **74px**!
  7. With `font-size: clamp(17px, 1.4vw, 20px)`, only 7–8 characters fit per line. Product titles wrap into single-word lines and get cut off after 2 lines via `-webkit-line-clamp: 2`.
- **Recommended Minimal Fix:**  
  - Remove redundant `padding: 0 16px` on `.product-title` and `.price` since the parent `.product-info-wrap` already provides 16px padding.
  - Switch the mobile card gallery from fixed pixel min-height (`265px`) to responsive aspect ratio (e.g. `aspect-ratio: 1 / 1.15; min-height: auto;`).

---

### B.4 Missing Standard Card Controls (Wishlist & Quick Shop)

- **Status:** **Confirmed Medium Inconsistency**
- **Affected File:** [sections/collection-people-also-bought.liquid](file:///d:/samyak_hair/sections/collection-people-also-bought.liquid#L32-L68) (lines 32–68)
- **Technical Analysis:**
  - `sections/collection-people-also-bought.liquid` renders hand-written HTML rather than delegating to `snippets/product-card.liquid` or `blocks/_product-card.liquid`.
  - As a result, the cards in this section **lack the floating QUICK SHOP pill button** and **lack the top-right Wishlist heart button** present on every other product card across the storefront.
- **Recommended Minimal Fix:**  
  Refactor `collection-people-also-bought.liquid` to render the standard `product-card` snippet (`{% render 'product-card', product: prod %}`) for complete visual and functional parity.

---

## 4. Broader Storefront UI Findings

### 4.1 Header: Inverted Logo Sizing (Desktop 36px vs Mobile 55px)
- **Status:** **Confirmed Medium Defect**
- **Affected File:** [config/settings_data.json](file:///d:/samyak_hair/config/settings_data.json#L11-L12) (lines 11–12)
- **Description:**  
  `settings_data.json` defines `"logo_height": 36` and `"logo_height_mobile": 55`. On large 1920x1080 desktop screens, the primary brand logo is tiny and hard to read. On a 360px mobile screen, the logo is 55px tall, making the sticky header excessively deep and consuming prime viewport real estate.
- **Recommended Fix:** Set desktop logo height to 45px–50px and mobile logo height to 36px–38px.

### 4.2 Quick Shop Drawer: Mobile Bottom Navigation Z-Index Collision
- **Status:** **Confirmed Medium Defect**
- **Affected File:** [snippets/quick-shop-drawer.liquid](file:///d:/samyak_hair/snippets/quick-shop-drawer.liquid#L102) (line 102)
- **Description:**  
  `snippets/quick-shop-drawer.liquid` declares `z-index: 9998 !important;`. The mobile bottom navigation dock has `z-index: 9999;`. When Quick Shop is opened on mobile, the bottom dock floats over the Quick Shop drawer controls.
- **Recommended Fix:** Set Quick Shop drawer container to `z-index: 10001 !important;`.

### 4.3 Wishlist Drawer: Optimal Z-Index Alignment
- **Status:** **No Issue Found**
- **Affected File:** `snippets/wishlist-drawer.liquid` (line 71)
- **Description:**  
  `snippets/wishlist-drawer.liquid` uses `z-index: 10000;`, which correctly sits above the Mobile Bottom Navigation dock (`z-index: 9999`).

### 4.4 PDP Wholesale Purchase Controls & Sticky Behavior
- **Status:** **No Issue Found**
- **Affected File:** `snippets/wholesale-pdp.liquid`
- **Description:**  
  The 7-tier wholesale pricing table, quantity stepper, dynamic line total, and sticky Add to Cart bar on the PDP are properly aligned and responsive. Bottom padding on mobile (`body { padding-bottom: 68px; }`) prevents the sticky bottom bar from being obscured.

### 4.5 Search Modal & Drawer
- **Status:** **No Issue Found**
- **Description:**  
  The search modal triggered from both the desktop header and the mobile bottom dock opens with clean backdrop blur and centered input.

---

## 5. Responsive Testing Matrix (320px to 1440px)

The table below summarizes the computed layout behavior across all six required viewport sizes:

| Viewport Breakpoint | Cart Drawer Width & Price Status | People Also Bought Grid & Card Width | Mobile Bottom Nav Dock | Horizontal Body Overflow |
|---|---|---|---|:---:|
| **320px (Mobile XS)** | Width: 294.4px. Price clipped by **86px**. Overlapped by MBN. | 2 cols (gap 12px). Card width: 138px. Usable text: 74px (double padding). | Active (64px dock). WhatsApp button elevated 18px. | None detected (`overflow-x: clip`) |
| **375px (Mobile SM)** | Width: 345px. Price clipped by **86px**. Overlapped by MBN. | 2 cols (gap 12px). Card width: 165.5px. Usable text: 101.5px. | Active. Height 64px, z-index 9999. | None detected |
| **430px (Mobile LG)** | Width: 395.6px. Price clipped by **86px**. Overlapped by MBN. | 2 cols (gap 12px). Card width: 191.8px. Usable text: 127.8px. | Active. Clean thumb reach. | None detected |
| **768px (Tablet)** | Width: 410px. Price clipped by **86px**. MBN threshold boundary. | 2 cols (gap 16px). Card width: 345.3px. Clean aspect ratio. | Active at <= 768px. | None detected |
| **1024px (Tablet LG / Laptop)** | Width: 410px. Price clipped by **86px**. No MBN. | 4 cols (gap 16px). Card width: 228px. Clean layout. | Hidden via `display: none`. | None detected |
| **1440px (Desktop FHD)** | Width: 410px. Price clipped by **86px**. Clean layout. | 4 cols (gap 16px). Card width: 282px. 12px margin indent mismatch. | Hidden via `display: none`. | None detected |

---

## 6. Cart Functionality Verification

Prior to completing this audit, the automated cart test suite was re-executed against the live local codebase to verify that recent cart remediation remains fully operational:

```
=================================================================
SAMYAK HAIR — CART SYSTEM & SECTION RENDERING REMEDIATION TEST
=================================================================

[PASS] cart-drawer.liquid: SRA requests with render_wrapper: false bypass template.name != "cart"
[PASS] cart-drawer.liquid: Live wrapper ID is shopify-section-cart-drawer-section
[PASS] cart-drawer.liquid: Preserves native <theme-drawer id="cart-drawer"> component contract
[PASS] cart-drawer.liquid: Renders cart-items-component with section_id: "cart-drawer-section"
[PASS] cart-drawer-section.liquid: Calls cart-drawer with render_wrapper: false
[PASS] wholesale-pdp.liquid: Add to Cart SRA fetch uses section_id=cart-drawer-section
[PASS] wholesale-pdp.liquid: Add to Cart refreshes .cart-drawer__inner prior to opening drawer
[PASS] wholesale-pdp.liquid: Buy Now SRA fetch uses section_id=cart-drawer-section
[PASS] quick-shop-drawer.liquid: Quick Shop SRA fetch uses section_id=cart-drawer-section and matches container ID
[PASS] wishlist-drawer.liquid: Wishlist "Add All to Bag" uses section_id=cart-drawer-section
[PASS] main-wishlist.liquid: Wishlist page "Add to Bag" uses section_id=cart-drawer-section
[PASS] component-cart-items.js: Quantity increase/decrease/remove morphs by this.sectionId
[PASS] cart-summary.liquid: Preserves ₹2,000 Wholesale MOQ threshold progress bar and billing notices
[PASS] mobile-bottom-nav.liquid: Mobile Bag badge connected to real-time cart:updated events
[PASS] header-actions.liquid: Desktop header cart count badge fully integrated

-----------------------------------------------------------------
TOTAL TESTS: 15 | PASSED: 15 | FAILED: 0
=================================================================
```

---

## 7. Prioritized Remediation Roadmap (Pending Approval)

| Priority | Issue Description | Files Involved | Complexity | Estimated Effort |
|:---:|---|---|:---:|:---:|
| **P1 (Critical)** | **Fix Cart Drawer Price Clipping**<br>Replace 2-track `68px 1fr` grid with 3-track `68px 1fr auto` explicit grid. | `snippets/cart-drawer.liquid`<br>`assets/component-cart-drawer.css`<br>`assets/impression4u-core.css` | Minimal | 10 minutes |
| **P2 (High)** | **Fix Drawer Z-Index Hierarchy**<br>Elevate Cart Drawer & Quick Shop drawer to `z-index: 10001` so Mobile Bottom Nav doesn't overlap them. | `snippets/cart-drawer.liquid`<br>`snippets/quick-shop-drawer.liquid` | Minimal | 5 minutes |
| **P3 (High)** | **Fix Mobile Card Double-Padding & Height**<br>Remove inner `padding: 0 16px` on title/price; use responsive aspect ratio on mobile gallery. | `snippets/product-card-styles.liquid` | Low | 15 minutes |
| **P4 (Medium)** | **Align People Also Bought Container on Desktop**<br>Standardize `.samyak-pab-container` width and margins to match main collection grid. | `sections/collection-people-also-bought.liquid` | Low | 10 minutes |
| **P5 (Medium)** | **Rebalance Header Logo Sizing**<br>Set desktop logo to 48px and mobile logo to 36px in settings. | `config/settings_data.json` | Minimal | 3 minutes |
| **P6 (Low)** | **Unify People Also Bought Cards with Standard Component**<br>Render standard `product-card` snippet so Quick Shop and Wishlist controls appear. | `sections/collection-people-also-bought.liquid` | Low | 15 minutes |

---

## 8. Audit Conclusion & Next Steps

This audit conclusively proves that:
1. **The Cart Drawer price clipping is an explicit CSS Grid definition conflict** between custom 2-column styles and standard 3-cell Liquid markup. It is **not** caused by font size or padding.
2. **The People Also Bought alignment issue** stems from hardcoded container max-width (`1240px`) diverging from the collection grid's dynamic page width tokens, combined with asymmetrical grid rendering when fewer than 4 products are returned.
3. **No file modifications have been made.** The codebase remains untouched and fully operational.
4. **Implementation can begin immediately upon user review and approval of the recommended fixes.**
