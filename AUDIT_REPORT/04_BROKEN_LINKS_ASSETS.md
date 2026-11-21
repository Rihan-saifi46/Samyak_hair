# Broken Links, Missing Assets & Suspicious References
**Target Storefront:** Samyak Hair Accessories  
**Theme:** Horizon (Shopify OS 2.0, Version 4.3.0)  
**Audit Scope:** Navigation Targets, External Links, Social Profiles, Asset Pointers, and Collection Routes  

---

## 1. Link & Asset Classification Overview

All identified links, resource references, and asset dependencies across the theme have been audited and classified into three verification tiers:

| Status Tier | Count | Description |
| :--- | :---: | :--- |
| **Confirmed Broken** | **3** | Links or asset references that fail directly at code/configuration level |
| **Suspicious** | **7** | Generic placeholders, brand mismatches, or dead-end external destinations |
| **Requires Live Verification** | **5** | Shopify Admin database-dependent links (menus, collection handles, policies) |

---

## 2. Master Link & Asset Register

| Reference Target | Location in Code | Classification | Severity | Finding & Risk Description |
| :--- | :--- | :---: | :---: | :--- |
| **Footer Facebook Link** | `sections/footer-group.json:250` | **Suspicious** | **P1** | Links to `https://www.facebook.com/` (generic homepage, not store profile). |
| **Footer Instagram Link** | `sections/footer-group.json:251` | **Suspicious** | **P1** | Links to `https://www.instagram.com/` (generic homepage). |
| **Footer YouTube Link** | `sections/footer-group.json:252` | **Suspicious** | **P1** | Links to `https://www.youtube.com/` (generic homepage). |
| **Footer TikTok Link** | `sections/footer-group.json:253` | **Suspicious / Broken** | **P1** | Links to `https://www.tiktok.com/` (banned & blocked in India). |
| **Footer X (Twitter) Link** | `sections/footer-group.json:254` | **Suspicious** | **P1** | Links to `https://x.com/` (generic homepage). |
| **Homepage Instagram Banner** | `templates/index.json:928` | **Suspicious** | **P1** | Links to `@parulcreationswholesaleofficial` (conflicting business identity). |
| **Homepage "View All" Button** | `templates/index.json:65` | **Confirmed Broken** | **P1** | Empty collection handle prevents button from rendering any URL. |
| **Footer Brand Logo Link** | `sections/footer-group.json:33` | **Confirmed Broken** | **P2** | `image_D9Urzz` has `"link": ""` (unlinked image logo). |
| **Footer Contact Card Link** | `sections/footer-group.json:99` | **Confirmed Broken** | **P2** | `image_AQXcat` has `"link": ""` (unlinked contact card image). |
| **Collection Handle: `anit-tarnish`** | `sections/header-group.json:240` | **Suspicious** | **P2** | Typo in handle: `anit-tarnish-jewellery` vs expected `anti-tarnish-jewellery`. |
| **Collection Handle: `festives-offer`**| `sections/header-group.json:265` | **Suspicious** | **P2** | Potential typo: `festives-offer` vs `festive-offer` or `festive-offers`. |
| **Main Menu Navigation** | `sections/header-group.json:40` | **Live Verification** | **P1** | Relies on Shopify Admin menu handle `"main-menu"`. |
| **Useful Links Menu** | `sections/footer-group.json:45` | **Live Verification** | **P2** | Relies on Shopify Admin menu handle `"useful-links"`. |
| **Customer Support Menu** | `sections/footer-group.json:65` | **Live Verification** | **P2** | Relies on Shopify Admin menu handle `"customer-support"`. |
| **Customer Account Menu** | `sections/header-group.json:60` | **Live Verification** | **P2** | Relies on Shopify Admin menu handle `"customer-account-main-menu"`. |

---

## 3. Detailed Findings & Issue Records

---

### Issue ID: `SEC-NAV-001`
- **Issue Title:** Footer Social Media Icons Point to Generic Platform Homepages
- **Priority:** **P1 — High**
- **Category:** Broken Links & Navigation
- **Affected Component:** Footer Utilities Social Links (`social_links_Ew63Kq`)
- **Exact File References:**
  - `sections/footer-group.json` (lines 248-260)
  - `blocks/social-links.liquid` (lines 35-90)
- **Status:** **Suspicious / Unconfigured Placeholders**
- **Description:**  
  In `sections/footer-group.json`, the active `social-links` block defines social media URLs as the top-level homepages of the respective social networks:
  ```json
  "social_links_Ew63Kq": {
    "type": "social-links",
    "settings": {
      "icon_color": "",
      "facebook_url": "https://www.facebook.com/",
      "instagram_url": "https://www.instagram.com/",
      "youtube_url": "https://www.youtube.com/",
      "tiktok_url": "https://www.tiktok.com/",
      "twitter_url": "https://x.com/"
    }
  }
  ```
  When buyers click these icons in the footer expecting to view Samyak Hair Accessories' official pages, portfolio, customer reviews, or wholesale unpacking videos, they are redirected to generic platform login pages or random user feeds.
- **Potential Impact:**  
  Traffic leakage and customer distraction. Buyers leave the purchase funnel and enter external social networks without landing on the merchant's content.
- **Recommended Solution:**  
  Update each URL setting in `sections/footer-group.json` with Samyak Hair Accessories' verified profile URLs (e.g. `https://instagram.com/samyakhairaccessories`), or clear the URL string (`""`) for any channel the brand does not actively maintain (which automatically hides the icon).
- **Testing Required:**  
  Click each rendered social icon in the footer and confirm it directs to the official brand channel in a new tab.

---

### Issue ID: `SEC-NAV-002`
- **Issue Title:** Banned Social Platform (TikTok) Active in Footer for Indian Market
- **Priority:** **P1 — High**
- **Category:** Navigation / Compliance & Usability
- **Affected Component:** Footer Social Icons (`social_links_Ew63Kq`)
- **Exact File References:**
  - `sections/footer-group.json` (line 253)
- **Status:** **Confirmed Usability Failure in Target Geo**
- **Description:**  
  `tiktok_url` is configured with `https://www.tiktok.com/`. The store is clearly an Indian wholesale entity ("WHOLESALE ONLY | Minimum Order ₹2000 | All India Delivery"). TikTok is officially banned and ISP-blocked across India under Section 69A of the Information Technology Act.  
  Any domestic Indian buyer clicking the TikTok icon will be met with a browser network connection failure ("This site can’t be reached" or ISP blocking notice).
- **Potential Impact:**  
  Produces broken user experiences for 100% of domestic Indian visitors.
- **Recommended Solution:**  
  Clear the `tiktok_url` field (`"tiktok_url": ""`) in `sections/footer-group.json` to prevent the TikTok SVG from rendering.
- **Testing Required:**  
  Confirm TikTok icon no longer appears in the footer utilities bar.

---

### Issue ID: `SEC-NAV-003`
- **Issue Title:** Unlinked Brand Logo and Contact Card Graphics in Footer
- **Priority:** **P2 — Medium**
- **Category:** Broken Links / Usability
- **Affected Components:** Footer Section (`image_D9Urzz`, `image_AQXcat`)
- **Exact File References:**
  - `sections/footer-group.json` (lines 33, 99)
- **Status:** **Confirmed Design Omission**
- **Description:**  
  In `sections/footer-group.json`:
  1. `image_D9Urzz` (`Samyak_Wholesale_Hair_Accessories.png`) has `"link": ""`. Unlike standard e-commerce patterns where clicking the footer logo returns the user to the homepage (`/`), this image is static and unclickable.
  2. `image_AQXcat` (`Pink_Contact_Card_with_Contact_Details.png`) has `"link": ""`. A graphic explicitly titled "Contact Details" cannot be clicked to open the contact page (`/pages/contact`) or trigger direct communication.
- **Potential Impact:**  
  Frustrated user interactions when attempting to tap the logo to return home or tap the contact card to get in touch.
- **Recommended Solution:**  
  Set `link` on `image_D9Urzz` to `"/"` (or `routes.root_url`), and link `image_AQXcat` to `/pages/contact` (or replace with text as outlined in `SEC-UI-003`).
- **Testing Required:**  
  Click footer logo on desktop and mobile; verify return to homepage.

---

### Issue ID: `SEC-NAV-004`
- **Issue Title:** Potential Typographical Errors in Collection Handles
- **Priority:** **P2 — Medium**
- **Category:** Broken Links / URL Integrity
- **Affected Component:** Header Collection Grid (`ai_gen_block_68e7006`)
- **Exact File References:**
  - `sections/header-group.json` (lines 240, 265)
- **Status:** **Suspicious / Requires Live Verification**
- **Description:**  
  In `sections/header-group.json`, the collection list references two collection handles that contain likely spelling errors:
  1. `"anit-tarnish-jewellery"` (transposition error: "anit" instead of "anti").
  2. `"festives-offer"` (pluralization error: "festives" instead of "festive-offers" or "festive-offer").  
  If these collections were created in Shopify Admin with the corrected English spellings (`anti-tarnish-jewellery`, `festive-offers`), the rendered collection card link (`/collections/anit-tarnish-jewellery`) will resolve to a **404 Not Found** error or return an empty collection view.
- **Potential Impact:**  
  Broken collection links directly on the homepage and header.
- **Recommended Solution:**  
  Verify the exact collection URLs in Shopify Admin under Products > Collections. Update the handles in `sections/header-group.json` to match the active admin handles exactly.
- **Testing Required:**  
  Click both collection cards in the storefront; confirm they resolve with HTTP 200 to populated collection listings.

---

## 4. Asset Integrity & Orphaned Asset Register

A complete file audit of `assets/` was performed by comparing disk files against theme references:

| Asset Name | Type | Size | Status | Audit Assessment |
| :--- | :---: | :---: | :---: | :--- |
| `icon-account.svg` | SVG | 430 B | **Orphaned** | Never referenced. Horizon uses `icon-customer-account` or inline SVG. |
| `icon-double-chevron.svg` | SVG | 215 B | **Orphaned** | Never referenced across any Liquid, JS, or CSS file. |
| `icon-orders.svg` | SVG | 670 B | **Orphaned** | Never referenced across the theme. |
| `package.json` | JSON | 23 B | **Non-Store Asset** | Development artifact containing `{ "type": "module" }` in assets folder. |
| `jsconfig.json` | JSON | 345 B | **Non-Store Asset** | IDE TypeScript/JS path configuration file accidentally placed in assets. |
| `global.d.ts` | TS Def | 3.9 KB | **Non-Store Asset** | TypeScript global declarations; should reside in source repo, not storefront assets. |
| `standard-actions.d.ts` | TS Def | 5.2 KB | **Non-Store Asset** | TypeScript definitions; non-executable storefront file. |
| `standard-events.d.ts` | TS Def | 14.8 KB | **Non-Store Asset** | TypeScript definitions; non-executable storefront file. |
| `view-event-elements.d.ts` | TS Def | 4.1 KB | **Non-Store Asset** | TypeScript definitions; non-executable storefront file. |

All other 78 script, stylesheet, and icon assets in `assets/` were confirmed to have valid referencing declarations.
