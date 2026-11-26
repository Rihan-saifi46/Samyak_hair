const fs = require('fs');

const cd = fs.readFileSync('snippets/cart-drawer.liquid', 'utf8');
console.log('theme-drawer tags:', cd.match(/<theme-drawer[^>]*>/g));
console.log('min_order occurrences:', cd.match(/min_order[^\n]*/g));

const wp = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');
console.log('pdp newInner:', wp.includes('newInner'));
console.log('pdp curInner:', wp.includes('curInner'));
console.log('pdp currentInner:', wp.includes('currentInner'));

const comp = fs.readFileSync('assets/component-cart-items.js', 'utf8');
console.log('morphSection occurrences:', comp.match(/morphSection[^\n]*/g));
console.log('sectionId occurrences:', comp.match(/sectionId[^\n]*/g));

const mbn = fs.readFileSync('snippets/mobile-bottom-nav.liquid', 'utf8');
console.log('mbn cart count occurrences:', mbn.match(/samyak-mbn-cart-count[^\n]*/g));
console.log('mbn cart:updated:', mbn.includes('cart:updated'));

const ha = fs.readFileSync('snippets/header-actions.liquid', 'utf8');
console.log('ha samyak-header-cart-count:', ha.match(/samyak-header-cart-count[^\n]*/g));
console.log('ha cart bubble/count matches:', ha.match(/cart-count[^\n]*/g));
