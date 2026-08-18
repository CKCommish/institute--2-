/* Lion Forum Institute — motion.
   Three primitives, nothing more:
     1. reveal      — enter once, from below, staggered
     2. lines       — masked line-by-line reveal for display type
     3. parallax    — slow scale/translate on full-bleed media
   Everything is disabled under prefers-reduced-motion. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1 + 2. Reveals ──────────────────────────────────────────────── */
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
    const d = el.dataset.reveal;
    if (d) el.style.setProperty('--reveal-delay', `${parseInt(d, 10)}ms`);
    io.observe(el);
  });
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

/* ── 3. Scroll-linked values ─────────────────────────────────────── */
function initScroll() {
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const nav = document.querySelector('[data-nav]');
  let ticking = false;

  const frame = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (nav) nav.classList.toggle('is-scrolled', y > 24);

    if (!reduced) {
      for (const el of parallax) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const amount = parseFloat(el.dataset.parallax) || 8;
        // -1 (below viewport) → 1 (above viewport)
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        el.style.setProperty('--py', `${(p * amount).toFixed(2)}%`);
      }
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
  initReveals();
  initLines();
  initScroll();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
