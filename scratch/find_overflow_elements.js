const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9333;
const userDataDir = 'C:\\Users\\DELL\\AppData\\Local\\Temp\\chrome_debug_' + Date.now();

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + userDataDir,
  '--window-size=390,844',
  'http://127.0.0.1:9292/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetchJson(`http://127.0.0.1:${port}/json`);
    const page = listRes.find(p => p.type === 'page');
    if (!page) {
      console.log('No page found');
      chromeProc.kill();
      return;
    }

    const WebSocket = require('ws');
    // If ws is not installed, we can use devtools protocol via HTTP /json endpoints
  } catch (err) {
    console.log('Error:', err.message);
    chromeProc.kill();
  }
}, 2000);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}
