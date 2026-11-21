const http = require('http');

http.get('http://127.0.0.1:9292/', res => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    // Search for fixed width styles or min-width styles
    const regex = /(?:width|min-width):\s*([0-9]+)px/gi;
    let match;
    const largeWidths = [];
    while ((match = regex.exec(html)) !== null) {
      const val = parseInt(match[1]);
      if (val > 390) {
        largeWidths.push({ val, context: html.slice(Math.max(0, match.index - 50), match.index + 50) });
      }
    }
    console.log('Found large fixed widths in HTML:', largeWidths.length);
    largeWidths.forEach(w => console.log(w.val, w.context.replace(/\s+/g, ' ')));
  });
});
