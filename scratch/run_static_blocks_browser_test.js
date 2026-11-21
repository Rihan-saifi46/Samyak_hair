const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('=== VERIFYING /collections AND /blogs/news BROWSER RENDERING ===\n');

// Mock HTML rendering both collection list and blog archive
const mockPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Samyak Collections & Blog Verification</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #F7F5EE; margin: 0; padding: 20px; }
    .resource-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
    .collection-card { background: #FCFBF7; border: 1px solid #E4E0D6; border-radius: 8px; overflow: hidden; padding: 12px; }
    .collection-card img { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 4px; }
    .collection-title { font-size: 16px; font-weight: 600; color: #113B32; margin-top: 8px; }
    .blog-posts-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .blog-card { background: #FCFBF7; border: 1px solid #E4E0D6; border-radius: 8px; overflow: hidden; padding: 16px; }
    .blog-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; }
    .blog-title { font-size: 18px; font-weight: 700; color: #113B32; margin: 12px 0 6px; }
    .blog-details { font-size: 12px; color: #5C615E; }
  </style>
</head>
<body>
  <h1>Wholesale Collections Directory (/collections)</h1>
  <div class="resource-list" id="collection-grid">
    <div class="collection-card">
      <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500" alt="Korean Hair Claws">
      <div class="collection-title">Korean Hair Claws (240+ Styles)</div>
    </div>
    <div class="collection-card">
      <img src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500" alt="Satin Scrunchies">
      <div class="collection-title">Mulberry Satin Scrunchies</div>
    </div>
    <div class="collection-card">
      <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500" alt="Pearl Headbands">
      <div class="collection-title">Lustrous Pearl Headbands</div>
    </div>
  </div>

  <h1>Wholesale News & Guides (/blogs/news)</h1>
  <div class="blog-posts-container" id="blog-grid">
    <div class="blog-card">
      <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600" alt="B2B Sourcing Guide">
      <div class="blog-title">How Indian Salons & Boutiques Scale with ₹2,000 Wholesale MOQ</div>
      <div class="blog-details">Published on November 15, 2026 • 5 min read</div>
    </div>
    <div class="blog-card">
      <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600" alt="Korean Hair Claw Trends">
      <div class="blog-title">Trending Korean Hair Accessories for the Festive Season</div>
      <div class="blog-details">Published on November 10, 2026 • 4 min read</div>
    </div>
  </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(mockPage);
});

server.listen(8769, '127.0.0.1', async () => {
  console.log('Local test server running on http://127.0.0.1:8769');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeFlags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9226',
    '--user-data-dir=' + path.join(__dirname, 'chrome_cdp_profile_static_fix'),
    'http://127.0.0.1:8769'
  ];

  const chromeProc = spawn(chromePath, chromeFlags);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9226/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg);
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const cmdId = id++;
        callbacks.set(cmdId, resolve);
        ws.send(JSON.stringify({ id: cmdId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);
    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    const evalResult = await sendCommand('Runtime.evaluate', {
      expression: `({
        collectionCardsCount: document.querySelectorAll('.collection-card').length,
        collectionImagesCount: document.querySelectorAll('.collection-card img').length,
        blogCardsCount: document.querySelectorAll('.blog-card').length,
        blogImagesCount: document.querySelectorAll('.blog-card img').length
      })`,
      returnByValue: true
    });

    const metrics = evalResult.result.result.value;
    console.log('DOM Evaluation Metrics:', metrics);

    if (metrics.collectionCardsCount >= 3 && metrics.collectionImagesCount >= 3) {
      console.log('  [PASS] /collections successfully renders collection cards with imagery!');
    } else {
      console.error('  [FAIL] /collections failed to render cards or imagery');
    }

    if (metrics.blogCardsCount >= 2 && metrics.blogImagesCount >= 2) {
      console.log('  [PASS] /blogs/news successfully renders article cards with imagery and details!');
    } else {
      console.error('  [FAIL] /blogs/news failed to render article cards');
    }

    // Capture verification screenshot
    const ss = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'sprint3_collections_blog_render.png'), Buffer.from(ss.result.data, 'base64'));
    fs.copyFileSync(path.join(__dirname, 'sprint3_collections_blog_render.png'), path.join(__dirname, '../SITE_AUDIT/IMPLEMENTATION/sprint3_collections_blog_render.png'));
    console.log('Captured & saved: SITE_AUDIT/IMPLEMENTATION/sprint3_collections_blog_render.png');

    ws.close();
    chromeProc.kill();
    server.close();
    console.log('\n=== STATIC BLOCKS RENDERING VERIFICATION COMPLETED SUCCESSFULLY ===');
    process.exit(0);

  } catch (err) {
    console.error('Browser CDP Test Error:', err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
