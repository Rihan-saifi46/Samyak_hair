const fs = require('fs');
const path = require('path');

console.log('=== STRICT SYNTAX & INTEGRITY CHECK: SPRINT 2 FILES ===\n');

const filesToCheck = [
  'snippets/search.liquid',
  'sections/main-wishlist.liquid',
  'templates/page.wishlist.json',
  'snippets/product-card.liquid',
  'snippets/homepage-category-grid.liquid',
  'sections/main-collection.liquid',
  'snippets/product-grid.liquid',
  'snippets/quick-shop-drawer.liquid',
  'snippets/cart-drawer.liquid'
];

let allValid = true;

filesToCheck.forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] File missing: ${relPath}`);
    allValid = false;
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  if (relPath.endsWith('.json')) {
    try {
      JSON.parse(content);
      console.log(`[PASS] JSON Valid: ${relPath}`);
    } catch (e) {
      console.error(`[FAIL] JSON Syntax Error in ${relPath}:`, e.message);
      allValid = false;
    }
  } else {
    // Liquid Tag Balancing Check
    const blockTags = ['if', 'for', 'paginate', 'capture', 'case', 'schema', 'style', 'doc'];
    let fileBalanced = true;

    blockTags.forEach(tag => {
      // Open tags
      const openRegex = new RegExp(`{%-?\\s*${tag}\\b`, 'g');
      const closeRegex = new RegExp(`{%-?\\s*end${tag}\\b`, 'g');
      const opens = (content.match(openRegex) || []).length;
      const closes = (content.match(closeRegex) || []).length;

      if (opens !== closes) {
        console.error(`[FAIL] Tag Mismatch in ${relPath}: ${tag} opened ${opens} times, closed ${closes} times.`);
        fileBalanced = false;
        allValid = false;
      }
    });

    if (fileBalanced) {
      console.log(`[PASS] Liquid Syntax & Tags Balanced: ${relPath}`);
    }
  }
});

console.log('\n========================================================');
console.log(allValid ? 'ALL FILES SYNTACTICALLY VALID & PROPERLY BALANCED' : 'SYNTAX ERRORS DETECTED');
console.log('========================================================');

process.exit(allValid ? 0 : 1);
