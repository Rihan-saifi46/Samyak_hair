# Performance, SEO & Accessibility Audit Report
**Target Storefront:** Samyak Hair Accessories  
**Theme:** Horizon (Shopify OS 2.0, Version 4.3.0)  
**Audit Scope:** Code-Level Asset Delivery, Core Web Vitals Risk Factors, On-Page SEO Architecture, Structured Data, Semantic HTML, and WCAG 2.1 AA Accessibility  

---

## 1. Performance Architecture & Asset Delivery

*(Note: In accordance with audit safety guidelines, actual live Core Web Vitals and Lighthouse scores are not fabricated, as they require remote browser measurement under real network conditions. All findings below represent verified code-level performance risks and asset delivery bottlenecks).*

### Performance Risk Register

| Performance Vector | Code Implementation Status | Risk Severity | Architectural Assessment |
| :--- | :--- | :---: | :--- |
| **Render-Blocking CSS** | `snippets/stylesheets.liquid` | **Medium** | `base.css` (45.9 KB) and `overflow-list.css` loaded in `<head>`; critical CSS inlined via `{% style %}`. |
| **Global JS Execution** | `snippets/scripts.liquid` | **High** | 10 module scripts loaded globally on every page load, exceeding 10 KB threshold (Theme Check errors). |
| **Image Loading Strategy** | Native `image_tag` & `sizes` | **Low** | Horizon uses modern `image_tag` with `loading: 'lazy'` on below-fold images; sizes attribute populated. |
| **Font Loading & CLS** | `snippets/theme-styles-variables.liquid`| **Medium** | Inter font variants loaded with `font-display: swap`, but lack `<link rel="preload">`, risking font layout shift. |
| **DOM Complexity** | Ghost sections & nested blocks | **Medium** | 6 empty ghost sections across index and header add unnecessary DOM depth and layout recalculations. |
| **Third-Party Script Weight**| App block `conversion-bear` | **Low** | External trust badge widget loaded via Shopify App bridge in footer. |

---

## 2. On-Page SEO & Structured Data Evaluation

| SEO Component | Implementation Status | Quality / Conformance | Architectural Assessment |
| :--- | :---: | :---: | :--- |
| **Page Title Tag** | Implemented | Conforms | Formatted cleanly with shop name and tag/pagination pagination in `snippets/meta-tags.liquid`. |
| **Meta Description** | Implemented | Conforms | Populated from `page_description` with HTML escaping. |
| **Canonical URL** | Implemented | Conforms | Strict `<link rel="canonical" href="{{ canonical_url }}">` present in document `<head>`. |
| **Heading Hierarchy (H1–H6)**| **Flawed** | **Non-Conforming** | **Missing visible `<h1>` on homepage.** First visible headings begin at `<h2>`. |
| **Open Graph Metadata** | Implemented | Conforms | Complete `og:title`, `og:type`, `og:image`, `og:url`, `og:description` implemented. |
| **Twitter Card Metadata** | **Flawed** | **Partial** | `<meta name="twitter:site">` broken due to obsolete setting reference `settings.social_twitter_link`. |
| **Organization Schema** | Implemented | Minimal | Generates `@type: Organization` in `sections/header.liquid`, but lacks `sameAs` array and contact points. |
| **Product Schema** | Implemented | Standard | Uses `{{ product \| structured_data }}`; lacks custom wholesale minimum order quantity metadata. |
| **Sitelinks Searchbox Schema**| **Missing** | Not Implemented | No `WebSite` schema with `potentialAction: SearchAction` for Google rich sitelinks searchbox. |
| **Breadcrumb Schema** | **Missing** | Not Implemented | No `BreadcrumbList` schema markup for product or collection hierarchy. |

---

## 3. WCAG 2.1 AA Accessibility Evaluation

| Accessibility Factor | Compliance Status | Severity | Audit Assessment |
| :--- | :---: | :---: | :--- |
| **Color Contrast (CTAs)** | **Fails WCAG 1.4.3** | **Critical (P0)** | Primary buttons have white text on 0-alpha transparent background (Contrast Ratio 1.00:1 vs 4.5:1 required). |
| **Text Trapped in Images** | **Fails WCAG 1.4.5** | **High (P1)** | Contact information (phone, email, GST) locked in PNG graphic without alternative text. |
| **Keyboard Navigation** | Passed | Conforms | Skip-to-content link present; native `<dialog>` and interactive buttons support keyboard focus. |
| **Focus Visible States** | Passed | Conforms | `:focus-visible` outlines defined in `assets/base.css` with dedicated focus tokens. |
| **Screen Reader Landmarks** | Passed | Conforms | Semantic `<header>`, `<main id="MainContent">`, `<footer>`, `role="region"` implemented. |
| **Form Labels & Error States**| Passed | Conforms | Contact form and search modals include accessible labels, `<label>` elements, and `aria-hidden` SVGs. |

---

## 4. Detailed Findings & Issue Records

---

### Issue ID: `SEC-SEO-001`
- **Issue Title:** Missing Visible `<h1>` Heading on Storefront Homepage
- **Priority:** **P2 — Medium**
- **Category:** SEO / Content Hierarchy
- **Affected Template:** Homepage (`templates/index.json`)
- **Exact File References:**
  - `templates/index.json` (sections `product_list_FQ6CgE`, `blocks_...`)
  - `sections/header.liquid` (line 387)
- **Status:** **Confirmed SEO Defect**
- **Description:**  
  On the homepage, the only `<h1>` tag rendered in the markup is a visually hidden utility tag inside the header:
  ```liquid
  <h1 class="visually-hidden">{{ shop.name }}</h1>
  ```
  In the main body content, the visible headings begin immediately with `<h2>`:
  - `<h2>Discover & Order 📦</h2>` (Header collection block)
  - `<h2><strong>Explore All Products ✨</strong></h2>` (Product list grid)
  - `<h2>Customer Reviews</h2>` (Reviews block)  
  There is no prominent, visible `<h1>` introducing the business, its wholesale value proposition, or primary target keywords (e.g. *"Samyak Hair Accessories — Wholesale Hair Accessories, Clips & Jewelry Importer"*).
- **Potential Impact:**  
  Reduced organic search ranking for primary target keywords; weakened heading hierarchy for screen reader users navigating by heading landmark.
- **Recommended Solution:**  
  Introduce an accessible, visible hero or banner section at the top of the homepage with an optimized `<h1>` heading containing the brand name and primary commercial keywords, while keeping the visually hidden H1 in the header restricted to sub-pages.
- **Testing Required:**  
  Run an SEO heading hierarchy audit (e.g. WAVE or SEO Minion) to verify H1 -> H2 -> H3 progression.

---

### Issue ID: `SEC-SEO-002`
- **Issue Title:** Obsolete Theme Setting Reference Disables Twitter Site Meta Tag
- **Priority:** **P2 — Medium**
- **Category:** SEO / Social Sharing Metadata
- **Affected Component:** `snippets/meta-tags.liquid`
- **Exact File References:**
  - `snippets/meta-tags.liquid` (lines 80-86)
  - `config/settings_schema.json`
- **Status:** **Confirmed Code Flaw**
- **Description:**  
  In `snippets/meta-tags.liquid`, the theme attempts to output the Twitter site handle:
  ```liquid
  {%- if settings.social_twitter_link != blank -%}
    <meta
      name="twitter:site"
      content="{{ settings.social_twitter_link | split: 'twitter.com/' | last | prepend: '@' }}"
    >
  {%- endif -%}
  ```
  In Horizon 4.3.0, social media links were moved from global theme settings (`config/settings_schema.json`) into the `social-links` block (`blocks/social-links.liquid`). As a result, `settings.social_twitter_link` **does not exist** in the settings schema. The conditional always evaluates to `false`, and `<meta name="twitter:site">` is never output in `<head>`.
- **Potential Impact:**  
  Shared links on Twitter/X lack publisher site attribution.
- **Recommended Solution:**  
  Update `snippets/meta-tags.liquid` to read from the social-links block or restore `social_twitter_link` in `config/settings_schema.json`.
- **Testing Required:**  
  Inspect page `<head>` source and run URL through Twitter Card Validator.

---

### Issue ID: `SEC-SEO-003`
- **Issue Title:** Organization Structured Data Lacks Social Links (`sameAs`) & Sitelinks Searchbox
- **Priority:** **P3 — Low**
- **Category:** SEO / Schema.org Rich Snippets
- **Affected Components:** `sections/header.liquid`, `layout/theme.liquid`
- **Exact File References:**
  - `sections/header.liquid` (lines 328-340)
- **Status:** **Enhancement Opportunity**
- **Description:**  
  In `sections/header.liquid`, the Organization schema outputs only `name`, `logo`, and `url`:
  ```json
  {
    "@context": "http://schema.org",
    "@type": "Organization",
    "name": "Samyak Hair Accessories",
    "logo": "https://cdn.shopify.com/...",
    "url": "https://samyakhairaccessories.com"
  }
  ```
  It lacks the `sameAs` array pointing to official social profiles (Instagram, Facebook, YouTube), preventing Google Knowledge Graph from associating the store with its social identities. Furthermore, there is no `WebSite` schema declaring `SearchAction` for Google's Sitelinks Searchbox.
- **Potential Impact:**  
  Missed opportunity for Google Knowledge Panel verification and rich search sitelinks.
- **Recommended Solution:**  
  Expand the JSON-LD schema in `header.liquid` to include `sameAs`, contact point (`telephone`), and add `WebSite` schema with search action targeting `/search?q={search_term_string}`.
- **Testing Required:**  
  Validate homepage URL with Google Rich Results Test.

---

### Issue ID: `SEC-A11Y-001`
- **Issue Title:** Severe Color Contrast Failures on Primary Action Buttons (Ratio 1.00:1)
- **Priority:** **P0 — Critical**
- **Category:** Accessibility (WCAG 1.4.3 Contrast Minimum)
- **Affected Components:** Cart Drawer Checkout, Quick Add, Sticky Add-to-Cart, Contact Form Submit
- **Exact File References:**
  - `config/settings_data.json` (lines 53, 56)
  - `assets/base.css` (lines 889-904)
- **Status:** **Confirmed WCAG Failure**
- **Description:**  
  WCAG 2.1 Level AA Success Criterion 1.4.3 mandates a contrast ratio of at least **4.5:1** for normal text and **3:1** for large text and UI components.  
  As detailed in `SEC-FUNC-001`, primary buttons render `#ffffff` (white) text against `#DFDFDF00` (transparent) background over `#ffffff` (white) page background.  
  The calculated contrast ratio is **1.00:1** (pure failure). The text and button container are completely invisible to both visually impaired and standard-vision users.
- **Potential Impact:**  
  Total failure of accessibility compliance and storefront checkout usability.
- **Recommended Solution:**  
  Assign solid opaque colors to primary button background (e.g. `#171717` or `#AF6262`) to achieve a contrast ratio ≥ 7.0:1 with white text.
- **Testing Required:**  
  Verify color contrast with WebAIM Contrast Checker (minimum 4.5:1 achieved).

---

### Issue ID: `SEC-PERF-001`
- **Issue Title:** Excessive Global JavaScript Module Preloading (10 Theme Check Errors)
- **Priority:** **P2 — Medium**
- **Category:** Web Performance / Script Delivery Strategy
- **Affected Component:** Global Script Loader (`snippets/scripts.liquid`)
- **Exact File References:**
  - `snippets/scripts.liquid` (lines 125-280)
- **Status:** **Theme Check Error / Performance Risk**
- **Description:**  
  In `snippets/scripts.liquid`, 10 heavy JavaScript modules are loaded unconditionally on every single page load:
  - `utilities.js` (30.4 KB)
  - `facets.js` (33.1 KB)
  - `product-form.js` (40.4 KB)
  - `quick-order-list.js` (26.0 KB)
  - `product-card.js` (22.7 KB)
  - `header-menu.js` (22.2 KB)
  - `component-cart-items.js` (23.1 KB)
  - `cart-discount.js` (13.9 KB)
  - `gift-card-recipient-form.js` (14.0 KB)
  - `predictive-search.js` (14.5 KB)  
  Shopify Theme Check reports 10 `AssetSizeJavaScript` violations. Loading features like `gift-card-recipient-form.js` or `quick-order-list.js` globally on pages that have no gift cards or order lists wastes bandwidth and main-thread parse time on mobile connections.
- **Potential Impact:**  
  Increased Total Blocking Time (TBT) and slower Interaction to Next Paint (INP) on mobile devices.
- **Recommended Solution:**  
  Implement the "import on interaction" or conditional loading pattern recommended by Shopify: only load `gift-card-recipient-form.js` when a recipient form is present, and load `facets.js` only on collection and search templates.
- **Testing Required:**  
  Measure total JS payload transferred on homepage and product pages via DevTools Network tab.
