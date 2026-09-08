# FastCast website design and evidence

## Current direction — September 7, 2026

Use the native app's default Cyan accent (#6bc9ff), near-black surfaces, square controls, visible navigation, and unaltered native screenshots. Reserve blue primarily for actions, selected information, and diagram values. Identify the product with the illustrated gold lockup, wordmark, and caster art, and keep the flat gold geometric mark for favicon and other sizes below about 96 px. Keep paragraphs narrow enough to read comfortably, use consistent section spacing, and allow navigation and figures to reflow on phones and with enlarged text.

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
