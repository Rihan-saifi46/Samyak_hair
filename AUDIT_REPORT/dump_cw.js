const fs = require('fs');
const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');

const s = html.indexOf('<section class="cw');
const e = html.indexOf('</section>', s) + 10;
console.log('=== CATEGORY SHOWCASE (.cw) ===');
console.log(html.substring(s, e));
