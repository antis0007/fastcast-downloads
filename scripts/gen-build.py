from pathlib import Path

content = []
content.append('"""Pyrenet public download site."""')
content.append('from pathlib import Path')
content.append('from datetime import date')
content.append('from html import escape')
content.append('import json')
content.append('import math')
content.append('import re')
content.append('')
content.append('ROOT = Path(__file__).resolve().parents[1]')
content.append("BASE = 'https://antis0007.github.io/fastcast-downloads/'")
content.append("REPO = 'https://github.com/antis0007/fastcast-downloads'")
content.append("PRODUCT = 'Pyrenet'")
content.append("release = json.loads((ROOT / 'src/release.json').read_text(encoding='utf-8'))")
content.append('')
content.append('PAGES = {')
pages = [
    "'index': ('Screen sharing without the meeting', 'Pick a window or your whole screen on Windows and it shows up on another PC or an Android phone. Direct encrypted connection with relay fallback. Free preview; no account needed to share a screen.')",
    "'product': ('Product overview', 'Windows and Android screen-sharing features, native interface captures, and release testing status.')",
    f"'downloads': (f'Download {PRODUCT}', 'Unsigned Windows sender/receiver, debug-signed Android viewer, matching zip. Direct GitHub links.')",
    f"'get-started': ('Setup', 'Install matching versions, create an invitation on the viewing device, and start sharing from Windows.')",
    f"'calls-and-rooms': ('Calls, rooms & files', f'Voice calls, multi-screen Tables, room discussions and consent-based file transfer in the {PRODUCT} preview, with the remaining gaps stated.')",
]
for p in pages:
    content.append(f'    {p},')
content.append("    'platforms': ('Supported platforms', 'Windows x64 sends and watches. Android 8+ watches. Linux receive is in source, not in this zip. No Mac, iOS, or browser app.'),")
content.append("    'community': ('Bugs', 'Public GitHub issues for a screen-sharing preview. Do not paste invitations.'),")
content.append("    'help': ('Help', 'Troubleshoot installation, connections, audio, and remote input. Help search runs in your browser.'),")
content.append("    'roadmap': ('Roadmap', 'What is built, what is being qualified, and what is not started yet.'),")
content.append(f"    'releases': ('Release notes', f'Download files, changes, and known limitations for published {PRODUCT} releases.'),")
content.append("    'privacy': ('Privacy', 'This site has no analytics. GitHub hosts the files. Keep invites private.'),")
content.append(f"    '404': ('Page not found', f'Find {PRODUCT} downloads, setup instructions, and help.'),")
content.append(f"    'why-pyrenet': (f'Why {PRODUCT}', 'An independent screen-sharing tool alongside the conversations and communities you already have.'),")
content.append(f"    'how-it-works': (f'How {PRODUCT} connects', 'Compare direct and relayed screen-sharing routes, discover who handles which data, and explore the native media stack.'),")
content.append(f"    'data-and-privacy': ('Data compared', f'What Discord documents, next to what this {PRODUCT} preview actually does.'),")
content.append("    'bandwidth': ('Bandwidth calculator', 'Estimate video payload at each end and the server traffic added by a relayed route.'),")
content.append(f"    'about': (f'About {PRODUCT}', 'The team, the license, and how the project is maintained.'),")
content.append("    'join': ('Join', 'Become a tester, report bugs, or contribute code. Open source under MIT or Apache-2.0.'),")
content.append("    'faq': ('FAQ', 'Answers to the most common questions about downloads, setup, and privacy.'),")
content.append(f"    'blog': ('Blog', 'Release notes, engineering deep-dives, and behind-the-scenes from the {PRODUCT} team.'),")
content.append('}')
content.append("REDIRECTS = {'why-fastcast': 'why-pyrenet'}")

out = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
out.write_text(chr(10).join(content) + chr(10), encoding='utf-8')
print('Part A written')
