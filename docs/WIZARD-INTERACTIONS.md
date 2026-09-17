# Wizard conversation and tips

13 September 2026. This implements the owner's request for an official, fun
product mascot with witty, understandable writing. It supersedes the earlier
direction to make the visitor the target of a menacing wizard.

## Behaviour

- The first left-click welcomes the visitor. Subsequent deliberate clicks rotate
  through six conversational remarks. Closely spaced clicks use two mild poke
  responses. Activations less than 650 ms apart leave the current line readable.
- Right-click rotates through four practical screen-sharing tips and gives the
  wizard a small thoughtful tilt. It no longer represents pain or threatens a
  transformation. Rotation continues after a pause and after exhausting the pool.
- **Ask for a tip** is a visible button with the same behaviour for keyboard and
  touch users. It appears only after the interaction script successfully loads.
- The bubble remains fully visible for eight seconds, then fades for 260 ms and
  becomes hidden. A new reply restarts that dwell period. Escape or a pointer
  press outside the wizard and its controls dismisses it immediately.
- A new reply is scrolled into view only if the sticky header or viewport edge
  obscures it. Speaking during a drag never scrolls the page.
- Shift-right-click leaves the browser's context menu available. Context menus
  elsewhere on the page are unaffected.
- Both shuffle bags avoid an immediate repeat when refilled. A dedicated,
  initially empty live region announces the text separately from the visual
  bubble and is cleared when the bubble hides. Reduced motion retains the dwell
  period, then hides without the fade animation.
- Existing hold and drag gestures remain, with gentler wording. Cancellation or
  lost pointer capture releases the drag. Empty hat, beard and orb pools use
  ordinary conversation; they are not padded to meet a quantity target.

## Voice and complete pool

The wizard is welcoming, mildly vain about his portrait, occasionally petty,
and capable of giving useful advice. Magic may serve an understandable purpose.
It must not be an excuse for random nouns, unexplained danger, imaginary product
capabilities, or insults aimed at a visitor who accepted our invitation to click.
Modern product vocabulary is allowed. Useful gesture feedback need not pretend
to be a joke. Do not restore the old “Ser-Vur” vocabulary or threat pool.

17 September 2026 (per [AGENT-BRIEF-site-modernization.md](AGENT-BRIEF-site-modernization.md)):
the wizard is now a deadpan archmage who treats screen sharing as humble craft.
Every joke is a true fact about FastCast in a robe (no hosting, no account,
relay as fallback, unsigned installer, encryption, no platform switch). The
banned register ('tis, behold, mortal, generic fantasy quips) is not used.
There are **22 lines**.

| Interaction | Exact wording |
| --- | --- |
| First click | Hello. The download is free. I came with it. |
| Conversation | I do not host your screen. I merely point at it. |
| Conversation | No account. My circle requires only two devices and one invitation. |
| Conversation | The relay is a last resort. Even portents need a backup plan. |
| Conversation | I have read the terms of service. There were none to read. |
| Conversation | The installer is unsigned. Verify the checksum; trust is a spell with components. |
| Conversation | Windows casts, Android watches. Neither asks me who you are. |
| Conversation | Your group can stay in its own tavern. I only carry the picture. |
| Conversation | I encrypt everything. Not from paranoia. From habit. |
| Repeated clicks | Once is a summons. Six times is a denial of service. |
| Repeated clicks | Still here. Nothing in this preview despawns. |
| Hold | You are holding down a wizard. The stream, at least, holds on its own. |
| Hold | Very well. We ponder together. |
| Far drag | Any farther and even I would need the relay. |
| Right-click / tip button | Check which window you're sharing before you begin. Full screen shares everything. |
| Right-click / tip button | Same version on both devices. Mismatched builds are the most common curse. |
| Right-click / tip button | Guest Wi-Fi often isolates devices that share a name. Try your own network first. |
| Right-click / tip button | Point at what you mean. 'Over there' is a large part of a screen. |
| Right-click / tip button | When reporting a bug, say what you clicked and what happened. 'It broke' is not a spell. |
| Right-click / tip button | Give your friend a moment to read before you switch windows. |
| Drag | Moving me does not move the stream. Mind the hat. |
| Drag | I would have teleported, but you've already got me. |

The tips restate the home page's own troubleshooting: avoid accidental
disclosure, match versions, avoid guest-Wi-Fi isolation, point clearly, report
reproducibly, allow time to read. Conversation lines state only facts the site
already documents; none promises performance or platform support beyond that.
The earlier 18-line pool is recorded in git history (`e6630bf`).

## Implementation and verification

14 September 2026 UTC: light tip wording pass. Removed the repeated shared-view
check and the strained backseating line; shortened the reading reminder and
asked for both the action and result in the troubleshooting tip. Conversation
and gesture responses are unchanged. Build, syntax/release/contrast checks and
the complete Chromium, Firefox and WebKit suite passed, including tip rotation,
keyboard/touch, enlarged text and accessibility. Only this document, the text
generator and generated homepage changed in the copy pass. Rebasing onto the
completed preview 7 website publication also required updating the feature-row
test to compare names and statuses against the release manifest, which now has
20 rows and no Limited entries. No application release was
promoted by this wording change.

`scripts/build-site.py` owns the text and emits the JSON island in `index.html`.
`src/pages/index.html` owns the controls and announcement region; `site.js` owns
gesture handling and rotation; `styles.css` owns the tilt and control styling.
The historical archive remains a frozen review of baseline `f33d0a6`, not the
current pool and not a source to merge back into the generator.

The browser acceptance suite exercises entire conversation and tip cycles,
shuffle boundaries, rapid activation, keyboard and touch access, dismissal,
context-menu pass-through, reduced motion and accessibility with the tip visible.
Existing layout, no-JavaScript, navigation and drag-boundary checks remain.
Automated live-region checks do not establish actual screen-reader announcement
behaviour; a real screen-reader session is still unverified.

Verification of the preceding 19-line pass: build rendered 15 pages; generated JSON exactly matches
the 19 source strings and this document. JavaScript syntax, release invariants,
local and public-download links, contrast, bandwidth tests, and `git diff --check`
passed. The full browser suite passed in Chromium, Firefox and WebKit, including
the new interaction tests, layouts at 320/390/768/1051/1152/1440, reduced motion,
keyboard/touch, enlarged text, no-JavaScript paths and axe at 390/1440. Visible tip
checks additionally cover 320/1440 at enlarged text size. Chromium captures at
320/390/1440 were visually inspected after fixing a sticky-header obstruction.

Changes remain local. Separate status-badge and FAQ-symbol stylesheet edits
appeared during the work and were preserved; they are outside this mascot pass.
No commit or deployment was made.

Wizardposting follow-up verification: rebuilt 15 pages; only `index.html` changed
relative to the page files at the start of this copy pass. All 23 exact strings
match the generator, emitted JSON and table above. Release and link checks and
`git diff --check` passed. The full browser suite passed again in all three
engines, including all nine conversation lines and all six tips, accessibility,
keyboard/touch and enlarged-text layouts. A fresh 320px tip capture was inspected.
The historical archive and interaction behaviour were not changed by this pass.

Subsequent owner review: the lunch/ceremonial-robes line was rejected and replaced
with “I showed my apprentice his future. He asked to reload an earlier save.”
[HOMEPAGE-EDITORIAL-REVIEW.md](HOMEPAGE-EDITORIAL-REVIEW.md) explains the defect,
identifies the weakest remaining lines, and ranks the homepage's copy and layout
problems. The pool is still 23; the rest of that review's writing recommendations
have not been applied.

## Focused follow-up

Cut the doorway, incident and thumbprint jokes; removed forced punchlines from
two practical tips and kept the casting-screens reference without its unrelated
neighbours joke. The current pool has 20 lines, including six conversation lines.
Earlier verification records below the pool describe their original snapshots.
