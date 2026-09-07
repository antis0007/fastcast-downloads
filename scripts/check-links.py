"""Check generated HTML, cross-page fragments, local assets and release URLs."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://antis0007.github.io/fastcast-downloads/'


class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.ids = set()
        self.refs = []
        self.canonical = []
        self.h1_count = 0
        self.feed(file.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.h1_count += 1
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs['href'])
        for key in ['href', 'src']:
            if attrs.get(key):
                self.refs.append(attrs[key])


pages = {file.name: Page(file) for file in ROOT.glob('*.html')}
for name, page in pages.items():
    assert page.h1_count == 1, name
    assert page.canonical == [BASE + ('' if name == 'index.html' else name)], name
    for ref in page.refs:
        if ref.startswith(BASE):
            ref = ref.removeprefix(BASE) or 'index.html'
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        target = unquote(url.path) or name
        assert (ROOT / target).is_file(), f'{name}: missing {ref}'
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f'{name}: missing fragment {ref}'
print(f'All {len(pages)} pages: local links, fragments, unique IDs and canonical URLs passed')

release = json.loads((ROOT / 'src/release.json').read_text())
for key, asset in release['assets'].items():
    request = urllib.request.Request(asset['url'], method='HEAD')
    with urllib.request.urlopen(request, timeout=30) as response:
        assert response.status == 200
    print(f'Public download HTTP 200: {key}')
