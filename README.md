# FastCast downloads

Share a Windows screen or window with an Android tablet, phone, or another Windows PC.

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

The interactive cursor demo runs locally in the browser; it does not capture or stream a screen. The bandwidth graphs calculate video payload from a constant bitrate and session duration; they are not performance measurements. Motion pauses offscreen and respects reduced-motion preferences.

Download links are pinned to one matching preview release and work without JavaScript or a GitHub API request. When publishing a new preview, verify every asset and checksum before updating all platform links, sizes, version metadata, and release notes together. macOS, Linux, and iOS downloads are unavailable.
