const fs = require('fs');
const path = require('path');

console.log('=================================================================');
console.log('       SAMYAK HAIR ACCESSORIES — SPRINT 2 VERIFICATION SUITE     ');
console.log('=================================================================\n');

let allPassed = true;

// -------------------------------------------------------------
// TEST 1: BUG-HIGH-001 (snippets/search.liquid)
// -------------------------------------------------------------
console.log('--- TEST 1: BUG-HIGH-001 (Dynamic Header Navigation) ---');
const searchContent = fs.readFileSync(path.join(__dirname, '../snippets/search.liquid'), 'utf-8');

const hasLinklistRef = searchContent.includes("linklists['main-menu']");
const hasDynamicLoop = searchContent.includes('for link in header_linklist.links');
const hasActiveState = searchContent.includes('is_link_active') && searchContent.includes('aria-current="page"');
const hasDropdownMarkup = searchContent.includes('samyak-nav-dropdown-wrap') && searchContent.includes('samyak-nav-dropdown-menu');
const hasFallbackLinks = searchContent.includes('<!-- Default Fallback Links when menu is unpopulated -->');

console.log('  1. References linklists[\'main-menu\']:', hasLinklistRef ? 'PASS' : 'FAIL');
console.log('  2. Dynamic loop over Shopify Admin navigation links:', hasDynamicLoop ? 'PASS' : 'FAIL');
console.log('  3. Active page state & aria-current="page" evaluation:', hasActiveState ? 'PASS' : 'FAIL');
console.log('  4. Dropdown menu markup for child links:', hasDropdownMarkup ? 'PASS' : 'FAIL');
console.log('  5. Graceful fallback navigation for empty state:', hasFallbackLinks ? 'PASS' : 'FAIL');

if (!hasLinklistRef || !hasDynamicLoop || !hasActiveState || !hasDropdownMarkup || !hasFallbackLinks) {
  allPassed = false;
}

// -------------------------------------------------------------
// TEST 2: BUG-HIGH-002 (Wishlist Destination Page & localStorage)
// -------------------------------------------------------------
console.log('\n--- TEST 2: BUG-HIGH-002 (Wishlist Destination Page) ---');
const wishlistTemplatePath = path.join(__dirname, '../templates/page.wishlist.json');
const wishlistSectionPath = path.join(__dirname, '../sections/main-wishlist.liquid');
const productCardPath = path.join(__dirname, '../snippets/product-card.liquid');

const hasWishlistTemplate = fs.existsSync(wishlistTemplatePath);
const hasWishlistSection = fs.existsSync(wishlistSectionPath);
const wishlistSectionContent = hasWishlistSection ? fs.readFileSync(wishlistSectionPath, 'utf-8') : '';
const productCardContent = fs.readFileSync(productCardPath, 'utf-8');

const hasLocalStorageKey = wishlistSectionContent.includes("STORAGE_KEY = 'samyak_wishlist'");
const hasEmptyState = wishlistSectionContent.includes('samyak-wishlist-empty') && wishlistSectionContent.includes('Your Wishlist is Empty');
const hasGridState = wishlistSectionContent.includes('samyak-wishlist-grid');
const hasRemoveAction = wishlistSectionContent.includes('samyak-wcard-remove-btn') && wishlistSectionContent.includes('saveWishlist(filtered)');
const hasAddToCartAction = wishlistSectionContent.includes('samyak-wcard-atc-btn') && wishlistSectionContent.includes('/cart/add.js');
const hasProductCardSync = productCardContent.includes('wishlist:updated') && productCardContent.includes('syncButtons');

console.log('  1. templates/page.wishlist.json exists:', hasWishlistTemplate ? 'PASS' : 'FAIL');
console.log('  2. sections/main-wishlist.liquid exists:', hasWishlistSection ? 'PASS' : 'FAIL');
console.log('  3. Connects to localStorage key "samyak_wishlist":', hasLocalStorageKey ? 'PASS' : 'FAIL');
console.log('  4. Renders luxury empty state:', hasEmptyState ? 'PASS' : 'FAIL');
console.log('  5. Renders responsive wishlist grid container:', hasGridState ? 'PASS' : 'FAIL');
console.log('  6. Implements item removal & localStorage persistence:', hasRemoveAction ? 'PASS' : 'FAIL');
console.log('  7. Implements direct Add to Bag action:', hasAddToCartAction ? 'PASS' : 'FAIL');
console.log('  8. Synchronizes product card heart buttons via events:', hasProductCardSync ? 'PASS' : 'FAIL');

if (!hasWishlistTemplate || !hasWishlistSection || !hasLocalStorageKey || !hasEmptyState || !hasGridState || !hasRemoveAction || !hasAddToCartAction || !hasProductCardSync) {
  allPassed = false;
}

// -------------------------------------------------------------
// TEST 3: BUG-HIGH-003 (Third-Party Category Image Replacement)
// -------------------------------------------------------------
console.log('\n--- TEST 3: BUG-HIGH-003 (Category Image Replacement) ---');
const categoryGridContent = fs.readFileSync(path.join(__dirname, '../snippets/homepage-category-grid.liquid'), 'utf-8');

const hasCompetitorHotlink = categoryGridContent.includes('cdn.impression4u.com');
const hasCollectionFeaturedImage = categoryGridContent.includes('col1.featured_image') && categoryGridContent.includes('image_url: width: 800');
const hasAssetFallback = categoryGridContent.includes('samyak-card-1.jpg') && categoryGridContent.includes('asset_url');

console.log('  1. Competitor CDN URLs (cdn.impression4u.com) completely removed:', !hasCompetitorHotlink ? 'PASS' : 'FAIL');
console.log('  2. Connects dynamically to Shopify collection.featured_image:', hasCollectionFeaturedImage ? 'PASS' : 'FAIL');
console.log('  3. Fallbacks to verified merchant theme assets in assets/:', hasAssetFallback ? 'PASS' : 'FAIL');

if (hasCompetitorHotlink || !hasCollectionFeaturedImage || !hasAssetFallback) {
  allPassed = false;
}

// -------------------------------------------------------------
// TEST 4: BUG-HIGH-004 (Bento Editorial Grid Global Indexing)
// -------------------------------------------------------------
console.log('\n--- TEST 4: BUG-HIGH-004 (Bento Grid Global Indexing) ---');
const mainCollectionContent = fs.readFileSync(path.join(__dirname, '../sections/main-collection.liquid'), 'utf-8');
const productGridContent = fs.readFileSync(path.join(__dirname, '../snippets/product-grid.liquid'), 'utf-8');

const hasGlobalOffset = mainCollectionContent.includes('global_offset = paginate.current_offset');
const hasGlobalIndex = mainCollectionContent.includes('global_index = global_offset | plus: forloop.index0');
const hasCycleGlobal = mainCollectionContent.includes('cycle_15 = global_index | modulo: 15');
const has30ProductsPerPage = mainCollectionContent.includes('products_per_page = 30') || mainCollectionContent.includes('products_per_page | default: 30');
const hasGridDense = productGridContent.includes('grid-auto-flow: dense !important;');
const hasClassBentoHeroRight = productGridContent.includes('.product-grid__item.product-grid__item--bento-hero-right');
const hasClassBentoHeroLeft = productGridContent.includes('.product-grid__item.product-grid__item--bento-hero-left');

console.log('  1. paginate.current_offset captured:', hasGlobalOffset ? 'PASS' : 'FAIL');
console.log('  2. global_index calculated across pagination batches:', hasGlobalIndex ? 'PASS' : 'FAIL');
console.log('  3. cycle_15 driven by global_index (not local forloop):', hasCycleGlobal ? 'PASS' : 'FAIL');
console.log('  4. Default 30 products per page (exact 2 cycles):', has30ProductsPerPage ? 'PASS' : 'FAIL');
console.log('  5. CSS grid-auto-flow: dense for incomplete batches:', hasGridDense ? 'PASS' : 'FAIL');
console.log('  6. Class-based placement for Hero Feature cards (Left & Right):', (hasClassBentoHeroRight && hasClassBentoHeroLeft) ? 'PASS' : 'FAIL');

if (!hasGlobalOffset || !hasGlobalIndex || !hasCycleGlobal || !has30ProductsPerPage || !hasGridDense || !hasClassBentoHeroRight || !hasClassBentoHeroLeft) {
  allPassed = false;
}

// -------------------------------------------------------------
// TEST 5: BUG-HIGH-008 (Cart Drawer SRA Target Synchronization)
// -------------------------------------------------------------
console.log('\n--- TEST 5: BUG-HIGH-008 (Cart Drawer SRA Synchronization) ---');
const quickShopContent = fs.readFileSync(path.join(__dirname, '../snippets/quick-shop-drawer.liquid'), 'utf-8');
const cartDrawerContent = fs.readFileSync(path.join(__dirname, '../snippets/cart-drawer.liquid'), 'utf-8');

const hasQuickShopSraTarget = quickShopContent.includes("fetch('/cart?section_id=cart-drawer')");
const hasQuickShopOldTarget = quickShopContent.includes("cart-drawer-section");
const hasCartDrawerWrapperId = cartDrawerContent.includes('id="shopify-section-cart-drawer"');

console.log('  1. quick-shop-drawer requests /cart?section_id=cart-drawer:', hasQuickShopSraTarget ? 'PASS' : 'FAIL');
console.log('  2. Old mismatched target cart-drawer-section removed:', !hasQuickShopOldTarget ? 'PASS' : 'FAIL');
console.log('  3. cart-drawer.liquid wrapper ID synchronized to shopify-section-cart-drawer:', hasCartDrawerWrapperId ? 'PASS' : 'FAIL');

if (!hasQuickShopSraTarget || hasQuickShopOldTarget || !hasCartDrawerWrapperId) {
  allPassed = false;
}

// -------------------------------------------------------------
// TEST 6: REGRESSION CHECK — SPRINT 1 P0 CRITICAL FIXES PRESERVED
// -------------------------------------------------------------
console.log('\n--- TEST 6: SPRINT 1 REGRESSION VALIDATION ---');
const headerRowContent = fs.readFileSync(path.join(__dirname, '../snippets/header-row.liquid'), 'utf-8');
const pdpContent = fs.readFileSync(path.join(__dirname, '../snippets/wholesale-pdp.liquid'), 'utf-8');
const mainCartContent = fs.readFileSync(path.join(__dirname, '../sections/main-cart.liquid'), 'utf-8');

const s1_mobileNav = headerRowContent.includes('samyak-hdr-drawer-trigger') && headerRowContent.includes('{{ first }}');
const s1_pdpMoq = pdpContent.includes('lineTotal >= 200000') && pdpContent.includes('fetch(\'/cart/add.js\'');
const s1_cartMoq = mainCartContent.includes('wholesale_min_threshold = 200000') && mainCartContent.includes('id="samyak-cart-moq-warning"');

console.log('  1. BUG-CRIT-001 (Mobile Navigation Drawer Trigger) preserved:', s1_mobileNav ? 'PASS' : 'FAIL');
console.log('  2. BUG-CRIT-002 (PDP Buy It Now Wholesale MOQ Interception) preserved:', s1_pdpMoq ? 'PASS' : 'FAIL');
console.log('  3. BUG-CRIT-003 (Cart Page Wholesale MOQ Lock & Progress Bar) preserved:', s1_cartMoq ? 'PASS' : 'FAIL');

if (!s1_mobileNav || !s1_pdpMoq || !s1_cartMoq) {
  allPassed = false;
}

console.log('\n=================================================================');
console.log(allPassed ? '>>> ALL SPRINT 2 IMPLEMENTATION & REGRESSION CHECKS PASSED! <<<' : '>>> SOME SPRINT 2 CHECKS FAILED! <<<');
console.log('=================================================================');

process.exit(allPassed ? 0 : 1);
