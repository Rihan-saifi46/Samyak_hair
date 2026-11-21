const fs = require('fs');
const path = require('path');

function checkStaticBlocks() {
  const templatesDir = path.join(__dirname, '..', 'templates');
  const sectionsDir = path.join(__dirname, '..', 'sections');
  
  const filesToCheck = [
    ...fs.readdirSync(templatesDir).filter(f => f.endsWith('.json')).map(f => path.join(templatesDir, f)),
    ...fs.readdirSync(sectionsDir).filter(f => f.endsWith('.json')).map(f => path.join(sectionsDir, f))
  ];

  const violations = [];

  function inspectNode(node, filePath, location) {
    if (!node || typeof node !== 'object') return;

    if (node.blocks && typeof node.blocks === 'object') {
      const blockOrder = Array.isArray(node.block_order) ? node.block_order : [];
      for (const [bKey, bVal] of Object.entries(node.blocks)) {
        if (bVal && bVal.static === true) {
          if (blockOrder.includes(bKey)) {
            violations.push(`${filePath} at ${location}: static block "${bKey}" is present in block_order!`);
          }
        }
        // Recursively inspect nested blocks
        inspectNode(bVal, filePath, `${location} -> block ${bKey}`);
      }
    }

    if (node.sections && typeof node.sections === 'object') {
      for (const [sKey, sVal] of Object.entries(node.sections)) {
        inspectNode(sVal, filePath, `${location} -> section ${sKey}`);
      }
    }
  }

  for (const f of filesToCheck) {
    try {
      const content = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      const json = JSON.parse(content);
      inspectNode(json, path.basename(f), 'root');
    } catch (e) {
      violations.push(`${path.basename(f)}: JSON parse error: ${e.message}`);
    }
  }

  console.log(`Static block check completed. Found ${violations.length} violations.`);
  for (const v of violations) {
    console.log(' - ' + v);
  }
}

checkStaticBlocks();
