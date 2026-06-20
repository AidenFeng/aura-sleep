// lib.jsx — shared motion hooks, i18n, color + layout primitives for the
// Aura homepage animation showcase. Exports to window for the other
// text/babel files.

// ── Motion context ──────────────────────────────────────────────
// speed: global multiplier · paused: freeze all loops · lang: 'zh'|'en'
const MotionCtx = React.createContext({ speed: 1, paused: false, lang: 'zh' });

function useMotion() { return React.useContext(MotionCtx); }
function useTx() {
  const { lang } = React.useContext(MotionCtx);
  return (zh, en) => (lang === 'en' ? en : zh);
}

// ── math / easing ───────────────────────────────────────────────
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
// local progress of a sub-phase [a,b] within a 0..1 timeline
const phase = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
// breathing oscillation 0..1
const breathe = (p) => 0.5 - 0.5 * Math.cos(p * Math.PI * 2);

// ── color ───────────────────────────────────────────────────────
function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mixHex(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); const c = A.map((v, i) => Math.round(lerp(v, B[i], clamp(t)))); return `rgb(${c[0]},${c[1]},${c[2]})`; }
function rgba(hex, a) { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }

// palette pulled from Aura tokens (dark theme)
const PAL = {
  bg: '#070b15', bgTop: '#111d38', text: '#e9eef9', dim: '#aab6d4',
  gold: '#ecdcbd', goldDeep: '#d4b886', warm: '#e08a60', cool: '#a6cdf0',
  purple: '#b9a4f5', pink: '#f2cedb', ok: '#62c79c', danger: '#e16a7d',
};

// ── loop hook: returns progress 0..1, respects speed/paused/reduced ─
// opts: { offset?:0..1 start phase, active?:bool gate the rAF (offscreen=frozen) }
function useLoop(duration, opts = {}) {
  const { offset = null, active = true } = opts;
  const ctx = React.useContext(MotionCtx);
  const cfg = React.useRef(ctx); cfg.current = ctx;
  const accRef = React.useRef((offset == null ? Math.random() : offset) * duration);
  const [p, setP] = React.useState(accRef.current / duration);
  React.useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setP(0.9999); return; }
    let raf, last = performance.now();
    const tick = (ts) => {
      const { speed, paused } = cfg.current;
      const dt = ts - last; last = ts;
      if (!paused) accRef.current = (accRef.current + dt * speed) % duration;
      setP(accRef.current / duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, active]);
  return p;
}

// ── in-view entrance hook ───────────────────────────────────────
function useInView(opts) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.25, ...(opts || {}) });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// ── animated count-up bound to a loop progress ──────────────────
// reveals from `from`→`to` over the [a,b] window of progress p, then holds
function counted(p, from, to, a = 0, b = 0.4) { return lerp(from, to, easeOut(phase(p, a, b))); }

// ── Phone shell: dark iOS frame + Aura Screen + padded body ──
// Just the interface — no phone shell, no device outline. The scene's UI
// cards render directly on the page, sized to their content.
function Phone({ children, w = 392 }) {
  return React.createElement('div', {
    style: { width: w, maxWidth: '100%', display: 'flex', flexDirection: 'column' },
  }, children);
}

// passthrough (kept for call-site compatibility) — renders at natural size
function PhoneStage({ children, style = {} }) {
  return React.createElement('div', { style: { flex: '0 0 auto', ...style } }, children);
}

// status row used at the top of most app screens
function AppBar({ left, right }) {
  const { Label } = window.AuraDS;
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, minHeight: 22 },
  },
    React.createElement(Label, null, left),
    right != null ? React.createElement(Label, { dim: true }, right) : null
  );
}

// localStorage-backed language, shared across all pages (key: aura-lang)
function useSharedLang() {
  const [lang, setLangRaw] = React.useState(function () {
    try { return localStorage.getItem('aura-lang') || 'zh'; } catch (e) { return 'zh'; }
  });
  React.useEffect(function () {
    const onStorage = function (e) { if (e.key === 'aura-lang' && e.newValue) setLangRaw(e.newValue); };
    window.addEventListener('storage', onStorage);
    return function () { window.removeEventListener('storage', onStorage); };
  }, []);
  const setLang = function (l) { setLangRaw(l); try { localStorage.setItem('aura-lang', l); } catch (e) {} };
  return [lang, setLang];
}

Object.assign(window, {
  MotionCtx, useMotion, useTx, useLoop, useInView, useSharedLang,
  clamp, lerp, easeInOut, easeOut, easeOutBack, phase, breathe, counted,
  mixHex, rgba, hexToRgb, PAL, Phone, PhoneStage, AppBar,
});
