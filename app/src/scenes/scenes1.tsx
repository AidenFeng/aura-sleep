// Hero product visual + combined smart-climate app demo.
// Ported from the prototype's scenes1.jsx (verbatim animation logic).
import React from 'react';
import { Body, Caption, Label, Card, GlassTile, Toggle, Title, SectionLabel } from '../ds';
import { useLoop, useTx, AppBar, lerp, easeInOut, breathe, phase, clamp } from '../lib/motion';

const h = React.createElement;

// ════════════════════════════════════════════════════════════════
// Zoned-climate mattress — cinematic top-down product visual
// ════════════════════════════════════════════════════════════════
export function MattressViz({ active = true, scale = 1, onDark = false }: { active?: boolean; scale?: number; onDark?: boolean }) {
  const p = useLoop(9000, { active });
  const tx = useTx();
  const coolC = onDark ? '#9fcdf7' : '#3f7fd0';
  const warmC = onDark ? '#f2ad7c' : '#cf6f3f';
  const sweepY = lerp(40, 360, easeInOut((p * 1.0) % 1));
  const leftT = (20.6 + 0.7 * breathe((p + 0.0) % 1)).toFixed(1);
  const rightT = (27.5 + 0.8 * breathe((p + 0.45) % 1)).toFixed(1);

  const L: [number, number][] = [[150, 150], [150, 250], [150, 340]];
  const R: [number, number][] = [[330, 150], [330, 250], [330, 340]];
  const glow = (cx: number, cy: number, grad: string, i: number) => {
    const a = 0.34 + 0.26 * breathe((p + i * 0.13) % 1);
    const r = 70 + 8 * breathe((p + i * 0.13 + 0.3) % 1);
    return h('ellipse', { key: grad + i, cx, cy, rx: r, ry: r * 0.82, fill: `url(#${grad})`, opacity: a });
  };

  return h('div', { style: { position: 'relative', width: 480 * scale, height: 460 * scale } },
    h('div', { style: { width: 480, height: 460, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'relative' } },
      h('div', { style: { position: 'absolute', inset: -40, background: 'radial-gradient(60% 50% at 35% 42%, rgba(120,170,230,0.22), transparent 70%), radial-gradient(60% 50% at 66% 52%, rgba(224,138,96,0.22), transparent 70%)', filter: 'blur(8px)' } }),
      h('svg', { width: 480, height: 440, viewBox: '0 0 480 440', style: { position: 'absolute', top: 0, left: 0 } },
        h('defs', null,
          h('radialGradient', { id: 'mzCool', cx: '50%', cy: '50%', r: '50%' },
            h('stop', { offset: '0%', stopColor: '#8fc3f2', stopOpacity: 0.95 }),
            h('stop', { offset: '100%', stopColor: '#5b8fd6', stopOpacity: 0 })),
          h('radialGradient', { id: 'mzWarm', cx: '50%', cy: '50%', r: '50%' },
            h('stop', { offset: '0%', stopColor: '#cf6f3f', stopOpacity: 0.95 }),
            h('stop', { offset: '100%', stopColor: '#d4763f', stopOpacity: 0 })),
          h('linearGradient', { id: 'mzBed', x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0%', stopColor: 'rgba(40,60,90,0.10)' }),
            h('stop', { offset: '100%', stopColor: 'rgba(40,60,90,0.03)' })),
          h('linearGradient', { id: 'mzSweep', x1: '0', y1: '0', x2: '0', y2: '1' },
            h('stop', { offset: '0%', stopColor: 'rgba(236,220,189,0)' }),
            h('stop', { offset: '50%', stopColor: 'rgba(236,220,189,0.55)' }),
            h('stop', { offset: '100%', stopColor: 'rgba(236,220,189,0)' })),
          h('clipPath', { id: 'mzClip' },
            h('rect', { x: 60, y: 24, width: 360, height: 388, rx: 42 }))),
        h('rect', { x: 60, y: 24, width: 360, height: 388, rx: 42, fill: onDark ? 'rgba(16,22,36,0.52)' : 'url(#mzBed)', stroke: onDark ? 'rgba(224,233,247,0.6)' : 'rgba(212,224,242,0.28)', strokeWidth: onDark ? 2 : 1.5 }),
        h('g', { clipPath: 'url(#mzClip)' },
          L.map((z, i) => glow(z[0], z[1], 'mzCool', i)),
          R.map((z, i) => glow(z[0], z[1], 'mzWarm', i + 3)),
          h('rect', { x: 60, y: sweepY - 34, width: 360, height: 68, fill: 'url(#mzSweep)', opacity: 0.7, style: { mixBlendMode: 'screen' } })),
        h('rect', { x: 92, y: 44, width: 130, height: 58, rx: 18, fill: onDark ? 'rgba(255,255,255,0.10)' : 'rgba(40,60,90,0.07)', stroke: onDark ? 'rgba(224,233,247,0.45)' : 'rgba(40,60,90,0.10)' }),
        h('rect', { x: 258, y: 44, width: 130, height: 58, rx: 18, fill: onDark ? 'rgba(255,255,255,0.10)' : 'rgba(40,60,90,0.07)', stroke: onDark ? 'rgba(224,233,247,0.45)' : 'rgba(40,60,90,0.10)' }),
        h('line', { x1: 240, y1: 116, x2: 240, y2: 396, stroke: onDark ? 'rgba(224,233,247,0.4)' : 'rgba(212,224,242,0.22)', strokeWidth: 1.5, strokeDasharray: '2 7', strokeLinecap: 'round' }),
        [170, 250, 330].map((y) => h('line', { key: y, x1: 80, y1: y, x2: 400, y2: y, stroke: onDark ? 'rgba(224,233,247,0.14)' : 'rgba(40,60,90,0.04)', strokeWidth: 1 }))
      ),
      readout('14%', coolC, tx('凉感 · 左', 'COOL · L'), leftT, true, onDark),
      readout('auto', warmC, tx('暖感 · 右', 'WARM · R'), rightT, false, onDark),
      h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: -6, display: 'flex', justifyContent: 'center', gap: 10 } },
        spec(tx('双区独立', 'Dual-zone'), tx('温控', 'climate'), onDark),
        spec(tx('AI睡眠', 'AI sleep'), tx('监测', 'tracking'), onDark),
        spec(tx('生理周期', 'Cycle'), tx('优化', 'optimized'), onDark))
    )
  );
}

function readout(_right: string, color: string, label: string, val: string, left: boolean, onDark: boolean) {
  const pos = left ? { left: 84 } : { left: 272 };
  const shadow = onDark ? `0 2px 16px rgba(0,0,0,0.7), 0 0 28px ${color}88` : `0 0 24px ${color}66`;
  return h('div', { style: { position: 'absolute', top: 196, width: 124, textAlign: 'center', ...pos } },
    h(Label, { dim: !onDark, style: { letterSpacing: 1.5, color: onDark ? 'rgba(255,255,255,0.92)' : undefined, textShadow: onDark ? '0 1px 8px rgba(0,0,0,0.6)' : undefined } }, label),
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'center' } },
      h(Body, { variant: 'hero', style: { color, fontSize: 34, fontWeight: 800, textShadow: shadow } }, val),
      h(Body, { style: { color, fontSize: 18, fontWeight: 700, textShadow: shadow } }, '°')));
}
function spec(big: string, small: string, onDark: boolean) {
  return h('div', { style: { textAlign: 'center', minWidth: 84, padding: '8px 12px', borderRadius: 14, background: onDark ? 'rgba(20,26,40,0.42)' : 'rgba(40,60,90,0.05)', border: onDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(212,224,242,0.12)', backdropFilter: onDark ? 'blur(6px)' : undefined, WebkitBackdropFilter: onDark ? 'blur(6px)' : undefined } },
    h(Body, { style: { fontSize: 17, fontWeight: 700, color: onDark ? '#f0cf8e' : '#b8893f', textShadow: onDark ? '0 1px 6px rgba(0,0,0,0.5)' : undefined } }, big),
    h(Caption, { style: onDark ? { color: 'rgba(255,255,255,0.82)' } : undefined }, small));
}

// ════════════════════════════════════════════════════════════════
// Combined smart climate — dual-zone control + overnight schedule
// ════════════════════════════════════════════════════════════════
export function SceneClimate({ active = true }: { active?: boolean }) {
  const p = useLoop(14000, { active });
  const tx = useTx();

  const minT = 16, maxT = 43, R = 44, CX = 62, CY = 64, START = 135, SWEEP = 270;
  const arcLen = 2 * Math.PI * R * (SWEEP / 360);
  const zone = (key: string, label: string, warm: boolean, target: number, accent: string, accentDeep: string, off: number) => {
    const osc = 0.5 - 0.5 * Math.cos(((p + off) % 1) * Math.PI * 2);
    const cur = (target + (warm ? -1 : 1) * (1 - osc) * 1.2).toFixed(1);
    const frac = clamp((parseFloat(cur) - minT) / (maxT - minT));
    const ang = ((START + frac * SWEEP) * Math.PI) / 180;
    const kx = CX + R * Math.cos(ang), ky = CY + R * Math.sin(ang);
    return h(Card, { key, highlight: true, style: { flex: 1, padding: 14, alignItems: 'center' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, alignSelf: 'stretch' } },
        h('span', { style: { width: 8, height: 8, borderRadius: 99, background: accent, flex: '0 0 auto' } }),
        h(Label, null, label)),
      h('div', { style: { position: 'relative', width: 124, height: 128 } },
        h('svg', { width: 124, height: 128, viewBox: '0 0 124 128' },
          h('defs', null,
            h('linearGradient', { id: 'cz' + key, x1: '0', y1: '0', x2: '1', y2: '1' },
              h('stop', { offset: '0%', stopColor: accent }),
              h('stop', { offset: '100%', stopColor: accentDeep }))),
          h('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.10)', strokeWidth: 9, strokeLinecap: 'round', strokeDasharray: arcLen + ' 999', transform: 'rotate(' + START + ' ' + CX + ' ' + CY + ')' }),
          h('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'url(#cz' + key + ')', strokeWidth: 9, strokeLinecap: 'round', strokeDasharray: arcLen * frac + ' 999', transform: 'rotate(' + START + ' ' + CX + ' ' + CY + ')' }),
          h('circle', { cx: kx, cy: ky, r: 7, fill: '#fff', stroke: accent, strokeWidth: 3 })),
        h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
          h('div', { style: { display: 'flex', alignItems: 'baseline' } },
            h(Body, { variant: 'hero', style: { fontSize: 27, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, cur),
            h(Body, { style: { fontSize: 14, fontWeight: 700, color: '#1a2238' } }, '°')),
          h(Caption, { style: { marginTop: 2 } }, tx('目标 ', 'Target ') + target + '°'))),
      h('div', { style: { marginTop: 6 } },
        h('span', { style: { fontSize: 12, fontWeight: 700, color: accentDeep } }, warm ? tx('↑ 升温中', '↑ Warming') : tx('↓ 降温中', '↓ Cooling'))),
      h(Caption, { style: { marginTop: 3 } }, tx('床面 ', 'Bed ') + (parseFloat(cur) + (warm ? -2 : 2)).toFixed(0) + '°'));
  };

  const draw = easeInOut(phase(p, 0.04, 0.42));
  const dotP = phase(p, 0.42, 0.92);
  const pts: [number, number][] = [[0, .42], [.13, .12], [.30, .30], [.52, .74], [.72, .82], [.88, .55], [1, .40]];
  const W = 300, H = 138, PADX = 6;
  const X = (t: number) => PADX + t * (W - PADX * 2);
  const Y = (v: number) => 12 + v * (H - 26);
  const path = catmullRom(pts.map((q) => [X(q[0]), Y(q[1])]));
  const np = samplePath(pts, dotP);
  const nowTemp = (24 + (1 - np.v) * 9).toFixed(1);
  const phases = [
    { k: tx('入睡 · 预热', 'Sleep · Preheat'), v: '31°', a: [0, .34] },
    { k: tx('深睡 · 降温', 'Deep · Cool'), v: '26°', a: [.34, .72] },
    { k: tx('清晨 · 回暖', 'Wake · Warm'), v: '28°', a: [.72, 1] },
  ];
  const activePhase = phases.findIndex((ph) => dotP >= ph.a[0] && dotP < ph.a[1]);

  return h(React.Fragment, null,
    h(AppBar, { left: tx('我的床 · My Bed', 'My Bed'), right: tx('已连接', 'Connected') }),
    h(Title, { style: { marginBottom: 4 } }, tx('双区智能温控', 'Smart climate')),
    h(Body, { dim: true, variant: 'body', style: { marginBottom: 14 } }, tx('左右独立调温，整夜自动规划', 'Independent zones, planned all night')),
    h('div', { style: { display: 'flex', gap: 10 } },
      zone('L', tx('我的一侧 · 左区', 'My side · L'), true, 28, '#e08a60', '#cf6f3f', 0),
      zone('R', tx('伴侣 · 右区', 'Partner · R'), false, 24, '#5f9bd8', '#3f7fd0', 0.5)),
    h('div', { style: { height: 10 } }),
    h(Card, { highlight: true, style: { padding: 14, position: 'relative', overflow: 'hidden' } },
      h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '45%', left: -45 + 150 * (p % 1) + '%', background: 'linear-gradient(90deg,transparent,rgba(184,137,63,0.12),transparent)', pointerEvents: 'none' } }),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, position: 'relative' } },
        h('div', { style: { width: 42, height: 42, borderRadius: 13, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#efd9ad,#c79a4e)', boxShadow: '0 5px 14px rgba(184,137,63,0.4)' } },
          h('svg', { width: 22, height: 22, viewBox: '0 0 16 16' },
            h('path', { d: 'M8 0.5l1.7 4.6L14 6.8 9.7 8.5 8 13l-1.7-4.5L2 6.8l4.3-1.7z', fill: '#fff' }),
            h('circle', { cx: 13, cy: 12.5, r: 1.3, fill: '#fff' }))),
        h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 7 } },
            h(Body, { style: { fontWeight: 700 } }, tx('AI 自动温控', 'AI Autopilot')),
            h('span', { style: { fontSize: 10, fontWeight: 800, letterSpacing: 1, color: '#fff', background: '#c79a4e', padding: '2px 6px', borderRadius: 6 } }, 'PRO')),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 } },
            h('span', { style: { width: 7, height: 7, borderRadius: 99, background: '#3aa76d', boxShadow: '0 0 0 ' + (1.5 + 3 * breathe(p)) + 'px rgba(58,167,109,0.22)', flex: '0 0 auto' } }),
            h(Caption, { style: { color: '#3aa76d' } }, tx('正在按睡眠分期自动调温', 'Adapting to your sleep stage')))),
        h(Toggle, { on: true, onPress: () => {} }))),
    h('div', { style: { height: 16 } }),
    h(SectionLabel, null, tx('整夜温度曲线', 'Overnight curve')),
    h(Card, { style: { padding: 14, marginTop: 8 } },
      h('div', { style: { position: 'relative' } },
        h('svg', { width: '100%', height: H, viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'none' },
          h('defs', null,
            h('linearGradient', { id: 'cLine', x1: '0', y1: '0', x2: '1', y2: '0' },
              h('stop', { offset: '0%', stopColor: '#5f9bd8' }),
              h('stop', { offset: '55%', stopColor: '#b8893f' }),
              h('stop', { offset: '100%', stopColor: '#e08a60' })),
            h('linearGradient', { id: 'cFill', x1: '0', y1: '0', x2: '0', y2: '1' },
              h('stop', { offset: '0%', stopColor: 'rgba(184,137,63,0.18)' }),
              h('stop', { offset: '100%', stopColor: 'rgba(184,137,63,0)' }))),
          [0.25, 0.5, 0.75].map((g) => h('line', { key: g, x1: PADX, y1: 12 + g * (H - 26), x2: W - PADX, y2: 12 + g * (H - 26), stroke: 'rgba(40,60,90,0.06)' })),
          h('path', { d: path + ' L ' + X(1) + ' ' + (H - 6) + ' L ' + X(0) + ' ' + (H - 6) + ' Z', fill: 'url(#cFill)', opacity: draw }),
          h('path', { d: path, fill: 'none', stroke: 'url(#cLine)', strokeWidth: 3, strokeLinecap: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw }),
          draw > 0.99 ? h('g', null,
            h('line', { x1: X(np.t), y1: 12, x2: X(np.t), y2: H - 6, stroke: 'rgba(184,137,63,0.4)', strokeWidth: 1, strokeDasharray: '2 4' }),
            h('circle', { cx: X(np.t), cy: Y(np.v), r: 5.5, fill: '#b8893f' })) : null),
        draw > 0.99 ? h('div', { style: { position: 'absolute', left: (clamp(X(np.t) - 28, 0, W - 60) / W) * 100 + '%', top: Y(np.v) - 38, padding: '3px 9px', borderRadius: 10, background: '#fff', border: '1px solid rgba(184,137,63,0.5)', boxShadow: '0 2px 8px rgba(40,60,90,0.12)' } },
          h(Label, { style: { color: '#b8893f' } }, nowTemp + '°')) : null),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 4 } },
        ['22', '24', '02', '04', '06'].map((hr) => h(Caption, { key: hr }, hr)))),
    h('div', { style: { height: 14 } }),
    h(SectionLabel, null, tx('整夜计划', 'Tonight’s plan')),
    h('div', { style: { position: 'relative', marginTop: 12 } },
      h('div', { style: { position: 'absolute', left: '16%', right: '16%', top: 19, height: 3, borderRadius: 99, background: 'rgba(40,60,90,0.10)' } }),
      h('div', { style: { position: 'absolute', left: '16%', top: 19, height: 3, borderRadius: 99, background: 'linear-gradient(90deg,#5f9bd8,#b8893f,#e08a60)', width: clamp(dotP) * 68 + '%' } }),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', position: 'relative' } },
        phases.map((ph, i) => {
          const act = activePhase === i, done = dotP >= ph.a[1];
          return h('div', { key: i, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' } },
            h('div', { style: { width: 40, height: 40, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: act ? 'linear-gradient(135deg,#f0c98a,#c79a4e)' : done ? '#c79a4e' : '#fff', border: act || done ? 'none' : '2px solid rgba(40,60,90,0.12)', boxShadow: act ? '0 0 0 ' + (3 + 4 * breathe(p)) + 'px rgba(199,154,78,0.16), 0 5px 12px rgba(199,154,78,0.35)' : 'none' } },
              h('svg', { width: 20, height: 20, viewBox: '0 0 16 16' }, climatePlanIcon(i, act || done ? '#fff' : '#b8893f'))),
            h(Caption, { style: { marginTop: 7, textAlign: 'center' } }, ph.k),
            h(Body, { style: { fontSize: 18, fontWeight: 700, color: act ? '#b8893f' : '#9aa3b8', marginTop: 1 } }, ph.v));
        }))));
}

// ── curve helpers ───────────────────────────────────────────────
function climatePlanIcon(i: number, col: string) {
  if (i === 0) return h('path', { d: 'M12 8.4A4.8 4.8 0 1 1 6.6 3.2a3.8 3.8 0 0 0 5.4 5.2z', fill: col });
  if (i === 1) return h('g', { stroke: col, strokeWidth: 1.4, strokeLinecap: 'round' },
    h('line', { x1: 8, y1: 2.5, x2: 8, y2: 13.5 }),
    h('line', { x1: 3.4, y1: 5.4, x2: 12.6, y2: 10.6 }),
    h('line', { x1: 12.6, y1: 5.4, x2: 3.4, y2: 10.6 }));
  return h('g', { stroke: col, strokeWidth: 1.4, strokeLinecap: 'round' },
    h('circle', { cx: 8, cy: 9.5, r: 2.6, fill: col, stroke: 'none' }),
    h('line', { x1: 8, y1: 2, x2: 8, y2: 3.8 }),
    h('line', { x1: 2.4, y1: 9.5, x2: 4.2, y2: 9.5 }),
    h('line', { x1: 11.8, y1: 9.5, x2: 13.6, y2: 9.5 }),
    h('line', { x1: 4, y1: 5.5, x2: 5.2, y2: 6.7 }),
    h('line', { x1: 12, y1: 5.5, x2: 10.8, y2: 6.7 }));
}

export function catmullRom(P: [number, number][]) {
  if (P.length < 2) return '';
  let d = `M ${P[0][0]} ${P[0][1]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
export function samplePath(pts: [number, number][], t: number) {
  t = clamp(t);
  for (let i = 0; i < pts.length - 1; i++) {
    if (t >= pts[i][0] && t <= pts[i + 1][0]) {
      const seg = (t - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      return { t, v: lerp(pts[i][1], pts[i + 1][1], easeInOut(seg)) };
    }
  }
  return { t, v: pts[pts.length - 1][1] };
}
