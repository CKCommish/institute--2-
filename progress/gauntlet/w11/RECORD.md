# Wave 11 — blind side-by-side vs oryzo.ai, forced pick

Run 27 Aug 2026. Oryzo captured LIVE through the session egress proxy
(`refs/oryzo/` was NOT reused) — 10 desktop / 7 mobile sequential scroll
frames, `progress/gauntlet/w11/oryzo/`. Our build: `dist-blind`, served on
127.0.0.1:4711, shot at the same viewports.

## Method, including one thing the harness was doing wrong

`tools/shoot.mjs` scrolls with `window.scrollTo(0, y)`. `base.css` sets
`html { scroll-behavior: smooth }`, so that is an animation; the tool then
waits a flat 1150ms and fires. Its frames therefore catch our reveals
mid-transition. `progress/gauntlet/w11/blind-desktop` (first sheet, built
from `tools/shoot.mjs` output) shows whole blocks of our type at 30–50%
opacity that are fully opaque in the real render — verified by probing
computed opacity at a settled scroll offset. AGENTS.md already warns about
this trap for meters; it applies to the screenshotter too, and it has been
quietly biasing every blind read this project has run.

The scored sheets are `blind2-*`, shot with `behavior:'instant'` + wait for
`scrollY` to stop + 2600ms settle. Picks were written to `picks-*.json`
BEFORE `.key.json` was opened; `tools/reveal.mjs` output is below.

**Honesty note.** A cork-coaster WebGL site and a navy/cream civic site are
not confusable by anyone, me included. The blinding here buys ordering
discipline — picks fixed and written down before the key — not naivety. Read
the result as a forced ranking, not as a naive-observer test.

**One discipline failure, recorded.** Mobile pair 05 was filled in from the
FIRST sheet's randomisation instead of the scored sheet's. The pick as
committed reads as a loss; on viewing the correct frame ours plainly wins.
Committed mobile score 4/7; corrected 5/7. The desktop sheet has no such
error — all ten pairs were viewed on the scored sheet before picking.

## Result

Desktop, per-pair: **ours 7 of 10** (lost 06, 08, 10). Identification correct.
Mobile, per-pair: ours 4 of 7 as committed / 5 of 7 corrected (lost 04, 07).

Forced pick on the six criteria — **ours 4, Oryzo 2**:

| criterion | winner |
| --- | --- |
| pacing | **Oryzo** |
| whitespace | ours |
| type restraint | ours |
| motion | **Oryzo** |
| information density | ours |
| one-glance comprehension | ours |

## Where we lose — the single biggest gap, each

### Pacing — the navy dead band between the pilot ledger and the Forum picture

`src/components/scenes/PilotsScene.astro` (section end) meeting
`src/components/HeldScene.astro` (stacked-figure top) on the homepage.

Desktop, `prefers-reduced-motion: reduce` (the static case, so this is not an
animation artifact): the last pilot rule sits at y=3928, the Forum `<img>`
box opens at 4062 — 134px of empty section padding — and the picture's own
top ~119px is graded so far into the page ground that it is not
distinguishable from it. First legible pixel of sky: ~4181. That is **253px,
28% of a 900px viewport, carrying neither type nor picture**, and because
the pilot ledger ends on a hairline and the Forum scene opens on ground, the
reader crosses it with no signal that anything is coming. `rm-desktop-0.6.png`
in this directory is the frame. Every Oryzo frame in the run hands off from
one legible set piece to the next; not one of its ten is empty.

### Motion — the held scene's arc opens on nothing and closes on nothing

`src/components/HeldScene.astro:91`, `floor = 0.93` ("how deep the ground is
at the closed end of the arc; 1 = page ground"), left at its default by
`src/components/scenes/ForumScene.astro`'s `<HeldScene arc="lift" hold={0.95}
holdSm={0.85}>`.

Measured across the pinned range, mean luminance of the middle half of the
viewport (11 samples, desktop 1440×900):

    t=0.0  31.6   t=0.3  99.2   t=0.6 100.1   t=0.9  66.0
    t=0.1  53.5   t=0.4  99.2   t=0.7 100.2   t=1.0  32.9
    t=0.2  85.8   t=0.5  98.7   t=0.8  98.6

Page navy is ~38. So the site's one held scene spends its first ~171px and
its last ~171px of pinned scroll showing a photograph rendered at the
brightness of the ground it sits on. Mobile is the same shape (29.7 → 86 →
30.9). Blind pair 08 is the exit frame: a full 900px viewport containing one
12px link and a picture too dark to read. Pair 06 is the entry frame. Those
are the two desktop pairs we lost, and they are the same defect twice.

This is the wave-8/wave-9 family again — a rule whose visible result is a
photograph darkened until it reads as empty — except this one is authored,
measured, and defended in a comment, so no meter will ever flag it. `floor`
is a single number and moving it is not a named moment; do not spend one
recomposing the scene.

## Where we win — do not spend these by accident

- **One-glance comprehension** (pair 01, the widest margin in the run): the
  hero holds the mission sentence AND the four 2026 partners by name inside
  900px. `src/components/scenes/Hero.astro`. The moment the pilot strip goes
  below the fold, this criterion goes with it.
- **Information density** (pair 05): the pilots ledger delivers, in one
  frame, four indices, four partner names, four titles, four domains and four
  one-line claims, all legible. It wins because it is a **ledger, not cards**.
  `src/components/scenes/PilotsScene.astro`.
- **Whitespace** (pair 02): the cream Why-Now scene —
  `src/components/scenes/WhyNow.astro`. Its force is that it is the *only*
  cream interruption in a navy page. A second cream scene kills it.
- **Type restraint** (all 17 frames): two families, one accent, brass held to
  indices and eyebrows. Nothing to do here but not add anything.

## Two things this run turned up that are not craft losses but should be logged

1. **`src/components/scenes/ForumScene.astro`** sets `forum.place` —
   "Kennedy Compound, Hyannis Port" — as a 24px cream bridge line directly
   under "The Lion Forum" at the foot of a photograph of **Block Island,
   Rhode Island**. The scene's comment argues the top-right credit chip and
   the diagonal make the two strings read as different facts. Looking at the
   pixels (blind2-desktop pair 07, blind2-mobile pair 05): the credit is
   small, dim and in the corner; the place line is large, cream and touching
   the title. It reads as the caption. `refs/PHOTO-FACTS.md` forbids exactly
   this implication. Not mine to fix — flagging it.
2. The homepage footer's route row links **Institute and Pilots only**
   (`dist-blind/index.html`); `/people/` has no footer link on any page.
   Oryzo's footer, mobile and desktop, is complete and ordered, and pair 10
   / mobile pair 07 are two of the three frames we lost.

## Files

    oryzo/              fresh live capture, 27 Aug 2026
    ours-fair/          our build, settled-scroll capture (6 routes x 2 viewports)
    blind-desktop/      first sheet — built from tools/shoot.mjs, NOT scored
    blind-mobile/         (kept as the evidence for the smooth-scroll bias)
    blind2-desktop/     scored sheet + .key.json
    blind2-mobile/      scored sheet + .key.json
    picks-desktop.json  committed before the key was opened
    picks-mobile.json     "
    rm-desktop-*.png    prefers-reduced-motion: reduce, homepage
