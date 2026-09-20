# Copy and presentation review — 20 September 2026

This records editorial decisions for the current review candidate. It is not a
design contract: new user direction takes precedence. The first facelift was
rejected and is preserved separately, not selected for publication.

## Comparison with communications and collaboration sites

The live homepages of [Discord](https://discord.com/), [Slack](https://slack.com/),
and [GitHub](https://github.com/) were inspected at 1440 × 1000, including their
rendered first view, on 20 September 2026. These observations describe that
snapshot, not a permanent ranking. Skype is a historical reference rather than a
current competitor; [Microsoft documents its retirement](https://support.microsoft.com/en-us/skype/4e034bbd-cb7a-48b7-9f5a-594255f62836).

| Reference | What works | What Pyrenet should learn |
| --- | --- | --- |
| Discord | The headline identifies group chat and a playful social setting. A large desktop-and-phone composition gives the product a recognizable identity. Windows download and browser entry are distinct actions. | Name the activity immediately and show the actual product. Its entertainment-heavy illustration style is not a fit for the requested restrained interface. |
| Slack | One large centered message, a short supporting sentence, and a clear primary action establish hierarchy before product detail. The current message explicitly includes people and AI agents. | Keep one lead idea and familiar task names. Pyrenet should not borrow enterprise/AI positioning or customer-logo proof it cannot substantiate. |
| GitHub | Generous space and centered type make the opening easy to scan despite a broad navigation system. Account creation and an app download have distinct treatments. | Use deliberate spacing and action hierarchy. An unfamiliar product needs a more literal introduction than an established brand can use. |

The Pyrenet candidate has less decorative content and a simpler opening, but that
does not prove it is better than these sites. Its remaining visual weakness is
that a setup screen conveys functionality more strongly than a shared activity.
The image is an actual native capture and explicitly identifies the upcoming
interface; fabricated conversations or released-feature claims would be worse
evidence. The current design uses neutral charcoal, restrained amber, and locally
hosted JetBrains Mono after recovering and reviewing the earlier font matrix.
Pyrenet remains visible beside the logo on narrow screens.

## Recovered font comparison

The previous agent's 16-font matrix generator and JetBrains Mono switching scripts
were recovered from commit `d8e723f`. The generator named fonts without loading
most of them; comparisons could therefore silently show fallback faces. The
[restored matrix](font-review/index.html) bundles the actual 16 families, their
licenses and source URLs, plus Inter as a baseline. Its load indicator verifies
that each named family is available. No external font request is needed.

All 17 samples were reviewed with the same current headline, supporting sentence,
wordmark and download label. Inter, JetBrains Mono, IBM Plex Mono and Source Code
Pro were also compared on the actual homepage at 1440 and 390 pixels.

- **JetBrains Mono:** selected. It preserves the deliberately monospaced direction,
  has clear small text and distinct letterforms, and gives the wordmark a more
  recognizable technical character. Use regular body text and semibold branding.
- **IBM Plex Mono:** strongest alternative; more editorial character, but the
  serif-like details give this particular hero a busier texture.
- **Fira Code, Roboto Mono, Source Code Pro, Hack, Red Hat Mono:** credible readable
  alternatives, without enough advantage here to abandon the earlier choice.
- **Ubuntu Mono:** compact but optically smaller at matched body sizes.
- **Space Mono:** distinctive but more retro in this composition.
- **Monofett and Major Mono Display:** decorative letterforms unsuitable for body
  copy and navigation. **Orbitron and Audiowide** push the page toward a game UI.
- **Share Tech Mono, Chakra Petch and Rajdhani:** narrower, stylized alternatives;
  less suitable for the requested restrained, readable product site.
- **Inter:** efficient and readable, but replacing the earlier mono choice without
  recovering its rationale was a regression in design continuity.

The production page loads one local variable JetBrains Mono file (400–700), not
the entire comparison collection. The matrix remains a review artifact and is
not included in homepage requests. Monospaced text needs more width; preserve
responsive wrapping and recheck narrow/enlarged-text layouts when editing copy.

## Existing wording and the fresh selection

The local inventory contains 337 source/generated page artifacts across old
checkouts. Repeated copies are not independent design candidates. The meaningful
homepage alternatives were compared as follows:

| Candidate | Editorial decision |
| --- | --- |
| Share your screen with another device. | Clear feature language, but too narrow for the communications product. |
| Something worth sharing. | Warm but ambiguous without substantial explanation. Keep as a creative reference. |
| Your screen. Your connection. | Too little product information; retire as the main heading. |
| Share a window, not a meeting. | Distinctive rhythm, but defines the product through an objection and underplays calls/chat. |
| Private small-group communications and shared-computing fabric. | Architecture vocabulary and an overly broad privacy implication. Remove from the customer journey. |
| Talk things through. Show what you mean. | Part of the rejected direction. Do not restore it as an accepted design. |
| Show them what you're working on. | Strong screen-sharing campaign option, less complete as the product homepage. |
| Your group. More ways to be together. | Social but generic; weak explanation of what is available. |
| Share your screen. Keep talking. | Useful feature heading. Avoid implying proven uninterrupted call continuity. |
| Voice, chat, and screen sharing. | Selected for immediate product clarity. Its weakness is sameness; supporting copy and product evidence must add the distinction. |

Selected composition:

> **Voice, chat, and screen sharing.**
>
> Start a call, share a window, and talk through what's on screen.

The supporting sentence replaces the vague “follow along” with an action and a
reason to share. Platform scope remains beside the download decision: share from
Windows; watch on Windows or Android. Download buttons name the platform. Preview
status and limitations remain visible, while implementation explanations move to
the relevant detail pages.

Use **voice calls**, **chat**, **shared screens**, and **send a file**. Avoid
“communications fabric,” “live-media layer,” “written conversation,” and
“handing over a file.” Do not claim no account, universal privacy, platform parity,
or relay file transfer where the current product does not support that claim.

The app follows the same vocabulary: **Share screen**, **Watch**, **People**;
within Watch, **Join a screen** and **Shared screens**. **Local layouts** describes
arrangements on this device, not a shared community. Cursor customization belongs
under Tools. Technical source-path names remain compatible.

## Regression controls

Edit one source page per route and regenerate output. Keep source drift, links,
release metadata, contrast, browser layout, keyboard interactions and accessibility
checks passing. Review the rendered page when changing typography, spacing or
copy length. These checks catch breakage; they do not decide whether wording is
good. Preserve the rationale above as review history, and rewrite it when the
user chooses a different direction.
