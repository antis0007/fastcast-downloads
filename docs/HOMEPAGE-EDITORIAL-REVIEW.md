# Homepage review: weak writing and misplaced information

13 September 2026. Reviewed the current local generated homepage, its template,
release manifest, wizard pool, and fresh Chromium captures at 390 and 1440 pixels
wide. This is not a review of the live deployment or new application testing.

## Changes made in this pass

The rejected line was:

> A friend sent 'behold' and a picture of his lunch. I'd already put on the ceremonial robes.

The costume is invented solely to force a contrast. “Behold” does not establish
an occasion that calls for ceremonial clothing, so the reader has to supply the
reason the speaker behaved that way. Naming lunch makes the scene concrete but
does not make it convincing or funny. My previous explanation confused those
things.

It is replaced in the generator, built homepage and current interaction document:

> I showed my apprentice his future. He asked to reload an earlier save.

This uses a recognisable response to an unwanted outcome: wanting to undo it.
The game reference follows from the fortune-telling situation. It is still a
small joke, not a claim that this is now a benchmark line. The pool remains 23.

The mobile capability-table caption was also fixed. The table and rows switched
to block layout, but the caption retained table-caption layout and shrank into a
narrow column. It now occupies the full table width. A width assertion was added
to the existing browser suite. The larger recommendations below are **not yet
implemented**; unrelated working-tree changes were preserved.

## The weakest remaining wizard writing

These judgements supersede my earlier praise of these particular lines. A complete
setup and payoff, or a recognisable meme reference, is not sufficient by itself.

| Priority | Current line | What is weak | Recommendation |
| --- | --- | --- | --- |
| 1 | Check which window you're sharing. 'Behold my secrets' is a poor opening for a surprise-party spreadsheet. | The useful warning is buried under an invented quotation, a party and a spreadsheet. The phrase “poor opening for a spreadsheet” is particularly unnatural. | Keep the window-check advice in plain language. Do not require every tip to finish with a joke. |
| 2 | We love casting screens. The neighbours have asked us to love it before ten. | The callback is deliberate, but the curfew is an added generic noise joke. The line never establishes that he was shouting. | If the callback stays, let it be an occasional short meme tag. Drop the explanatory neighbour story rather than adding more premises. |
| 3 | The hat was meant to make me look taller. Now I have to duck through doorways. | A taller hat needing more clearance is the expected physical consequence. The wording offers no particularly revealing response to it. | Cut rather than searching for another elaborate doorway ending. |
| 4 | I spent an hour trying to dispel a curse on the orb. It was a thumbprint on the glass. | “Expert overlooks obvious dirt” is an old mistake joke. The curse has no symptom and the hour exaggerates his incompetence without making it more interesting. | Cut unless there is a better, specific observation behind a future version. |
| 5 | My apprentice has started putting dates on his notes. Apparently 'before the incident' wasn't helpful. | Dating notes is sensible; the joke depends on the stock unnamed “incident.” The second sentence largely explains the first. | Retire it. Another word for incident would not solve the problem. |
| 6 | Before explaining the problem, check that your friend can see it. Even an oracle appreciates a clue. | The instruction is useful. The oracle closer is a generic mascot flourish that contributes little. | Keep the instruction; remove the flourish if it is not earning its space. |

The shed-video line is modest recognisable behaviour, not a standout joke. The
touch-grass/specimen line has a clearer literal misunderstanding. Neither should
become a template for ten new apprentice anecdotes. The practical “Over there”
and “I angered it” tips already have a reason to exist even if they only raise a
small smile. The permission to use wizardposting remains in force; this review
does not reinstate the old ban on modern vocabulary or meme references.

## Homepage priorities

### 1. Explain the preview's practical limits near the first download

The top bar says **Development preview**, which is useful. However, the hero's
direct download buttons appear before the local-network testing qualification or
the unsigned/debug-signed installation details. “Direct first, relay fallback”
describes routing, but is easy to read as reassurance about Internet readiness.
The later connection section explicitly says that unrelated-network playback is
unqualified.

Proposed action: put a compact qualification and install-guide link beside the
hero actions. For example: “Start with both devices on the same network. Playback
between separate networks has not yet been verified. Read the preview install
notes.” Preserve the direct downloads for experienced visitors. Do not add a
large warning panel or repeat the entire release ledger there.

This recommendation follows the repository's current release evidence; it is
not a new assessment of the binaries or running relay.

### 2. Show the product before asking visitors to study setup

Measured on the current page with a 1000-pixel viewport height:

| Measurement | 390px wide | 1440px wide |
| --- | ---: | ---: |
| Hero height | 917px | 820px |
| Setup section starts | 1278px | 1077px |
| First app screenshot starts | 2365px | 1898px |
| Full page height before caption repair | 9414px | 6944px |

The visitor sees a large mascot, platform facts repeated in a strip, and two setup
cards before seeing the application. That makes the homepage resemble an
installation manual before it has demonstrated the product.

Proposed order: **hero → real app screenshot and a concrete use case → compact
setup → capabilities and preview limits → detailed connections/help/downloads**.
Keep the large wizard the owner prefers. Moving the existing product section is
more useful than shrinking the mascot again or inventing a fake session demo.
Retain the screenshot's September 7 development-build disclosure: the manifest
explicitly says it does not represent the public release exactly.

### 3. Separate “included” from “verified” where the claim is made

The prominent audio row says **“The sending PC's sound travels with the picture”**
and marks it **Available**. Much later, the ledger says audible output on a phone
was not independently confirmed. The manifest defines Available as included in
the package, but that is not what an ordinary visitor necessarily infers from
the badge and present-tense description together.

Proposed copy near the audio control: “Computer audio is included. Audible
playback on a phone has not yet been confirmed.” Preserve the underlying status
and evidence; do not quietly promote or demote features based on an editorial
preference. Microphone and remote input need equally clear local qualifications.

### 4. Translate the internal testing vocabulary

The limitations are important. Their present wording often sounds like release
engineering notes pasted into public copy.

| Current wording | Proposed public wording |
| --- | --- |
| Internet playback remains unqualified | Playback between separate networks has not yet been verified. |
| Physical voice, echo, and Android input are still unqualified | Voice, echo handling, and Android input have not yet been verified on real devices. |
| Up to eight viewers have loopback coverage; physical multi-device sharing remains unqualified | Automated tests cover up to eight viewers. Sharing with several physical devices still needs verification. |
| Decoded in the LAN run. Audible output on a phone was not independently confirmed. | Computer audio was decoded during the local-network test, but audible playback on a phone was not independently confirmed. |
| Included features and their testing status are listed below | Remove: the heading and table already say this. |
| Public-build support, from the published release and capability notes. | Remove this procedural caption or replace it with a useful explanation of the status labels. |

“Not verified” does not mean “never tested.” Keep that distinction. Preserve the
detailed evidence on the technical/product pages rather than deleting caveats
to make the homepage sound more confident.

### 5. Remove actual repetition, not every repeated noun

- The hero already states price, platforms and sender/viewer roles. The strip
  immediately below repeats those same points and occupies 192px on the measured
  mobile page. Remove or consolidate that strip first.
- “Why FastCast” spends two paragraphs saying that it is a separate screen-sharing
  app and not a complete messaging replacement. Combine these into one concrete
  reason to use it alongside an existing chat app. A use case such as showing a
  Windows application while talking in another app is more useful than repeating
  the product category.
- The connection lede, diagram and caption all explain the same direct-versus-relay
  choice. Keep the diagram and one explanation; let the link lead to the detailed
  routes. Accessible diagram descriptions are necessary and are not the redundant
  visible prose being criticised here.
- Platform and signing details at the actual download cards are useful at that
  decision point. Do not mechanically remove those just because the platform names
  occurred earlier.

### 6. The remaining visual problems are specific

- **Fixed:** the mobile capability caption wrapped nearly word by word. After the
  CSS correction it uses 366px of a 366px table at 390px, and 296px of a 296px table
  at 320px. It no longer needs a tall, narrow text column.
- **Do not redo indiscriminately:** the current mobile hero heading is 35.1px and
  the setup heading is 28.8px, with reasonable wraps in the fresh captures. The
  earlier complaint about massive mobile headings should not be used to justify
  another blanket typography reduction.
- **Still worth simplifying:** large section spacing, repeated introductions and
  the desktop headline's four-line wrap give the page a more ceremonial pace than
  a small utility needs. Start by removing duplicated sections and unnecessary
  hard line breaks; do not solve this by crushing paragraph spacing or shrinking
  the preferred wizard artwork.
- **Keep in perspective:** the speech bubble is a dismissible overlay and can
  cover nearby hero copy while active. The sticky-header visibility fix keeps its
  own text readable. That does not prove the whole hero composition is ideal.

## Evidence and implementation boundary

Source of truth inspected: `src/pages/index.html`, the current `WIZARD_LINES` in
`scripts/build-site.py`, `src/release.json`, the relevant rules in `styles.css`,
and rendered local pages. Fresh observations are saved in
`test-results/homepage-editorial-measurements.json`. Captures use the
`test-results/editorial-` prefix. Element captures can include the sticky header
as a screenshot artefact; that alone is not evidence of a layout defect.

Only the rejected wizard line and the mobile caption layout were fixed here.
The other six weak lines and the proposed homepage reordering/copy edits remain
recommendations. There was no broad redesign, change to product capability
claims, archive rewrite, commit or publication in this pass.

Validation completed: the 15-page build, exact source/generated-pool comparison,
release checks, local and public-download link checks, and diff whitespace check
passed. The full browser suite passed for Chromium, Firefox and WebKit, including
conversation/tip rotation, keyboard/touch, reduced motion, layouts and axe.
The newly added caption assertion was also exercised separately at
320/390/768/1440 in all three engines after the CSS edit. Its first attempt timed
out against the shared preview server; the repeated run against an isolated local
server passed all twelve combinations without overflow. Writing quality remains
an editorial judgement, not a conclusion drawn from these tests.

## Focused follow-up applied

Moved the existing interface section ahead of setup and removed the duplicate
platform strip, keeping the large wizard. Simplified the separate-app explanation
and translated homepage test terminology without changing the stated evidence.
Cut three weak conversation lines and trimmed forced endings from two tips.
The suggested extra hero note and broader visual changes remain unapplied.
