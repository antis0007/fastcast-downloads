# Agent brief: FastCast site modernization (UI + copy + wizard voice)

You are taking over the public website for **FastCast** — screen sharing for
Windows (sends and receives) and Android 8+ (watches, joins calls, in-call
chat). It is a real, working product: direct device-to-device media over the
user's own network, with an encrypted relay as fallback. Screen sharing needs
no account. The preview is free; Windows installer is unsigned, Android APK is
debug-signed. Those facts and caveats must survive everything you do.

Repo: `c:\AI\temp_work\fastcast-publishing` (branch `main`, remote
`antis0007/fastcast-downloads`). Pages are generated: edit
`src/pages/*.html` and `scripts/build-site.py`, never the root `*.html`
(rebuild with `python scripts/build-site.py`).

## Mission

The owner's verdict on the current site: the hero lede still sucks, the copy
reads like documentation, and the wizard lines are not funny. Your job:

1. **UI modernization.** Make the site feel like a product launch, not a spec
   sheet. Keep the existing dark fire-lit theme (amber/ember palette, cast
   scene, orbit particles — these are approved owner decisions), but improve
   hierarchy, spacing, and the visual rhythm between sections. The hero should
   land the product in three seconds. Reduce visual noise; the cast-scene
   effects must stay within the animated-node budget documented in
   `docs/WIZARD-INTERACTIONS.md`.
2. **Copy rewrite.** Natural, confident, concrete. The current text fails
   because it describes widgets instead of outcomes. Rewrite so a stranger
   understands in one screenful what FastCast is, why it exists (share a
   screen without dragging your group onto a Discord-sized platform), and what
   to do next. Right amount of text: every sentence earns its place; if a
   sentence neither states a fact, removes a doubt, or prompts an action,
   delete it. No fragment-as-emphasis, no "Lightning fast!" filler, no
   praising the product's own honesty or simplicity.
3. **Wizard lines.** Rewrite the voice pool in `WIZARD_LINES`
   (`scripts/build-site.py`, categories: first, idle, poke, hold, far, orb,
   rightclick, hat, beard, drag). Target audience: 20–30 year olds, D&D
   players, privacy-conscious users, magic-meets-technology enthusiasts. The
   wizard is a deadpan archmage who treats screen sharing as humble arcane
   craft. Actually funny: dry, specific, honest about the product. The joke is
   always a true fact about FastCast wearing a robe — never a generic fantasy
   quip, never a pun a PHB would reject, never cringe. Aim for lines like:
   - "I do not host your screen. I merely point at it."
   - "No account. My circle requires only two devices and one invitation."
   - "The relay is a last resort. Even portents need a backup plan."
   - "I have read the terms of service. There were none to read."
   Anti-examples (banned register): anything with 'tis/'twas, "behold",
   "mortal", "in days of yore", or jokes about burning villagers. Keep each
   line short enough to read in one glance (most under ~90 characters).
   Preserve all functional lines: the rightclick lines carry real troubleshooting
   advice, and hold/far/drag lines exist to acknowledge a gesture.

## Hard constraints (owner-mandated, do not violate)

- Read `docs/EDITORIAL-CONTRACT.md` first and follow every rule. It records
  what previous passes broke and why. Facts, caveats, statuses, checksums,
  download URLs, release data, and the screenshots' "not a live session"
  disclosures must not change or soften.
- The home headline stays "Share your screen with another device." unless you
  propose a replacement IN the brief's spirit and flag it in your summary for
  owner approval — do not silently change it.
- Capability table statuses (Available / Preview / Limited / Not yet) and the
  unverified-testing caveats are information, not negativity. Keep them.
- Accessible labels, alt text, metadata, and captions are copy too — rewrite
  them with the same care.
- Do not touch: `src/release.json` asset data, `tests/`, the build gates, the
  download URLs, or anything outside the website repo.

## Workflow

1. `python scripts/build-site.py` after edits; never hand-edit root HTML.
2. Gates, all must pass before you claim success:
   - `python scripts/check-release.py`
   - `node tests/check-site.cjs` (full Playwright suite; if you change
     visible copy that tests assert on, update the test AND say so)
   - `python scripts/check-links.py`
3. Commit to `main` with a descriptive message and push
   (`origin` = `antis0007/fastcast-downloads`). One commit per coherent change;
   the owner reviews diffs.
4. Finish with a summary listing: every page you touched, before/after for the
   hero lede and at least three wizard lines, and anything you deliberately
   did NOT change and why.

## Quality bar

Read the page as a skeptical 25-year-old developer who has 30 seconds and ten
tabs open. Would they understand what this is, believe it, and hit Download?
Would they smile at the wizard without cringing? If any answer is no, the work
is not done.
