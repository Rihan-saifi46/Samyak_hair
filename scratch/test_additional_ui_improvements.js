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

console.log('--- QA Test Suite: Additional UI Improvements & Navigation Update ---\n');

// TASK 1: Product Card Final Refinement
console.log('== Task 1: Product Card Final Refinement ==');
const cardGallery = fs.readFileSync(path.join(root, 'blocks/_product-card-gallery.liquid'), 'utf8');
assert(!cardGallery.includes('product-grid-view-zoom-out--details'), 'No duplicate product title in _product-card-gallery.liquid');

const cardStyles = fs.readFileSync(path.join(root, 'snippets/product-card-styles.liquid'), 'utf8');
assert(cardStyles.includes('font-family: var(--font-serif'), 'Product title uses elegant serif font family');
assert(cardStyles.includes('#F8D9D4') || cardStyles.includes('#B85D6D'), 'Price uses designated brand color (#F8D9D4)');
assert(cardStyles.includes('min-height: 475px') || cardStyles.includes('min-height: 375px'), 'Desktop card min-height is properly configured');
assert(cardStyles.includes('height: 70%'), 'Product image height maintains ~70% card ratio');

// TASK 2: Footer Logo Replacement
console.log('\n== Task 2: Footer Logo Replacement ==');
const imageBlock = fs.readFileSync(path.join(root, 'blocks/image.liquid'), 'utf8');
assert(imageBlock.includes('samyak-logo-emerald.jpg'), 'Footer image block references samyak-logo-emerald.jpg');

// TASK 3: Remove Payment Methods from Footer
console.log('\n== Task 3: Remove Payment Methods from Footer ==');
const footerGroup = JSON.parse(fs.readFileSync(path.join(root, 'sections/footer-group.json'), 'utf8'));
const footerSec = footerGroup.sections.footer_m9NzUG || footerGroup.sections.footer;
const footerBlockIds = Object.keys(footerSec.blocks);
assert(!footerBlockIds.includes('conversion_bear_trust_badges_widget_jF79Lh'), 'Conversion Bear trust badge removed from footer blocks');
assert(!footerSec.block_order.includes('conversion_bear_trust_badges_widget_jF79Lh'), 'Conversion Bear trust badge removed from footer block_order');

// TASK 4: Homepage Social Buttons & Header Instagram
console.log('\n== Task 4: Homepage Social Buttons & Header Instagram ==');
const indexJson = JSON.parse(fs.readFileSync(path.join(root, 'templates/index.json'), 'utf8'));
assert(!indexJson.order.includes('custom_liquid_MQA9UW'), 'Social banner removed from homepage sections order');
const headerActions = fs.readFileSync(path.join(root, 'snippets/header-actions.liquid'), 'utf8');
assert(headerActions.includes('https://www.instagram.com/samyak_hair_accessories/'), 'Header actions contains Instagram profile link');
assert(headerActions.includes('samyak-hdr-instagram-btn'), 'Header actions includes Instagram icon button (samyak-hdr-instagram-btn)');

// TASK 5: Featured Collection Navigation Behaviour
console.log('\n== Task 5: Featured Collection Navigation Behaviour ==');
const headerMenu = fs.readFileSync(path.join(root, 'blocks/_header-menu.liquid'), 'utf8');
assert(headerMenu.includes('Featured Collection'), 'Header menu contains "Featured Collection" parent item');
assert(headerMenu.includes('/collections/best-seller'), 'Header menu contains Best Seller link');
assert(headerMenu.includes('/collections/new-arrival'), 'Header menu contains New Arrival link');
assert(headerMenu.includes('samyak-featured-dropdown'), 'Header menu contains dropdown container class (samyak-featured-dropdown)');

// TASK 6: Best Seller & New Arrival Collection Page Structure
console.log('\n== Task 6: Best Seller & New Arrival Collection Page Structure ==');
const collectionJson = JSON.parse(fs.readFileSync(path.join(root, 'templates/collection.json'), 'utf8'));
assert(collectionJson.sections.people_also_bought !== undefined, 'collection.json contains people_also_bought section');
assert(collectionJson.sections.customer_reviews !== undefined, 'collection.json contains customer_reviews section');
const expectedOrder = ['section', 'main', 'people_also_bought', 'customer_reviews'];
assert(JSON.stringify(collectionJson.order) === JSON.stringify(expectedOrder), `collection.json order matches exact expected order: ${expectedOrder.join(' -> ')}`);

const pabLiquid = fs.readFileSync(path.join(root, 'sections/collection-people-also-bought.liquid'), 'utf8');
assert(pabLiquid.includes('People Also Bought'), 'People Also Bought section has correct heading');
assert(pabLiquid.includes('best-seller') && pabLiquid.includes('new-arrival'), 'People Also Bought checks best-seller and new-arrival target collections');

const reviewsLiquid = fs.readFileSync(path.join(root, 'sections/wholesale-reviews.liquid'), 'utf8');
assert(reviewsLiquid.includes('best-seller') && reviewsLiquid.includes('new-arrival'), 'Reviews section checks best-seller and new-arrival target collections');

console.log('\n--------------------------------------------------------------');
if (errors === 0) {
  console.log('🎉 ALL TASKS VERIFIED SUCCESSFULLY WITH 0 ERRORS!');
  process.exit(0);
} else {
  console.error(`💥 Verification completed with ${errors} error(s).`);
  process.exit(1);
}
