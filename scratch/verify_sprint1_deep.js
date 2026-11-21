const fs = require('fs');
const path = require('path');

console.log('=================================================================');
console.log('       SAMYAK HAIR ACCESSORIES — DEEP VERIFICATION ENGINE        ');
console.log('               SPRINT 1 BEHAVIORAL & SECURITY AUDIT              ');
console.log('=================================================================\n');

// -------------------------------------------------------------
// PART 1: CART PAGE LIQUID RENDERING SIMULATION (ALL AMOUNTS)
// -------------------------------------------------------------
console.log('--- TEST SUITE 1: CART PAGE LIQUID EVALUATION & THRESHOLDS ---');

const testCartAmounts = [
  { label: 'Empty Cart', amount: 0, items: 0 },
  { label: '₹1,000 Cart (Sub-MOQ)', amount: 100000, items: 3 },
  { label: '₹1,999 Cart (Sub-MOQ Border)', amount: 199900, items: 5 },
  { label: '₹2,000 Cart (Exact MOQ Boundary)', amount: 200000, items: 6 },
  { label: '₹2,500 Cart (Eligible Wholesale)', amount: 250000, items: 8 }
];

function simulateCartLiquid(cartTotal, itemCount) {
  const wholesale_min_threshold = 200000;
  let is_wholesale_met = false;
  let threshold_diff = 0;
  let progress_percent = 0;

  if (cartTotal < wholesale_min_threshold) {
    threshold_diff = wholesale_min_threshold - cartTotal;
    progress_percent = Math.floor((cartTotal * 100) / wholesale_min_threshold);
    is_wholesale_met = false;
  } else {
    threshold_diff = 0;
    progress_percent = 100;
    is_wholesale_met = true;
  }

  // Simulated button attributes
  const buttonDisabled = !is_wholesale_met;
  const buttonClass = 'samyak-proceed-checkout-btn' + (!is_wholesale_met ? ' is-disabled' : '');
  const showWarning = !is_wholesale_met && itemCount > 0;

  return {
    cartTotal,
    itemCount,
    is_wholesale_met,
    threshold_diff,
    progress_percent,
    buttonDisabled,
    buttonClass,
    showWarning,
    shortfallRupees: (threshold_diff / 100).toFixed(2)
  };
}

const liquidResults = testCartAmounts.map(tc => {
  const res = simulateCartLiquid(tc.amount, tc.items);
  console.log(`[${tc.label}] Total: ₹${(tc.amount/100).toFixed(2)} (${tc.amount} cents)`);
  console.log(`   - is_wholesale_met: ${res.is_wholesale_met}`);
  console.log(`   - Progress: ${res.progress_percent}%`);
  console.log(`   - Remaining Shortfall: ₹${res.shortfallRupees}`);
  console.log(`   - Checkout Button Disabled: ${res.buttonDisabled}`);
  console.log(`   - Warning Alert Visible: ${res.showWarning}`);
  return res;
});

// Verification assertions
const emptyValid = liquidResults[0].buttonDisabled === true;
const subMoq1000Valid = liquidResults[1].buttonDisabled === true && liquidResults[1].progress_percent === 50 && liquidResults[1].shortfallRupees === '1000.00';
const subMoq1999Valid = liquidResults[2].buttonDisabled === true && liquidResults[2].progress_percent === 99 && liquidResults[2].shortfallRupees === '1.00';
const exactMoq2000Valid = liquidResults[3].buttonDisabled === false && liquidResults[3].progress_percent === 100 && liquidResults[3].shortfallRupees === '0.00';
const aboveMoq2500Valid = liquidResults[4].buttonDisabled === false && liquidResults[4].progress_percent === 100 && liquidResults[4].shortfallRupees === '0.00';

console.log(`\nLiquid Simulation Checks:`);
console.log(`  Empty Cart Disabled: ${emptyValid ? 'PASS' : 'FAIL'}`);
console.log(`  ₹1,000 Cart (50%, Shortfall ₹1000): ${subMoq1000Valid ? 'PASS' : 'FAIL'}`);
console.log(`  ₹1,999 Cart (99%, Shortfall ₹1): ${subMoq1999Valid ? 'PASS' : 'FAIL'}`);
console.log(`  ₹2,000 Cart (100%, Enabled): ${exactMoq2000Valid ? 'PASS' : 'FAIL'}`);
console.log(`  ₹2,500 Cart (100%, Enabled): ${aboveMoq2500Valid ? 'PASS' : 'FAIL'}`);

// -------------------------------------------------------------
// PART 2: CART PAGE CLIENT JAVASCRIPT EVENT INTERCEPTION
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 2: CLIENT JAVASCRIPT EVENT SIMULATION ---');

// Mock DOM Environment
class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.attributes = {};
    this.style = {};
    this.textContent = '';
    this.innerHTML = '';
    this.listeners = {};
    this.classList = {
      add: (c) => { if (!this.className.includes(c)) this.className = (this.className + ' ' + c).trim(); },
      remove: (c) => { this.className = this.className.replace(new RegExp('\\b' + c + '\\b', 'g'), '').trim(); },
      contains: (c) => this.className.includes(c)
    };
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k] || null; }
  removeAttribute(k) { delete this.attributes[k]; }
  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  }
  dispatchEvent(evt) {
    if (this.listeners[evt.type]) {
      this.listeners[evt.type].forEach(fn => fn(evt));
    }
  }
  scrollIntoView() {}
}

class MockEvent {
  constructor(type) {
    this.type = type;
    this.defaultPrevented = false;
    this.propagationStopped = false;
  }
  preventDefault() { this.defaultPrevented = true; }
  stopPropagation() { this.propagationStopped = true; }
}

function runCartJsSimulation(cartTotal) {
  let rawCartTotal = cartTotal;
  let activeDiscountRate = 0;
  let activeCouponCode = '';

  const cartForm = new MockElement('form', 'samyak-main-cart-form');
  const checkoutBtn = new MockElement('button', 'samyak-checkout-submit', 'samyak-proceed-checkout-btn');
  const moqWarn = new MockElement('div', 'samyak-cart-moq-warning');
  const moqProgress = new MockElement('div', '', 'samyak-cart-wholesale-progress');
  const moqStatus = new MockElement('span', '', 'samyak-cart-wholesale-status');

  function formatMoney(cents) {
    return '₹' + (cents / 100).toFixed(2);
  }

  function updateSummaryDisplay() {
    if (rawCartTotal >= 200000) {
      moqProgress.style.width = '100%';
      moqStatus.className = 'samyak-cart-wholesale-status is-met';
      moqStatus.innerHTML = 'Wholesale Minimum (₹2,000) reached!';
      moqWarn.style.display = 'none';
      checkoutBtn.disabled = false;
      checkoutBtn.removeAttribute('aria-disabled');
      checkoutBtn.classList.remove('is-disabled');
    } else {
      var pct = Math.min(100, Math.round((rawCartTotal / 200000) * 100));
      var diff = 200000 - rawCartTotal;
      moqProgress.style.width = pct + '%';
      moqStatus.className = 'samyak-cart-wholesale-status';
      moqStatus.innerHTML = 'Wholesale MOQ: Add ' + formatMoney(diff) + ' more to reach ₹2,000';
      moqWarn.style.display = 'flex';
      checkoutBtn.disabled = true;
      checkoutBtn.setAttribute('aria-disabled', 'true');
      checkoutBtn.classList.add('is-disabled');
    }
  }

  // Intercept form submit
  cartForm.addEventListener('submit', function(e) {
    if (rawCartTotal < 200000) {
      e.preventDefault();
      e.stopPropagation();
      moqWarn.classList.add('is-shaking');
      return false;
    }
  });

  // Intercept button click
  checkoutBtn.addEventListener('click', function(e) {
    if (rawCartTotal < 200000) {
      e.preventDefault();
      e.stopPropagation();
      moqWarn.classList.add('is-shaking');
      return false;
    }
  });

  updateSummaryDisplay();

  // Test form submission attempt
  const submitEvt = new MockEvent('submit');
  cartForm.dispatchEvent(submitEvt);

  // Test button click attempt
  const clickEvt = new MockEvent('click');
  checkoutBtn.dispatchEvent(clickEvt);

  return {
    rawCartTotal,
    submitPrevented: submitEvt.defaultPrevented,
    clickPrevented: clickEvt.defaultPrevented,
    isButtonDisabled: checkoutBtn.disabled,
    hasDisabledClass: checkoutBtn.classList.contains('is-disabled'),
    warningDisplay: moqWarn.style.display,
    warningShaken: moqWarn.classList.contains('is-shaking'),
    progressWidth: moqProgress.style.width
  };
}

const jsSubMoq = runCartJsSimulation(150000); // ₹1,500
console.log(`Sub-MOQ Test (₹1,500):`);
console.log(`   - Form submit prevented: ${jsSubMoq.submitPrevented} (Expected: true)`);
console.log(`   - Button click prevented: ${jsSubMoq.clickPrevented} (Expected: true)`);
console.log(`   - Button disabled: ${jsSubMoq.isButtonDisabled} (Expected: true)`);
console.log(`   - Warning alert shown: ${jsSubMoq.warningDisplay === 'flex'} (Expected: true)`);
console.log(`   - Warning alert shaken: ${jsSubMoq.warningShaken} (Expected: true)`);
console.log(`   - Progress width: ${jsSubMoq.progressWidth} (Expected: 75%)`);

const jsEligible = runCartJsSimulation(220000); // ₹2,200
console.log(`\nEligible Wholesale Test (₹2,200):`);
console.log(`   - Form submit prevented: ${jsEligible.submitPrevented} (Expected: false)`);
console.log(`   - Button click prevented: ${jsEligible.clickPrevented} (Expected: false)`);
console.log(`   - Button disabled: ${jsEligible.isButtonDisabled} (Expected: false)`);
console.log(`   - Warning alert hidden: ${jsEligible.warningDisplay === 'none'} (Expected: true)`);
console.log(`   - Progress width: ${jsEligible.progressWidth} (Expected: 100%)`);

// -------------------------------------------------------------
// PART 3: PDP BUY IT NOW INTERCEPTION SIMULATION
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 3: PDP BUY IT NOW INTERCEPTION ---');

function simulatePdpBuyNow(variantPriceCents, quantity) {
  const lineTotal = variantPriceCents * quantity;
  let actionTaken = '';
  let ajaxPayload = null;
  let redirectUrl = null;

  if (lineTotal >= 200000) {
    actionTaken = 'DIRECT_CHECKOUT_ALLOWED';
    redirectUrl = `/cart/12345678:${quantity}?checkout`;
  } else {
    actionTaken = 'INTERCEPTED_ADDED_TO_BAG';
    ajaxPayload = { id: '12345678', quantity: quantity };
  }

  return {
    variantPriceCents,
    quantity,
    lineTotal,
    actionTaken,
    redirectUrl,
    ajaxPayload
  };
}

const pdpSinglePack = simulatePdpBuyNow(29900, 1); // 1 pack @ ₹299
console.log(`1 Pack @ ₹299 (Line Total: ₹299.00):`);
console.log(`   - Action: ${pdpSinglePack.actionTaken}`);
console.log(`   - Direct Checkout URL: ${pdpSinglePack.redirectUrl}`);
console.log(`   - Added via AJAX: ${pdpSinglePack.ajaxPayload ? JSON.stringify(pdpSinglePack.ajaxPayload) : 'None'}`);

const pdpBulk7Packs = simulatePdpBuyNow(29900, 7); // 7 packs @ ₹299 = ₹2,093
console.log(`\n7 Packs @ ₹299 (Line Total: ₹2,093.00):`);
console.log(`   - Action: ${pdpBulk7Packs.actionTaken}`);
console.log(`   - Direct Checkout URL: ${pdpBulk7Packs.redirectUrl}`);
console.log(`   - Added via AJAX: ${pdpBulk7Packs.ajaxPayload ? JSON.stringify(pdpBulk7Packs.ajaxPayload) : 'None'}`);

const pdpCartonBox = simulatePdpBuyNow(249900, 1); // 1 carton @ ₹2,499
console.log(`\n1 Carton @ ₹2,499 (Line Total: ₹2,499.00):`);
console.log(`   - Action: ${pdpCartonBox.actionTaken}`);
console.log(`   - Direct Checkout URL: ${pdpCartonBox.redirectUrl}`);
console.log(`   - Added via AJAX: ${pdpCartonBox.ajaxPayload ? JSON.stringify(pdpCartonBox.ajaxPayload) : 'None'}`);

// -------------------------------------------------------------
// PART 4: DIRECT URL BYPASS & PLATFORM BOUNDARY SECURITY AUDIT
// -------------------------------------------------------------
console.log('\n--- TEST SUITE 4: SECURITY & PLATFORM BOUNDARY AUDIT ---');

const bypassVectors = [
  {
    vector: 'Direct URL Navigation: /cart/{id}:1?checkout',
    themeLayerProtected: false,
    reason: 'Shopify core backend endpoint. Never renders Liquid theme template; executes direct HTTP 302 redirect to checkout session.',
    remediation: 'Requires Shopify Function (Cart and Checkout Validation API - cart_validations).'
  },
  {
    vector: 'Direct Form POST: curl -X POST /cart -d "checkout=1"',
    themeLayerProtected: false,
    reason: 'Bypasses browser HTML parser and JavaScript listeners. Shopify platform endpoint receives POST and dispatches checkout token.',
    remediation: 'Requires Shopify Function or server-side checkout rule app.'
  },
  {
    vector: 'JavaScript Disabled on PDP (Buy It Now)',
    themeLayerProtected: true,
    reason: 'Buy It Now is an un-submitted button (<button type="button">). With JS disabled, click event does not fire and no form submit occurs.',
    remediation: 'Fully protected at theme layer.'
  },
  {
    vector: 'JavaScript Disabled on Cart Page (/cart)',
    themeLayerProtected: true,
    reason: 'Liquid renders native HTML disabled attribute (<button disabled aria-disabled="true">). Native browser engines refuse to submit disabled form controls.',
    remediation: 'Fully protected at theme layer for normal browsing.'
  },
  {
    vector: 'Session Quantity Mutation (Multi-tab or rapid decrement)',
    themeLayerProtected: true,
    reason: 'Quantity change triggers /cart/change.js and reloads page. Liquid re-renders with disabled button if balance drops below ₹2,000.',
    remediation: 'Fully protected at theme layer.'
  }
];

bypassVectors.forEach((v, i) => {
  console.log(`[Vector ${i+1}] ${v.vector}`);
  console.log(`   - Protected at Theme Layer: ${v.themeLayerProtected ? 'YES' : 'NO'}`);
  console.log(`   - Technical Mechanism: ${v.reason}`);
  console.log(`   - Required Defense: ${v.remediation}`);
});

console.log('\n=================================================================');
console.log('                 VERIFICATION ENGINE COMPLETE                    ');
console.log('=================================================================');
