const http = require('http');
http.get('http://127.0.0.1:9292/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const linkMatches = data.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
    linkMatches.forEach(m => console.log(m));
    const styleMatches = data.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
    console.log('Total style blocks:', styleMatches.length);
    styleMatches.forEach((s, i) => {
      if (s.includes('samyak')) {
        console.log('Style block ' + i + ' contains samyak:');
        console.log(s.slice(0, 300));
      }
    });
  });
});
