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
- No satire, no startup hype, no slogans that are not in `refs/BRIEF.md`.

## Reference

`refs/oryzo/` holds the craft bar at the same viewports we shoot
(desktop 1440×900, mobile 390×844). `refs/BRIEF.md` is the brief and wins any
argument with this file.
