"""Render the static public site from shared chrome and plain HTML page bodies.

The release manifest pins downloads to published assets. A website build never
discovers, promotes, or publishes an application release.
"""
from pathlib import Path
from html import escape
from datetime import date
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://antis0007.github.io/fastcast-downloads/'
REPO = 'https://github.com/antis0007/fastcast-downloads'
release = json.loads((ROOT / 'src/release.json').read_text(encoding='utf-8'))
PAGES = {
    'index': ('Your screen. Your connection.', 'A step away from platform dependence — share a Windows screen without a Discord-sized chat platform, a subscription, or a FastCast relay.'),
    'product': ('The Windows app', 'Real screenshots, what the public build can do, and what it still cannot.'),
    'downloads': ('Download FastCast', 'Unsigned Windows sender/receiver, debug-signed Android viewer, matching zip. Direct GitHub links.'),
    'get-started': ('Setup', 'Matching builds. Viewer writes the invite. Windows starts the share.'),
    'platforms': ('What runs', 'Windows x64 sends and watches. Android 8+ watches. Linux receive is in source, not in this zip. No Mac, iOS, or browser app.'),
    'community': ('Bugs', 'Public GitHub issues for a screen-sharing preview. Do not paste invitations.'),
    'help': ('Help', 'Install fights, dead connections, audio, input. Search stays in your browser.'),
    'roadmap': ('Roadmap', 'What is built, what is being qualified, and what is not started yet.'),
    'releases': ('Release notes', 'Published FastCast preview, matching files, known holes, older tags.'),
    'privacy': ('Privacy', 'This site has no analytics. GitHub hosts the files. Keep invites private.'),
    '404': ('Nothing here', 'Downloads, setup, and help.'),
    'why-fastcast': ('Why FastCast', 'Not another Discord — screen sharing without a chat empire, a store login, or a FastCast relay.'),
    'how-it-works': ('How the packets move', 'Windows encodes, a viewer decodes, GitHub is not in the live path.'),
    'data-and-privacy': ('Data compared', 'What Discord documents, next to what this FastCast preview actually does.'),
    'bandwidth': ('Bandwidth arithmetic', 'Estimate video payload at each end, and what a hypothetical relay would double.'),
}


def link(slug, label, current, href=None):
    target = href or f'{slug}.html'
    active = ' aria-current="page"' if href is None and current == slug else ''
    return f'<a href="{target}"{active}>{label}</a>'


def fill(text):
    return text.replace('{{RELEASE_LABEL}}', release['label']).replace('{{VERSION}}', release['version'])


def screenshot(name, eager=False):
    meta = release['screenshots'][name]
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    caption = fill(meta['caption'])
    extra = f' <a href="product.html#screenshots">What’s on these images</a>.' if name == 'windows-share' else ''
    return f'''<figure class="screenshot">
  <a class="image-open" href="assets/{name}.png" data-lightbox aria-label="Enlarge {escape(meta['label'])}">
    <img src="assets/{name}.png" width="{meta['width']}" height="{meta['height']}" alt="{escape(meta['alt'])}" {loading}>
    <span class="image-action" aria-hidden="true">View full size ↗</span>
  </a>
  <figcaption>{escape(caption)}{extra}</figcaption>
</figure>'''


def json_ld():
    data = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'FastCast',
        'applicationCategory': 'MultimediaApplication',
        'operatingSystem': 'Windows (send and receive); Android 8+ (receive only)',
        'softwareVersion': release['version'],
        'url': BASE,
        'downloadUrl': BASE + 'downloads.html',
        'image': BASE + 'assets/og.png',
        'description': PAGES['index'][1],
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
            'description': release['offer'],
        },
    }
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>'


def captured_display():
    """Display date of the wide app capture, kept distinct from the release date."""
    taken = date.fromisoformat(release['screenshots']['windows-share']['captured'])
    return f'{taken:%B} {taken.day}, {taken.year}'


def capability_ledger():
    legend = release['status_legend']
    by_id = {item['id']: item for item in legend}
    key = ''.join(
        f'<div><dt>{escape(item["label"])}</dt><dd>{escape(item["meaning"])}</dd></div>'
        for item in legend
    )
    groups = []
    for group in release['capability_groups']:
        rows = []
        for item in group['items']:
            status = by_id[item['status']]
            rows.append(
                f'\n<div class="capability-row">'
                f'<dt>{escape(item["name"])}</dt>'
                f'<dd class="status status-{status["id"]}"><span class="status-word">{escape(status["label"])}</span></dd>'
                f'<dd class="capability-detail">{escape(fill(item["detail"]))}</dd>'
                f'</div>'
            )
        groups.append(
            f'<section class="capability-group" id="status-{group["id"]}" aria-labelledby="status-{group["id"]}-title">\n'
            f'<h3 id="status-{group["id"]}-title">{escape(group["title"])}</h3>\n'
            f'<p class="capability-intro">{escape(fill(group["intro"]))}</p>\n'
            f'<dl class="capability-ledger">{"".join(rows)}</dl>\n'
            f'</section>'
        )
    return (
        f'<dl class="status-key" aria-label="How status words are used">{key}</dl>\n'
        + '\n'.join(groups)
    )


def sha_rows():
    rows = []
    for key in ('windows', 'android', 'bundle'):
        asset = release['assets'][key]
        rows.append(
            f"<tr><th scope=\"row\">{escape(asset['filename'])}</th>"
            f"<td><code class=\"hash\" data-hash=\"{asset['sha256']}\">{asset['sha256']}</code></td></tr>"
        )
    return ''.join(rows)


def evidence_list():
    items = ''.join(f'<li>{escape(item)}</li>' for item in release['evidence']['items'])
    caveats = ''.join(f'<li>{escape(item)}</li>' for item in release['evidence']['caveats'])
    return f'''<ul class="evidence-facts">{items}</ul>
<p class="note">{escape(release['evidence']['framing'])}</p>
<ul class="evidence-caveats">{caveats}</ul>'''


def history_html():
    blocks = []
    for item in release['history']:
        tag_class = 'tag' if item.get('current') else 'tag neutral'
        tag_label = 'CURRENT PREVIEW' if item.get('current') else 'PREVIOUS PREVIEW'
        url = f"{REPO}/releases/tag/{item['tag']}"
        if item.get('current'):
            body = f'''<article>
  <h2>FastCast {escape(item['label'])}</h2>
  <p>{escape(item['summary'])}</p>
  <h3>In these files</h3>
  <ul>
    <li>Windows sending and receiving, plus Android receiving.</li>
    <li>Session invitations and screen or window selection.</li>
    <li>Audio and remote-control controls exist in the UI. Physical remote input is unproven. Audible output was not independently confirmed.</li>
    <li>Matching bundle and USB update helpers.</li>
  </ul>
  <h3>Holes</h3>
  <ul>{''.join(f'<li>{escape(limit)}</li>' for limit in release['limitations'])}</ul>
  <p class="note">SHA-256 checked on the published files. That is not the same as “every phone, every NAT.”</p>
  <div class="actions"><a class="button primary" href="{escape(release['assets']['windows']['url'])}">Download Windows app</a><a class="button" href="downloads.html">All packages</a><a class="text-link" href="{url}">Original release notes ↗</a></div>
</article>'''
        else:
            body = f'''<article>
  <h2>FastCast {escape(item['label'])}</h2>
  <p>{escape(item['summary'])}</p>
  <a class="text-link" href="{url}">View archived release ↗</a>
</article>'''
        blocks.append(
            f'<section class="wrap release-entry"><div class="release-date"><span class="{tag_class}">{tag_label}</span>'
            f'<p>{escape(item["published_display"])}</p></div>{body}</section>'
        )
    return '\n'.join(blocks)


def write_screenshots_doc():
    shots = release['screenshots']
    wide = shots['windows-share']
    compact = shots['windows-compact']
    text = f'''# Native screenshot provenance

Both `windows-share.png` and `windows-compact.png` are unchanged client-area captures of the native FastCast Windows {wide['capture_build']}, taken {wide['captured']}. An isolated preferences file selected its default {wide['theme']}. Windows captured only the client area, so the operating-system title bar and its sample-application title are absent. No screenshot colours, controls, text, conversations, or session state were painted or generated.

- Wide capture: {wide['width']} × {wide['height']} pixels.
- Smaller window: {compact['width']} × {compact['height']} pixels. {compact['note']}
- These images {('represent the public ' + release['label'] + ' package.') if wide['represents_public_release'] else 'do not represent the public package pixel-for-pixel: ' + wide['note']}
- Neither image depicts a connected media session or establishes streaming performance.
- Website image frames, labels, and zoom controls are HTML/CSS outside the screenshots.
- `og.png` is a generated typographic brand graphic for social previews, not a screenshot.
'''
    (ROOT / 'assets/SCREENSHOTS.md').write_text(text, encoding='utf-8')


def write_readme():
    template = (ROOT / 'src/README.md').read_text(encoding='utf-8')
    tokens = {
        'VERSION': release['version'],
        'RELEASE_LABEL': release['label'],
        'TAG': release['tag'],
        'PUBLISHED': release['published_display'],
        'WINDOWS_URL': release['assets']['windows']['url'],
        'ANDROID_URL': release['assets']['android']['url'],
        'BUNDLE_URL': release['assets']['bundle']['url'],
        'CHECKSUMS_URL': release['assets']['checksums']['url'],
        'WINDOWS_SHA': release['assets']['windows']['sha256'],
        'ANDROID_SHA': release['assets']['android']['sha256'],
        'BUNDLE_SHA': release['assets']['bundle']['sha256'],
        'WINDOWS_SIZE': release['assets']['windows']['size'],
        'ANDROID_SIZE': release['assets']['android']['size'],
        'SITE': BASE.rstrip('/'),
        'REPO': REPO,
        'RELEASE_URL': f"{REPO}/releases/tag/{release['tag']}",
    }
    for key, value in tokens.items():
        template = template.replace('{{' + key + '}}', value)
    if re.search(r'\{\{\w+\}\}', template):
        raise ValueError('Unresolved template value in README')
    (ROOT / 'README.md').write_text(template, encoding='utf-8')


def render(slug, title, description):
    canonical = BASE + ('' if slug == 'index' else slug + '.html')
    nav = (
        link('product', 'Product', slug)
        + link('get-started', 'Get started', slug)
        + link('help', 'Help', slug)
        + link('github', 'GitHub', slug, href=REPO)
    )
    tokens = {
        'VERSION': release['version'],
        'RELEASE_LABEL': release['label'],
        'RELEASE_URL': f"{REPO}/releases/tag/{release['tag']}",
        'REPO': REPO,
        'PUBLISHED': release['published_display'],
        'CAPTURED': captured_display(),
        'NETWORK': release['network'],
        'STATUS': release['status'],
        'WINDOWS_URL': release['assets']['windows']['url'],
        'ANDROID_URL': release['assets']['android']['url'],
        'BUNDLE_URL': release['assets']['bundle']['url'],
        'CHECKSUMS_URL': release['assets']['checksums']['url'],
        'WINDOWS_SIZE': release['assets']['windows']['size'],
        'ANDROID_SIZE': release['assets']['android']['size'],
        'BUNDLE_SIZE': release['assets']['bundle']['size'],
        'WINDOWS_SHA': release['assets']['windows']['sha256'],
        'ANDROID_SHA': release['assets']['android']['sha256'],
        'BUNDLE_SHA': release['assets']['bundle']['sha256'],
        'WINDOWS_FILE': release['assets']['windows']['filename'],
        'ANDROID_FILE': release['assets']['android']['filename'],
        'BUNDLE_FILE': release['assets']['bundle']['filename'],
        'WINDOWS_SIGNING': release['signing']['windows'],
        'ANDROID_SIGNING': release['signing']['android'],
        'SCREENSHOT_WIDE': screenshot('windows-share', slug in ['index', 'product']),
        'SCREENSHOT_COMPACT': screenshot('windows-compact'),
        'SHA_ROWS': sha_rows(),
        'EVIDENCE': evidence_list(),
        'EVIDENCE_HEADLINE': escape(release['evidence']['headline']),
        'EVIDENCE_SCOPE': escape(fill(release['evidence']['scope'])),
        'RELEASE_HISTORY': history_html(),
        'DIALOG_CAPTION': escape(fill(release['screenshots']['windows-share']['caption'])),
        'CAPABILITY_LEDGER': capability_ledger(),
    }
    body = (ROOT / f'src/pages/{slug}.html').read_text(encoding='utf-8')
    for key, value in tokens.items():
        body = body.replace('{{' + key + '}}', value)
    if re.search(r'\{\{\w+\}\}', body):
        raise ValueError(f'Unresolved template value in {slug}')
    robots = '<meta name="robots" content="noindex">' if slug == '404' else ''
    page_script = '<script src="bandwidth.js" defer></script>' if slug == 'bandwidth' else ''
    preload = '<link rel="preload" href="assets/windows-share.png" as="image">' if slug in {'index', 'product'} else ''
    structured = json_ld() if slug in {'index', 'downloads'} else ''
    download_current = ' current' if slug == 'downloads' else ''
    html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b0d12">
  <meta name="fastcast-version" content="{escape(release['version'])}">
  <meta name="description" content="{escape(description)}">
  {robots}
  <title>{escape(title)} — FastCast</title>
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  {preload}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="FastCast">
  <meta property="og:title" content="{escape(title)} — FastCast">
  <meta property="og:description" content="{escape(description)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{BASE}assets/og.png">
  <meta property="og:image:width" content="1280">
  <meta property="og:image:height" content="640">
  <meta property="og:image:alt" content="FastCast. Your screen. Your connection. Windows sender and Android viewer development preview.">
  <meta name="twitter:card" content="summary_large_image">
  {structured}
  <script src="site.js" defer></script>
  {page_script}
</head>
<body class="page-{slug}">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="announcement"><div class="wrap"><span><span class="status-dot" aria-hidden="true"></span> {escape(release['status'])}</span><a href="releases.html">{escape(release['label'])} <span aria-hidden="true">↗</span></a></div></div>
  <header class="site-header wrap">
    <a class="brand" href="index.html" aria-label="FastCast home"><img src="assets/mark.svg" width="30" height="30" alt="">FastCast</a>
    <nav aria-label="Main">{nav}</nav>
    <a class="button small primary header-download{download_current}" href="downloads.html">Download</a>
  </header>
  <main id="main" tabindex="-1">{body}</main>
  <footer class="site-footer wrap">
    <div class="footer-intro"><a class="brand footer-brand" href="index.html" aria-label="FastCast home"><img src="assets/mark.svg" width="48" height="48" alt=""><span>FastCast</span></a><p>Your screen. Your connection.</p><p class="small-copy">{escape(release['offer'])}</p><p class="small-copy">{escape(release['application_source'])}</p></div>
    <nav aria-label="Product links"><h2>Product</h2>{link('product','Overview',slug)}{link('downloads','Downloads',slug)}{link('platforms','Platforms',slug)}{link('releases','Release notes',slug)}</nav>
    <nav aria-label="Resources"><h2>Resources</h2>{link('get-started','Setup',slug)}{link('help','Help',slug)}{link('community','Bugs',slug)}{link('privacy','Privacy',slug)}</nav>
    <nav aria-label="More"><h2>More</h2>{link('why-fastcast','Why FastCast',slug)}{link('how-it-works','How it works',slug)}{link('roadmap','Roadmap',slug)}{link('bandwidth','Bandwidth calculator',slug)}{link('data-and-privacy','Data & privacy compared',slug)}</nav>
    <div class="footer-bottom"><span>Windows sends · Windows or Android watches · Preview</span><a href="{REPO}">GitHub ↗</a><a href="{REPO}/blob/main/LICENSE">MIT OR Apache-2.0 ↗</a></div>
  </footer>
  <dialog class="image-dialog" aria-label="Full-size app screenshot"><form method="dialog"><button class="button" aria-label="Close screenshot">Close <span aria-hidden="true">×</span></button></form><div class="image-scroll"><img alt=""></div><p>{tokens['DIALOG_CAPTION']}</p></dialog>
</body>
</html>
'''
    if slug == '404':
        html = re.sub(r'(href|src)="(?!https?:|#)([^\"]+)"', lambda match: f'{match[1]}="{BASE}{match[2]}"', html)
    html = '\n'.join(line.rstrip() for line in html.splitlines()) + '\n'
    html = re.sub(r'\n{3,}', '\n\n', html)
    (ROOT / f'{slug}.html').write_text(html, encoding='utf-8')


for slug, (title, description) in PAGES.items():
    render(slug, title, description)
write_screenshots_doc()
if (ROOT / 'src/README.md').exists():
    write_readme()
urls = [BASE + ('' if slug == 'index' else slug + '.html') for slug in PAGES if slug != '404']
(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(f'  <url><loc>{url}</loc></url>' for url in urls) + '\n</urlset>\n', encoding='utf-8')
(ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n', encoding='utf-8')
print(f'Rendered {len(PAGES)} static pages for {release["label"]}')
