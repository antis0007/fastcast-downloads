"""Check generated pages against source without altering the working tree."""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
alternates = list((root / 'src/pages').glob('*-full.html'))
if alternates:
    sys.exit('Retire alternate page sources: ' + ', '.join(p.name for p in alternates))

with tempfile.TemporaryDirectory(prefix='pyrenet-site-check-') as scratch:
    generated = Path(scratch) / 'site'
    shutil.copytree(root, generated, ignore=shutil.ignore_patterns(
        '.git', 'node_modules', 'test-results', '__pycache__', '.venv'))
    subprocess.run([sys.executable, '-X', 'utf8', str(generated / 'scripts/build-site.py')], check=True)
    outputs = [p.relative_to(generated) for p in generated.glob('*.html')]
    outputs += [Path(p) for p in ('README.md', 'robots.txt', 'sitemap.xml', 'assets/SCREENSHOTS.md')]
    different = [str(p) for p in outputs if not (root / p).is_file()
                 or (root / p).read_bytes() != (generated / p).read_bytes()]
    if different:
        sys.exit('Generated files differ from source; run scripts/build-site.py: ' + ', '.join(different))
print('Generated pages match their source templates.')
