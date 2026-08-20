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

/* Split a .lines element's text into masked lines after layout. */
function splitLines(el) {
  if (el.dataset.split === 'done') return;
  const raw = el.dataset.text || el.textContent.trim();
  el.dataset.text = raw;

  // Measure natural line breaks by wrapping each word then grouping by offsetTop.
  const words = raw.split(/\s+/);
  el.textContent = '';
  const probes = words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'probe';
    s.style.display = 'inline-block';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });

  const rows = [];
  let top = null;
  probes.forEach((p) => {
    const t = Math.round(p.offsetTop);
    if (top === null || Math.abs(t - top) > 4) { rows.push([]); top = t; }
    rows[rows.length - 1].push(p.textContent);
  });

  el.textContent = '';
  rows.forEach((row, i) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    inner.textContent = row.join(' ');
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

  const arc = track.dataset.arc || 'lift';
  const rise = ss(p / 0.30);
  const fall = ss((1 - p) / 0.24);
  const open = arc === 'fall' ? fall : arc === 'rise' ? rise : Math.min(rise, fall);

  setVar(track, '--hp', p);
  setVar(track, '--open', open);

  const beats = track.__beats || (track.__beats = [...track.querySelectorAll('[data-beat]')]);
  const ticks = track.__ticks || (track.__ticks = [...track.querySelectorAll('[data-beat-tick]')]);
  const coda = track.__coda !== undefined
    ? track.__coda
    : (track.__coda = track.querySelector('[data-coda]'));
  const n = beats.length;
  if (n) {
    /* The first beat waits for the picture to have arrived, and the last one
       is gone before the ground closes: a beat caught in the fade is a beat
       nobody read. A coda reserves the whole tail for itself, so the link at
       the end of the scene never shares the frame with a display line. */
    const lead = 0.09;
    const tail = coda ? 0.24 : 0.10;
    const span = (1 - lead - tail) / n;
    for (let i = 0; i < n; i++) {
      const u = (p - (lead + i * span)) / span;
      const e = u <= 0 || u >= 1 ? 0 : ss(u / 0.30) * ss((1 - u) / 0.26);
      setVar(beats[i], '--be', e);
      setVar(beats[i], '--bu', Math.max(-0.4, Math.min(1.4, u)));
      if (ticks[i]) setVar(ticks[i], '--be', e);
    }
  }
  if (coda) setVar(coda, '--be', ss((p - (1 - 0.22)) / 0.11));
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
