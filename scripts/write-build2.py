from pathlib import Path

out = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
part2 = '''

def link(slug, label, current, href=None):
    target = href or f'{slug}.html'
    active = ' aria-current="page"' if href is None and current == slug else ''
    return f'<a href="{target}"{active}>{label}</a>'


def brand(classes):
    """Logo lockup: the wizard mark plus a text wordmark, so the name is set once."""
    return (
        f'<a class="{classes}" href="index.html" aria-label="{PRODUCT} home">'
        '<img class="brand-mark" src="assets/pyrenet-wizard.webp" width="1203" height="926" alt="">'
        f'<span class="brand-wordmark">{PRODUCT}</span></a>'
    )


def write_redirect(old_slug, new_slug):
    """A former URL keeps working: meta refresh plus a visible link, noindex."""
    target = BASE + new_slug + '.html'
    (ROOT / f'{old_slug}.html').write_text('''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta name="pyrenet-version" content="''' + escape(release['version']) + '''">
  <meta http-equiv="refresh" content="0; url=''' + target + '''">
  <link rel="canonical" href="''' + BASE + old_slug + '''.html">
  <title>Page moved - ''' + PRODUCT + '''</title>
</head>
<body>
  <main><h1>This page moved</h1><p>Continue to <a href="''' + target + '''">''' + target + '''</a>.</p></main>
</body>
</html>
''', encoding='utf-8')


def fill(text):
    return text.replace('{{RELEASE_LABEL}}', release['label']).replace('{{VERSION}}', release['version'])


def screenshot(name, eager=False, explain_link=False):
    """Render one native capture as a lightbox figure."""
    meta = release['screenshots'][name]
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    caption = fill(meta['caption'])
    extra = f' <a href="product.html#screenshots">About these screenshots</a>.' if explain_link else ''
    return f'''<figure class="screenshot">
  <a class="image-open" href="assets/{name}.png" data-lightbox aria-label="Enlarge {escape(meta['label'])}">
    <img src="assets/{name}.png" width="{meta['width']}" height="{meta['height']}" alt="{escape(meta['alt'])}" {loading}>
    <span class="image-action" aria-hidden="true">View full size &#8599;</span>
  </a>
  <figcaption>{escape(caption)}{extra}</figcaption>
</figure>'''
'''
with out.open('a', encoding='utf-8') as f:
    f.write(part2)
print('Part 2 written')
