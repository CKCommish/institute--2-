# Lion Forum Institute — build notes for agents

Static site. **Astro 5**, no UI framework. Everything is hand-written CSS in
component `<style>` blocks plus three global files.

## Run it

```bash
npx astro dev --port <yourPort> --host 127.0.0.1     # live, no dist
node tools/preview.mjs <yourId> <yourPort>           # isolated build + static serve
BASE=http://127.0.0.1:<port> node tools/shoot.mjs <label> --pages=/,/pilots/
node tools/blind.mjs progress/shots/<label>/home desktop /tmp/blind-<you>
```

Use **your own port**. Never `npx astro build` into the shared `dist/`.

## The five gates — run all of them before you report

```bash
node tools/gates.mjs        # all five, in parallel, one verdict — THIS IS THE WAY TO RUN THEM
```

It builds to its own `dist-gates-<hash>`, serves it on a port the OS hands
out, and runs the five below in a pool. Nothing is shared, so two builders
can run it at the same moment — which is what wave 12 could not do, and why
two racing runs reported a phantom failure. It caches each gate's verdict
against the hash of the source tree AND of the gate's own file, so a re-run
on an unchanged build is instant; `--fresh` ignores the cache.

`glyph-floor` is the long pole: it shoots two frames at 3x for every offset it
samples. As it shipped in wave 14 that was about seven minutes a route-view
and a whole-site sweep nobody ever finished — the wave-14 judge gave it three
hours and got no verdict, and its author's whole-site numbers were withdrawn.
It now shoots CLIPPED to the text rather than to the whole glass, and a
refinement shoots only the string it is refining: the same pixels at the same
scale, for a fraction of the encode. A full twelve route-view sweep is minutes
now, not never. Narrow it with `--routes=` and `--views=` while you work; run
it whole before you report — and now you can.

```bash
node tools/audit.mjs        # contrast, overflow, heading order, alt text, tap targets, dead links
node tools/glyph-floor.mjs  # EVERY string on the site, contrast measured by subtraction
node tools/nojs-meter.mjs   # all 7 routes x 2 viewports with JavaScript OFF
node tools/nojs-diff.mjs    # the same routes compared as PICTURES, script on vs script off
node tools/perf.mjs         # page weight, LCP, CLS at load and through a full scroll
```

These are gates, not diagnostics. A wave is not done until all five are green,
and "I read the DOM and it looked right" is not one of them.

`tools/photo-meter.mjs` is a DIAGNOSTIC, not a gate: it reports how far each
photograph's grade sits off the ground, in bands and corners, and it has never
had a pass/fail threshold. Run it when you change a picture or the grade.

**Why `nojs-meter` exists.** A defect shipped through eight waves and four
green meters: the fixed nav's scrim was switched on by a script-written class,
so with JavaScript disabled the bar had no ground and 86px cream display type
crossed cream nav links on /forum/. No meter could see it, because no meter ran
with JavaScript off. A second defect of the same family — the scrim's *colour*
is also script-written, so without a script its masked tail dragged ink type
through a dark gradient, down to 1.03:1 on /people/ — was found one wave later
by the same route. Any rule whose visible state depends on a script-written
class is invisible to every other tool here.

**Why `nojs-diff` exists, one wave after that.** A third defect of the same
family shipped: /institute/'s hub connectors declared `transform: scaleX(0)`
unconditionally and undid it on a script-written class, so with no script the
diagram's hub sat unattached to both arms. `nojs-meter` cannot see that and
never could — a missing 47px hairline breaks no contrast, no overflow and no
heading rule. `nojs-diff` compares the two renders as pictures: reference is
scripts-on under reduced motion (the site's own "arrived and still" state),
under test is scripts-off with NO reduced-motion override, because every
scene's reduced-motion block force-resolves exactly the states this family
gets stuck in and normalising both sides with it blinds the tool to its own
subject. Read its header before changing a threshold. It exempts the fixed
bar, which is deliberately a different object without a script; that band is
`nojs-meter`'s, in contrast. **Run both.**

## The contrast meters, and the hole that ran through all of them

This project built four contrast meters in four waves and every one of them
measured the ground and then MODELLED the ink on top of it. Each model had a
different missing term, so each had a different blind spot, and one piece of
type was quoted at 9.38:1, 7.19:1, 4.70:1 and 4.17:1 by tools that were all
green at the time.

| meter | its model of the ink | what it could not see |
| --- | --- | --- |
| `audit` | the DOM's nearest background colour | photographs, at all |
| `photo-meter` | `c*a + bg*(1-a)`, colour alpha only | `opacity` on the element or any ancestor; a sticky stage, where its five stops collapse to one |
| `hold-meter` | cascaded opacity, 17 fixed samples | anything off that one scene, and the minimum, which falls between samples |
| `ink-floor` | cascaded opacity, curve minimised | **anything painted in FRONT of the glyphs** |

That last row is the one to learn from. `ink-floor` was built to fix
photo-meter's blindness to ancestor opacity and it did — its 4.563:1 for the
homepage eyebrow is right, and it is still the number to quote. But its model
had one term for what is behind the glyphs and none for what is over them, so
the nav's scrim tail was a free pass in it exactly as it was in the other
three, and it was hiding 11px type at **2.745:1** while the gate was green.
(That tail was quoted here as "89px" for two waves. 89 was one route's
number generalised: /pilots/ overrides the tail locally, and the site-wide
reach was 119px desktop / 114 mobile against /pilots/'s 89. The reach any
route actually has is `--nav-h + --nav-tail`, both of which are fluid and one
of which a page may override — read it off the element, never off this file.
Wave 15 made the shape one thing everywhere; the number still varies with the
viewport. Wave 16 made the tail 0.375rem and moved the mask's stops from
percentages of that fluid height to absolute lengths off `--nav-h`, so the
scrim is now solid to exactly the bar's bottom edge and the fade is exactly
the tail: reach is `--nav-h + 0.375rem`, 69.4px desktop / 64px mobile, and the
HALF-LIT BAND — the only number that governs — is 6px in every render mode at
both viewports. /pilots/'s local override is deleted; the rule is written
once.)

**"Written once" was not true when wave 16 wrote it, and the route it was
untrue on was the one carrying the site's thinnest type.** Wave 16 deleted
/pilots/'s override and checked the band on the routes it had deleted it
from. `src/pages/forum.astro` carried a SECOND override of the same rule —
`:global(.nav.is-scrolled)::before { height: calc(var(--nav-h) + 4.4rem) }`
plus its own fading background — and the shared mask ramps to `transparent
100%`, where 100% is whatever box that page declares. Measured off the live
element in all three render modes at both viewports (wave-16 judge): every
route reported scrim height = --nav-h + 6px, and /forum/ reported 133.75px
desktop / 128.39px mobile, a HALF-LIT BAND of 70.39px — eight lines of ink,
against the 8.67px this rule is sized on. Deleting that one block took
/forum/ from 24 glyph-floor failures to 10 and the whole nojs-diff gate from
5 findings to 0. THE LESSON IS NOT ABOUT THE NAV: a rule enforced in one
file and overridable by `:global()` from any page is not written once, and
neither the gates nor a comment can tell you that. Before believing a
geometry claim, read the geometry off the element ON EVERY ROUTE — grep for
`:global(.nav` before you believe it is written once.

**And the quantity that sizes that band is the INK, not the line box.** Two
waves compared it against 11.664px, the font-size of the site's smallest meta
label, and passed a band that still crushed whole strings. A reader does not
see a font size. Measured by subtraction at 3x, the rows that change when
"Special Olympics" on /pilots/ is taken off the glass span cap to descender
and are **8.67px**. Wave 15's 10.7px band cleared 11.664 and did not clear
8.67, and the label read 1.43:1 at full coverage under it. Size the band
against 8.67px, with margin.
This file used to describe that as a convention — "the band is what is painted
behind the glyphs" — which is how a hole gets written up as a decision. It was
a hole.

**`tools/glyph-floor.mjs` closes it by not having a model.** It shoots each
frame twice at the same scroll offset, once as it ships and once with the
glyphs taken off the glass with `-webkit-text-fill-color: transparent`, and
takes the glyph pixels as exactly the pixels that changed. The ink is the ON
frame's colour at the stems — after colour alpha, after every ancestor's
opacity, after any blend mode, and after any scrim, wash or overlay painted in
front. The ground is the brightest 3-row band of the OFF frame, which is
ink-floor's rule kept unchanged so the two are comparable; on the homepage
eyebrow they agree to within a few hundredths, which they must, because on a
string with nothing in front of it "observed ink" and "correctly modelled ink"
are the same quantity.

Two things fall out of subtraction for free. Text behind an opaque object
changes no pixels, so occlusion handles itself and the hand-written "drop
content under the bar's box, keep content under its tail" rule is gone. And
the tool does not need to know what the ground is made of, so it is not scoped
to `figure.fig`: it measures **every string on every route at both viewports**,
over photographs, over flat navy, and under the nav tail — which is the only
way the tail's crossings of opaque grounds were ever going to be seen.

So `ink-floor` and `hold-meter` are **deleted**, and `photo-meter` keeps only
its picture-grade half. Three meters answering one question with three
different blind spots is worse than one that is right. Two questions remain
genuinely separate and both still have a tool: `audit` answers "does the
markup declare enough contrast" — a static, DOM-level question that catches
authoring mistakes anywhere on a page without a browser sweep — and
`photo-meter` answers "how is the grade sitting on this picture", which is
about the photograph and not about any type on it.

**Three conventions inside `glyph-floor` worth knowing before you argue with a
number.** The band is three pixel rows, not one, because a 1px FOREGROUND
hairline crossing a glyph box is not the ground behind it — the nav's progress
rule read as 2.31:1 under a brass numeral before that. The frames it MEASURES
on are shot at 3x: a 13px stem is one antialiased device pixel at 1x, so the
ink reads far lighter than its colour and the brass indices on cream came out
at 3.67:1 against an arithmetic 4.79 — the tool was reporting the browser's
antialiasing as ink. At 3x the same string reads 4.761 against that 4.794,
which is the check that says it is measuring ink and not sampling error. The
whole sweep runs at 3x. A two-stage shortcut — locate at 1x, re-shoot the argmin at 3x —
was built and then abandoned, and the reason is worth knowing before anyone
rebuilds it: the 1x bias is not a constant per string, it depends on the
ground, so the 1x curve is a different shape with its minimum somewhere else.
Run that way the tool located the "By invitation" eyebrow at t 0.421 and
called it 8.50:1. It survives as `--find-scale=1` for a quick look, never for
a gate. And — this one was WRONG, so do
not argue from the wave-14 text — a reading used to be discarded unless the
string was painted at HALF its own strongest ink, on the claim that the nav's
scrim tail "dims the ink under it to roughly half, well clear". Measured, the
tail takes the `.ispec__k` labels on /institute/ from 4.96:1 to 1.49:1 at 31%
of their ink, at cascaded alpha 1.00. The rule discarded exactly the defect
the tool was built for, and a second constant — a coverage floor taken on the
core set — discarded it again, because a vertical gradient collapses core
coverage. Both are fixed. A reading is "not painted" only below 6% of its own
ink (the measured wipe-shut state is 3%, the measured crush 31%), coverage is
taken over the changed pixels, and the only crossfade excuse left is one the
CASCADE DECLARES, at alpha < 0.5. Those declared states print under their own
heading; `--faint=0` shows every barely-inked state on the site.

**And the sweep now goes looking for the crossing.** Fixing that constant lets
the tool recognise a crushed reading; it does not make a coarse grid take one.
A string is inside the scrim's fade for about 25px of scroll and the coarse
step is 180px, so the grid stepped over every crossing on the site — which is
why nothing in the suite held wave 14's own fix. The band is fixed in the
viewport and a string is fixed in the document, so the offset where they meet
is a subtraction: each string is now walked through the bottom of the fixed
chrome at three depths, with its document position corrected once from what
the first shot actually saw.

**The number to quote.** The site's tightest ARRIVED type is the 11px
"By invitation" eyebrow on the homepage Forum figure: **4.563:1 on mobile**,
0.06 above AA, at t≈0.275 of the held scene's pinned range. It has been
misquoted twice, each time by a meter that did not sample densely enough —
9.38 at one viewport and one scroll position, then 4.70 on a 16-sample sweep.
`ink-floor` floored it at 4.569 and `glyph-floor` reads 4.503 by subtraction;
the gap is the browser's own antialiasing, and both say the same thing, which
is that the margin on the site's thinnest type is a rounding error and not a
cushion. Anyone touching `--k`, the ink knee, or the cap in the held scene is
caught by `glyph-floor`.

**A trap worth knowing.** `base.css` sets `html { scroll-behavior: smooth }`,
so `window.scrollTo` starts an animation. Any meter that scrolls and then waits
a flat number of milliseconds reads element rects at one offset and pixels at
another. Scroll with `behavior: 'instant'` and wait for `scrollY` to stop.
**This applies to `tools/shoot.mjs` too, and did not reach it until wave 12** —
every blind comparison this project ran before then was scored off frames that
caught our reveals at 30–50% opacity. `progress/gauntlet/w11/blind-desktop/`
is what that looked like. It now uses the same instant-scroll-and-settle the
meters do; `SETTLE_MS` overrides the wait.

And scroll-still is not the same as settled, twice over. The nav carries 460ms
`transition: color` rules, so a frame taken 90ms after the scroll stops
photographs a crossfade — the wordmark reads 1.46:1 half way between ink and
cream, which is not a defect and is not reproducible. Worse, `data-reveal`
fires from an IntersectionObserver on a later task than the scroll, so a
single "nothing is animating" check can pass in the gap BEFORE the reveal
starts and catch a name at opacity 0.54: a settled 5.21:1 photographs as
2.96:1. Wait for quiet, wait again, and only then shoot.

## Where things live

| Path | Owns |
| --- | --- |
| `src/styles/tokens.css` | palette, type scale, spacing, motion easings |
| `src/styles/base.css` | resets, type primitives, layout primitives, reveal system |
| `src/scripts/motion.js` | reveal / masked-line / parallax engine |
| `src/data/site.js` | **all copy and facts** — never hard-code content in a component |
| `src/components/Figure.astro` | the house image grade (navy multiply + grain) |
| `src/components/scenes/*.astro` | homepage scenes, one idea each |
| `src/pages/*.astro` | the six pages |

## House rules

- **Copy budget.** Homepage body copy 80–120 words total. Any section: at most
  3 short supporting lines. Pilot card: problem / approach / goal, one line each.
  A person is a name and one title line.
- **Type system is closed.** Newsreader (serif, display only) + Libre Franklin
  (sans, everything else). No third family, no new weights outside 200–800.
- **Colour is closed.** Navy ground, cream type, brass accent. Nothing else.
  Use `.on-cream` to invert a scene; do not invent new surfaces.
- **Motion is hierarchy, not decoration.** Use `data-reveal`, `.lines`, and
  `data-parallax`. Everything must be inert under `prefers-reduced-motion`.
- **One idea per scroll scene.** If a section needs a second idea, it is two
  scenes or it is cut.
- Never transcribe the prospectus. Facts only, rewritten short.
- **Comments in markup use `{/* … */}`, never `<!-- … -->`.** Astro ships an
  HTML comment to the browser; it strips a JSX one at build. This repo's
  comments are long, candid, and full of the working history — 72 of them were
  shipping in view-source, including one on the homepage that read "the four
  institutions that agreed to run a pilot", which is false and is the exact
  claim the whole site is built to avoid. On a link going to funders and
  journalists, view-source is part of the page. `{/* */}` is the house form;
  CSS `/* */` inside `<style>` is fine, the minifier strips it.
- **Every string must be traceable to `refs/PROSPECTUS.txt` or `refs/BRIEF.md`,
  and the prospectus wins any conflict.** It is the client's own document and
  it supersedes the brief, which was a summary written before it.
  The prospectus heads its pilot list "FOUR ACTIVE PILOTS — 2026" and says the
  Institute "is working with" three of the four named partners, so `status` is
  Active for 01–03 and Exploring for 04 — the earlier house line here, "the
  pilots are proposed, no partner is signed", was an authored negative no
  source ever carried and it put "None is signed" on eleven places on the
  site. Do not restore it. Equally, do not write that a partner has SIGNED:
  no source says that either. The board is put forward and not seated (the
  prospectus heads it "PROSPECTIVE BOARD MEMBERS"), and no budget, baseline
  or start date exists. The one figure that does is the prospectus's own
  "typical $2 million annual Core Partnership" — $1M core support, $1M
  dedicated pilot funding — and it is on /partner/ with "typical" kept.
  Six separate waves have now found invented specifics in this repo. If removing one leaves a hole, leave the hole and
  record what is needed in `CONTENT-NOTES.md`. Never replace an invented
  specific with a different invented specific.
- No satire, no startup hype, no slogans that are not in `refs/BRIEF.md`.

## Reference

`refs/oryzo/` holds the craft bar at the same viewports we shoot
(desktop 1440×900, mobile 390×844). `refs/PROSPECTUS.txt` is the client's
canonical fact sheet, `refs/BRIEF.md` is the brief, and `refs/PHOTO-FACTS.md`
says what each photograph actually shows. All three win any argument with this
file; between them, the prospectus wins on fact and the brief wins on scope.
