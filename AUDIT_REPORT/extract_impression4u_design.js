const fs = require('fs');

const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');
const css = fs.readFileSync('AUDIT_REPORT/impression4u_app.css', 'utf8');

console.log('=== IMPRESSION4U DEEP DESIGN EXTRACTION ===\n');

// 1. CSS Variables / Root Tokens
console.log('--- 1. Root CSS Variables ---');
const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
if (rootMatch) {
  console.log(rootMatch[1].trim());
} else {
  // Extract custom properties matching --*
  const vars = [...new Set(css.match(/--[\w-]+:\s*[^;]+/g) || [])];
  console.log('Found', vars.length, 'custom properties:');
  vars.slice(0, 30).forEach(v => console.log(' ', v));
}

// 2. Body & Typography styling
console.log('\n--- 2. Body & Typography ---');
const bodyRules = css.match(/body\s*\{[^}]+\}/g);
if (bodyRules) bodyRules.forEach(r => console.log(' ', r));

const fontFamilies = [...new Set(css.match(/font-family:\s*[^;}]+/g) || [])];
console.log('Font families:');
fontFamilies.forEach(f => console.log(' ', f));

// 3. Inspect HTML structure of each section
console.log('\n--- 3. Sections Inspection from HTML ---');

function inspectSection(selector, name) {
  console.log(`\n================= ${name} (${selector}) =================`);
  const regex = new RegExp(`(<(header|section|footer|nav|div)[^>]*class=["'][^"']*\\b${selector}\\b[^"']*["'][\\s\\S]*?<\\/\\2>)`, 'i');
  // Or grab the opening tag and first 1000 characters
  const startIdx = html.indexOf(`class="${selector}`);
  const altStartIdx = startIdx !== -1 ? startIdx : html.indexOf(`class='${selector}`);
  if (altStartIdx !== -1) {
    const snippet = html.substring(Math.max(0, altStartIdx - 50), altStartIdx + 1500);
    console.log(snippet.replace(/\n\s*\n/g, '\n').substring(0, 1200));
  } else {
    // try finding by class name substring
    const match = html.match(new RegExp(`<[^>]+class=["'][^"']*${selector}[^"']*["'][^>]*>`, 'i'));
    console.log('Match tag:', match ? match[0] : 'Not found');
  }
}

inspectSection('site', 'HEADER / FOOTER');
inspectSection('hl', 'HERO SECTION');
inspectSection('cw', 'CATEGORY SHOWCASE');
inspectSection('ptag', 'PRODUCT SECTION');
inspectSection('sx', 'CUSTOMER SEGMENTS');
inspectSection('sr', 'BRAND STORY');
inspectSection('tj', 'PROCESS (SPOT/SOURCE/STOCK/SHIP)');
inspectSection('qa', 'FAQ SECTION');

// 4. Product Card Structure in HTML
console.log('\n================= PRODUCT CARD HTML SAMPLE =================');
const cardMatch = html.match(/<article[\s\S]*?<\/article>/i) || html.match(/<div[^>]*class=["'][^"']*product[^"']*["'][\s\S]*?<\/div>/i);
if (cardMatch) {
  console.log(cardMatch[0].substring(0, 1500));
} else {
  // Search for price or product item
  const pMatch = html.match(/class=["'][^"']*(?:item|card|prod|p-card|grid-item)[^"']*["']/gi);
  console.log('Possible card classes:', [...new Set(pMatch || [])].slice(0, 15));
}
