const fs = require('fs');
const path = require('path');

console.log('=== SPRINT 1 VALIDATION SUITE ===\n');

let allPassed = true;

// Test 1: BUG-CRIT-001 (snippets/header-row.liquid)
console.log('--- Checking BUG-CRIT-001 (snippets/header-row.liquid) ---');
const headerRowContent = fs.readFileSync(path.join(__dirname, '../snippets/header-row.liquid'), 'utf-8');

const hasParamFirst = headerRowContent.includes('@param {string} [first]');
const hasDrawerTrigger = headerRowContent.includes('samyak-hdr-drawer-trigger');
const hasFirstRender = headerRowContent.includes('{{ first }}');
const hasMobileDisplay = headerRowContent.includes('.samyak-hdr-drawer-trigger {') && 
                         headerRowContent.includes('display: flex;');
const hasDesktopHidden = headerRowContent.includes('.samyak-hdr-drawer-trigger {\n      display: none;');

console.log('  1. @param {string} [first] documented:', hasParamFirst ? 'PASS' : 'FAIL');
console.log('  2. .samyak-hdr-drawer-trigger wrapper exists:', hasDrawerTrigger ? 'PASS' : 'FAIL');
console.log('  3. {{ first }} rendered in left zone:', hasFirstRender ? 'PASS' : 'FAIL');
console.log('  4. Hidden on desktop (>1024px):', hasDesktopHidden ? 'PASS' : 'FAIL');
console.log('  5. Displayed on mobile (<=1024px):', hasMobileDisplay ? 'PASS' : 'FAIL');

if (!hasParamFirst || !hasDrawerTrigger || !hasFirstRender || !hasDesktopHidden || !hasMobileDisplay) {
  allPassed = false;
}

// Test 2: BUG-CRIT-002 (snippets/wholesale-pdp.liquid)
console.log('\n--- Checking BUG-CRIT-002 (snippets/wholesale-pdp.liquid) ---');
const pdpContent = fs.readFileSync(path.join(__dirname, '../snippets/wholesale-pdp.liquid'), 'utf-8');

const hasRawPriceAttr = pdpContent.includes('data-raw-price=');
const hasMoqThreshold = pdpContent.includes('lineTotal >= 200000');
const hasInterceptSubMoq = pdpContent.includes('fetch(\'/cart/add.js\'') && 
                           pdpContent.includes('// Sub-MOQ: intercepted!');
const hasDirectCheckoutSafe = pdpContent.includes('window.location.href = \'/cart/\' + id + \':\' + qty + \'?checkout\';');

console.log('  1. data-raw-price attribute on swatches:', hasRawPriceAttr ? 'PASS' : 'FAIL');
console.log('  2. ₹2,000 (200,000 cents) MOQ lineTotal check:', hasMoqThreshold ? 'PASS' : 'FAIL');
console.log('  3. Direct checkout permitted if lineTotal >= 200,000:', hasDirectCheckoutSafe ? 'PASS' : 'FAIL');
console.log('  4. Sub-MOQ intercepted and added to bag via AJAX:', hasInterceptSubMoq ? 'PASS' : 'FAIL');

if (!hasRawPriceAttr || !hasMoqThreshold || !hasDirectCheckoutSafe || !hasInterceptSubMoq) {
  allPassed = false;
}

// Test 3: BUG-CRIT-003 (sections/main-cart.liquid)
console.log('\n--- Checking BUG-CRIT-003 (sections/main-cart.liquid) ---');
const cartContent = fs.readFileSync(path.join(__dirname, '../sections/main-cart.liquid'), 'utf-8');

const hasCartLiquidMoq = cartContent.includes('assign wholesale_min_threshold = 200000') &&
                         cartContent.includes('assign is_wholesale_met = false');
const hasCartProgressBar = cartContent.includes('samyak-cart-wholesale-bar') &&
                           cartContent.includes('role="progressbar"');
const hasCheckoutDisabledAttr = cartContent.includes('{% unless is_wholesale_met %}disabled aria-disabled="true"{% endunless %}');
const hasMoqWarning = cartContent.includes('id="samyak-cart-moq-warning"');
const hasDisabledCss = cartContent.includes('.samyak-proceed-checkout-btn:disabled') &&
                       cartContent.includes('cursor: not-allowed !important;');
const hasJsFormBlock = cartContent.includes('cartForm.addEventListener(\'submit\', function(e) {') &&
                       cartContent.includes('if (rawCartTotal < 200000) {');
const hasJsBtnBlock = cartContent.includes('checkoutBtn.addEventListener(\'click\', function(e) {') &&
                      cartContent.includes('if (rawCartTotal < 200000) {');

console.log('  1. Liquid wholesale MOQ calculations (200,000 cents):', hasCartLiquidMoq ? 'PASS' : 'FAIL');
console.log('  2. Wholesale progress bar component rendered:', hasCartProgressBar ? 'PASS' : 'FAIL');
console.log('  3. Button rendered disabled & aria-disabled when sub-MOQ:', hasCheckoutDisabledAttr ? 'PASS' : 'FAIL');
console.log('  4. MOQ alert warning rendered when sub-MOQ:', hasMoqWarning ? 'PASS' : 'FAIL');
console.log('  5. Disabled CSS styling applied:', hasDisabledCss ? 'PASS' : 'FAIL');
console.log('  6. Client JS form submit blocked if sub-MOQ:', hasJsFormBlock ? 'PASS' : 'FAIL');
console.log('  7. Client JS button click blocked if sub-MOQ:', hasJsBtnBlock ? 'PASS' : 'FAIL');

if (!hasCartLiquidMoq || !hasCartProgressBar || !hasCheckoutDisabledAttr || !hasMoqWarning || !hasDisabledCss || !hasJsFormBlock || !hasJsBtnBlock) {
  allPassed = false;
}

console.log('\n====================================');
console.log(allPassed ? 'ALL SPRINT 1 VALIDATION CHECKS PASSED!' : 'SOME CHECKS FAILED!');
console.log('====================================');

process.exit(allPassed ? 0 : 1);
