# FastCast meme register — Ponder the Orb / wizardposting captions

Status: proposed. Nothing here is in the shipped site. The live product surfaces
are the speech-bubble pools in `scripts/build-site.py`; this document covers
**social captions and meme compositions**, which are a different surface with a
different voice. No caption below has been added to `WIZARD_LINES`.

Reference material: [Pondering My Orb][kym-orb] and [Shadow Wizard Money
Gang][kym-swmg] ("WE LOVE CASTING SPELLS") are confirmed entries on Know Your
Meme. I could not extract their body text through a fetcher — the pages return
navigation chrome — so the meme details are taken from the brief rather than
re-verified here.

[kym-orb]: https://knowyourmeme.com/memes/pondering-my-orb
[kym-swmg]: https://knowyourmeme.com/sensitive/memes/shadow-wizard-money-gang

## 1. Why this direction is better than the orb dialogue

The diagnosis in the brief is correct, and it is correct for a structural reason:
**the pool is a monologue and these memes have two people in them.**

The bubble wizard talks *at* a visitor who clicked him. Ninety lines of that
produces an employment situation, because a man alone with an orb can only
complain about his orb. Every weakness the last two review cycles found — creature
has demands, wizard threatens, object has opinions — is a symptom of one speaker.

These captions fix it by giving the magic a recipient. "Bro join my vision" needs
someone to join it. That is the product, and it is the thing ninety solo lines
could never say.

## 2. The register boundary — keep this clean

The meme voice and the in-product voice are different characters and must not
merge. Concretely, from the voice contract already in `build-site.py`:

| | Bubble pool | Meme register |
|---|---|---|
| Vocabulary | does not know *router*; calls a server a Ser-Vur | lowercase, "bro", "backseat", "build" |
| Slang | faces and modern slang capped at one in ten, one per sentence | unrestricted; it is the register |
| Speaker | one wizard, mid-click, no farewells | two wizards, in a call, mid-incident |
| Length | a speech bubble, one or two lines | a caption |

**If any of these get spliced into `WIZARD_LINES` they will fail that contract on
sight** — "my familiar walked across the sigil and now you can see my childhood"
trips the no-modern-words rule, and the phonetic-technology ban exists precisely
to stop the pool drifting toward caption voice. A future maintainer who finds
these captions in a markdown file next to the pool might reasonably promote one.
That is the failure this section is here to prevent.

## 3. The six compositions

### 1. Behold this bullshit — **use first**

The essential one, and the only composition that needs no second panel: the orb
is doing the work, and the caption is a reaction to its contents rather than to
the wizard's feelings. "brother you need to see what this goblin is doing" names
the product's actual reason for existing — *this is worth your attention right
now* — without saying "screen sharing" anywhere.

### 2. This is not a prophecy — **use second, strongest single post**

Stated as the brief's own best pick and I agree, for a reason worth recording:
**the joke is the tense.** A prophecy is recorded and can wait. Live view cannot.
The caption distinguishes the product from every asynchronous alternative in one
line, and it does it by being funny rather than by making a comparison claim the
site is careful never to make.

### 3. No mortal should witness this—except you — **use third**

The invitation is the punchline and that is the right shape. One watch item:
"get in call" is the only phrase in the six that would work identically for a
competitor, because it names a generic social action rather than a magical one.
If it needs a polish, spend it there — the first panel is doing the witchcraft
and the second should too.

### 4. The wrong window — **use, with an art constraint**

The joke is fine and the comic framing is right. The risk is the one flagged in
the brief, and this project already has a rule that covers it: `DESIGN.md` says
the site contains "no fabricated zero-versus-trillions graphic, testimonial, user
count, security certification, or fictional community demo", and the og image is
documented as "a generated typographic brand graphic, not a screenshot".

So: **draw it unmistakably as illustration.** Orb, not window chrome; speech
bubbles, not UI; a perspective and palette that no capture could have. The
"how to get soup out of beard" search must read as a wizard's absurd search, not
as a window FastCast opened. Presented as a screenshot it would imply a privacy
failure against a product whose transparency pages are its differentiator. Drawn
as a comic it is just a joke.

### 5. Infinite pondering — **second wave, not launch**

The sharpest caption in the set on the merits: "bro you're sharing the orb that's
watching your orb" is a joke about screen sharing *as a concept*, which is rarer
and better than a joke about a screen. It assumes the reader already knows what a
recursive preview looks like, so it lands harder on people who have used the
preview than on a cold feed. Post it after the first three have established the
premise.

### 6. Backseat divination — **use, and it is the most product-shaped of the six**

Two participants, one shared view, one social consequence. "just counterspell it"
/ "I SAID BEHOLD. NOT BACKSEAT." is the only composition where the magic is doing
something no ordinary app does — a prophecy you can be wrong about in real time,
in front of a friend.

## 4. Caption-level notes

### Lines carrying the direction

- `bro join my vision. the king is about to do something fucking stupid.`
- `Stop saying "indescribable horrors." Share your orb.`
- `I DID NOT LEARN CLAIRVOYANCE TO EXPLAIN THIS OVER TEXT.`
- `I said behold. Not backseat.`
- `This is not a prophecy. This idiot is doing it right now.`
- `The prophecy is view-only. Stop trying to change your fate.`
- `the ritual requires two wizards and one of them saying "wait watch this."`

The third is the best-constructed line in the whole submission, and worth saying
why so the trick can be reused: **"explain this over text" is the argument for the
product, made in the voice of a man who is too angry to be making an argument.**

### Lines that read as attitude rather than incident

Same standard the last cycle applied to the pool — a judgment where an action
should be:

- `You can see every possible future and all your advice is "dodge."` — good
  premise, and omniscience is wasted on generic backseating. A named bad decision
  would beat "dodge".
- `I opened a window between realms so you could watch. Not so you could critique
  my build.` — the first clause is enormous magic and the second is a build
  critique; the two halves are not yet the same joke.
- `I cast Shared Vision. You are now also responsible for knowing this.` — a
  consequence, but an administrative one.
- `I opened a window between realms` (above) and `I opened a window between realms
  so you could watch` are also structurally the same opener as
  `I cast Shared Vision`.
- `bro is not pondering. bro is spectating.` — a correction of a meme rather than
  a joke. It only lands for someone already holding "Pondering My Orb".
- `shared vision. separate bad decisions.` — a slogan. `DESIGN.md`'s bar would
  take it ("if a line would fit on a poster, it is not a joke").
- `my orb 🤝 your orb / watching this absolute nonsense` — the same slogan with an
  emoji standing where the joke should be.

### Repetition inside the submission

**"Forbidden knowledge" and "the abyss" do five duties across three batches:**

`forbidden knowledge. sending it to the boys.` ·
`Forbidden knowledge hits different when you recognise the desktop wallpaper.` ·
`The abyss stared back. I asked it to move its cursor.` ·
`BEHOLD THE SECRETS OF THE—` ·
`I have pierced the veil between worlds.`

This is the same pattern the pool was cut for last cycle: one premise wearing five
captions. The phrase is load-bearing in the first line, where it is the thing being
casually distributed to friends — that is the joke. In the other four it is set
dressing. I would keep one more at most.

### The Shadow Wizard callback

`WE LOVE CASTING SCREENS.` is the only line here whose source is an audio meme
rather than a caption style, and it is knowingly a remix. Two notes: the original
is "WE LOVE CASTING SPELLS", so the reference should stay legible enough that it
reads as a remix rather than an unattributed steal; and it should stay occasional
rather than becoming the account's voice, which the brief already says.

## 5. What this adds to the project

Worth recording plainly: **this is the project's first social surface.** The only
social asset today is `assets/og.png`, documented as a generated brand graphic.
The site itself deliberately contains no fictional community demo, no testimonials
and no invented conversations.

That means these posts are the first place FastCast would show the product working
between two people rather than describing it. The register split in §2 is what
keeps that from quietly becoming a claims problem: a meme is obviously a joke, a
comic drawn in orb-and-speech-bubble idiom is obviously illustration, and neither
is a product screenshot. A caption panel styled as a real capture would be the
first thing in this project to blur that line.

## 6. Additional compositions

Ten more, same shape as §3 and continuing its numbering from 7. The test applied
to each is the one §1 established: two people, or a consequence that only exists
because the view is live and shared.

What this batch adds is a change of protagonist. §3 is written from inside the
casting: the wizard is showing, complaining or being backseated at. Most of these
are written from the receiving end, which is where the audience for the account
actually sits. That shift is also why several of them are about attention rather
than about magic.

Three involve a third person (11, 14, 15), one is a single wide panel with no
strip at all (13), and two are built to be posted as replies rather than as
standalone posts (15, 16). Two are marked as stretches. Sections 1 through 5 are
unchanged; §3's title still describes §3.

### 7. The rewind argument — **use, and the most quotable of the ten**

A two-panel comic in which one wizard asks for the last few seconds again. Panel
one: `Wait. Go back.` Panel two, same pose, no change to the orb: `That was live.`
Panel three, quieter: `Go back.`

The joke is the argument, not either line. Every platform that can do a replay,
a clip or a timestamp has already trained this reflex, and live view is the one
format that cannot satisfy it — which is why the second panel is funny and the
third is funnier. The strength is in how the wizard says live: not in the
broadcast sense, but as the ordinary word for something that was real a moment
ago, which is exactly what a person says when he realises the moment he wanted is
gone. Two panels of round trip and one of silence, and the product's whole
distinction is on the page.

### 8. The late arrival — **use, cost of entry is one line of setup**

A third wizard joins the call after the good part. `what did I miss` / `he's
still doing it. you missed nothing. i can't catch you up because this is
happening.`

This is close enough to 7 that they should not run in the same week, and the
difference is the joke's subject: 7 is about controlling the view and this is
about the impossibility of a summary. It earns its place because the wizard
refuses the request rather than apologising for it. The refusal is the product
argument, delivered as a shrug. Watch one thing: the caption must not imply that
history exists and is merely awkward to reach, or it becomes a claim about
recording that nothing in the project supports.

### 9. Pointing at your screen — **use, comic art, and it is the register's best image**

Two wizards. One is watching the other's orb and points into it, at length, with
his own monitor behind him catching most of the gesture. `it's not yours.` /
`i know it's not mine. i'm showing you.`

A hand that has broadcast for years does not unlearn the gesture in front of a
window it does not own. That is a small, real, slightly undignified behaviour,
and the whole account is supposed to be built out of those. The second line is
the best in the batch because it is an explanation that explains nothing and does
not care. Slightly a stretch: the gag survives as an ordinary video-call joke,
which is the one criticism that applies here, so the art has to keep the content
inside the orb rather than behind the speaker.

### 10. The tidy lie — **use second wave**

Two wizards, one orb, one desktop that has been arranged. `tell me you cleaned
your screen` / `i tidied the orb.`

The audience for this joke is anyone who has ever closed a tab because a call was
starting, and it needs no explanation beyond that. It is a lie about presentation
rather than about content, which keeps it a joke about manners instead of
concealment — the caption names redecorating, not hiding. It cannot become a
caption about the orb protecting anything. If the art ever adds a second window
being minimised, the joke turns into a session-cleanup feature and should be cut.

### 11. The wager — **third person; the genuine swing, and it needs a warning label**

Two wizards watching a third friend in the same orb, both narrating what he is
about to do with the gravity of a duel. `he tabs to the spreadsheet in a minute.`
/ `in a minute he opens the other tab. watch.` / `BEHOLD.` He is not doing
anything. Neither is anyone else, and neither wizard offers the third friend a
line, because the third friend cannot see them.

The reason to take the swing: this is the only composition where the audience is
watching something that will be invisible afterwards, and the wager is just the
machine for making the room care. It is also the only one in the register that
states the actual product condition out loud — the man being watched has no idea
there is a spectator sport running — without turning it into a privacy joke,
which §5 explains the project cannot afford. It is much stranger than anything in
§3 and it is the closest thing here to a format rather than a caption.

The risk is that the panel looks like a product screen with a staked feature in
it, which is why the wager has to be visibly fictional and immediately exchanged
for a joke about paying. Nothing in the composition may describe a wager the
product administers, settles or rewards. Drawn as orb-and-speech-bubble it is a
two-man commentary booth; drawn as a real interface it is a betting product
screenshot, and that version must not ship.

### 12. Watching the orb instead of the game — **use late in the first week**

Two wizards, one orb, one game, and a viewer who has stopped looking at the game.
`bro the boss.` / `i'm not watching the orb. i'm watching you find out how the
orb works.`

The viewer is not being rude, which is the part that makes it a joke instead of
an insult: he has found the more interesting object in the room and the game has
become wallpaper behind it. That is what the first week of screen sharing between
friends actually looks like, and it is unflattering to both people. It also does
the thing the account should do more of, which is treat the product as ordinary
enough to be ignored in favour of the friend.

### 13. Two angles — **single wide panel; no caption; use as a palette cleanser**

One image, no strip, and a line of text at most. Wide frame: two wizards on the
same couch, and the panel is angled so that the left orb shows a desktop with a
slouched figure visible in it, and the right orb shows the other wizard's
shoulders and the back of the first orb. The reader is the only one who can see
both.

This is here because it does the batch's thesis as a picture rather than as a
sentence — one shared view, two perspectives, and neither man aware he is also
in the other one. It is the only composition that cannot be written, and the only
one that contains the insight without stating it. It is also the single frame
that quietly admits what the product involves: seeing someone as they look while
watching something, including the version of them that has forgotten to compose
its face. Worth one posting as a change of texture between caption-heavy days,
and it should not be explained in a reply.

It is also the nearest thing here to 5, since both depend on recursion. The
difference is the axis: 5 is a caption about a preview watching a preview, and
this is a picture about two people each sitting inside the other's frame, which
would still be true if nothing were recursive at all. If the two ever appear in
the same week, this one should lead, because it explains the idea and 5 only
comments on it.

### 14. Looking at an empty window — **third person, and the most product-shaped of the ten**

Three people: two wizards watching, one friend's shared desktop in the middle of
the panel. The friend has been scrolling the same short, entirely ordinary window
for a while. `he's been on that one for four minutes.` / `just wait, the story
is in the middle.`

The story in the middle exists, and it is exact: a thing displayed with no
context, where the missing context is temporal, not conversational. A chat cannot
carry it because the scroll is the content. A one-way stream to an audience
cannot carry it because nobody in the audience knows him. A general video call
cannot carry it because the caption's whole subject is what is on his screen.
Only screen sharing answers the question the audience is asking — where he has
got to in the page — and a screenshot cannot, because the repetition across
several minutes is the joke.

The one thing to keep out of the wording is any sense that anything is being
detected or counted. The four minutes are noticed by a friend, in the caption's
own fiction, and if the product is ever credited with the noticing, the joke
becomes a claim about what FastCast observes and keeps.

### 15. Nobody comes to the window — **third person; use as a reply**

A man sitting the whole evening in one room with one window open, a wide sky
behind him and absolutely nothing happening, with two wizards in the near
foreground. `what is he looking at` / `nothing. it's been nothing for two hours.` /
`then why is he still there. why are YOU still there.`

The horror is transferred from the sky to the wizard, which is the reversal worth
having: he is not a victim of scale, he is a man who will not go to bed. It
depends on the joke never resolving, so the last line has to be a question and
the composition has to end on it.

It works better as a reply than a post. As a reply it is a wizard commenting on
another wizard who posted a vision image with nothing in it, which is a real
posting pattern on the wizardposting accounts, and the reply carries half its
weight by being under someone else's picture rather than standing alone on the
timeline. Note one real constraint this composition sits on: the watcher is
hearing nothing. The whole gag is that audio is the missing part, which is a fact
about what a vision is for, not a missing feature to advertise.

### 16. The self-reply — **not a caption at all; a posting mechanic, and a stretch**

Panel one of 7 is posted. The account then replies to itself quoting back panel
one's orb: `this guy thinks he can go back.`

This is included because it is a use rather than a joke, and because the account
will need one eventually: the correction is more modest when the account is
punching at its own picture instead of at someone else's. It is a stretch in the
sense that it only works if the first post found an audience, which is why it
belongs in a thread under a composition that has already carried a posting day,
never as the day's post. It also preserves the rule from §2 that the backseat
never gets a line of its own.

### Assembling the batch

| Composition | People | What it needs | When |
|---|---|---|---|
| 7 Rewind argument | 2 | three panels, comic art | first, strongest |
| 9 Pointing at your screen | 2 | hand clearly inside the orb | first |
| 14 Empty window | 3 | one long, boring window | first |
| 11 The wager | 3 | visible fictional stakes | second |
| 12 Watching you learn the orb | 2 | one game, one distracted viewer | second |
| 13 Two angles | 2 | single wide panel, no caption | anywhere, as texture |
| 8 Late arrival | 3 | one line of setup | not the same week as 7 |
| 10 Tidy lie | 2 | a suspiciously clean desktop | second |
| 15 Nobody comes to the window | 3 | a wide empty sky | reply only |
| 16 Self-reply | n/a | an existing thread | after 7 has posted |

### What I would not post

Each of these was drafted as a composition and cut for a reason that generalises
past the line itself.

- **The watcher falls asleep.** `you've been quiet.` / `i fell asleep watching
  your orb. it's a compliment.` An inert audience severs the action from the
  response, and everything in this register is the response. A premise that
  requires the second person to look at the orb rather than react to it is
  usually better abandoned than rewritten.
- **`my orb doesn't forget.`** Cut as a fabricated capability, and named here
  because this is the most likely way an honest account starts lying by
  accident: the sentence is not about user data at all, but in this product it
  reads as a retention claim, and retention claims belong on the transparency
  pages with sources attached.
- **A clip of the composition itself being watched.** The most appealing idea in
  the pile and the worst one to post. A real capture of a real device is evidence,
  and this project does not have that evidence yet; a drawn one is illustration
  wearing a screenshot's clothes, which is the exact blurring §3 rejects for the
  wrong-window comic, reintroduced one layer deeper. The distinction is worth
  writing down: **an illustration is allowed to be obviously a drawing, and an
  illustration that imitates a capture is not an illustration any more.**
- **`we cast it, you saw it, everyone agreed.`** A slogan, and this one is
  instructive because it is the slogan that the rest of the batch argues against:
  it compresses shared viewing into a resolved past tense, which is the opposite
  of what the product is for. If a line survives the poster test by becoming
  vague, it is not rescued.
- **`he'll be back. he has to check on the orb.`** A sequel to 11, cut because
  the wager works only as a closed bit about one evening with nothing at stake. A
  follow-up gives the third friend knowledge he cannot have and makes the audience
  the subject, which turns a commentary joke into a claim about who can see what.

The generalisable rule, if one is wanted: **every composition here needs a
particular person reacting to a particular thing in the present tense.** The
wrong tense makes it asynchronous advice, an absent person makes it a monologue,
and an abstract thing makes it a slogan. §3 diagnoses the monologue; these five
are the other three ways it fails.
