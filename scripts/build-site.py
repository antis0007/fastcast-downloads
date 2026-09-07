"""Render the static public site from shared chrome and plain HTML page bodies.

The release manifest pins downloads to published assets. A website build never
discovers, promotes, or publishes an application release.
"""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://antis0007.github.io/fastcast-downloads/'
REPO = 'https://github.com/antis0007/fastcast-downloads'
release = json.loads((ROOT / 'src/release.json').read_text(encoding='utf-8'))
PAGES = {
    'index': ('Free screen sharing for Windows and Android', 'Share a Windows screen or window with another PC or Android device. FastCast is free, with no subscriptions in the current preview.'),
    'product': ('Meet FastCast', 'Explore the native FastCast interface, screen-sharing controls, and the current product scope.'),
    'downloads': ('Download FastCast', 'Free Windows installer, Android APK, and matching portable bundle. Direct downloads and clear install requirements.'),
    'get-started': ('Get started', 'Install matching FastCast apps, connect your receiving device, and start your first screen-sharing session.'),
    'platforms': ('Platforms and requirements', 'Check Windows and Android support, hardware requirements, and network compatibility before installing FastCast.'),
    'community': ('Community', 'Help shape FastCast for smaller groups. Share feedback, report issues, and follow the project.'),
    'help': ('Help and frequently asked questions', 'Find answers about FastCast pricing, installation, connections, audio, input, and current limitations.'),
    'releases': ('Release notes', 'Find the published FastCast preview, matching downloads, known limitations, and previous releases.'),
    'privacy': ('Privacy and sharing', 'Understand what this website collects, where downloads are hosted, and how to share screens and invitations carefully.'),
    '404': ('Page not found', 'Find FastCast downloads, setup instructions, and support.'),
    'why-fastcast': ('Why FastCast', 'Take a step away from platform dependence with free native screen sharing. See the current scope and tradeoffs.'),
    'how-it-works': ('How FastCast works for free', 'Follow the screen-sharing data path and understand who provides the hardware, network, and hosting.'),
    'data-and-privacy': ('Data and privacy compared', 'A sourced look at Discord data collection and retention, alongside FastCast’s current screen-sharing architecture.'),
    'bandwidth': ('Screen-sharing bandwidth calculator', 'Estimate video payload, endpoint traffic, and a hypothetical relay’s traffic with transparent assumptions.'),
}


def link(slug, label, current):
    active = ' aria-current="page"' if current == slug else ''
    return f'<a href="{slug}.html"{active}>{label}</a>'


def screenshot(name, caption, eager=False):
    meta = release['screenshots'][name]
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return f'''<figure class="screenshot">
  <a class="image-open" href="assets/{name}.png" data-lightbox aria-label="Enlarge {escape(meta['label'])}">
    <img src="assets/{name}.png" width="{meta['width']}" height="{meta['height']}" alt="{escape(meta['alt'])}" {loading}>
    <span class="image-action" aria-hidden="true">View full size ↗</span>
  </a>
  <figcaption>{caption}</figcaption>
</figure>'''


def render(slug, title, description):
    canonical = BASE + ('' if slug == 'index' else slug + '.html')
    nav = ''.join(link(key, label, slug) for key, label in [('product','Product'), ('why-fastcast','Why FastCast'), ('get-started','Get started'), ('help','Help')])
    tokens = {
        'VERSION': release['version'], 'RELEASE_LABEL': release['label'],
        'RELEASE_URL': f"{REPO}/releases/tag/{release['tag']}", 'REPO': REPO,
        'WINDOWS_URL': release['assets']['windows']['url'],
        'ANDROID_URL': release['assets']['android']['url'],
        'BUNDLE_URL': release['assets']['bundle']['url'],
        'CHECKSUMS_URL': release['assets']['checksums']['url'],
        'WINDOWS_SIZE': release['assets']['windows']['size'],
        'ANDROID_SIZE': release['assets']['android']['size'],
        'BUNDLE_SIZE': release['assets']['bundle']['size'],
        'SCREENSHOT_WIDE': screenshot('windows-share', 'Native Windows app · Default blue theme · September 7 development build. <a href="product.html#screenshots">About these captures</a>.', slug in ['index','product']),
        'SCREENSHOT_COMPACT': screenshot('windows-compact', 'Native Windows app at a smaller window size · September 7 development build.'),
    }
    body = (ROOT / f'src/pages/{slug}.html').read_text(encoding='utf-8')
    for key, value in tokens.items():
        body = body.replace('{{' + key + '}}', value)
    if re.search(r'\{\{\w+\}\}', body):
        raise ValueError(f'Unresolved template value in {slug}')
    robots = '<meta name="robots" content="noindex">' if slug == '404' else ''
    page_script = '<script src="bandwidth.js" defer></script>' if slug == 'bandwidth' else ''
    html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0e0f11">
  <meta name="fastcast-version" content="{release['version']}">
  <meta name="description" content="{escape(description)}">
  {robots}
  <title>{escape(title)} — FastCast</title>
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="FastCast">
  <meta property="og:title" content="{escape(title)} — FastCast">
  <meta property="og:description" content="{escape(description)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{BASE}assets/og.png">
  <meta property="og:image:alt" content="FastCast. Your screen. Your connection. Free. No subscriptions. Windows and Android development preview.">
  <meta name="twitter:card" content="summary_large_image">
  <script src="site.js" defer></script>
  {page_script}
</head>
<body class="page-{slug}">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="announcement"><div class="wrap"><span><span class="status-dot" aria-hidden="true"></span> Free. No subscriptions.</span><a href="releases.html">{release['label']} <span aria-hidden="true">↗</span></a></div></div>
  <header class="site-header wrap">
    <a class="brand" href="index.html" aria-label="FastCast home"><img src="assets/mark.svg" width="30" height="30" alt="">FastCast</a>
    <nav aria-label="Main">{nav}</nav><a class="button small header-download {'current' if slug == 'downloads' else ''}" href="downloads.html">Download <span aria-hidden="true">↓</span></a>
  </header>
  <main id="main" tabindex="-1">{body}</main>
  <footer class="site-footer wrap">
    <div class="footer-intro"><a class="brand" href="index.html">FastCast</a><p>Your screen. Your connection.</p><p class="small-copy">Free to use. No subscriptions in the current preview.</p></div>
    <nav aria-label="Product links"><h2>Product</h2>{link('product','Overview',slug)}{link('downloads','Downloads',slug)}{link('platforms','Platforms',slug)}{link('releases','Release notes',slug)}</nav>
    <nav aria-label="Resources"><h2>Resources</h2>{link('get-started','Getting started',slug)}{link('help','Help & FAQ',slug)}{link('community','Community',slug)}{link('privacy','Privacy & sharing',slug)}</nav>
    <nav aria-label="Transparency"><h2>Transparency</h2>{link('why-fastcast','Why FastCast',slug)}{link('how-it-works','How it works',slug)}{link('bandwidth','Bandwidth calculator',slug)}{link('data-and-privacy','Data & privacy compared',slug)}</nav>
    <div class="footer-bottom"><span>Windows + Android · Development preview</span><a href="{REPO}">GitHub ↗</a><a href="{REPO}/blob/main/LICENSE">License ↗</a></div>
  </footer>
  <dialog class="image-dialog" aria-label="Full-size app screenshot"><form method="dialog"><button class="button" aria-label="Close screenshot">Close <span aria-hidden="true">×</span></button></form><div class="image-scroll"><img alt=""></div><p>Native client-area capture · September 7 development build · Default blue theme</p></dialog>
</body>
</html>
'''
    # A Pages 404 can be served at any nested path. Its navigation and assets must
    # resolve from the public project root, not from the unknown request path.
    if slug == '404':
        html = re.sub(r'(href|src)="(?!https?:|#)([^\"]+)"', lambda match: f'{match[1]}="{BASE}{match[2]}"', html)
    html = '\n'.join(line.rstrip() for line in html.splitlines()) + '\n'
    (ROOT / f'{slug}.html').write_text(html, encoding='utf-8')


for slug, (title, description) in PAGES.items():
    render(slug, title, description)
urls = [BASE + ('' if slug == 'index' else slug + '.html') for slug in PAGES if slug != '404']
(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(f'  <url><loc>{url}</loc></url>' for url in urls) + '\n</urlset>\n', encoding='utf-8')
(ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n', encoding='utf-8')
print(f'Rendered {len(PAGES)} static pages for {release["label"]}')
