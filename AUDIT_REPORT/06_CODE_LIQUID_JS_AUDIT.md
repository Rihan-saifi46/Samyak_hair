# Code Quality, Liquid & JavaScript Technical Audit
**Target Storefront:** Samyak Hair Accessories  
**Theme:** Horizon (Shopify OS 2.0, Version 4.3.0)  
**Audit Scope:** Shopify Theme Check Offenses, Liquid Architecture, Web Components, JavaScript Runtime Risks, CSS Structure, and Encoding Issues  

---

## 1. Shopify Theme Check Offense Register

A comprehensive static analysis was executed across the codebase using `shopify theme check`. The following offenses were reported by the linter:

| File Path | Check Name | Severity | Row : Col | Diagnostic Message & Description |
| :--- | :--- | :---: | :---: | :--- |
| `sections/header.liquid` | `ExcessiveSettingsCount` | Warning | 1255 : 0 | Schema declares 42 settings, exceeding the maximum recommendation of 40. |
| `blocks/disclosures.liquid` | `UnknownFilter` | Error | 1 : 77 | Unknown filter `applicable_disclosures` used. |
| `snippets/cart-disclosure-tooltip.liquid` | `UnknownFilter` | Error | 27 : 69 | Unknown filter `applicable_disclosures` used. |
| `snippets/divider.liquid` | `UnusedDocParam` | Warning | 6 : 2 | Doc parameter `settings.alignment_horizontal` flagged as unused (nested param false positive). |
| `snippets/scripts.liquid` | `AssetSizeJavaScript` | Error | 128 : 7 | 10 scripts loaded globally exceed compressed threshold (10,000 bytes). |
| `blocks/filters.liquid` | `AssetSizeJavaScript` | Error | 14 : 7 | Script `facets.js` (33.1 KB) loaded unconditionally on filtered pages. |
| `sections/product-hotspots.liquid` | `AssetSizeJavaScript` | Error | 3 : 7 | Script `product-hotspot.js` (10.5 KB) loaded unconditionally. |

---

## 2. Detailed Code-Level Findings & Issue Records

---

### Issue ID: `SEC-CODE-001`
- **Issue Title:** Multiple Empty Ghost Sections Render Blank HTML Wrappers & Layout Shifts
- **Priority:** **P2 — Medium**
- **Category:** Liquid Architecture / DOM Efficiency
- **Affected Templates:** Homepage (`index.json`), Header Group (`header-group.json`), Footer Group (`footer-group.json`)
- **Exact File References:**
  - `templates/index.json` (sections `blocks_NcDtbW`, `blocks_GRVWAU`, `blocks_FeRw7h`, `blocks_zDcMgh`)
  - `sections/header-group.json` (section `1793532210a2306f6e`)
  - `sections/footer-group.json` (section `custom_liquid_nJrNxK`)
  - `sections/_blocks.liquid` (lines 8-20)
- **Status:** **Confirmed Code Defect**
- **Description:**  
  Across `templates/index.json`, four separate `_blocks` sections labeled "Collection list" exist with completely empty block dictionaries (`"blocks": {}`). Similarly, in `sections/header-group.json`, section `"1793532210a2306f6e"` is an empty `_blocks` section, and in `sections/footer-group.json`, section `"custom_liquid_nJrNxK"` is an empty `custom-liquid` section with `"custom_liquid": ""`.  
  In `sections/_blocks.liquid`:
  ```liquid
  {% capture children %}
    {% content_for 'blocks' %}
  {% endcapture %}

  {% render 'section',
    section: section,
    children: children,
    section_id: section.id,
    background_color: section.settings.background_color
  %}
  ```
  `_blocks.liquid` does **not** check whether `children` is blank. Even when `children` is empty, it calls `render 'section'`, which prints outer container wrappers, padding custom properties, grid gaps, and border wrappers.  
  This injects 6 ghost HTML elements with margin and padding into the live DOM, creating mysterious blank vertical gaps on the homepage, header, and footer.
- **Evidence:**
  `templates/index.json`:
  ```json
  "blocks_NcDtbW": {
    "type": "_blocks",
    "name": "Collection list",
    "settings": { ... },
    "blocks": {}
  }
  ```
- **Potential Impact:**  
  Unnecessary DOM complexity, phantom whitespace gaps, and cumulative layout shift (CLS).
- **Recommended Solution:**  
  1. Remove the empty orphaned sections (`blocks_NcDtbW`, `blocks_GRVWAU`, `blocks_FeRw7h`, `blocks_zDcMgh`, `1793532210a2306f6e`, `custom_liquid_nJrNxK`) from `index.json`, `header-group.json`, and `footer-group.json`.
  2. Add a guard in `sections/_blocks.liquid` to only render when `children | strip != blank`.
- **Testing Required:**  
  Inspect DOM in browser DevTools; confirm no empty `.section-wrapper` elements are rendered.

---

### Issue ID: `SEC-CODE-002`
- **Issue Title:** Character Encoding Corruption (Mojibake) Across Announcements, Headings & Reviews
- **Priority:** **P2 — Medium**
- **Category:** Code Quality / Localization & Formatting
- **Affected Components:** Announcement Bars, Homepage Headings, Reviews Section
- **Exact File References:**
  - `sections/header-group.json` (lines 20, 140, 175, 185, 235)
  - `templates/index.json` (lines 40, 785, 790, 805, 815)
- **Status:** **Confirmed Encoding Defect**
- **Description:**  
  Multiple JSON template files contain UTF-8 byte sequences that were mistakenly saved in ANSI/Windows-1252 encoding ("mojibake"):
  - `â‚¹2000` instead of `₹2000` (Indian Rupee symbol).
  - `ðŸšš` instead of `🚚` (delivery truck emoji).
  - `ðŸ“¦` instead of `📦` (package emoji).
  - `â­ ` instead of `⭐` (star emoji).
  - `âœ¨` instead of `✨` (sparkles emoji).
  - `â˜…` and `â˜†` instead of `★` and `☆` (star glyphs).
  - `Â·` instead of `·` (middle dot separator).
  - `â °` instead of `⏱` (stopwatch emoji).
  - `6â€“8 days` instead of `6–8 days` (en-dash).
- **Evidence:**
  `sections/header-group.json`:
  ```json
  "text": "&nbsp;<strong>ðŸšš WHOLESALE ONLY &nbsp; | &nbsp; Minimum Order â‚¹2000 &nbsp; | &nbsp; All India Delivery &nbsp; | &nbsp; Direct Importer from China</strong>&nbsp;"
  "heading": "Discover & Order ðŸ“¦"
  "text": "â ° Estimated delivery: 6â€“8 days&nbsp;"
  "text": "&nbsp;4.6 â­  Customer Rating<strong>&nbsp;</strong>"
  ```
- **Potential Impact:**  
  Storefront text displays corrupted glyphs (`ðŸšš`, `â‚¹2000`) on customer browsers, undermining brand professionalism.
- **Recommended Solution:**  
  Clean and resave all string values with valid UTF-8 characters (`₹2000`, `🚚`, `📦`, `⭐`, `–`, `·`, `★`).
- **Testing Required:**  
  Verify text displays correctly across iOS, Android, macOS, and Windows browsers.

---

### Issue ID: `SEC-CODE-003`
- **Issue Title:** Fragile Hardcoded Section IDs in Custom Liquid Scoped Styles
- **Priority:** **P2 — Medium**
- **Category:** CSS Architecture / Maintainability
- **Affected Components:** `custom_liquid_fTMk68` (Reviews), `custom_liquid_MQA9UW` (Instagram)
- **Exact File References:**
  - `templates/index.json` (lines 755-780, 920-945)
- **Status:** **Confirmed Architectural Flaw**
- **Description:**  
  Both custom liquid blocks in `templates/index.json` scope their CSS using hardcoded section IDs generated by a specific theme editor instance:
  ```css
  #shopify-section-template--28229845778545__custom_liquid_fTMk68 .reviews-section { ... }
  #shopify-section-template--28229845778545__custom_liquid_MQA9UW .instagram-banner { ... }
  ```
  If the merchant duplicates the section, changes the theme preset, exports/imports the theme to another store, or re-adds the custom liquid section, the ID `template--28229845778545__custom_liquid_...` changes. Consequently, all custom styling immediately breaks, leaving unstyled text and raw HTML.
- **Potential Impact:**  
  High risk of silent CSS failure during routine theme updates or duplication.
- **Recommended Solution:**  
  Replace hardcoded IDs with dynamic Liquid scope: `#shopify-section-{{ section.id }}` or use standard BEM classes scoped inside the section container.
- **Testing Required:**  
  Verify styling survives section renaming and duplication.

---

### Issue ID: `SEC-CODE-004`
- **Issue Title:** Header Section Schema Exceeds Shopify 40-Setting Threshold
- **Priority:** **P3 — Low**
- **Category:** Shopify Theme Architecture / Theme Editor Performance
- **Affected Component:** `sections/header.liquid`
- **Exact File References:**
  - `sections/header.liquid` (lines 1255-1510)
- **Status:** **Theme Check Warning**
- **Description:**  
  `sections/header.liquid` schema declares 42 settings, triggering the Shopify Theme Check `ExcessiveSettingsCount` warning (recommended maximum: 40).  
  While Shopify allows up to 50 settings before hard-crashing the editor, exceeding 40 degrades Theme Editor sidebar rendering speed and violates Shopify's theme authoring guidelines.
- **Potential Impact:**  
  Sluggish Theme Editor responsiveness when customizing the header.
- **Recommended Solution:**  
  Extract auxiliary settings (e.g. transparent header overrides, country/language localizations) into sub-blocks or theme-level global settings.
- **Testing Required:**  
  Open Shopify Theme Editor; confirm header section settings panel loads without delay.

---

### Issue ID: `SEC-CODE-005`
- **Issue Title:** Unknown Filter `applicable_disclosures` in Compliance Blocks
- **Priority:** **P3 — Low**
- **Category:** Liquid Compatibility / Theme Check Offenses
- **Affected Components:** `blocks/disclosures.liquid` (line 1), `snippets/cart-disclosure-tooltip.liquid` (line 27)
- **Exact File References:**
  - `blocks/disclosures.liquid` (line 1)
  - `snippets/cart-disclosure-tooltip.liquid` (line 27)
- **Status:** **Theme Check Error / Platform Feature**
- **Description:**  
  Both files execute:
  ```liquid
  assign disclosures = closest.product.metafields.shopify.disclosure.value | applicable_disclosures
  ```
  Shopify Theme Check reports: `Unknown filter 'applicable_disclosures' used.`  
  This filter is a newly introduced Shopify B2B/compliance filter for European Union GPSR and California Prop 65 product disclosure metafields. In older Theme Check rulesets it flags as an error. If the store does not utilize Shopify Disclosure metafields, the filter operates on an empty object without runtime disruption, but produces lint failures.
- **Potential Impact:**  
  Theme Check CI/CD pipeline failures.
- **Recommended Solution:**  
  Add `applicable_disclosures` to `.theme-check.yml` ignore list or provide a defensive Liquid fallback (`disclosures | default: empty`).
- **Testing Required:**  
  Execute `shopify theme check` to ensure clean exit code.

---

### Issue ID: `SEC-CODE-006`
- **Issue Title:** Development Artifacts & TypeScript Declarations Deployed in Production Assets
- **Priority:** **P3 — Low**
- **Category:** Code Cleanliness & Asset Hygiene
- **Affected Component:** `assets/` Directory
- **Exact File References:**
  - `assets/package.json`
  - `assets/jsconfig.json`
  - `assets/global.d.ts`
  - `assets/standard-actions.d.ts`
  - `assets/standard-events.d.ts`
  - `assets/view-event-elements.d.ts`
- **Status:** **Confirmed Asset Clutter**
- **Description:**  
  The theme's `assets/` directory contains non-storefront development files, including a 23-byte `package.json`, an IDE `jsconfig.json`, and 4 TypeScript declaration files (`.d.ts`). These files serve no purpose on a live Shopify storefront and are served publicly via CDN if requested.
- **Potential Impact:**  
  Unnecessary asset directory clutter and minor security/information disclosure of internal build tooling.
- **Recommended Solution:**  
  Relocate TypeScript definitions and config files to the project root or a development folder outside the storefront `assets/` directory.
- **Testing Required:**  
  Confirm theme builds and runs without `.d.ts` files in `assets/`.
