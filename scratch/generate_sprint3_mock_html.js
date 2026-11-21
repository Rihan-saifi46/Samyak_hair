const fs = require('fs');

const pdpLiquid = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');

let mockHtml = pdpLiquid
  .replace(/\{%-?\s*doc[\s\S]*?enddoc\s*-?%\}/g, '')
  .replace(/\{%\s*liquid[\s\S]*?%\}/g, '')
  .replace(/\{%\s*if product\.metafields\.custom\.material[\s\S]*?\{%\s*else\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, '$1')
  .replace(/\{%\s*if product\.metafields\.custom\.pack_specification[\s\S]*?\{%\s*else\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, '$1')
  .replace(/\{%\s*if product\.description[\s\S]*?\{%\s*endif\s*%\}/g, '<div class="samyak-pdp-description-content" style="margin-bottom: 12px; line-height: 1.6; color: #3A403D;"><p>Premium Korean fashion hair claws engineered for secure, all-day hold with high-gloss pastel finish.</p></div>')
  .replace(/\{%\s*if additional_blocks != blank\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, '$1')
  .replace(/\{\{\s*additional_blocks\s*\}\}/g, '<div style="padding:16px; background:#F0F5F2; border:1px solid #113B32; border-radius:8px; text-align:center; color:#113B32; font-weight:600;">[Verified Third-Party App Block: Judge.me 5-Star Reviews & Trust Seal Widget Rendered]</div>')
  .replace(/\{\{\s*current_variant\.price[\s\S]*?\}\}/g, '15000')
  .replace(/\{\{\s*routes\.all_products_collection_url\s*\}\}/g, '/collections/all')
  .replace(/\{\{\s*routes\.root_url\s*\}\}/g, '/')
  .replace(/\{\{\s*product\.title\s*\}\}/g, 'Korean Pastel Acrylic Hair Claw (Pack of 12)')
  .replace(/\{\{\s*featured_image[\s\S]*?\}\}/g, '/assets/samyak-card-1.jpg')
  .replace(/\{%\s*if featured_image\s*%\}([\s\S]*?)\{%\s*else\s*%\}[\s\S]*?\{%\s*endif\s*%\}/g, '$1')
  .replace(/\{%\s*if is_scrunchie\s*%\}[\s\S]*?\{%\s*else\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, '$1')
  .replace(/\{%\s*unless[\s\S]*?endunless\s*%\}/g, '')
  .replace(/\{%\s*for[\s\S]*?endfor\s*%\}/g, '')
  .replace(/\{%\s*render[\s\S]*?%\}/g, '')
  .replace(/\{%\s*style\s*%\}([\s\S]*?)\{%\s*endstyle\s*%\}/g, '<style>$1</style>')
  .replace(/\{%\s*stylesheet\s*%\}([\s\S]*?)\{%\s*endstylesheet\s*%\}/g, '<style>$1</style>')
  .replace(/\{\{[\s\S]*?\}\}/g, ''); // strip any remaining Liquid tags

const fullPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Samyak Hair Accessories — Sprint 3 PDP Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #F7F5EE; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
  </style>
</head>
<body>
  ${mockHtml}
</body>
</html>`;

fs.writeFileSync('scratch/mock_sprint3_pdp_test.html', fullPageHtml, 'utf8');
console.log('Successfully re-generated scratch/mock_sprint3_pdp_test.html without Liquid braces in script');
