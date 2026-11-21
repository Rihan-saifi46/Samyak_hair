const fs = require('fs');
const css = fs.readFileSync('AUDIT_REPORT/impression4u_app.css', 'utf8');

// Find all rules matching our key classes
const targetClasses = [
  'hl', 'cw', 'card', 'ptag', 'sx', 'sp', 'sr', 'tj', 'qa', 'site', 'hbar', 'brand', 'fgrid'
];

// Let's extract the exact CSS rules from Impression4U
const rules = [];
const regex = /([^{}]+)\{([^{}]+)\}/g;
let match;
while ((match = regex.exec(css)) !== null) {
  const sel = match[1].trim();
  const body = match[2].trim();
  for (const tc of targetClasses) {
    if (new RegExp(`(?:^|[\\s,>+~.:])\\.?${tc}\\b`).test(sel)) {
      rules.push(`${sel} { ${body} }`);
      break;
    }
  }
}

console.log(`Extracted ${rules.length} matching CSS rules from Impression4U.`);
fs.writeFileSync('AUDIT_REPORT/extracted_replica_rules.css', rules.join('\n'));
console.log('Saved to AUDIT_REPORT/extracted_replica_rules.css');
