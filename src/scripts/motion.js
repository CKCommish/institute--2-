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
     --be    per beat, 0 → 1 → 0. The envelope that fades one beat up, holds
                     it, and retires it before the next arrives.
     --bu    per beat, the raw local progress, unclamped at the ends, so a
                     beat can drift continuously while its envelope is flat.

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

     lead   0.09  fixed: the picture has to have arrived before the first
                  beat is asked to read over it. It is a property of the
                  ARRIVAL, not of the copy, so it does not scale.
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

  const arc = track.dataset.arc || 'lift';
  const rise = ss(p / 0.30);
  const fall = ss((1 - p) / close);
  const open = arc === 'fall' ? fall : arc === 'rise' ? rise : Math.min(rise, fall);

  setVar(track, '--hp', p);
  setVar(track, '--open', open);

  if (n) {
    /* The first beat waits for the picture to have arrived; the last one
       leaves with the ground, which is what `close` above is measured off.
       The coda then has the tail to itself, so the link at the end of the
       scene never shares the frame with a display line. */
    for (let i = 0; i < n; i++) {
      const u = (p - (lead + i * span)) / span;
      const e = u <= 0 || u >= 1 ? 0 : ss(u / 0.30) * ss((1 - u) / RETIRE);
      setVar(beats[i], '--be', e);
      setVar(beats[i], '--bu', Math.max(-0.4, Math.min(1.4, u)));
      if (ticks[i]) setVar(ticks[i], '--be', e);
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
