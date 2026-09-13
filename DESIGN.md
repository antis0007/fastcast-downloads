# FastCast website design and evidence

## Current direction — September 13, 2026

The owner retained the wizard redesign and explicitly rejected the pass that
shrunk him beside a small app capture. Keep the large wizard as the hero's
signature. Give the actual product a full-width section immediately afterward.
This section governs the current pass; earlier entries below are history.

- Keep the existing "The shortest path between your screen and theirs" headline,
  warm charcoal/paper surfaces, amber identity, and optional interactive wizard.
- The large wizard and animated rune scene sit beside the headline. Keep the
  opening to a product sentence, downloads and concise installation context.
  Preserve the exact curated dialogue pool and reduced-motion support.
- The real Windows capture occupies the full content width in the next paper
  section. It should be readable and inspectable, followed by three concise
  explanations of capture scope, audio and input permissions.
- Scale the header artwork by height with its natural aspect ratio. Use the
  header row's vertical space and retain a legible wordmark on phones.
  The wordmark's source includes empty lower padding: crop that padding in CSS
  so the lettering fills the row. Let it shrink with the available phone width;
  place navigation on a second row below 1050px so it never crowds the brand.
- Show release/date, platform roles and signing beside downloads. Use the
  reviewed release record for platform names, package facts and evidence labels.
- Use one viewer-first setup explanation with separate watching/sharing entry
  points. Keep detailed qualification notes in labelled disclosures beside the
  relevant controls and downloads, with links to the complete evidence.
- Explain feature inclusion separately from evidence. Multi-viewer support is
  experimental and loopback-tested; physical multi-device sharing is unqualified.
- Existing screenshots are September 7 development captures. No side-by-side
  session video is published in this checkout; do not invent a play button or
  label an interface screenshot as transmission-quality evidence.
- Preserve the expanded connection page and its direct/relay comparison.
  Downloads and getting started remain the first-session continuation.
- Keep the static architecture, existing URLs, optional scripting and current
  font assets. This pass adds no dependencies, generated artwork or app changes.

Research inputs: the owner's supplied design plan; the direct product/download
presentation on [Flow Launcher](https://www.flowlauncher.com/), the
media-inspection emphasis on [Parsec](https://parsec.app/), the recognizable
identity on [Charm](https://charm.land/), and the route/ownership explanation on
[RustDesk](https://www.rustdesk.com/), reviewed September 13. These informed page
priorities, not claims of feature or performance parity.

The owner's competitor reviews also informed the revision: expressive scale
from [Zen](https://zen-browser.app/), generous product presentation from
[Screen Studio](https://screen.studio/), and recognizable product personality
from [Transmit](https://panic.com/transmit/). Their current public pages were
checked September 13. The resulting hierarchy is wizard → inspect the app →
setup → connection → downloads → FAQ. Do not revert to the rejected small-wizard
composition or add a standalone evidence essay ahead of the product.

## Historical directions and validation

The following entries are preserved as history. In particular, the earlier
cyan-selection language is superseded by the current amber identity.

## Current direction — September 11, 2026

The homepage is a single landing funnel (hero → roles → setup → the app → the route → what ships → help → download) rather than a numbered editorial scroll. Amber (`#efac4c`) is the only accent colour; the native app's Cyan stays inside the screenshots and is never reproduced as site chrome, so nothing competes with the product UI. Warm near-black (`#171815`) alternates with full-bleed warm-paper sections for the parts that show or inspect the product. The casting theme lives in the brand voice ("Screen sharing with a little magic and careful networking") and in the visuals — a wizard mascot standing inside a rune circle with rising embers and a starfield, and a direct-route diagram with an honest tower fallback — while every instruction stays in plain language (invitation, route, permission, relay, diagnostics).

The brand is an illustrated wizard mascot casting a screen. `assets/fastcast-wizard.webp` (the figure) and `assets/fastcast-wordmark.webp` (the lettering) are split from the supplied logo lockup; `fastcast-logo.webp` keeps the stacked original. The wizard carries the header and footer lockups, stands inside the rune circle in the hero, and appears as the class portrait in the tabletop band. The wizard artwork is drawn with a dark outline, so wherever it sits on the dark ground it needs an amber halo to keep its silhouette legible. The rune circle is a default motif: the full Elder Futhark alphabet on the outer ring and a sparser counter-rotating subset inside, generated by `rune_circle()` in `build-site.py` so density is a count rather than hand-placed markup. Density thins as the canvas shrinks — every third glyph drops below 760px, every second below 520px, then the inner ring goes — so the seal stays readable instead of muddy on small screens. Both the seal and the embers are decorative, `aria-hidden`, and stop under `prefers-reduced-motion`.

The tabletop band is deliberately tongue-in-cheek and is the one place the theme is allowed into prose: class features, components, concentration, cantrip, familiar, spellbook, orb and wand. Every joke hangs off a literal product noun (invitation, diagnostics, the viewing device, the absence of a relay), so the humour never replaces an instruction.

The website explains today's Windows/Android screen-sharing preview and the smaller-group direction. It does not advertise full Discord or Teams replacement parity. Free/no-subscription wording describes the current offer. Screenshots show the development interface, newer than the public 0.3.1 preview, and establish appearance rather than native streaming reliability.

## Alternatives reviewed

The earlier direction review compared an illustrated social-app page, a plain utility page, and a black/green product showcase. The social illustration depended on fictional scenes; the utility page lacked hierarchy. Black/green retained the original site's identity. Three challengers followed: retro terminal styling was too technical; aurora/glass competed with the interface; a restrained editorial layout improved reading order and was retained.

For this refinement, three accent variants were rendered with the same real native screenshot:

- Default Cyan: selected. Actions, screenshots, and diagrams share the app's visual language.
- Phosphor green: retains the old site's charm, but creates a competing accent beside the default blue app.
- Amber: legible and distinct, but reads like a warning colour and gives the product less visual continuity.

The resulting design keeps dark signal-line decoration from the earlier site, with a calmer blue editorial layout. Decorative lines are not telemetry. Motion is finite, reduced-motion aware, and disabled on narrow screens.

Structural references: [Discord](https://discord.com/) for clear social purpose and direct downloads, and [Signal](https://signal.org/) for straightforward product explanations. These are references for visitor tasks, not claims about FastCast features.

## Information architecture

Home introduces the implemented app and offers direct Windows and Android downloads. Product, Downloads, Getting started, Platforms, Community, Help, Releases, Privacy, and the custom 404 retain distinct practical purposes. Four transparency pages answer additional questions:

- Why FastCast: why independence from large platforms matters, what people can try today, and what remains future work.
- How it works: the peer media route, the viewer's role, who provides each resource, and connections beyond the media path.
- Bandwidth: a controllable, constant-rate video-payload estimate with endpoint and hypothetical relay accounting.
- Data and privacy: source-linked Discord data categories, historical platform-wide message scale, and selected retention periods with their actual triggers.

Navigation, downloads, screenshots, and FAQs work without JavaScript. The calculator has a fixed example and exact table without JavaScript; enabled controls support keyboard use and announce updated results. No analytics, remote fonts, browser persistence, runtime frameworks, or billing forms were added.

## Claims and sources

Network traffic is not retained personal data. The calculator uses decimal GB = Mbps × minutes × 0.0075, excludes overhead and audio, and describes one sender/viewer. Both endpoints transfer the same video payload. A hypothetical relay receives and forwards it; provider billing varies. This is neither a benchmark nor a claim that FastCast reduces a user's traffic relative to Discord.

Discord's [engineering report](https://discord.com/blog/how-discord-stores-trillions-of-messages) describes trillions of messages by early 2022. This is historical platform-wide scale, not a present total, a per-user estimate, or call recording. The [privacy policy](https://discord.com/privacy) and [retention explanation](https://support.discord.com/hc/en-us/articles/5431812448791-How-long-Discord-keeps-your-information) were checked September 7, 2026. The page includes relevant limits: Discord says it does not sell personal information and generally does not retain call contents. Selected retention bars use a common five-year scale, explicitly distinguish record types and triggers, and do not suggest all user data has the same retention period.

FastCast's narrower scope is stated beside the comparison. There is no fabricated zero-versus-trillions graphic, testimonial, user count, security certification, or fictional community demo. Local records, GitHub requests, other network providers, and recipient recording remain visible in the explanation.

## Critical review before commit

Review criteria: Can a visitor understand the current product, assess the independence argument, inspect the real app, choose a supported download, start a session, and understand the costs without reading internal project history?

The pass tightened the hero and reading widths, replaced the competing green accent with native blue, removed the operating-system title bar through fresh client-area captures, added practical transparency pages, and separated traffic from storage in both wording and visuals. Mobile screenshots and desktop diagrams were inspected. A narrow-screen overflow at 200% root text size was found and fixed in the payload summary; the full layout suite then passed.

Validation: all fourteen pages in Chromium, Firefox, and WebKit at 320, 390, 768, and 1440 pixels, with enlarged text, loaded images, and no script errors. No-JavaScript downloads, image navigation, FAQs, and calculator example passed. Keyboard image dismissal/focus restoration, FAQ search/reset, Android download selection, calculator minimum/maximum/reset/keyboard behaviour, and automated accessibility at 390/1440 passed. Formula tests cover units, valid bounds, and invalid inputs. Local links and four published download URLs were checked.

These checks support the website's usability and accuracy. They do not establish physical-device acceptance, screen-reader usability, native media reliability, enterprise readiness, or what prospective users actually prefer. A recorded genuine sharing session and observed first-time setup remain useful next evidence.
