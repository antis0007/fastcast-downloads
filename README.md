# FastCast public website and downloads

[Visit FastCast](https://antis0007.github.io/fastcast-downloads/) · [Downloads](https://antis0007.github.io/fastcast-downloads/downloads.html) · [Help](https://antis0007.github.io/fastcast-downloads/help.html) · [Feedback](https://github.com/antis0007/fastcast-downloads/issues)

FastCast is a free development-preview screen-sharing app for Windows and Android, with no subscriptions in the current offer. This repository contains the public website and release assets, not the native application source.

## Download and setup

[FastCast 0.3.2 Preview 1](https://github.com/antis0007/fastcast-downloads/releases/tag/v0.3.2-preview.1) provides matching Windows and Android apps. The Android package uses version code 5.

- [Windows installer](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/FastCast-0.3.2-preview.1-Setup.exe)
- [Android APK](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/FastCast-0.3.2-preview.1-Android.apk)
- [Windows + Android portable bundle](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/FastCast-0.3.2-preview.1-windows-android-x64.zip)
- [SHA-256 checksums](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/SHA256SUMS.txt)

1. Install the Windows app using Setup, or extract the ZIP and double-click **Install FastCast.cmd**. Keep `FastCast.exe` beside `cast-host.exe` for portable use.
2. Install the matching APK on Android. For USB debugging, connect and authorize your devices, then run **Update connected devices.cmd** from the bundle.
3. Create a fresh **Share invite** on Android, or choose **Receive → Start receiving → Copy invitation** on the viewing Windows PC.
4. On the sending PC, import the invitation under **Share**, choose a screen or window, review audio and remote-input permissions, and start sharing.

Use apps from the same release and begin on the same LAN or an existing reachable private network. Windows binaries are unsigned; Android is debug-signed. The updater preserves app data and stops on signing conflicts instead of uninstalling an existing app. Read the release notes for the package's actual validation and remaining device, audio, input, and network limitations.

## One-click debugging updates

The downloaded bundle's **Update connected devices.cmd** installs the exact APK included in that bundle on authorized connected Android devices. Download a newer matching bundle to update to another release.

The separate application source checkout has its own **Update connected devices.cmd**. It fetches the latest clean source, builds matching Windows and Android apps, and updates this PC and authorized connected Android devices. Developers can select local edits explicitly; emulators require an explicit option. This public website repository cannot build the native apps.

## Website maintenance

The website is static HTML, CSS, and optional JavaScript. Navigation, direct downloads, screenshot links, and FAQs work without JavaScript. There are no runtime dependencies, analytics, external fonts, billing forms, or browser storage.

- Edit page bodies in `src/pages/` and shared navigation/metadata in `scripts/build-site.py`.
- Keep verified public release links in `src/release.json`. Do not point to an unpublished version.
- Run `npm run build` with Python 3 installed and commit the generated root HTML, sitemap, and robots file alongside their sources. GitHub Pages serves those root files without a server build.
- Development checks: `npm ci`, `npx playwright install chromium firefox webkit`, `npm run check`, `python scripts/check-links.py`, and `npm test`.
- Browser checks cover all ten pages at four widths, enlarged text, image loading, no-JavaScript access, keyboard image dismissal, help search, Android download selection, and automated accessibility. They do not qualify native streaming.

GitHub Pages serves the repository's `main` branch from `/`. Update the release manifest and generated pages together only after the matching assets and checksums are published. `scripts/check-links.py` verifies local page targets and fragments, then checks the four release downloads over HTTP; it cannot pass for an unpublished release. Browser screenshots go to ignored `test-results/`.

The public file boundary is the tracked website pages, their `src/` templates and release manifest, `scripts/` and `tests/`, the package files, the seven files under `assets/`, repository documentation and licenses, and the public issue templates. Keep native source, local evidence, device logs, invitations, signing material, `node_modules/`, and test output outside publication.

## Screenshots and claims

The native Windows captures use the app's actual Phosphor theme and were taken from the September 7, 2026 appearance-review executable. They are unchanged captures of a development interface newer than the public preview. The social preview card is a generated brand graphic; it is not a product screenshot.

Read DESIGN.md for the visual direction and pre-commit critical review. Future collaboration work is identified as future work. Do not fabricate conversations, metrics, testimonials, security guarantees, or feature parity with other communication apps.

## Release and feedback policy

Use matching app versions and consult the published release notes. Keep invitations, recovery codes, and private screen content out of public issues. Issue templates collect reproduction details and user needs without opening a ticket automatically.
