const fs = require('fs');
const css = fs.readFileSync('AUDIT_REPORT/impression4u_app.css', 'utf8');

const regex = /(?:\}|^)[^{}]*(?:header\.site|\.hbar|\.hlead|\.brand|\.search-wrap|\.hact|\.hlinks|\.hlink|\.lens)[^{}]*\{[^}]+\}/g;
const matches = css.match(regex) || [];
console.log(`Found ${matches.length} header rules.`);
console.log(matches.slice(0, 30).join('\n'));
