"""Render the static public site from shared chrome and plain HTML page bodies.

The release manifest pins downloads to published assets. A website build never
discovers, promotes, or publishes an application release.
"""
from pathlib import Path
from html import escape
from datetime import date
import json
import math
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://antis0007.github.io/fastcast-downloads/'
REPO = 'https://github.com/antis0007/fastcast-downloads'
# Public product name. Page bodies use {{PRODUCT}}; published asset filenames,
# download URLs and release history keep the name they shipped under.
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
}
# Former page URLs that still receive traffic. Each renders a redirect stub.
REDIRECTS = {'why-fastcast': 'why-pyrenet'}


def link(slug, label, current, href=None):
    target = href or f'{slug}.html'
    active = ' aria-current="page"' if href is None and current == slug else ''
    return f'<a href="{target}"{active}>{label}</a>'


def brand(classes):
    """Logo lockup: the wizard mark plus a text wordmark, so the name is set once."""
    return (
        f'<a class="{classes}" href="index.html" aria-label="{PRODUCT} home">'
        '<img class="brand-mark" src="assets/fastcast-wizard.webp" width="1203" height="926" alt="">'
        f'<span class="brand-wordmark">{PRODUCT}</span></a>'
    )


def write_redirect(old_slug, new_slug):
    """A former URL keeps working: meta refresh plus a visible link, noindex.

    The stub still carries the version meta, one h1 and a self canonical so the
    release and link gates treat it like every other generated page.
    """
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
  <title>Page moved — {PRODUCT}</title>
</head>
<body>
  <main><h1>This page moved</h1><p>Continue to <a href="{target}">{target}</a>.</p></main>
</body>
</html>
''', encoding='utf-8')


def fill(text):
    return text.replace('{{RELEASE_LABEL}}', release['label']).replace('{{VERSION}}', release['version'])


def screenshot(name, eager=False, explain_link=False):
    """Render one native capture as a lightbox figure.

    explain_link adds the pointer from a homepage capture to the product page
    that explains these images. The product page omits it because the
    explanation is the section the capture already sits in.
    """
    meta = release['screenshots'][name]
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    caption = fill(meta['caption'])
    extra = f' <a href="product.html#screenshots">About these screenshots</a>.' if explain_link else ''
    return f'''<figure class="screenshot">
  <a class="image-open" href="assets/{name}.png" data-lightbox aria-label="Enlarge {escape(meta['label'])}">
    <img src="assets/{name}.png" width="{meta['width']}" height="{meta['height']}" alt="{escape(meta['alt'])}" {loading}>
    <span class="image-action" aria-hidden="true">View full size ↗</span>
  </a>
  <figcaption>{escape(caption)}{extra}</figcaption>
</figure>'''


# The Elder Futhark, drawn as line work on a 16x24 stave instead of set as
# text. No font installed on a stock Windows machine carries the Runic block,
# so Unicode runes render as empty boxes; SVG always draws.
RUNE_SHAPES = (
    (("fehu", (((5, 2), (5, 22)), ((5, 7), (13, 3)), ((5, 13), (13, 9)))),),
    (("uruz", (((5, 22), (5, 2), (11, 2), (11, 22)),)),),
    (("thurisaz", (((5, 2), (5, 22)), ((5, 9), (13, 6), (13, 14), (5, 11)))),),
    (("ansuz", (((5, 2), (5, 22)), ((5, 7), (13, 3)), ((5, 14), (13, 10)))),),
    (("raido", (((5, 2), (5, 22)), ((5, 3), (13, 3), (5, 11)))),),
    (("kenaz", (((12, 2), (4, 12), (12, 22)),)),),
    (("gebo", (((4, 3), (12, 21)), ((12, 3), (4, 21)))),),
    (("wunjo", (((5, 2), (5, 22)), ((5, 4), (12, 4), (5, 12)))),),
    (("hagalaz", (((4, 2), (4, 22)), ((12, 2), (12, 22)), ((4, 12), (12, 12)))),),
    (("naudiz", (((6, 2), (6, 22)), ((6, 12), (13, 6)))),),
    (("isa", (((8, 2), (8, 22)),)),),
    (("jera", (((5, 3), (11, 10), (5, 15)), ((11, 9), (5, 16), (11, 22)))),),
    (("eihwaz", (((8, 2), (8, 22)), ((8, 9), (4, 4)), ((8, 9), (12, 4)))),),
    (("perthro", (((5, 3), (10, 9), (5, 15)), ((11, 9), (6, 15), (11, 21)))),),
    (("algiz", (((8, 22), (8, 6)), ((8, 8), (3, 2)), ((8, 8), (13, 2)))),),
    (("sowilo", (((11, 2), (6, 10), (11, 14), (5, 22)),)),),
    (("tiwaz", (((8, 2), (8, 22)), ((3, 8), (8, 2), (13, 8)))),),
    (("berkano", (((5, 2), (5, 22)), ((5, 4), (11, 6), (5, 10)), ((5, 12), (11, 14), (5, 18)))),),
    (("ehwaz", (((4, 22), (4, 4), (8, 14), (12, 4), (12, 22)),)),),
    (("mannaz", (((4, 3), (4, 21)), ((12, 3), (12, 21)), ((4, 5), (12, 19)), ((12, 5), (4, 19)))),),
    (("laguz", (((6, 2), (6, 22)), ((6, 4), (12, 13)))),),
    (("ingwaz", (((8, 4), (13, 12), (8, 20), (3, 12), (8, 4)),)),),
    (("dagaz", (((3, 4), (13, 4), (3, 20), (13, 20), (3, 4)),)),),
    (("othala", (((8, 3), (13, 10), (8, 16), (3, 10), (8, 3)), ((8, 16), (4, 22)), ((8, 16), (12, 22)))),),
)


def rune_symbols():
    """One sprite symbol per rune, keyed by index for the circle generator.

    The path data has to be wrapped in a <path>: a symbol's content is drawing
    elements, so raw data dropped in as text renders nothing at all.

    `vector-effect` is not an inherited property and <use> clones live in a
    shadow tree that page CSS cannot select into, so the non-scaling stroke has
    to be carried on the path here. It keeps every rune at one optical weight
    across the 10px..26px range the bands use, where a scaling stroke would
    thin the small runes into hairlines.
    """
    symbols = {}
    for index, ((_name, strokes),) in enumerate(RUNE_SHAPES):
        path = ''.join(
            'M' + 'L'.join(f'{x} {y}' for x, y in stroke) for stroke in strokes
        )
        symbols[f'rune{index}'] = f'<path d="{path}" vector-effect="non-scaling-stroke"/>'
    return symbols


def icon_sprite():
    """One inline SVG sprite per page, referenced by <use href="#i-...">.

    Inline beats a separate file: the icons inherit currentColor, need no extra
    request, and stay crisp at the sizes used here. Every path is stroked from
    the shared .icon rule, so nothing carries its own colour.
    """
    symbols = {
        'arrow': '<path d="M5 12h14m-5-5 5 5-5 5"/>',
        'down': '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
        'monitor': '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4m-4 0h8"/>',
        'devices': '<rect x="2" y="3" width="15" height="12" rx="1.5"/><path d="M9 15v5m-4 0h6"/><rect x="15" y="9" width="7" height="13" rx="1.5"/><path d="M18 19h1"/>',
        'invite': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
        'network': '<rect x="2" y="8" width="5" height="8" rx="1"/><rect x="17" y="8" width="5" height="8" rx="1"/><path d="M7 12h10m-5-4 4 4-4 4"/>',
        'volume': '<path d="M3 9h4l5-4v14l-5-4H3zm12-1c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/>',
        'mic': '<rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 11v1a7 7 0 0 0 14 0v-1m-7 8v3m-3 0h6"/>',
        'input': '<path d="m5 3 14 10-7 1-3 7zM13 15l4 6"/>',
        'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
        'windows': '<path d="M3 4h8v8H3zm10 0h8v8h-8zM3 14h8v8H3zm10 0h8v8h-8z"/>',
        'android': '<path d="m6 3 2 3m10-3-2 3M4 12a8 8 0 0 1 16 0zm0 3v5h16v-5M2 14v5m20-5v5M8 20v2m8-2v2"/><path d="M8 9h.1M16 9h.1" stroke-width="2.3"/>',
        'expand': '<path d="M14 4h6v6m-1-5-6 6M10 20H4v-6m1 5 6-6"/>',
        'device': '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M10 6h4M10 18h4"/>',
        'host': '<path d="M4 15a4 4 0 0 1 .8-7.9A5.5 5.5 0 0 1 15.5 6 4.5 4.5 0 0 1 20 10.5 4.5 4.5 0 0 1 15.5 15H6a2 2 0 0 1-2-2Z"/><path d="M12 12v8m-3-3 3 3 3-3"/>',
        'tower': '<path d="M6 22h12M7 22l1-13H6V3h3v3h2V3h2v3h2V3h3v6h-2l1 13M8 9h8m-6 13v-6h4v6"/>',
        'spark': '<path d="M12 3v18M3 12h18m-6.4-6.4L12 12l6.4 6.4M5.6 5.6 12 12l6.4 6.4"/>',
        'book': '<path d="M12 6c-2-1.5-4.5-2-8-2v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2Z"/><path d="M12 6v14"/>',
        'hex': '<polygon points="12,2 20.7,7 20.7,17 12,22 3.3,17 3.3,7"/>',
    }
    symbols.update(rune_symbols())
    body = ''.join(
        f'<symbol id="i-{name}" viewBox="{ "0 0 16 24" if name.startswith("rune") else "0 0 24 24" }">{paths}</symbol>'
        for name, paths in symbols.items()
    )
    return f'<svg class="icon-sprite" aria-hidden="true" focusable="false"><defs>{body}</defs></svg>'


# The Elder Futhark is a row of twenty-four runes read as three Ã¦ttir of eight.
# That grouping is the organising unit of the seal: every band reads the runes in
# order from an Ã¦tt head, and each Ã¦tt head is struck with a divider, the way a
# runestone separates one word from the next.
AETT = 8
FUTHARK = 24

# (radius, base rune size, spin direction, spin seconds, density). Spacing is
# even -- a rune band is set, not scattered -- so the only per-ring choices are
# how large the runes are and how much of the arc they fill. Density sits near a
# third on most bands, so the lane reads as a lane; the outliers near three
# quarters give the seal a stated rhythm instead of one uniform texture.
RUNE_RINGS = {
    'lg': (
        (300, 15, 'reverse', 280, 0.34),
        (268, 17, 'normal', 230, 0.34),
        (236, 20, 'reverse', 195, 0.74),
        (204, 18, 'normal', 165, 0.34),
        (172, 21, 'reverse', 140, 0.34),
        (140, 16, 'normal', 118, 0.72),
        (110, 18, 'reverse', 100, 0.34),
        (80, 14, 'normal', 86, 0.34),
        (52, 12, 'reverse', 72, 0.70),
    ),
    'sm': (
        (132, 12, 'reverse', 200, 0.36),
        (104, 13, 'normal', 160, 0.70),
        (76, 12, 'reverse', 128, 0.36),
        (50, 10, 'normal', 100, 0.36),
    ),
}

# A rune steps through these size multipliers around its ring, so no single ring
# is visually uniform.
RUNE_SCALES = (0.84, 1.0, 1.22)


def _ring_count(radius, base_size, density):
    """How many runes fit on a ring without touching.

    A rune turned to face outward spends its glyph height along the radius and
    its width along the arc, so the arc between neighbours has to clear the
    largest width. Density is the fraction of the ring the runes may occupy;
    deriving the count here is what stops a dense ring collapsing into a smear.
    """
    tangential = base_size * RUNE_SCALES[-1] * 1.2
    return max(6, int(2 * math.pi * radius / tangential * density))


def rune_circle(size='lg'):
    """The rune portal: nested bands of differing radius, size and spin.

    Every band is bracketed by two guide circles, one just inside and one just
    outside the tallest rune it carries, so the runes travel in a lane rather
    than floating -- the band of a runestone. Bands alternate direction, which
    is both the boustrophedon of a real inscription and the counter-clockwise
    then clockwise circumambulation the galdrastafir spells call for.
    """
    total = len(RUNE_SHAPES)
    presets = RUNE_RINGS[size]
    bands = []
    for band_index, (radius, base_size, direction, duration, density) in enumerate(presets):
        # The lane has to clear the tallest rune the band can place, so the two
        # guides sit exactly one rune-height either side of the band radius.
        half = base_size * RUNE_SCALES[-1] * 1.2 / 2
        fade = 0.26 - band_index * 0.014
        lane = (
            f'<span class="rune-guide" style="--gr:{round(radius + half, 1)}px;--o:{round(fade, 3)}"></span>'
            f'<span class="rune-guide" style="--gr:{round(radius - half, 1)}px;--o:{round(fade * 0.78, 3)}"></span>'
        )

        # Bands start at successive Ã¦tt heads, so the three Ã¦ttir cycle down
        # through the seal rather than every ring beginning at fehu.
        start = (band_index % 3) * AETT
        count = _ring_count(radius, base_size, density)
        step = 360 / count
        marks = []
        for index in range(count):
            rune = (start + index) % total
            # The opening rune of each Ã¦tt is marked, except where the Ã¦tt opens
            # the band itself -- there is no word to divide it from.
            if index and rune % AETT == 0:
                marks.append(
                    f'<i class="rune-part" style="--a:{round(index * step - step / 2, 2)}deg;'
                    f'--r:{-radius}px;--sz:{round(base_size, 1)}px"></i>'
                )
            scale = RUNE_SCALES[(index + band_index) % len(RUNE_SCALES)]
            marks.append(
                f'<i style="--a:{round(index * step, 2)}deg;--r:{-radius}px;'
                f'--sz:{round(base_size * scale, 1)}px">'
                f'<svg class="rune" aria-hidden="true"><use href="#i-rune{rune}"/></svg></i>'
            )
        ring = (
            f'<span class="rune-ring rune-ring-{band_index}" style="--dur:{duration}s;--dir:{direction}">'
            + ''.join(marks) + '</span>'
        )

        # Every band fades in at its own radius and then collapses onto the
        # centre. Cycles and offsets differ per band, so the seal is always
        # inhaling somewhere rather than contracting in unison.
        fall = round(20 + band_index * 1.7, 1)
        delay = round(-fall * band_index / len(presets), 2)
        bands.append(
            f'<span class="rune-band rune-band-fall" style="--fall:{fall}s;--fd:{delay}s">'
            + lane + ring + '</span>'
        )

    return (
        f'<div class="rune-circle rune-circle-{size}" aria-hidden="true">'
        + ''.join(bands) + '</div>'
    )


def fall_runes(per_band=2):
    """Runes that stream inward along the band lanes.

    Each travels one lane, from just outside its band to just inside it, so the
    seal reads as drawing its surroundings through the rings.
    """
    total = len(RUNE_SHAPES)
    parts = []
    for band, (radius, base_size, *_rest) in enumerate(RUNE_RINGS['lg']):
        half = base_size * RUNE_SCALES[-1] * 1.2 / 2
        for slot in range(per_band):
            angle = round((band * 47 + slot * 173) % 360, 2)
            rune_size = round(base_size * 0.72, 1)
            duration = round(5.4 + band * 0.42, 2)
            delay = round((band * 0.9 + slot * 2.3) % 8, 2)
            parts.append(
                f'<span class="fall-rune" style="--a:{angle}deg;'
                f'--rf:{round(-(radius + half), 1)}px;--rt:{round(-(radius - half), 1)}px;'
                f'--t:{duration}s;--d:{delay}s;--sz:{rune_size}px">'
                f'<svg class="rune" aria-hidden="true"><use href="#i-rune{(band * 3 + slot * 5) % total}"/></svg></span>'
            )
    return f'<div class="fall-field" aria-hidden="true">{"".join(parts)}</div>'


def rune_cloud(count=26):
    """A loose orbiting cloud of runes, in the spirit of an enchanting table.

    Each rune gets its own orbit wrapper, so it can turn at its own speed and
    direction and fade on its own delay instead of moving with a ring.
    """
    total = len(RUNE_SHAPES)
    parts = []
    for index in range(count):
        # The golden angle spreads successive runes without ever repeating.
        angle = round((index * 137.508) % 360, 2)
        radius = -(76 + (index * 53) % 138)
        rune_size = round(10 + ((index * 7) % 5) * 2.6, 1)
        duration = round(26 + (index % 6) * 7.5, 1)
        direction = 'normal' if index % 2 else 'reverse'
        delay = round((index * 0.83) % 12, 2)
        parts.append(
            f'<span class="cloud-orbit" style="--dur:{duration}s;--dir:{direction}">'
            f'<i style="--a:{angle}deg;--r:{radius}px;--sz:{rune_size}px;--d:{delay}s">'
            f'<svg class="rune" aria-hidden="true"><use href="#i-rune{(index * 7) % total}"/></svg></i>'
            '</span>'
        )
    return f'<div class="rune-cloud" aria-hidden="true">{"".join(parts)}</div>'


def _hexagon(cx, cy, radius):
    """A pointy-top hexagon, used for the trace pads."""
    points = []
    for step in range(6):
        angle = math.radians(60 * step - 90)
        points.append(f'{cx + radius * math.cos(angle):.1f},{cy + radius * math.sin(angle):.1f}')
    return f'<polygon class="hex-pad" points="{" ".join(points)}"/>'


# One arm of the stave wheel, drawn pointing up and rotated into place eight
# times. The grammar is the one the Icelandic staves actually use: a straight arm
# off a central hub, short cross lines in threes partway along it, a fork, and a
# terminal that cups outward. Radial symmetry is the whole point -- arms that
# differ from one another read as damage rather than design. Coordinates are
# viewBox units of a 660px circle, so one unit is one portal pixel divided by
# 1.269; the wheel therefore shares the rune rings' centre and scale exactly.
SPOKE_COUNT = 8
HUB_RADII = (22, 34)
SPOKE_ARM = 'M0 -34 V-244'
# Three short cross lines partway along the arm, the mark every Ã†gishjÃ¡lmur arm
# carries. Short lines in threes are the staves' own convention for amplifying
# a working.
SPOKE_TICKS = ('M-11 -62 H11', 'M-13 -74 H13', 'M-15 -86 H15')
# The trident terminal: the arm splits near the rim into three prongs.
SPOKE_PRONG_L = 'M0 -196 L-22 -220 V-244'
SPOKE_PRONG_R = 'M0 -196 L22 -220 V-244'
# A hexagon pad on each side prong, so the terminal carries the same node the
# rest of the wheel is built from.
SPOKE_PADS = ((-22, -252, 4.4), (22, -252, 4.4))
# A half circle across the centre prong, bulging away from the hub: the cupped
# terminal that separates a stave which keeps harm out from one that keeps luck
# in. It lands just outside the outermost rune band.
SPOKE_CUP = 'M-13 -244 A 13 13 0 0 0 13 -244'
# Where the arm leaves the hub ring.
SPOKE_NODE = (0, -34, 2.6)
SPOKE_REACH = 260

# The energy overlay runs along a gradient rather than one flat colour, so the
# light is hottest at the tip and cools as it reaches the hub. The gradient is
# defined in the arm's own space and the arm carries the rotation, so it turns
# with the spoke instead of staying fixed to the page.
SPOKE_GRADIENT = (
    f'<linearGradient id="fc-spoke" gradientUnits="userSpaceOnUse" '
    f'x1="0" y1="0" x2="0" y2="-250">'
    '<stop offset="0" stop-color="#c2451c"/>'
    '<stop offset=".45" stop-color="#ff9d4c"/>'
    '<stop offset=".85" stop-color="#ffd79a"/>'
    '<stop offset="1" stop-color="#ffc978"/>'
    '</linearGradient>'
)


def circuit_traces():
    """The stave wheel at the centre of the seal.

    Eight arms turn out from the hub, each struck with three cross lines and
    ending in a cupped terminal. Every line is drawn twice: a dim solid arm that
    holds the shape, and a dashed bright overlay whose dashes travel inward, so
    the wheel reads as drawing power to the middle rather than radiating it.
    """
    groups = []
    for index in range(SPOKE_COUNT):
        angle = round(index * 360 / SPOKE_COUNT, 2)
        # Offset each arm by one eighth of a cycle, so the pulse walks around
        # the wheel instead of every arm firing at once.
        delay = round(index * 0.65, 2)
        body = [
            f'<path class="trace" d="{SPOKE_ARM}"/>',
            f'<path class="trace-energy" d="{SPOKE_ARM}" style="--d:{delay}s"/>',
        ]
        body.extend(f'<path class="trace" d="{path}"/>' for path in SPOKE_TICKS)
        for path in (SPOKE_PRONG_L, SPOKE_PRONG_R):
            body.append(f'<path class="trace" d="{path}"/>')
            body.append(f'<path class="trace-energy" d="{path}" style="--d:{delay}s"/>')
        body.append(f'<path class="trace" d="{SPOKE_CUP}"/>')
        body.extend(_hexagon(cx, cy, radius) for cx, cy, radius in SPOKE_PADS)
        body.append(
            f'<circle class="trace-node" cx="{SPOKE_NODE[0]}" cy="{SPOKE_NODE[1]}" r="{SPOKE_NODE[2]}"/>'
        )
        groups.append(
            f'<g class="circuit-branch" style="--d:{delay}s" transform="rotate({angle})">'
            + ''.join(body) + '</g>'
        )
    hub = ''.join(
        f'<circle class="trace-hub" cx="0" cy="0" r="{radius}"/>' for radius in HUB_RADII
    )
    return (
        f'<svg class="circuit-traces" viewBox="-{SPOKE_REACH} -{SPOKE_REACH} '
        f'{SPOKE_REACH * 2} {SPOKE_REACH * 2}" aria-hidden="true" focusable="false">'
        f'<defs>{SPOKE_GRADIENT}</defs>'
        + hub
        + ''.join(groups)
        + '</svg>'
    )


def hex_accents(count=6):
    """A few large hexagons turning slowly behind the portal.

    Light on purpose: six static outlines on one slow rotation, so the motif
    reads without adding a per-frame filter or a background layer.
    """
    parts = []
    for index in range(count):
        radius = 96 + (index * 53) % 150
        size = 46 + (index * 31) % 64
        duration = round(120 + (index % 3) * 55, 1)
        delay = round(index * 1.4, 1)
        parts.append(
            f'<span class="hex-accent" style="--r:-{radius}px;--sz:{size}px;'
            f'--dur:{duration}s;--d:{delay}s">'
            '<svg class="hex-glyph" aria-hidden="true"><use href="#i-hex"/></svg></span>'
        )
    return f'<div class="hex-field" aria-hidden="true">{"".join(parts)}</div>'


# Four cooling stages, spark through to coal, so the field has depth instead of
# one flat orange. Each is (core, body, edge). None reach white: a white spark
# reads as a lamp filament rather than as something burning.
EMBER_TONES = (
    ('#ffe9b8', '#ffc978', '#ff7a2e'),
    ('#ffdfa4', '#ffb865', '#ff5b2e'),
    ('#ffd08a', '#ff9d4c', '#e03f16'),
    ('#ffc47a', '#ff8038', '#b8300f'),
)

# The draft runs up the axis of the seal, because the seal is the fire. Embers
# are drawn toward it as they climb, which is what a plume does to anything
# light enough to ride it.
PLUME_X = 50.0


def flame_field(count=52):
    """Embers riding the draft above the frame.

    Two things make this read as fire rather than as drifting dots. The climb
    accelerates: `ember-climb` shapes the rise over eight stops rather than
    interpolating a straight line, so an ember leaves slowly, is pulled up hard
    through the middle and stalls as it cools. And the sideways carry is aimed
    at the plume axis by a per-ember share of the distance, so embers converge
    into the column without any two taking the same line -- a share of one would
    funnel the whole field onto a single point.

    Every fifth ember is a heavier coal. `ember-arc` throws it up, over, and back
    down past where it started, which is the one thing a field of particles that
    only ever rise can never look like.
    """
    parts = []
    for index in range(count):
        # Golden-ratio spacing spreads the columns with no visible grid.
        column = round((index * 61.803) % 94 + 3, 1)
        # The plume is a band, not a line: each ember aims at its own lane
        # through it.
        axis = PLUME_X + ((index * 7) % 13) - 6
        pull = 0.24 + (index * 13 % 9) * 0.055
        arcing = index % 5 == 0
        floor = round((26 + (index * 11) % 16) if arcing else (12 + (index * 23) % 22), 1)
        climb = round((150 + (index * 29) % 130) if arcing else (200 + (index * 53) % 210), 1)
        # Turns per life, so the sway reads as a spiral up the column rather than
        # as a pendulum. The fractional part keeps the helix from closing exactly.
        turns = round(1.2 + (index % 7) * 0.22 + (index % 3) * 0.07, 2)
        life = round(10 + (index % 7) * 1.5, 2)
        sway = round((5 + (index * 17) % 13) * (0.55 if arcing else 1), 1)
        hot, body, edge = EMBER_TONES[index % len(EMBER_TONES)]
        parts.append(
            f'<i style="--x:{column}%;--y:{floor}%;--rise:{climb}px;'
            f'--drift:{round((axis - column) * pull, 1)}px;--sway:{sway}px;'
            f'--t:{life}s;--d:{round(-(index * 1.37) % 14, 2)}s;'
            f'--tw:{round(life / turns, 2)}s;--dw:{round(-(index * 0.71) % 6, 2)}s;'
            f'--s:{round(3.4 + (index * 11 % 6) * 0.85, 2)}px;'
            f'--h:{round(1.6 + (index * 7 % 5) * 0.3, 2)};'
            f'--peak:{round(0.45 + (index * 13 % 5) * 0.12, 2)};'
            f'--hot:{hot};--mid:{body};--edge:{edge}"></i>'
        )
    return f'<div class="flame-field" aria-hidden="true">{"".join(parts)}</div>'


# Official mascot voice: a welcoming, mildly vain wizard with practical wit.
# Left-click is conversation; right-click offers a useful screen-sharing tip.
# The visitor is a welcome guest, not a target for threats or humiliation.
# Prefer recognisable behaviour and complete thoughts over arbitrary magical
# incidents, withheld consequences, slogans, and explanations of the joke.
# He can understand the product's vocabulary. Do not invent product guarantees
# or pretend he can see the visitor's screen, hear them, or control their device.
# A little wizardposting is welcome: recognisable situations, occasional slang,
# and an intentional casting-screens callback. Do not bulk-import captions or
# make every line a meme. This is the owner's later refinement of the voice.
# Gesture feedback may simply acknowledge the gesture; it need not be a joke.
# Pools rotate without immediate repeats. Empty artwork regions use normal chat.
# This replaces the earlier menace/Ser-Vur direction at the owner's request.
# See docs/WIZARD-INTERACTIONS.md; historical cuts remain archived, not restored.
# Voice: a deadpan archmage who treats screen sharing as humble craft. Every
# joke is a true fact about the product in a robe; never a generic fantasy quip.
WIZARD_LINES = {
    'first': [
        "Hello. The download is free. I came with it.",
    ],
    'idle': [
        "I do not host your screen. I merely point at it.",
        "No account. My circle requires only two devices and one invitation.",
        "The relay is a last resort. Even portents need a backup plan.",
        "I have read the terms of service. There were none to read.",
        "The installer is unsigned. Verify the checksum; trust is a spell with components.",
        "Windows casts, Android watches. Neither asks me who you are.",
        "Your group can stay in its own tavern. I only carry the picture.",
        "I encrypt everything. Not from paranoia. From habit.",
    ],
    'poke': [
        "Once is a summons. Six times is a denial of service.",
        "Still here. Nothing in this preview despawns.",
    ],
    'hold': [
        "You are holding down a wizard. The stream, at least, holds on its own.",
        "Very well. We ponder together.",
    ],
    'far': [
        "Any farther and even I would need the relay.",
    ],
    'orb': [
    ],
    'rightclick': [
        "Check which window you're sharing before you begin. Full screen shares everything.",
        "Same version on both devices. Mismatched builds are the most common curse.",
        "Guest Wi-Fi often isolates devices that share a name. Try your own network first.",
        "Point at what you mean. 'Over there' is a large part of a screen.",
        "When reporting a bug, say what you clicked and what happened. 'It broke' is not a spell.",
        "Give your friend a moment to read before you switch windows.",
    ],
    'hat': [
    ],
    'beard': [
    ],
    'drag': [
        "Moving me does not move the stream. Mind the hat.",
        "I would have teleported, but you've already got me.",
    ],
}


def wizard_voice():
    """The line pool, as JSON for site.js to read on the page that has a wizard."""
    payload = json.dumps(WIZARD_LINES, ensure_ascii=False)
    # A closing script tag inside the payload would end the block early.
    return payload.replace('</', '<\\/')


def floating_runes(count=16):
    """Runes that surface, drift on the rising current, and fade again."""
    total = len(RUNE_SHAPES)
    parts = []
    for index in range(count):
        left = round((index * 100 / count + 5) % 92 + 4, 1)
        top = round(18 + (index * 37 % 56), 1)
        delay = round(index * 1.55, 2)
        duration = round(13 + (index % 4) * 2.4, 2)
        rune = (index * 5) % total
        parts.append(
            f'<i style="--x:{left}%;--y:{top}%;--d:{delay}s;--t:{duration}s">'
            f'<svg class="rune" aria-hidden="true"><use href="#i-rune{rune}"/></svg></i>'
        )
    return f'<div class="float-runes" aria-hidden="true">{"".join(parts)}</div>'


def scrying_orb():
    """A layered glass orb: body, inner plasma, caustic rim and specular."""
    return (
        '<div class="scry-orb" aria-hidden="true">'
        '<span class="scry-body"></span>'
        '<span class="scry-plasma"></span>'
        '<span class="scry-swirl"></span>'
        '<span class="scry-rim"></span>'
        '<span class="scry-spec"></span>'
        '</div>'
    )


def json_ld():
    data = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': PRODUCT,
        'applicationCategory': 'MultimediaApplication',
        'operatingSystem': 'Windows (send and receive); Android 8+ (receive only)',
        'softwareVersion': release['version'],
        'url': BASE,
        'downloadUrl': BASE + 'downloads.html',
        'image': BASE + 'assets/og.png',
        'description': PAGES['index'][1],
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
            'description': release['offer'],
        },
    }
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>'


def captured_display():
    """Display date of the wide app capture, kept distinct from the release date."""
    taken = date.fromisoformat(release['screenshots']['windows-share']['captured'])
    return f'{taken:%B} {taken.day}, {taken.year}'


def capability_ledger():
    legend = release['status_legend']
    by_id = {item['id']: item for item in legend}
    key = ''.join(
        f'<div><dt>{escape(item["label"])}</dt><dd>{escape(item["meaning"])}</dd></div>'
        for item in legend
    )
    groups = []
    for group in release['capability_groups']:
        rows = []
        for item in group['items']:
            status = by_id[item['status']]
            rows.append(
                f'<tr><th scope="row">{escape(item["name"])}</th>'
                f'<td><span class="status status-{status["id"]}">{escape(status["label"])}</span></td>'
                f'<td>{escape(fill(item["detail"]))}</td></tr>'
            )
        groups.append(
            f'<section class="capability-group" id="status-{group["id"]}" aria-labelledby="status-{group["id"]}-title">\n'
            f'<h3 id="status-{group["id"]}-title">{escape(group["title"])}</h3>\n'
            f'<p class="capability-intro">{escape(fill(group["intro"]))}</p>\n'
            '<div class="table-scroll" tabindex="0">'
            '<table class="support-table capability-table">'
            '<thead><tr><th scope="col">Capability</th><th scope="col">Status</th><th scope="col">What to expect</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table></div>\n'
            f'</section>'
        )
    return (
        f'<dl class="status-key" aria-label="How status words are used">{key}</dl>\n'
        + '\n'.join(groups)
    )


def sha_rows():
    rows = []
    for key in ('windows', 'android', 'bundle'):
        asset = release['assets'][key]
        rows.append(
            f"<tr><th scope=\"row\">{escape(asset['filename'])}</th>"
            f"<td><code class=\"hash\" data-hash=\"{asset['sha256']}\">{asset['sha256']}</code></td></tr>"
        )
    return ''.join(rows)


def evidence_list():
    items = ''.join(f'<li>{escape(item)}</li>' for item in release['evidence']['items'])
    caveats = ''.join(f'<li>{escape(item)}</li>' for item in release['evidence']['caveats'])
    return f'''<ul class="evidence-facts">{items}</ul>
<p class="note">{escape(release['evidence']['framing'])}</p>
<ul class="evidence-caveats">{caveats}</ul>'''


def history_html():
    blocks = []
    for item in release['history']:
        tag_class = 'tag' if item.get('current') else 'tag neutral'
        tag_label = 'CURRENT PREVIEW' if item.get('current') else 'PREVIOUS PREVIEW'
        url = f"{REPO}/releases/tag/{item['tag']}"
        if item.get('current'):
            body = f'''<article>
  <h2>{PRODUCT} {escape(item['label'])}</h2>
  <p>{escape(item['summary'])}</p>
  <h3>Included features</h3>
  <ul>
    <li>Windows sending and receiving, plus Android receiving.</li>
    <li>Session invitations and screen or window selection.</li>
    <li>Audio and remote-control controls exist in the UI. Physical remote input is unproven. Audible output was not independently confirmed.</li>
    <li>Matching bundle and USB update helpers.</li>
  </ul>
  <h3>Known limitations</h3>
  <ul>{''.join(f'<li>{escape(limit)}</li>' for limit in release['limitations'])}</ul>
  <p class="note">SHA-256 checks confirm the published files match their recorded hashes. Device and network compatibility require separate testing.</p>
  <div class="actions"><a class="button primary" href="{escape(release['assets']['windows']['url'])}">Download Windows app</a><a class="button" href="downloads.html">All packages</a><a class="text-link" href="{url}">Original release notes ↗</a></div>
</article>'''
        else:
            # Archived builds were published under the previous name.
            body = f'''<article>
  <h2>FastCast {escape(item['label'])}</h2>
  <p>{escape(item['summary'])}</p>
  <a class="text-link" href="{url}">View archived release ↗</a>
</article>'''
        blocks.append(
            f'<section class="wrap release-entry"><div class="release-date"><span class="{tag_class}">{tag_label}</span>'
            f'<p>{escape(item["published_display"])}</p></div>{body}</section>'
        )
    return '\n'.join(blocks)


def write_screenshots_doc():
    shots = release['screenshots']
    wide = shots['windows-share']
    compact = shots['windows-compact']
    text = f'''# Native screenshot provenance

Both `windows-share.png` and `windows-compact.png` are unchanged client-area captures of the native FastCast Windows {wide['capture_build']}, taken {wide['captured']}. An isolated preferences file selected its default {wide['theme']}. Windows captured only the client area, so the operating-system title bar and its sample-application title are absent. No screenshot colours, controls, text, conversations, or session state were painted or generated.

- Wide capture: {wide['width']} × {wide['height']} pixels.
- Smaller window: {compact['width']} × {compact['height']} pixels. {compact['note']}
- These images {('represent the public ' + release['label'] + ' package.') if wide['represents_public_release'] else 'do not represent the public package pixel-for-pixel: ' + wide['note']}
- Neither image depicts a connected media session or establishes streaming performance.
- Website image frames, labels, and zoom controls are HTML/CSS outside the screenshots.
- `og.png` is the logo lockup on the warm ink ground, generated for social previews; not a screenshot.
'''
    (ROOT / 'assets/SCREENSHOTS.md').write_text(text, encoding='utf-8')


def write_readme():
    template = (ROOT / 'src/README.md').read_text(encoding='utf-8')
    tokens = {
        'PRODUCT': PRODUCT,
        'VERSION': release['version'],
        'RELEASE_LABEL': release['label'],
        'TAG': release['tag'],
        'PUBLISHED': release['published_display'],
        'WINDOWS_URL': release['assets']['windows']['url'],
        'ANDROID_URL': release['assets']['android']['url'],
        'BUNDLE_URL': release['assets']['bundle']['url'],
        'CHECKSUMS_URL': release['assets']['checksums']['url'],
        'WINDOWS_SHA': release['assets']['windows']['sha256'],
        'ANDROID_SHA': release['assets']['android']['sha256'],
        'BUNDLE_SHA': release['assets']['bundle']['sha256'],
        'WINDOWS_SIZE': release['assets']['windows']['size'],
        'ANDROID_SIZE': release['assets']['android']['size'],
        'SITE': BASE.rstrip('/'),
        'REPO': REPO,
        'RELEASE_URL': f"{REPO}/releases/tag/{release['tag']}",
    }
    for key, value in tokens.items():
        template = template.replace('{{' + key + '}}', value)
    if re.search(r'\{\{\w+\}\}', template):
        raise ValueError('Unresolved template value in README')
    (ROOT / 'README.md').write_text(template, encoding='utf-8')


def render(slug, title, description):
    canonical = BASE + ('' if slug == 'index' else slug + '.html')
    nav = (
        link('how-it-works', 'How it works', slug)
        + link('get-started', 'Get started', slug)
        + link('help', 'Help', slug)
        + link('github', 'GitHub', slug, href=REPO)
    )
    tokens = {
        'PRODUCT': PRODUCT,
        'VERSION': release['version'],
        'RELEASE_LABEL': release['label'],
        'RELEASE_URL': f"{REPO}/releases/tag/{release['tag']}",
        'REPO': REPO,
        'PUBLISHED': release['published_display'],
        'CAPTURED': captured_display(),
        'NETWORK': release['network'],
        'WINDOWS_PLATFORM': escape(release['platforms']['windows']['name']),
        'ANDROID_PLATFORM': escape(release['platforms']['android']['name']),
        'STATUS': release['status'],
        'WINDOWS_URL': release['assets']['windows']['url'],
        'ANDROID_URL': release['assets']['android']['url'],
        'BUNDLE_URL': release['assets']['bundle']['url'],
        'CHECKSUMS_URL': release['assets']['checksums']['url'],
        'WINDOWS_SIZE': release['assets']['windows']['size'],
        'ANDROID_SIZE': release['assets']['android']['size'],
        'BUNDLE_SIZE': release['assets']['bundle']['size'],
        'WINDOWS_SHA': release['assets']['windows']['sha256'],
        'ANDROID_SHA': release['assets']['android']['sha256'],
        'BUNDLE_SHA': release['assets']['bundle']['sha256'],
        'WINDOWS_FILE': release['assets']['windows']['filename'],
        'ANDROID_FILE': release['assets']['android']['filename'],
        'BUNDLE_FILE': release['assets']['bundle']['filename'],
        'WINDOWS_SIGNING': release['signing']['windows'],
        'ANDROID_SIGNING': release['signing']['android'],
        'SCREENSHOT_WIDE': screenshot('windows-share', slug in ['index', 'product'], explain_link=slug == 'index'),
        'SCREENSHOT_HERO': screenshot('windows-compact', slug == 'index'),
        'SCREENSHOT_COMPACT': screenshot('windows-compact'),
        'SHA_ROWS': sha_rows(),
        'EVIDENCE': evidence_list(),
        'EVIDENCE_HEADLINE': escape(release['evidence']['headline']),
        'EVIDENCE_SCOPE': escape(fill(release['evidence']['scope'])),
        'RELEASE_HISTORY': history_html(),
        'DIALOG_CAPTION': escape(fill(release['screenshots']['windows-share']['caption'])),
        'CAPABILITY_LEDGER': capability_ledger(),
        'RUNE_CIRCLE': rune_circle('lg'),
        'RUNE_CIRCLE_SM': rune_circle('sm'),
        'RUNE_CLOUD': rune_cloud(),
        'FALL_RUNES': fall_runes(),
        'CIRCUIT_TRACES': circuit_traces(),
        'HEX_ACCENTS': hex_accents(),
        'FLAME_FIELD': flame_field(),
        'FLOATING_RUNES': floating_runes(),
        'SCRYING_ORB': scrying_orb(),
        'WIZARD_VOICE': wizard_voice(),
    }
    body = (ROOT / f'src/pages/{slug}.html').read_text(encoding='utf-8')
    for key, value in tokens.items():
        body = body.replace('{{' + key + '}}', value)
    if re.search(r'\{\{\w+\}\}', body):
        raise ValueError(f'Unresolved template value in {slug}')
    robots = '<meta name="robots" content="noindex">' if slug == '404' else ''
    if slug == 'bandwidth':
        page_script = '<script src="bandwidth.js" defer></script>'
    elif slug == 'index':
        # Home only: the wizard exists nowhere else, and the downloads page is
        # kept deliberately light (visual ideation §5.5).
        page_script = '<script src="wizard-fx.js" defer></script>'
    else:
        page_script = ''
    preload = '<link rel="preload" href="assets/windows-share.png" as="image">' if slug in {'index', 'product'} else ''
    structured = json_ld() if slug in {'index', 'downloads'} else ''
    download_current = ' current' if slug == 'downloads' else ''
    html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b0d12">
  <meta name="pyrenet-version" content="{escape(release['version'])}">
  <meta name="description" content="{escape(description)}">
  {robots}
  <title>{escape(title)} — {PRODUCT}</title>
  <link rel="canonical" href="{canonical}">
  <link rel="icon" href="assets/favicon.png" sizes="64x64" type="image/png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="stylesheet" href="styles.css">
  {preload}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{PRODUCT}">
  <meta property="og:title" content="{escape(title)} — {PRODUCT}">
  <meta property="og:description" content="{escape(description)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{BASE}assets/og.png">
  <meta property="og:image:width" content="1280">
  <meta property="og:image:height" content="640">
  <meta property="og:image:alt" content="{PRODUCT}. Screen sharing with a little magic and careful networking. Windows sender and Android viewer development preview.">
  <meta name="twitter:card" content="summary_large_image">
  {structured}
  <script src="site.js" defer></script>
  {page_script}
</head>
<body class="page-{slug}">
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="scroll-progress" aria-hidden="true"></div>
  {icon_sprite()}
  <div class="announcement"><div class="wrap"><span><span class="status-dot" aria-hidden="true"></span> {escape(release['status'])}</span><a href="releases.html">{escape(release['label'])} <span aria-hidden="true">↗</span></a></div></div>
  <header class="site-header">
    <div class="wrap site-header-inner">
      {brand('brand')}
      <nav aria-label="Main">{nav}</nav>
      <a class="button small primary header-download{download_current}" href="downloads.html">Download</a>
    </div>
  </header>
  <main id="main" tabindex="-1">{body}</main>
  <footer class="site-footer wrap">
    <div class="footer-intro">{brand('brand footer-brand')}<p>Screen sharing with a little magic and careful networking.</p><p class="small-copy">{escape(release['offer'])}</p><p class="small-copy">{escape(release['application_source'])}</p></div>
    <nav aria-label="Product links"><h2>Product</h2>{link('product','Overview',slug)}{link('downloads','Downloads',slug)}{link('platforms','Platforms',slug)}{link('releases','Release notes',slug)}</nav>
    <nav aria-label="Resources"><h2>Resources</h2>{link('get-started','Setup',slug)}{link('help','Help',slug)}{link('community','Bugs',slug)}{link('privacy','Privacy',slug)}</nav>
    <nav aria-label="More"><h2>More</h2>{link('why-pyrenet',f'Why {PRODUCT}',slug)}{link('calls-and-rooms','Calls & rooms',slug)}{link('how-it-works','How it works',slug)}{link('roadmap','Roadmap',slug)}{link('bandwidth','Bandwidth calculator',slug)}{link('data-and-privacy','Data & privacy compared',slug)}</nav>
    <div class="footer-bottom"><span>Windows sends · Windows or Android watches · Preview</span><a href="{REPO}">GitHub ↗</a><a href="{REPO}/blob/main/LICENSE">MIT OR Apache-2.0 ↗</a></div>
  </footer>
  <dialog class="image-dialog" aria-label="Full-size app screenshot"><form method="dialog"><button class="button" aria-label="Close screenshot">Close <span aria-hidden="true">×</span></button></form><div class="image-scroll"><img alt=""></div><p>{tokens['DIALOG_CAPTION']}</p></dialog>
</body>
</html>
'''
    if slug == '404':
        html = re.sub(r'(href|src)="(?!https?:|#)([^\"]+)"', lambda match: f'{match[1]}="{BASE}{match[2]}"', html)
    html = '\n'.join(line.rstrip() for line in html.splitlines()) + '\n'
    html = re.sub(r'\n{3,}', '\n\n', html)
    (ROOT / f'{slug}.html').write_text(html, encoding='utf-8')


for slug, (title, description) in PAGES.items():
    render(slug, title, description)
for old_slug, new_slug in REDIRECTS.items():
    write_redirect(old_slug, new_slug)
write_screenshots_doc()
if (ROOT / 'src/README.md').exists():
    write_readme()
urls = [BASE + ('' if slug == 'index' else slug + '.html') for slug in PAGES if slug != '404']
(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(f'  <url><loc>{url}</loc></url>' for url in urls) + '\n</urlset>\n', encoding='utf-8')
(ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n', encoding='utf-8')
print(f'Rendered {len(PAGES)} static pages for {release["label"]}')
