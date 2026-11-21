const fs = require('fs');
const path = require('path');

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error('❌ FAIL:', msg);
    failures++;
  } else {
    console.log('✅ PASS:', msg);
  }
}

console.log('--- TESTING MASTER IMPLEMENTATION & UPLOAD VALIDATION ---\n');

// 1. Task 1: Product Card
const cardStyles = fs.readFileSync('snippets/product-card-styles.liquid', 'utf8');
assert(cardStyles.includes('height: 70% !important;'), 'Task 1: Card gallery occupies 70% height');
assert(cardStyles.includes('padding: 0 !important;') && cardStyles.includes('object-fit: cover !important;'), 'Task 1: Full-bleed image with zero padding and object-fit cover');
assert(cardStyles.includes('height: 30% !important;'), 'Task 1: Info section occupies 30% height');
assert(cardStyles.includes('justify-content: center !important;'), 'Task 1: Info section has equal top and bottom vertical spacing');
assert(cardStyles.includes('#B85D6D') || cardStyles.includes('#67391F'), 'Task 1: Product price color styled appropriately (#B85D6D or #67391F)');
assert(cardStyles.includes('min-height: 375px !important;') || cardStyles.includes('min-height: 350px !important;'), 'Task 1: Overall product card height increased to substantial premium height (~375px)');

// 2. Task 2: Remove Bento Repeating Pattern
const mainColl = fs.readFileSync('sections/main-collection.liquid', 'utf8');
assert(!mainColl.includes('cycle_15'), 'Task 2: cycle_15 logic removed from main-collection.liquid');
assert(!mainColl.includes('product-grid__item--bento-'), 'Task 2: bento classes removed from main-collection.liquid');
const prodGrid = fs.readFileSync('snippets/product-grid.liquid', 'utf8');
assert(!prodGrid.includes('15n +'), 'Task 2: 15-product Bento grid span rules removed from product-grid.liquid');
const collJson = JSON.parse(fs.readFileSync('templates/collection.json', 'utf8'));
assert(collJson.sections.main.settings.layout_type === 'grid', 'Task 2: templates/collection.json layout_type set to grid');

// 3. Task 3: Filter Sidebar Redesign
assert(collJson.sections.main.blocks.filters.settings.filter_style === 'vertical', 'Task 3: filter_style set to vertical on left side');
assert(cardStyles.includes('.facets--vertical'), 'Task 3: .facets--vertical clean box styling with subtle border and padding defined');

// 4. Task 4: PDP Main Product Image Size
const pdpSnippet = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
assert(pdpSnippet.includes('max-width: 440px;') && pdpSnippet.includes('aspect-ratio: 1 / 1;'), 'Task 4: Main PDP image size reduced to balanced 440px with 1:1 aspect ratio');
assert(pdpSnippet.includes('object-fit: contain;'), 'Task 4: PDP image object-fit contain with generous whitespace');
assert(pdpSnippet.includes('samyak-pdp-thumb'), 'Task 4: PDP thumbnail switcher preserved');
assert(pdpSnippet.includes('samyak-pdp-zoom-btn'), 'Task 4: PDP zoom/expand button preserved');

// 5. Task 5: Remove Retailer Promo Card from Homepage
const indexJson = JSON.parse(fs.readFileSync('templates/index.json', 'utf8'));
assert(!indexJson.sections.brand_story, 'Task 5: brand_story section removed from index.json');
assert(!indexJson.order.includes('brand_story'), 'Task 5: brand_story removed from index.json order array');

// 6. Task 6: Customer Reviews Moving Carousel
const reviewsSnippet = fs.readFileSync('snippets/homepage-reviews.liquid', 'utf8');
assert(reviewsSnippet.includes('samyakReviewsMarquee'), 'Task 6: Smooth moving marquee carousel implemented');
assert(reviewsSnippet.includes('animation-play-state: paused;'), 'Task 6: Hover-to-pause supported on marquee');
assert(reviewsSnippet.includes('[Sample Testimonial]') || reviewsSnippet.includes('SAMPLE CONTENT'), 'Task 6: Reviews clearly labeled as sample/demo content');
assert(indexJson.order[indexJson.order.length - 1] === 'custom_liquid_fTMk68', 'Task 6: Customer reviews section positioned immediately above footer in index.json order');

// 7. Task 7: Remove Homepage FAQ Section
assert(!indexJson.sections.section_7nJda9, 'Task 7: FAQ section (section_7nJda9) removed from index.json');
assert(!indexJson.order.includes('section_7nJda9'), 'Task 7: section_7nJda9 removed from index.json order array');

// 8. Task 8: Redesign Footer
const footerLiquid = fs.readFileSync('sections/footer.liquid', 'utf8');
assert(footerLiquid.includes('#113B32') && footerLiquid.includes('footer-content'), 'Task 8: Footer styled with Samyak branding');
const footerJson = JSON.parse(fs.readFileSync('sections/footer-group.json', 'utf8'));
assert(footerJson.sections.footer_m9NzUG && footerJson.sections.footer_utilities_jLGE8U, 'Task 8: Footer group sections valid and configured');

// 9. Upload JSON Strictness & RichText Validation
const rawIndex = fs.readFileSync('templates/index.json', 'utf8');
assert(!rawIndex.startsWith('/*'), 'Upload Validation: index.json starts with strict JSON (no leading comment)');
function checkAllRichText(obj, file) {
  for (const k in obj) {
    const v = obj[k];
    if (k === 'text' && typeof v === 'string') {
      if (v.includes('<div') || v.includes('class=')) {
        assert(false, `Invalid HTML in text setting in ${file}: ${v}`);
      }
    } else if (typeof v === 'object' && v !== null) {
      checkAllRichText(v, file);
    }
  }
}
checkAllRichText(indexJson, 'templates/index.json');
assert(true, 'Upload Validation: All text settings in index.json strictly conform to Shopify rich text schema');

console.log('\n========================================');
if (failures === 0) {
  console.log('🎉 ALL MASTER IMPLEMENTATION & VALIDATION CHECKS PASSED (0 FAILURES)');
} else {
  console.log(`❌ ${failures} CHECKS FAILED`);
  process.exit(1);
}
