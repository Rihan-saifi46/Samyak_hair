const fs = require('fs');
const path = require('path');

function testPDPAndCollectionHeight() {
  console.log('=== VERIFYING COLLECTION CARD HEIGHT & PDP REDESIGN ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Verify Collection Product Card Height Optimization
  const cardStyles = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'product-card-styles.liquid'), 'utf8');
  assert(cardStyles.includes('max-height: 225px !important'), 'Product card media defines medium max-height: 225px on desktop');
  assert(cardStyles.includes('max-height: 195px !important'), 'Product card media defines responsive max-height: 195px on tablet');
  assert(cardStyles.includes('max-height: 160px !important'), 'Product card media defines responsive max-height: 160px on mobile');
  assert(cardStyles.includes('padding: 8px !important'), 'Product card media image uses balanced 8px padding');
  assert(cardStyles.includes('margin-top: auto !important'), 'Product card price aligns neatly at card bottom with margin-top: auto');
  assert(cardStyles.includes('.product-grid__item--bento-hero-right .product-card .card-gallery'), 'Bento 2-row hero items have dedicated scaling rule');

  // 2. Verify PDP Structure in snippets/wholesale-pdp.liquid
  const pdpSnippet = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'wholesale-pdp.liquid'), 'utf8');

  // Left Column: Gallery & Thumbnails
  assert(pdpSnippet.includes('id="samyak-pdp-main-img"'), 'Main product image exists in Left Column');
  assert(pdpSnippet.includes('class="samyak-pdp-thumbnails-strip"'), 'Thumbnail gallery strip exists');
  assert(pdpSnippet.includes('data-media-id="{{ media.id }}"'), 'Thumbnails support all product media from Shopify');
  assert(pdpSnippet.includes('id="samyak-pdp-zoom-btn"'), 'Zoom button present in gallery');

  // Right Column: Information Hierarchy
  const titleIdx = pdpSnippet.indexOf('class="samyak-pdp-title"');
  const priceIdx = pdpSnippet.indexOf('id="samyak-pdp-price-row"');
  const introIdx = pdpSnippet.indexOf('class="samyak-pdp-short-intro"');
  const variantIdx = pdpSnippet.indexOf('class="samyak-pdp-variants-section"');
  const stockIdx = pdpSnippet.indexOf('id="samyak-pdp-stock-status"');
  const atcIdx = pdpSnippet.indexOf('id="samyak-pdp-btn-atc"');
  const buynowIdx = pdpSnippet.indexOf('id="samyak-pdp-btn-buynow"');
  const wishlistIdx = pdpSnippet.indexOf('id="samyak-pdp-wishlist-btn"');

  assert(titleIdx > -1, '1. Product Title present');
  assert(priceIdx > titleIdx, '2. Product Price ordered after Title');
  assert(introIdx > priceIdx, '3. Product Short Description ordered after Price');
  assert(variantIdx > introIdx, '4. Variant Options ordered after Short Description');
  assert(stockIdx > variantIdx, '5. Stock Availability Status ordered after Variants');
  assert(atcIdx > stockIdx, '6. Add to Cart Button ordered after Stock Status');
  assert(buynowIdx > atcIdx, '7. Buy Now Button ordered with Add to Cart');
  assert(wishlistIdx > buynowIdx, '8. Wishlist Option ordered after Purchase Buttons');

  // Verify No Fake Variants
  assert(!pdpSnippet.includes('Standard Pack (12 Pcs)'), 'No fake "Standard Pack (12 Pcs)" variants injected');
  assert(!pdpSnippet.includes('Carton 5 Packs (60 Pcs)'), 'No fake "Carton 5 Packs (60 Pcs)" variants injected');

  // Verify Purchase Buttons Side-by-Side & Dimensions
  assert(pdpSnippet.includes('grid-template-columns: 1fr 1fr;'), 'Purchase actions positioned together in 1fr 1fr grid');
  assert(pdpSnippet.includes('height: 48px;'), 'Both purchase buttons have matching 48px height');

  // Verify Wishlist Functionality & Drawer Sync
  assert(pdpSnippet.includes('initWishlist'), 'Wishlist script initialized in wholesale-pdp.liquid');
  assert(pdpSnippet.includes('samyak_wishlist'), 'Wishlist syncs with localStorage samyak_wishlist');
  assert(pdpSnippet.includes('openWishlistDrawer'), 'Wishlist connects to wishlist drawer');

  // Verify Section 3: About This Product Section
  assert(pdpSnippet.includes('class="samyak-pdp-about-section"'), 'About This Product section present immediately below main grid');
  assert(pdpSnippet.includes('About This Product</h2>'), 'About section has exact heading "About This Product"');
  assert(pdpSnippet.includes('{{ product.description }}'), 'About section displays full rich-text Shopify product description');

  // Verify Section 4: Removal of Jewellery Price Breakdown
  assert(!pdpSnippet.includes('Making charge'), 'Zero jewellery making charge calculations');
  assert(!pdpSnippet.includes('Gold price'), 'Zero gold price calculations');
  assert(!pdpSnippet.includes('Diamond price'), 'Zero diamond price calculations');
  assert(!pdpSnippet.includes('Gold purity'), 'Zero gold purity references');

  // 3. Verify Section 5: People Also Bought & Section 6: Customer Reviews in templates/product.json
  const productJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'templates', 'product.json'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''));

  assert(productJson.sections.product_recommendations_qggXJq, 'product_recommendations_qggXJq section exists');
  const recHeading = JSON.stringify(productJson.sections.product_recommendations_qggXJq.blocks.text_cbcgyb);
  assert(recHeading.includes('People Also Bought'), 'Section 5 has exact heading "People Also Bought"');

  assert(productJson.sections.customer_reviews, 'Section 6: customer_reviews section defined in product.json');
  assert(productJson.sections.customer_reviews.type === 'product-reviews', 'customer_reviews section uses type product-reviews');

  assert(productJson.order[0] === 'main', 'Order step 1: main (product-information + About This Product)');
  assert(productJson.order[1] === 'product_recommendations_qggXJq', 'Order step 2: People Also Bought recommendations');
  assert(productJson.order[2] === 'customer_reviews', 'Order step 3: Customer Reviews');

  // 4. Verify sections/product-reviews.liquid
  assert(fs.existsSync(path.join(__dirname, '..', 'sections', 'product-reviews.liquid')), 'sections/product-reviews.liquid exists');
  const reviewsLiquid = fs.readFileSync(path.join(__dirname, '..', 'sections', 'product-reviews.liquid'), 'utf8');
  assert(reviewsLiquid.includes('Customer Reviews'), 'Customer Reviews heading present in section');
  assert(reviewsLiquid.includes('No customer reviews yet'), 'Sensible empty state when no reviews exist');
  assert(reviewsLiquid.includes('Write a Review'), 'Write a Review button present in empty state');
  assert(reviewsLiquid.includes('shopify-product-reviews'), 'Shopify app review hook present');
  assert(!reviewsLiquid.includes('Arun Raj'), 'Zero hardcoded fake customer reviews or testimonials');

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

testPDPAndCollectionHeight();
