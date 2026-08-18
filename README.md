# Lion Forum Institute

A static site for the Lion Forum Institute — an organisation that runs short,
measurable pilots to make sure emerging technology reaches American families.

Astro 5, no UI framework, hand-written CSS. Ships as static HTML.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview
```

## Structure

```
src/
  data/site.js            all copy and facts — the single source of content
  styles/tokens.css       palette, type scale, spacing, easings
  styles/base.css         resets, type + layout primitives, reveal system
  styles/fonts.css        self-hosted variable font faces
  scripts/motion.js       reveal / masked-line / parallax engine
  components/             Nav, Footer, Figure (the house image grade)
  components/scenes/      homepage scenes, one idea each
  pages/                  home, pilots, institute, forum, people, partner
public/
  fonts/                  Newsreader + Libre Franklin, variable, subset to latin
  media/                  photography (all public domain — see ATTRIBUTIONS.md)
refs/                     the brief, the craft reference, photo provenance
tools/                    capture, blind-compare, audit, progress-page harness
```

## The design system, in one paragraph

Deep navy ground, cream type, a single brass accent used for indices, rules and
one hover state. Two typefaces and no more: **Newsreader** for display, **Libre
Franklin** (Franklin Gothic lineage — the American civic grotesque) for
everything else, both self-hosted as variable fonts. Motion has exactly three
primitives — a staggered reveal, a masked line-by-line reveal for display type,
and scroll parallax on full-bleed media — and all three are inert under
`prefers-reduced-motion`. A scene inverts to cream by adding `.on-cream`; there
are no other surfaces.

## Editing content

Everything a non-developer would want to change lives in `src/data/site.js`:
the mission line, the four pilots, the method, the founders, the prospective
board, and the Forum copy. Components read from it; nothing is hard-coded.

Copy discipline is part of the design. Homepage body copy stays between 80 and
120 words; a pilot gets one line each for problem, approach and goal; a person
is a name and one title line. If a section needs more, it is a different page.

## Photography

Every image in `public/media/` is public domain (Library of Congress Carol M.
Highsmith Archive, or U.S. federal works), so the rendered site carries no
attribution notice. The full record is in `public/media/ATTRIBUTIONS.md`.

`refs/PHOTO-FACTS.md` records what each photograph *actually* shows and which
claims the site must therefore not make. Read it before moving an image or
writing a caption.

Two portraits are deliberately absent: there is no rights-cleared photograph of
either founder. Drop `founder-mckelvy.jpg` and `founder-olanoff.jpg` into
`public/media/` and the People page will use them.

## Before this goes public

See `CONTENT-NOTES.md`. The prospective-board titles in particular are
best-effort and need confirming with each person.

## The harness

The site was built against a fixed craft reference, captured at the same
viewports we shoot.

```bash
node tools/capture-oryzo.mjs                     # refresh the reference stills
BASE=… node tools/shoot.mjs <label>              # capture our pages, desktop + mobile
node tools/blind.mjs <shotsDir> desktop <out>    # unlabeled A/B sheets
node tools/reveal.mjs <out> <picks.json>         # score after committing picks
BASE=… node tools/motion-strip.mjs / out.png     # frames sampled mid-scroll
BASE=… node tools/audit.mjs                      # contrast, overflow, headings,
                                                 # alt text, tap targets, dead links
node tools/build-progress.mjs                    # rebuild the progress page
```

Browsers in this environment must be launched via `tools/browser.mjs`: the
egress proxy re-terminates TLS and rejects Chrome's TLS 1.3 ClientHello, so
outbound browser traffic is pinned to TLS 1.2. Local traffic bypasses the proxy.
