const fs = require('fs');
const css = fs.readFileSync('AUDIT_REPORT/extracted_replica_rules.css', 'utf8');

const lines = css.split('\n').filter(l => l.includes('.ptag') || l.includes('.card'));
console.log(`Found ${lines.length} lines for .ptag and .card`);
console.log(lines.slice(0, 40).join('\n'));
