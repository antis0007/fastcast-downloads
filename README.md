# FastCast public website and downloads

[Visit FastCast](https://antis0007.github.io/fastcast-downloads/) · [Downloads](https://antis0007.github.io/fastcast-downloads/downloads.html) · [Help](https://antis0007.github.io/fastcast-downloads/help.html) · [Feedback](https://github.com/antis0007/fastcast-downloads/issues)

FastCast is a free development-preview screen-sharing app for Windows and Android, with no subscriptions in the current offer. This repository contains the public website and release assets, not the native application source.

## Website maintenance

The website is static HTML, CSS, and optional JavaScript. Navigation, direct downloads, screenshot links, and FAQs work without JavaScript. There are no runtime dependencies, analytics, external fonts, billing forms, or browser storage.

- Edit page bodies in `src/pages/` and shared navigation/metadata in `scripts/build-site.py`.
- Keep verified public release links in `src/release.json`. Do not point to an unpublished version.
- Run `npm run build` with Python 3 installed and commit the generated root HTML, sitemap, and robots file alongside their sources. GitHub Pages serves those root files without a server build.
- Development checks: `npm ci`, `npx playwright install chromium firefox webkit`, `npm run check`, `python scripts/check-links.py`, and `npm test`.
- Browser checks cover all fourteen pages at four widths, enlarged text, image loading, no-JavaScript access, keyboard image dismissal, help search, Android download selection, calculator interactions, and automated accessibility. They do not qualify native streaming.

## Screenshots and claims

The native Windows captures use the app's default Cyan theme and were taken from the September 7, 2026 appearance-review executable. They capture the client area directly, excluding the operating-system title bar. They are unchanged captures of a development interface newer than the public preview. The social preview card is a generated brand graphic; it is not a product screenshot.

The transparency pages explain the current peer route, cost ownership, and documented data practices. The bandwidth calculator is a constant-rate payload estimate with an accessible table and a no-JavaScript example. It is not a benchmark or a measurement of another app. Discord figures are historical and source-linked; retention periods have different triggers and must not be presented as a universal rule for all data.

Read DESIGN.md for the visual direction and pre-commit critical review. Future collaboration work is identified as future work. Do not fabricate conversations, metrics, testimonials, security guarantees, or feature parity with other communication apps.

## Release and feedback policy

Use matching app versions and consult the published release notes. Keep invitations, recovery codes, and private screen content out of public issues. Issue templates collect reproduction details and user needs without opening a ticket automatically.
