# Handoff: FastCast site, wizard interaction, and line pool

For the next agent picking this up. Read this before touching anything, and trust
the built page over any document, including this one.

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

### 3.3 Claims the site makes about itself disagree

`src/release.json` says the network is a "Direct peer route, with a FastCast relay
fallback", and the transparency pages agree. Several marketing pages still say
there is no relay at all. This is unresolved and needs a product decision, not a
guess:

- `platforms.html` — "does not include … a managed media relay"
- `help.html` — "there is no FastCast-managed relay in this package"
- `why-fastcast.html` — "No FastCast middlebox"
- `how-it-works.html` — says "No FastCast media relay" while its own costs table
  describes the relay forwarding media and admitting eight concurrent sessions
- `bandwidth.html` — calls it "HYPOTHETICAL MEDIA RELAY"

**Do not fix these by choosing a side.** Confirm with the release owner which
reflects the shipped package, then make every page agree with `release.json`.

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
