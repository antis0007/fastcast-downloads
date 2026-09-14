# Handoff: FastCast site, wizard interaction, and line pool

**Latest pool: 21 lines.** After the earlier 123 → 75 curation, the owner rejected
the attempted refinements and requested a harsher review of every surviving line.
[The full review](WIZARD-FULL-REVIEW-2026-09-13.md) covers all 75, retaining 21
unchanged lines and moving one ordinary poke response to the first-click pool.
Empty orb, hat, and beard pools use ordinary click dialogue. None of the seven
proposed rewrites was retained. [The earlier cuts](WIZARD-CUTS-2026-09-13.md)
also remain intentional.
These are intentional; older 123-line preservation notes below describe the
preceding editorial pass and must not be used to restore the cuts.

For the next agent picking this up. Read this before touching anything, and trust
the built page over any document, including this one.

**September 13 editorial update:** Read [EDITORIAL-CONTRACT.md](EDITORIAL-CONTRACT.md)
before changing public copy. The owner asked to remove slogans, rhetorical
fragments, and repetition while preserving precise capabilities and limitations.
The newer editorial pass supersedes historical instructions below to restore
homepage wording verbatim. All 123 wizard lines remain unchanged. Visual choices
from the selective rollback remain, with the duplicate homepage walkthrough
removed and its anchors preserved.

## 0. The one rule that matters

**Verify on the built page, not in the source.** The pool and the scene are
generated into `index.html` by `scripts/build-site.py`. An edit to the generator
that never reaches the artefact looks identical to a finished change. This exact
mistake — reporting a content pass as landed when its commit had been reverted —
cost a full cycle.

```powershell
cd C:\AI\temp_work\fastcast-downloads-publish
python scripts\build-site.py                  # must print: Rendered 15 static pages
python ..\fc-checks\verify-cuts.py            # reads the JSON island off the built page
```

## 1. Where everything lives

| What | Path |
|---|---|
| Generator: chrome, tokens, scene builders, the line pool | `scripts/build-site.py` |
| Page bodies (templates with tokens) | `src/pages/*.html` |
| Release manifest — the authority on product claims | `src/release.json` |
| Stylesheet | `styles.css` |
| Interaction layer (lightbox, FAQ, wizard) | `site.js` |
| Browser acceptance suite | `tests/check-site.cjs` |
| Rune artwork sprite, referenced as `<use href="#i-...">` | emitted by `icon_sprite()` |
| Wizard artwork | `assets/fastcast-wizard.webp` |
| Meme/social register — **separate from the bubble pool** | `docs/MEME-REGISTER.md` |

### The generator's shape

`render(slug, title, description)` builds a token dict, reads
`src/pages/{slug}.html`, substitutes `{{TOKEN}}`, and **raises on any leftover
token**. Scene tokens are index-only and empty elsewhere. If you add a token,
confirm it is both in the dict and referenced in the template — a token in the
template but not the dict is a build failure, and the reverse is dead weight.

## 2. Current state

- **Pool: 123 lines.** `first` 4, `idle` 86, `poke` 8, `hold` 4, `far` 3, `orb` 5,
  `rightclick` 5, `hat` 1, `beard` 1, `drag` 6.
- **The scene is live**: rune circle, hex accents, circuit traces, flame field,
  fall runes, rune cloud, floating runes, and the interactive wizard.
- **Interaction works and is verified**: click escalates through `poke`, ordered
  pools no longer freeze on their last line, the beard/hat/orb regions resolve to
  distinct pools, keyboard activation skips the region lookup.
- **The suite is green**: 15 pages × Chromium/Firefox/WebKit × 320/390/768/1440,
  plus reduced motion, navigation, FAQ search, the bandwidth calculator, and axe
  accessibility at 390 and 1440.

History worth knowing: the wizard was built on `redesign/wizard-site` against a
generator `main` has since replaced twice. It was ported, reverted once ("shipped
without most of its stylesheet"), and restored through `port/rework`. The pool has
been merged additively at least twice, which re-introduced lines review had cut.
**A commit that deletes pool lines is not automatically data loss.** Read the
commit message before restoring anything.

## 3. Known problems, most valuable first

### 3.1 The pool is starving exactly where a visitor explores (do this first)

| Pool | Lines | Consequence |
|---|---|---|
| `hat` | 1 | found a hidden region → the same joke, every time after the first |
| `beard` | 1 | same |
| `orb` | 5 | five clicks exhausts it |
| `idle` | 86 | generous, and the least interactive |

The two pools that reward *discovery* hold one line each. Adding three or four
lines each to `hat` and `beard`, and three to `orb`, is the highest-value writing
work available in this codebase. Follow the voice contract in `build-site.py`
(see §5).

### 3.2 The greeting answers the wrong moment

`first[0]` is `You are here about the scrying. Everyone is here about the
scrying.` The wizard only speaks **after a click**, so the first thing the most
curious visitor hears treats their click as an arrival. `poke[0]` reads better as
an opener. Either reorder `first` or write one line that acknowledges being
clicked.

### 3.3 Connection explanation updated September 13, 2026

The public release manifest describes direct media with a FastCast relay
fallback. The separate native application's `v0.3.2-preview.5` source tag was
also inspected: both receiver platforms call live pairing with relay allocation;
the relay forwards the peer connection. The network copy now follows that
manifest while keeping unrelated-network media explicitly unqualified. This is
not a fresh verification of the published binaries or running relay service.

`how-it-works.html` now separates setup, media routes, participant visibility,
the native technical stack, and costs. Its direct/relay comparison uses native
radio controls and CSS; technical detail uses native disclosures. Both work
without JavaScript. The homepage links into this explanation.

Contradictory relay-absence wording was reconciled in Home, Product, Platforms,
Help, Why FastCast, Roadmap and the Bandwidth model label. The source manifest,
generator, wizard pool and wizard behavior were not changed. The application
repository's divergent site copy remains outside this change.

The browser suite now tests keyboard selection of both routes and opening all
five disclosures without JavaScript in every engine, plus accessibility with
the details expanded. Keep these checks when changing the diagram.

Validation on September 13: `python scripts/build-site.py` rendered 15 pages;
`check-release.py`, `check-links.py` (including all four public downloads),
`check-contrast.py`, `node tests/bandwidth.cjs` and `git diff --check` passed.
`node tests/check-site.cjs` passed for all three browsers. After stacking the
mobile data table, the suite was rerun separately with `chromium`, `firefox`
and `webkit`; all passed at 320/390/768/1440 with enlarged text, no-JavaScript
controls and axe at 390/1440. A final wording simplification in the relay table
cell was rebuilt and diff-checked afterward. Desktop/mobile generated captures
were inspected. Native network, binary provenance, live deployment and real
screen-reader behavior were not requalified. No new dependencies or publication.

The generator, release manifest and interaction script have no diff; the built
pool remains 123 unique lines. `verify-cuts.py` output was inspected, not treated
as an enforcing test: it reports findings without returning a failing exit code.
Next: review the connection explanation, then publish through this repository's
existing Pages workflow when authorized.

### 3.4 Smaller items

- `poke` and `rightclick` are the two most-clicked pools; the interface does not
  surface which pool a line came from except via `bubble.dataset.pool`, which the
  tests use.
- `aria-live` announcement on the *first* line is unverified: the paragraph starts
  `hidden`, and unhiding plus setting text in one task is the combination screen
  readers handle least consistently. Needs a real screen reader, not a test.
- The scene is mouse-first by construction — the gaze lean is gated on
  `(hover: hover) and (pointer: fine)`. FastCast's documented receive platform is
  Android, so this is a deliberate scoping call worth revisiting.

## 4. Working cheaply and where to spend

The repository is large: `index.html` alone is ~70KB of generated markup, and the
generator is ~63KB. Reading either in full is the fastest way to burn a context
window for nothing.

### Do this

- **`grep` and `read` with `offset`/`limit`, never a whole-file dump.** A rule
  like `grep pattern` then `read offset=120 limit=30` answers most questions.
- **Keep a scratch script in `..\fc-checks\` instead of reading the generator.**
  Import it and print only what you need:
  ```python
  import importlib.util
  spec = importlib.util.spec_from_file_location("bs", "scripts/build-site.py")
  mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
  print({k: len(v) for k, v in mod.WIZARD_LINES.items()})
  ```
  Importing runs the build, which is itself a useful smoke test.
- **Ask a cheap, narrow question of a cheap model.** Verification is the natural
  delegation: "run `node tests/check-site.cjs`, report the first failure verbatim"
  needs no reasoning about the codebase. Do not delegate judgement about writing
  or architecture to save money — that is where quality lives, and a wrong answer
  costs more than the tokens saved.
- **Reuse the existing verifiers** in `fc-checks/`: `verify-cuts.py`,
  `verify-jokes.py`, `pool-dump-now.py`, `gaps.py`, `apply-cuts.py --check`.
  They already read the built page and fail loudly.
- **Batch independent commands** into one shell call.
- **Prefer `--check` / dry runs** before writing. `apply-cuts.py --check` reports
  what would change and writes nothing.

### Do not

- Do not install a DOM library or write a headless harness. The project has
  Playwright already.
- Do not re-read a file you just wrote to "confirm" — verify on the artefact.
- Do not open `index.html` at all; it is generated. Read `src/pages/*.html`.

### Testing: one caveat and one delegation pattern

`tests/check-site.cjs` is the acceptance gate and it is comprehensive. In a
sandboxed environment Chromium fails with `browserType.launch: spawn EPERM` — that
is the sandbox's named-pipe restriction, not a code fault. Outside such a sandbox
it runs normally. Full run is roughly a minute:

```powershell
node tests\check-site.cjs        # layout, journeys, reduced motion, axe
python scripts\check-release.py  # release invariants
python scripts\check-links.py    # local links, fragments, duplicate IDs
```

Delegate the *run and the raw first failure* to a cheap agent, keep the diagnosis
and the fix. Give the delegate the exact command, the exact working directory, and
instructions to paste output verbatim without summarising.

## 5. Writing standards for the pool

The contract lives in a comment block above `WIZARD_LINES` in
`scripts/build-site.py`. The parts easiest to get wrong:

- **Every line must stand alone.** The visitor sees one bubble, drawn at random.
  An implied past is fine; a dependency on another line is not.
- **An ending must add an action, a consequence, a revelation or a reversal.**
  A trailing clause that *explains* the joke is the defect. `I pointed at the
  ladder` stays; `which was faster and funnier` goes.
- **No aphorisms.** If it would fit on a poster it is not a joke.
- **He does not know modern technical words.** He says *scrying*, not *streaming*;
  he calls a server a Ser-Vur. Faces (`:3`) and modern slang are his own but
  rationed: about one line in ten, never as the whole line.
- **He does not block the visitor.** He winds them up; the mischief costs nothing.
- **Facts about FastCast must match `src/release.json`.**
- **The strongest shape in the pool**: an enormous spell bent to a petty,
  specific, human purpose. `My rival demanded a duel at dawn. I have postponed the
  sun.` The weakest shape: attitude with no incident, or a consequence withheld as
  the entire joke.

### Two registers, do not mix them

`docs/MEME-REGISTER.md` holds social captions for the Pondering My Orb /
wizardposting tradition. They are lowercase, addressed to an audience, and use
modern slang freely. **None of them belong in `WIZARD_LINES`**, and a recent
additive merge put ten of them there; they were cut. If you are writing for the
bubble, write a wizard speaking to one visitor. If you are writing for social,
put it in the register document.

## 6. Editing safely

- The pool is a list of exact strings inside `build-site.py`. Match on parsed
  values, not source spelling: lines containing a double quote are stored escaped,
  and naive matching silently skips exactly those.
- After any pool edit, confirm the file still **parses** (`python -c "import ast;
  ast.parse(open('scripts/build-site.py', encoding='utf-8').read())"`). A line
  merged in with unescaped quotes made the whole site unbuildable for a period.
- `assets/fastcast-wizard.webp` is the artwork the regions in `site.js` are
  measured against. If the art is replaced, **re-measure the three region
  rectangles** and re-check which pool each resolves to. The regions are
  fractions of his own box; they must not overlap, because the lookup takes the
  first match.
- Before declaring anything done: build, verify on the artefact, and run the
  suite. "It builds" is not evidence that it renders.

## 7. Homepage follow-up — September 13, 2026

The owner explicitly preferred the current redesign to the old contract, then
rejected the small-wizard revision. The final direction restores the large hero
wizard and gives the app a full-width section directly afterward. `DESIGN.md`
records that correction above its historical entries.

- The existing headline, amber identity and paper sections remain. The large
  interactive wizard fills the hero illustration, and the real Windows capture
  fills the next section. It retains its September 7 development-build disclosure and
  working full-size link. No session video was available or fabricated.
- Header artwork uses its natural aspect ratio at 64px high on desktop and
  52px on phones, with a visible wordmark at both sizes.
- The homepage has one viewer-first setup walkthrough, role entry points,
  separate permissions and consolidated package/download blocks. Detailed test
  qualifications sit in labelled disclosures beside the relevant content. Downloads
  and getting started carry the same installation context. Existing URLs and
  the expanded connection explanation remain intact.
- The generator changed only for navigation, page metadata and release-backed
  content tokens. The curated pool is still exactly **123 lines**, compared as
  parsed values against HEAD and against the generated JSON island. This pass
  neither restores nor removes dialogue.
- A stale current-release limitation claimed one viewer while the same manifest
  listed multi-viewer support. The tagged Preview 5 source has an eight-viewer
  limit and loopback coverage. Current copy now distinguishes that experimental
  support from unqualified physical multi-device sharing. Historical release
  descriptions remain historical; no application code was changed.
- A new keyboard check exposed an existing behavior: reduced motion disabled
  speech along with pointer animation. Text activation now works independently;
  pointer-follow and dragging retain the fine-pointer/motion gate. Keyboard
  activation does not use artwork hit regions. The large scene retains its
  original centered speech bubble; touch activation also has browser coverage.

Verification: build 15 pages, release checks, contrast, bandwidth tests, full
Playwright layouts in Chromium/Firefox/WebKit at 320/390/768/1440, enlarged text,
no-JavaScript paths, keyboard/reduced-motion journeys and axe at 390/1440 passed.
Local links, fragments, canonical URLs and four public downloads also passed.
Homepage screenshots were visually reviewed. These are website checks, not new
device, audio or Internet-stream acceptance evidence. After visual review and
the final header wordmark size/spacing adjustment, the owner authorized
publication to the existing GitHub Pages site.


## 8. Visual repair after publication — September 13, 2026

The owner rejected the homepage/wordmark regressions and explicitly requested
the pre-pass version with genuine improvements retained. `DESIGN.md` now records
the causes and the governing baseline (`28ffb7e`). Section 7 describes the earlier
pass and is historical, not the current layout instruction.

The homepage structure and most CSS return to that baseline. Direct/relay facts,
the expanded technical page, download/install context and keyboard/touch fixes
remain. Header lettering is now live text to avoid the raster's grey edge pixels
and excessive weight. Aura clipping is removed and the constrained desktop seal
is resized to fit; original phone scaling is restored. The test matrix includes
1051px and 1152px and explicitly checks that the hero seal is not clipped.

The dialogue pool remains identical to the pre-pass baseline: 123 exact strings.
No lines are being restored, removed or rewritten as part of this repair.

An edge-drag regression check reproduced horizontal page expansion after removing
the clip. Rendering now bounds horizontal drag to the viewport while retaining
gesture detection and the existing dialogue. Static layouts passed all three
browsers at six widths, and Chromium additionally checks the drag boundary.
