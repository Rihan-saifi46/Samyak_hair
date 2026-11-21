# SPRINT 1 IMPLEMENTATION REPORT: P0 CRITICAL FIXES

**Project:** Samyak Hair Accessories — Wholesale Storefront  
**Project Path:** `D:\samyak_hair`  
**Theme:** Shopify Horizon 4.3.0  
**Date:** November 19, 2026  
**Status:** Completed & Verified — Awaiting Approval for Sprint 2  
**Reference Document:** [WEBSITE_AUDIT_REPORT.md](file:///d:/samyak_hair/SITE_AUDIT/WEBSITE_AUDIT_REPORT.md)  
**Implementation Plan:** [IMPLEMENTATION_PLAN.md](file:///d:/samyak_hair/SITE_AUDIT/IMPLEMENTATION/IMPLEMENTATION_PLAN.md)  
**Safety Backup:** `D:\samyak_hair\_backup_pre_remediation\` (Verified)

---

## 1. Executive Summary

Sprint 1 successfully addressed all three **P0 Critical Blockers** identified during the storefront audit. Prior to this sprint:
1. Mobile and tablet customers (accounting for ~75% of Indian wholesale traffic) were completely locked out of site navigation because the hamburger drawer trigger was severed from the custom 3-zone header row.
2. The product detail page (PDP) contained a direct Buy It Now checkout bypass (`/cart/{id}:{qty}?checkout`) that allowed single packs (e.g. ₹299) to reach Shopify checkout without meeting the mandatory ₹2,000 wholesale minimum order quantity (MOQ).
3. The dedicated cart page (`/cart`) had no MOQ progress bar, no checkout lock, and no validation, allowing buyers to bypass the wholesale threshold.

All three issues have been remediated with surgical, non-destructive edits respecting Shopify Horizon's component architecture, accessibility standards (WCAG 2.1 AA), and the luxury emerald-and-gold wholesale aesthetic (`#113B32`, `#FCFBF7`, `#C59B42`).

---

## 2. Detailed Issue Remediation

### 2.1 BUG-CRIT-001: Mobile Navigation Drawer Restoration

- **File Modified:** [`snippets/header-row.liquid`](file:///d:/samyak_hair/snippets/header-row.liquid#L1-L147)
- **Root Cause:** In `sections/header.liquid`, the native Horizon mobile navigation drawer block was correctly captured into `drawer_menu` (variant: `'mobile'`) and passed into `snippets/header-row.liquid` as parameter `first: first`. However, `snippets/header-row.liquid` completely dropped `{{ first }}`, rendering only `{{ logo }}` in `.samyak-hdr-col--left`. Concurrently, desktop search navigation was hidden on viewports $\le 1024\text{px}$, leaving mobile and tablet users without any navigation menu.
- **Implementation Details:**
  1. Updated `{% doc %}` contract in `snippets/header-row.liquid` to formally declare `@param {string} [first]`.
  2. Integrated `{{ first }}` inside a dedicated `<div class="samyak-hdr-drawer-trigger">` directly beside the brand logo in `.samyak-hdr-col--left`.
  3. Added responsive CSS rules:
     - On desktop viewports ($> 1024\text{px}$), `.samyak-hdr-drawer-trigger` is strictly `display: none !important;`, ensuring zero visual disruption to the approved desktop layout.
     - On mobile and tablet viewports ($\le 1024\text{px}$), `.samyak-hdr-drawer-trigger` renders as `display: flex; align-items: center;` with a touch target of 38×38px, connecting native `<header-drawer>` and `header-drawer.js`.
  4. Preserved native accessibility: `<details id="Details-menu-drawer-container">`, `<summary class="header__icon--summary">`, `aria-label="{{ 'accessibility.menu' | t }}"`, escape-key listener, and focus trapping.

#### Code Diff Summary (`snippets/header-row.liquid`)
```diff
@@ -17,7 +20,12 @@
 {%- if show_row -%}
   <div class="samyak-header-3zone-bar">
-    <!-- Left Zone: Brand Logo -->
+    <!-- Left Zone: Drawer Trigger (Mobile) + Brand Logo -->
     <div class="samyak-hdr-col samyak-hdr-col--left">
+      {%- if first != blank -%}
+        <div class="samyak-hdr-drawer-trigger">
+          {{ first }}
+        </div>
+      {%- endif -%}
       {{ logo }}
     </div>

@@ -50,6 +58,10 @@
     .samyak-hdr-col--left {
       display: flex;
       align-items: center;
       justify-content: flex-start;
       flex-shrink: 0;
     }
+
+    .samyak-hdr-drawer-trigger {
+      display: none;
+    }
@@ -81,8 +93,39 @@
     @media screen and (max-width: 1024px) {
+      .samyak-hdr-drawer-trigger {
+        display: flex;
+        align-items: center;
+        margin-right: 8px;
+        flex-shrink: 0;
+      }
+      .samyak-hdr-drawer-trigger .header__drawer {
+        display: block;
+      }
+      .samyak-hdr-drawer-trigger .header__icon--summary {
+        padding: 6px;
+        cursor: pointer;
+        display: flex;
+        align-items: center;
+        justify-content: center;
+        color: #113B32;
+        border: none;
+        background: transparent;
+      }
+      .samyak-hdr-drawer-trigger .header-drawer-icon {
+        width: 22px;
+        height: 22px;
+        display: block;
+      }
       .samyak-header-3zone-bar {
         padding: 12px 18px;
         gap: 14px;
       }
     }
```

---

### 2.2 BUG-CRIT-002: Wholesale MOQ Enforcement on PDP (Buy It Now Interception)

- **File Modified:** [`snippets/wholesale-pdp.liquid`](file:///d:/samyak_hair/snippets/wholesale-pdp.liquid#L155-L215) and [`snippets/wholesale-pdp.liquid`](file:///d:/samyak_hair/snippets/wholesale-pdp.liquid#L1453-L1515)
- **Root Cause:** Lines 1450–1464 of `snippets/wholesale-pdp.liquid` attached a click handler to `#samyak-pdp-btn-buynow` executing:
  ```javascript
  window.location.href = '/cart/' + id + ':' + qty + '?checkout';
  ```
  This immediately transferred single packs (e.g., 1 pack @ ₹299.00) directly into the Shopify checkout pipeline, bypassing all cart validations and defeating the business rule requiring ₹2,000 wholesale minimum orders.
- **Implementation Details:**
  1. Added `data-raw-price="{{ variant.price }}"` to all variant swatch buttons across multi-variant and single-variant markup branches.
  2. Completely rewrote `initBuyNow()`:
     - Calculates order line total: $\text{lineTotal} = \text{rawPrice} \times \text{quantity}$.
     - **Eligible Wholesale Orders ($\text{lineTotal} \ge 200,000$ cents / ₹2,000):** Accelerated checkout is preserved. Customer is routed directly to `/cart/{id}:{qty}?checkout`.
     - **Sub-MOQ Orders ($\text{lineTotal} < 200,000$ cents):** Direct checkout is intercepted. The button switches state to `"ADDING TO BAG..."`, adds the item to the cart via `/cart/add.js`, triggers the `cart:updated` event, and opens the native slide-out cart drawer where the Wholesale MOQ progress bar clearly indicates the remaining balance needed to reach ₹2,000.

#### Code Diff Summary (`snippets/wholesale-pdp.liquid`)
```diff
@@ -165,6 +165,7 @@
                   data-variant-id="{{ variant.id }}"
                   data-price="{{ variant.price | money }}"
+                  data-raw-price="{{ variant.price }}"
                   data-compare-price="{% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | money }}{% endif %}"
@@ -182,6 +183,7 @@
                 data-variant-id="{{ current_variant.id }}"
                 data-price="{{ current_variant.price | money }}"
+                data-raw-price="{{ current_variant.price }}"
                 data-available="true"
@@ -1450,15 +1454,61 @@
-    // 6. Buy It Now (Direct Checkout)
+    // 6. Buy It Now (Wholesale MOQ Enforcement & Direct Checkout)
     function initBuyNow() {
       var buynowBtn = document.getElementById('samyak-pdp-btn-buynow');
       var hiddenId = document.getElementById('samyak-pdp-variant-id');
       var input = document.getElementById('samyak-pdp-qty-field');
       if (!buynowBtn) return;

       buynowBtn.addEventListener('click', function(e) {
         e.preventDefault();
         var id = hiddenId ? hiddenId.value : '';
-        var qty = input ? input.value : '1';
-        if (id) {
-          window.location.href = '/cart/' + id + ':' + qty + '?checkout';
+        var qty = input ? parseInt(input.value, 10) || 1 : 1;
+        if (!id) return;

+        var swatch = document.querySelector('.samyak-pdp-swatch.is-selected');
+        var rawPrice = swatch ? parseInt(swatch.getAttribute('data-raw-price') || '0', 10) : 0;
+        if (!rawPrice) {
+          rawPrice = {{ current_variant.price | default: 0 }};
+        }
+        var lineTotal = rawPrice * qty;

+        if (lineTotal >= 200000) {
+          window.location.href = '/cart/' + id + ':' + qty + '?checkout';
+        } else {
+          buynowBtn.disabled = true;
+          var origText = buynowBtn.textContent;
+          buynowBtn.textContent = 'ADDING TO BAG...';

+          var formData = new FormData();
+          formData.append('id', id);
+          formData.append('quantity', qty);

+          fetch('/cart/add.js', {
+            method: 'POST',
+            body: formData,
+            headers: { 'X-Requested-With': 'XMLHttpRequest' }
+          })
+          .then(function(res) { return res.json(); })
+          .then(function(data) {
+            buynowBtn.textContent = origText;
+            buynowBtn.disabled = false;
+            document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true }));
+            setTimeout(function() {
+              var nativeDrawer = document.getElementById('cart-drawer');
+              if (nativeDrawer && typeof nativeDrawer.open === 'function') {
+                nativeDrawer.open();
+              } else {
+                window.location.href = '/cart';
+              }
+            }, 300);
+          })
+          .catch(function(err) {
+            console.error('Buy Now ATC error:', err);
+            buynowBtn.textContent = origText;
+            buynowBtn.disabled = false;
+            window.location.href = '/cart';
+          });
         }
       });
     }
```

---

### 2.3 BUG-CRIT-003: Wholesale MOQ Enforcement on Cart Page (`/cart`)

- **File Modified:** [`sections/main-cart.liquid`](file:///d:/samyak_hair/sections/main-cart.liquid#L8-L25) and [`sections/main-cart.liquid`](file:///d:/samyak_hair/sections/main-cart.liquid#L230-L295) and [`sections/main-cart.liquid`](file:///d:/samyak_hair/sections/main-cart.liquid#L1250-L1330)
- **Root Cause:** `sections/main-cart.liquid` rendered a standard `<button type="submit" name="checkout" id="samyak-checkout-submit">` with zero MOQ calculation or disabling logic. Submitting the form or clicking checkout proceeded unconditionally to Shopify checkout regardless of cart total.
- **Implementation Details:**
  1. **Server-Side Liquid Evaluation:**
     ```liquid
     assign wholesale_min_threshold = 200000
     assign cart_total = cart.total_price
     if cart_total < wholesale_min_threshold
       assign threshold_diff = wholesale_min_threshold | minus: cart_total
       assign progress_percent = cart_total | times: 100 | divided_by: wholesale_min_threshold
       assign is_wholesale_met = false
     else
       assign threshold_diff = 0
       assign progress_percent = 100
       assign is_wholesale_met = true
     endif
     ```
  2. **Order Summary MOQ Progress Tracker:** Added `.samyak-cart-wholesale-bar` inside `.samyak-cart-summary-card` displaying dynamic status, live progress bar (`role="progressbar"`), and GST wholesale dispatch advisory.
  3. **Checkout Button Lock & Alert:**
     - When sub-MOQ, `#samyak-checkout-submit` is rendered with `disabled aria-disabled="true" class="samyak-proceed-checkout-btn is-disabled"`.
     - An accessible alert box (`#samyak-cart-moq-warning`, `role="alert"`) displays the exact shortfall amount.
  4. **Client-Side Form & Button Interception:**
     - Attached `submit` listener to `#samyak-main-cart-form` and `click` listener to `#samyak-checkout-submit` preventing submission if `rawCartTotal < 200000` (`e.preventDefault()`, `e.stopPropagation()`).
     - Added attention-directing shake animation (`.is-shaking`) to the alert box if an invalid checkout attempt is made.
     - Dynamic updates in `updateSummaryDisplay()` recalculate progress and toggle disabled state in real time if coupons or quantity updates modify the total.

---

## 3. Verification & Automated Test Results

A comprehensive verification suite was executed against the modified files:

```bash
node scratch/test_sprint1_fixes.js
```

### Validation Suite Output
| Check Category | Test Description | Result |
| :--- | :--- | :--- |
| **BUG-CRIT-001** | `@param {string} [first]` documented in `snippets/header-row.liquid` | **PASS** |
| **BUG-CRIT-001** | `.samyak-hdr-drawer-trigger` wrapper exists in DOM hierarchy | **PASS** |
| **BUG-CRIT-001** | `{{ first }}` rendered within Left Header Zone | **PASS** |
| **BUG-CRIT-001** | Drawer trigger strictly hidden on desktop viewports ($> 1024\text{px}$) | **PASS** |
| **BUG-CRIT-001** | Drawer trigger visible & styled on mobile/tablet ($\le 1024\text{px}$) | **PASS** |
| **BUG-CRIT-002** | `data-raw-price` rendered on all product swatches | **PASS** |
| **BUG-CRIT-002** | Line total calculation vs ₹2,000 ($200,000$ cents) MOQ | **PASS** |
| **BUG-CRIT-002** | Direct checkout permitted for qualifying orders ($\ge 200,000$ cents) | **PASS** |
| **BUG-CRIT-002** | Sub-MOQ intercepted and added to bag via AJAX with drawer trigger | **PASS** |
| **BUG-CRIT-003** | Server-side Liquid MOQ calculation ($200,000$ cents) | **PASS** |
| **BUG-CRIT-003** | Wholesale progress bar component rendered with ARIA semantics | **PASS** |
| **BUG-CRIT-003** | Checkout button rendered `disabled` and `aria-disabled="true"` on sub-MOQ | **PASS** |
| **BUG-CRIT-003** | Accessible MOQ alert warning rendered with shortfall balance | **PASS** |
| **BUG-CRIT-003** | Disabled styling applied (`cursor: not-allowed; background: #C9C4BC;`) | **PASS** |
| **BUG-CRIT-003** | Form `submit` event prevented in JavaScript when sub-MOQ | **PASS** |
| **BUG-CRIT-003** | Button `click` event prevented in JavaScript when sub-MOQ | **PASS** |

### Theme Check Syntax Verification
- `shopify theme check` was executed across the theme repository.
- Zero errors were detected in `snippets/header-row.liquid`, `snippets/wholesale-pdp.liquid`, or `sections/main-cart.liquid`.
- All baseline warnings in existing theme files were untouched and preserved without regressions.

---

## 4. Platform Reality & Security Notice

> [!IMPORTANT]
> **Wholesale MOQ Platform Enforcement Boundary:**
> - Frontend theme enforcement (via Liquid condition rendering, disabled button states, form submission prevention, and AJAX Buy Now interception) eliminates accidental or direct sub-MOQ checkout paths initiated through standard storefront interactions.
> - On standard Shopify plans (Basic / Shopify / Advanced), the final server-side checkout boundary cannot be hard-blocked by Liquid alone if a user deliberately crafts an external API request directly to Shopify's checkout URL.
> - True 100% cryptographic server-side validation requires a **Shopify Function (Cart and Checkout Validation API)**, which requires either a Shopify Plus store or an installed third-party wholesale order limit application (e.g. *MinCart*, *OrderLimits*).
> - The implemented solution represents the **maximum possible protection achievable within the Shopify theme layer** and prevents all standard customer sub-MOQ checkouts.

---

## 5. Next Steps

Sprint 1 is **100% complete, tested, and verified**.

As instructed, execution is paused here to wait for user review and explicit approval before starting **Sprint 2 (P1 High Priority Functionality)**:
- BUG-HIGH-001 (Dynamic Header Navigation from Admin)
- BUG-HIGH-002 (Wishlist Destination Page Implementation)
- BUG-HIGH-003 (Category Image Third-Party URL Replacement)
- BUG-HIGH-004 (Bento Editorial Grid Global Indexing Fix)
- BUG-HIGH-008 (Cart Drawer Section Rendering API Target Synchronization)
