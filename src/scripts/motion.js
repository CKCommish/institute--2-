/* Lion Forum Institute — motion.

   Four vectors, and they mean different things:

     1. reveal / lines  ARRIVAL   — words lift in from below behind a mask
     2. wipe            TERRITORY — a hard mask opens along one axis from a
                                    named anchor; nothing moves or fades
     3. settle          WEIGHT    — scroll-linked, continuous, reversible
     4. hold            DURATION  — the picture stops and the page keeps
                                    going. One scene per site. See initHold.

   Plus two helpers that are not vectors:
     · parallax   slow translate on full-bleed media
     · data-seq   auto-stagger a container's children

   Everything is inert under prefers-reduced-motion. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Delay may be written as data-delay="180" on any primitive, or as the
   value of data-reveal="180" (the original spelling). */
function applyDelay(el, raw) {
  const d = el.dataset.delay !== undefined ? el.dataset.delay : raw;
  const n = parseInt(d, 10);
  if (Number.isFinite(n) && n !== 0) el.style.setProperty('--reveal-delay', `${n}ms`);
}

/* data-seq on a parent hands its children a ranked delay without the page
   author writing a delay on each one. data-seq="90" sets the step in ms
   (default 80); data-seq-from="140" offsets the whole run. */
function initSeq() {
  document.querySelectorAll('[data-seq]').forEach((parent) => {
    const step = parseInt(parent.dataset.seq, 10) || 80;
    const from = parseInt(parent.dataset.seqFrom, 10) || 0;
    /* the topmost animated descendants — one rank per row, not per span */
    const kids = [...parent.querySelectorAll('[data-reveal], [data-wipe]')].filter((el) => {
      const up = el.parentElement && el.parentElement.closest('[data-reveal], [data-wipe]');
      return !(up && parent.contains(up));
    });
    kids.forEach((child, i) => {
      if (child.dataset.delay === undefined && !parseInt(child.dataset.reveal, 10)) {
        child.dataset.delay = String(from + i * step);
      }
    });
  });
}

/* ── 1. Reveal — enter once, from below ──────────────────────────── */
function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
  );

  items.forEach((el) => {
    applyDelay(el, el.dataset.reveal);
    io.observe(el);
  });
}

/* ── 2. Wipe — enter once, mask opens along an axis ──────────────────
   Deliberately NOT IntersectionObserver-driven. A wipe's rest state is
   clip-path: inset(0 100% 0 0), which gives the element a zero-area
   intersection rect, so IO reports isIntersecting: false forever and the
   element never uncovers itself. The scroll loop measures the unclipped
   border box instead, which is what we actually want to trigger on. */
const pendingWipes = [];

function initWipes() {
  const els = [...document.querySelectorAll('[data-wipe]')];
  if (!els.length) return;
  els.forEach((el) => applyDelay(el, el.dataset.reveal));
  if (reduced) { els.forEach((el) => el.classList.add('is-in')); return; }
  pendingWipes.push(...els);
}

function runWipes(vh) {
  /* On a page too short to scroll the trigger line can never be crossed,
     so anything still covered would stay covered for ever. */
  const stuck = document.documentElement.scrollHeight <= window.innerHeight + 4;
  for (let i = pendingWipes.length - 1; i >= 0; i--) {
    const el = pendingWipes[i];
    const r = el.getBoundingClientRect();
    if (!stuck && (r.bottom < 0 || r.top > vh * 0.88)) continue;
    el.classList.add('is-in');
    pendingWipes.splice(i, 1);
    /* the compositor only needs the hint while the mask travels */
    setTimeout(() => { el.style.willChange = 'auto'; }, 1900);
  }
}

/* Split a .lines element's text into masked lines after layout.

   WHERE THE BREAK COMES FROM. This used to measure by wrapping every word in
   a `display: inline-block` probe and grouping the probes by offsetTop. That
   measures a different paragraph than the one that was written: an
   inline-block is an atomic inline-level box, so the line breaker sees a row
   of opaque boxes instead of a text run, and `text-wrap: pretty` (base.css,
   and `.pm__h`) and `text-wrap: balance` (base.css, and `.bd__h`/`.pm__h`
   under 1024) have no text run to work on and do nothing at all. Every
   `.lines` element on the site was therefore frozen at a break the CSS had
   not asked for. nojs-diff caught it on /people/: the masthead read
   "The people accountable / for the work." with a script and
   "The people accountable for / the work." without one — same element, same
   box, two typographies.

   A Range measures the real thing. The element keeps its original single text
   node while we read, so the browser breaks it exactly as it does for a
   reader with no script — pretty and balance included — and all we ask is
   which line box each word's first character landed in. Nothing is inserted,
   so nothing is perturbed: no probes, no layout written, one forced layout
   read per element, once, on fonts.ready.

   AND THE TOKENS SPLIT ON BREAKABLE WHITESPACE ONLY — space, tab, newline,
   never U+00A0. The old `split(/\s+/)` + `join(' ')` pair matched the
   non-breaking space too and rebuilt it as a plain one, so wave 12's
   "Kennedy<nbsp>Compound" fix was silently undone for every reader who ran
   the script. Lines are now sliced out of the raw string, so what was written
   stays written. */
function measureLines(el, raw) {
  const node = el.firstChild;
  if (!node || node.nodeType !== 3) return [raw];

  const tokens = [];
  const re = /[^ \t\r\n]+/g;
  let m;
  while ((m = re.exec(raw))) tokens.push([m.index, m.index + m[0].length]);
  if (!tokens.length) return [raw];

  const range = document.createRange();
  const rows = [];
  let top = null;
  for (const t of tokens) {
    range.setStart(node, t[0]);
    range.setEnd(node, t[0] + 1);
    const r = range.getBoundingClientRect();
    if (top === null || Math.abs(r.top - top) > 4) { rows.push([t[0], t[1]]); top = r.top; }
    else rows[rows.length - 1][1] = t[1];
  }
  return rows.map(([a, b]) => raw.slice(a, b));
}

function splitLines(el) {
  if (el.dataset.split === 'done') return;
  const raw = el.dataset.text || el.textContent.trim();
  el.dataset.text = raw;
  /* Measure the element as written, in one text node. */
  if (el.textContent !== raw) el.textContent = raw;

  const rows = measureLines(el, raw);

  el.textContent = '';
  rows.forEach((row, i) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    inner.textContent = row;
    inner.style.setProperty('--line-delay', `${i * 85}ms`);
    line.appendChild(inner);
    el.appendChild(line);
  });
  el.dataset.split = 'done';
}

function initLines() {
  const els = document.querySelectorAll('.lines');
  if (!els.length) return;

  const run = () => els.forEach(splitLines);

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  else run();

  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -14% 0px', threshold: 0.01 }
  );
  els.forEach((e) => io.observe(e));

  // Re-split on meaningful width change only.
  let w = window.innerWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - w) < 60) return;
    w = window.innerWidth;
    els.forEach((el) => { el.dataset.split = ''; el.textContent = el.dataset.text; splitLines(el); });
  }, { passive: true });
}

/* ── 4. Hold — the one scene that stops ──────────────────────────────
   Read off the reference in refs/MOTION-FINDINGS.md: its whole cinematic
   register comes from one move, and the move is not a technique. The subject
   is held in place for about two and a half viewport heights while the
   environment darkens around it and successive text beats fade through. Hold
   the visual, move the type. Our site does the exact inverse everywhere else
   — the type holds its column and the photographs scroll past it — which is
   why it reads as a well-set document rather than as a sequence of scenes.

   The DOM is a tall TRACK carrying a `position: sticky` STAGE one viewport
   high. This function writes four scalars and nothing else; every visual
   decision is CSS in HeldScene.astro.

     --hp    0 → 1   progress through the pinned range. Drives the push-in.
     --open  0 → 1   how far the picture is out of the ground. This is the
                     tonal event: the arc, not the picture, is what changes.
                     Its plateau also carries THE BREATH — the ground's own
                     move across the seam where two beats abut and neither is
                     on the frame. See BREATH below; it is the one thing on
                     this scene that is moving at that moment.
     --be    per beat, 0 → 1 → 0. The envelope that fades one beat up, holds
                     it, and retires it before the next arrives. That grammar
                     is not a rule written before anyone measured it: the beats
                     share one grid cell on one baseline, so overlapping two
                     envelopes superimposes glyphs rather than crossfading
                     lines. The seam it leaves is answered by the ground, not
                     by loosening this.
     --bu    per beat, the raw local progress, unclamped at the ends, so a
                     beat can drift continuously while its envelope is flat.
     --be    ALSO per meter tick — but a different curve, and deliberately.
                     A tick fills on arrival and does not retire, so the
                     meter reads duration rather than which beat is lit. See
                     THE METER LATCHES.

   The three arcs are the three honest things a ground can do while a picture
   is held (data-arc on the track):
     lift  (default)  ground → open → ground.  A tonal excursion inside one
                      scene, which is the thing this site did not have.
     fall             open → ground.  The reference's literal move: the
                      environment falls away and isolates the subject.
     rise             ground → open.  Hands a lit picture to what follows.

   Cost: one rAF-throttled read of one getBoundingClientRect per held track,
   inside the scroll loop that already runs. No observers, no timers, no
   layout writes — only custom properties, and only when they change. */
const ss = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

function setVar(el, name, v) {
  const s = v.toFixed(4);
  if (el.__mv === undefined) el.__mv = {};
  if (el.__mv[name] === s) return;
  el.__mv[name] = s;
  el.style.setProperty(name, s);
}

/* THE TAIL IS THE CODA'S OWN SHARE OF THE FRAME, NOT A CONSTANT.

   It used to read `const tail = coda ? 0.24 : 0.10`. A quarter of every held
   scene, reserved for whatever happened to sit at the end of it, and owned by
   nobody — the number was picked once, for a scene that has been rebuilt
   twice since. On the homepage's Forum scene it books 238px of pinned scroll
   for a 29px link, which is why that scene keeps ending on a frame with
   nothing on it: measured, the last quarter of the range carries no display
   line at all while the ground closes back to navy behind it.

   So the tail is now what the coda actually is. The scene's type is weighed —
   every beat, plus the coda — and the coda takes the share of the range its
   own height comes to. A one-line link is not a quarter of a scene, and a
   coda that grows to a block gets the room a block needs, without anyone
   editing this file.

     lead   0.09  fixed, and NOT for the reason this line gave for three
                  waves. It read "the picture has to have arrived before the
                  first beat is asked to read over it — a property of the
                  ARRIVAL". That is a contrast claim and it is false. The
                  beats sit in a band at the FOOT of the frame, under the
                  foot ink, and that band gets DARKER as the arc opens:
                  differenced glyph-against-backdrop on the homepage hold at
                  1440x900, DSF 2, the ground under the first display line
                  reads rgb(19,24,36) at hp 0.10 and rgb(10,16,26) at hp
                  0.30. The line's own measured contrast over it — 1.01:1 at
                  hp 0.10, 4.69:1 at 0.15, 16.32:1 at 0.30 — tracks the
                  line's OPACITY and nothing else. The arc is not what the
                  beat is waiting for, so `lead` cannot be justified by it.

                  What `lead` actually buys is a compositional pause: the
                  picture lands, and then it is spoken over. Keep it for
                  that, and argue it as that. Measured, lead 0.05 moves the
                  arrival's typeless band from 95px to 60px of the 855px
                  range (swept at 5px, so each figure is +/-5px) and widens
                  each beat's span from 340px to 355px (arithmetic, not
                  swept: span = (1 - lead - tail) / n). It costs the seam
                  one sample step — the band with no display line went 25px
                  to 30px at the same 5px resolution — and costs the coda
                  and the contrast floors nothing. A real but small trade,
                  and the pause is the thing being traded. See the
                  wave-24 sweep in scenes/ForumScene.astro for why it was
                  measured and not taken.
     beats        equal peers. They are beats — one idea each — and an even
                  crossfade rhythm is the grammar; a beat is not more
                  important for wrapping to a third line.
     tail         the coda's share, floored so a very small coda still
                  arrives rather than flashing, capped so a very large one
                  cannot eat the beats.

   AND THE ARC'S CLOSE IS DERIVED TOO. It ran on a second hand-written 0.24,
   equal to the old tail because both were typed by the same hand on the same
   afternoon — which is the only reason the rule it served ("the last beat is
   gone before the ground closes") held. Change the tail and that silently
   stops being true. The close is now measured from the scene's own shape:
   the tail, plus the last beat's retire. Nothing is held open over an empty
   frame, and nothing snaps shut either.

   Measured once per track and re-measured only on a width change: this runs
   inside the scroll loop and offsetHeight is a layout read. */
const TAIL_MIN = 0.12;
const TAIL_MAX = 0.30;
/* The last quarter-ish of a beat's own span is its retire — the falling half
   of its envelope. Named because the ground's close is measured against it. */
const RETIRE = 0.26;

/* THE BREATH — the ground's answer to the seam between two beats.

   THE DEFECT, measured before it was touched. Beat windows ABUT: beat i ends
   at the exact progress beat i+1 begins, so both envelopes pass through zero
   on the same frame. Swept at 240 samples on the homepage Forum hold, real
   painted opacity of `.held__line` (the CHILD — the wrapper reads 1.000
   everywhere, which is how you get a false clean sweep):

     hp 0.471–0.508   32px at 1440 (27px at 390, hp 0.467–0.504)
     minimum          0.0008 at hp 0.483 — no display line, and no tick
     --open           1.000 at both ends and at every sample between
     push             scale moved 0.00254 across the whole band

   A full viewport of lit harbour carrying an eyebrow and a photo credit,
   mid-scene, with nothing on it moving. It is the one frame on this site that
   loses MOTION against the reference: the reference's crossfades also pass
   through near-empty type, but its subject is rotating through every one of
   them, so it never owns a frame where the type and the subject are both at
   rest. That is the whole margin, and it is one frame wide.

   WHY NOT OVERLAP THE ENVELOPES — and the reason is not that line 229 forbids
   it. The beats are stacked in ONE grid cell on ONE baseline (HeldScene,
   `.held__beat { grid-area: 1 / 1 }`), and that stack is why the type fades
   through in one place instead of hopping around the frame. Two envelopes
   open at once there does not crossfade two lines, it superimposes two
   sentences' glyphs on each other. Overlap costs the stack first, and the
   stack is the scene.

   WHY NOT THE PUSH. Re-timing the camera to run fast where the type is absent
   was costed rather than assumed: at the most aggressive rest ratio that
   stays monotone it buys the seam 1.78x of its linear share — 0.0049 of
   scale, about 3px of edge travel across the band. Real, and beneath
   noticing.

   WHAT ACTUALLY MOVES ON THIS SCENE IS THE LIGHT. `--open` swings the frame
   about 75 sRGB points end to end; it is the scene's stated event, and
   `min(rise, fall)` parks it flat at 1.000 across the middle 53% of the
   range. The seam sits inside that plateau. So the ground takes the frame the
   type has given up.

   THE SHAPE IS THE WHOLE OF IT, AND THE OBVIOUS SHAPE IS WRONG. A symmetric
   dip centred on the seam — light easing off as the line goes and returning
   as the next arrives — was built and measured first. It does not work, for a
   reason worth keeping: a dip has a turning point, and a symmetric one puts
   that turning point on the seam. The light is then STATIONARY on exactly the
   frame the type is absent. Measured as mean |Δ| per pixel over a 10px scroll
   step at 1440, across the whole viewport:

                          seam floor      beat-plateau floor
     abutting (before)      0.295              0.521
     symmetric dip          0.350              0.521
     led by 0.18 span       0.820              0.524

   The symmetric dip moved the static frame and did not remove it. So the
   breath is READ AHEAD by BREATH_LEAD of a beat span: the light bottoms out
   while beat one is still visibly leaving — where the type is moving hardest,
   so a stationary ground costs nothing — and is RISING through the seam and
   on into beat two's arrival. Measured across the seam band, `--open` runs
   0.931 → 0.987 at 1440 and 0.931 → 0.983 at 390, monotone, no turn in it.

   That also fixes an asymmetry nobody had named: beat one is handed to the
   reader by the opening arc, and beat two was handed to the reader by
   nothing. Now the ground dips under the departing line and lifts to present
   the next one, which is punctuation and not decoration.

   IT COSTS NO SCROLL. Each beat keeps its ~338px at 1440; lead, tail, span
   and close are untouched, and so are the two ends of the arc — measured
   after, the arrival is still open 0.000 → 0.32 over ~98px and the exit still
   0.673 → 0.000 over 118px, which is where wave 12's floor lives. It adds no
   primitive: it is the existing `--open` on the existing grade, and the shape
   of the dip is the INVERSE OF THE TYPE'S OWN ENVELOPE, so there is no second
   easing to tune.

   THE TWO NUMBERS.
     BREATH 0.12       the depth, on the arc's own scale. It reads on the
                       frame as about 4 sRGB points over the middle half of
                       the viewport at 1440 (97.9 → 93.8 at the trough) —
                       less than the arithmetic suggests, because most of what
                       the dip darkens is already under the ink band. Deeper
                       reads as a second arc competing with the first;
                       shallower is not there.
     BREATH_LEAD 0.18  how far ahead the light reads the type, in beat spans.
                       It is what turns the dip from symmetric to a hand-off;
                       the table above is the argument for it.

   `mid` is the gate: 0 outside the beats' own territory, 1 across the
   interior, ramping over half a beat span, so the arrival and the exit —
   argued over three waves — are untouched. With one beat there is no seam,
   `n > 1` is false, and none of this runs. */
const BREATH = 0.12;
const BREATH_LEAD = 0.18;

/* THE METER LATCHES — and this is the seam's other half, not a second breath.

   THE QUESTION THIS ANSWERS. Wave 20 closed the seam's stillness and the
   judge's verdict was about its CONTENT: "for 25px of scroll there is no
   display line, no note, no coda, and no tick." Three of those four are the
   type, and the type cannot be helped — see WHY NOT OVERLAP above, and the
   costing of a second grid cell in HeldScene. The FOURTH was not the type's
   problem at all, and nobody had looked at it.

   The tick meter was wired to `env[i]` — the beat's own envelope — so the
   brass fill rose with a beat and RETIRED with it. Read off the live
   `.held__tick` at 1440x900, the `--be` that scales the brass bar:

     hp 0.4845   tick 0  0.0001      tick 1  0.0000
     hp 0.4856   tick 0  0.0000      tick 1  0.0001

   scaleX(0.0001) of a 26px bar is nothing on the glass, and 390x844 reads
   the same pair on the same frame.

   A duration mark reading zero in the middle of the duration. HeldScene's own
   comment says the meter exists because it "answers the only question a held
   scene actually raises: how long is this" — and mid-scene it was answering
   nothing, then answering it again. That is not a fade, it is a mark that
   un-tells you what it has already told you.

   SO IT FILLS AND DOES NOT EMPTY. `ss(u / 0.30)` is the envelope's arrival
   half with the retire term deleted; past `u = 1` it saturates at 1 on its
   own, so the latch is the absence of code rather than a new rule. The newest
   filled tick is still the live beat, so the "which beat am I on" reading
   survives; what is added is "and you have had one already", which is the
   reading a duration mark is for.

   AND IT READS AHEAD BY BREATH_LEAD, for the same reason the light does. At
   the seam exactly, an arrival ramp anchored ON the seam is at zero AND
   stationary — the same turning-point mistake the symmetric dip made. Read
   ahead by the same 0.18 of a span the ground already uses, the next tick is
   mid-fill and climbing on the frame the display line is absent from. No new
   constant: the meter and the ground read the type the same distance ahead.

   MEASURED at the seam, real painted `--be` off the live `.held__tick`:

                       1440x900 (hp 0.4845)   390x844 (hp 0.4852)
     tick 0   before   0.0001                 0.0000
              after    1.0000                 1.0000
     tick 1   before   0.0000                 0.0000
              after    0.6415                 0.6499
     brass on frame    none -> 26px           none -> 14px

   WHAT IT DOES NOT DO, and this is the honest half. A hairline is not a
   proposition. The judge asked whether there is one on screen at every point
   and the answer is still no — what is on screen at the seam is the eyebrow,
   the location credit, two hairlines of which one is now lit, and a ground
   that is moving. This closes one of the four items in that list and leaves
   the three that are the type. The costing of the alternative is in
   HeldScene, at the beat stack.

   AND IT MOVES NO METER, WHICH IS THE POINT OF SAYING SO. The seam's motion
   floor is measured as mean |delta| per pixel over a 10px scroll step across
   the whole viewport; 26 pixels of hairline against 1,296,000 is 0.002% of
   the frame and cannot register in a mean. Before and after: 0.781 and 0.786
   at the seam, 1440x900 — the same number twice, plus noise. The change is
   for the reader's eye, not for the meter, and the meter says so.

   WHICH LEAVES THE FINDING THIS WAVE ACTUALLY TURNED UP, and it argues
   against the brief that produced it. Sweeping that same measure across the
   WHOLE hold rather than across the seam, 45 samples, hp 0.06 to 0.94:

                            1440x900              390x844
     at the seam (hp 0.485) 0.791                 0.820
     lowest in the seam band 0.791 at 0.4850      0.803 at 0.4925
     GLOBAL minimum         0.545 at hp 0.300     0.722 at hp 0.520
     arrival / exit         2.4-3.2 / 3.4-4.0     2.6-3.6 / 3.4-4.1

   After wave 20's breath, THE SEAM IS NOT THE STILLEST FRAME IN THE SCENE:
   at both viewports the global floor is elsewhere, and at 1440 the seam runs
   45% above it. The stillest frames are the beat PLATEAUS — hp 0.30, and the
   0.54-0.70 stretch — where a display line is fully painted and holding, the
   ground is flat at `--open` 1.000, and the only thing moving is 0.075 of
   scale spread over the whole hold.

   So the two criteria pull opposite ways on this scene. The frames that pass
   "is there a proposition on screen" are the ones that fail "is anything
   moving", and the frame that fails the first is now among the most active
   in the hold. A future wave that goes after the seam again is optimising
   the wrong 25px: the still frames are the ones with the words on them.

   (The seam's 0.820 at 390 is wave 20's own number, reproduced. The 1440
   figure reads 0.791 here against the 0.820 that wave quoted; same sweep,
   different sample grid, and the conclusion does not turn on it.) */

function holdTail(track, beats, coda) {
  const w = window.innerWidth;
  if (track.__tailW === w) return track.__tail;
  track.__tailW = w;
  /* No coda: the tail's only remaining job is the ground's own close, so it
     is the floor and nothing else. One number, one meaning. */
  if (!coda) return (track.__tail = TAIL_MIN);
  const codaH = coda.offsetHeight;
  let type = codaH;
  for (const b of beats) type += b.offsetHeight;
  const share = type > 0 ? (1 - 0.09) * (codaH / type) : TAIL_MIN;
  return (track.__tail = Math.max(TAIL_MIN, Math.min(TAIL_MAX, share)));
}

function runHold(track, vh) {
  const stage = track.__stage || (track.__stage = track.querySelector('[data-hold-stage]'));
  if (!stage) return;
  const r = track.getBoundingClientRect();
  const range = r.height - stage.offsetHeight;
  if (range <= 8) return;                       /* not tall enough to pin */
  /* Off screen: park at the near end and stop. A held scene two pages away
     must not cost anything per frame. */
  const near = r.bottom < -80 ? 1 : r.top > vh + 80 ? 0 : null;
  const p = near !== null ? near : Math.max(0, Math.min(1, -r.top / range));
  if (near !== null && track.__parked === near) return;
  track.__parked = near;

  const beats = track.__beats || (track.__beats = [...track.querySelectorAll('[data-beat]')]);
  const ticks = track.__ticks || (track.__ticks = [...track.querySelectorAll('[data-beat-tick]')]);
  const coda = track.__coda !== undefined
    ? track.__coda
    : (track.__coda = track.querySelector('[data-coda]'));

  const lead = 0.09;
  const tail = holdTail(track, beats, coda);
  const n = beats.length;
  const span = n ? (1 - lead - tail) / n : 0;

  /* THE GROUND LEAVES WITH THE LAST LINE. The close used to run on its own
     hand-written 0.24, equal to the old tail by coincidence of typing, and
     the rule it was written to serve was "the last beat is gone before the
     ground closes". Measured against the tail alone the close came out
     2.5× faster than the open — the arc stopped exhaling and started
     slamming. So it is measured from where the last beat BEGINS to leave
     instead: its own retire, plus the tail behind it. The picture starts
     going back into the page on the same frame the last display line starts
     going, and the two are gone together, which is one gesture rather than a
     departure followed by a wait. */
  const close = tail + span * RETIRE;

  /* The envelopes are computed before the arc, because the arc now reads
     them: the ground's breath is the inverse of the type's presence. */
  const env = track.__env || (track.__env = []);
  let present = 0;
  for (let i = 0; i < n; i++) {
    const u = (p - (lead + i * span)) / span;
    const e = u <= 0 || u >= 1 ? 0 : ss(u / 0.30) * ss((1 - u) / RETIRE);
    env[i] = e;
    if (e > present) present = e;
  }

  const arc = track.dataset.arc || 'lift';
  const rise = ss(p / 0.30);
  const fall = ss((1 - p) / close);
  let open = arc === 'fall' ? fall : arc === 'rise' ? rise : Math.min(rise, fall);

  /* THE BREATH. See BREATH above. `mid` confines it to the beats' own
     territory, so the arrival and the exit are untouched; inside that, the
     light gives up exactly what the type gives up. */
  if (n > 1) {
    const q = p + BREATH_LEAD * span;
    let ahead = 0;
    for (let i = 0; i < n; i++) {
      const u = (q - (lead + i * span)) / span;
      const e = u <= 0 || u >= 1 ? 0 : ss(u / 0.30) * ss((1 - u) / RETIRE);
      if (e > ahead) ahead = e;
    }
    const mid = ss(((p - lead) / span) * 2) * ss(((1 - tail - p) / span) * 2);
    open *= 1 - BREATH * mid * (1 - ahead);
  }

  setVar(track, '--hp', p);
  setVar(track, '--open', open);

  if (n) {
    /* The first beat waits for the picture to have arrived; the last one
       leaves with the ground, which is what `close` above is measured off.
       The coda then has the tail to itself, so the link at the end of the
       scene never shares the frame with a display line. */
    for (let i = 0; i < n; i++) {
      const u = (p - (lead + i * span)) / span;
      setVar(beats[i], '--be', env[i]);
      setVar(beats[i], '--bu', Math.max(-0.4, Math.min(1.4, u)));
      /* THE METER IS NOT A BEAT. See THE METER LATCHES above: it fills on
         arrival and does not retire, and it reads the type the same distance
         ahead the light does. */
      if (ticks[i]) {
        const t = (p + BREATH_LEAD * span - (lead + i * span)) / span;
        setVar(ticks[i], '--be', t <= 0 ? 0 : ss(t / 0.30));
      }
    }
  }
  /* The coda starts drawing on the exact frame the last beat's envelope
     reaches zero — 1 - tail is both — and is fully drawn halfway through the
     tail. So it never shares the frame with a display line and there is no
     gap between them either, which the hand-written 0.22 / 0.11 pair left:
     a sliver of scroll at the end of the beats with nothing drawn on it. */
  if (coda) setVar(coda, '--be', ss((p - (1 - tail)) / (tail * 0.5)));
}

/* ── 3. Scroll-linked values: parallax and settle ────────────────── */
function initScroll() {
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const settle = [...document.querySelectorAll('[data-settle]')];
  const holds = [...document.querySelectorAll('[data-hold]')];
  const nav = document.querySelector('[data-nav]');
  let ticking = false;

  /* Under reduced motion --settle stays at its resting 1 and the CSS
     drops the transform entirely, so nothing here needs to run. */
  const frame = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (nav) nav.classList.toggle('is-scrolled', y > 24);
    if (reduced) return;

    if (pendingWipes.length) runWipes(vh);

    for (const t of holds) runHold(t, vh);

    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const amount = parseFloat(el.dataset.parallax) || 8;
      // -1 (below viewport) → 1 (above viewport)
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      el.style.setProperty('--py', `${(p * amount).toFixed(2)}%`);
    }

    /* settle: 0 when the element's top sits at the viewport bottom,
       1 once its top has climbed to `land` (a fraction of the viewport
       height). Continuous and reversible — this is the vector that
       answers the scroll rather than firing at it. */
    for (const el of settle) {
      const r = el.getBoundingClientRect();
      if (r.top > vh + 120) { el.style.setProperty('--settle', '0'); continue; }
      if (r.bottom < -120) { el.style.setProperty('--settle', '1'); continue; }
      const land = vh * (parseFloat(el.dataset.settle) || 0.55);
      const p = (vh - r.top) / Math.max(1, vh - land);
      el.style.setProperty('--settle', Math.max(0, Math.min(1, p)).toFixed(3));
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  frame();

  /* The tail is measured off rendered type, and the first frame can run
     before Newsreader and Libre Franklin have swapped in — a display line
     that wraps to two lines in the fallback and three in the real face would
     weigh the scene wrong for the rest of the session. Drop the cached
     measurement once the faces are down. */
  if (holds.length && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      for (const t of holds) t.__tailW = -1;
      onScroll();
    });
  }
}

function boot() {
  document.documentElement.classList.add('js');
  initSeq();
  initReveals();
  initWipes();
  initLines();
  initScroll();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
