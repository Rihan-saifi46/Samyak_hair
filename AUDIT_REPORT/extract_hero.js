const fs = require('fs');
const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');

// Find section class="hl" or similar
const hlStart = html.indexOf('<section class="hl"');
if (hlStart !== -1) {
  const hlEnd = html.indexOf('</section>', hlStart) + 10;
  const heroHtml = html.substring(hlStart, hlEnd);
  fs.writeFileSync('AUDIT_REPORT/extracted_hero.html', heroHtml);
  console.log('Saved extracted_hero.html, length: ' + heroHtml.length);
} else {
  console.log('hl section not found');
}
