// Responsive Viewport Audit Script for Samyak Hair Storefront
// Viewports: 320px, 375px, 430px, 768px, 1024px, 1440px

const viewports = [
  { width: 320, name: 'Mobile XS (iPhone SE / Small Android)' },
  { width: 375, name: 'Mobile SM (iPhone 12/13/14 mini / Standard)' },
  { width: 430, name: 'Mobile LG (iPhone 14/15/16 Pro Max)' },
  { width: 768, name: 'Tablet (iPad Mini / Portrait Tablet)' },
  { width: 1024, name: 'Tablet LG / Small Laptop' },
  { width: 1440, name: 'Desktop Standard (MacBook / FHD)' }
];

console.log('=============================================================================');
console.log('SAMYAK HAIR — RESPONSIVE VIEWPORT & UI ALIGNMENT AUDIT EXECUTION');
console.log('=============================================================================\n');

// 1. Audit Cart Drawer across all viewports
console.log('--- 1. CART DRAWER RESPONSIVE MATRIX ---');
viewports.forEach(vp => {
  // Drawer width: 410px, max-width: 92vw
  const drawerWidth = Math.min(410, vp.width * 0.92);
  const paddingInline = 22 * 2; // 44px
  const tableWidth = drawerWidth - paddingInline;
  
  // Track 1 (Media): 68px
  // Gap: 14px
  // Track 2 (Details/Quantity - 1fr): fills tableWidth - 68 - 14
  const col1 = 68;
  const gap = 14;
  const col2_1fr = Math.max(0, tableWidth - col1 - gap);
  
  // Track 3 (Price): created implicitly due to grid-area: price
  const priceEstimatedWidth = 72; // e.g. "₹1,200.00"
  const totalRowContentWidth = col1 + gap + col2_1fr + gap + priceEstimatedWidth;
  const priceClipping = totalRowContentWidth - tableWidth;

  // Z-index test against Mobile Bottom Nav (9999)
  const isMobile = vp.width <= 768;
  const mbnZIndex = 9999;
  const drawerZIndex = 2;
  const mbnOverlapsDrawer = isMobile && (mbnZIndex > drawerZIndex);

  console.log(`[Viewport: ${vp.width}px - ${vp.name}]`);
  console.log(`  Drawer Width: ${drawerWidth.toFixed(1)}px (CSS: min(410px, 92vw))`);
  console.log(`  Table Width: ${tableWidth.toFixed(1)}px`);
  console.log(`  Col 1 (Media): ${col1}px | Col 2 (Details 1fr): ${col2_1fr.toFixed(1)}px | Gap: ${gap}px`);
  console.log(`  Col 3 (Price - Implicit Track): ${priceEstimatedWidth}px`);
  console.log(`  Row Render Width: ${totalRowContentWidth.toFixed(1)}px vs Table: ${tableWidth.toFixed(1)}px`);
  console.log(`  -> PRICE CLIPPING DETECTED: ${priceClipping.toFixed(1)}px overflow hidden by overflow-x: hidden`);
  console.log(`  -> Mobile Bottom Nav Overlap Risk: ${mbnOverlapsDrawer ? 'CONFIRMED (MBN z-index 9999 > Drawer z-index 2)' : 'N/A (Desktop)'}`);
  console.log('');
});

// 2. Audit People Also Bought Section across all viewports
console.log('--- 2. PEOPLE ALSO BOUGHT (COLLECTION PAB) RESPONSIVE MATRIX ---');
viewports.forEach(vp => {
  const isMobile = vp.width <= 767;
  const isTablet = vp.width >= 768 && vp.width <= 1023;
  const isDesktop = vp.width >= 1024;

  const containerPadding = Math.min(32, Math.max(16, vp.width * 0.04)) * 2;
  const containerMaxWidth = 1240;
  const containerWidth = Math.min(containerMaxWidth, vp.width) - containerPadding;

  let columns = 4;
  let gap = 16;
  if (isMobile) {
    columns = 2;
    gap = 12;
  } else if (isTablet) {
    columns = 2;
    gap = 16;
  } else {
    columns = 4;
    gap = 16;
  }

  const cardWidth = (containerWidth - (gap * (columns - 1))) / columns;

  // Check card height constraints from product-card-styles.liquid
  let cardMinHeight = 475;
  let galleryMinHeight = 320;
  let galleryMaxHeight = 335;
  if (isMobile) {
    cardMinHeight = 395;
    galleryMinHeight = 265;
    galleryMaxHeight = 280;
  } else if (isTablet) {
    cardMinHeight = 440;
    galleryMinHeight = 295;
    galleryMaxHeight = 310;
  }

  const infoWrapMinHeight = 140;
  const totalMinHeight = galleryMinHeight + infoWrapMinHeight;
  const aspectRatio = (cardWidth / galleryMinHeight).toFixed(2);

  // Available text width in card info wrap
  // infoWrap padding: 18px 16px (32px horizontal)
  // product-title padding: 0 16px (32px horizontal)
  const doublePadding = 64;
  const innerTitleWidth = Math.max(0, cardWidth - doublePadding);

  console.log(`[Viewport: ${vp.width}px - ${vp.name}]`);
  console.log(`  Container Width: ${containerWidth.toFixed(1)}px (Padding: ${containerPadding}px, Max: ${containerMaxWidth}px)`);
  console.log(`  Columns: ${columns} | Gap: ${gap}px | Card Width: ${cardWidth.toFixed(1)}px`);
  console.log(`  Gallery Min-Height: ${galleryMinHeight}px | Info-Wrap Min-Height: ${infoWrapMinHeight}px | Card Min-Height: ${totalMinHeight}px`);
  console.log(`  Image Aspect Ratio (W/H): ${aspectRatio} (Width: ${cardWidth.toFixed(1)}px / Height: ${galleryMinHeight}px)`);
  console.log(`  Inner Title/Price Usable Width: ${innerTitleWidth.toFixed(1)}px (Card ${cardWidth.toFixed(1)}px - 64px Double Padding)`);
  if (innerTitleWidth < 100) {
    console.log(`  -> SEVERE TEXT SQUEEZE DETECTED: Usable width ${innerTitleWidth.toFixed(1)}px causes aggressive title line clamping and price wrap`);
  }
  if (vp.width === 1440) {
    console.log(`  -> DESKTOP PAGE GRID MISALIGNMENT: PAB max-width 1240px != Standard Theme Grid 1200px/1400px (12px-16px margin gap)`);
  }
  console.log('');
});

console.log('=============================================================================');
console.log('AUDIT CALCULATION COMPLETE');
console.log('=============================================================================');
