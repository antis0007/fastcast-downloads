# FastCast downloads

FastCast is building a shared place for small groups: conversations, screens, files, and plans. The downloadable development preview currently provides Windows screen sharing to Android or another Windows PC.

[Visit the website](https://antis0007.github.io/fastcast-downloads/) · [Browse downloads](https://github.com/antis0007/fastcast-downloads/releases)

This public repository contains the website, release notes, and downloadable previews. Application source is maintained separately.

## Download

[Download FastCast 0.3.1 Preview 1](https://github.com/antis0007/fastcast-downloads/releases/tag/v0.3.1-preview.1)

[Browse all releases](https://github.com/antis0007/fastcast-downloads/releases)

- [Windows installer](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.1-preview.1/FastCast-0.3.1-preview.1-Setup.exe)
- [Android APK](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.1-preview.1/FastCast-0.3.1-preview.1-Android.apk)
- [Windows + Android portable bundle](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.1-preview.1/FastCast-0.3.1-preview.1-windows-android-x64.zip)
- [SHA-256 checksums](https://github.com/antis0007/fastcast-downloads/releases/download/v0.3.1-preview.1/SHA256SUMS.txt)

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

The source checkout also includes a one-click **Update connected devices.cmd** that fetches the latest clean source, builds matching Windows and Android apps, and updates authorized connected Android devices. Developers can select local edits explicitly. Emulators require an explicit option.

Do not include invitations, addresses, private media, typed input, or raw device logs in public reports.

## Website maintenance

GitHub Pages publishes this repository's `main` branch from `/`. The website uses static HTML, CSS, and JavaScript with no build dependencies. Push reviewed website changes to `main` to deploy. Keep `.nojekyll` in the root.

The interactive community concept starts in #General with five visible destinations: Home, General, Media, Plans, and Files. Watch silently, Join conversation, Share a screen, and Leave are direct actions. Drafts, local messages, sample RSVP, and session state survive navigation within the tab and reset on reload. The demo keeps at most 16 locally composed messages per channel, with a 500-character message limit. Nothing is sent to another person. Sample files are explicitly labeled and downloadable.

Chat, group presence, shared files/plans, and group sessions are product direction demonstrated locally, not shipping collaboration services. The demo never requests microphone, camera, or screen permissions. The calculator reports mathematical video payload estimates, not benchmarks. Motion is opt-in, pauses offscreen, and respects reduced-motion settings.

The site uses FastCast's native charcoal/Cyan, Amber, and Phosphor color roles with square controls. Inter is hosted locally; its license is in `assets/INTER-LICENSE.txt`. Website navigation, platform downloads, setup instructions, and compatibility information remain usable without JavaScript.

Download links are pinned to one matching preview release and work without JavaScript or a GitHub API request. When publishing a new preview, verify every asset and checksum before updating all platform links, sizes, version metadata, and release notes together. macOS, Linux, and iOS downloads are unavailable.

## Validation

No build is needed to serve the page. Development-only dependencies provide repeatable browser checks:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
npm test
```

The test script starts an isolated local server, exercises Chromium/Firefox/WebKit at 320, 390, 768, and 1440 pixels, checks keyboard operation, draft/session/file/plan behavior, text-only message rendering, 200% text, landscape, reduced motion, and no-JavaScript downloads. Axe checks WCAG A/AA rules on Chromium desktop and phone layouts. Screenshots and results go to ignored `test-results/`. Browser emulation is not physical-device or assistive-technology acceptance.
