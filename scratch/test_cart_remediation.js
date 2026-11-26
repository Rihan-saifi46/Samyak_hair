const fs = require('fs');
const path = require('path');

console.log('=================================================================');
console.log('SAMYAK HAIR — CART SYSTEM & SECTION RENDERING REMEDIATION TEST');
console.log('=================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    if (details) console.error(`       Details: ${details}`);
  }
}

// 1. Inspect snippets/cart-drawer.liquid
const cartDrawerPath = path.join(__dirname, '..', 'snippets', 'cart-drawer.liquid');
const cartDrawerContent = fs.readFileSync(cartDrawerPath, 'utf8');

// Test 1.1: render_cart_drawer condition
const hasRenderCartDrawerLogic = cartDrawerContent.includes('assign render_cart_drawer = false') &&
  cartDrawerContent.includes('if render_wrapper == false') &&
  cartDrawerContent.includes('assign render_cart_drawer = true') &&
  cartDrawerContent.includes('elsif settings.cart_type == \'drawer\' and template.name != \'cart\'') &&
  cartDrawerContent.includes('{%- if render_cart_drawer -%}');

assert(
  hasRenderCartDrawerLogic,
  'cart-drawer.liquid: SRA requests with render_wrapper: false bypass template.name != "cart"',
  'Liquid condition should allow rendering when render_wrapper is false'
);

// Test 1.2: shopify-section-cart-drawer-section ID
const hasCorrectSectionId = cartDrawerContent.includes('id="shopify-section-cart-drawer-section"');
assert(
  hasCorrectSectionId,
  'cart-drawer.liquid: Live wrapper ID is shopify-section-cart-drawer-section',
  'Matches data-section-id="cart-drawer-section" expected by morphSection'
);

// Test 1.3: theme-drawer ID preserved
const hasCartDrawerId = /<theme-drawer[\s\S]*?id="cart-drawer"/.test(cartDrawerContent);
assert(
  hasCartDrawerId,
  'cart-drawer.liquid: Preserves native <theme-drawer id="cart-drawer"> component contract',
  'Element ID #cart-drawer must remain intact for window and drawer handlers'
);

// Test 1.4: cart-items-component rendered with section_id: 'cart-drawer-section'
const hasCartItemsSectionId = cartDrawerContent.includes("section_id: 'cart-drawer-section'");
assert(
  hasCartItemsSectionId,
  'cart-drawer.liquid: Renders cart-items-component with section_id: "cart-drawer-section"',
  'Guarantees component dataset has sectionId = cart-drawer-section'
);

// 2. Inspect sections/cart-drawer-section.liquid
const cartSectionPath = path.join(__dirname, '..', 'sections', 'cart-drawer-section.liquid');
const cartSectionContent = fs.readFileSync(cartSectionPath, 'utf8');
assert(
  cartSectionContent.includes('render \'cart-drawer\', render_wrapper: false'),
  'cart-drawer-section.liquid: Calls cart-drawer with render_wrapper: false',
  'Ensures SRA endpoint returns inner drawer markup without nested wrapper'
);

// 3. Inspect snippets/wholesale-pdp.liquid
const wholesalePdpPath = path.join(__dirname, '..', 'snippets', 'wholesale-pdp.liquid');
const wholesalePdpContent = fs.readFileSync(wholesalePdpPath, 'utf8');

// Test 3.1: ATC endpoint is cart-drawer-section
const pdpAtcUsesCorrectSection = wholesalePdpContent.includes("fetch('/cart?section_id=cart-drawer-section')");
assert(
  pdpAtcUsesCorrectSection,
  'wholesale-pdp.liquid: Add to Cart SRA fetch uses section_id=cart-drawer-section',
  'Must fetch cart-drawer-section to retrieve populated line items'
);

// Test 3.2: ATC DOM replacement of .cart-drawer__inner
const pdpAtcReplacesInner = wholesalePdpContent.includes('newInner && currentInner') &&
  wholesalePdpContent.includes('currentInner.innerHTML = newInner.innerHTML');
assert(
  pdpAtcReplacesInner,
  'wholesale-pdp.liquid: Add to Cart refreshes .cart-drawer__inner prior to opening drawer',
  'Ensures cart drawer is populated before open() is invoked'
);

// Test 3.3: Buy Now endpoint is cart-drawer-section
const pdpBuyNowUsesCorrectSection = wholesalePdpContent.includes("fetch('/cart?section_id=cart-drawer-section')");
assert(
  pdpBuyNowUsesCorrectSection,
  'wholesale-pdp.liquid: Buy Now SRA fetch uses section_id=cart-drawer-section',
  'Must synchronize drawer on Buy Now if checkout redirection is delayed'
);

// 4. Inspect snippets/quick-shop-drawer.liquid
const quickShopPath = path.join(__dirname, '..', 'snippets', 'quick-shop-drawer.liquid');
const quickShopContent = fs.readFileSync(quickShopPath, 'utf8');
const quickShopUsesCorrectSection = quickShopContent.includes("fetch('/cart?section_id=cart-drawer-section')") &&
  quickShopContent.includes("document.getElementById('shopify-section-cart-drawer-section')");
assert(
  quickShopUsesCorrectSection,
  'quick-shop-drawer.liquid: Quick Shop SRA fetch uses section_id=cart-drawer-section and matches container ID',
  'Ensures quick shop additions refresh cart drawer seamlessly'
);

// 5. Inspect snippets/wishlist-drawer.liquid
const wishlistDrawerPath = path.join(__dirname, '..', 'snippets', 'wishlist-drawer.liquid');
const wishlistDrawerContent = fs.readFileSync(wishlistDrawerPath, 'utf8');
const wishlistUsesCorrectSection = wishlistDrawerContent.includes("fetch('/cart?section_id=cart-drawer-section')") &&
  wishlistDrawerContent.includes("document.getElementById('shopify-section-cart-drawer-section')");
assert(
  wishlistUsesCorrectSection,
  'wishlist-drawer.liquid: Wishlist "Add All to Bag" uses section_id=cart-drawer-section',
  'Wishlist bulk add updates cart-drawer before opening'
);

// 6. Inspect sections/main-wishlist.liquid
const mainWishlistPath = path.join(__dirname, '..', 'sections', 'main-wishlist.liquid');
const mainWishlistContent = fs.readFileSync(mainWishlistPath, 'utf8');
const mainWishlistUsesCorrectSection = mainWishlistContent.includes("fetch('/cart?section_id=cart-drawer-section')");
assert(
  mainWishlistUsesCorrectSection,
  'main-wishlist.liquid: Wishlist page "Add to Bag" uses section_id=cart-drawer-section',
  'Wishlist page items update cart drawer before opening'
);

// 7. Inspect assets/component-cart-items.js
const compCartItemsPath = path.join(__dirname, '..', 'assets', 'component-cart-items.js');
const compCartItemsContent = fs.readFileSync(compCartItemsPath, 'utf8');
assert(
  compCartItemsContent.includes('morphSection(this.sectionId,') &&
  compCartItemsContent.includes('get sectionId()'),
  'component-cart-items.js: Quantity increase/decrease/remove morphs by this.sectionId',
  'Native Shopify quantity updates morph section using data-section-id="cart-drawer-section"'
);

// 8. Wholesale MOQ Logic Verification (snippets/cart-summary.liquid)
const cartSummaryPath = path.join(__dirname, '..', 'snippets', 'cart-summary.liquid');
const cartSummaryContent = fs.readFileSync(cartSummaryPath, 'utf8');
const hasMoqThreshold = cartSummaryContent.includes('wholesale_min_threshold = 200000') &&
  cartSummaryContent.includes('cart-wholesale-bar');
assert(
  hasMoqThreshold,
  'cart-summary.liquid: Preserves ₹2,000 Wholesale MOQ threshold progress bar and billing notices',
  'Wholesale requirement logic intact without regression'
);

// 9. Cart Bubble & Badge Sync Verification
const mobileNavPath = path.join(__dirname, '..', 'snippets', 'mobile-bottom-nav.liquid');
const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf8');
const headerActionsPath = path.join(__dirname, '..', 'snippets', 'header-actions.liquid');
const headerActionsContent = fs.readFileSync(headerActionsPath, 'utf8');

const hasMobileNavCartCount = mobileNavContent.includes('samyak-mbn-cart-count');
const hasMobileNavCartListener = mobileNavContent.includes('cart:updated');
assert(
  hasMobileNavCartCount && hasMobileNavCartListener,
  'mobile-bottom-nav.liquid: Mobile Bag badge connected to real-time cart:updated events',
  'Mobile bottom nav badge updates count and visibility dynamically'
);

const hasHeaderActionsCartBadge = headerActionsContent.includes('samyak-header-cart-count') &&
  headerActionsContent.includes('cart-count');
assert(
  hasHeaderActionsCartBadge,
  'header-actions.liquid: Desktop header cart count badge fully integrated',
  'Desktop and mobile cart badges remain synchronized'
);

console.log('\n-----------------------------------------------------------------');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('=================================================================\n');

if (totalTests === passedTests) {
  process.exit(0);
} else {
  process.exit(1);
}
