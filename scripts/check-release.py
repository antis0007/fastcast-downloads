"""Fail the build when local release data disagrees with generated pages."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SHA = re.compile(r'^[0-9a-f]{64}$')
STALE = re.compile(
    r'newer than the public|sustained visible playback|FASTCAST_DISCOVERY|'
    r'Settings → Internet|helper URL|self-hosted helper',
    re.I,
)


def fail(message):
    print(f'release check failed: {message}', file=sys.stderr)
    raise SystemExit(1)


def main():
    release = json.loads((ROOT / 'src/release.json').read_text(encoding='utf-8'))
    version = release['version']
    tag = release['tag']
    if not tag.endswith(version):
        fail(f'tag {tag} does not end with version {version}')
    if version not in {item['version'] for item in release['history']}:
        fail(f'{version} is missing from release history')
    current = [item for item in release['history'] if item.get('current')]
    if len(current) != 1 or current[0]['version'] != version:
        fail('exactly one history entry must be marked current and match version')
    for key, asset in release['assets'].items():
        url = asset['url']
        if f'/{tag}/' not in url:
            fail(f'{key} URL does not include tag {tag}')
        if version not in url and key != 'checksums':
            fail(f'{key} URL does not include version {version}')
        digest = asset.get('sha256', '')
        if digest and not SHA.match(digest):
            fail(f'{key} sha256 is not 64 lowercase hex chars')
    for name, shot in release['screenshots'].items():
        if shot.get('represents_public_release') is False and not shot.get('note'):
            fail(f'screenshot {name} is not the public release and has no explanation')
    downloads = (ROOT / 'downloads.html').read_text(encoding='utf-8')
    for key in ('windows', 'android', 'bundle'):
        digest = release['assets'][key]['sha256']
        if digest not in downloads:
            fail(f'downloads.html is missing sha256 for {key}')
    generated = list(ROOT.glob('*.html')) + [ROOT / 'README.md', ROOT / 'assets/SCREENSHOTS.md']
    for path in generated:
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        if version not in text and path.name != '404.html':
            # 404 still includes the version meta from the shared chrome.
            pass
        if STALE.search(text):
            fail(f'stale current-release wording in {path.name}')
        if path.suffix == '.html':
            meta = re.search(r'name="fastcast-version" content="([^"]+)"', text)
            if not meta or meta.group(1) != version:
                fail(f'{path.name} version meta does not match {version}')
            if f'releases/download/{tag}/' not in text and path.name not in {
                'why-fastcast.html', 'how-it-works.html', 'data-and-privacy.html',
                'bandwidth.html', 'community.html', 'privacy.html', 'help.html',
                'platforms.html', 'get-started.html', '404.html', 'product.html',
            }:
                if path.name in {'index.html', 'downloads.html', 'releases.html'}:
                    if f'releases/download/{tag}/' not in text:
                        fail(f'{path.name} is missing the current download tag')
    print(f'Release invariants passed for {release["label"]}')


if __name__ == '__main__':
    main()
