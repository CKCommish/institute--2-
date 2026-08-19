# What the reference actually does — measured, not inferred

The Oryzo stills in `refs/oryzo/` were captured by scrolling to a position and
waiting three seconds for everything to settle. For a scroll-driven site that
records the one thing that matters least. `tools/capture-motion.mjs` fixes this:
it samples frames mid-transition during a continuous wheel scroll, and it
instruments the page. Raw output: `refs/oryzo-motion/behaviour.json` and
`refs/ours-motion/behaviour.json`.

## The finding

| | Oryzo | Ours |
| --- | --- | --- |
| Canvases | **1 × WebGL2, 1440×900, `position: fixed`**, plus 5 × 2D feeding it | none |
| Scroll | native, not hijacked | native (`scroll-behavior: smooth` affects anchor jumps only) |
| DOM elements whose transform / opacity / clip-path change per 260px of scroll | **0** | 0 at rest, 3 vectors on entry |

Across a 260px scroll delta, every large Oryzo element holds `transform: none`,
`opacity: 1`, `clip-path: none`. Only their scroll position changes. **Oryzo's
DOM is inert text scrolling over a fixed 3D canvas.** Every bit of the motion
craft lives inside one WebGL scene driven by `scrollY`.

## What this means for us

**We are not behind on motion.** We run three DOM motion vectors — masked line
reveals, clip-path wipes, scroll-linked settle. The reference runs none. It has
a renderer we do not have and, per the brief, must not build: "no WebGL for its
own sake", and do not remake the 3D cork-coaster world. Chasing the reference's
interaction is chasing the thing the brief says loses.

**But one thing is transferable, and it is structural rather than technical.**

The reason Oryzo feels cinematic with zero DOM animation is that its visual
layer is `position: fixed` and full-viewport. The picture holds still; the text
travels across it. That is what makes a scroll read as a sequence of *scenes*
rather than as a well-set document.

Our site never does this. Every photograph is in normal flow and scrolls away
with its own section — see `refs/ours-motion/desktop-scroll-*.png`, where the
hero image is gone by frame 2. A `position: sticky` or fixed full-bleed plate
with content scrolling over it needs no WebGL, no library, and nothing outside
the existing palette and grade.

Fifteen critics across three waves have been unable to name one moment on this
site a designer would screenshot. This is the strongest available candidate, and
it is the only structural idea the reference has that we do not.

## The grammar, read off the frames

`refs/oryzo-motion/desktop-scroll-1.png` and `-2.png` are thirty frames sampled
during a continuous wheel scroll. Read together they show one move, repeated:

1. **The subject is held.** The coaster sits in the same place on screen for
   roughly fifteen consecutive frames — about two and a half viewport heights of
   scrolling. It never scrolls away.
2. **The environment falls away.** Frames 1-3 push the camera in and let the
   desk scene darken to near-black, isolating the subject. That is a tonal
   reset *inside a single scene*, not between two sections.
3. **The subject transforms continuously.** Across the held frames the coaster
   rotates from flat top-down, through edge-on, to face-on. It is never static
   and never jumps.
4. **The text is what travels.** "ISN'T JUST A COASTER." fades up, holds, fades
   out; "Powered by AI" fades up in its place — all while the subject stays put.

That is the whole thing: **hold the visual, move the type.** Our site does the
exact inverse — the type holds its column and the photographs scroll past it.

## The 2D translation, which needs no WebGL

Every element of that grammar has an honest CSS equivalent:

| Oryzo | Ours |
| --- | --- |
| fixed WebGL canvas | `position: sticky` full-bleed figure, held 2-3 viewport heights |
| camera push-in | scroll-linked scale on the held image (we already have `data-settle`) |
| environment darkening to isolate the subject | scroll-linked grade on the held figure — a tonal event inside one scene |
| object rotating | cross-fade to a second photograph inside the held frame |
| text beats fading through | successive short beats revealed and retired over the held image |

This is the existing palette, the existing grade, the existing motion engine and
`position: sticky`. Nothing new is required and nothing in the brief is broken.

## Caveat

Pin one scene, not several. A site where every section pins is a gimmick, and
gimmick is a tone failure on a civic institute's site. The point is one held
image at the moment the argument needs weight — most likely the Forum, whose
photograph is the most evocative asset the Institute has, or the hero.

Verify any pinned scene at 390×844 and under `prefers-reduced-motion`, and check
that type over the held image still clears 4.5:1.
