from pathlib import Path

p = Path(r'C:\AI\fastcast-work\site\scripts\build-site.py')
code = p.read_text(encoding='utf-8')

# Fix missing imports
if 'import json\nimport math\nimport re' not in code:
    code = code.replace('"""Pyrenet public download site.', '"""Pyrenet public download site.\n\nModular architecture: each concern lives in its own module so the site stays\nmaintainable and expandable as the product grows.\n"""\nfrom pathlib import Path\nfrom datetime import date\nfrom html import escape\nimport json\nimport math\nimport re\n\nROOT = Path(__file__).resolve().parents[1]\nBASE = "https://antis0007.github.io/fastcast-downloads/"\nREPO = "https://github.com/antis0007/fastcast-downloads"\nPRODUCT = "Pyrenet"\nrelease = json.loads((ROOT / "src/release.json").read_text(encoding="utf-8"))\n\nPAGES = {\n    "index": ("Screen sharing without the meeting", "Pick a window or your whole screen on Windows and it shows up on another PC or an Android phone. Direct encrypted connection with relay fallback. Free preview; no account needed to share a screen."),\n    "product": ("Product overview", "Windows and Android screen-sharing features, native interface captures, and release testing status."),\n    "downloads": (f"Download {PRODUCT}", "Unsigned Windows sender/receiver, debug-signed Android viewer, matching zip. Direct GitHub links."),\n    "get-started": ("Setup", "Install matching versions, create an invitation on the viewing device, and start sharing from Windows."),\n    "calls-and-rooms": ("Calls, rooms & files", f"Voice calls, multi-screen Tables, room discussions and consent-based file transfer in the {PRODUCT} preview, with the remaining gaps stated."),\n    "platforms": ("Supported platforms", "Windows x64 sends and watches. Android 8+ watches. Linux receive is in source, not in this zip. No Mac, iOS, or browser app."),\n    "community": ("Bugs", "Public GitHub issues for a screen-sharing preview. Do not paste invitations."),\n    "help": ("Help", "Troubleshoot installation, connections, audio, and remote input. Help search runs in your browser."),\n    "roadmap": ("Roadmap", "What is built, what is being qualified, and what is not started yet."),\n    "releases": ("Release notes", f"Download files, changes, and known limitations for published {PRODUCT} releases."),\n    "privacy": ("Privacy", "This site has no analytics. GitHub hosts the files. Keep invites private."),\n    "404": ("Page not found", f"Find {PRODUCT} downloads, setup instructions, and help."),\n    "why-pyrenet": (f"Why {PRODUCT}", "An independent screen-sharing tool alongside the conversations and communities you already have."),\n    "how-it-works": (f"How {PRODUCT} connects", "Compare direct and relayed screen-sharing routes, discover who handles which data, and explore the native media stack."),\n    "data-and-privacy": ("Data compared", f"What Discord documents, next to what this {PRODUCT} preview actually does."),\n    "bandwidth": ("Bandwidth calculator", "Estimate video payload at each end and the server traffic added by a relayed route."),\n    "about": (f"About {PRODUCT}", "The team, the license, and how the project is maintained."),\n    "join": ("Join", "Become a tester, report bugs, or contribute code. Open source under MIT or Apache-2.0."),\n    "faq": ("FAQ", "Answers to the most common questions about downloads, setup, and privacy."),\n    "blog": ("Blog", "Release notes, engineering deep-dives, and behind-the-scenes from the Pyrenet team."),\n}\nREDIRECTS = {"why-fastcast": "why-pyrenet"}\n\n', 1)
    # Now we need to also add missing function definitions if they got lost
    needed = [
        'def link(',
        'def brand(',
        'def write_redirect(',
        'def fill(',
        'def screenshot(',
    ]
    for fn in needed:
        if fn not in code:
            print(f'MISSING {fn}')
p.write_text(code, encoding='utf-8')
print('Patched build-site.py')
