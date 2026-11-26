const assert = require('assert');

console.log('=== RUNTIME SIMULATION TEST: CART & WISHLIST SYNCHRONIZATION ===\n');

// Mock DOM & Storage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

const elements = {};
function createMockElement(id, initialDisplay = 'none', initialText = '0') {
  return {
    id,
    textContent: initialText,
    style: { display: initialDisplay }
  };
}

elements['samyak-header-wishlist-count'] = createMockElement('samyak-header-wishlist-count');
elements['samyak-mbn-wishlist-count'] = createMockElement('samyak-mbn-wishlist-count');
elements['samyak-header-cart-count'] = createMockElement('samyak-header-cart-count');
elements['samyak-mbn-cart-count'] = createMockElement('samyak-mbn-cart-count');
elements['samyak-wl-count-badge'] = createMockElement('samyak-wl-count-badge');
elements['samyak-wl-body'] = createMockElement('samyak-wl-body', 'none');
elements['samyak-wl-empty'] = createMockElement('samyak-wl-empty', 'flex');
elements['samyak-wl-footer'] = createMockElement('samyak-wl-footer', 'none');

const eventListeners = {};
global.document = {
  getElementById: (id) => elements[id] || null,
  querySelectorAll: (selector) => {
    if (selector.includes('cart-badge') || selector.includes('cart-count')) {
      return [elements['samyak-header-cart-count'], elements['samyak-mbn-cart-count']];
    }
    return [];
  },
  addEventListener: (type, handler) => {
    if (!eventListeners[type]) eventListeners[type] = [];
    eventListeners[type].push(handler);
  },
  dispatchEvent: (event) => {
    if (eventListeners[event.type]) {
      eventListeners[event.type].forEach(h => h(event));
    }
  }
};

global.window = {
  addEventListener: (type, handler) => {
    if (!eventListeners[type]) eventListeners[type] = [];
    eventListeners[type].push(handler);
  }
};

// Execute Wishlist drawer logic
function renderWishlistDrawer() {
  let list = [];
  try {
    const raw = localStorage.getItem('samyak_wishlist');
    list = raw ? JSON.parse(raw) : [];
  } catch(e) {}

  const totalItems = list.length;
  const countEl = document.getElementById('samyak-wl-count-badge');
  if (countEl) countEl.textContent = totalItems + (totalItems === 1 ? ' item' : ' items');

  const hdrBadge = document.getElementById('samyak-header-wishlist-count');
  if (hdrBadge) {
    if (totalItems > 0) {
      hdrBadge.textContent = totalItems;
      hdrBadge.style.display = 'flex';
    } else {
      hdrBadge.style.display = 'none';
    }
  }

  const mbnBadge = document.getElementById('samyak-mbn-wishlist-count');
  if (mbnBadge) {
    if (totalItems > 0) {
      mbnBadge.textContent = totalItems;
      mbnBadge.style.display = 'flex';
    } else {
      mbnBadge.style.display = 'none';
    }
  }
}

// Execute Mobile Nav script logic
function syncMbnWishlistBadge() {
  try {
    const raw = localStorage.getItem('samyak_wishlist');
    const list = raw ? JSON.parse(raw) : [];
    const count = Array.isArray(list) ? list.length : 0;
    const badge = document.getElementById('samyak-mbn-wishlist-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  } catch (e) {}
}

function updateAllCartBadges(count) {
  const num = parseInt(count, 10);
  const valid = !isNaN(num) && num >= 0 ? num : 0;

  const mbnBadge = document.getElementById('samyak-mbn-cart-count');
  if (mbnBadge) {
    mbnBadge.textContent = valid;
    mbnBadge.style.display = valid > 0 ? 'flex' : 'none';
  }

  const hdrBadge = document.getElementById('samyak-header-cart-count');
  if (hdrBadge) {
    hdrBadge.textContent = valid;
    hdrBadge.style.display = valid > 0 ? 'flex' : 'none';
  }
}

function handleCartEvent(event) {
  if (event && event.promise && typeof event.promise.then === 'function') {
    event.promise.then(result => {
      const cart = result && result.cart;
      const count = (cart && typeof cart.totalQuantity !== 'undefined') ? cart.totalQuantity : null;
      if (count !== null) updateAllCartBadges(count);
    });
  } else if (event && event.detail && typeof event.detail.itemCount !== 'undefined') {
    updateAllCartBadges(event.detail.itemCount);
  } else if (event && event.detail && event.detail.cart && typeof event.detail.cart.item_count !== 'undefined') {
    updateAllCartBadges(event.detail.cart.item_count);
  }
}

// Register listeners
document.addEventListener('wishlist:updated', renderWishlistDrawer);
document.addEventListener('wishlist:updated', syncMbnWishlistBadge);
document.addEventListener('shopify:cart:lines-update', handleCartEvent);
document.addEventListener('cart:updated', handleCartEvent);

console.log('--- Test 1: Initial State (Empty) ---');
syncMbnWishlistBadge();
renderWishlistDrawer();
updateAllCartBadges(0);

assert.strictEqual(elements['samyak-mbn-wishlist-count'].style.display, 'none');
assert.strictEqual(elements['samyak-header-wishlist-count'].style.display, 'none');
assert.strictEqual(elements['samyak-mbn-cart-count'].style.display, 'none');
assert.strictEqual(elements['samyak-header-cart-count'].style.display, 'none');
console.log('  [PASS] Empty state: all badges hidden with display: none');

console.log('\n--- Test 2: Add 1 Product to Wishlist ---');
localStorage.setItem('samyak_wishlist', JSON.stringify([{ id: '101', title: 'Korean Claw Clip' }]));
document.dispatchEvent({ type: 'wishlist:updated' });

assert.strictEqual(elements['samyak-mbn-wishlist-count'].textContent, 1);
assert.strictEqual(elements['samyak-mbn-wishlist-count'].style.display, 'flex');
assert.strictEqual(elements['samyak-header-wishlist-count'].textContent, 1);
assert.strictEqual(elements['samyak-header-wishlist-count'].style.display, 'flex');
console.log('  [PASS] Wishlist badge incremented to 1 and visible on both mobile and desktop');

console.log('\n--- Test 3: Add 2 More Products to Wishlist ---');
localStorage.setItem('samyak_wishlist', JSON.stringify([
  { id: '101', title: 'Korean Claw Clip' },
  { id: '102', title: 'Pastel Matte Clutcher' },
  { id: '103', title: 'Butterfly Clip' }
]));
document.dispatchEvent({ type: 'wishlist:updated' });

assert.strictEqual(elements['samyak-mbn-wishlist-count'].textContent, 3);
assert.strictEqual(elements['samyak-header-wishlist-count'].textContent, 3);
console.log('  [PASS] Wishlist badge incremented to 3 on both mobile and desktop');

console.log('\n--- Test 4: Clear Wishlist ---');
localStorage.setItem('samyak_wishlist', JSON.stringify([]));
document.dispatchEvent({ type: 'wishlist:updated' });

assert.strictEqual(elements['samyak-mbn-wishlist-count'].style.display, 'none');
assert.strictEqual(elements['samyak-header-wishlist-count'].style.display, 'none');
console.log('  [PASS] Wishlist badge cleanly hidden on both mobile and desktop when emptied');

console.log('\n--- Test 5: Cart Add Event via StandardEvents promise ---');
const cartPromise = Promise.resolve({
  cart: { totalQuantity: 4, lines: [] }
});
document.dispatchEvent({
  type: 'shopify:cart:lines-update',
  promise: cartPromise
});

// Await settlement
cartPromise.then(() => {
  assert.strictEqual(elements['samyak-mbn-cart-count'].textContent, 4);
  assert.strictEqual(elements['samyak-mbn-cart-count'].style.display, 'flex');
  assert.strictEqual(elements['samyak-header-cart-count'].textContent, 4);
  assert.strictEqual(elements['samyak-header-cart-count'].style.display, 'flex');
  console.log('  [PASS] Cart count updated to 4 and visible via Shopify cartLinesUpdate promise');

  console.log('\n--- Test 6: Cart Update to 0 (Remove items) ---');
  const emptyPromise = Promise.resolve({
    cart: { totalQuantity: 0, lines: [] }
  });
  document.dispatchEvent({
    type: 'shopify:cart:lines-update',
    promise: emptyPromise
  });

  return emptyPromise;
}).then(() => {
  assert.strictEqual(elements['samyak-mbn-cart-count'].textContent, 0);
  assert.strictEqual(elements['samyak-mbn-cart-count'].style.display, 'none');
  assert.strictEqual(elements['samyak-header-cart-count'].style.display, 'none');
  console.log('  [PASS] Cart badge cleanly hidden when totalQuantity is 0');

  console.log('\n--- Test 7: Custom cart:updated event with detail ---');
  document.dispatchEvent({
    type: 'cart:updated',
    detail: { cart: { item_count: 7 } }
  });
  assert.strictEqual(elements['samyak-mbn-cart-count'].textContent, 7);
  assert.strictEqual(elements['samyak-mbn-cart-count'].style.display, 'flex');
  assert.strictEqual(elements['samyak-header-cart-count'].textContent, 7);
  console.log('  [PASS] Custom cart:updated correctly updates mobile and desktop badges to 7');

  console.log('\nALL RUNTIME TESTS PASSED SUCCESSFULLY!');
});
