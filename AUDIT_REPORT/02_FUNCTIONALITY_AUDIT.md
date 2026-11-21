# Storefront Functionality Audit Report
**Target Storefront:** Samyak Hair Accessories  
**Theme:** Horizon (Shopify OS 2.0, Version 4.3.0)  
**Audit Type:** Code-Level Functionality & Feature Assessment (Read-Only)  

---

## 1. Feature Implementation Matrix

| Storefront Feature | Implementation Status | Code Quality / Correctness | Event Handlers & Components | Missing Dependencies / Risks |
| :--- | :---: | :---: | :---: | :--- |
| **Header & Navigation** | Exists | Flawed Configuration | `<header-component>`, `<overflow-list>` | Menu background hardcoded `#c11313`; 15 collection cards injected into header group. |
| **Announcement Bar** | Exists | Duplicated & Conflicting | `<marquee-component>` | Two separate announcement bars active; conflicting speed/colors; encoding errors. |
| **Search (Predictive & Modal)**| Exists | Correct | `<predictive-search-component>`, `<dialog>` | Standard Horizon implementation; requires live product catalog for suggestion queries. |
| **Product Listing Pages** | Exists | Broken Configuration | `<product-card>`, `<facets-form>` | Homepage grids missing collection handle (`"collection": ""`); renders dummy data. |
| **Product Detail Pages** | Exists | Correct (Layout Heavy) | `<product-form>`, `<media-gallery>` | Sticky Add-to-Cart button has 1:1 invisible contrast; buy button style secondary workaround. |
| **Product Images & Gallery** | Exists | Correct | `<media-gallery>`, `<drag-zoom-wrapper>` | Zoom dialog, model-viewer styles present; responsive thumbnail carousel active. |
| **Product Variants** | Exists | Correct | `<variant-picker>`, custom elements | Swatches and equal-width buttons supported; uses `@theme/variant-picker`. |
| **Add to Cart & Buy Box** | Exists | Broken Visibility | `<product-form>`, `<fly-to-cart>` | Primary button style renders white text on transparent background. |
| **Cart Drawer & Cart Page** | Exists | Broken Checkout Visibility | `<cart-drawer>`, `<cart-items>` | Checkout button invisible; minimum order of ₹2,000 has zero validation. |
| **Quantity Controls** | Exists | Correct | `<component-quantity-selector>` | Plus/minus incrementors, quantity rules (min/max/step) handled in component. |
| **Wishlist** | **Missing** | Not Implemented | None | No native or app block implementation found in theme codebase. |
| **Collection Filters & Sorting**| Exists | Correct | `<facets-form>`, `@theme/facets` | Horizontal and drawer filtering implemented; swatch filter support active. |
| **Customer Account Pages** | **Partial** | Missing Classic Templates | `<shopify-account>` | Relies on New Customer Accounts; `templates/customers/*.json` missing. |
| **Login & Registration** | **Partial** | Hosted Auth Endpoint | Shopify platform routes | No local customer templates; depends on Shopify-hosted authentication. |
| **Footer & Utilities** | Exists | Flawed Configuration | Semantic `<footer>`, policy blocks | Unlinked logo; contact info trapped in raster graphic; generic social links. |
| **Contact Forms** | Exists | Broken Submit Visibility | Native `<form 'contact'>` | Submit button invisible due to primary button transparency setting. |
| **Newsletter Forms** | Exists | Broken Submit Visibility | Native `<form 'customer'>` | Password template newsletter submit button has invisible primary styling. |
| **Popup Functionality** | Exists | Correct | `<theme-drawer>`, `<dialog>` | Dialog and popover polyfill present for native dialog elements. |
| **WhatsApp Button** | **Missing** | Not Implemented | None | Essential B2B wholesale communication channel completely absent. |
| **Disclosures & Retail Info** | Exists | Theme-Check Filter Warning | `<disclosures-summary-fit>` | Uses `applicable_disclosures` filter flagged by Theme Check linter. |

---

## 2. Detailed Functional Findings & Issue Records

---

### Issue ID: `SEC-FUNC-001`
- **Issue Title:** Primary Action Buttons Render Completely Invisible Across Entire Store
- **Priority:** **P0 — Critical**
- **Category:** Storefront Functionality / Purchase Journey Blockers
- **Affected Components:** Cart Drawer, Cart Page, Contact Form, Password Page, Quick Add, Sticky Add-to-Cart
- **Exact File References:**
  - `config/settings_data.json` (lines 53, 56, 73)
  - `snippets/color-palette.liquid` (lines 35-45, 126-130)
  - `assets/base.css` (lines 810-845, 889-904)
  - `snippets/cart-summary.liquid` (lines 159, 259)
  - `sections/product-information.liquid` (line 122)
  - `snippets/quick-add.liquid` (line 132)
  - `blocks/contact-form.liquid` (lines 1-15)
  - `templates/password.json` (lines 35-45)
- **Status:** **Confirmed Issue**
- **Description:**  
  In `config/settings_data.json`, the theme settings configure the primary button background token as `#DFDFDF00`. The trailing `00` hex digits define an alpha channel of `0%` (fully transparent). Simultaneously, `palette_primary_button_text` is bound to `{{ settings.color_palette.background }}` (`#ffffff`), and `primary_button_border_width` is set to `0`.  
  In `assets/base.css`, the `.button` class sets:
  ```css
  --button-color: var(--color-primary-button-text); /* rgb(255, 255, 255) */
  --button-background-color: var(--color-primary-button-background); /* rgba(223, 223, 223, 0) */
  --button-border-width: var(--style-border-width-primary); /* 0px */
  ```
  Consequently, every primary action button across the site renders white text on a completely transparent background with zero border against a white page background (`#ffffff`).
- **Evidence:**
  `config/settings_data.json`:
  ```json
  "palette_primary_button_background": "#DFDFDF00",
  "palette_primary_button_text": "{{ settings.color_palette.background }}",
  "primary_button_border_width": 0,
  ```
  `snippets/cart-summary.liquid`:
  ```liquid
  <button
    type="submit"
    name="checkout"
    class="cart__checkout-button button"
    form="cart-form"
  >
  ```
- **Potential Impact:**  
  Catastrophic conversion loss. Customers in the Cart Drawer or Cart Page cannot visually locate the "Check out" button. Users attempting to submit a contact inquiry cannot locate the "Submit" button. Mobile users seeing the sticky Add-to-Cart bar see an invisible button.
- **Recommended Solution:**  
  Update `config/settings_data.json` to assign an opaque, high-contrast primary button background (e.g. `#171717` or `#000000` or the primary brand color `#AF6262`), set `palette_primary_button_text` to `#ffffff`, and configure `primary_button_border_width` to at least `1px` or give it a solid background.
- **Testing Required:**  
  Inspect the Cart Drawer checkout button, Cart page checkout button, discount apply button, contact form submit button, sticky add-to-cart button, and quick-add button in desktop and mobile viewports across Chrome, Safari, and Firefox.

---

### Issue ID: `SEC-FUNC-002`
- **Issue Title:** Header Group Injects 15 Collection Cards into Every Store Page
- **Priority:** **P0 — Critical**
- **Category:** Storefront Layout / Header Architecture
- **Affected Components:** Global Store Layout (Product Pages, Collection Pages, Cart, 404, Search, Pages)
- **Exact File References:**
  - `sections/header-group.json` (lines 225-285)
  - `layout/theme.liquid` (lines 35-40)
  - `blocks/ai_gen_block_68e7006.liquid` (lines 1-105)
- **Status:** **Confirmed Issue**
- **Description:**  
  In `sections/header-group.json`, section `"1793529195fec65ecb"` (`_blocks.liquid`) has been added to the header section group. It embeds two `ai_gen_block_68e7006` blocks displaying 15 collections (`frontpage`, `metal-claw`, `kids-collection`, `hair-band`, `scrunchies`, `press-on-nails`, `hair-extensions`, `anit-tarnish-jewellery`, `parandi`, `korean-pins`, `hair-vines`, `girls-bracelets`, `hair-crystal-pins`, `kids-utility`, `festives-offer`).  
  Because `layout/theme.liquid` executes `{% sections 'header-group' %}` on every storefront view, this entire collection grid is rendered on **every single template** directly below the main navigation.
- **Evidence:**
  `sections/header-group.json`:
  ```json
  "1793529195fec65ecb": {
    "type": "_blocks",
    "blocks": {
      "ai_gen_block_68e7006_CdiBW9": {
        "type": "ai_gen_block_68e7006",
        "settings": {
          "heading": "Discover & Order ðŸ“¦",
          "collections": ["frontpage", "metal-claw", ...]
        }
      },
      "ai_gen_block_68e7006_ABbibc": {
        "type": "ai_gen_block_68e7006",
        "settings": {
          "collections": ["parandi", "korean-pins", ...]
        }
      }
    }
  }
  ```
- **Potential Impact:**  
  Severe disruption of the shopping journey. When a buyer visits a product detail page (e.g. `/products/korean-hair-clip`), instead of seeing the product title, gallery, price, and buy box above the fold, they are forced to scroll past 15 large collection cards before encountering the product details. On mobile, this requires 6 to 8 full-screen scrolls just to reach the intended content.
- **Recommended Solution:**  
  Remove section `"1793529195fec65ecb"` completely from `sections/header-group.json`. If this collection list is intended for the homepage, relocate the section to `templates/index.json`.
- **Testing Required:**  
  Navigate to Product, Collection, Cart, Page, and 404 templates. Verify that the header contains only the announcement bar and primary navigation, and that template content begins immediately below the header.

---

### Issue ID: `SEC-FUNC-003`
- **Issue Title:** Homepage Featured Product Grids Configured with Empty Collection Handles
- **Priority:** **P1 — High**
- **Category:** Homepage / Catalog Merchandising
- **Affected Components:** Homepage Featured Products Grids (`product_list_FQ6CgE`, `product_list_EaYijr`)
- **Exact File References:**
  - `templates/index.json` (lines 272, 535)
  - `sections/product-list.liquid` (lines 30-55)
- **Status:** **Confirmed Issue**
- **Description:**  
  In `templates/index.json`, both featured product grid sections (`product_list_FQ6CgE` titled "Explore All Products ✨" and `product_list_EaYijr`) have `"collection": ""`.  
  In `sections/product-list.liquid`, when `section.settings.collection` is blank, the Liquid logic drops into an `else` branch:
  ```liquid
  {% if section.settings.collection != blank and shop.products_count != 0 %}
    ...
  {% else %}
    {% for i in (1..max_items) %}
      <div class="resource-list__item">
        {% content_for 'block', type: '_product-card', id: 'static-product-card', product_view_context: 'collection' %}
      </div>
    {% endfor %}
  {% endif %}
  ```
  This causes the sections to render 8 and 10 dummy placeholder product cards with placeholder SVGs and generic titles rather than actual products from the store.
- **Evidence:**
  `templates/index.json`:
  ```json
  "product_list_FQ6CgE": {
    "type": "product-list",
    "settings": {
      "collection": "",
      "max_products": 8
    }
  },
  "product_list_EaYijr": {
    "type": "product-list",
    "settings": {
      "collection": "",
      "max_products": 10
    }
  }
  ```
- **Potential Impact:**  
  First impressions are severely damaged. Prospective B2B buyers arriving on the homepage see placeholder demonstration cards rather than real wholesale merchandise, pricing, or inventory.
- **Recommended Solution:**  
  Assign valid collection handles in `templates/index.json` (such as `"all"`, `"frontpage"`, or specific featured collections like `"metal-claw"` or `"hair-band"`).
- **Testing Required:**  
  Verify homepage rendering on desktop and mobile to ensure live products, prices, images, and variant swatches load in place of placeholder blocks.

---

### Issue ID: `SEC-FUNC-004`
- **Issue Title:** "View All" Button on Homepage Product Grid Fails to Render
- **Priority:** **P1 — High**
- **Category:** Homepage / Navigation Flow
- **Affected Components:** `product_list_FQ6CgE` Header Button
- **Exact File References:**
  - `templates/index.json` (lines 50-70)
  - `blocks/_product-list-button.liquid` (lines 1-8)
- **Status:** **Confirmed Issue**
- **Description:**  
  `blocks/_product-list-button.liquid` checks:
  ```liquid
  {% assign button_collection = closest.collection %}
  {% assign button_url = button_collection.url %}

  {% if button_collection.products_count > section.settings.max_products %}
    {% render 'button', link: button_url %}
  {% endif %}
  ```
  Because `section.settings.collection` is empty, `button_collection` is `nil` and `button_collection.products_count` is 0. The condition evaluates to false, causing the "View all" button to be suppressed entirely.
- **Potential Impact:**  
  Customers looking to view the full product catalog from the "Explore All Products" section have no clickable pathway to reach the catalog.
- **Recommended Solution:**  
  Resolving `SEC-FUNC-003` (binding a valid collection with more than 8 products) will automatically restore the button; alternatively, provide a fallback link to `routes.all_products_collection_url`.
- **Testing Required:**  
  Confirm the "View all" button appears and navigates to the assigned collection or `/collections/all`.

---

### Issue ID: `SEC-FUNC-005`
- **Issue Title:** Wholesale Minimum Order (₹2,000) Has Zero Validation or Checkout Enforcement
- **Priority:** **P1 — High**
- **Category:** Checkout / Business Logic Enforcement
- **Affected Components:** Announcement Bar, Cart Drawer, Cart Page, Checkout Pipeline
- **Exact File References:**
  - `sections/header-group.json` (lines 20-25, 135-140)
  - `snippets/cart-summary.liquid` (lines 250-275)
  - `assets/component-cart-items.js` (lines 180-230)
- **Status:** **Confirmed Issue**
- **Description:**  
  The storefront prominently advertises `Minimum Order ₹2000` in both active announcement bars. However, inspecting the cart codebase reveals **zero checks** against `cart.total_price`. There is no conditional logic disabling the checkout button when `cart.total_price < 200000`, no warning badge, and no progress bar informing the customer how much more to add to meet the wholesale threshold.
- **Potential Impact:**  
  Retail consumers or small buyers can complete purchases for nominal amounts (e.g. ₹100 or ₹250). For a wholesale business operating on volume margins and freight absorption, processing sub-minimum orders results in direct financial loss or manual order cancellation overhead.
- **Recommended Solution:**  
  Implement a client-side and Liquid-side minimum cart validator in `snippets/cart-summary.liquid` and `assets/component-cart-items.js` that checks `cart.total_price < 200000` (in paise for INR):
  - Disable the checkout button and show an informative message (e.g., *"Minimum wholesale order is ₹2,000. Add ₹X more to checkout"*).
  - Add a dynamic progress bar in the Cart Drawer.
  - Backstop this via a Shopify Checkout Function / Validation API rule (if on Shopify Plus) or third-party order validation app.
- **Testing Required:**  
  Add items totaling ₹500 to cart: verify checkout button is disabled with alert. Add items totaling ₹2,500: verify checkout button is enabled.

---

### Issue ID: `SEC-FUNC-006`
- **Issue Title:** Absence of WhatsApp Quick-Ordering and Customer Chat Feature
- **Priority:** **P2 — Medium**
- **Category:** Customer Engagement / Conversion Optimization
- **Affected Components:** Storewide Floating Actions, Header, Product Pages
- **Exact File References:**
  - Entire theme codebase (`snippets/`, `sections/`, `blocks/`)
- **Status:** **Confirmed Issue / Functional Gap**
- **Description:**  
  For Indian B2B wholesale commerce, WhatsApp is the primary communication, negotiation, catalog sharing, and order confirmation medium. While the Horizon theme includes SVG icons for WhatsApp in `snippets/icon.liquid`, there is **no WhatsApp floating button, no direct click-to-chat integration, and no WhatsApp order inquiry button** anywhere on the storefront.
- **Potential Impact:**  
  High friction for Indian wholesale buyers who prefer instant bulk pricing inquiries, live video parcel verification, and WhatsApp order placement over standard web forms.
- **Recommended Solution:**  
  Implement a lightweight, accessible floating WhatsApp CTA block with configurable phone number and pre-filled message (e.g. `https://wa.me/91XXXXXXXXXX?text=Hi%20Samyak%20Hair,%20I%20want%20to%20place%20a%20wholesale%20order`).
- **Testing Required:**  
  Click WhatsApp button on mobile (launches WhatsApp app with pre-filled message) and desktop (opens WhatsApp Web).

---

### Issue ID: `SEC-FUNC-007`
- **Issue Title:** Missing Classic Customer Account Templates (`templates/customers/`)
- **Priority:** **P2 — Medium**
- **Category:** Customer Accounts & Authentication
- **Affected Components:** Account, Login, Register, Addresses, Order History
- **Exact File References:**
  - `templates/` directory (lack of `templates/customers/` subdirectory)
  - `snippets/header-actions.liquid` (lines 65-105)
- **Status:** **Confirmed Architectural Finding**
- **Description:**  
  The theme directory lacks `templates/customers/` (`account.json`, `login.json`, `register.json`, `addresses.json`, `order.json`). The theme relies entirely on Shopify's New Customer Accounts hosted by Shopify (`<shopify-account>`). If the merchant's Shopify Admin account settings have "Classic customer accounts" selected, customers navigating to `/account/login` will encounter unstyled legacy fallbacks or theme display issues.
- **Potential Impact:**  
  Inconsistency if classic customer accounts are active on the store.
- **Recommended Solution:**  
  Confirm whether New Customer Accounts is active in Shopify Admin. If Classic accounts are required, scaffold the standard OS 2.0 customer JSON templates.
- **Testing Required:**  
  Verify `/account/login` and `/account` in live store environment.
