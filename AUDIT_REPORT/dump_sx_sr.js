const fs = require('fs');
const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');

function dumpExact(tag, label) {
  const s = html.indexOf(tag);
  if (s === -1) {
    console.log('[NOT FOUND]', tag);
    return;
  }
  const e = html.indexOf('</section>', s) + 10;
  console.log(`\n=================== ${label} ===================`);
  console.log(html.substring(s, e));
}

dumpExact('<section class="sx', 'CUSTOMER SEGMENTS (.sx)');
dumpExact('<section class="sr', 'BRAND STORY (.sr)');
