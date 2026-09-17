const { chromium, firefox, webkit } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results');
// Redirect stubs for former URLs are checked separately; a meta refresh would
// navigate the crawl away mid-assertion.
const redirects = { 'why-fastcast.html': 'why-pyrenet.html' };
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html') && !(name in redirects));
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
    for (const width of [320, 390, 768, 1051, 1152, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const failures = [];
      page.on('pageerror', error => failures.push(error.message));
      page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
      for (const file of pages) {
        await page.goto(base + file);
        assert.equal(await page.locator('h1').count(), 1, file);
        if (file === 'index.html') {
          const logo = await page.locator('.site-header .brand-mark').boundingBox();
          const wordmark = page.locator('.site-header .brand-wordmark');
          const header = await page.locator('.site-header').boundingBox();
          assert.ok(logo.y >= header.y && logo.y + logo.height <= header.y + header.height, 'brand mark stays inside the header');
          assert.equal((await wordmark.textContent()).trim(), 'Pyrenet', 'header wordmark carries the product name');
          assert.equal(await wordmark.isVisible(), width > 760, 'wordmark visibility follows the compact-header breakpoint');
          const capture = await page.locator('#interface [data-lightbox]').boundingBox();
          const wizard = await page.locator('.hero .cast-wizard').boundingBox();
          const tour = await page.locator('#interface .wrap').boundingBox();
          assert.ok(wizard.width > 0, 'the original wizard remains visible');
          const seal = await page.locator('.hero .rune-circle-lg').boundingBox();
          assert.ok(seal.x >= 0 && seal.x + seal.width <= width, 'the full magic seal fits the viewport');
          assert.equal(await page.locator('.hero-visual').evaluate(el => getComputedStyle(el).overflowX), 'visible', 'the aura is not cut at the hero column edges');
          assert.ok(capture.width > tour.width * .8, 'the app capture has the full content width');
          const table = await page.locator('.ledger-table').boundingBox();
          const caption = await page.locator('.ledger-table caption').boundingBox();
          assert.ok(caption.width >= table.width * .9, 'capability caption uses the table width instead of wrapping word by word');
          for (const state of ['available', 'preview']) {
            const status = page.locator(`.light-panel .status-${state}`).first();
            assert.equal(await status.evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)', `${state} status has no box behind its token`);
          }
          const openFaq = page.locator('.faq[open] summary').first();
          assert.equal(await openFaq.evaluate(el => getComputedStyle(el, '::after').content), '"-"', 'open FAQ uses a readable collapse marker');
        }
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
          await page.evaluate(() => window.scrollTo(0, 0));
          if (file === 'index.html') {
            await page.screenshot({ path: path.join(output, `homepage-hero-${width}.png`) });
          }
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
    const aidDisclosure = page.locator('.about-ai');
    await aidDisclosure.locator('summary').click();
    assert.equal(await aidDisclosure.locator('summary').evaluate(el => getComputedStyle(el, '::before').content), '"-"', 'open development disclosure uses a readable collapse marker');
    await page.goto(base + 'bandwidth.html');
    assert.ok(await page.locator('#bitrate').isDisabled());
    assert.ok(await page.locator('#duration').isDisabled());
    assert.ok(await page.locator('#reset-bandwidth').isDisabled());
    assert.equal(await page.locator('#payload-value').textContent(), '5.40');
    assert.equal(await page.locator('#payload-table tr').count(), 5);
    assert.equal(await page.locator('#payload-chart').isVisible(), false);
    await checkConnectionExplanation(page);
    await context.close();
    console.log(`${name}: no-JavaScript downloads, image and FAQ passed`);
  } finally {
    await browser.close();
  }
}

// Native controls must explain both routes even when scripts are unavailable.
// Open every disclosure so overflow and accessibility cover the optional detail.
async function checkConnectionExplanation(page) {
  await page.goto(base + 'how-it-works.html');
  const direct = page.getByRole('radio', { name: 'Direct connection Preferred', exact: true });
  const relay = page.getByRole('radio', { name: 'Relay fallback When available', exact: true });
  assert.ok(await direct.isChecked());
  assert.ok(await page.locator('#direct-path').isVisible());
  assert.equal(await page.locator('#relay-path-detail').isVisible(), false);
  await direct.focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await relay.isChecked());
  assert.ok(await page.locator('#relay-path-detail').isVisible());
  assert.equal(await page.locator('#direct-path').isVisible(), false);
  assert.match(await page.locator('#relay-path-detail').textContent(), /blocks UDP entirely/);
  await assertNoOverflow(page, 'relayed connection diagram');
  await page.keyboard.press('ArrowLeft');
  assert.ok(await direct.isChecked());
  assert.ok(await page.locator('#direct-path').isVisible());
  for (const summary of await page.locator('.connection-detail summary').all()) {
    await summary.focus();
    await page.keyboard.press('Enter');
  }
  assert.equal(await page.locator('.connection-detail[open]').count(), 5);
  await assertNoOverflow(page, 'expanded connection explanation');
}

async function checkWizardInteractions(name, engine) {
  const browser = await engine.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base);
    const body = page.locator('.cast-body');
    const bubble = page.locator('.wizard-voice');
    const tip = page.getByRole('button', { name: 'Ask for a tip', exact: true });
    const pools = await page.locator('#wizard-voice-lines').evaluate(el => JSON.parse(el.textContent));
    await body.focus();
    await page.keyboard.press('Enter');
    assert.equal(await bubble.textContent(), pools.first[0]);
    await page.keyboard.press('Enter');
    assert.equal(await bubble.textContent(), pools.first[0], 'double activation leaves the greeting readable');

    const chat = [];
    for (let i = 0; i <= pools.idle.length; i += 1) {
      await page.waitForTimeout(1150);
      await page.keyboard.press('Enter');
      chat.push(await bubble.textContent());
    }
    assert.equal(new Set(chat.slice(0, -1)).size, pools.idle.length, 'conversation visits the whole pool');
    assert.notEqual(chat.at(-1), chat.at(-2), 'new chat cycle does not immediately repeat');
    await page.waitForTimeout(700);
    await page.keyboard.press('Enter');
    assert.equal(await bubble.getAttribute('data-pool'), 'poke');
    await page.waitForTimeout(700);
    const tips = [];
    for (let i = 0; i <= pools.rightclick.length; i += 1) {
      if (i) await page.waitForTimeout(700);
      await body.click({ button: 'right' });
      assert.equal(await bubble.getAttribute('data-pool'), 'rightclick');
      tips.push(await bubble.textContent());
      await assertNoOverflow(page, `${name} wizard tip`);
    }
    assert.equal(new Set(tips.slice(0, -1)).size, pools.rightclick.length, 'right clicks visit every tip instead of sticking');
    assert.notEqual(tips.at(-1), tips.at(-2), 'tip shuffle boundary does not repeat');
    assert.equal(await page.locator('.wizard-announcement').textContent(), tips.at(-1));
    assert.equal(await body.evaluate(el => getComputedStyle(el).animationName), 'none', 'tips respect reduced motion');
    await page.keyboard.press('Escape');
    assert.ok(await bubble.isHidden());
    await page.waitForTimeout(700);
    await tip.focus();
    await page.keyboard.press('Space');
    assert.equal(await bubble.getAttribute('data-pool'), 'rightclick', 'keyboard has the same tips');
    assert.ok(await bubble.isVisible());
    const replyBox = await bubble.boundingBox();
    const headerBox = await page.locator('.site-header').boundingBox();
    assert.ok(replyBox.y >= headerBox.y + headerBox.height, 'sticky header does not cover the reply');
    await page.screenshot({ path: path.join(output, `wizard-tip-${name}-390.png`) });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(v => v.id), [], 'visible wizard tip accessibility');
    await page.locator('h1').click();
    assert.ok(await bubble.isHidden(), 'clicking elsewhere dismisses the remark');
    assert.equal(await body.evaluate(el => el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, shiftKey: true }))), true, 'shift context menu remains native');
    assert.equal(await page.locator('h1').evaluate(el => el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))), true, 'other context menus remain native');
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => { document.documentElement.style.fontSize = '130%'; });
      for (let i = 0; i < pools.rightclick.length; i += 1) {
        await page.waitForTimeout(700);
        await tip.click();
        await assertNoOverflow(page, `${name} tip at ${width} with enlarged text`);
        const reply = await bubble.boundingBox();
        const header = await page.locator('.site-header').boundingBox();
        assert.ok(reply.y >= header.y + header.height, 'full reply clears sticky header');
        assert.ok(reply.y + reply.height <= 1000, 'full reply stays in viewport');
      }
      await page.screenshot({ path: path.join(output, `wizard-tip-${name}-${width}.png`) });
    }
    await context.close();

    const touch = await browser.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
    const touchPage = await touch.newPage();
    await touchPage.goto(base);
    await touchPage.getByRole('button', { name: 'Ask for a tip', exact: true }).tap();
    assert.equal(await touchPage.locator('.wizard-voice').getAttribute('data-pool'), 'rightclick');
    assert.ok(await touchPage.locator('.wizard-mouse-hint').isHidden());
    await touch.close();

    const fade = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const fadePage = await fade.newPage();
    await fadePage.clock.install();
    await fadePage.goto(base);
    const fadeBubble = fadePage.locator('.wizard-voice');
    await fadePage.getByRole('button', { name: 'Ask for a tip', exact: true }).click();
    await fadePage.clock.fastForward(7999);
    assert.ok(await fadeBubble.isVisible(), 'reply remains readable for the full dwell period');
    await fadePage.clock.fastForward(1);
    assert.ok(await fadeBubble.evaluate(el => el.classList.contains('is-fading')), 'reply fades after the dwell period');
    assert.equal(await fadeBubble.evaluate(el => getComputedStyle(el).animationName), 'wizard-fade');
    await fadePage.clock.fastForward(260);
    assert.ok(await fadeBubble.isHidden(), 'reply is hidden after its fade');
    assert.equal(await fadePage.locator('.wizard-announcement').textContent(), '', 'hidden reply is cleared from the live region');
    await fade.close();
    console.log(`${name}: wizard conversation, tip rotation, rapid clicks, keyboard, touch, timed fade, dismissal and accessibility passed`);
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
    // Reduced motion must stop the decorative animation. The seal is the right
    // probe: it stays visible with motion off, unlike the ember and floating-rune
    // layers, which are hidden outright and so have nothing to assert on.
    assert.equal(await page.locator('.rune-ring').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.locator('.cast-body').focus();
    await page.keyboard.press('Enter');
    assert.ok(await page.locator('.wizard-voice').isVisible());
    assert.ok((await page.locator('.wizard-voice').textContent()).trim().length > 0);
    assert.equal(await page.locator('.wizard-voice').getAttribute('data-pool'), 'first');
    assert.equal(await page.locator('.cast-body').evaluate(el => getComputedStyle(el).animationName), 'none');
    await assertNoOverflow(page, 'large wizard remark');
    // Curated regions may have no dedicated dialogue. Clicking them must still
    // activate the wizard, rather than swallowing the visitor's first click.
    for (const [x, y] of [[.70, .54], [.34, .55], [.30, .17]]) {
      await page.goto(base);
      const body = page.locator('.cast-body');
      await body.scrollIntoViewIfNeeded();
      const box = await body.boundingBox();
      await page.mouse.click(box.x + box.width * x, box.y + box.height * y);
      assert.ok(await page.locator('.wizard-voice').isVisible());
      assert.equal(await page.locator('.wizard-voice').getAttribute('data-pool'), 'first');
    }
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Get started', exact: true }).click();
    await page.waitForURL('**/get-started.html');
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.getByRole('navigation', { name: 'Setup steps' }).getByRole('link', { name: '2. Create an invitation', exact: true }).click();
      const position = await page.evaluate(() => ({
        section: document.querySelector('#invite').getBoundingClientRect().top,
        header: document.querySelector('.site-header').getBoundingClientRect().bottom,
      }));
      assert.ok(position.section >= position.header, `setup anchor hidden by header at ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Help', exact: true }).click();
    await page.waitForURL('**/help.html');
    const search = page.getByRole('searchbox', { name: 'Search help' });
    await search.fill('subscriptions');
    assert.equal(await page.locator('.faq-group details:visible').count(), 1);
    await search.fill('no-such-answer-8294');
    assert.ok(await page.locator('#no-results').isVisible());
    await page.getByRole('link', { name: 'Connection & diagnostics', exact: true }).click();
    assert.equal(await search.inputValue(), '');
    // Fourteen: the standalone "about development and AI assistance" note is a
    // sibling of the topic groups, not one of their answers.
    assert.equal(await page.locator('.faq-group details:visible').count(), 14);
    await page.goto(base + 'product.html');
    assert.equal((await page.locator('#capabilities h2').textContent()).trim(), 'Features and limitations');
    assert.equal(await page.locator('.status-key dt').count(), 4);
    assert.equal(await page.locator('.capability-group').count(), 4);
    const release = JSON.parse(fs.readFileSync(path.join(root, 'src/release.json'), 'utf8'));
    const capabilities = release.capability_groups.flatMap(group => group.items);
    const rows = page.locator('.capability-table tbody tr');
    assert.equal(await rows.count(), capabilities.length);
    for (const [index, capability] of capabilities.entries()) {
      const row = rows.nth(index);
      assert.equal((await row.locator('th').textContent()).trim(), capability.name);
      assert.equal(await row.locator(`.status-${capability.status}`).count(), 1);
    }
    assert.equal(await page.getByText('The whole feature list').count(), 0);
    assert.equal(await page.getByText('Meet FastCast').count(), 0);
    await checkConnectionExplanation(page);
    const connectionA11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(connectionA11y.violations.map(v => v.id), [], 'expanded connection explanation accessibility');
    await page.goto(base + 'privacy.html');
    assert.equal(await page.getByText('FASTCAST_DISCOVERY').count(), 0);
    assert.equal(await page.getByText('helper URL').count(), 0);
    await page.goto(base + 'downloads.html');
    assert.equal(await page.locator('code.hash').count(), 3);
    for (const [from, to] of Object.entries(redirects)) {
      await page.goto(base + from);
      await page.waitForURL(base + to);
      assert.equal(await page.locator('h1').count(), 1, `${from} redirects to a real page`);
    }
    await context.close();
    console.log('Screenshot close/focus, reduced motion, navigation, FAQ search and legacy redirects passed');

    const androidContext = await browser.newContext({ userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36', viewport: { width: 390, height: 900 }, hasTouch: true });
    const androidPage = await androidContext.newPage();
    await androidPage.goto(base);
    assert.equal(await androidPage.locator('.hero .primary').getAttribute('data-download'), 'android');
    await androidPage.locator('.cast-body').tap();
    assert.ok(await androidPage.locator('.wizard-voice').isVisible(), 'touch activation produces a wizard remark');
    assert.equal(await androidPage.locator('.cast-figure.is-dragging').count(), 0);
    await assertNoOverflow(androidPage, 'touch wizard remark');
    await androidPage.goto(base + 'downloads.html');
    assert.ok(await androidPage.locator('[data-platform="android"] .recommendation').isVisible());
    await androidContext.close();

    const windowsContext = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36', viewport: { width: 1440, height: 900 } });
    const windowsPage = await windowsContext.newPage();
    await windowsPage.goto(base);
    assert.equal(await windowsPage.locator('.hero .primary').getAttribute('data-download'), 'windows');
    await windowsPage.locator('.cast-wizard').evaluate(el => el.decode());
    await windowsPage.screenshot({ path: path.join(output, 'homepage-motion-1440.png') });
    const wizardBox = await windowsPage.locator('.cast-body').boundingBox();
    await windowsPage.mouse.move(wizardBox.x + wizardBox.width / 2, wizardBox.y + wizardBox.height / 2);
    await windowsPage.mouse.down();
    await windowsPage.mouse.move(1438, wizardBox.y + wizardBox.height / 2, { steps: 5 });
    await windowsPage.evaluate(() => new Promise(requestAnimationFrame));
    await assertNoOverflow(windowsPage, 'dragging the wizard to the viewport edge');
    await windowsPage.mouse.up();
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
      if (!selected || selected === name) {
        await checkLayouts(name, engine);
        await checkWizardInteractions(name, engine);
      }
    }
    await checkJourneysAndAccessibility();
  } finally {
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
