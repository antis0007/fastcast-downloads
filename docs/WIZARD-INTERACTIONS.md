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

There are **18 lines** after the light tip edit. Occasional
slang and a casting-screens callback are now intentional. Each new joke supplies
its own situation: grass collected as a specimen, research that turns into shed
videos, and wanting to reload a foretold future. These are individual additions, not a restoration of the caption archive.

| Interaction | Exact wording |
| --- | --- |
| First click | Hello. I was hoping someone would interrupt the posing. |
| Conversation | I use Mage Hand to turn my rival's pages before he's finished. |
| Conversation | I summoned a demon to hold my ladder. It offered me a kingdom. I pointed at the ladder. |
| Conversation | I told my apprentice to touch grass. He brought a sample back for identification. |
| Conversation | My apprentice borrowed the orb for 'research'. He watched a man build a shed for six hours. |
| Conversation | I showed my apprentice his future. He asked to reload an earlier save. |
| Conversation | We love casting screens. |
| Repeated clicks | You needn't knock between every sentence. |
| Repeated clicks | You can stop checking. I haven't despawned. |
| Hold | Are you... holding my hand? |
| Hold | All right, we can ponder together. |
| Far drag | A little closer to the circle, please. I was just getting comfortable. |
| Right-click / tip button | Check which window you're sharing before you begin. |
| Right-click / tip button | Point to what you're explaining. 'Over there' covers rather a lot of screen. |
| Right-click / tip button | When something goes wrong, say what you clicked and what happened. 'I angered it' is a little vague. |
| Right-click / tip button | Give your friend a moment to read before you switch windows. |
| Drag | Oh, we're moving. Mind the hat, please. |
| Drag | I would have walked, but you've already got me. |

The tips have a literal purpose: avoid accidental disclosure, point clearly,
describe a reproducible problem, and allow time to read.
They make no promises about encryption, routes, performance, or platform support.
The two retained magic stories give the spells a practical or recognisably petty use. None of this is
an objective claim that the jokes are funny; editorial taste remains a judgement.

## Implementation and verification

14 September 2026 UTC: light tip wording pass. Removed the repeated shared-view
check and the strained backseating line; shortened the reading reminder and
asked for both the action and result in the troubleshooting tip. Conversation
and gesture responses are unchanged. Build, syntax/release/contrast checks and
the complete Chromium, Firefox and WebKit suite passed, including tip rotation,
keyboard/touch, enlarged text and accessibility. Only this document, the text
generator and generated homepage changed. No application release was promoted.

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
