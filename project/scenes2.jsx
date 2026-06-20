// scenes2.jsx — three more app feature demos
// SceneTrend · SceneWomen (cycle) · SceneAI

// ════════════════════════════════════════════════════════════════
// 4 · Sleep trend  (phone)
// ════════════════════════════════════════════════════════════════
function SceneTrend({ active = true }) {
  const { Title, Body, Caption, Label, Card, SectionLabel } = window.AuraDS;
  const p = useLoop(13000, { active });
  const tx = useTx();
  const GREEN = '#3aa76d', AMBER = '#c79a4e', BLUE = '#5b8fd6';

  // overnight hypnogram — stages 0=deep(bottom) … 3=awake(top), across 23:00–07:00
  const stageLabels = [tx('清醒', 'Awake'), 'REM', tx('浅睡', 'Light'), tx('深睡', 'Deep')]; // top→bottom
  const seq = [[0,3],[0.03,1],[0.10,0],[0.20,1],[0.26,0],[0.31,1],[0.35,2],[0.42,1],[0.47,0],[0.53,1],[0.59,2],[0.64,1],[0.70,3],[0.73,1],[0.80,1],[0.83,3],[0.87,1],[0.93,2],[1,3]];
  const HW = 296, HH = 116, padT = 8, padB = 12;
  const xOf = t => +(t * HW).toFixed(1);
  const yOf = s => +(padT + (3 - s) / 3 * (HH - padT - padB)).toFixed(1);
  let hd = `M ${xOf(seq[0][0])} ${yOf(seq[0][1])}`;
  for (let i = 1; i < seq.length; i++) hd += ` H ${xOf(seq[i][0])} V ${yOf(seq[i][1])}`;
  const draw = easeInOut(phase(p, 0.05, 0.5));
  const hours = ['23:00', '01:00', '03:00', '05:00', '07:00'];
  const legend = [[BLUE, tx('入睡', 'Asleep'), '23:08'], ['#8794ad', tx('醒来', 'Awake'), '06:40'], [GREEN, tx('总时长', 'Total'), '7h 32m']];

  // sleep report
  const score = Math.round(counted(p, 0, 82, 0.06, 0.46));
  const CX = 44, CY = 44, R = 36, C = 2 * Math.PI * R;
  const ringP = counted(p, 0, 0.82, 0.06, 0.46);
  const metrics = [
    { n: tx('总睡眠时长', 'Total sleep'), v: tx('7 小时 32 分钟', '7h 32m'), f: 0.93, c: GREEN },
    { n: tx('效率', 'Efficiency'), v: '80%', f: 0.80, c: GREEN },
    { n: tx('睡眠安稳度', 'Stability'), v: tx('一般', 'Fair'), f: 0.5, c: AMBER },
    { n: tx('快速眼动期', 'REM sleep'), v: tx('1 小时 21 分钟 · 18%', '1h 21m · 18%'), f: 0.6, c: GREEN },
    { n: tx('深度睡眠', 'Deep sleep'), v: tx('1 小时 39 分钟 · 22%', '1h 39m · 22%'), f: 0.66, c: GREEN },
    { n: tx('睡眠潜伏期', 'Latency'), v: tx('24 分钟', '24 min'), f: 0.82, c: GREEN },
    { n: tx('入睡时机', 'Bedtime'), v: tx('良好', 'Good'), f: 0.62, c: AMBER },
  ];

  return React.createElement(React.Fragment, null,
    React.createElement(AppBar, { left: tx('睡眠报告 · Report', 'Sleep report'), right: tx('今晨 06:40', 'Today 06:40') }),
    React.createElement(Title, { style: { marginBottom: 12 } }, tx('昨夜睡眠', 'Last night')),

    // ── hypnogram card ──
    React.createElement(Card, { style: { padding: 14 } },
      React.createElement(Label, { dim: true, style: { marginBottom: 8 } }, tx('整夜睡眠曲线', 'Overnight stages')),
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: HH, paddingBottom: padB } },
          stageLabels.map((s, i) => React.createElement(Caption, { key: i }, s))),
        React.createElement('svg', { width: '100%', height: HH, viewBox: `0 0 ${HW} ${HH}`, preserveAspectRatio: 'none', style: { flex: 1 } },
          [0, 1, 2, 3].map(s => React.createElement('line', { key: s, x1: 0, y1: yOf(s), x2: HW, y2: yOf(s), stroke: 'rgba(40,60,90,0.07)', strokeWidth: 1 })),
          React.createElement('path', { d: hd, fill: 'none', stroke: BLUE, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw }))),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 6 } },
        hours.map(h => React.createElement(Caption, { key: h }, h))),
      React.createElement('div', { style: { display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' } },
        legend.map((l, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 5 } },
          React.createElement('span', { style: { width: 7, height: 7, borderRadius: 99, background: l[0] } }),
          React.createElement(Caption, null, l[1] + ' ' + l[2]))))),

    React.createElement('div', { style: { height: 14 } }),

    // ── score + summary ──
    React.createElement(Card, { highlight: true, style: { padding: 16 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
        React.createElement('div', { style: { position: 'relative', width: 88, height: 88, flex: '0 0 auto' } },
          React.createElement('svg', { width: 88, height: 88, viewBox: '0 0 88 88' },
            React.createElement('defs', null,
              React.createElement('linearGradient', { id: 'trRing', x1: '0', y1: '0', x2: '1', y2: '1' },
                React.createElement('stop', { offset: '0%', stopColor: '#b8893f' }),
                React.createElement('stop', { offset: '100%', stopColor: '#c79a4e' }))),
            React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.10)', strokeWidth: 8 }),
            React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'url(#trRing)', strokeWidth: 8, strokeLinecap: 'round', strokeDasharray: C, strokeDashoffset: C * (1 - ringP), transform: `rotate(-90 ${CX} ${CY})` })),
          React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(Body, { variant: 'hero', style: { fontSize: 30, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, score),
            React.createElement(Caption, null, tx('睡眠评分', 'Score')))),
        React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          React.createElement(Body, { serif: true, variant: 'title', style: { fontSize: 21, color: '#1a2238', marginBottom: 5, lineHeight: '1.1' } }, tx('睡得不错', 'Slept well')),
          React.createElement(Body, { dim: true, variant: 'body', style: { fontSize: 13, lineHeight: '1.5' } }, tx('昨晚整体质量良好。保持规律作息,把拉分项再补一补,就能更进一步。', 'Good overall. Keep a steady schedule and lift the weaker metrics to improve further.')))),
    ),

    React.createElement('div', { style: { height: 14 } }),
    React.createElement(SectionLabel, null, tx('睡眠评分构成指标', 'Score contributors')),
    React.createElement('div', { style: { marginTop: 8, display: 'flex', flexDirection: 'column', gap: 11 } },
      metrics.map((m, i) => {
        const gp = easeOut(phase(p, 0.18 + i * 0.04, 0.58 + i * 0.04));
        return React.createElement('div', { key: i, style: { display: 'flex', flexDirection: 'column', gap: 5 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 } },
            React.createElement(Label, null, m.n),
            React.createElement(Label, { dim: true }, m.v)),
          React.createElement('div', { style: { height: 6, borderRadius: 99, background: 'rgba(40,60,90,0.10)', overflow: 'hidden' } },
            React.createElement('div', { style: { width: (m.f * gp * 100) + '%', height: '100%', borderRadius: 99, background: m.c } })));
      })));
}

// ════════════════════════════════════════════════════════════════
// 5 · Women's health — cycle + basal temperature  (phone)
// ════════════════════════════════════════════════════════════════
function SceneWomen({ active = true }) {
  const { Title, Body, Caption, Label, Card, GlassTile, SectionLabel } = window.AuraDS;
  const p = useLoop(13000, { active });
  const tx = useTx();
  const CX = 108, CY = 108, R = 84;
  // phases: [days, color, name]
  const segs = [
    { d: 5, c: '#e16a7d', n: tx('经期', 'Period') },
    { d: 8, c: '#5f9bd8', n: tx('卵泡期', 'Follicular') },
    { d: 3, c: '#d98fb3', n: tx('排卵期', 'Ovulation') },
    { d: 12, c: '#8b6fe0', n: tx('黄体期', 'Luteal') },
  ];
  const totalD = 28;
  const todayF = (p % 1);
  const day = Math.floor(todayF * totalD) + 1;
  // find current phase
  let acc = 0, cur = segs[0];
  for (const s of segs) { if (day <= acc + s.d) { cur = s; break; } acc += s.d; }
  const markAng = -90 + todayF * 360;
  const mk = polar(CX, CY, R, markAng);
  const C = 2 * Math.PI * R;
  let off = 0;
  const basal = (36.3 + (cur.n === segs[2].n ? 0.45 : cur.n === segs[3].n ? 0.35 : 0.05)).toFixed(2);

  return React.createElement(React.Fragment, null,
    React.createElement(AppBar, { left: tx('女性健康 · Cycle', 'Women\u2019s health'), right: tx('第 ' + day + ' 天', 'Day ' + day) }),
    React.createElement(Title, { style: { marginBottom: 12 } }, tx('经期与体温', 'Cycle & warmth')),
    React.createElement(Card, { style: { padding: 16, alignItems: 'center' } },
      React.createElement('div', { style: { position: 'relative', width: 216, height: 216 } },
        React.createElement('svg', { width: 216, height: 216, viewBox: '0 0 216 216' },
          React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.07)', strokeWidth: 14 }),
          segs.map((s, i) => {
            const frac = s.d / totalD, len = C * frac;
            const el = React.createElement('circle', {
              key: i, cx: CX, cy: CY, r: R, fill: 'none', stroke: s.c, strokeWidth: 14, strokeLinecap: 'butt',
              strokeDasharray: `${len - 3} ${C - len + 3}`, strokeDashoffset: -off,
              transform: `rotate(-90 ${CX} ${CY})`, opacity: cur.n === s.n ? 1 : 0.42,
              style: { transition: 'opacity .5s' },
            });
            off += len;
            return el;
          }),
          React.createElement('circle', { cx: mk.x, cy: mk.y, r: 9, fill: '#1a2238', stroke: cur.c, strokeWidth: 3, style: { filter: 'drop-shadow(0 0 8px ' + rgba('#d98fb3', 0.8) + ')' } })),
        React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
          React.createElement(Caption, { style: { letterSpacing: 2 } }, tx('当前阶段', 'CURRENT')),
          React.createElement(Body, { serif: true, variant: 'title', style: { fontSize: 26, color: '#1a2238', marginTop: 2 } }, cur.n),
          React.createElement(Body, { dim: true, style: { marginTop: 2 } }, tx('周期第 ' + day + ' / 28 天', 'Day ' + day + ' / 28')))) ),
    React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 12 } },
      React.createElement(GlassTile, { style: { flex: 1, padding: 12 } },
        React.createElement(Label, { dim: true }, tx('基础体温', 'Basal temp')),
        React.createElement(Body, { variant: 'hero', style: { fontSize: 24, fontWeight: 700, color: '#d98fb3' } }, basal + '°')),
      React.createElement(GlassTile, { style: { flex: 1, padding: 12 } },
        React.createElement(Label, { dim: true }, tx('建议床温', 'Suggested')),
        React.createElement(Body, { variant: 'hero', style: { fontSize: 24, fontWeight: 700, color: '#b8893f' } }, (cur.n === segs[0].n ? 30 : 27) + '°'))),
    React.createElement('div', { style: { height: 14 } }),
    React.createElement(SectionLabel, null, tx('周期日历', 'Cycle calendar')),
    React.createElement(Card, { style: { padding: 14, marginTop: 8 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 } },
        React.createElement(Body, { style: { fontWeight: 700 } }, tx('2026 年 6 月', 'June 2026')),
        React.createElement(Caption, null, tx('预测下次经期 6.29', 'Next period Jun 29'))),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5, marginBottom: 5 } },
        tx('一 二 三 四 五 六 日', 'M T W T F S S').split(' ').map((w, i) =>
          React.createElement('div', { key: 'w' + i, style: { textAlign: 'center' } }, React.createElement(Caption, null, w)))),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 } },
        Array.from({ length: 30 }, function (_, i) { return i + 1; }).map(function (d, idx) {
          const cP = easeOut(phase(p, 0.06 + idx * 0.012, 0.34 + idx * 0.012));
          const period = d <= 5, fertile = d >= 12 && d <= 16, ovu = d === 14, predicted = d >= 29, today = d === 24;
          let bg = 'transparent', color = '#1a2238', border = '1px solid transparent', weight = 500;
          if (fertile) bg = 'rgba(199,154,78,0.16)';
          if (ovu) { bg = 'rgba(199,154,78,0.26)'; border = '1px solid #c79a4e'; weight = 700; }
          if (period) { bg = '#e07a99'; color = '#fff'; weight = 700; }
          if (predicted) { bg = 'transparent'; color = '#e07a99'; border = '1px dashed #e07a99'; }
          return React.createElement('div', {
            key: d,
            style: { position: 'relative', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: bg, border: border, color: color, fontSize: 13, fontWeight: weight, opacity: cP, transform: `scale(${0.82 + 0.18 * cP})` },
          },
            today ? React.createElement('div', { style: { position: 'absolute', inset: -3, borderRadius: 13, border: '2px solid #1a2238', opacity: 0.3 + 0.5 * breathe(p) } }) : null,
            React.createElement('span', null, d));
        })),
      React.createElement('div', { style: { display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' } },
        [['#e07a99', tx('经期', 'Period')], ['rgba(199,154,78,0.55)', tx('易孕期', 'Fertile')], ['#c79a4e', tx('排卵', 'Ovulation')]].map(function (l, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 5 } },
            React.createElement('span', { style: { width: 9, height: 9, borderRadius: 3, background: l[0] } }),
            React.createElement(Caption, null, l[1]));
        })))
  );
}

// ════════════════════════════════════════════════════════════════
// 6 · AI sleep analysis  (phone)
// ════════════════════════════════════════════════════════════════
function SceneAI({ active = true }) {
  const { Title, Body, Caption, Label, Card, GlassTile, Pill, SectionLabel } = window.AuraDS;
  const p = useLoop(12000, { active });
  const tx = useTx();
  const score = Math.round(counted(p, 0, 92, 0.06, 0.42));
  const ringP = counted(p, 0, 0.92, 0.06, 0.42);
  const CX = 60, CY = 60, R = 48, C = 2 * Math.PI * R;
  const contribs = [
    { n: tx('深睡', 'Deep'), v: 32, c: '#5f9bd8' },
    { n: 'REM', v: 24, c: '#8b6fe0' },
    { n: tx('浅睡', 'Light'), v: 38, c: '#b8893f' },
    { n: tx('清醒', 'Awake'), v: 6, c: '#e16a7d' },
  ];
  const insight = tx(
    '深睡较上周提升 18%。今晚把降温提前 20 分钟,预计可再延长深睡 12 分钟。',
    'Deep sleep +18% vs last week. Cooling 20 min earlier tonight could add ~12 min more.');
  const reveal = phase(p, 0.46, 0.78);
  const shown = insight.slice(0, Math.floor(insight.length * reveal));
  const typing = reveal > 0 && reveal < 1;

  return React.createElement(React.Fragment, null,
    React.createElement(AppBar, { left: tx('AI 分析 · Insights', 'AI insights'), right: tx('今晨', 'Today') }),
    React.createElement(Title, { style: { marginBottom: 12 } }, tx('睡眠评分', 'Sleep score')),
    React.createElement(Card, { highlight: true, style: { padding: 16 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
        React.createElement('div', { style: { position: 'relative', width: 120, height: 120 } },
          React.createElement('svg', { width: 120, height: 120, viewBox: '0 0 120 120' },
            React.createElement('defs', null,
              React.createElement('linearGradient', { id: 'aiRing', x1: '0', y1: '0', x2: '1', y2: '1' },
                React.createElement('stop', { offset: '0%', stopColor: '#b8893f' }),
                React.createElement('stop', { offset: '100%', stopColor: '#e08a60' }))),
            React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.09)', strokeWidth: 9 }),
            React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'url(#aiRing)', strokeWidth: 9, strokeLinecap: 'round', strokeDasharray: C, strokeDashoffset: C * (1 - ringP), transform: `rotate(-90 ${CX} ${CY})`, style: { filter: 'drop-shadow(0 0 8px rgba(236,220,189,0.5))' } })),
          React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(Body, { variant: 'hero', style: { fontSize: 40, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, score),
            React.createElement(Caption, null, tx('优秀', 'Great')))),
        React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          React.createElement(Label, { dim: true, style: { marginBottom: 5, letterSpacing: 0.5 } }, tx('今晨状态', 'This morning')),
          React.createElement(Body, { serif: true, variant: 'title', style: { fontSize: 21, color: '#1a2238', marginBottom: 7, lineHeight: '1.1' } }, tx('神清气爽', 'Well rested')),
          React.createElement(Body, { dim: true, variant: 'body', style: { fontSize: 13, lineHeight: '1.45' } }, tx('7 小时 42 分 · 4 个完整睡眠周期', '7h 42m · 4 full cycles'))))),
    React.createElement('div', { style: { height: 14 } }),
    React.createElement(SectionLabel, null, tx('睡眠结构', 'Sleep stages')),
    React.createElement('div', { style: { marginTop: 6, display: 'flex', flexDirection: 'column', gap: 9 } },
      contribs.map((s, i) => {
        const gp = easeOut(phase(p, 0.12 + i * 0.05, 0.5 + i * 0.05));
        return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('div', { style: { width: 42 } }, React.createElement(Label, null, s.n)),
          React.createElement('div', { style: { flex: 1, height: 8, borderRadius: 99, background: 'rgba(40,60,90,0.08)', overflow: 'hidden' } },
            React.createElement('div', { style: { width: (s.v * gp) + '%', height: '100%', borderRadius: 99, background: s.c } })),
          React.createElement('div', { style: { width: 34, textAlign: 'right' } }, React.createElement(Label, { dim: true }, s.v + '%')));
      })),
    React.createElement('div', { style: { flex: 1 } }),
    React.createElement(Card, { style: { padding: 14, marginTop: 14 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
        React.createElement(Sparkle, null),
        React.createElement(Label, { style: { color: '#b8893f', letterSpacing: 1 } }, tx('AI 洞察', 'AI INSIGHT'))),
      React.createElement(Body, { variant: 'body', style: { minHeight: 56 } }, shown,
        typing ? React.createElement('span', { style: { opacity: 0.7 } }, '\u258a') : null)));
}

function Sparkle() {
  return React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 16 16' },
    React.createElement('path', { d: 'M8 0l1.6 4.8L14 8l-4.4 1.6L8 16l-1.6-6.4L2 8l4.4-1.6z', fill: '#b8893f' }));
}

// ── polar helper for the cycle ring ─────────────────────────────
function polar(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function SceneAnalysis({ active = true }) {
  const { Title, Body, Caption, Label, Card, SectionLabel } = window.AuraDS;
  const p = useLoop(15000, { active });
  const tx = useTx();
  const GREEN = '#3aa76d', BLUE = '#5b8fd6';
  const stageLabels = [tx('清醒', 'Awake'), 'REM', tx('浅睡', 'Light'), tx('深睡', 'Deep')];
  const seq = [[0,3],[0.03,1],[0.10,0],[0.20,1],[0.26,0],[0.31,1],[0.35,2],[0.42,1],[0.47,0],[0.53,1],[0.59,2],[0.64,1],[0.70,3],[0.73,1],[0.80,1],[0.83,3],[0.87,1],[0.93,2],[1,3]];
  const HW = 296, HH = 108, padT = 8, padB = 10;
  const xOf = t => +(t * HW).toFixed(1);
  const yOf = s => +(padT + (3 - s) / 3 * (HH - padT - padB)).toFixed(1);
  let hd = 'M ' + xOf(seq[0][0]) + ' ' + yOf(seq[0][1]);
  for (let i = 1; i < seq.length; i++) hd += ' H ' + xOf(seq[i][0]) + ' V ' + yOf(seq[i][1]);
  const draw = easeInOut(phase(p, 0.04, 0.4));
  const hours = ['23:00', '01:00', '03:00', '05:00', '07:00'];
  const legend = [[BLUE, tx('入睡', 'Asleep'), '23:08'], ['#8794ad', tx('醒来', 'Awake'), '06:40'], [GREEN, tx('总时长', 'Total'), '7h 32m']];
  const score = Math.round(counted(p, 0, 92, 0.04, 0.4));
  const CX = 44, CY = 44, R = 36, C = 2 * Math.PI * R, ringP = counted(p, 0, 0.92, 0.04, 0.4);
  const contribs = [
    { n: tx('深睡', 'Deep'), v: 32, c: '#5f9bd8' },
    { n: 'REM', v: 24, c: '#8b6fe0' },
    { n: tx('浅睡', 'Light'), v: 38, c: '#b8893f' },
    { n: tx('清醒', 'Awake'), v: 6, c: '#e16a7d' },
  ];
  const insight = tx('深睡较上周提升 18%。今晚把降温提前 20 分钟，预计可再延长深睡 12 分钟。', 'Deep sleep +18% vs last week. Cooling 20 min earlier tonight could add ~12 min more.');
  const rev = phase(p, 0.5, 0.84), shown = insight.slice(0, Math.floor(insight.length * rev)), typing = rev > 0 && rev < 1;

  return React.createElement(React.Fragment, null,
    React.createElement(AppBar, { left: tx('AI 分析 · Insights', 'AI insights'), right: tx('今晨 06:40', 'Today 06:40') }),
    React.createElement(Title, { style: { marginBottom: 12 } }, tx('睡眠分析', 'Sleep analysis')),
    React.createElement(Card, { style: { padding: 14 } },
      React.createElement(Label, { dim: true, style: { marginBottom: 8 } }, tx('整夜睡眠曲线', 'Overnight stages')),
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: HH, paddingBottom: padB } },
          stageLabels.map((s, i) => React.createElement(Caption, { key: i }, s))),
        React.createElement('svg', { width: '100%', height: HH, viewBox: '0 0 ' + HW + ' ' + HH, preserveAspectRatio: 'none', style: { flex: 1 } },
          [0, 1, 2, 3].map(s => React.createElement('line', { key: s, x1: 0, y1: yOf(s), x2: HW, y2: yOf(s), stroke: 'rgba(40,60,90,0.07)', strokeWidth: 1 })),
          React.createElement('path', { d: hd, fill: 'none', stroke: BLUE, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw }))),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 6 } },
        hours.map(h => React.createElement(Caption, { key: h }, h))),
      React.createElement('div', { style: { display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' } },
        legend.map((l, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 5 } },
          React.createElement('span', { style: { width: 7, height: 7, borderRadius: 99, background: l[0] } }),
          React.createElement(Caption, null, l[1] + ' ' + l[2]))))),
    React.createElement('div', { style: { height: 14 } }),
    React.createElement(Card, { highlight: true, style: { padding: 16 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
        React.createElement('div', { style: { position: 'relative', width: 88, height: 88, flex: '0 0 auto' } },
          React.createElement('svg', { width: 88, height: 88, viewBox: '0 0 88 88' },
            React.createElement('defs', null,
              React.createElement('linearGradient', { id: 'anRing', x1: '0', y1: '0', x2: '1', y2: '1' },
                React.createElement('stop', { offset: '0%', stopColor: '#b8893f' }),
                React.createElement('stop', { offset: '100%', stopColor: '#e08a60' }))),
            React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'rgba(40,60,90,0.10)', strokeWidth: 8 }),
            React.createElement('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: 'url(#anRing)', strokeWidth: 8, strokeLinecap: 'round', strokeDasharray: C, strokeDashoffset: C * (1 - ringP), transform: 'rotate(-90 ' + CX + ' ' + CY + ')' })),
          React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
            React.createElement(Body, { variant: 'hero', style: { fontSize: 30, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, score),
            React.createElement(Caption, null, tx('优秀', 'Great')))),
        React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          React.createElement(Label, { dim: true, style: { marginBottom: 4 } }, tx('今晨状态', 'This morning')),
          React.createElement(Body, { serif: true, variant: 'title', style: { fontSize: 21, color: '#1a2238', marginBottom: 5, lineHeight: '1.1' } }, tx('神清气爽', 'Well rested')),
          React.createElement(Body, { dim: true, variant: 'body', style: { fontSize: 13, lineHeight: '1.5' } }, tx('7 小时 42 分 · 4 个完整睡眠周期', '7h 42m · 4 full cycles')))),
    ),
    React.createElement('div', { style: { height: 14 } }),
    React.createElement(SectionLabel, null, tx('睡眠结构', 'Sleep stages')),
    React.createElement('div', { style: { marginTop: 8, display: 'flex', flexDirection: 'column', gap: 9 } },
      contribs.map((s, i) => {
        const gp = easeOut(phase(p, 0.12 + i * 0.05, 0.5 + i * 0.05));
        return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('div', { style: { width: 42 } }, React.createElement(Label, null, s.n)),
          React.createElement('div', { style: { flex: 1, height: 8, borderRadius: 99, background: 'rgba(40,60,90,0.08)', overflow: 'hidden' } },
            React.createElement('div', { style: { width: (s.v * gp) + '%', height: '100%', borderRadius: 99, background: s.c } })),
          React.createElement('div', { style: { width: 34, textAlign: 'right' } }, React.createElement(Label, { dim: true }, s.v + '%')));
      })),
    React.createElement('div', { style: { height: 14 } }),
    React.createElement(Card, { style: { padding: 14 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
        React.createElement(Sparkle, null),
        React.createElement(Label, { style: { color: '#b8893f', letterSpacing: 1 } }, tx('AI 洞察', 'AI INSIGHT'))),
      React.createElement(Body, { variant: 'body', style: { minHeight: 52 } }, shown,
        typing ? React.createElement('span', { style: { opacity: 0.7 } }, '\u258a') : null)));
}

Object.assign(window, { SceneTrend, SceneWomen, SceneAI, SceneAnalysis });
