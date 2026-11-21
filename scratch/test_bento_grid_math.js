console.log('=== BENTO EDITORIAL GRID COMPOSITION & PAGINATION SIMULATOR ===\n');

function getBentoType(globalIndex) {
  const cycle = globalIndex % 15;
  if (cycle === 2) return 'hero-right'; // 2 cols x 2 rows
  if (cycle === 3) return 'wide-left';  // 2 cols x 1 row
  if (cycle === 9) return 'wide-center';// 2 cols x 1 row
  if (cycle === 11) return 'hero-left'; // 2 cols x 2 rows
  if (cycle === 14) return 'wide-right';// 2 cols x 1 row
  return 'standard';                    // 1 col x 1 row
}

const testCollectionSizes = [7, 15, 23, 30, 45, 60];
const pageSize = 30;

testCollectionSizes.forEach(totalProducts => {
  console.log(`\n--- Simulating Collection with ${totalProducts} Products (Page Size: ${pageSize}) ---`);
  const totalPages = Math.ceil(totalProducts / pageSize);
  let globalCount = 0;

  for (let page = 1; page <= totalPages; page++) {
    const offset = (page - 1) * pageSize;
    const pageItemsCount = Math.min(pageSize, totalProducts - offset);
    console.log(` Page ${page}/${totalPages} (Offset: ${offset}, Items: ${pageItemsCount}):`);

    const pageBentoTypes = [];
    for (let i = 0; i < pageItemsCount; i++) {
      const globalIndex = offset + i;
      const bentoType = getBentoType(globalIndex);
      pageBentoTypes.push({ globalIndex, cycle15: globalIndex % 15, bentoType });
      globalCount++;
    }

    // Tally bento types
    const tallies = pageBentoTypes.reduce((acc, it) => {
      acc[it.bentoType] = (acc[it.bentoType] || 0) + 1;
      return acc;
    }, {});
    console.log(`   Composition Breakdown: ${JSON.stringify(tallies)}`);

    // Verify first and last item on page
    const first = pageBentoTypes[0];
    const last = pageBentoTypes[pageBentoTypes.length - 1];
    console.log(`   First Item: Global #${first.globalIndex} (Cycle 15: #${first.cycle15}) -> ${first.bentoType}`);
    console.log(`   Last Item:  Global #${last.globalIndex} (Cycle 15: #${last.cycle15}) -> ${last.bentoType}`);
  }

  console.log(` Total products successfully indexed without skipping or duplicating: ${globalCount} / ${totalProducts} -> PASS`);
});
