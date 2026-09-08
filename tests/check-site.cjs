const { chromium, firefox, webkit } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results');
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const publicBase = 'https://antis0007.github.io/fastcast-downloads/';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
fs.mkdirSync(output, { recursive: true });
let base;

// Serve below a project path, as on GitHub Pages. Rebase absolute production
// links only in responses so nested 404 pages exercise local assets as well.
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = decodeURIComponent(url.pathname).replace(/^\/fastcast-downloads\//, '');
  const file = path.resolve(root, relative || 'index.html');
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404).end();
      return;
    }
    const extension = path.extname(file);
    res.setHeader('Content-Type', types[extension] || 'application/octet-stream');
    res.end(extension === '.html' ? data.toString().replaceAll(publicBase, base) : data);
  });
});

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => {
    if (document.documentElement.scrollWidth <= innerWidth + 1) return [];
    return [`document width ${document.documentElement.scrollWidth}, viewport ${innerWidth}`, ...[...document.querySelectorAll('main *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1).map(el => `${el.tagName}.${el.className}`).slice(0, 12)];
  });
  assert.deepEqual(overflow, [], `${label}: horizontal overflow: ${overflow.join(', ')}`);
}

async function checkLayouts(name, engine) {
  const browser = await engine.launch();
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const failures = [];
      page.on('pageerror', error => failures.push(error.message));
      page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
      for (const file of pages) {
        await page.goto(base + file);
        assert.equal(await page.locator('h1').count(), 1, file);
        for (const image of await page.locator('main img').all()) {
          await image.scrollIntoViewIfNeeded();
          try {
            await page.waitForFunction(el => el.complete && el.naturalWidth > 0, await image.elementHandle(), { timeout: 15000 });
          } catch (error) {
            throw new Error(`${name} ${width} ${file}: image failed to load: ${await image.getAttribute('src')}; requests: ${failures.join(', ')}`, { cause: error });
          }
        }
        await assertNoOverflow(page, `${name} ${width} ${file}`);
        if (name === 'chromium' && [390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(output, `${file}-${width}.png`), fullPage: true });
        }
        await page.evaluate(() => document.documentElement.style.fontSize = '32px');
        await assertNoOverflow(page, `${name} ${width} ${file} enlarged text`);
      }
      assert.deepEqual(failures, []);
      await context.close();
      console.log(`${name} ${width}: all ${pages.length} pages, assets and enlarged text passed`);
    }

    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    await page.goto(base);
    assert.equal(await page.locator('[data-download]').count(), 2);
    await page.getByRole('link', { name: 'Enlarge Windows Share screenshot', exact: true }).focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/assets/windows-share.png');
    await page.goto(base + 'downloads.html');
    for (const link of await page.locator('[data-download]').all()) {
      assert.match(await link.getAttribute('href'), /^https:\/\/github.com\/antis0007\/fastcast-downloads\/releases\/download\//);
    }
    await page.goto(base + 'help.html');
    assert.equal(await page.locator('.help-search').isVisible(), false);
    await page.locator('summary').first().click();
    assert.ok(await page.locator('details').first().getAttribute('open') !== null);
    await page.goto(base + 'bandwidth.html');
    assert.ok(await page.locator('#bitrate').isDisabled());
    assert.ok(await page.locator('#duration').isDisabled());
    assert.ok(await page.locator('#reset-bandwidth').isDisabled());
    assert.equal(await page.locator('#payload-value').textContent(), '5.40');
    assert.equal(await page.locator('#payload-table tr').count(), 5);
    assert.equal(await page.locator('#payload-chart').isVisible(), false);
    await context.close();
    console.log(`${name}: no-JavaScript downloads, image and FAQ passed`);
  } finally {
    await browser.close();
  }
}

async function checkJourneysAndAccessibility() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base);
    const screenshot = page.getByRole('link', { name: 'Enlarge Windows Share screenshot', exact: true });
    await screenshot.click();
    assert.ok(await page.locator('dialog').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').isVisible(), false);
    assert.ok(await screenshot.evaluate(el => el === document.activeElement));
    assert.equal(await page.locator('.signal-art i').last().evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Get started', exact: true }).click();
    await page.waitForURL('**/get-started.html');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Help', exact: true }).click();
    await page.waitForURL('**/help.html');
    const search = page.getByRole('searchbox', { name: 'Search help' });
    await search.fill('subscriptions');
    assert.equal(await page.locator('.faq-group details:visible').count(), 1);
    await search.fill('no-such-answer-8294');
    assert.ok(await page.locator('#no-results').isVisible());
    await page.getByRole('link', { name: 'Connection', exact: true }).click();
    assert.equal(await search.inputValue(), '');
    assert.equal(await page.locator('.faq-group details:visible').count(), 14);
    await page.goto(base + 'product.html');
    assert.equal((await page.locator('#capabilities h2').textContent()).trim(), "What's in, what's not.");
    assert.equal(await page.locator('.status-key dt').count(), 4);
    assert.equal(await page.locator('.capability-group').count(), 4);
    assert.equal(await page.locator('.capability-row').count(), 15);
    for (const word of ['Available', 'Preview', 'Limited', 'Not yet']) {
      assert.ok(await page.locator('.status-word', { hasText: word }).count());
    }
    assert.equal(await page.getByText('The whole feature list').count(), 0);
    assert.equal(await page.getByText('Meet FastCast').count(), 0);
    await page.goto(base + 'privacy.html');
    assert.equal(await page.getByText('FASTCAST_DISCOVERY').count(), 0);
    assert.equal(await page.getByText('helper URL').count(), 0);
    await page.goto(base + 'downloads.html');
    assert.equal(await page.locator('code.hash').count(), 3);
    await context.close();
    console.log('Screenshot close/focus, reduced motion, navigation and FAQ search passed');

    const androidContext = await browser.newContext({ userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36', viewport: { width: 390, height: 900 } });
    const androidPage = await androidContext.newPage();
    await androidPage.goto(base);
    assert.equal(await androidPage.locator('.hero .primary').getAttribute('data-download'), 'android');
    await androidPage.goto(base + 'downloads.html');
    assert.ok(await androidPage.locator('[data-platform="android"] .recommendation').isVisible());
    await androidContext.close();

    const windowsContext = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36', viewport: { width: 1440, height: 900 } });
    const windowsPage = await windowsContext.newPage();
    await windowsPage.goto(base);
    assert.equal(await windowsPage.locator('.hero .primary').getAttribute('data-download'), 'windows');
    await windowsPage.goto(base + 'downloads.html');
    assert.ok(await windowsPage.locator('[data-platform="windows"] .recommendation').isVisible());
    await windowsContext.close();

    const calculatorContext = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const calculatorPage = await calculatorContext.newPage();
    await calculatorPage.goto(base + 'bandwidth.html');
    assert.equal(await calculatorPage.locator('#payload-value').textContent(), '5.40');
    await calculatorPage.locator('#bitrate').fill('1');
    await calculatorPage.locator('#duration').fill('5');
    assert.equal(await calculatorPage.locator('#payload-value').textContent(), '0.04');
    await calculatorPage.locator('#bitrate').fill('50');
    await calculatorPage.locator('#duration').fill('240');
    assert.equal(await calculatorPage.locator('#payload-value').textContent(), '90.00');
    assert.equal(await calculatorPage.locator('#relay-total').textContent(), '180.00 GB');
    await assertNoOverflow(calculatorPage, 'Maximum calculator values');
    await calculatorPage.getByRole('button', { name: 'Reset example' }).click();
    await calculatorPage.locator('#bitrate').focus();
    await calculatorPage.keyboard.press('ArrowRight');
    assert.equal(await calculatorPage.locator('#payload-value').textContent(), '5.85');
    assert.match(await calculatorPage.locator('#payload-chart').getAttribute('aria-label'), /5.85 GB/);
    assert.equal(await calculatorPage.locator('#payload-table tr').last().textContent(), '60 min5.85 GB');
    await calculatorContext.close();
    console.log('Calculator units, bounds, relay totals, keyboard input, reset and accessible table passed');

    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await context.newPage();
      for (const file of pages) {
        await page.goto(base + file);
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${file} ${width}`);
      }
      await context.close();
      console.log(`Accessibility ${width}: all ${pages.length} pages passed`);
    }
  } finally {
    await browser.close();
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/fastcast-downloads/`;
  try {
    const engines = { chromium, firefox, webkit };
    const selected = process.argv[2];
    if (selected) assert.ok(selected in engines, 'Engine must be chromium, firefox or webkit');
    for (const [name, engine] of Object.entries(engines)) {
      if (!selected || selected === name) await checkLayouts(name, engine);
    }
    await checkJourneysAndAccessibility();
  } finally {
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
