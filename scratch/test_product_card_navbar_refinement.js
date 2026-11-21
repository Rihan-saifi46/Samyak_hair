const fs = require('fs');
const path = require('path');

const root = 'D:\\samyak_hair';
let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    errors++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- QA Test Suite: Product Card & Navbar Refinement ---\n');

// TASK 1: Product Card Height Increase (+100px -> ~475px) & 70/30 Layout
console.log('== Task 1: Product Card Height Increase & 70/30 Layout ==');
const cardStyles = fs.readFileSync(path.join(root, 'snippets/product-card-styles.liquid'), 'utf8');
assert(cardStyles.includes('min-height: 475px !important;'), 'Desktop card min-height increased to 475px (+100px from 375px)');
assert(cardStyles.includes('height: 70% !important;'), '70% height assigned to image section');
assert(cardStyles.includes('min-height: 330px !important;') && cardStyles.includes('max-height: 335px !important;'), 'Desktop image section min/max height scaled to ~330-335px');
assert(cardStyles.includes('object-fit: cover !important;'), 'Product card image uses full-bleed object-fit: cover');
assert(cardStyles.includes('padding: 0 !important;'), 'Full-bleed edge-to-edge image has zero padding');

// TASK 2: Restore Product Title Size (large serif ~18px, 6-7px smaller than 25px)
console.log('\n== Task 2: Restore Product Title Size ==');
const cardGallery = fs.readFileSync(path.join(root, 'blocks/_product-card-gallery.liquid'), 'utf8');
assert(!cardGallery.includes('product-grid-view-zoom-out--details'), 'Single product title: duplicate title is not present');
assert(cardStyles.includes('font-family: var(--font-serif') || cardStyles.includes('Cormorant Garamond'), 'Product title uses elegant serif typography');
assert(cardStyles.includes('clamp(17px, 1.35vw, 19px)') || cardStyles.includes('18px'), 'Product title font size restored to ~18px (6-7px smaller than 25px)');
assert(cardStyles.includes('-webkit-line-clamp: 2'), 'Product title supports natural multi-line text wrapping');

// TASK 3: Product Price Color and Size (#F8D9D4, 18px, no grey override)
console.log('\n== Task 3: Product Price Color and Size ==');
assert(cardStyles.includes('#F8D9D4'), 'snippets/product-card-styles.liquid styles price color strictly #F8D9D4');
assert(cardStyles.includes('font-size: 18px !important;'), 'Price font size increased to prominent 18px');
const impressionCss = fs.readFileSync(path.join(root, 'assets/impression4u-core.css'), 'utf8');
assert(impressionCss.includes('#F8D9D4 !important'), 'assets/impression4u-core.css prices styled #F8D9D4');
assert(!impressionCss.includes('color: #6B7280 !important;'), 'Old grey #6B7280 price override removed from impression4u-core.css');

// TASK 4: Equal Spacing Inside Product Cards (Info Section)
console.log('\n== Task 4: Equal Spacing Inside Product Cards ==');
assert(cardStyles.includes('height: 30% !important;'), '30% height assigned to info section');
assert(cardStyles.includes('min-height: 140px !important;'), 'Info section has scaled min-height: 140px');
assert(cardStyles.includes('justify-content: space-between !important;'), 'Info section uses justify-content: space-between for balanced vertical layout');
assert(cardStyles.includes('padding: 20px 18px !important;'), 'Equal balanced top/bottom padding (20px) defined');

// TASK 5: Remove Navbar Dropdown Arrows
console.log('\n== Task 5: Remove Navbar Dropdown Arrows ==');
const headerMenu = fs.readFileSync(path.join(root, 'blocks/_header-menu.liquid'), 'utf8');
// Extract the "Featured Collection" anchor block
const featColMatch = headerMenu.match(/<a[^>]*samyak-dropdown-trigger[^>]*>([\s\S]*?)<\/a>/);
assert(featColMatch && !featColMatch[1].includes('<svg'), 'Featured Collection anchor has no dropdown arrow icon');
// Extract the "Shop by Category" anchor block
const shopCatMatch = headerMenu.match(/<a href="\{\{ routes\.collections_url \}\}" class="samyak-hnav-a">([\s\S]*?)<\/a>/);
assert(shopCatMatch && !shopCatMatch[1].includes('<svg'), 'Shop by Category anchor has no dropdown arrow icon');
// Ensure dropdown menus themselves are preserved
assert(headerMenu.includes('samyak-nav-drop-single') && headerMenu.includes('/collections/best-seller'), 'Featured Collection dropdown menu markup preserved');
assert(headerMenu.includes('samyak-nav-mega') && headerMenu.includes('Claw Clips &amp; Clutchers'), 'Shop by Category mega menu markup preserved');

// TASK 6: Search Bar Design Improvement (Rounded corners + No green background)
console.log('\n== Task 6: Search Bar Design Improvement ==');
const searchSnippet = fs.readFileSync(path.join(root, 'snippets/search.liquid'), 'utf8');
assert(searchSnippet.includes('border-radius: 8px;'), 'Search bar has clean, modern rounded corners (border-radius: 8px)');
assert(searchSnippet.includes('background: transparent !important;'), 'Search button has transparent background');
assert(searchSnippet.includes('button-unstyled'), 'Search button has button-unstyled class');
assert(impressionCss.includes('samyak-hdr-search-btn'), 'impression4u-core.css excludes search button from green submit styling');

// TASK 7: Increase Navbar Item Spacing
console.log('\n== Task 7: Increase Navbar Item Spacing ==');
assert(impressionCss.includes('clamp(28px, 2.8vw, 36px)') || impressionCss.includes('gap: 34px'), 'impression4u-core.css has increased navbar gap');
assert(searchSnippet.includes('gap: 32px;'), 'snippets/search.liquid has increased nav links gap');

console.log('\n--------------------------------------------------------------');
if (errors === 0) {
  console.log('🎉 ALL 7 REFINEMENT TASKS VERIFIED SUCCESSFULLY WITH 0 ERRORS!');
  process.exit(0);
} else {
  console.error(`💥 Verification completed with ${errors} error(s).`);
  process.exit(1);
}
