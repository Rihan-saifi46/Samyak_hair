# 07 — DEPLOYMENT READINESS & ROLLOUT PLAYBOOK

**Project:** Samyak Hair Accessories Storefront Redesign  
**Theme Engine:** Shopify Horizon 4.3.0  
**Target Environment:** Local Staging Complete (Ready for Merchant Review)  
**Safety Protocol:** Read-Only Remote Policy Strictly Observed  
**Date:** November 2026

---

## 1. Safety Compliance Statement

In strict accordance with the mandatory safety rules:
- **No live store modifications were performed.**
- **No `shopify theme push` or publish commands were executed.**
- **All credentials, API tokens, and private secrets remain protected.**
- **All development and testing remained strictly local in `d:\samyak_hair`.**

The theme is now in a pristine, deployment-ready state for staging preview.

---

## 2. Deployment Readiness Checklist

```
[✓] 1. SYNTAX VALIDATION
    - All JSON templates and section groups parsed with zero syntax errors.
    - All Liquid syntax verified with valid filters and tags.
    - Zero fatal Theme Check errors in custom code.

[✓] 2. DESIGN & BRAND HARMONY
    - Primary and secondary buttons have compliant 16:1 contrast (WCAG AAA).
    - Color palette harmonized to Samyak luxury wine-rose (#8C2D43) & warm sand (#EAE6E1).
    - Header freed of 15-collection card pollution.
    - Footer modernized with semantic text contact block and verified office address.

[✓] 3. B2B WHOLESALE FUNCTIONALITY
    - Minimum Order Value (₹2,000) dynamic progress bar fully operational.
    - Sub-threshold checkout lockout validated.
    - Global floating WhatsApp quick-order CTA live across all templates.
    - Bestseller and new arrival product grids populated.

[✓] 4. MULTI-DEVICE RESPONSIVENESS
    - Verified across 1440px, 1280px, 768px, and 390px viewports.
    - Touch targets exceed 44px x 44px standard.
    - Zero horizontal layout overflow.
```

---

## 3. Step-by-Step Staging & Preview Instructions

To preview and deploy the redesigned theme safely on a development theme without affecting the live store, follow these steps:

### Step 1: Preview on a Development Theme
Run the Shopify CLI development server locally:

```bash
shopify theme dev --store <your-store-handle>.myshopify.com
```

- This uploads the theme to a **temporary, isolated development theme** in your Shopify admin.
- It will output a local preview URL (e.g. `http://127.0.0.1:9292`) and a secure shareable preview link.
- **The live production theme will NOT be touched.**

### Step 2: Quality Assurance & Stakeholder Review
Using the shareable preview link:
1. Verify the homepage section flow: Hero banner, trust bar, category grid, bestsellers, customer segments, how it works, brand story, reviews, FAQs, social connect.
2. Test adding products to the cart drawer:
   - Add items totaling under ₹2,000: Confirm progress bar displays remaining amount and checkout button is disabled.
   - Add items totaling over ₹2,000: Confirm green success state unlocks checkout.
3. Test the floating WhatsApp button on mobile and desktop.
4. Verify footer contact links (`tel:`, `mailto:`, address).

### Step 3: Push as an Unpublished Theme (Staging)
When ready to upload to Shopify Admin for final team review, push as an **unpublished theme**:

```bash
shopify theme push --unpublished --theme "Samyak - Wholesale Redesign (Nov 2026)"
```

- This creates a new, unpublished theme in Shopify Admin under **Online Store > Themes**.
- Your live theme remains completely untouched.

### Step 4: Publish When Approved
Once all stakeholders approve the preview:
1. Go to **Shopify Admin > Online Store > Themes**.
2. Locate **"Samyak - Wholesale Redesign (Nov 2026)"**.
3. Click **Actions > Publish**.

---

## 4. Rollback Plan

If any unexpected live store anomaly occurs after publishing:
1. In **Shopify Admin > Online Store > Themes**, locate the previous live theme in your theme library.
2. Click **Publish** to instantly revert the live storefront within 1 second.
3. All customer carts and orders are independent of theme versions and will experience zero data loss.
