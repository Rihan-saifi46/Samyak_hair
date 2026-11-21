const fs = require('fs');
const path = require('path');

function testUIImprovements() {
  console.log('=== VERIFYING UI & SHOPPING EXPERIENCE IMPROVEMENTS ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name, details) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}: ${details || ''}`);
      failed++;
    }
  }

  // 1. Check Carousel Assets & Mapping
  for (let i = 1; i <= 5; i++) {
    const assetPath = path.join(__dirname, '..', 'assets', `for-every-you-${i}.jpg`);
    assert(fs.existsSync(assetPath), `Carousel asset for-every-you-${i}.jpg exists in assets/`);
  }

  const categoryGrid = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'homepage-category-grid.liquid'), 'utf8');
  assert(categoryGrid.includes('for-every-you-1.jpg'), 'Category grid uses for-every-you-1.jpg');
  assert(categoryGrid.includes('for-every-you-5.jpg'), 'Category grid uses for-every-you-5.jpg');
  assert(categoryGrid.includes('FOR EVERY YOU'), 'Category grid maintains heading FOR EVERY YOU');

  // 2. Check Index JSON Sections & Order
  const indexContent = fs.readFileSync(path.join(__dirname, '..', 'templates', 'index.json'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const indexJson = JSON.parse(indexContent);

  assert(!indexJson.sections.customer_segments, 'Built for Business (customer_segments) removed from sections');
  assert(!indexJson.order.includes('customer_segments'), 'Built for Business (customer_segments) removed from order');

  const fqIdx = indexJson.order.indexOf('product_list_FQ6CgE');
  const eaIdx = indexJson.order.indexOf('product_list_EaYijr');
  assert(eaIdx === fqIdx + 1, 'New Arrivals (product_list_EaYijr) positioned immediately after Best Selling Products');

  const bspHeading = JSON.stringify(indexJson.sections.product_list_FQ6CgE.blocks['static-header']);
  assert(bspHeading.includes('<h2>Best Selling Products</h2>'), 'Best Selling Products heading uses valid h2 tag');
  assert(!bspHeading.includes('<div') && !bspHeading.includes('<span') && !bspHeading.includes('class='), 'Best Selling Products heading is free of forbidden HTML/classes');

  const naHeading = JSON.stringify(indexJson.sections.product_list_EaYijr.blocks['static-header']);
  assert(naHeading.includes('<h2>New Arrivals</h2>'), 'New Arrivals heading uses valid h2 tag');
  assert(!naHeading.includes('<div') && !naHeading.includes('<span') && !naHeading.includes('class='), 'New Arrivals heading is free of forbidden HTML/classes');

  // 3. Check Product Card Styles (~70% Image / ~30% Info)
  const cardStyles = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'product-card-styles.liquid'), 'utf8');
  assert(cardStyles.includes('aspect-ratio: 1 / 1 !important'), 'Product card media container defines 1:1 image frame');
  assert(cardStyles.includes('object-fit: contain !important'), 'Product card image uses object-fit contain');
  assert(cardStyles.includes('samyak-golden-heading-wrap'), 'Golden heading divider styles present');
  assert(cardStyles.includes('samyak-quick-shop-pill-btn'), 'Quick shop hover pill button preserved in styles');

  // 4. Check Cart Drawer & PDP Redirection Lock
  const pdpSnippet = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'wholesale-pdp.liquid'), 'utf8');
  assert(!pdpSnippet.includes("window.location.href = '/cart';"), 'Full cart page redirect removed from successful PDP ATC');
  assert(pdpSnippet.includes('/cart?section_id=cart-drawer-section'), 'PDP ATC refreshes cart drawer via Section Rendering API');

  const cartDrawer = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'cart-drawer.liquid'), 'utf8');
  assert(cartDrawer.includes('<cart-drawer-component\n        auto-open\n      >'), 'cart-drawer-component has auto-open enabled');

  // 5. Check Wishlist Drawer
  assert(fs.existsSync(path.join(__dirname, '..', 'snippets', 'wishlist-drawer.liquid')), 'snippets/wishlist-drawer.liquid exists');
  const wishlistSnippet = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'wishlist-drawer.liquid'), 'utf8');
  assert(wishlistSnippet.includes('samyak_wishlist'), 'Wishlist drawer reads samyak_wishlist localStorage');
  assert(wishlistSnippet.includes('openWishlistDrawer'), 'Wishlist drawer exports openWishlistDrawer controller');
  assert(wishlistSnippet.includes('/pages/wishlist'), 'Wishlist drawer has link to full wishlist page');

  const themeLiquid = fs.readFileSync(path.join(__dirname, '..', 'layout', 'theme.liquid'), 'utf8');
  assert(themeLiquid.includes("{% render 'wishlist-drawer' %}"), 'theme.liquid renders wishlist-drawer');

  const headerActions = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'header-actions.liquid'), 'utf8');
  assert(headerActions.includes('openWishlistDrawer'), 'Header wishlist icon wired to openWishlistDrawer');

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

testUIImprovements();
