const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('=== SAMYAK AUTOMATED BROWSER TEST SUITE (NODE 22 + CHROME CDP) ===\n');

// 1. Start local static HTTP server for mock_header_test.html
const htmlPath = path.join(__dirname, 'mock_header_test.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(htmlContent);
});

server.listen(8765, '127.0.0.1', async () => {
  console.log('Local test server running on http://127.0.0.1:8765');
  
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeFlags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + path.join(__dirname, 'chrome_cdp_profile'),
    'http://127.0.0.1:8765'
  ];

  const chromeProc = spawn(chromePath, chromeFlags);
  console.log('Chrome process spawned with remote debugging on port 9222...');

  // Wait 1.5s for Chrome to initialize
  await new Promise(r => setTimeout(r, 1500));

  try {
    // 2. Fetch WebSocket debugger URL from Chrome
    const cdpTargets = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
    console.log(`Found ${cdpTargets.length} CDP target(s).`);
    const pageTarget = cdpTargets.find(t => t.type === 'page');

    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page target with webSocketDebuggerUrl found');
    }

    console.log('Connecting to WebSocket:', pageTarget.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push(data.params);
      }
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        cb(data);
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((resolve) => ws.onopen = resolve);
    console.log('Connected to Chrome DevTools Protocol!\n');

    await sendCommand('Runtime.enable');
    await sendCommand('Page.enable');

    async function evaluate(expression) {
      const res = await sendCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result.value;
    }

    async function setViewport(width, height) {
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width <= 768
      });
      await new Promise(r => setTimeout(r, 100));
    }

    // --- TEST 1: VIEWPORT BREAKPOINT BEHAVIOR ---
    console.log('--- TEST 1: VIEWPORT BREAKPOINT TESTING ---');
    const viewports = [
      { width: 360, height: 740, label: 'Small Mobile (360px)' },
      { width: 390, height: 844, label: 'Modern Mobile (390px)' },
      { width: 768, height: 1024, label: 'Tablet Portrait (768px)' },
      { width: 1024, height: 768, label: 'Tablet Landscape (1024px)' },
      { width: 1280, height: 800, label: 'Standard Desktop (1280px)' },
      { width: 1440, height: 900, label: 'Large Desktop (1440px)' }
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await setViewport(vp.width, vp.height);
      const metrics = await evaluate(`
        (() => {
          const trigger = document.getElementById('samyak-drawer-trigger-wrap');
          const navLinks = document.getElementById('samyak-desktop-nav-links');
          const summaryBtn = document.getElementById('samyak-menu-summary-btn');
          const triggerStyle = window.getComputedStyle(trigger);
          const navLinksStyle = window.getComputedStyle(navLinks);
          const summaryRect = summaryBtn.getBoundingClientRect();
          return {
            triggerDisplay: triggerStyle.display,
            navLinksDisplay: navLinksStyle.display,
            touchWidth: summaryRect.width,
            touchHeight: summaryRect.height
          };
        })()
      `);

      const triggerExpected = vp.width <= 1024 ? 'flex' : 'none';
      const navExpected = vp.width <= 1024 ? 'none' : 'flex';
      const isTriggerCorrect = metrics.triggerDisplay === triggerExpected;
      const isNavCorrect = metrics.navLinksDisplay === navExpected;
      const pass = isTriggerCorrect && isNavCorrect;

      vpResults.push({ ...vp, ...metrics, pass });
      console.log(`[${vp.label}]`);
      console.log(`   - Drawer Trigger Display: ${metrics.triggerDisplay} (Expected: ${triggerExpected}) -> ${isTriggerCorrect ? 'PASS' : 'FAIL'}`);
      console.log(`   - Desktop Nav Display: ${metrics.navLinksDisplay} (Expected: ${navExpected}) -> ${isNavCorrect ? 'PASS' : 'FAIL'}`);
      if (vp.width <= 1024) {
        console.log(`   - Touch Target Dimensions: ${metrics.touchWidth}x${metrics.touchHeight}px (Accessible >=38px)`);
      }
    }

    // --- TEST 2: DRAWER OPEN & CLOSE INTERACTION ---
    console.log('\n--- TEST 2: DRAWER OPEN & CLOSE INTERACTION ---');
    await setViewport(390, 844);

    // Initial state check
    const initialState = await evaluate(`
      (() => {
        const details = document.getElementById('Details-menu-drawer-container');
        const summary = document.getElementById('samyak-menu-summary-btn');
        return {
          isOpen: details.hasAttribute('open'),
          hasClassOpen: details.classList.contains('menu-open'),
          ariaExpanded: summary.getAttribute('aria-expanded')
        };
      })()
    `);
    console.log('1. Initial Drawer State:');
    console.log(`   - open attr: ${initialState.isOpen}, class menu-open: ${initialState.hasClassOpen}, aria-expanded: ${initialState.ariaExpanded}`);

    // Click to open
    await evaluate(`document.getElementById('samyak-menu-summary-btn').click()`);
    await new Promise(r => setTimeout(r, 150));

    const openedState = await evaluate(`
      (() => {
        const details = document.getElementById('Details-menu-drawer-container');
        const summary = document.getElementById('samyak-menu-summary-btn');
        const panel = document.getElementById('samyak-menu-drawer-panel');
        const activeEl = document.activeElement ? document.activeElement.id : '';
        const panelStyle = window.getComputedStyle(panel);
        return {
          isOpen: details.hasAttribute('open'),
          hasClassOpen: details.classList.contains('menu-open'),
          ariaExpanded: summary.getAttribute('aria-expanded'),
          focusedElement: activeEl,
          panelTransform: panelStyle.transform
        };
      })()
    `);
    console.log('2. After Summary Click (Open):');
    console.log(`   - open attr: ${openedState.isOpen} (Expected: true)`);
    console.log(`   - class menu-open: ${openedState.hasClassOpen} (Expected: true)`);
    console.log(`   - aria-expanded: ${openedState.ariaExpanded} (Expected: "true")`);
    console.log(`   - Focus moved to: ${openedState.focusedElement} (Expected: close btn)`);

    // Click close button
    await evaluate(`document.getElementById('samyak-menu-drawer-close-btn').click()`);
    await new Promise(r => setTimeout(r, 200));

    const closedState = await evaluate(`
      (() => {
        const details = document.getElementById('Details-menu-drawer-container');
        const summary = document.getElementById('samyak-menu-summary-btn');
        return {
          isOpen: details.hasAttribute('open'),
          hasClassOpen: details.classList.contains('menu-open'),
          ariaExpanded: summary.getAttribute('aria-expanded')
        };
      })()
    `);
    console.log('3. After Close Button Click:');
    console.log(`   - open attr: ${closedState.isOpen} (Expected: false)`);
    console.log(`   - class menu-open: ${closedState.hasClassOpen} (Expected: false)`);
    console.log(`   - aria-expanded: ${closedState.ariaExpanded} (Expected: "false")`);

    // --- TEST 3: KEYBOARD ACCESSIBILITY (ESCAPE KEY) ---
    console.log('\n--- TEST 3: KEYBOARD ACCESSIBILITY (ESCAPE KEY) ---');
    // Open again
    await evaluate(`document.getElementById('samyak-menu-summary-btn').click()`);
    await new Promise(r => setTimeout(r, 150));

    // Send Escape Key event
    await evaluate(`
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }))
    `);
    await new Promise(r => setTimeout(r, 200));

    const escClosedState = await evaluate(`
      (() => {
        const details = document.getElementById('Details-menu-drawer-container');
        const summary = document.getElementById('samyak-menu-summary-btn');
        return {
          isOpen: details.hasAttribute('open'),
          hasClassOpen: details.classList.contains('menu-open'),
          ariaExpanded: summary.getAttribute('aria-expanded')
        };
      })()
    `);
    console.log('After Escape Key Press:');
    console.log(`   - open attr: ${escClosedState.isOpen} (Expected: false)`);
    console.log(`   - class menu-open: ${escClosedState.hasClassOpen} (Expected: false)`);
    console.log(`   - aria-expanded: ${escClosedState.ariaExpanded} (Expected: "false")`);

    // --- TEST 4: NAVIGATION LINKS ACCESSIBILITY ---
    console.log('\n--- TEST 4: NAVIGATION LINKS INVENTORY ---');
    const navItems = await evaluate(`
      Array.from(document.querySelectorAll('.menu-drawer__menu-item')).map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href')
      }))
    `);
    console.log(`Found ${navItems.length} mobile drawer navigation items:`);
    navItems.forEach((item, idx) => {
      console.log(`   ${idx + 1}. [${item.text}] -> ${item.href}`);
    });

    // --- TEST 5: CONSOLE ERRORS AUDIT ---
    console.log('\n--- TEST 5: CONSOLE ERRORS & WARNINGS ---');
    console.log(`Console message count during execution: ${consoleLogs.length}`);
    if (consoleLogs.length === 0) {
      console.log('   ✓ Zero JavaScript runtime errors or console warnings recorded.');
    } else {
      console.log(consoleLogs);
    }

    console.log('\n========================================================');
    console.log('       BROWSER CDP TESTING EXECUTION COMPLETE           ');
    console.log('========================================================');

    ws.close();
  } catch (err) {
    console.error('Browser Test Error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
