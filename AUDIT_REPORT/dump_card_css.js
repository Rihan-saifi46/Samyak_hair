const fs = require('fs');
const css = fs.readFileSync('AUDIT_REPORT/impression4u_app.css', 'utf8');

const regex = /(?:\}|^)[^{}]*\.card[^{}]*\{[^}]+\}/g;
const matches = css.match(regex) || [];
console.log(`Found ${matches.length} .card rules.`);
console.log(matches.slice(0, 30).join('\n'));

console.log('\n--- .ptag rules ---');
const ptagRegex = /(?:\}|^)[^{}]*\.ptag[^{}]*\{[^}]+\}/g;
const ptagMatches = css.match(ptagRegex) || [];
console.log(ptagMatches.slice(0, 20).join('\n'));
