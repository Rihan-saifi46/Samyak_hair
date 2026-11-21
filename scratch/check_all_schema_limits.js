const fs = require('fs');
const path = require('path');

function validateAllTemplates() {
  const sectionsDir = path.join(__dirname, '..', 'sections');
  const templatesDir = path.join(__dirname, '..', 'templates');

  // 1. Build a map of section schemas: section_name -> { settings: { id -> { type, min, max } } }
  const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
  const schemaMap = {};

  for (const file of sectionFiles) {
    const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
    const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    if (!match) continue;
    try {
      const schema = JSON.parse(match[1]);
      const secName = file.replace('.liquid', '');
      schemaMap[secName] = { settings: {} };
      if (schema.settings && Array.isArray(schema.settings)) {
        for (const s of schema.settings) {
          if (s.id) {
            schemaMap[secName].settings[s.id] = s;
          }
        }
      }
    } catch (e) {
      // ignore parse error if liquid tokens in schema
    }
  }

  // 2. Scan all JSON files in templates/ and sections/
  const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
  const issues = [];

  for (const tFile of templateFiles) {
    const tContent = fs.readFileSync(path.join(templatesDir, tFile), 'utf8');
    let tJson;
    try {
      // Remove comments if any
      const cleaned = tContent.replace(/\/\*[\s\S]*?\*\//g, '');
      tJson = JSON.parse(cleaned);
    } catch (e) {
      issues.push(`Template ${tFile}: JSON parse error: ${e.message}`);
      continue;
    }

    if (tJson.sections) {
      for (const [sKey, sVal] of Object.entries(tJson.sections)) {
        const sType = sVal.type;
        const schema = schemaMap[sType];
        if (!schema) continue;

        if (sVal.settings) {
          for (const [settKey, settVal] of Object.entries(sVal.settings)) {
            const def = schema.settings[settKey];
            if (!def) continue;

            if (def.type === 'range') {
              if (typeof settVal === 'number') {
                if (def.max !== undefined && settVal > def.max) {
                  issues.push(`${tFile} -> section [${sKey}] (${sType}) -> setting '${settKey}' = ${settVal} exceeds max ${def.max}`);
                }
                if (def.min !== undefined && settVal < def.min) {
                  issues.push(`${tFile} -> section [${sKey}] (${sType}) -> setting '${settKey}' = ${settVal} is below min ${def.min}`);
                }
              }
            }
          }
        }
      }
    }
  }

  console.log(`Scan completed. Found ${issues.length} issues.`);
  for (const issue of issues) {
    console.log(' - ' + issue);
  }
}

validateAllTemplates();
