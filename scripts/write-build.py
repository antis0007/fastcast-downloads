from pathlib import Path

out = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
out.write_text('''"""Pyrenet public download site.

Modular architecture: each concern lives in its own module so the site stays
maintainable and expandable as the product grows.
"""
from pathlib import Path
from datetime import date
from html import escape
import json
import math
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://antis0007.github.io/fastcast-downloads/'
REPO = 'https://github.com/antis0007/fastcast-downloads'
PRODUCT = 'Pyrenet'
release = json.loads((ROOT / 'src/release.json').read_text(encoding='utf-8'))

PAGES = {
    'index': ('Screen sharing without the meeting', 'Pick a window or your whole screen on Windows and it shows up on another PC or an Android phone. Direct encrypted connection with relay fallback. Free preview; no account needed to share a screen.'),
    'product': ('Product overview', 'Windows and Android screen-sharing features, native interface captures, and release testing status.'),
    'downloads': (f'Download {PRODUCT}', 'Unsigned Windows sender/receiver, debug-signed Android viewer, matching zip. Direct GitHub links.'),
    'get-started': ('Setup', 'Install matching versions, create an invitation on the viewing device, and start sharing from Windows.'),
    'calls-and-rooms': ('Calls, rooms & files', f'Voice calls, multi-screen Tables, room discussions and consent-based file transfer in the {PRODUCT} preview, with the remaining gaps stated.'),
    'platforms': ('Supported platforms', 'Windows x64 sends and watches. Android 8+ watches. Linux receive is in source, not in this zip. No Mac, iOS, or browser app.'),
    'community': ('Bugs', 'Public GitHub issues for a screen-sharing preview. Do not paste invitations.'),
    'help': ('Help', 'Troubleshoot installation, connections, audio, and remote input. Help search runs in your browser.'),
    'roadmap': ('Roadmap', 'What is built, what is being qualified, and what is not started yet.'),
    'releases': ('Release notes', f'Download files, changes, and known limitations for published {PRODUCT} releases.'),
    'privacy': ('Privacy', 'This site has no analytics. GitHub hosts the files. Keep invites private.'),
    '404': ('Page not found', f'Find {PRODUCT} downloads, setup instructions, and help.'),
    'why-pyrenet': (f'Why {PRODUCT}', 'An independent screen-sharing tool alongside the conversations and communities you already have.'),
    'how-it-works': (f'How {PRODUCT} connects', 'Compare direct and relayed screen-sharing routes, discover who handles which data, and explore the native media stack.'),
    'data-and-privacy': ('Data compared', f'What Discord documents, next to what this {PRODUCT} preview actually does.'),
    'bandwidth': ('Bandwidth calculator', 'Estimate video payload at each end and the server traffic added by a relayed route.'),
    'about': (f'About {PRODUCT}', 'The team, the license, and how the project is maintained.'),
    'join': ('Join', 'Become a tester, report bugs, or contribute code. Open source under MIT or Apache-2.0.'),
    'faq': ('FAQ', 'Answers to the most common questions about downloads, setup, and privacy.'),
    'blog': ('Blog', 'Release notes, engineering deep-dives, and behind-the-scenes from the Pyrenet team.'),
}
REDIRECTS = {'why-fastcast': 'why-pyrenet'}
''', encoding='utf-8')
print('Part 1 written')
