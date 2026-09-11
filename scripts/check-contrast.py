"""Check that the palette keeps its text and control contrast.

Text pairs must clear WCAG AA (4.5:1). Anything clickable or typeable must
clear the 3:1 non-text contrast rule, so a control boundary stays perceivable
against the ground it is actually painted on.

Decorative rules are deliberately held to a visibility floor instead of 3:1:
forcing every divider to 3:1 boxes the page in and reads heavier, not better.

Run directly or through `npm run check`.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parents[1] / 'styles.css'

# (label, foreground token, ground token, minimum ratio)
TEXT_PAIRS = [
    ('body text', 'text', 'bg', 4.5),
    ('secondary text', 'muted', 'bg', 4.5),
    ('fine print', 'quiet', 'bg', 4.5),
    ('accent link', 'accent', 'bg', 4.5),
    ('accent hover', 'accent-strong', 'bg', 4.5),
    ('eyebrow', 'brand-soft', 'bg', 4.5),
    ('ember label', 'ember', 'bg', 4.5),
    ('paper body', 'paper-text', 'paper', 4.5),
    ('paper secondary', 'paper-muted', 'paper', 4.5),
    ('paper eyebrow', 'copper', 'paper', 4.5),
    ('paper secondary on alt', 'paper-muted', 'paper-2', 4.5),
    ('text on surface', 'text', 'surface', 4.5),
    ('muted on surface', 'muted', 'surface', 4.5),
    ('fine print on surface', 'quiet', 'surface', 4.5),
    ('muted on raised', 'muted', 'surface-raised', 4.5),
]

# Status badges are painted from hex values written into their own rules rather
# than from tokens, which is precisely how a pair escapes a token-only audit: the
# light-panel "not yet" badge sat at 3.93 against its own background for as long
# as nobody measured it. Either side may be a literal colour or a token name.
LITERAL_PAIRS = [
    ('badge on paper: available', '#f7f5ee', '#7a5a22', 4.5),
    ('badge on paper: preview', '#6b4a15', '#f0e4c9', 4.5),
    ('badge on paper: limited', '#5f5341', '#e8e5d8', 4.5),
    ('badge on paper: not yet', '#585f50', '#e4e6db', 4.5),
    ('badge on ink: available', '#171815', 'accent', 4.5),
]

CONTROL_PAIRS = [
    ('control border on page', 'line-strong', 'bg', 3.0),
    ('control border on surface', 'line-strong', 'surface', 3.0),
    ('control border on raised', 'line-strong', 'surface-raised', 3.0),
    ('control border on paper', 'line-control-light', 'paper', 3.0),
    ('control border on paper alt', 'line-control-light', 'paper-2', 3.0),
    # Controls that lighten their ground on hover also swap the border to the
    # accent, so this is the pairing that actually renders.
    ('control hover border', 'accent', 'surface-hover', 3.0),
]

DECORATIVE_PAIRS = [
    ('divider on page', 'line', 'bg', 1.2),
    ('soft rule on page', 'line-soft', 'bg', 1.1),
    ('rule on paper', 'line-light', 'paper', 1.2),
]


def token(css: str, name: str) -> str:
    match = re.search(rf'--{name}:\s*(#[0-9a-fA-F]{{6}})', css)
    if not match:
        raise SystemExit(f'check-contrast: token --{name} not found in styles.css')
    return match.group(1)


def resolve(css: str, value: str) -> str:
    """A literal colour passes through; anything else names a token."""
    return value if value.startswith('#') else token(css, value)


def _linear(value: float) -> float:
    value /= 255
    return value / 12.92 if value <= 0.03928 else ((value + 0.055) / 1.055) ** 2.4


def luminance(colour: str) -> float:
    colour = colour.lstrip('#')
    red, green, blue = (int(colour[index:index + 2], 16) for index in (0, 2, 4))
    return 0.2126 * _linear(red) + 0.7152 * _linear(green) + 0.0722 * _linear(blue)


def ratio(foreground: str, ground: str) -> float:
    first, second = luminance(foreground), luminance(ground)
    lighter, darker = max(first, second), min(first, second)
    return (lighter + 0.05) / (darker + 0.05)


def main() -> int:
    css = CSS.read_text(encoding='utf-8')
    failures = []
    for title, pairs in (
        ('text (AA 4.5:1)', TEXT_PAIRS + LITERAL_PAIRS),
        ('controls (WCAG 1.4.11, 3:1)', CONTROL_PAIRS),
        ('decorative rules (visibility floor)', DECORATIVE_PAIRS),
    ):
        print(f'--- {title}')
        for label, fg, bg, minimum in pairs:
            foreground, ground = resolve(css, fg), resolve(css, bg)
            measured = ratio(foreground, ground)
            ok = measured >= minimum
            print(f'  {"ok  " if ok else "FAIL"} {label:30} {foreground} on {ground} = {measured:5.2f} (min {minimum})')
            if not ok:
                failures.append(f'{label}: {measured:.2f} < {minimum}')
    if failures:
        print('\ncontrast check failed:')
        for failure in failures:
            print(f'  {failure}')
        return 1
    print('\nPalette contrast passed for text, controls and decorative rules')
    return 0


if __name__ == '__main__':
    sys.exit(main())
