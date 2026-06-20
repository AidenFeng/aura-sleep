// Women's health (cycle calendar) + AI sleep analysis app demos.
// Ported from the prototype's scenes2.jsx (verbatim animation logic).
import React from 'react';
import { Title, Body, Caption, Label, Card, GlassTile, SectionLabel } from '../ds';
import { useLoop, useTx, AppBar, lerp, easeOut, easeInOut, phase, breathe, clamp, counted, rgba } from '../lib/motion';

const h = React.createElement;

// polar helper for the cycle ring
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function Sparkle() {
  return h('svg', { width: 16, height: 16, viewBox: '0 0 16 16' },
    h('path', { d: 'M8 0l1.6 4.8L14 8l-4.4 1.6L8 16l-1.6-6.4L2 8l4.4-1.6z', fill: '#b8893f' }));
}

// ════════════════════════════════════════════════════════════════
// Women's health — cycle + basal temperature
// ════════════════════════════════════════════════════════════════
export function SceneWomen({ active = true }: { active?: boolean }) {
  const p = useLoop(13000, { active });
  const tx = useTx();
  const CX = 108, CY = 108, R = 84;
  const segs = [
    { d: 5, c: '#e16a7d', n: tx('经期', 'Period') },
    { d: 8, c: '#5f9bd8', n: tx('卵泡期', 'Follicular') },
    { d: 3, c: '#d98fb3', n: tx('排卵期', 'Ovulation') },
    { d: 12, c: '#8b6fe0', n: tx('黄体期', 'Luteal') },
  ];
  const totalD = 28;
  const todayF = p % 1;
  const day = Math.floor(todayF * totalD) + 1;
  let acc = 0, cur = segs[0];
  for (const s of segs) { if (day <= acc + s.d) { cur = s; break; } acc += s.d; }
  const markAng = -90 + todayF * 360;
  const mk = polar(CX, CY, R, markAng);
  const C = 2 * Math.PI * R;
  let off = 0;
  const basal = (36.3 + (cur.n === segs[2].n ? 0.45 : cur.n === segs[3].n ? 0.35 : 0.05)).toFixed(2);

  return h(React.Fragment, null,
    h(AppBar, { left: tx('女性健康 · Cycle', 'Women’s health'), right: tx('第 ' + day + ' 天', 'Day ' + day) }),
    h(Title, { style: { marginBottom: 12 } }, tx('经期与体温', 'Cycle & warmth')),
    h(Card, { style: { padding: 16, alignItems: 'center' } },
      h('div', { style: { position: 'relative', width: 216, height: 216 } },
        h('svg', { width: 216, height: 216, viewBox: '0 0 216 216' },
          h('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.07)', strokeWidth: 14 }),
          segs.map((s, i) => {
            const frac = s.d / totalD, len = C * frac;
            const el = h('circle', {
              key: i, cx: CX, cy: CY, r: R, fill: 'none', stroke: s.c, strokeWidth: 14, strokeLinecap: 'butt',
              strokeDasharray: `${len - 3} ${C - len + 3}`, strokeDashoffset: -off,
              transform: `rotate(-90 ${CX} ${CY})`, opacity: cur.n === s.n ? 1 : 0.42,
              style: { transition: 'opacity .5s' },
            });
            off += len;
            return el;
          }),
          h('circle', { cx: mk.x, cy: mk.y, r: 9, fill: '#1a2238', stroke: cur.c, strokeWidth: 3, style: { filter: 'drop-shadow(0 0 8px ' + rgba('#d98fb3', 0.8) + ')' } })),
        h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
          h(Caption, { style: { letterSpacing: 2 } }, tx('当前阶段', 'CURRENT')),
          h(Body, { serif: true, variant: 'title', style: { fontSize: 26, color: '#1a2238', marginTop: 2 } }, cur.n),
          h(Body, { dim: true, style: { marginTop: 2 } }, tx('周期第 ' + day + ' / 28 天', 'Day ' + day + ' / 28')))) ),
    h('div', { style: { display: 'flex', gap: 8, marginTop: 12 } },
      h(GlassTile, { style: { flex: 1, padding: 12 } },
        h(Label, { dim: true }, tx('基础体温', 'Basal temp')),
        h(Body, { variant: 'hero', style: { fontSize: 24, fontWeight: 700, color: '#d98fb3' } }, basal + '°')),
      h(GlassTile, { style: { flex: 1, padding: 12 } },
        h(Label, { dim: true }, tx('建议床温', 'Suggested')),
        h(Body, { variant: 'hero', style: { fontSize: 24, fontWeight: 700, color: '#b8893f' } }, (cur.n === segs[0].n ? 30 : 27) + '°'))),
    h('div', { style: { height: 14 } }),
    h(SectionLabel, null, tx('周期日历', 'Cycle calendar')),
    h(Card, { style: { padding: 14, marginTop: 8 } },
      h('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 } },
        h(Body, { style: { fontWeight: 700 } }, tx('2026 年 6 月', 'June 2026')),
        h(Caption, null, tx('预测下次经期 6.29', 'Next period Jun 29'))),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5, marginBottom: 5 } },
        tx('一 二 三 四 五 六 日', 'M T W T F S S').split(' ').map((w, i) =>
          h('div', { key: 'w' + i, style: { textAlign: 'center' } }, h(Caption, null, w)))),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 } },
        Array.from({ length: 30 }, (_, i) => i + 1).map((d, idx) => {
          const cP = easeOut(phase(p, 0.06 + idx * 0.012, 0.34 + idx * 0.012));
          const period = d <= 5, fertile = d >= 12 && d <= 16, ovu = d === 14, predicted = d >= 29, today = d === 24;
          let bg = 'transparent', color = '#1a2238', border = '1px solid transparent', weight = 500;
          if (fertile) bg = 'rgba(199,154,78,0.16)';
          if (ovu) { bg = 'rgba(199,154,78,0.26)'; border = '1px solid #c79a4e'; weight = 700; }
          if (period) { bg = '#e07a99'; color = '#fff'; weight = 700; }
          if (predicted) { bg = 'transparent'; color = '#e07a99'; border = '1px dashed #e07a99'; }
          return h('div', {
            key: d,
            style: { position: 'relative', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: bg, border, color, fontSize: 13, fontWeight: weight, opacity: cP, transform: `scale(${0.82 + 0.18 * cP})` },
          },
            today ? h('div', { style: { position: 'absolute', inset: -3, borderRadius: 13, border: '2px solid #1a2238', opacity: 0.3 + 0.5 * breathe(p) } }) : null,
            h('span', null, d));
        })),
      h('div', { style: { display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' } },
        ([['#e07a99', tx('经期', 'Period')], ['rgba(199,154,78,0.55)', tx('易孕期', 'Fertile')], ['#c79a4e', tx('排卵', 'Ovulation')]] as [string, string][]).map((l, i) =>
          h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 5 } },
            h('span', { style: { width: 9, height: 9, borderRadius: 3, background: l[0] } }),
            h(Caption, null, l[1])))))
  );
}

// ════════════════════════════════════════════════════════════════
// AI sleep analysis — hypnogram + score + stages + insight
// ════════════════════════════════════════════════════════════════
export function SceneAnalysis({ active = true }: { active?: boolean }) {
  const p = useLoop(15000, { active });
  const tx = useTx();
  const GREEN = '#3aa76d', BLUE = '#5b8fd6';
  const stageLabels = [tx('清醒', 'Awake'), 'REM', tx('浅睡', 'Light'), tx('深睡', 'Deep')];
  const seq: [number, number][] = [[0, 3], [0.03, 1], [0.10, 0], [0.20, 1], [0.26, 0], [0.31, 1], [0.35, 2], [0.42, 1], [0.47, 0], [0.53, 1], [0.59, 2], [0.64, 1], [0.70, 3], [0.73, 1], [0.80, 1], [0.83, 3], [0.87, 1], [0.93, 2], [1, 3]];
  const HW = 296, HH = 108, padT = 8, padB = 10;
  const xOf = (t: number) => +(t * HW).toFixed(1);
  const yOf = (s: number) => +(padT + ((3 - s) / 3) * (HH - padT - padB)).toFixed(1);
  let hd = 'M ' + xOf(seq[0][0]) + ' ' + yOf(seq[0][1]);
  for (let i = 1; i < seq.length; i++) hd += ' H ' + xOf(seq[i][0]) + ' V ' + yOf(seq[i][1]);
  const draw = easeInOut(phase(p, 0.04, 0.4));
  const hours = ['23:00', '01:00', '03:00', '05:00', '07:00'];
  const legend: [string, string, string][] = [[BLUE, tx('入睡', 'Asleep'), '23:08'], ['#8794ad', tx('醒来', 'Awake'), '06:40'], [GREEN, tx('总时长', 'Total'), '7h 32m']];
  const score = Math.round(counted(p, 0, 92, 0.04, 0.4));
  const CX = 44, CY = 44, R = 36, C = 2 * Math.PI * R, ringP = counted(p, 0, 0.92, 0.04, 0.4);
  const contribs = [
    { n: tx('深睡', 'Deep'), v: 32, c: '#5f9bd8' },
    { n: 'REM', v: 24, c: '#8b6fe0' },
    { n: tx('浅睡', 'Light'), v: 38, c: '#b8893f' },
    { n: tx('清醒', 'Awake'), v: 6, c: '#e16a7d' },
  ];
  const insight = tx('深睡较上周提升 18%。今晚把降温提前 20 分钟，预计可再延长深睡 12 分钟。', 'Deep sleep +18% vs last week. Cooling 20 min earlier tonight could add ~12 min more.');
  const rev = phase(p, 0.22, 0.56), shown = insight.slice(0, Math.floor(insight.length * rev)), typing = rev > 0 && rev < 1;

  return h(React.Fragment, null,
    h(AppBar, { left: tx('AI 分析 · Insights', 'AI insights'), right: tx('今晨 06:40', 'Today 06:40') }),
    h(Title, { style: { marginBottom: 12 } }, tx('睡眠分析', 'Sleep analysis')),
    h(Card, { style: { padding: 14 } },
      h(Label, { dim: true, style: { marginBottom: 8 } }, tx('整夜睡眠曲线', 'Overnight stages')),
      h('div', { style: { display: 'flex', gap: 8 } },
        h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: HH, paddingBottom: padB } },
          stageLabels.map((s, i) => h(Caption, { key: i }, s))),
        h('svg', { width: '100%', height: HH, viewBox: '0 0 ' + HW + ' ' + HH, preserveAspectRatio: 'none', style: { flex: 1 } },
          [0, 1, 2, 3].map((s) => h('line', { key: s, x1: 0, y1: yOf(s), x2: HW, y2: yOf(s), stroke: 'rgba(40,60,90,0.07)', strokeWidth: 1 })),
          h('path', { d: hd, fill: 'none', stroke: BLUE, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw }))),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 6 } },
        hours.map((hr) => h(Caption, { key: hr }, hr))),
      h('div', { style: { display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' } },
        legend.map((l, i) => h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 5 } },
          h('span', { style: { width: 7, height: 7, borderRadius: 99, background: l[0] } }),
          h(Caption, null, l[1] + ' ' + l[2]))))),
    h('div', { style: { height: 14 } }),
    h(Card, { highlight: true, style: { padding: 16 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
        h('div', { style: { position: 'relative', width: 88, height: 88, flex: '0 0 auto' } },
          h('svg', { width: 88, height: 88, viewBox: '0 0 88 88' },
            h('defs', null,
              h('linearGradient', { id: 'anRing', x1: '0', y1: '0', x2: '1', y2: '1' },
                h('stop', { offset: '0%', stopColor: '#b8893f' }),
                h('stop', { offset: '100%', stopColor: '#e08a60' }))),
            h('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.10)', strokeWidth: 8 }),
            h('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'url(#anRing)', strokeWidth: 8, strokeLinecap: 'round', strokeDasharray: C, strokeDashoffset: C * (1 - ringP), transform: 'rotate(-90 ' + CX + ' ' + CY + ')' })),
          h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
            h(Body, { variant: 'hero', style: { fontSize: 30, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, score),
            h(Caption, null, tx('优秀', 'Great')))),
        h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          h(Label, { dim: true, style: { marginBottom: 4 } }, tx('今晨状态', 'This morning')),
          h(Body, { serif: true, variant: 'title', style: { fontSize: 21, color: '#1a2238', marginBottom: 5, lineHeight: '1.1' } }, tx('神清气爽', 'Well rested')),
          h(Body, { dim: true, variant: 'body', style: { fontSize: 13, lineHeight: '1.5' } }, tx('7 小时 42 分 · 4 个完整睡眠周期', '7h 42m · 4 full cycles')))),
    ),
    h('div', { style: { height: 14 } }),
    h(SectionLabel, null, tx('睡眠结构', 'Sleep stages')),
    h('div', { style: { marginTop: 8, display: 'flex', flexDirection: 'column', gap: 9 } },
      contribs.map((s, i) => {
        const gp = easeOut(phase(p, 0.12 + i * 0.05, 0.5 + i * 0.05));
        return h('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10 } },
          h('div', { style: { width: 42 } }, h(Label, null, s.n)),
          h('div', { style: { flex: 1, height: 8, borderRadius: 99, background: 'rgba(40,60,90,0.08)', overflow: 'hidden' } },
            h('div', { style: { width: s.v * gp + '%', height: '100%', borderRadius: 99, background: s.c } })),
          h('div', { style: { width: 34, textAlign: 'right' } }, h(Label, { dim: true }, s.v + '%')));
      })),
    h('div', { style: { height: 14 } }),
    h(Card, { style: { padding: 14 } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
        h(Sparkle, null),
        h(Label, { style: { color: '#b8893f', letterSpacing: 1 } }, tx('AI 洞察', 'AI INSIGHT'))),
      h(Body, { variant: 'body', style: { minHeight: 52 } }, shown,
        typing ? h('span', { style: { opacity: 0.7 } }, '▊') : null)));
}
