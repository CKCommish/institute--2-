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

## The seven gates — run all of them before you report

```bash
node tools/gates.mjs        # all seven, in parallel, one verdict — THIS IS THE WAY TO RUN THEM
```

It builds to its own `dist-gates-<hash>`, serves it on a port the OS hands
out, and runs the seven below in a pool. Nothing is shared, so two builders
can run it at the same moment — which is what wave 12 could not do, and why
two racing runs reported a phantom failure. It caches each gate's verdict
against the hash of the source tree AND of the gate's own file, so a re-run
on an unchanged build is instant; `--fresh` ignores the cache. Whole suite:
**4m03s** wall, against ~13min of running them one at a time.

```bash
node tools/audit.mjs        # contrast, overflow, heading order, alt text, tap targets, dead links
node tools/photo-meter.mjs  # type over photographs — both viewports, swept through the frame
node tools/ink-floor.mjs    # the MINIMUM of every type-over-photograph contrast curve
node tools/nojs-meter.mjs   # all 7 routes x 2 viewports with JavaScript OFF
node tools/nojs-diff.mjs    # the same routes compared as PICTURES, script on vs script off
node tools/perf.mjs         # page weight, LCP, CLS at load and through a full scroll
node tools/hold-meter.mjs / # the homepage held scene, sampled across its pinned range
```

These are gates, not diagnostics. A wave is not done until all seven are green,
and "I read the DOM and it looked right" is not one of them.

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

**Why `ink-floor` exists, and what it settles.** The site's tightest number
had no gate on it and had been misquoted twice, each time by a meter that
sampled where the minimum was not. `photo-meter` parks a FIGURE at five
fractions of the viewport — but a held stage is `position: sticky`, so it
does not move when the page scrolls and those five stops collapse to
roughly one; and it composites type using the element's own colour alpha
only, ignoring `opacity` on the element and every ancestor, so a beat at
--be 0.55 is read as fully inked cream. That is where its 7.19:1 came from.
`hold-meter` cascades opacity properly and sweeps the pin, which is why it
read 4.17:1 on the same string — **the cascaded reading is the honest one**,
and photo-meter's blindness to ancestor opacity is a real defect in it, not
a difference of convention. But hold-meter samples 17 fixed positions on one
scene of one route. Neither is a superset of the other.

`ink-floor` measures one quantity — cascaded ink against the brightest
3-row band of what is actually painted behind the glyphs — for every string
over a photograph on every route at both viewports, and it does not sample
the curve, it MINIMISES it: a coarse vh/5 sweep, then the coarse argmin
trisected to ≤8px. Two conventions in it are worth knowing: the band is
three pixel rows, not one, because a 1px foreground hairline crossing a
glyph box is not the ground behind it (the nav's progress rule read as
2.31:1 under a brass numeral before that); and it waits for CSS transitions
to finish as well as for the scroll to stop, because the nav's 460ms colour
transition photographs as 1.46:1 halfway through and is not reproducible.

**Two numbers to quote correctly.** The site's tightest type-over-photograph is
the 11px "By invitation" eyebrow on the homepage Forum figure: **4.563:1 on
mobile**, 0.06 above AA, at t≈0.275 of the held scene's pinned range. It has
now been misquoted twice, each time by a meter that did not sample densely
enough. It was 9.38 while photo-meter measured one viewport at one scroll
position — 58% too generous. It was then 4.70 on a 16-sample sweep; at 40
samples the same curve floors at 4.563. The next thinnest is **4.79:1**, the
13px brass section indices.

Two things follow. **Quote 4.563, not 4.70 and not 9.38.** And note what the
correction means: the margin on the site's tightest type is 0.06, not 0.20,
and it always was — wave 12's `floor` change did not move it (the minimum
sits where `--open` is 1 and `floor` contributes nothing by construction;
verified by re-sweeping the pre-change build). No gate is positioned to catch
this number moving: photo-meter samples one position and steps past the
shoulder, hold-meter's 17 positions step past the minimum, and during wave 12
the two instruments read the same string as 4.17:1 and 7.19:1. Anyone
touching `--k`, the ink knee, or the cap in `HeldScene.astro` is now caught
by `ink-floor`: weakening the cap by 0.015 of alpha — a change photo-meter
still calls clean — drops the eyebrow to 4.453:1 and fails the gate.

Wave 13 re-measured the number and it did not move: `ink-floor` floors that
curve at **4.569:1** under its own 3-row band rule, **4.562:1** under the
single-row convention the 4.563 was quoted in. Quote 4.563; it is right.

**A trap worth knowing.** `base.css` sets `html { scroll-behavior: smooth }`,
so `window.scrollTo` starts an animation. Any meter that scrolls and then waits
a flat number of milliseconds reads element rects at one offset and pixels at
another. Scroll with `behavior: 'instant'` and wait for `scrollY` to stop.
**This applies to `tools/shoot.mjs` too, and did not reach it until wave 12** —
every blind comparison this project ran before then was scored off frames that
caught our reveals at 30–50% opacity. `progress/gauntlet/w11/blind-desktop/`
is what that looked like. It now uses the same instant-scroll-and-settle the
meters do; `SETTLE_MS` overrides the wait.

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
