// marketing.jsx — Eight Sleep / Orion-style commerce sections for the full
// Aura product page. Reuses DS components; exports everything to window.

const { useState: mUseState, useRef: mUseRef, useEffect: mUseEffect } = React;

// shared reveal hook (visible base state; entrance class added on intersect)
function useReveal(threshold = 0.18) {
  const ref = mUseRef(null);
  const [seen, setSeen] = mUseState(false);
  mUseEffect(() => {
    const el = ref.current; if (!el) return;
    const r0 = el.getBoundingClientRect();
    if (r0.top < window.innerHeight && r0.bottom > 0) setSeen(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); },
      { threshold, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

// ── thin announcement bar ───────────────────────────────────────
function AnnouncementBar({ lang }) {
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [hidden, setHidden] = mUseState(false);
  if (hidden) return null;
  return React.createElement('div', { className: 'announce' },
    React.createElement('span', null, tx('30 晚无忧试睡 · 全国包邮 · 1 年质保', '30-night trial · Free shipping · 1-year warranty')),
    React.createElement('button', { className: 'announce-x', onClick: () => setHidden(true), 'aria-label': 'close' }, '×'));
}

// ── trust strip under hero ──────────────────────────────────────
function TrustStrip({ lang }) {
  const { Body, Caption } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const items = [
    [stars(), tx('4.9 平均评分', '4.9 avg rating')],
    ['12,000+', tx('安睡用户', 'sleepers')],
    [tx('30 晚', '30-night'), tx('无忧试睡', 'risk-free trial')],
    [tx('1 年', '1-year'), tx('整机质保', 'warranty')],
  ];
  return React.createElement('div', { className: 'trust-strip page-wrap' },
    items.map((it, i) => React.createElement('div', { key: i, className: 'trust-cell' },
      typeof it[0] === 'string'
        ? React.createElement(Body, { style: { fontSize: 22, fontWeight: 800, color: '#1a2238' } }, it[0])
        : it[0],
      React.createElement(Caption, null, it[1]))));
}
function stars() {
  return React.createElement('div', { style: { display: 'flex', gap: 2 } },
    [0, 1, 2, 3, 4].map(i => React.createElement('svg', { key: i, width: 18, height: 18, viewBox: '0 0 16 16' },
      React.createElement('path', { d: 'M8 1l1.9 4.1L14 5.6l-3 3 .8 4.4L8 11l-3.8 2 .8-4.4-3-3 4.1-.5z', fill: '#b8893f' }))));
}

// ── "Meet Aura" pillars ─────────────────────────────────────
function Pillars({ lang }) {
  const { Title, Body, Card, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.15);
  const items = [
    { i: 'climate', t: tx('双区智能温控', 'Dual-zone climate'), d: tx('左右独立,16–43°C,精度 ±0.3°C。', 'Independent sides, 16–43°C, ±0.3°C.') },
    { i: 'ai', t: tx('AI 睡眠监测', 'AI sleep tracking'), d: tx('整夜分期、评分与可执行洞察。', 'Overnight stages, score and insight.') },
    { i: 'cycle', t: tx('女性健康', 'Women\u2019s health'), d: tx('跟随周期与体温调节床温。', 'Warmth that follows your cycle.') },
    { i: 'fit', t: tx('适配更多附件', 'More smart add-ons'), d: tx('智能床架、智能枕头、智能眼罩。', 'Smart frame, pillow & eye mask.') },
  ];
  return React.createElement('section', { className: 'pillars', id: 'meet', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('认识 Aura', 'Meet Aura')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } },
          tx('一张床垫,四种智能', 'One cover, four kinds of smart'))),
      React.createElement('div', { className: 'pillar-grid' },
        items.map((it, idx) => React.createElement('div', { key: idx, className: 'reveal' + (seen ? ' in' : ''), style: { transitionDelay: (idx * 0.07) + 's' } },
          React.createElement(Card, { style: { padding: 22, height: '100%' } },
            React.createElement('div', { className: 'pillar-ico' }, pillarIcon(it.i)),
            React.createElement(Title, { style: { fontSize: 21, color: '#1a2238', marginTop: 16, marginBottom: 7 } }, it.t),
            React.createElement(Body, { dim: true, variant: 'body', style: { lineHeight: '1.6' } }, it.d)))))));
}
function pillarIcon(k) {
  const s = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#b8893f', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (k === 'climate') return React.createElement('svg', s,
    React.createElement('path', { d: 'M12 3v10' }), React.createElement('circle', { cx: 12, cy: 16, r: 4 }),
    React.createElement('path', { d: 'M12 3a3 3 0 0 1 3 3v6.4a4 4 0 1 1-6 0V6a3 3 0 0 1 3-3z' }));
  if (k === 'ai') return React.createElement('svg', s,
    React.createElement('path', { d: 'M4 14s1.5-2 4-2 3 1 4 1 2.5-1 4-1 2 2 2 2' }),
    React.createElement('path', { d: 'M12 3l1.2 3.3L16.5 7l-2.6 2 .7 3.4L12 11l-2.6 1.4.7-3.4L7.5 7l3.3-.7z' }));
  if (k === 'cycle') return React.createElement('svg', s,
    React.createElement('circle', { cx: 12, cy: 12, r: 8 }), React.createElement('path', { d: 'M12 4a8 8 0 0 1 0 16' }),
    React.createElement('circle', { cx: 12, cy: 4, r: 1.4, fill: '#b8893f' }));
  return React.createElement('svg', s,
    React.createElement('rect', { x: 3, y: 7, width: 18, height: 11, rx: 3 }), React.createElement('path', { d: 'M3 11h18' }));
}

// ── How it works (3 steps, photo slots) ─────────────────────────
function HowItWorks({ lang }) {
  const { Title, Body, Caption, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.12);
  const steps = [
    { n: '01', t: tx('铺上智能床垫', 'Put it on'), d: tx('像床笠一样套上你现有的床垫,几分钟搞定。', 'Slips over your existing mattress like a fitted sheet — done in minutes.'), g: 'linear-gradient(150deg,#cdd8ea,#eef1f6)' },
    { n: '02', t: tx('设定你的偏好', 'Set your preference'), d: tx('在 App 里选好左右两侧的温度与作息。', 'Choose each side\u2019s temperature and schedule in the app.'), g: 'linear-gradient(150deg,#e7d6b6,#f7efdd)' },
    { n: '03', t: tx('AI 整夜自动调节', 'Let AI run the night'), d: tx('按睡眠分期自动升降温,醒来查看分析。', 'It adapts by sleep stage all night; wake to your analysis.'), g: 'linear-gradient(150deg,#d9c3e8,#efe6f6)' },
  ];
  return React.createElement('section', { className: 'how', id: 'how', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('如何使用', 'How it works')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } },
          tx('三步,睡个好觉', 'Three steps to better sleep'))),
      React.createElement('div', { className: 'how-grid' },
        steps.map((s, i) => React.createElement('div', { key: i, className: 'how-card reveal' + (seen ? ' in' : ''), style: { transitionDelay: (i * 0.08) + 's' } },
          React.createElement('image-slot', { id: 'how-' + i, shape: 'rounded', radius: 18, placeholder: tx('拖入照片', 'Drop a photo'), style: { display: 'block', width: '100%', height: '180px', background: s.g } }),
          React.createElement('div', { className: 'how-step' },
            React.createElement(Caption, { style: { color: '#b8893f', fontWeight: 700, letterSpacing: 2 } }, s.n),
            React.createElement(Title, { style: { fontSize: 22, color: '#1a2238', margin: '4px 0 7px' } }, s.t),
            React.createElement(Body, { dim: true, variant: 'body', style: { lineHeight: '1.6' } }, s.d)))))));
}

// ── Comparison table ────────────────────────────────────────────
function Comparison({ lang }) {
  const { Title, Body, Label, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.15);
  const cols = [tx('Aura', 'Aura'), tx('普通床垫', 'Ordinary bed'), tx('电热毯', 'Heat blanket')];
  const rows = [
    [tx('双区独立控温', 'Dual-zone climate'), 1, 0, 0],
    [tx('降温能力', 'Active cooling'), 1, 0, 0],
    [tx('整夜自动调节', 'All-night auto-adjust'), 1, 0, 0],
    [tx('睡眠分期分析', 'Sleep-stage analysis'), 1, 0, 0],
    [tx('女性健康追踪', 'Women\u2019s health'), 1, 0, 0],
    [tx('适配任何床垫', 'Fits any mattress'), 1, 1, 1],
  ];
  return React.createElement('section', { className: 'compare', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('为什么不同', 'Why it\u2019s different')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } },
          tx('和普通睡眠方式比', 'Compared to the usual'))),
      React.createElement('div', { className: 'cmp-table reveal' + (seen ? ' in' : '') },
        React.createElement('div', { className: 'cmp-row cmp-head' },
          React.createElement('div', { className: 'cmp-feat' }),
          cols.map((c, i) => React.createElement('div', { key: i, className: 'cmp-col' + (i === 0 ? ' cmp-own' : '') },
            React.createElement(Label, { style: { color: i === 0 ? '#b8893f' : '#6b7592', fontWeight: 700 } }, c)))),
        rows.map((r, ri) => React.createElement('div', { key: ri, className: 'cmp-row' },
          React.createElement('div', { className: 'cmp-feat' }, React.createElement(Body, { variant: 'body', style: { fontWeight: 600 } }, r[0])),
          [1, 2, 3].map(ci => React.createElement('div', { key: ci, className: 'cmp-col' + (ci === 1 ? ' cmp-own' : '') },
            r[ci] ? cmpYes() : cmpNo()))))))); 
}
function cmpYes() {
  return React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24' },
    React.createElement('circle', { cx: 12, cy: 12, r: 11, fill: '#b8893f' }),
    React.createElement('path', { d: 'M7 12.4l3.2 3.1L17 8.8', fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }));
}
function cmpNo() {
  return React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24' },
    React.createElement('circle', { cx: 12, cy: 12, r: 11, fill: 'none', stroke: 'rgba(40,60,90,0.18)', strokeWidth: 1.6 }),
    React.createElement('path', { d: 'M9 9l6 6M15 9l-6 6', fill: 'none', stroke: 'rgba(40,60,90,0.34)', strokeWidth: 1.8, strokeLinecap: 'round' }));
}

// ── Reviews ─────────────────────────────────────────────────────
function Reviews({ lang }) {
  const { Title, Body, Label, Caption, Card, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.12);
  const list = [
    { q: tx('我和先生终于不用为温度吵架了——他那侧暖,我这侧凉,各睡各的好觉。', 'We finally stopped fighting over temperature. His side warm, mine cool — we both sleep great.'), n: tx('林女士', 'Mia L.'), m: tx('情侣双区用户', 'Couple, dual-zone') },
    { q: tx('深睡时间肉眼可见地变长,早上的分析报告让我第一次真正了解自己的睡眠。', 'My deep sleep visibly grew, and the morning report finally helped me understand my nights.'), n: tx('David', 'David R.'), m: tx('易热人群', 'Hot sleeper') },
    { q: tx('经期那几天床温会自动暖一点,很贴心,基础体温记录也很准。', 'It warms the bed a little during my period — so thoughtful, and the temperature log is accurate.'), n: tx('Yuki', 'Yuki S.'), m: tx('女性健康用户', 'Women\u2019s health') },
  ];
  return React.createElement('section', { className: 'reviews', id: 'reviews', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('用户怎么说', 'What sleepers say')),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' } },
          stars(),
          React.createElement(Title, { style: { fontSize: 'clamp(24px,3vw,38px)', color: '#1a2238' } }, tx('4.9 / 5 · 12,000+ 条评价', '4.9 / 5 · 12,000+ reviews')))),
      React.createElement('div', { className: 'review-grid' },
        list.map((r, i) => React.createElement('div', { key: i, className: 'reveal' + (seen ? ' in' : ''), style: { transitionDelay: (i * 0.08) + 's' } },
          React.createElement(Card, { style: { padding: 22, height: '100%' } },
            React.createElement('div', { style: { marginBottom: 12 } }, stars()),
            React.createElement(Body, { variant: 'bodyLg', style: { fontSize: 16, lineHeight: '1.6', color: '#1a2238', marginBottom: 16 } }, '“' + r.q + '”'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 11 } },
              React.createElement('div', { style: { width: 40, height: 40, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, background: ['linear-gradient(150deg,#5b8fd6,#a6cdf0)', 'linear-gradient(150deg,#c25b7d,#f2cedb)', 'linear-gradient(150deg,#d4763f,#ecdcbd)'][i % 3] } }, (r.n || '').trim().charAt(0)),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                React.createElement(Label, { style: { color: '#1a2238' } }, r.n),
                React.createElement(Caption, null, r.m)))))))));
}

// ── Pricing ─────────────────────────────────────────────────────
function Pricing({ lang }) {
  const { Title, Body, Caption, Label, Card, Button, SectionLabel, PremiumTag } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.12);
  const products = [
    { t: tx('早鸟', 'Early bird'), p: '$1,099', orig: '$1,499', save: tx('立省 $400', 'Save $400'), f: [tx('1× 床罩 + 床头主机', '1× cover + bedside hub'), tx('1 年高级版免费', '1 year Premium free'), tx('优先客服', 'Priority support')], cta: tx('立即支持', 'Back it now'), best: true },
    { t: tx('标准档', 'Standard'), p: '$1,299', orig: '$1,499', save: tx('立省 $200', 'Save $200'), f: [tx('1× 床罩 + 床头主机', '1× cover + bedside hub'), tx('6 个月高级版免费', '6 months Premium free'), tx('标准发货', 'Standard shipping')], cta: tx('选择', 'Choose') },
  ];
  const member = { t: tx('Aura+ 会员', 'Aura+'), p: '$9.9', per: tx('/月', '/mo'), s: tx('解锁全部高级智能', 'All premium intelligence'), f: [tx('AI 自动温控 (Autopilot)', 'AI Autopilot'), tx('进阶睡眠与健康报告', 'Advanced health reports'), tx('优先客服与延保', 'Priority care + warranty')], cta: tx('加入会员', 'Add membership') };
  return React.createElement('section', { className: 'pricing', id: 'pricing', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('选择你的方案', 'Choose your plan')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } },
          tx('从今晚开始更好地睡', 'Start sleeping better tonight'))),
      React.createElement('div', { className: 'price-grid three' },
        products.map((pl, i) => React.createElement('div', { key: i, className: 'price-card' + (pl.best ? ' best' : '') + ' reveal' + (seen ? ' in' : ''), style: { transitionDelay: (i * 0.07) + 's' } },
          pl.best ? React.createElement('div', { className: 'price-flag' }, tx('最受欢迎', 'Most popular')) : null,
          React.createElement(Title, { style: { fontSize: 21, color: '#1a2238', marginBottom: 10 } }, pl.t),
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8 } },
            React.createElement(Body, { variant: 'hero', style: { fontSize: 36, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, pl.p),
            pl.orig ? React.createElement(Body, { style: { fontSize: 17, color: '#9aa3b8', textDecoration: 'line-through' } }, pl.orig) : null),
          React.createElement(Label, { style: { color: '#1a2238', fontWeight: 700, margin: '10px 0 14px' } }, pl.save),
          React.createElement('div', { className: 'price-feats' },
            pl.f.map((f, fi) => React.createElement('div', { key: fi, className: 'price-feat' },
              cmpYes(), React.createElement(Body, { variant: 'body' }, f)))),
          React.createElement('div', { style: { marginTop: 18, width: '100%' } },
            React.createElement(Button, { label: pl.cta, variant: pl.best ? 'solid' : 'line', onPress: () => { window.location.href = 'Aura 购买页.html'; } })))),
        React.createElement('div', { className: 'price-card reveal' + (seen ? ' in' : ''), style: { transitionDelay: '0.14s' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
            React.createElement(Title, { style: { fontSize: 21, color: '#1a2238' } }, member.t),
            React.createElement(PremiumTag, null)),
          React.createElement(Caption, null, member.s),
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 2, margin: '12px 0 14px' } },
            React.createElement(Body, { variant: 'hero', style: { fontSize: 36, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, member.p),
            React.createElement(Caption, null, member.per)),
          React.createElement('div', { className: 'price-feats' },
            member.f.map((f, fi) => React.createElement('div', { key: fi, className: 'price-feat' },
              cmpYes(), React.createElement(Body, { variant: 'body' }, f)))),
          React.createElement('div', { style: { marginTop: 18, width: '100%' } },
            React.createElement(Button, { label: member.cta, variant: 'line', onPress: () => { window.location.href = 'Aura 购买页.html'; } })))),
      React.createElement('div', { style: { textAlign: 'center', marginTop: 18 } },
        React.createElement(Caption, null, tx('示意价格,含 30 晚无忧试睡与 1 年质保。', 'Illustrative pricing · 30-night trial · 1-year warranty.')))));
}

// ── FAQ accordion ───────────────────────────────────────────────
function FAQ({ lang }) {
  const { Title, Body, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.12);
  const [open, setOpen] = mUseState(0);
  const qs = [
    { q: tx('能适配我现在的床垫吗?', 'Will it fit my current mattress?'), a: tx('可以。Aura 像床笠一样套在你现有床垫上,适配大多数厚度,几分钟即可铺好。', 'Yes. Aura slips over your existing mattress like a fitted sheet and fits most depths in minutes.') },
    { q: tx('用电安全吗?有噪音吗?', 'Is it safe and quiet?'), a: tx('采用低压水循环控温,主机静音运行,床面无电热元件,睡感安心。', 'It uses low-voltage water-based climate control; the hub runs quietly and there are no electric heating elements in the bed.') },
    { q: tx('一定要订阅会员吗?', 'Do I need a subscription?'), a: tx('不需要。核心温控与睡眠分析买断即用;Aura+ 会员可额外解锁 AI 自动温控等高级功能。', 'No. Core climate control and sleep analysis are included; Aura+ unlocks premium features like AI Autopilot.') },
    { q: tx('试睡不满意可以退吗?', 'What if I don\u2019t love it?'), a: tx('30 晚无忧试睡,不满意全额退款,我们承担退货运费。', '30-night risk-free trial with a full refund — we cover return shipping.') },
    { q: tx('可以用 HSA/FSA 支付吗?', 'Can I pay with HSA/FSA?'), a: tx('符合条件的用户可以。结账时填写一份简短健康问卷,由独立持证医师评估,针对更年期血管舒缩症状(潮热/夜汗)或确诊睡眠问题出具医疗必要性证明(LMN)。资格由医师判定,而非我们。', 'Eligible customers can. At checkout you complete a short health questionnaire reviewed by an independent licensed provider, who may issue a Letter of Medical Necessity for qualifying conditions. Eligibility is decided by the provider, not us.') },
    { q: tx('我的周期数据存在哪里?', 'Where is my cycle data stored?'), a: tx('周期数据为可选项,加密存储,仅用于生成你的温控曲线。可随时在 App 内删除,我们绝不出售或共享。', 'Cycle data is optional, encrypted, and used only to generate your climate curve. Delete it anytime in the app — we never sell or share it.') },
    { q: tx('它真的会根据我的生物钟调节,还是只显示图表?', 'Does it actually adapt to my rhythm, or just show charts?'), a: tx('两者皆有。App 会展示你的 24 小时生物钟环;只需一键(高级版可全自动),它便据此对齐每晚的预冷、深睡降温与升温唤醒。', 'Both. The app shows your 24-hour circadian ring, and with one tap (or fully automatic on Premium) it aligns each night\u2019s pre-cool, deep-sleep cooling and wake-up warming.') },
    { q: tx('App 支持哪些语言?', 'Which languages does the app support?'), a: tx('目前支持英文与中文,App 内一键即时切换,更多语言陆续加入。', 'English and Chinese today, switchable instantly in-app, with more languages on the way.') },
    { q: tx('会漏水吗?', 'Can it leak?'), a: tx('水路双重密封,一旦渗漏即时侦测、自动断电。', 'The water channels are double-sealed, with instant leak detection that cuts power automatically.') },
    { q: tx('我的数据安全吗?', 'Is my data safe?'), a: tx('符合 CCPA 规范,数据可在 App 内随时导出或删除,生理数据全程脱敏。', 'CCPA-compliant — export or delete your data anytime in-app, with physiological data anonymized throughout.') },
    { q: tx('发往哪些国家和地区?', 'Where do you ship?'), a: tx('首发面向美国,其他地区陆续开放。', 'Launching in the US first, with more regions to follow.') },
  ];
  return React.createElement('section', { className: 'faq', id: 'faq', ref },
    React.createElement('div', { className: 'page-wrap faq-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('常见问题', 'FAQ')),
        React.createElement(Title, { style: { fontSize: 'clamp(26px,3.2vw,42px)', color: '#1a2238', marginTop: 8 } }, tx('还有疑问?', 'Questions?'))),
      React.createElement('div', { className: 'faq-list reveal' + (seen ? ' in' : '') },
        qs.map((it, i) => React.createElement('div', { key: i, className: 'faq-item' + (open === i ? ' open' : '') },
          React.createElement('button', { className: 'faq-q', onClick: () => setOpen(open === i ? -1 : i) },
            React.createElement(Body, { variant: 'bodyLg', style: { fontSize: 17, fontWeight: 600, color: '#1a2238' } }, it.q),
            React.createElement('span', { className: 'faq-plus' }, open === i ? '−' : '+')),
          React.createElement('div', { className: 'faq-a' },
            React.createElement(Body, { dim: true, variant: 'body', style: { lineHeight: '1.65' } }, it.a)))))));
}

// ── sticky buy bar (appears after hero) ─────────────────────────
function StickyBuyBar({ lang }) {
  const { Body, Caption, Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [show, setShow] = mUseState(false);
  mUseEffect(() => {
    const onScroll = () => setShow(window.scrollY > 760);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return React.createElement('div', { className: 'buybar' + (show ? ' show' : '') },
    React.createElement('div', { className: 'buybar-inner page-wrap' },
      React.createElement('div', { className: 'buybar-info' },
        React.createElement('img', { src: 'assets/aura-logo.svg', alt: '', className: 'buybar-mark' }),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          React.createElement(Body, { style: { fontWeight: 700, color: '#1a2238' } }, tx('Aura 智能温控床垫', 'Aura smart cover')),
          React.createElement(Caption, null, tx('$1,099 起 · 30 晚无忧试睡', 'From $1,099 · 30-night trial')))),
      React.createElement('div', { className: 'buybar-cta' },
        React.createElement(Button, { label: tx('立即购买', 'Buy now'), variant: 'solid', onPress: () => { window.location.href = 'Aura 购买页.html'; } }))));
}

Object.assign(window, {
  useReveal, AnnouncementBar, TrustStrip, Pillars, HowItWorks,
  Comparison, Reviews, Pricing, FAQ, StickyBuyBar, marketingStars: stars, cmpYes,
});
