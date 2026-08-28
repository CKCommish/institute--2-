# Wave 18 — blind side-by-side vs oryzo.ai, forced pick

Run 28 Aug 2026. Third running of the client's own measure of done. Oryzo
captured LIVE through the session egress proxy (`refs/oryzo/` was NOT reused)
— 10 desktop / 7 mobile sequential scroll frames in `oryzo/`. Ours: built to
`dist-w18`, served on 127.0.0.1:4718, shot at the same two viewports by
`tools/shoot.mjs` (38 desktop / 35 mobile frames over six routes), flattened
into `ours-fair/`.

## Result

| criterion | w11 | **w18** |
| --- | --- | --- |
| pacing | Oryzo | **Oryzo** |
| whitespace | ours | ours |
| type restraint | ours | ours |
| motion | Oryzo | **ours** |
| information density | ours | ours |
| one-glance comprehension | ours | ours |

**Ours 5, Oryzo 1** (was 4–2). Per-pair: desktop **7 of 10** (unchanged from
w11), mobile **7 of 7** (was 4 committed / 5 corrected). `REVEAL.txt` has the
tool output; identification correct at both viewports.

Read the 5–1 as 4–2 if you are being strict — see "the pick I hold least" below.

## Method, and its two honest limits

Picks were written to `picks-desktop.json`, `picks-mobile.json` and
`picks-criteria.json` at **04:36:36Z** and `tools/reveal.mjs` was first run at
**04:36:44Z** (`PICKS-COMMITTED.txt` carries the timestamp and the sha256 of
each picks file; `REVEAL.txt` carries the reveal time). The criteria file
names its winners by side-of-pair rather than by name, so it commits a choice
without recording which site it is. The key files necessarily predate the
picks — `tools/blind.mjs` writes them at sheet-generation time — so the
timestamps prove picks-before-reveal, not picks-before-key-existed. Same
structure as w11.

**Limit 1 — blinding buys ordering, not naivety.** A cork-coaster WebGL site
and a navy/cream civic site are not confusable. This is a forced ranking with
the order of operations enforced, and nothing more.

**Limit 2 — Oryzo never settles, so still frames are unfair to it.** At a
fixed scroll offset (y=30995, desktop), 25.3% of pixels differ between a 4s
and a 20s hold: the camera pans continuously through the 3D scene whether or
not you scroll (`oryzo-settle-4s.png` / `oryzo-settle-20s.png`). Every Oryzo
frame in this run is therefore an arbitrary sample of a moving picture. Where
its type reads at ~35% opacity in a frame (pairs 05, 06), that is a state of
the loop, not a defect, and I did not score it as one.

## The known harness bias is gone — verified, not assumed

W11 found `tools/shoot.mjs` scrolling smoothly and then waiting a flat 1150ms,
catching our own reveals at 30–50% opacity. Wave 12 replaced that with
`behavior:'instant'` + wait-for-scrollY-to-stop + a 2600ms settle. Verified
here rather than trusted: at every shot offset on `/`, `/pilots/`, `/people/`
and `/institute/`, every element with a partial computed opacity was probed at
2600ms and again at 5600ms. **Not one value moved.** The partials that remain
(`fig__tint`, `fig__veil`, `nav__prog`) are steady-state design values, not
transitions in flight, and no text node is among them. The held scene's beat
was probed separately at scroll 3787 and sat at opacity 0.049 at 1200ms and
still 0.049 at 6000ms — a scroll-position value, not an animation. The frames
in this directory are what a reader parked there sees.

## Where ours loses — pacing, and the gap has MOVED

W11's pacing loss was the homepage seam: 253px of navy carrying neither type
nor picture between the pilot ledger and the Forum photograph. **That is
fixed and is not the gap any more.** Measured in `prefers-reduced-motion:
reduce` on the built page: `.pilots` runs 2372→3467 and the Forum `<img>`
opens at **3317** — the picture now starts 150px *before* the ledger's section
ends. There is no dead band at that seam.

### The single biggest pacing gap now: `/forum/`, the seam below the claim

`src/pages/forum.astro`, between `<section class="fsay">` (which ends on the
claim "The people who build sit with the people who decide.") and
`<section class="fbrief">` (the `02` row).

Static case, reduced motion, page height 3066:

    ...ends "decide."   1283 → 1479   196px   next mark: "02"
    ...ends "The subject" 1790 → 2010   220px   next mark: "03"
    ...ends the email    2421 → 2612   191px   next mark: "Work with us"

607px of a 3066px page — **20% of the route** — is inter-scene void, and
unlike the homepage there is no photograph anywhere between these scenes to
carry the reader across: every one of them is flat navy between two
typographic rows. `ours-fair/desktop-25.png` is the frame: the claim ends at
viewport y=190, the next mark is at y=395, and the 205px between them is
above the fold, inside a scene, not at a margin.

Measured across whole scrolls, the shape of it: the fraction of 20px rows
whose greyscale stddev is under 3 (i.e. carrying no mark at all) is **34.8%
of ours on desktop against 3.2% of Oryzo's**, worst frames two-thirds empty.
Mobile is much closer — 24.6% vs 16.7% — which is why mobile went 7/7.

**Do not over-read that number.** It cannot tell whitespace (a criterion we
win) from a hole (the one we lose): `ours-fair/desktop-34.png` scores 66%
flat and is a *good* screen — one headline, one email address, generous. The
number located the offenders; the pixels decided which were defects. Only the
`/forum/` bands are.

## Where ours wins — do not spend these by accident

- **One-glance comprehension** — still the widest margin, still the hero:
  `src/components/scenes/Hero.astro` holds the mission sentence AND four
  named 2026 partners inside 900px (desktop pair 01, mobile pair 01). W11
  said the moment the pilot strip goes below the fold this criterion goes
  with it. Still true.
- **Information density** — the pilots ledger, `PilotsScene.astro`, and now
  also `/people/` at mobile: pair 06 puts nine board members with headshots,
  names and one-line affiliations in one 844px screen against three joke
  testimonials. It wins because it is a **ledger, not cards** — the w11
  finding, and the flattened row-major roster (mobile pair 02) kept it.
- **Whitespace** — the cream Why-Now scene is still the only cream
  interruption in a navy homepage. A second cream scene kills it.
- **Type restraint** — two families, one accent, brass held to indices and
  eyebrows, across all 73 frames. Nothing to do but not add anything.
- **Motion — the held Forum scene, recovered.** This is the pick that moved.
  Mean luminance of the middle half of the viewport across the pinned range,
  desktop, 11 samples:

        w11:  31.6 → 100.2 → 32.9   (page navy ~38: both ends AT ground)
        w18:  53.7 → 129.9 → 56.5   (both ends clearly ABOVE ground)

  `floor` came down 0.93 → 0.72 in `src/components/HeldScene.astro:126`.
  `held-3600.png` is the scene doing its job: the photograph legible, "The
  Lion Forum" and its bridge line landed, the Block Island credit chip
  present in the same frame — which is w17's sticky-credit fix working, and
  the first time the w11 photo-facts flag reads as two facts rather than a
  caption.

### The pick I hold least, stated plainly

**Motion.** I committed it to ours before the reveal and I am reporting it as
committed, but it is the one an outside designer is most likely to flip, and
the case against it is strong: Oryzo's motion is continuous, camera-driven and
of a production class we are not attempting, while ours is scroll-bound
reveals plus exactly one held scene. My reason for ours is the brief's own
wording — *motion and hover as hierarchy* — and that every move we make puts a
specific string where the eye already is, while Oryzo's ambient pan carries no
information and leaves its own headline at ~35% over a busy render. That is a
reading of the criterion, not a measurement, and a designer who reads "motion"
as spectacle scores it Oryzo and the wave is 4–2 again.

**The two ends of the arc are still the weakest frames on the homepage.**
`held-enter.png` (y=3359) and `held-exit.png` (y=4214) each carry one small
label over a dim picture: at 3359 the headline is at effective opacity 0 and
only "BY INVITATION" and the credit chip are lit; at 4214 the headline is back
at 0 and only a 12px "INQUIRE ABOUT THE FORUM" remains. The beat text ("The
people who build sit with the people who decide.") holds **effective opacity 0
for the first 494px of the 855px pinned range** (3359→3781), reaches 1 only
around y≈3950, is back under 0.05 by 4100 and at 0 by 4214 — lit for roughly a
fifth of the scene it is the payload of. W11’s "opens on nothing and closes on
nothing" was answered in luminance; it has not been answered in **type**.

### Render modes, checked

`javaScriptEnabled:false` and `prefers-reduced-motion: reduce` were read at
both viewports on the homepage. Nothing in this record depends on a mode that
a reader might not get: the hero carries the mission sentence and all four
2026 partners with JS off (`nojs-desktop-home.png`), and reduced-motion mobile
lands "The Lion Forum" / "Held at the Kennedy Compound, Hyannis Port" with the
Block Island credit chip inside the bounded photograph above it, which is the
clearest reading of that pair anywhere on the site (`rm-mobile-home-2.png`).

## Two w11 logs, re-checked

1. **The Block Island / Hyannis Port adjacency is materially better.** W17
   made the credit sticky and it now holds in the same frame as the place
   line (`held-3600.png`), and the copy reads "Held at the Kennedy Compound,
   Hyannis Port" — "held at" naming the convening, not the view. It is still
   the site's largest single factual-reading risk and still worth a judge's
   eye, but it is no longer the plain caption w11 saw.
2. **The footer route row is UNCHANGED and now demonstrably incomplete.**
   Read out of `dist-w18` rather than off a frame, the footer link row is:

        /            Institute  Pilots
        /pilots/     Institute  People
        /institute/  Pilots     People
        /forum/      Institute  Pilots
        /people/     Institute  Pilots
        /partner/    Institute  Pilots

   Two links, always, drawn from {Institute, Pilots, People} minus the
   current route. **`/forum/` and `/partner/` are not linked from the footer
   of any page on the site** — including the homepage, whose held Forum scene
   is the thing the footer sits under. Desktop pair 10 and mobile pair 07
   both show it against an Oryzo footer that is complete and ordered at both
   viewports. W11 logged the shape of this seven waves ago; nobody has taken
   it, and it is a data-row change, not a moment.

## What would have to be true for an outside designer to disagree

We do not win all six, so the question is what would move the other five.

- **Whitespace and pacing are the same measurement read with opposite
  signs.** A designer who reads our 34.8%-flat desktop as "underfilled"
  rather than "composed" flips whitespace to Oryzo and takes pacing with it,
  and the 5–1 becomes 3–3 on one judgement call. The defence is that our
  flat rows are *bounded by rules and set on a grid*; the offenders are the
  three `/forum/` bands where they are not.
- **Information density loses if the reader is counting ideas rather than
  facts.** Our ledgers are dense in nouns and thin in propositions; Oryzo
  puts a joke, an image and a claim in every frame.
- **One-glance comprehension is the only one I think is safe**, and only
  because it is testable: name the organisation's purpose and four 2026
  partners from one screen. Ours can be. Theirs cannot.

## Gates — run, but the tree was not clean, so read the number with care

The full suite was run after the comparison. It reported **glyph-floor FAILED
with 2 failures in 850 curves** (806s), against the brief's stated 1 in 853.
**That delta is not attributable to this piece and should not be read as a
regression.** This wave's builders share one tree, and at the time the suite
ran it carried two uncommitted edits by someone else:

    M src/pages/institute.astro   (modified 04:25:07Z)
    M tools/glyph-floor.mjs       (modified 04:49:38Z — mid-run)

The gate's own file changed while the gate was running, and the page it
measures changed before it started. I touched neither, and no file under
`src/` was edited by this piece at all.

**The comparison frames are clean.** `dist-w18` was built at **04:19:05Z**,
six minutes before the `institute.astro` edit landed, so every frame in
`ours-fair/` and every measurement in this record is of the wave-17 tree.

Whoever owns those edits should re-run glyph-floor on a settled tree and say
whether the second failure is theirs. It is not this piece's to answer.

## Files

    oryzo/                 fresh live capture, 28 Aug 2026 (10 desktop / 7 mobile)
    ours-fair/             our build, settled-scroll, 6 routes x 2 viewports flattened
    blind-desktop/         scored sheet + .key.json
    blind-mobile/          scored sheet + .key.json
    picks-desktop.json     committed 04:36:36Z, before the key was opened
    picks-mobile.json        "
    picks-criteria.json      "  (winners named by side, not by site)
    PICKS-COMMITTED.txt    commit timestamp + sha256 of each picks file
    REVEAL.txt             reveal timestamp + tools/reveal.mjs output
    held-enter/3450/3600/3700/mid/exit.png   the held arc, desktop, settled
    rm-desktop-*.png       prefers-reduced-motion: reduce, homepage, desktop
    rm-mobile-home*.png    prefers-reduced-motion: reduce, homepage, 390x844
    nojs-desktop-home.png  javaScriptEnabled:false, homepage, 1440x900
    nojs-mobile-home.png   javaScriptEnabled:false, homepage, 390x844
    oryzo-settle-4s/20s.png  proof Oryzo never settles at a fixed offset
