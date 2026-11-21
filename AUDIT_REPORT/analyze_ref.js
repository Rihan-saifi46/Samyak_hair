const fs = require('fs');

const html = fs.readFileSync('AUDIT_REPORT/impression4u_homepage.html', 'utf8');
console.log('HTML Length:', html.length);

// Extract title
const title = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', title ? title[1].trim() : 'N/A');

// Extract meta description
const metaDesc = html.match(/<meta[^>]+name=['"]description['"][^>]+content=['"]([^'"]+)['"]/i);
console.log('Description:', metaDesc ? metaDesc[1] : 'N/A');

// Check CMS/Platform
if (html.includes('Shopify.')) console.log('Platform: Shopify');
else if (html.includes('wp-content')) console.log('Platform: WordPress/WooCommerce');
else if (html.includes('laravel') || html.includes('csrf-token') || html.includes('XSRF-TOKEN')) console.log('Platform: Custom Laravel/PHP');
else console.log('Platform: Other');

// Find all CSS stylesheet URLs
const cssMatches = [...html.matchAll(/<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi)].map(m => m[1]);
console.log('\nCSS stylesheets found (' + cssMatches.length + '):');
cssMatches.forEach(c => console.log(' - ' + c));

// Find all section tags or main structural divs
const tags = [...html.matchAll(/<(header|nav|section|footer|main|aside)[^>]*class=["']([^"']+)["']/gi)].map(m => ({ tag: m[1], class: m[2] }));
console.log('\nStructural Sections found (' + tags.length + '):');
tags.forEach(t => console.log(` <${t.tag} class="${t.class}">`));

// Find all major headings (h1, h2, h3)
const headings = [...html.matchAll(/<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => ({
  tag: m[1],
  text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
})).filter(h => h.text.length > 0 && h.text.length < 150);

console.log('\nHeadings found (' + headings.length + '):');
headings.forEach(h => console.log(` [${h.tag}] ${h.text}`));
