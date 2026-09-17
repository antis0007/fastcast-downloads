# FastCast downloads

FastCast shares a Windows screen or window with an Android device or another Windows PC. The website shows native Windows development screenshots and provides matching preview downloads.

[Visit the website](https://antis0007.github.io/fastcast-downloads/) · [Browse downloads](https://github.com/antis0007/fastcast-downloads/releases)

This public repository contains the website, release notes, and downloadable previews. Application source is maintained separately.

## Download

[Download FastCast 0.3.2 Preview 1](https://github.com/antis0007/fastcast-downloads/releases/tag/v0.3.2-preview.1)

[Browse all releases](https://github.com/antis0007/fastcast-downloads/releases)

- [Windows installer](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/FastCast-0.3.2-preview.1-Setup.exe)
- [Android APK](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/FastCast-0.3.2-preview.1-Android.apk)
- [Windows + Android portable bundle](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/FastCast-0.3.2-preview.1-windows-android-x64.zip)
- [SHA-256 checksums](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.2-preview.1/SHA256SUMS.txt)

Use Windows and Android apps from the same release. Downloads include the matched portable ZIP, Android APK, Windows installer, and SHA-256 checksums. Windows builds are unsigned; the Android debugging preview uses the existing debug signing key and supports in-place updates from earlier matching-key previews.

## Setup

1. Install the Windows app using Setup, or extract the ZIP and double-click **Install FastCast.cmd**. Keep `FastCast.exe` beside `cast-host.exe` for portable use.
2. On Android, install the matching APK. For USB debugging, connect and authorize your devices, then use **Update connected devices.cmd** from the bundle.
3. Create a fresh **Share invite** on Android, or choose **Receive → Start receiving → Copy invitation** on the viewing Windows PC.
4. On the sending PC, import the invitation under **Share**, select a screen or window, and start sharing. Microphones and remote input begin off; enable them deliberately for the session.

Invitations grant access to a session. Keep them private and create a new one after replacing or revoking permission. The updater keeps app data and stops on signing conflicts instead of uninstalling the app.

## Status

- Windows sending prefers NVIDIA NVENC and provides CPU H.264 fallback on other supported PCs. CPU encoding uses more processor time; begin with 30 fps when needed.
- Receiving supports Android 8 or newer and Windows PCs with the Windows media components installed.
- Both devices must share a LAN or have an existing reachable private network route. Automatic internet traversal and a managed public relay are not implemented.
- Local accounts, contacts, rooms, and cursor activities do not establish an online messaging service or synchronized media room.
- This is a development preview. See each release's validation results and limitations; installation or build success does not establish sustained visible playback, audible sound, or every device/input combination.

## Debugging

The source checkout also includes a one-click **Update connected devices.cmd** that fetches the latest clean source, builds matching Windows and Android apps, and updates this PC and authorized connected Android devices. Developers can select local edits explicitly. Emulators require an explicit option. The downloaded bundle's command installs the exact APK included in that bundle.

Do not include invitations, addresses, private media, typed input, or raw device logs in public reports.

## Website maintenance

GitHub Pages publishes this repository's `main` branch from `/`. The page uses static HTML and CSS, loads no JavaScript, and needs no build step. Push reviewed website changes to `main` to deploy. Keep `.nojekyll` in the root.

The page contains native Windows screenshots, platform downloads, setup instructions, a portable-install guide, and a compatibility table. Screenshot links open the original image files. Captions identify the development build and distinguish interface appearance from streaming validation.

The page uses near-black surfaces, green primary actions, square controls, and locally hosted Inter. Screenshots retain the native app's colours. Decorative signal-line motion is finite and disabled on small screens and when reduced motion is requested. The font license is in `assets/INTER-LICENSE.txt`.

The public page's file set is `index.html`, `styles.css`, `.nojekyll`, and these files under `assets/`: `og.png`, `mark.svg`, `inter-latin.woff2`, `INTER-LICENSE.txt`, `windows-share.png`, and `windows-compact.png`. Keep the repository README and application license files alongside them. Review this explicit set when staging from the separate application source checkout.

Download links are pinned to one matching preview release and do not require a GitHub API request. Before publishing a new preview, verify every downloadable asset and checksum, then update all platform links, version metadata, and release notes together. macOS, Linux, and iOS downloads are unavailable.

## Validation

Serve the repository root with a local HTTP server to review the page; no package installation or build is required.

The repository's `tests/check-site.cjs` provides static-page browser checks. Install its development dependencies to run them:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
npm test
```

`npm run check` checks the test script's syntax. The browser suite exercises Chromium, Firefox, and WebKit at 320, 390, 768, and 1440 pixels, with JavaScript disabled. It checks image loading, horizontal overflow, keyboard links to full-size screenshots, and enlarged text. It also runs Axe WCAG A/AA checks in Chromium at 390 and 1440 pixels. Screenshots go to ignored `test-results/`.

A September 7, 2026 check of the staged static page used fresh headless Microsoft Edge at 360, 768, 1280, and 1920 pixels. It passed checks for horizontal overflow, missing fragments or resources, native screenshot dimensions, font loading, exact public download targets, keyboard operation of the portable guide and skip link, and reduced motion. Screenshots were inspected at all four widths. The reviewed source and staged page matched, and their hashes remained stable during that run.

Repeat these checks after changing the page, and verify deployed files and download availability after publishing. The recorded browser checks were local; they did not establish remote release-asset availability, native streaming performance, physical-device usability, or assistive-technology acceptance.
