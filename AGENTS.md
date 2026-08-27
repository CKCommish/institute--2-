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
node tools/audit.mjs        # contrast, overflow, heading order, alt text, tap targets, dead links
node tools/photo-meter.mjs  # type over photographs — both viewports, swept through the frame
node tools/nojs-meter.mjs   # all 7 routes x 2 viewports with JavaScript OFF
node tools/perf.mjs         # page weight, LCP, CLS at load and through a full scroll
node tools/hold-meter.mjs / # the homepage held scene, sampled across its pinned range
```

These are gates, not diagnostics. A wave is not done until all five are green,
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

**Two numbers to quote correctly.** The site's tightest type-over-photograph is
the 11px "By invitation" eyebrow on the homepage Forum figure: **4.70:1 on
mobile**, 0.20 above AA, at the bottom of the parallax travel. It was long
reported as 9.38:1 — photo-meter measured one viewport at one scroll position
and overstated it by 58%. The next thinnest is **4.79:1**, the 13px brass
section indices. Quote 4.70, not 9.38.

**A trap worth knowing.** `base.css` sets `html { scroll-behavior: smooth }`,
so `window.scrollTo` starts an animation. Any meter that scrolls and then waits
a flat number of milliseconds reads element rects at one offset and pixels at
another. Scroll with `behavior: 'instant'` and wait for `scrollY` to stop.

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
