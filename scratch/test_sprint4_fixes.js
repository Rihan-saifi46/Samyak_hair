const fs = require('fs');
const path = require('path');

function runSprint4Tests() {
  console.log('=== RUNNING SPRINT 4 VERIFICATION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}: ${details || ''}`);
      failed++;
    }
  }

  // 1. Check blocks/_product-card-gallery.liquid
  const galleryLiquid = fs.readFileSync(path.join(__dirname, '..', 'blocks', '_product-card-gallery.liquid'), 'utf8');
  assert(!galleryLiquid.includes('samyak-product-json'), 'Issue 1: samyak-product-json script tag removed from product cards');
  assert(!galleryLiquid.includes('{{ product | json }}'), 'Issue 1: Raw {{ product | json }} payload completely eliminated');
  assert(galleryLiquid.includes('data-product-title="{{ product.title | escape }}"'), 'Issue 1: data-product-title attribute present on wishlist button');
  assert(galleryLiquid.includes('data-product-price="₹{{ product.price | money_without_currency }}"'), 'Issue 1: data-product-price attribute present on wishlist button');
  assert(galleryLiquid.includes('data-product-handle="{{ product.handle }}"'), 'Issue 1: data-product-handle attribute present on wishlist button');

  // 2. Check snippets/product-card.liquid
  const cardLiquid = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'product-card.liquid'), 'utf8');
  assert(cardLiquid.includes('btnData.productTitle'), 'Issue 1: Wishlist handler reads attributes directly from button dataset');
  assert(!cardLiquid.includes('observer.observe(document.body'), 'Issue 2: Global document.body MutationObserver completely removed');
  assert(cardLiquid.includes('requestAnimationFrame'), 'Issue 2: Debounced observer using requestAnimationFrame implemented');
  assert(cardLiquid.includes('document.addEventListener(\'wishlist:updated\''), 'Issue 2: Event-driven wishlist sync implemented');

  // 3. Check snippets/quick-shop-drawer.liquid
  const quickShopLiquid = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'quick-shop-drawer.liquid'), 'utf8');
  assert(quickShopLiquid.includes('productCache = {}'), 'Issue 1: Quick Shop client-side in-memory cache implemented');
  assert(quickShopLiquid.includes('prefetchProduct(handle)'), 'Issue 1: Hover/pointerenter prefetching implemented');
  assert(quickShopLiquid.includes('fetch(\'/products/\' + handle + \'.js\')'), 'Issue 1: Asynchronous on-demand product fetch preserved');

  // 4. Check layout/theme.liquid
  const themeLiquid = fs.readFileSync(path.join(__dirname, '..', 'layout', 'theme.liquid'), 'utf8');
  assert(themeLiquid.includes('rel="preload" as="style" href="https://fonts.googleapis.com'), 'Issue 3: Google Fonts loaded via non-blocking preload');
  assert(themeLiquid.includes('rel="preload" as="style" href="{{ \'component-cart-drawer.css\' | asset_url }}"'), 'Issue 3: Cart drawer CSS non-blocking preload implemented');
  assert(themeLiquid.includes('<noscript>'), 'Issue 3: Fallback noscript tags present for stylesheet degradation');

  // 5. Check snippets/wholesale-pdp.liquid, header-row.liquid, divider.liquid docs
  const pdpLiquid = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'wholesale-pdp.liquid'), 'utf8');
  assert(pdpLiquid.includes('@param {product} product'), 'Issue 4: wholesale-pdp.liquid declares product param');
  assert(pdpLiquid.includes('@param {collection} [collection]'), 'Issue 4: wholesale-pdp.liquid declares collection param');

  const headerRowLiquid = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'header-row.liquid'), 'utf8');
  assert(headerRowLiquid.includes('@param {string} [order]'), 'Issue 4: header-row.liquid declares order param');
  assert(headerRowLiquid.includes('@param {object} [settings]'), 'Issue 4: header-row.liquid declares settings param');
  assert(headerRowLiquid.includes('@param {string} [menu]'), 'Issue 4: header-row.liquid declares menu param');

  const dividerLiquid = fs.readFileSync(path.join(__dirname, '..', 'snippets', 'divider.liquid'), 'utf8');
  assert(dividerLiquid.includes('{% if attributes and block %}'), 'Issue 4: divider.liquid guards block.shopify_attributes safely');

  // 6. Check Orphaned Snippets
  const snippetsDir = path.join(__dirname, '..', 'snippets');
  const cartBubbleExists = fs.existsSync(path.join(snippetsDir, 'cart-bubble.liquid'));
  assert(cartBubbleExists, 'Issue 5: cart-bubble.liquid retained because it is used by _cart-title.liquid');
  const megaMenuExists = fs.existsSync(path.join(snippetsDir, 'mega-menu-list.liquid'));
  assert(!megaMenuExists, 'Issue 5: mega-menu-list.liquid removed from snippets/');
  const utilMegaExists = fs.existsSync(path.join(snippetsDir, 'util-mega-menu-img-sizes-attr.liquid'));
  assert(!utilMegaExists, 'Issue 5: util-mega-menu-img-sizes-attr.liquid removed from snippets/');
  const archivedMegaExists = fs.existsSync(path.join(__dirname, '..', '_backup_sprint4', 'archived_snippets', 'mega-menu-list.liquid'));
  assert(archivedMegaExists, 'Issue 5: mega-menu-list.liquid safely preserved in _backup_sprint4/archived_snippets/');

  // 7. Check Informational Templates
  const templatesDir = path.join(__dirname, '..', 'templates');
  const aboutPath = path.join(templatesDir, 'page.about.json');
  const faqPath = path.join(templatesDir, 'page.faq.json');
  assert(fs.existsSync(aboutPath), 'Issue 6: templates/page.about.json exists');
  assert(fs.existsSync(faqPath), 'Issue 6: templates/page.faq.json exists');

  try {
    const aboutJson = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    assert(aboutJson.sections && aboutJson.sections.brand_story && aboutJson.sections.trust_bar, 'Issue 6: page.about.json contains brand_story and trust_bar sections');
  } catch (e) {
    assert(false, 'Issue 6: page.about.json is valid JSON', e.message);
  }

  try {
    const faqJson = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
    assert(faqJson.sections && faqJson.sections.how_it_works && faqJson.sections.trust_bar, 'Issue 6: page.faq.json contains how_it_works and trust_bar sections');
  } catch (e) {
    assert(false, 'Issue 6: page.faq.json is valid JSON', e.message);
  }

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runSprint4Tests();
