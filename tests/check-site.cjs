const { chromium, firefox, webkit } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const artifacts = path.join(root, 'test-results');
fs.mkdirSync(artifacts, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + (req.url === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(path.resolve(root) + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, bytes) => { res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'text/plain' }); res.end(error ? '' : bytes); });
});

async function noOverflow(page, label) {
  const result = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, overflowing: [...document.querySelectorAll('main *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1 && el.getBoundingClientRect().width > 0).slice(0, 8).map(el => el.tagName + '.' + el.className) }));
  assert.ok(result.scroll <= result.width + 1, label + ': ' + JSON.stringify(result));
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const report = [];
  try {
    for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
      const browser = await engine.launch({ headless: true });
      try {
        for (const width of [320, 390, 768, 1440]) {
          const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width < 800, reducedMotion: 'reduce' });
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.goto(url);
          await noOverflow(page, `${name} ${width}`);
          await page.evaluate(() => { window.mediaRequests = 0; for (const name of ['getUserMedia', 'getDisplayMedia']) if (navigator.mediaDevices) navigator.mediaDevices[name] = () => { window.mediaRequests++; throw new Error('Unexpected media capture'); }; });
          assert.equal(await page.locator('#send-message').isDisabled(), true);
          await page.locator('#message-input').fill('A draft worth keeping');
          await page.locator('[data-channel="files"]').click();
          await page.locator('[data-channel="general"]').click();
          assert.equal(await page.locator('#message-input').inputValue(), 'A draft worth keeping');
          await page.locator('#message-input').fill('<img src=x onerror=alert(1)> hello');
          await page.locator('#send-message').click();
          assert.equal(await page.locator('.local-message img').count(), 0);
          assert.match(await page.locator('.local-message').innerText(), /<img src=x/);
          await page.getByRole('button', { name: 'Watch silently', exact: true }).click();
          assert.equal(await page.locator('#session-pane').isVisible(), true);
          await page.locator('[data-channel="files"]').click();
          assert.equal(await page.locator('#session-pane').isVisible(), true);
          await page.getByRole('button', { name: 'View conversation', exact: false }).click();
          assert.equal(await page.locator('.message-highlight').count(), 1);
          await page.getByRole('button', { name: 'Join conversation', exact: true }).click();
          assert.match(await page.locator('#session-mode').innerText(), /Microphone stays off/);
          await page.getByRole('button', { name: 'Share a screen', exact: true }).click();
          await page.getByRole('button', { name: 'Project notes', exact: true }).click();
          await page.getByRole('button', { name: 'Share this sample', exact: true }).click();
          assert.match(await page.locator('#session-art').innerText(), /Weekend project/);
          await page.getByRole('button', { name: 'Leave', exact: true }).click();
          assert.equal(await page.locator('#session-pane').isVisible(), false);
          await page.locator('[data-channel="plans"]').click();
          await page.getByRole('button', { name: 'Count me in' }).click();
          await page.locator('[data-channel="home"]').click();
          await page.locator('[data-channel="plans"]').click();
          assert.equal(await page.locator('#join-plan').getAttribute('aria-pressed'), 'true');
          await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
          assert.equal(await page.locator('.local-message').count(), 0);
          await page.getByRole('radio', { name: 'Amber', exact: true }).check();
          assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()), '#ffc870');
          await page.getByRole('radio', { name: 'Cyan', exact: true }).check();
          await page.getByRole('button', { name: 'Watch silently', exact: true }).click();
          assert.equal(await page.getByRole('button', { name: 'Play scene' }).isDisabled(), true);
          await page.getByRole('button', { name: 'Leave', exact: true }).click();
          if (width < 761) {
            await page.locator('.mobile-menu summary').click();
            await page.getByRole('navigation', { name: 'Mobile', exact: true }).getByRole('link', { name: 'Compatibility', exact: true }).click();
            assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
          }
          await page.locator('#bitrate').fill('80');
          await page.locator('#duration').fill('180');
          assert.equal(await page.locator('#payload-total').innerText(), '108.00 GB');
          await page.locator('#bitrate').fill('12');
          await page.locator('#duration').fill('60');
          assert.equal(await page.locator('#payload-total').innerText(), '5.40 GB');
          await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: path.join(artifacts, `${name}-${width}.png`), fullPage: true });
          if (name === 'chromium' && [390, 1440].includes(width)) {
            const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
            fs.writeFileSync(path.join(artifacts, `axe-${width}.json`), JSON.stringify(axe.violations, null, 2));
            assert.deepEqual(axe.violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target) })), [], 'Accessibility violations');
          }
          assert.deepEqual(errors, [], 'JavaScript runtime errors');
          assert.equal(await page.evaluate(() => window.mediaRequests), 0);
          await noOverflow(page, `${name} ${width} after interaction`);
          report.push(`${name} ${width}: interaction, layout, reduced-motion passed`);
          await context.close();
        }
        const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
        const page = await context.newPage();
        await page.goto(url);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
        await page.getByRole('button', { name: 'Watch silently', exact: true }).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#session-pane').isVisible(), true);
        await page.getByRole('button', { name: 'Play scene' }).click();
        assert.equal(await page.locator('#demo').evaluate(el => el.classList.contains('is-playing')), true);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForFunction(() => !document.querySelector('#demo').classList.contains('is-playing'));
        await page.evaluate(() => document.documentElement.style.fontSize = '32px');
        await noOverflow(page, `${name} 200 percent text`);
        await page.screenshot({ path: path.join(artifacts, `${name}-large-text.png`), fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        await noOverflow(page, `${name} mobile 200 percent text`);
        await page.screenshot({ path: path.join(artifacts, `${name}-mobile-large-text.png`), fullPage: true });
        await page.evaluate(() => document.documentElement.style.fontSize = '16px');
        await page.setViewportSize({ width: 844, height: 390 });
        await noOverflow(page, `${name} phone landscape`);
        await context.close();
        const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
        const staticPage = await noJs.newPage();
        await staticPage.goto(url);
        assert.equal(await staticPage.locator('[data-download]').count(), 2);
        assert.equal(await staticPage.locator('noscript').isVisible(), true);
        await noOverflow(staticPage, `${name} no JavaScript`);
        await noJs.close();
        report.push(`${name}: keyboard, motion preference change, 200% text and no-JavaScript passed`);
      } finally { await browser.close(); }
    }
    fs.writeFileSync(path.join(artifacts, 'report.json'), JSON.stringify(report, null, 2));
    console.log(report.join('\n'));
  } finally { server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
