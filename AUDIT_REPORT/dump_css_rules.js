const fs = require('fs');
const css = fs.readFileSync('AUDIT_REPORT/impression4u_app.css', 'utf8');

function extractCssFor(prefix) {
  console.log(`\n=================== CSS FOR ${prefix} ===================`);
  const regex = new RegExp(`(?:\}|^)[^{}]*\\.${prefix}[^{}]*\\{[^}]+\\}`, 'g');
  const matches = css.match(regex) || [];
  console.log(`Found ${matches.length} rules.`);
  console.log(matches.slice(0, 20).join('\n'));
}

extractCssFor('hl');
extractCssFor('cw');
extractCssFor('card');
extractCssFor('sx');
extractCssFor('sr');
extractCssFor('tj');
extractCssFor('qa');
