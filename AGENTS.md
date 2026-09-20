# Public Pyrenet website

This repository is the publishing source. The application repository's `site/`
folder is historical; do not copy it here as an update.

- Fetch and inspect `origin/main` before starting. Use a separate branch/worktree
  if another agent owns uncommitted changes. Do not reset or overwrite that work.
- Edit `src/pages/*.html`, `styles.css`, and `scripts/build-site.py`. Root HTML is
  generated. There is one source body per route; do not add alternate `*-full`
  pages or one-off scripts that rewrite the generator.
- Compare designs and wording with the actual product and relevant industry
  references. Follow the user's current direction over historical design notes.
- Run `python scripts/build-site.py`, `python scripts/check-source.py`,
  `python scripts/check-release.py`, `python scripts/check-links.py`,
  `python scripts/check-contrast.py`, and `node tests/bandwidth.cjs` before pushing.
  For visual changes, also inspect desktop, mobile, enlarged text, and keyboard use.
- `src/release.json` describes published files. Do not promote it until assets
  exist, their bytes and hashes match, and direct download URLs work.
- A push to main publishes the site. Push experiments to their own branches.
- Website quality runs on pull requests and main. Keep generated-source,
  release, link, browser, and accessibility checks passing; review the uploaded
  screenshots for visual changes. Automated layout checks do not select copy
  or establish that a design meets the user's preferences.

On 20 September 2026 the first facelift direction was rejected. It is preserved
locally under `draft/website-review-20260920`; do not promote it as accepted work.
