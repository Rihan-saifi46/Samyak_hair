const fs = require('fs');

const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');
const css = fs.readFileSync('AUDIT_REPORT/impression4u_app.css', 'utf8');

function extractHtml(startStr, endStr, label) {
  const s = html.indexOf(startStr);
  if (s === -1) {
    console.log(`[NOT FOUND] ${label}: start '${startStr}'`);
    return '';
  }
  let e = html.indexOf(endStr, s);
  if (e === -1) e = s + 3000;
  else e += endStr.length;
  const chunk = html.substring(s, e);
  console.log(`\n=================== ${label} ===================`);
  console.log(chunk.substring(0, 2500));
  return chunk;
}

// 1. Header
extractHtml('<header class="site">', '</header>', 'HEADER');

// 2. Hero Section
extractHtml('<section class="hl', '</section>', 'HERO SECTION (hl)');

// 3. Category Showcase (cw)
extractHtml('<section class="cw', '</section>', 'CATEGORY SHOWCASE (cw)');

// 4. Product Section (ptag) & Card
extractHtml('<section class="ptag', '</section>', 'PRODUCT SECTION (ptag)');

// 5. Customer Segments (sx)
extractHtml('<section class="sx', '</section>', 'CUSTOMER SEGMENTS (sx)');

// 6. Brand Story (sr)
extractHtml('<section class="sr', '</section>', 'BRAND STORY (sr)');

// 7. How We Work (tj)
extractHtml('<section class="tj', '</section>', 'HOW WE WORK (tj)');

// 8. FAQ (qa)
extractHtml('<section class="qa', '</section>', 'FAQ (qa)');

// 9. Footer
extractHtml('<footer class="site">', '</footer>', 'FOOTER');
