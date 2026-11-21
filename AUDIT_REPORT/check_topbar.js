const fs = require('fs');
const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');

const idx = html.indexOf('<header class="site">');
console.log('HTML before <header class="site"> (last 1000 chars):');
console.log(html.substring(Math.max(0, idx - 1000), idx));
