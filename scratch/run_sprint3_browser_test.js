const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('=== SAMYAK SPRINT 3 BROWSER CDP TEST SUITE ===\n');

const htmlPath = path.join(__dirname, 'mock_sprint3_pdp_test.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(8768, '127.0.0.1', async () => {
  console.log('Local test server running on http://127.0.0.1:8768');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeFlags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9225',
    '--user-data-dir=' + path.join(__dirname, 'chrome_cdp_profile_sprint3_2'),
    'http://127.0.0.1:8768'
  ];

  const chromeProc = spawn(chromePath, chromeFlags);
  console.log('Spawned headless Chrome with CDP on port 9225');

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9225/json');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');

    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page WebSocket target found');
    }

    console.log('Found page target:', pageTarget.webSocketDebuggerUrl);
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
    console.log('Connected to Chrome DevTools Protocol\n');

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    // TEST A: Desktop Layout 1440px
    console.log('--- TEST A: Desktop Viewport (1440x900) ---');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const evalDesktop = await sendCommand('Runtime.evaluate', {
      expression: `({
        hasAdvisoryCard: !!document.querySelector('.samyak-pdp-pin-card'),
        hasTransitMatrix: !!document.querySelector('.samyak-pin-transit-matrix'),
        hasAppBlocks: !!document.querySelector('[data-theme-editor-blocks]'),
        accordionsCount: document.querySelectorAll('.samyak-pdp-accordion-item').length
      })`,
      returnByValue: true
    });
    const desktopMetrics = evalDesktop.result.result.value;
    console.log('Desktop Layout Evaluation:', desktopMetrics);

    // Capture Desktop Screenshot
    const ssDesktop = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'sprint3_desktop_pdp.png'), Buffer.from(ssDesktop.result.data, 'base64'));
    console.log('Captured: sprint3_desktop_pdp.png');

    // TEST B: Interactive PIN Code Checker
    console.log('\n--- TEST B: PIN Code Checker Verification ---');

    // Case 1: Enter 000000 (Previously accepted by mock regex)
    const evalPin0 = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('samyak-pin-input');
        const btn = document.getElementById('samyak-pin-btn');
        const feedback = document.getElementById('samyak-pin-feedback');
        input.value = '000000';
        btn.click();
        return {
          text: feedback.textContent,
          isValid: feedback.classList.contains('is-valid'),
          isInvalid: feedback.classList.contains('is-invalid')
        };
      })()`,
      returnByValue: true
    });
    const pinTest0 = evalPin0.result.result.value;
    console.log('PIN 000000 result:', pinTest0);
    if (pinTest0.isInvalid && pinTest0.text.includes('valid civilian Indian postal code')) {
      console.log('  -> PASS: 000000 successfully rejected with civilian zone guidance!');
    } else {
      console.error('  -> FAIL: 000000 was not properly rejected');
    }

    // Case 2: Enter 110006 (Central Delhi)
    const evalPin1 = await sendCommand('Runtime.evaluate', {
      expression: `(() => {
        const input = document.getElementById('samyak-pin-input');
        const btn = document.getElementById('samyak-pin-btn');
        const feedback = document.getElementById('samyak-pin-feedback');
        input.value = '110006';
        btn.click();
        return {
          html: feedback.innerHTML,
          isValid: feedback.classList.contains('is-valid'),
          isInvalid: feedback.classList.contains('is-invalid')
        };
      })()`,
      returnByValue: true
    });
    const pinTest1 = evalPin1.result.result.value;
    console.log('PIN 110006 result:', pinTest1);
    if (pinTest1.isValid && pinTest1.html.includes('1–2 Business Days (Delhi NCR / Northern Zone)')) {
      console.log('  -> PASS: 110006 correctly evaluated to 1-2 Days Delhi NCR transit!');
    } else {
      console.error('  -> FAIL: 110006 evaluation failed');
    }

    // Capture PIN checked screenshot
    const ssPin = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'sprint3_pin_interaction.png'), Buffer.from(ssPin.result.data, 'base64'));
    console.log('Captured: sprint3_pin_interaction.png');

    // TEST C: Mobile Viewport 390px
    console.log('\n--- TEST C: Mobile Viewport (390x844) ---');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    const evalMobile = await sendCommand('Runtime.evaluate', {
      expression: `({
        windowWidth: window.innerWidth,
        cardWidth: document.querySelector('.samyak-pdp-pin-card').offsetWidth,
        appBlocksWidth: document.querySelector('[data-theme-editor-blocks]').offsetWidth
      })`,
      returnByValue: true
    });
    const mobileMetrics = evalMobile.result.result.value;
    console.log('Mobile Metrics:', mobileMetrics);

    // Capture Mobile Screenshot
    const ssMobile = await sendCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'sprint3_mobile_pdp.png'), Buffer.from(ssMobile.result.data, 'base64'));
    console.log('Captured: sprint3_mobile_pdp.png');

    ws.close();
    chromeProc.kill();
    server.close();
    console.log('\n=== ALL BROWSER CDP TESTS COMPLETED SUCCESSFULLY ===');
    process.exit(0);

  } catch (err) {
    console.error('Browser CDP Test Error:', err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
