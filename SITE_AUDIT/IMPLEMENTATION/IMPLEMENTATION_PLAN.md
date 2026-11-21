# Master Implementation & Remediation Plan

**Project:** Samyak Hair Accessories Wholesale Storefront  
**Theme:** Shopify Horizon 4.3.0  
**Reference Document:** \`SITE_AUDIT/WEBSITE_AUDIT_REPORT.md\`  
**Target Directory:** \`D:\\samyak_hair\`  

---

## 1. Master Sprint Structure

The remediation roadmap is broken into 4 sequential, isolated sprints with strict stop-and-wait approval gates between each sprint:

| Sprint | Focus Area | Issue IDs | Priority | Target Scope |
| :---: | :--- | :--- | :---: | :--- |
| **Sprint 1** | **Critical Revenue & Funnel Protections** | **BUG-CRIT-001**<br>**BUG-CRIT-002**<br>**BUG-CRIT-003** | **P0** | Mobile navigation restoration; PDP MOQ enforcement; Cart page MOQ enforcement. |
| **Sprint 2** | **Core Funnel, Navigation & Routes** | **BUG-HIGH-001**<br>**BUG-HIGH-002**<br>**BUG-HIGH-003**<br>**BUG-HIGH-004**<br>**BUG-HIGH-008** | **P1** | Dynamic Admin navigation; Wishlist template & grid; Sever competitor hotlinked images; Asymmetric bento grid math synchronization; Cart drawer SRA ID fix. |
| **Sprint 3** | **Catalog, Template Architecture & App Blocks** | **BUG-MED-001** through **BUG-MED-007** | **P2** | Collections directory images & limit; Blog article cards; Dynamic category-aware PDP specs; Theme Editor product & app blocks; Purge 50% border-radius; Postal zone delivery disclaimer; Header schema <= 40 settings. |
| **Sprint 4** | **Performance, Code Quality & Clean Diagnostics** | **BUG-HIGH-005**<br>**BUG-HIGH-006**<br>**BUG-HIGH-007**<br>**BUG-LOW-001**<br>**BUG-LOW-002**<br>**BUG-LOW-003** | **P1 / P3** | Remove card JSON bloat & fetch on demand; Event-driven wishlist sync; Self-host WOFF2 fonts & consolidate CSS; Liquid snippet doc params; Archive orphaned files; Informational templates. |

---

## 2. Sprint 1 Detailed Technical Specification (Phase 1 — P0 Critical Fixes)

### 2.1 BUG-CRIT-001: Restore Mobile Navigation
- **Objective:** Re-instate the native Horizon mobile drawer trigger into the global header for viewports < 1024px.
- **Affected Files:**
  - \`snippets/header-row.liquid\`
  - \`sections/header.liquid\`
  - \`blocks/_header-menu.liquid\`
  - \`assets/base.css\` / Header stylesheet
- **Implementation Strategy:**
  1. In \`sections/header.liquid\`, ensure the mobile drawer menu is properly captured:
     \`capture drawer_menu; content_for 'block', type: '_header-menu', id: 'header-menu', variant: 'mobile'; endcapture\`
  2. In \`snippets/header-row.liquid\`, in the left column (\`.samyak-hdr-col--left\`), add the mobile hamburger button trigger when \`row == 'top'\`.
  3. Wire the button with standard accessibility attributes (\`aria-label="Open menu"\`, \`aria-controls="menu-drawer"\`, \`aria-expanded="false"\`) and the theme drawer event trigger \`on:click="#menu-drawer/open"\`.
  4. Ensure \`<theme-drawer id="menu-drawer">\` exists and renders \`drawer_menu\` with all category navigation links, account links, and customer service contacts.
  5. Apply responsive CSS so the hamburger button is \`display: flex\` on screens <= 1024px and \`display: none\` on desktop (> 1024px).
  6. Ensure desktop search and navigation links continue functioning identically without regression.

---

### 2.2 BUG-CRIT-002: Enforce Wholesale MOQ on Product Detail Page (PDP)
- **Objective:** Eliminate the direct checkout bypass caused by the "BUY IT NOW" CTA on \`snippets/wholesale-pdp.liquid\`.
- **Affected Files:**
  - \`snippets/wholesale-pdp.liquid\`
- **Implementation Strategy:**
  1. Inspect the "BUY IT NOW" click handler \`initBuyNow()\` in \`snippets/wholesale-pdp.liquid\` (lines 1450–1464).
  2. Implement mathematical threshold validation:
     - Read the selected variant price and current quantity: \`totalOrderVal = currentVariantPrice * quantity\`.
     - Evaluate against Wholesale MOQ (₹2,000 = 200,000 cents).
     - **Branch A (Total >= ₹2,000):** If a bulk buyer is ordering a master carton or large volume satisfying the ₹2,000 threshold in a single line, allow direct checkout redirect to \`/cart/{variant_id}:{qty}?checkout\`.
     - **Branch B (Total < ₹2,000):** If the purchase value is under ₹2,000:
       - Intercept and prevent direct checkout navigation (\`e.preventDefault()\`).
       - Add the item to the cart via Shopify AJAX Cart API (\`/cart/add.js\`).
       - Slide open the native \`<theme-drawer id="cart-drawer">\`.
       - The cart drawer immediately displays the wholesale MOQ progress bar and warning ("Wholesale MOQ is ₹2,000. Add ₹X more to checkout"), and its checkout button is locked/disabled.
  3. Ensure "Add to Cart" and Quick Shop drawer actions follow this exact same safe workflow.
  4. Document the difference between theme-level enforcement and platform-level Shopify Functions for enterprise B2B.

---

### 2.3 BUG-CRIT-003: Enforce Wholesale MOQ on Dedicated Cart Page (\`/cart\`)
- **Objective:** Prevent buyers from bypassing the MOQ by clicking "VIEW CART" in the drawer and checking out on \`/cart\`.
- **Affected Files:**
  - \`sections/main-cart.liquid\`
  - \`snippets/cart-summary.liquid\`
- **Implementation Strategy:**
  1. In \`sections/main-cart.liquid\`, embed the exact wholesale MOQ progress bar component:
     - Minimum threshold: \`assign wholesale_min_threshold = 200000\` (₹2,000 in cents).
     - Compute: \`threshold_diff = wholesale_min_threshold | minus: cart.total_price\`.
     - Compute: \`progress_percent = cart.total_price | times: 100 | divided_by: wholesale_min_threshold\`.
     - Flag: \`is_wholesale_met = cart.total_price >= wholesale_min_threshold\`.
  2. Render the progress bar (\`role="progressbar"\`, \`aria-valuenow\`, status message, remaining balance).
  3. On the checkout submit button (\`#samyak-checkout-submit\`):
     - Add conditional Liquid attribute: \`{% if cart.empty? or cart.total_price < wholesale_min_threshold %}disabled aria-disabled="true"{% endif %}\`.
     - Style the disabled button state clearly (\`opacity: 0.45; cursor: not-allowed; pointer-events: none;\`).
  4. In client-side JavaScript (\`sections/main-cart.liquid\`):
     - Add an event interceptor on the checkout button and form submit: if \`rawCartTotal < 200000\`, block submission with \`e.preventDefault()\` and display an explicit error alert.
     - Ensure quantity changes and item removals immediately recalculate subtotal, progress bar width, remaining balance, and update button disabled state.
  5. Test direct URL manipulation and checkout attempts.

---

## 3. Strict Execution Control

Execution is strictly sequential:
1. **Sprint 1 Execution Only:** Only Phase 0 and Phase 1 tasks are executed in this turn.
2. **Comprehensive Verification:** Theme Check, Liquid syntax checks, and customer journey tests run after implementation.
3. **Sprint 1 Report:** Generate \`SITE_AUDIT/IMPLEMENTATION/SPRINT_1_REPORT.md\`.
4. **Mandatory Hold:** Cease all changes and wait for explicit user approval before proceeding to Sprint 2.
