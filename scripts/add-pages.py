from pathlib import Path

p = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
code = p.read_text('utf-8')

old = "    'faq': ('FAQ', 'Answers to the most common questions about downloads, setup, and privacy.'),\n"
new = old + "\n    'about': (f'About {PRODUCT}', 'The team, the license, and how the project is maintained.'),\n    'join': ('Join', 'Become a tester, report bugs, or contribute code. Open source under MIT or Apache-2.0.'),\n    'faq': ('FAQ', 'Answers to the most common questions about downloads, setup, and privacy.'),\n    'blog': ('Blog', 'Release notes, engineering deep-dives, and behind-the-scenes from the {PRODUCT} team.'),\n"

if 'about' not in code:
    code = code.replace(old, new)
    p.write_text(code, 'utf-8')
    print('Added new pages to PAGES dict')
else:
    print('Pages already present')
