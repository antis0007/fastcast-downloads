# FastCast website and small-group experience

Reviewed September 7, 2026. This document describes the website and its local concept demo. It does not claim that the collaborative backend is implemented.

## Product direction

The center of the product is a conversation with an attached session: see your friends, read and reply, watch quietly or join, share something, and find it later. The audience is a small group of people who already know each other. The website presents that direction while separating it from the downloadable Windows/Android screen-sharing preview.

Patchbay supplies the concrete information architecture: Home, General, Media, Plans, and Files. FastCast supplies the native visual contract: charcoal surfaces, Cyan/Amber/Phosphor accents, square controls, readable prose, and restrained monospace metadata. No group/category/channel cascade is required in the demo. On narrow screens, the five destinations reflow into visible navigation rather than disappearing into a drawer.

## Reference comparison

These are design judgments drawn from the referenced public pages and the existing Patchbay prototype, not measured comparative usability results.

| Reference | Useful pattern | FastCast application |
| --- | --- | --- |
| [Discord](https://discord.com/) | The central story is friends spending time together: conversation, watching, and joining casually. | Lead with the group; keep a session attached to conversation and separate watching from joining. |
| [Signal](https://signal.org/) | Explain communication benefits plainly and make platform availability clear. | Readable copy, deliberate participation, explicit download/support information; no borrowed privacy or security guarantees. |
| [Element](https://element.io/en) | Communication and collaboration share a coherent product story. | Keep files, plans, and conversations connected while targeting a smaller, simpler group model. |
| [Linear](https://linear.app/) | Product examples explain workflows instead of relying only on feature slogans. | The hero is an interactive conversation with functional local state and concrete objects. |
| [Raycast](https://www.raycast.com/) | Recognizable tasks and controls give the product a distinct identity. | Direct Watch, Join, Share, and Leave controls; native FastCast colors and typography. |
| [LocalSend](https://localsend.org/) | Purpose, setup, and platform support are easy to identify. | Keep the supported sender/viewer combinations and setup steps near downloads. |
| [Tailscale downloads](https://tailscale.com/download) | Platform-specific installation paths are explicit. | One direct Windows download and one direct Android download, plus the matched bundle. Unsupported platforms have no misleading buttons. |

## What changed

- Replaced the decorative particle demo and duplicate screen mockups with a conversation-first community concept.
- Removed the standalone screen/viewer selection sequence from the primary demonstration. Sharing uses an inline choice of two sample sources, with no nested menus.
- Preserved the meaning of channels, media, plans, and files. A sample file returns to its originating conversation or plan.
- Added bounded local message composition, per-channel drafts, a sample RSVP, and session continuity across navigation. Input is rendered as text, never interpreted as HTML.
- Made all everyday actions visible and usable with keyboard and touch. No hover-only controls, automatic microphone activation, or global motion loop.
- Reorganized the remaining page around the product direction, current downloads, setup, compatibility, and a bandwidth calculator with explicit assumptions.
- Removed the hypothetical relay-savings graphic. The retained graph responds to bitrate and duration on a stable vertical scale that expands for larger values.
- Hosted the shared Inter font locally and retained its license. No production JavaScript framework or analytics dependency was added.

## Reality and validation

The group is fictional. Messages and drafts stay in the page's memory, reset on reload, and are not delivered remotely. Community presence, plans, shared files, and group sessions remain product direction. Download links point to the existing 0.3.1 Preview 1 screen-sharing packages.

The browser suite covers Chromium, Firefox, and WebKit; 320/390/768/1440-pixel layouts; desktop and phone-sized 200% text; phone landscape; keyboard operation; reduced motion; no-JavaScript access; and key community interactions. Automated accessibility scans cover Chromium phone and desktop layouts. Screenshots are reviewed as part of the development pass. These checks do not prove real phone keyboard behavior, screen-reader usability, native playback, or a working communications service.

The next usability check is a small friend-group task session: find a shared screen, watch without joining voice, reply while watching, locate a file, and return to the conversation. Record completion and confusion rather than declaring the design perfect.
