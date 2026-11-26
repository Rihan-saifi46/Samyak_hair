// Simulate CSS Grid layout computation of cart-drawer table row
const fs = require('fs');

console.log('--- CSS Grid Analysis for Cart Drawer Row ---');
console.log('Container width in drawer:');
// Drawer width is 410px on desktop, or min(410px, 92vw) on mobile.
// Drawer content padding: 16px 22px (left/right = 22px + 22px = 44px).
// So available table width = 410 - 44 = 366px.

const widths = [
  { name: 'Desktop (410px drawer)', drawerWidth: 410, contentPadding: 44, tableWidth: 366 },
  { name: 'Tablet 768px (410px drawer)', drawerWidth: 410, contentPadding: 44, tableWidth: 366 },
  { name: 'Mobile 430px (92vw = 395px drawer)', drawerWidth: 395.6, contentPadding: 44, tableWidth: 351.6 },
  { name: 'Mobile 375px (92vw = 345px drawer)', drawerWidth: 345, contentPadding: 44, tableWidth: 301 },
  { name: 'Mobile 320px (92vw = 294px drawer)', drawerWidth: 294.4, contentPadding: 44, tableWidth: 250.4 },
];

console.log('Defined grid properties on #cart-drawer .cart-items__table-row:');
console.log('1. grid-template-columns: 68px 1fr !important;');
console.log('2. gap: 14px !important;');
console.log('Inherited from .cart-items__table-row in snippets/cart-products.liquid:');
console.log('3. grid-template-areas:');
console.log('   "media details price"');
console.log('   "media quantity price"');
console.log('   "media error error"');
console.log('4. .cart-items__price { grid-area: price; min-width: 6rem (96px); text-align: end; }');
console.log('\nResult of conflict:');
console.log('When grid-template-columns has 2 tracks (68px, 1fr) but grid-template-areas has 3 columns:');
console.log('- Column 1 ("media"): 68px');
console.log('- Column 2 ("details", "quantity"): 1fr (takes remaining width)');
console.log('- Column 3 ("price"): implicit track created because "price" area is in 3rd column of grid-template-areas!');
console.log('Because Column 2 takes 1fr (all remaining space), Column 3 is forced to overflow the right boundary by its entire width (min 96px)!');
console.log('Since #cart-drawer .cart-drawer__content has "overflow-x: hidden !important", Column 3 ("price") is partially or completely clipped on the right!');

widths.forEach(w => {
  const col1 = 68;
  const gap = 14;
  const col2_1fr = w.tableWidth - col1 - gap; // 1fr takes the rest
  const col3_price = 70; // approximate width of price "₹1,200.00"
  const totalGridWidth = col1 + gap + col2_1fr + gap + col3_price;
  const overflow = totalGridWidth - w.tableWidth;
  console.log(`\n${w.name}:`);
  console.log(`  Table Width: ${w.tableWidth.toFixed(1)}px`);
  console.log(`  Col 1 (media): ${col1}px`);
  console.log(`  Col 2 (details/qty 1fr): ${col2_1fr.toFixed(1)}px`);
  console.log(`  Col 3 (price): ${col3_price}px`);
  console.log(`  Total Row Render Width: ${totalGridWidth.toFixed(1)}px`);
  console.log(`  OVERFLOW / CLIPPING ON RIGHT: ${overflow.toFixed(1)}px`);
});
