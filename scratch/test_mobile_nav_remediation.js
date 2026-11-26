const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== SAMYAK HAIR — MOBILE CART & WISHLIST REMEDIATION VERIFICATION ===\n');

// 1. Read files
const mbnPath = path.join(__dirname, '..', 'snippets', 'mobile-bottom-nav.liquid');
const wlPath = path.join(__dirname, '..', 'snippets', 'wishlist-drawer.liquid');
const hdrPath = path.join(__dirname, '..', 'snippets', 'header-actions.liquid');
const pdpPath = path.join(__dirname, '..', 'snippets', 'wholesale-pdp.liquid');

const mbnContent = fs.readFileSync(mbnPath, 'utf8');
const wlContent = fs.readFileSync(wlPath, 'utf8');
const hdrContent = fs.readFileSync(hdrPath, 'utf8');
const pdpContent = fs.readFileSync(pdpPath, 'utf8');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
  }
}

console.log('--- SUITE 1: Mobile Bottom Nav Structure & UI Preservation ---');

it('Navigation items order preserved: Home, Search, Chat, Wishlist, Bag', () => {
  const homeIdx = mbnContent.indexOf('<!-- 1. Home -->');
  const searchIdx = mbnContent.indexOf('<!-- 2. Search -->');
  const chatIdx = mbnContent.indexOf('<!-- 3. WhatsApp Chat');
  const wlIdx = mbnContent.indexOf('<!-- 4. Wishlist -->');
  const bagIdx = mbnContent.indexOf('<!-- 5. Bag -->');

  assert(homeIdx > -1, 'Home item missing');
  assert(searchIdx > homeIdx, 'Search not after Home');
  assert(chatIdx > searchIdx, 'Chat not after Search');
  assert(wlIdx > chatIdx, 'Wishlist not after Chat');
  assert(bagIdx > wlIdx, 'Bag not after Wishlist');
});

it('SVG markup and dimensions preserved exactly for Wishlist and Bag', () => {
  // Wishlist SVG check
  assert(mbnContent.includes('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'), 'Wishlist SVG tag modified');
  assert(mbnContent.includes('<path d="M12 21s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 3.6C19 16.4 12 21 12 21Z"/>'), 'Wishlist path modified');

  // Bag SVG check
  assert(mbnContent.includes('<path d="M6 8h12l1 12H5L6 8Z"/>'), 'Bag outline path modified');
  assert(mbnContent.includes('<path d="M9 8V6a3 3 0 0 1 6 0v2"/>'), 'Bag handle path modified');
});

it('Mobile bottom nav styling tokens preserved (height 64px, z-index 9999, border-radius 20px, badge styling)', () => {
  assert(mbnContent.includes('height: 64px;'), 'Nav height changed');
  assert(mbnContent.includes('z-index: 9999;'), 'Nav z-index changed');
  assert(mbnContent.includes('border-top-left-radius: 20px;'), 'Corner radius changed');
  assert(mbnContent.includes('background-color: #113B32;'), 'Badge color changed');
  assert(mbnContent.includes('font-size: 9px;'), 'Badge font-size changed');
  assert(mbnContent.includes('min-width: 15px;'), 'Badge min-width changed');
});

console.log('\n--- SUITE 2: Wishlist Integration & Dual-Badge Pipeline ---');

it('Wishlist element maintains existing onclick trigger to openWishlistDrawer()', () => {
  assert(mbnContent.includes('onclick="if(window.openWishlistDrawer){event.preventDefault();window.openWishlistDrawer();}"'), 'Wishlist onclick handler broken');
});

it('Mobile wishlist badge element #samyak-mbn-wishlist-count is preserved in DOM', () => {
  assert(mbnContent.includes('id="samyak-mbn-wishlist-count"'), 'Wishlist badge ID missing');
  assert(mbnContent.includes('class="samyak-mbn-badge"'), 'Wishlist badge class missing');
});

it('Wishlist drawer updates BOTH desktop and mobile badges on renderWishlistDrawer()', () => {
  assert(wlContent.includes("document.getElementById('samyak-header-wishlist-count')"), 'Desktop header badge update missing in drawer');
  assert(wlContent.includes("document.getElementById('samyak-mbn-wishlist-count')"), 'Mobile bottom nav badge update missing in drawer');
  assert(wlContent.includes("mbnBadge.style.display = 'flex'"), 'Mobile badge display:flex logic missing');
  assert(wlContent.includes("mbnBadge.style.display = 'none'"), 'Mobile badge display:none logic missing');
});

it('Mobile nav contains independent immediate synchronizer for samyak_wishlist', () => {
  assert(mbnContent.includes("localStorage.getItem('samyak_wishlist')"), 'localStorage read missing in mobile nav');
  assert(mbnContent.includes("document.addEventListener('wishlist:updated', syncMbnWishlistBadge)"), 'wishlist:updated event listener missing in mobile nav');
});

console.log('\n--- SUITE 3: Cart Integration & Shopify Reactive Pipeline ---');

it('Mobile Bag badge always exists in DOM even when cart.item_count is 0', () => {
  assert(mbnContent.includes('id="samyak-mbn-cart-count"'), 'Mobile cart count badge ID missing');
  assert(mbnContent.includes('class="samyak-mbn-badge"'), 'Mobile cart badge class missing');
  assert(mbnContent.includes('{% if cart.item_count == 0 %}style="display: none;"{% endif %}'), 'Zero-count visual hide condition missing');
});

it('Desktop Cart badge in header-actions also has stable ID #samyak-header-cart-count', () => {
  assert(hdrContent.includes('id="samyak-header-cart-count"'), 'Desktop header cart count ID missing');
  assert(hdrContent.includes('{% if cart.item_count == 0 %}style="display: none;"{% endif %}'), 'Desktop zero-count visual hide condition missing');
});

it('Bag item opens #cart-drawer with fallback check for cart page', () => {
  assert(mbnContent.includes("document.getElementById('cart-drawer')"), 'Cart drawer query missing');
  assert(mbnContent.includes("settings.cart_type == 'drawer'"), 'Cart type check missing');
});

it('Mobile nav listens to Shopify cart lines update, custom cart events, and bfcache pageshow', () => {
  assert(mbnContent.includes("document.addEventListener('shopify:cart:lines-update'"), 'shopify:cart:lines-update listener missing');
  assert(mbnContent.includes("document.addEventListener('cart:lines-update'"), 'cart:lines-update listener missing');
  assert(mbnContent.includes("document.addEventListener('cart:updated'"), 'cart:updated listener missing');
  assert(mbnContent.includes("document.addEventListener('shopify:cart:refresh'"), 'shopify:cart:refresh listener missing');
  assert(mbnContent.includes("window.addEventListener('pageshow'"), 'pageshow bfcache listener missing');
});

it('Mobile nav handles StandardEvents.cartLinesUpdate event.promise resolution', () => {
  assert(mbnContent.includes('event.promise'), 'event.promise resolution missing');
  assert(mbnContent.includes('totalQuantity'), 'totalQuantity property read missing');
  assert(mbnContent.includes("fetch('/cart.js')"), 'Live cart fetch fallback missing');
});

it('Wholesale PDP add-to-cart callback updates both #samyak-header-cart-count and #samyak-mbn-cart-count', () => {
  assert(pdpContent.includes('#samyak-header-cart-count'), 'PDP missing header cart count update');
  assert(pdpContent.includes('#samyak-mbn-cart-count'), 'PDP missing mobile nav cart count update');
});

console.log(`\n==================================================`);
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} tests passed.`);
console.log(`==================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
