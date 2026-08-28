# Wave 23 — blind side-by-side vs oryzo.ai, forced pick

Run 28 Aug 2026, fourth running of the client's own measure of done.
Oryzo captured **LIVE** through the session egress proxy at 17:1x UTC —
`refs/oryzo/` was NOT reused — 10 desktop / 7 mobile sequential scroll frames
in `oryzo/` (desktop scrollHeight 56691, mobile 51317). Ours: built to
`dist-w23` at 17:22:36Z off a clean tree at `c7d6e3b`, served on
127.0.0.1:4723, shot by `tools/shoot.mjs` (38 desktop / 35 mobile frames over
six routes) and flattened into `ours-fair/`.

## Result

| criterion | w11 | w18 | **w23** |
| --- | --- | --- | --- |
| pacing | Oryzo | Oryzo | **Oryzo** |
| whitespace | ours | ours | ours |
| type restraint | ours | ours | ours |
| motion | Oryzo | ours | ours |
| information density | ours | ours | ours |
| one-glance comprehension | ours | ours | ours |

**Ours 5, Oryzo 1.** Per-pair: desktop **8 of 10** (7 at w11 and at w18),
mobile **7 of 7**. Identification correct at both viewports.

Nothing moved on the criteria row since wave 18. The scoreboard is flat and
the honest headline is that the two criteria wave 18 named as fragile —
pacing, and motion as the pick it held least — are *both still exactly where
it left them*, one lost and one flippable, and the specific exhibit that
made motion flippable is unchanged in the pixels.

## Method, and what "blind" bought

`picks-desktop.json`, `picks-mobile.json` and `picks-criteria.json` were
written at **17:37:32Z**; `tools/reveal.mjs` was first run at **17:37:37Z**.
`PICKS-COMMITTED.txt` carries that timestamp and the sha256 of each file;
`REVEAL.txt` carries the reveal time and the tool output. The key files
(`.key.json`) necessarily predate the picks — `blind.mjs` writes them at
sheet-generation time — so the timestamps prove picks-before-reveal, not
picks-before-key-existed.

**The per-pair picks were order-blind. The criteria picks were NOT blind, and
this record says so on the front of the file rather than in a footnote.**
Wave 18's record claimed its criteria picks were blind while its criteria
file named "the navy/cream civic site" five times. That was the wave-18
builder's own warning to this one and it is worth restating as a rule: a
forced ranking against a site with a cork coaster in it is a ranking with the
ORDER OF OPERATIONS ENFORCED and nothing more. Nobody scoring these frames is
naive about which is which. `picks-criteria.json` names its winners by
side-of-pair-01 so a judge can check them mechanically, and its first key is
the string `"BLINDNESS": "NOT BLIND."`.

## Two inherited honesty notes — one confirmed, one I partly refute

**1. Oryzo never settles. CONFIRMED, independently.** At desktop y=30995,
**23.4%** of pixels differ between a 4s hold and a 20s hold
(`oryzo-settle-4s.png` / `oryzo-settle-20s.png`); wave 18 measured 25.3% at
the same offset. Its camera pans regardless of scroll, so every Oryzo frame
here is an arbitrary sample of a moving picture. The counterpart measurement,
which wave 18 did not take: **ours at the held scene's own midpoint (y=3786)
differs by 0.00%** over the same 4s→20s window. So the asymmetry is real and
it cuts one way. Where Oryzo's type reads at ~30-35% in a frame (desktop
pairs 05, 06), that is a state of its loop and I did not score it as a
defect — though see the pacing note, because it is not free either.

**2. "One-glance comprehension against a satire site is definitional." I
partly disagree, and I am narrowing our win rather than dropping it.** The
previous judge discounted this criterion to nothing. That is too strong.
Oryzo's frames are not hard to read *because* they are jokes — desktop pair
10 lands "WE CAUGHT YOUR ATTENTION WITH A NON-EXISTENT PRODUCT / IF WE CAN
SELL A COASTER, IMAGINE WHAT WE CAN DO FOR YOUR BRAND" in one glance, and
that is the criterion passing, satire and all. Where the criterion actually
separates the two sites is narrower and it is testable: **name the
organisation's purpose and four named 2026 partners off one screen.** Ours
can (`Hero.astro`, desktop pair 01, mobile pair 01, and with JavaScript off).
Theirs cannot, because it has no such facts to carry — which is a difference
in what the two sites are for, not a difference in craft. So: I keep the
pick, and I record that it is worth **less** than the other four wins, and
that a judge who strikes it entirely leaves us at 4–1 with pacing lost, not
at 4–2.

## Where ours loses — pacing

Improved, measurably, and still lost. The fraction of 20px rows carrying no
mark at all (greyscale stddev < 3), across every frame:

                  w18        w23        Oryzo w23
    desktop      34.8%      29.5%          3.6%
    mobile       24.6%      20.1%         15.6%

Wave 18's warning about this number stands and I repeat it: **it cannot tell
whitespace from a hole.** Our flattest desktop frame (`ours-fair/desktop-34.png`,
58%) is a *good* screen. The number locates candidates; the pixels decide.
Wave 21's halving of the `/forum/` seam is real — the three 191–220px bands
wave 18 exhibited are gone, and `/forum/` now reads 134px at the one place it
still opens (desktop pair 07 is one of our strongest frames).

### The single biggest pacing gap now: the run-up to the closing scene, and it is ONE number in ONE file

`src/components/Footer.astro:100` —

    .foot { padding-block: clamp(4rem, 1.6rem + 7.5vw, 9rem) clamp(1.4rem, 2vw, 2rem); }

That start value is **133.6px at 1440** and it is reserved *on top of* the
bottom padding the preceding section already holds. Measured off the built
pages under `prefers-reduced-motion: reduce`, footer `padding-top` by route,
desktop: `/` 134 · `/institute/` 134 · `/forum/` 134 · `/people/` 134 ·
`/404` 134 · `/pilots/` 83 · `/partner/` 89. **Five of seven routes carry the
identical 134px**, so this is not a page's composition, it is one constant
governing how every page on the site arrives at its ask.

What the reader gets, in pixels (`inst-band-desktop.png`, `404-band-desktop.png`,
`inst-band-mobile.png`, all shot at DSF 2, reduced motion):

- **`/institute/`, desktop**: the hairline under "05 Share the lessons with
  the world" sits at y≈2388; the next mark, the `WORK WITH US` eyebrow, at
  y≈2611. **223px** with nothing on screen — 85px of section tail plus the
  134px footer reserve. That is 7.3% of a 3061px page, and it is the frame in
  desktop pair 06 and mobile pair 04 (137px at 390).
- **`/404`, desktop**: the same seam, **266px** between the rule under
  "…prospective board." and `WORK WITH US`. On a 1630px page that is
  **16.3% of the whole route** — and /404 is the page wave 22 rebuilt
  *specifically* because it was the site's largest hole. It closed the two
  bands it was sent after and left this one, which is now the biggest on that
  page.

**`tools/held-space.mjs` sees all of these and passes all of them, correctly
by its own rule, and that is the thing to notice.** It prints
`desktop /institute/ 2359-2605 · 246px · closed by composition (full-measure
mark)` at position 3 in its own table, and `desktop /404 888-1174 · 286px` at
position **1 — the largest band on the site.** Both are closed by a mark
found at `2595` and `1163`: 10px and 11px above their own bottom edges. The
rule says "spanned at an edge of it or inside it", and the closing mark in
every one of these cases is the *opening* rule of the block below. So the
clause is satisfied by the thing the reader has not reached yet. I am not
proposing a change to the rule — a floor loose enough to catch this would
re-open the argument AGENTS.md already settled about /partner/ — but the gate
being green here should not be read as this band having been looked at. It
has not. It is 286px on a 1630px page.

**What it costs, and the cheaper version.** Retuning that clamp is a global
type-and-space change touching the close of all seven routes, and it is the
kind of thing that should be measured against the ask's own composition, not
nudged. **Do not spend a named moment on it.** The cheap version is
route-shaped and already has precedent in the same file: `/pilots/` and
`/partner/` both already override to 83 and 89px and neither reads as
cramped. Giving the short routes — `/institute/` (3061px) and `/404` (1630px)
— the `/partner/` value would take /404's seam from 266px to ~221px and
/institute/'s from 223 to ~178, using a number that already ships on this
site, changing no scale and inventing nothing. That is a one-line change with
a measurement behind it, not a moment.

## Where ours wins — do not spend these by accident

- **One-glance comprehension** — still the hero, `src/components/scenes/Hero.astro`:
  the mission sentence and four named 2026 partners inside 900px, desktop and
  mobile, script on or off. Narrowed above; still the pick with a test behind
  it. The moment the pilot strip goes below the fold, this goes with it.
- **Information density** — the ledgers, and mobile is where it is widest.
  Mobile pair 06 puts nine board members with headshots, names and one-line
  affiliations in one 844px screen against three joke testimonials. It wins
  because it is a **ledger, not cards**. Mobile pair 03 (`/pilots/` detail,
  the partner bar over a located photograph) is the same virtue on a second
  route.
- **Whitespace** — the cream Why-Now scene is still the only cream
  interruption in a navy homepage, and `/forum/`'s cream block (desktop
  pair 07) is the second. Two is the ceiling; a third kills the criterion.
- **Type restraint** — two families, one accent, brass held to indices and
  eyebrows, across all 73 frames. Oryzo runs display sans, a condensed sans,
  a serif, a mono and handwriting in the ten frames captured here. This is
  the widest and safest margin on the board and it costs nothing to keep:
  add no family, no weight, no colour.
- **Motion — kept, and the reason wave 18's judge took it away is gone.**
  The judge flipped it on a seam "dark for four-fifths of its payload".
  Measured this run over the 855px pinned range on `/`, desktop, 17 samples
  of the beat band: peak cream ink (max luma 238) is reached at y=3573
  (t=0.25) and held to y≈4054 (t=0.81) — the payload is lit for about **56%**
  of the arc, against wave 18's measured ~20%. `held-3573.png` lands
  "The Lion Forum / Held at the Kennedy Compound, Hyannis Port" with the
  Block Island credit chip in the same frame; `held-3947.png` lands the beat
  sentence at full ink.

### The pick I hold least, again: motion — and its exhibit is UNCHANGED

I committed motion to ours before the reveal and report it as committed. It
is still the flippable one, and the reason is not a matter of taste this
time, it is a frame:

**`held-enter.png` (y=3359) and `held-exit.png` (y=4214) carry no sentence.**
At the entry the only lit strings are `BY INVITATION` and the
`BLOCK ISLAND, RHODE ISLAND` chip; at the exit, only `INQUIRE ABOUT THE
FORUM →`. Between them lies 855px of pinned scroll — a full screen-height of
wheel — on the homepage's one held scene. Wave 18 wrote: *"W11's 'opens on
nothing and closes on nothing' was answered in luminance; it has not been
answered in **type**."* Four waves later that sentence is still true
verbatim. Waves 19–22 raised the picture (the enter frame is no longer at
ground; band max luma 75 rather than black) and latched the progress meter,
and neither touched the ends in type. The mid-arc seam at t=0.50
(`held-mid.png`) is the same family: the display line is off screen and the
beat sentence sits at roughly a third of its ink while the reader crosses it.

A designer who reads "motion" as spectacle scores this Oryzo on the ambient
camera alone and the wave is **4–2**. My reason for holding it is the brief's
own wording — *motion and hover as hierarchy* — and that every move we make
puts a specific string where the eye already is, while Oryzo's pan carries no
information. That is a reading of the criterion, not a measurement.

## What would have to be true for an outside designer to disagree

We do not win all six, so this is about the other five.

- **Whitespace and pacing are the same measurement read with opposite
  signs**, and this is still the cheapest way to lose two criteria on one
  judgement. 29.5% flat desktop rows is "composed" or "underfilled"
  depending on the reader. The defence is that our flat rows are bounded by
  rules and set on a grid; the honest concession is that the /404 and
  /institute/ footer run-ups are *not* — they are 223–266px in which the
  bounding mark at the far edge is the next block's own opening. A designer
  who opens /404 first — the page a stale forwarded link lands on — sees
  16% of that route as one void and has a strong case.
- **Information density loses if the reader counts ideas rather than facts.**
  Our ledgers are dense in nouns and thin in propositions. Oryzo puts a
  claim, an image and a joke in every frame.
- **One-glance comprehension is worth less than the other four**, per the
  refutation above. Strike it and pacing and we are 4–2 on a scoreboard that
  reads 5–1.
- **Type restraint is the only one I think cannot be argued**, because it is
  a count, not a reading: two families against five.

## Render modes, checked

`prefers-reduced-motion: reduce` was the mode every band and footer
measurement in this record was taken in. The two settle probes above cover
the animated path. Nothing here depends on a mode a reader might not get.

## Gates, and a shared-tree caveat stated rather than buried

The full suite was not re-run for this piece; `tools/held-space.mjs` was run
alone (**0 holes in 58 bands ≥ one --pause across 7 routes at 2 viewports, 3
accepted**) because this record makes a claim about its verdict, and its
table is quoted above. **No file under `src/` was touched by this piece.**

Another builder is working in this tree concurrently, and the honest version
of that is dated. `dist-w23` was built at **17:22:36Z** off a clean tree at
`c7d6e3b`, so every frame in `ours-fair/`, every band crop, every footer
measurement and both settle probes are of the committed tree. Four files were
modified by someone else afterwards:

    tools/held-space.mjs   17:29:37Z
    tools/audit.mjs        17:32:04Z
    tools/nojs-diff.mjs    17:32:04Z
    src/pages/forum.astro  17:40:03Z

The `src/` edit lands 17 minutes after the build and cannot have reached any
frame here. The held-space edit lands within a minute of my run of that tool,
so **the run may have straddled it** — wave 18 hit the same thing and the
lesson is to say so. Read on it: that diff changes only how an `ACCEPTED`
entry is KEYED (route+view → the pair of named marks a band sits between); it
does not touch band detection, the ground floor, or `ok()`. The two rows this
record argues from — `/404 888-1174 · 286px` and `/institute/ 2359-2605 ·
246px` — are detection output on unaccepted bands and are not reachable by
that change. **Whoever owns those edits should re-run the suite on a settled
tree.** It is not this piece's to answer, and this piece did not run the
other six gates while they were mid-edit.

## Files

    oryzo/                  fresh live capture, 28 Aug 2026 (10 desktop / 7 mobile)
    ours-fair/              our build, settled-scroll, 6 routes x 2 viewports flattened
    blind-desktop/          10 unlabelled pairs + .key.json
    blind-mobile/           7 unlabelled pairs + .key.json
    picks-desktop.json      committed 17:37:32Z, before the key was opened
    picks-mobile.json         "
    picks-criteria.json       "  — declares itself NOT BLIND
    PICKS-COMMITTED.txt     commit timestamp + sha256 of each picks file
    REVEAL.txt              reveal timestamp (17:37:37Z) + tools/reveal.mjs output
    held-enter/3573/mid/3947/exit.png   the held arc, desktop, settled, reduced motion
    inst-band-desktop.png   /institute/ 2300-2660, the 223px run-up to the ask
    inst-band-mobile.png    the same seam at 390
    404-band-desktop.png    /404 860-1200, the 266px run-up — 16.3% of that route
    partner-band-desktop.png  /partner/ 640-900, the band held-space accepts by name
    oryzo-settle-4s/20s.png   23.4% of pixels differ at a fixed offset
