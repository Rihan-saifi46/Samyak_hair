/**
 * SAMYAK HAIR ACCESSORIES — SPRINT 3 VERIFICATION & REGRESSION SUITE
 * 
 * Verifies all 7 authorized Sprint 3 (P2 Medium Priority) remediations,
 * including Shopify Online Store 2.0 JSON Template Validation rules:
 * 1. BUG-MED-001: Collection Directory Image & Card Restoration (Static block not in block_order)
 * 2. BUG-MED-002: Blog Listing Article Card Blocks Restoration (Static block not in block_order)
 * 3. BUG-MED-003: Dynamic Category-Aware Product Specifications on PDP
 * 4. BUG-MED-004: Theme Editor Product Blocks & App Widgets Passthrough
 * 5. BUG-MED-005: Circular Border-Radius Platform Trap Correction
 * 6. BUG-MED-006: Honest Delivery & Courier Advisory replacing Mock PIN Checker
 * 7. BUG-MED-007: Header Schema Settings Streamlining within 40-setting limit
 * 
 * PLUS: Comprehensive regression checks for Sprint 1 (P0) and Sprint 2 (P1).
 */

const fs = require('fs');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
  }
}

console.log('=================================================================');
console.log('       SAMYAK HAIR ACCESSORIES — SPRINT 3 VERIFICATION SUITE     ');
console.log('=================================================================\n');

// --- 1. BUG-MED-001 (Collection Directory Image & Card Restoration) ---
console.log('--- TEST 1: BUG-MED-001 (Collection Directory /collections) ---');
runTest('templates/list-collections.json is valid JSON', () => {
  const raw = fs.readFileSync('templates/list-collections.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  assert(json.sections && json.sections.collection_list_Wfgh3m, 'Missing collection_list section');
});

runTest('collection-card-image is defined in static-collection-card.blocks with static: true', () => {
  const raw = fs.readFileSync('templates/list-collections.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  const card = json.sections.collection_list_Wfgh3m.blocks['static-collection-card'];
  assert(card, 'Missing static-collection-card');
  assert(card.blocks['collection-card-image'], 'collection-card-image missing from blocks');
  assert.strictEqual(card.blocks['collection-card-image'].static, true, 'collection-card-image must have static: true');
});

runTest('Shopify Schema Rule: Static block collection-card-image MUST NOT be present in block_order', () => {
  const raw = fs.readFileSync('templates/list-collections.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  const card = json.sections.collection_list_Wfgh3m.blocks['static-collection-card'];
  assert(!card.block_order.includes('collection-card-image'), 'Static block collection-card-image found in block_order! Violates Shopify schema.');
  assert(card.block_order.includes('collection_title_7YgBPU'), 'Dynamic title block missing from block_order');
});

runTest('max_collections is updated to 16 (schema max) (up from 4)', () => {
  const raw = fs.readFileSync('templates/list-collections.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  assert.strictEqual(json.sections.collection_list_Wfgh3m.settings.max_collections, 16);
});

// --- 2. BUG-MED-002 (Blog Listing Article Card Blocks Restoration) ---
console.log('\n--- TEST 2: BUG-MED-002 (Blog Listing /blogs/news) ---');
runTest('templates/blog.json is valid JSON', () => {
  const raw = fs.readFileSync('templates/blog.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  assert(json.sections && json.sections.main, 'Missing main section in blog.json');
});

runTest('static-blog-post-card is defined with static: true and child blocks (image, heading, details)', () => {
  const raw = fs.readFileSync('templates/blog.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  const card = json.sections.main.blocks['static-blog-post-card'];
  assert(card, 'Missing static-blog-post-card block definition');
  assert.strictEqual(card.static, true, 'static-blog-post-card must be static: true');
  assert(card.blocks['image'], 'Missing image block');
  assert(card.blocks['heading'], 'Missing heading block');
  assert(card.blocks['blog-post-details'], 'Missing blog-post-details block');
});

runTest('Shopify Schema Rule: Static block static-blog-post-card MUST NOT be present in main.block_order', () => {
  const raw = fs.readFileSync('templates/blog.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  assert(!json.sections.main.block_order.includes('static-blog-post-card'), 'Static block static-blog-post-card found in main.block_order! Violates Shopify schema.');
  assert(json.sections.main.block_order.includes('title'), 'Dynamic title block missing from main.block_order');
});

runTest('Shopify Schema Rule: Static child blocks inside static-blog-post-card MUST NOT be in block_order', () => {
  const raw = fs.readFileSync('templates/blog.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  const card = json.sections.main.blocks['static-blog-post-card'];
  assert.strictEqual(card.block_order.length, 0, 'static-blog-post-card block_order must be empty [] because children are static');
});

// --- 3. BUG-MED-003 (Dynamic Category-Aware Specifications) ---
console.log('\n--- TEST 3: BUG-MED-003 (Dynamic Category-Aware Specifications on PDP) ---');
runTest('wholesale-pdp detects categories (is_claw, is_scrunchie, is_hairband, is_hairpin, is_jewelry)', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('assign is_claw = true'), 'Missing is_claw assignment');
  assert(code.includes('assign is_scrunchie = true'), 'Missing is_scrunchie assignment');
  assert(code.includes('assign is_hairband = true'), 'Missing is_hairband assignment');
  assert(code.includes('assign is_hairpin = true'), 'Missing is_hairpin assignment');
  assert(code.includes('assign is_jewelry = true'), 'Missing is_jewelry assignment');
});

runTest('wholesale-pdp supports custom material and pack metafields with fallbacks', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('product.metafields.custom.material'), 'Missing material metafield lookup');
  assert(code.includes('product.metafields.custom.pack_specification'), 'Missing pack_specification metafield lookup');
});

runTest('wholesale-pdp renders product.description inside Key Features accordion', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('{{ product.description }}'), 'product.description not rendered in accordion');
  assert(code.includes('samyak-pdp-description-content'), 'Missing description wrapper class');
});

// --- 4. BUG-MED-004 (Theme Editor App Blocks & Product Blocks Passthrough) ---
console.log('\n--- TEST 4: BUG-MED-004 (Theme Editor Product Blocks & App Widgets Passthrough) ---');
runTest('product-information.liquid passes additional_blocks to wholesale-pdp', () => {
  const code = fs.readFileSync('sections/product-information.liquid', 'utf8');
  assert(code.includes('additional_blocks: additional_blocks'), 'additional_blocks not passed to wholesale-pdp');
});

runTest('wholesale-pdp declares additional_blocks in doc comment and renders it', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('@param {string} [additional_blocks]'), 'Missing doc annotation for additional_blocks');
  assert(code.includes('{{ additional_blocks }}'), 'wholesale-pdp does not render additional_blocks');
  assert(code.includes('data-theme-editor-blocks'), 'Missing data-theme-editor-blocks attribute');
});

runTest('product-information.liquid has enable_custom_wholesale_pdp toggle', () => {
  const code = fs.readFileSync('sections/product-information.liquid', 'utf8');
  assert(code.includes('enable_custom_wholesale_pdp'), 'Missing enable_custom_wholesale_pdp setting');
  assert(!code.includes('assign media_gallery ='), 'Unused media_gallery variable assignment should be removed');
  assert(!code.includes('assign product_details ='), 'Unused product_details variable assignment should be removed');
});

// --- 5. BUG-MED-005 (Circular Border-Radius Platform Custom CSS Trap) ---
console.log('\n--- TEST 5: BUG-MED-005 (Circular Border-Radius Platform Trap in settings_data.json) ---');
runTest('settings_data.json is valid JSON with comments stripped', () => {
  const raw = fs.readFileSync('config/settings_data.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  assert(json.platform_customizations, 'platform_customizations object missing');
});

runTest('platform_customizations.custom_css has purged the 50% border radius rules', () => {
  const raw = fs.readFileSync('config/settings_data.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  const customCss = json.platform_customizations.custom_css || [];
  assert.strictEqual(customCss.length, 0, 'custom_css array must be empty');
  assert(!raw.includes('border-radius: 50% !important'), 'Circular 50% border radius CSS string still found in file');
});

// --- 6. BUG-MED-006 (Honest Delivery & Courier Advisory replacing Mock PIN Checker) ---
console.log('\n--- TEST 6: BUG-MED-006 (Honest Delivery & Courier Advisory) ---');
runTest('Fake regex validation /d{6}/ returning instant unverified success is removed', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(!code.includes('Express wholesale dispatch available for'), 'Old mock success message still present');
});

runTest('Indian postal zone validation checks civilian zones (first digit 1–8)', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('firstDigit < 1 || firstDigit > 8'), 'Missing postal zone range check 1-8');
  assert(code.includes('starting with digits 1–8'), 'Missing civilian postal code warning');
});

runTest('Honest transit matrix and courier partners clearly displayed', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('Dispatches in 24–48h from Central Delhi'), 'Missing dispatch timeline heading');
  assert(code.includes('Delhi NCR: 1–2 Days'), 'Missing Delhi NCR transit advisory');
  assert(code.includes('Metros: 2–3 Days'), 'Missing Metros transit advisory');
  assert(code.includes('Delhivery Express'), 'Missing courier partner information');
});

// --- 7. BUG-MED-007 (Header Section Settings Schema Streamlining <= 40) ---
console.log('\n--- TEST 7: BUG-MED-007 (Header Section Settings Schema Streamlining) ---');
runTest('sections/header.liquid input settings count is strictly <= 40', () => {
  const code = fs.readFileSync('sections/header.liquid', 'utf8');
  const schemaMatch = code.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  assert(schemaMatch, 'Missing schema in header.liquid');
  const schema = JSON.parse(schemaMatch[1]);
  const inputSettings = schema.settings.filter(st => st.type !== 'header' && st.type !== 'paragraph');
  console.log(`      -> Verified header input setting count: ${inputSettings.length} (ceiling: 40)`);
  assert(inputSettings.length <= 40, `Header declares ${inputSettings.length} settings, exceeding maximum of 40!`);
});

runTest('Unused dead settings (home_inverse_logo, product_inverse_logo, collection_inverse_logo, logo_position) pruned', () => {
  const code = fs.readFileSync('sections/header.liquid', 'utf8');
  assert(!code.includes('"id": "home_inverse_logo"'), 'home_inverse_logo should be removed');
  assert(!code.includes('"id": "product_inverse_logo"'), 'product_inverse_logo should be removed');
  assert(!code.includes('"id": "collection_inverse_logo"'), 'collection_inverse_logo should be removed');
  assert(!code.includes('"id": "logo_position"'), 'logo_position should be removed');
});

runTest('sections/header-group.json is valid JSON', () => {
  const raw = fs.readFileSync('sections/header-group.json', 'utf8').replace(/\/\*[\s\S]*?\*\//, '');
  const json = JSON.parse(raw);
  assert(json.sections && json.sections.header_section, 'header_section missing from header-group.json');
});

// --- 8. SPRINT 1 & 2 REGRESSION TESTS ---
console.log('\n--- TEST 8: SPRINT 1 & SPRINT 2 REGRESSION VALIDATION ---');
runTest('BUG-CRIT-001 (Mobile Navigation Drawer Trigger) preserved', () => {
  const code = fs.readFileSync('snippets/header-row.liquid', 'utf8');
  assert(code.includes('samyak-hdr-drawer-trigger'), 'Drawer trigger class missing');
  assert(code.includes('{{ first }}'), 'Drawer trigger content missing');
});

runTest('BUG-CRIT-002 (PDP Buy It Now Wholesale MOQ Interception) preserved', () => {
  const code = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
  assert(code.includes('lineTotal >= 200000'), 'Wholesale ₹2,000 threshold check missing');
  assert(code.includes('fetch(\'/cart/add.js\''), 'Cart add AJAX call missing');
});

runTest('BUG-CRIT-003 (Cart Page Wholesale MOQ Lock & Progress Bar) preserved', () => {
  const code = fs.readFileSync('sections/main-cart.liquid', 'utf8');
  assert(code.includes('wholesale_min_threshold = 200000'), 'Cart threshold check missing');
  assert(code.includes('id="samyak-cart-moq-warning"'), 'Cart MOQ warning element missing');
});

runTest('BUG-HIGH-001 (Dynamic Header Navigation from linklists) preserved', () => {
  const code = fs.readFileSync('snippets/search.liquid', 'utf8');
  assert(code.includes("linklists['main-menu']"), 'linklists link missing');
  assert(code.includes('samyak-nav-dropdown-wrap'), 'Dropdown markup missing');
});

runTest('BUG-HIGH-002 (Wishlist Destination Page /pages/wishlist) preserved', () => {
  assert(fs.existsSync('templates/page.wishlist.json'), 'templates/page.wishlist.json missing');
  assert(fs.existsSync('sections/main-wishlist.liquid'), 'sections/main-wishlist.liquid missing');
  const code = fs.readFileSync('sections/main-wishlist.liquid', 'utf8');
  assert(code.includes('samyak_wishlist'), 'localStorage key missing');
});

runTest('BUG-HIGH-003 (Category Image Replacement - zero competitor CDN hotlinks) preserved', () => {
  const code = fs.readFileSync('snippets/homepage-category-grid.liquid', 'utf8');
  assert(!code.includes('cdn.impression4u.com'), 'Competitor CDN hotlinks found in category grid!');
});

runTest('BUG-HIGH-004 (Bento Grid Global Indexing & dense auto-flow) preserved', () => {
  const collCode = fs.readFileSync('sections/main-collection.liquid', 'utf8');
  assert(collCode.includes('global_offset = paginate.current_offset'), 'current_offset missing');
  assert(collCode.includes('global_index = global_offset | plus: forloop.index0'), 'global_index missing');
  assert(collCode.includes('products_per_page = 30'), 'products_per_page 30 missing');
});

runTest('BUG-HIGH-008 (Cart Drawer SRA Target Synchronization) preserved', () => {
  const qsd = fs.readFileSync('snippets/quick-shop-drawer.liquid', 'utf8');
  assert(qsd.includes('/cart?section_id=cart-drawer'), 'Target mismatch in quick-shop-drawer');
  const cd = fs.readFileSync('snippets/cart-drawer.liquid', 'utf8');
  assert(cd.includes('id="shopify-section-cart-drawer"'), 'Live DOM ID mismatch in cart-drawer');
});

console.log('\n=================================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log('>>> ALL SPRINT 3 IMPLEMENTATION & REGRESSION CHECKS PASSED! <<<');
} else {
  console.error('>>> SOME CHECKS FAILED! Inspect errors above. <<<');
  process.exit(1);
}
console.log('=================================================================\n');
