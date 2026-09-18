import pathlib, re
root = pathlib.Path(r'C:\AI\fastcast-work\site\src\pages')
for f in sorted(root.glob('*.html')):
    if 'check' in f.name or 'full' in f.name:
        continue
    text = f.read_text(encoding='utf-8')
    if '{{PRODUCT}}' in text:
        print(f'=== {f.name} ({text.count("{{PRODUCT}}")}) ===')
        for m in re.finditer(r'\{\{PRODUCT\}\}', text):
            start = max(0, m.start() - 30)
            end = min(len(text), m.end() + 40)
            print(f'  {text[start:end]!r}')
