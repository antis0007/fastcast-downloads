# Release 0.3.3 preparation checklist

This branch is the staging point for the 0.3.3 release train. The site gate
(`scripts/check-release.py`) refuses placeholder asset data, so nothing on this
branch goes live until the real artifacts exist. Follow the order below.

## 1. Source freeze (done)

All product work targeted for 0.3.3 is merged on `antis0007/fastcast` main at
`47aee55`:

- Chat modernization: dynamic room naming/renaming, multi-device account
  linking, per-room drafts with bounded saved state.
- Receiver, contacts and voice cleanup (the latest-cleanup checkpoint:
  voice-unavailable receiver path, settings, platform docs).
- Call meter redraw cap, quiet-microphone handling, movable voice-call window,
  remote-input stream bounds, gamepad neutral-state requirement.
- Profile: editable name and handle after signup, desktop/Android picture
  updates.
- Canonical durable protocol foundation and authenticated relay escape.

`cargo check --workspace --all-targets` and `cargo test --workspace` pass
(750 tests, 0 failures, 13 ignored).

All website redesign work is on `antis0007/fastcast-downloads` main at
`ede9be9`: the preview-9 cast-scene redesign, wizard voice system, and the
tiered orbit particles (`wizard-fx.js`). `tests/check-site.cjs` passes all
journeys, viewports and accessibility checks; `check-release.py` and
`check-links.py` are green for 0.3.2 Preview 9.

## 2. Build artifacts

Build Windows and Android packages from fastcast `main` (`47aee55`), following
the preview-9 process. Record for each asset: exact filename, byte size,
SHA-256. Also produce the portable bundle and `SHA256SUMS.txt`.

## 3. Create the GitHub release

Tag `v0.3.3-preview.1` on fastcast main. Upload the four assets to a
`antis0007/fastcast-downloads` release with that tag. Verify each download URL
returns HTTP 200 before touching the site data.

## 4. Update release data

In `src/release.json`:

- `version` → `0.3.3-preview.1`, `tag` → `v0.3.3-preview.1`,
  `label` → `0.3.3 Preview 1`, `published` → release date (ISO),
  `published_display` → long form.
- `assets.*`: real `filename`, `url` (must contain the new tag and version),
  `size`, `bytes`, `sha256`.
- Append a `history` entry (version, tag, published, current: true, label,
  published_display, summary — one sentence, factual) and set
  `current: false` on the 0.3.2-preview.9 entry. Exactly one `current`.

## 5. Rebuild and gate

1. `python scripts/build-site.py` — regenerates all pages with the new
   version meta and download URLs.
2. `python scripts/check-release.py` — must pass.
3. `node tests/check-site.cjs` — must pass (playwright journeys include the
   download tag and wizard behaviour).
4. `python scripts/check-links.py` — live URLs must be 200.

## 6. Publish

Commit ("site: publish FastCast 0.3.3 preview 1"), push to `main`, tag
`v0.3.3-preview.1`, then confirm the live site serves the new hashes.
