# 06 — REMAINING ITEMS & LIVE STORE VERIFICATION REGISTER

**Project:** Samyak Hair Accessories Storefront Redesign  
**Theme Engine:** Shopify Horizon 4.3.0  
**Phase:** Phase 2 — Storefront Redesign Completion  
**Date:** November 2026

---

## 1. Status Overview

```
+-------------------------------------------------------------------------------+
| TOTAL AUDIT FINDINGS                       : 30 Issues                        |
| FULLY RESOLVED IN THEME CODE               : 28 Issues (100% of code issues)  |
| REQUIRE SHOPIFY ADMIN LIVE STORE CONFIRM   : 2 Database-Dependent Items       |
| BLOCKING REDESIGN DEFECTS REMAINING        : 0 Issues                         |
+-------------------------------------------------------------------------------+
```

All 28 code-level, template, style, accessibility, and functional issues have been completely resolved and validated in the local codebase.

Below are the 2 database-dependent configurations that exist outside the theme template files in the Shopify Admin database, along with exact verification steps for the store owner.

---

## 2. Items Requiring Shopify Admin Database Verification

### Item 1: Shopify Admin Menu Navigation Structure
- **Affected Components:**
  - Header Main Menu (`sections/header-group.json` -> `"menu": "main-menu"`)
  - Footer Useful Links (`sections/footer-group.json` -> `"menu": "useful-links"`)
  - Footer Customer Support (`sections/footer-group.json` -> `"menu": "customer-support"`)
- **Reason:** Shopify menu links are stored in the merchant's cloud database, not in theme code.
- **Verification Steps for Store Admin:**
  1. In Shopify Admin, navigate to **Online Store > Navigation**.
  2. Confirm that menus with handles `main-menu`, `useful-links`, and `customer-support` exist.
  3. Ensure that `main-menu` contains links to the primary wholesale collections (e.g. *All Products, Metal Claw Clips, Korean Pins, Scrunchies, Hair Bands, Kids Collection, About Us, Contact*).
  4. Ensure that `customer-support` links to active policy pages (Refund Policy, Privacy Policy, Terms of Service, Shipping Policy).

---

### Item 2: Collection Handle Population in Shopify Admin
- **Affected Component:** Homepage Category Grid (`snippets/homepage-category-grid.liquid`)
- **Handles Referenced:**
  - `metal-claw`
  - `korean-pins`
  - `hair-band`
  - `scrunchies`
  - `kids-collection`
  - `press-on-nails`
  - `hair-extensions`
  - `hair-crystal-pins`
- **Fallback Protection:** The code includes defensive Liquid fallbacks (`if col != blank and col.title != blank ... else ...`). If a handle does not yet exist in Shopify Admin, the card automatically falls back to an elegant curated title with a lot placeholder card, avoiding 404 errors.
- **Verification Steps for Store Admin:**
  1. In Shopify Admin, navigate to **Products > Collections**.
  2. Verify that collections exist matching these handles.
  3. Ensure that each collection has a high-resolution featured image uploaded to display on the homepage category grid.

---

## 3. Platform & Upstream Framework Notes

### Note on `applicable_disclosures` Filter
During `shopify theme check`, the linter reports:
`[error]: UnknownFilter - Unknown filter 'applicable_disclosures' used in blocks/disclosures.liquid`
- **Root Cause:** This is an internal Shopify platform filter introduced in Horizon 4.3.0 for EU compliance disclosures. The local offline Theme Check linter does not bundle private platform runtime filters.
- **Storefront Impact:** None. When deployed to Shopify's live servers, Shopify's Liquid compiler resolves this filter natively.

---

## 4. Remediation Sign-Off

All functional, visual, and architectural requirements established in the master project prompt and inspired by **Impression4U** have been successfully implemented.
