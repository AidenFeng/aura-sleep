// Shared motion context, loop hook, easing/color math, and small layout
// primitives. Ported from the prototype's lib.jsx.
import React from 'react';
import { Label } from '../ds';

// ── asset helper: prefixes paths with Vite's base URL (so /assets works
//    correctly under GitHub Pages' /<repo>/ subpath) ────────────
export function asset(path: string) {
  const base = import.meta.env.BASE_URL;
  const p = path.replace(/^\//, '');
  return base + p;
}

// ── Motion context ──────────────────────────────────────────────
export interface MotionState {
  speed: number;
  paused: boolean;
  lang: 'zh' | 'en';
}
export const MotionCtx = React.createContext<MotionState>({ speed: 1, paused: false, lang: 'zh' });
export function useMotion() {
  return React.useContext(MotionCtx);
}
export function useTx() {
  const { lang } = React.useContext(MotionCtx);
  return (zh: string, en: string) => (lang === 'en' ? en : zh);
}

// ── math / easing ───────────────────────────────────────────────
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
export const breathe = (p: number) => 0.5 - 0.5 * Math.cos(p * Math.PI * 2);

// ── color ───────────────────────────────────────────────────────
export function hexToRgb(h: string): [number, number, number] {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a), B = hexToRgb(b);
  const cc = A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))));
  return `rgb(${cc[0]},${cc[1]},${cc[2]})`;
}
export function rgba(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// ── loop hook: progress 0..1, respects speed/paused/reduced ──────
export function useLoop(duration: number, opts: { offset?: number | null; active?: boolean } = {}) {
  const { offset = null, active = true } = opts;
  const ctx = React.useContext(MotionCtx);
  const cfg = React.useRef(ctx);
  cfg.current = ctx;
  const accRef = React.useRef((offset == null ? Math.random() : offset) * duration);
  const [p, setP] = React.useState(accRef.current / duration);
  React.useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setP(0.9999);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (ts: number) => {
      const { speed, paused } = cfg.current;
      const dt = ts - last;
      last = ts;
      if (!paused) accRef.current = (accRef.current + dt * speed) % duration;
      setP(accRef.current / duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, active]);
  return p;
}

// animated count-up bound to loop progress p over [a,b]
export function counted(p: number, from: number, to: number, a = 0, b = 0.4) {
  return lerp(from, to, easeOut(phase(p, a, b)));
}

// ── Phone: just the interface, content-height, no device frame ──
export function Phone({ children, w = 392 }: { children?: React.ReactNode; w?: number }) {
  return <div style={{ width: w, maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>{children}</div>;
}

// status row at the top of app screens
export function AppBar({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, minHeight: 22 }}>
      <Label>{left}</Label>
      {right != null ? <Label dim>{right}</Label> : null}
    </div>
  );
}

// ── localStorage-backed language, shared across pages ───────────
export function useSharedLang(): ['zh' | 'en', (l: 'zh' | 'en') => void] {
  const [lang, setLangRaw] = React.useState<'zh' | 'en'>(() => {
    try {
      return (localStorage.getItem('aura-lang') as 'zh' | 'en') || 'zh';
    } catch {
      return 'zh';
    }
  });
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'aura-lang' && e.newValue) setLangRaw(e.newValue as 'zh' | 'en');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const setLang = (l: 'zh' | 'en') => {
    setLangRaw(l);
    try {
      localStorage.setItem('aura-lang', l);
    } catch {
      /* ignore */
    }
  };
  return [lang, setLang];
}
