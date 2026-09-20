from pathlib import Path

out = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
part_b = '''

def link(slug, label, current, href=None):
    target = href or f'{slug}.html'
    active = ' aria-current="page"' if href is None and current == slug else ''
    return f'<a href="{target}"{active}>{label}</a>'


def brand(classes):
    return (
        f'<a class="{classes}" href="index.html" aria-label="{PRODUCT} home">'
        '<img class="brand-mark" src="assets/pyrenet-wizard.webp" width="1203" height="926" alt="">'
        f'<span class="brand-wordmark">{PRODUCT}</span></a>'
    )


def write_redirect(old_slug, new_slug):
    target = BASE + new_slug + '.html'
    (ROOT / f'{old_slug}.html').write_text(f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta name="pyrenet-version" content="{escape(release['version'])}">
  <meta http-equiv="refresh" content="0; url={target}">
  <link rel="canonical" href="{BASE}{old_slug}.html">
  <title>Page moved - {PRODUCT}</title>
</head>
<body>
  <main><h1>This page moved</h1><p>Continue to <a href="{target}">{target}</a>.</p></main>
</body>
</html>
''', encoding='utf-8')


def fill(text):
    return text.replace('{{RELEASE_LABEL}}', release['label']).replace('{{VERSION}}', release['version'])

'''
with out.open('a', encoding='utf-8') as f:
    f.write(part_b)
print('Part B appended')
