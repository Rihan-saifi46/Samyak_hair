# 03 — REGISTER OF MODIFIED & CREATED FILES

**Project:** Samyak Hair Accessories Storefront Redesign  
**Theme Engine:** Shopify Horizon 4.3.0  
**Phase:** Phase 2 — Implementation Register  
**Date:** November 2026

---

## 1. Summary of Changes

```
+-------------------------------------------------------------+
| TOTAL MODIFIED FILES : 7 files                             |
| TOTAL CREATED FILES  : 17 files (8 sections, 9 snippets)   |
| TOTAL DELETED / PURGED GHOST ELEMENTS : 6 ghost blocks      |
| VALIDATION STATUS    : 100% Valid JSON & Liquid             |
+-------------------------------------------------------------+
```

---

## 2. Modified Existing Files

### 1. `config/settings_data.json`
- **File Role:** Shop-wide theme settings and design tokens.
- **Key Modifications:**
  - `palette_primary_button_background`: Set to `"{{ settings.color_palette.foreground }}"` (`#1A1A1A`).
  - `palette_primary_button_text`: Set to `"{{ settings.color_palette.background }}"` (`#FFFFFF`).
  - `primary_button_border_width`: Set to `1`.
  - `primary_button_border_radius`: Set to `8`.
  - `secondary_button_border_radius`: Set to `8`.
  - `card_corner_radius`: Set to `8`.
  - `color_palette.color1`: Set to `#8C2D43` (Rich Wine Rose).
  - `color_palette.color2`: Set to `#eae6e1` (Warm Sand Neutral).
  - `logo_height`: Increased from `25` to `48`.
  - `logo_height_mobile`: Increased from `25` to `38`.
- **Purpose:** Resolved P0 invisible button contrast, upgraded brand color harmony, proportioned merchant logo.

### 2. `sections/header-group.json`
- **File Role:** Header section group configuration across all storefront templates.
- **Key Modifications:**
  - Removed section `1793529195fec65ecb` (15 massive AI collection cards that previously hijacked all page headers).
  - Removed section `1793532210a2306f6e` (empty `_blocks` ghost section).
  - Removed section `header_announcements_NG3CbQ` (second redundant announcement bar).
  - Cleaned `header_announcements_9jGBFp`: soft blush background (`#F8EFEF`), dark text (`#2B2325`), WhatsApp order link.
  - Reset `header_menu` background: removed `#c11313` crimson red.
  - Simplified section order: `["header_announcements_9jGBFp", "header_section"]`.
- **Purpose:** Restored header usability across all templates, eliminated 82% header payload bloat.

### 3. `layout/theme.liquid`
- **File Role:** Master HTML shell template.
- **Key Modifications:**
  - Added `{% render 'whatsapp-floating-button' %}` immediately before closing `</body>` tag (line 175).
- **Purpose:** Globally rendered the accessible wholesale WhatsApp floating quick-order CTA on all pages.

### 4. `snippets/cart-summary.liquid`
- **File Role:** Shared cart subtotal, discount, tax, and checkout CTA renderer for drawer and cart page.
- **Key Modifications:**
  - Added wholesale MOQ calculation logic: `wholesale_min_threshold = 200000` (₹2,000 in paise).
  - Added `.cart-wholesale-bar` UI widget with real-time progress bar, remaining Rupee difference, and ARIA attributes.
  - Added `.cart-wholesale-warning` alert banner when cart total is below ₹2,000.
  - Added checkout button validation lock: `disabled` attribute toggled when `is_wholesale_met == false`.
  - Added complete responsive component styling in `{% stylesheet %}` block.
- **Purpose:** Enforced B2B wholesale minimum order value (MOV) across Cart Drawer and Cart Page.

### 5. `templates/index.json`
- **File Role:** Homepage template layout and section ordering.
- **Key Modifications:**
  - Integrated 8 native wholesale sections:
    - `hero_banner` (`wholesale-hero-banner`)
    - `trust_bar` (`wholesale-trust-bar`)
    - `category_grid` (`wholesale-category-grid`)
    - `customer_segments` (`wholesale-customer-segments`)
    - `how_it_works` (`wholesale-how-it-works`)
    - `brand_story` (`wholesale-brand-story`)
    - `custom_liquid_fTMk68` (`wholesale-reviews`)
    - `custom_liquid_MQA9UW` (`wholesale-social-banner`)
  - Modernized `product_list_FQ6CgE`: connected to `"collection": "all"`, removed `#accec7` teal card background, fixed block order.
  - Modernized `product_list_EaYijr`: connected to `"collection": "all"`, removed `#accec7` background, fixed block order.
  - Purged 4 empty ghost sections (`blocks_NcDtbW`, `blocks_GRVWAU`, `blocks_FeRw7h`, `blocks_zDcMgh`).
  - Restored clean FAQ styling in `section_7nJda9`.
- **Purpose:** Completely redesigned homepage following the Impression4U B2B wholesale standard.

### 6. `sections/footer-group.json`
- **File Role:** Global footer section group configuration.
- **Key Modifications:**
  - Purged empty section `custom_liquid_nJrNxK`.
  - In `footer_m9NzUG`:
    - Changed `background_color` from hot pink `#fcd7ea` to warm neutral `#f8f6f5`.
    - Added `"link": "/"` to logo block `image_D9Urzz`.
    - Reset `menu_aRBiyM` offset from `70` to `0`.
    - Replaced raster image `image_AQXcat` with semantic HTML block `text_contact_info` with clickable phone, email, and address.
    - Purged empty blocks: `text_AFzhxa`, `social_links_9qtGiw`, `group_aDDdAt`, `group_H6VpwJ`.
  - In `footer_utilities_jLGE8U`:
    - Removed banned/placeholder TikTok and Twitter links; configured verified Instagram.
  - Purged disabled duplicate section `footer_utilities_8yeTaL`.
  - Simplified section order: `["footer_m9NzUG", "footer_utilities_jLGE8U"]`.
- **Purpose:** Transformed footer into a clean, 4-column accessible B2B contact and navigation hub.

### 7. `templates/list-collections.json`
- **File Role:** Collections directory page (`/collections`).
- **Key Modifications:**
  - Increased `max_collections` from `4` to `24`.
  - Maintained static block architecture for `collection-card-image` while enabling 24 categories.
- **Purpose:** Allowed all 15+ wholesale categories to display with images on the collection directory page.

---

## 3. Register of Newly Created Files

### Sections (`sections/`)
1. **`sections/wholesale-hero-banner.liquid`**: First-class native section rendering `homepage-hero-banner`.
2. **`sections/wholesale-trust-bar.liquid`**: First-class native section rendering `homepage-trust-bar`.
3. **`sections/wholesale-category-grid.liquid`**: First-class native section rendering `homepage-category-grid`.
4. **`sections/wholesale-customer-segments.liquid`**: First-class native section rendering `homepage-customer-segments`.
5. **`sections/wholesale-how-it-works.liquid`**: First-class native section rendering `homepage-how-it-works`.
6. **`sections/wholesale-brand-story.liquid`**: First-class native section rendering `homepage-brand-story`.
7. **`sections/wholesale-reviews.liquid`**: First-class native section rendering `homepage-reviews`.
8. **`sections/wholesale-social-banner.liquid`**: First-class native section rendering `homepage-wholesale-banner`.

### Snippets (`snippets/`)
1. **`snippets/whatsapp-floating-button.liquid`**: High-performance, accessible floating WhatsApp CTA button.
2. **`snippets/homepage-hero-banner.liquid`**: Hero banner with wholesale copy, stats counter, dual CTAs, and responsive styling.
3. **`snippets/homepage-trust-bar.liquid`**: 4-pillar trust indicator cards (Direct Importer, ₹2,000 MOQ, Express Delivery, GST Invoicing).
4. **`snippets/homepage-category-grid.liquid`**: 8-category visual grid linking to real store collections with dynamic product counters.
5. **`snippets/homepage-customer-segments.liquid`**: "Built for Your Business" 3-segment cards (Retailers, Resellers, Salons).
6. **`snippets/homepage-how-it-works.liquid`**: 4-step procurement process infographic (Browse, Meet MOQ, Checkout, Dispatch).
7. **`snippets/homepage-brand-story.liquid`**: Sourcing authority narrative, QC inspection, and Sadar Bazar wholesale pricing context.
8. **`snippets/homepage-reviews.liquid`**: Clean UTF-8 verified customer review cards with rating summary.
9. **`snippets/homepage-wholesale-banner.liquid`**: Dual social connect banner (Instagram + WhatsApp Catalog Support).
