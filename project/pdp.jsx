// pdp.jsx — Aura product-detail (buy) page, modeled on the Eight Sleep
// Pod Cover PDP: gallery + sticky buy box (size/plan/qty + add to cart),
// what's-included, feature strip (reuses scenes), plan compare, specs,
// reviews/FAQ (reused from marketing.jsx), footer. Mounts the page.

const { useState: dState, useRef: dRef, useEffect: dEffect } = React;

function dReveal(threshold = 0.16) {
  const ref = dRef(null);
  const [vis, setVis] = dState(false);
  const [seen, setSeen] = dState(false);
  dEffect(() => {
    const el = ref.current; if (!el) return;
    const r0 = el.getBoundingClientRect();
    if (r0.top < window.innerHeight && r0.bottom > 0) { setVis(true); setSeen(true); }
    const io = new IntersectionObserver(([e]) => { setVis(e.isIntersecting); if (e.isIntersecting) setSeen(true); },
      { threshold, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis, seen];
}
const money = n => '$' + n.toLocaleString('en-US');

// clean dual-dial graphic for the App gallery thumbnail
function appThumbGraphic() {
  const dial = (cx, color, frac, temp) => {
    const cy = 44, r = 22, C = 2 * Math.PI * r, sweep = 0.72;
    return React.createElement('g', { key: cx },
      React.createElement('circle', { cx, cy, r, fill: 'none', stroke: 'rgba(40,60,90,0.13)', strokeWidth: 6, strokeLinecap: 'round', strokeDasharray: (C * sweep).toFixed(1) + ' ' + C.toFixed(1), transform: 'rotate(126 ' + cx + ' ' + cy + ')' }),
      React.createElement('circle', { cx, cy, r, fill: 'none', stroke: color, strokeWidth: 6, strokeLinecap: 'round', strokeDasharray: (C * sweep * frac).toFixed(1) + ' ' + C.toFixed(1), transform: 'rotate(126 ' + cx + ' ' + cy + ')' }),
      React.createElement('text', { x: cx, y: cy + 5, textAnchor: 'middle', fontSize: 14, fontWeight: 800, fill: '#1a2238' }, temp));
  };
  return React.createElement('svg', { viewBox: '0 0 150 88', width: '86%', style: { display: 'block' } },
    dial(45, '#5f9bd8', 0.5, '21°'),
    dial(105, '#e08a60', 0.78, '28°'));
}
function muteIcon(muted) {
  return React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M4 9v6h4l5 4V5L8 9H4z', fill: '#fff', stroke: '#fff' }),
    muted
      ? React.createElement('path', { d: 'M17 9l4 6M21 9l-4 6' })
      : React.createElement('path', { d: 'M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12' }));
}

// ── nav ─────────────────────────────────────────────────────────
function DNav({ lang, setLang, cartCount, onCart }) {
  const { Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const go = (id) => () => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); };
  return React.createElement('div', { className: 'nav' },
    React.createElement('div', { className: 'nav-inner page-wrap' },
      React.createElement('a', { className: 'wordmark', href: 'Aura 产品主页.html' },
        React.createElement('img', { src: 'assets/aura-logo.svg', alt: 'AURA', className: 'brand-mark' }), 'AURA'),
      React.createElement('div', { className: 'nav-links' },
        React.createElement('a', { href: 'Aura 产品主页.html' }, tx('产品官网', 'Official site')),
        React.createElement('a', { onClick: go('buy') }, tx('购买主页', 'Shop')),
        React.createElement('a', { onClick: go('included') }, tx('包含内容', 'What\u2019s included')),
        React.createElement('a', { onClick: go('features') }, tx('功能', 'Features')),
        React.createElement('a', { onClick: go('plans') }, tx('会员', 'Membership')),
        React.createElement('a', { onClick: go('specs') }, tx('规格', 'Specs'))),
      React.createElement('div', { className: 'nav-right' },
        React.createElement(LangToggle, { lang, setLang }),
        React.createElement('button', { className: 'cart-btn', onClick: onCart, 'aria-label': tx('购物车', 'Cart') },
          React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#1a2238', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
            React.createElement('path', { d: 'M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6' }),
            React.createElement('circle', { cx: 9, cy: 20, r: 1.3 }),
            React.createElement('circle', { cx: 18, cy: 20, r: 1.3 })),
          cartCount > 0 ? React.createElement('span', { className: 'cart-badge' }, cartCount) : null),
        React.createElement('div', { className: 'nav-cta' },
          React.createElement(Button, { label: tx('加入购物车', 'Add to cart'), variant: 'solid', onPress: go('buy') })))));
}
function LangToggle({ lang, setLang }) {
  return React.createElement('div', { className: 'lang-toggle' },
    ['zh', 'en'].map(l => React.createElement('button', { key: l, className: 'lang-opt' + (lang === l ? ' on' : ''), onClick: () => setLang(l) }, l === 'zh' ? '中' : 'EN')));
}

// ── buy hero: gallery + sticky buy box ──────────────────────────
function BuyHero({ lang, state, set, addToCart }) {
  const { Title, Body, Caption, Label, Button, Pill } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [activeImg, setActiveImg] = dState(0);
  const [muted, setMuted] = dState(true);

  const sizes = [
    { id: 'full', t: tx('1.5 米床', 'Double'), price: 1099 },
    { id: 'queen', t: tx('1.8 米床', 'Queen'), price: 1299 },
    { id: 'king', t: tx('2.0 米床', 'King'), price: 1499 },
  ];
  const plans = [
    { id: 'std', t: tx('标准版', 'Standard'), sub: tx('核心温控 + 睡眠分析', 'Core climate + analysis'), add: 0 },
    { id: 'pro', t: tx('Aura+ 会员', 'Aura+'), sub: tx('AI 自动温控 + 进阶报告', 'AI Autopilot + advanced reports'), add: 119, per: tx('($9.9/月 × 12)', '($9.9/mo × 12)') },
  ];
  const size = sizes.find(s => s.id === state.size) || sizes[1];
  const plan = plans.find(p => p.id === state.plan) || plans[0];
  const total = (size.price + plan.add) * state.qty;
  const gallery = [
    { id: 'g0', img: 'assets/mattress-main.png', g: 'linear-gradient(150deg,#cdd8ea,#eef1f6)', label: tx('床垫主图', 'Cover') },
    { id: 'g1', video: 'assets/hub-render.mp4', g: 'linear-gradient(150deg,#e7d6b6,#f7efdd)', label: tx('控温主机', 'Hub') },
    { id: 'g2', app: true, g: 'linear-gradient(150deg,#d9c3e8,#efe6f6)', label: tx('App 界面', 'App') },
    { id: 'g3', video: 'assets/lifestyle.mp4', g: 'linear-gradient(150deg,#cfe0d6,#eef4ef)', label: tx('使用场景', 'Lifestyle') },
  ];

  return React.createElement('section', { className: 'buy', id: 'buy' },
    React.createElement('div', { className: 'buy-grid page-wrap' },
      // ── gallery ──
      React.createElement('div', { className: 'gallery' },
        React.createElement('div', { className: 'gallery-main' },
          gallery[activeImg].video
            ? React.createElement(React.Fragment, null,
                React.createElement('video', { key: gallery[activeImg].id, src: gallery[activeImg].video, autoPlay: true, loop: false, muted: muted, playsInline: true, ref: (el) => { if (el) { el.muted = muted; el.volume = muted ? 0 : 1; } }, style: { display: 'block', width: '100%', height: '100%', objectFit: 'cover' } }),
                React.createElement('button', { className: 'mute-btn', onClick: () => setMuted(m => !m), 'aria-label': muted ? tx('取消静音', 'Unmute') : tx('静音', 'Mute') }, muteIcon(muted)))
            : gallery[activeImg].app
            ? React.createElement('div', { className: 'gallery-app' }, React.createElement(window.Phone, null, React.createElement(window.SceneClimate, { active: true })))
            : gallery[activeImg].img
            ? React.createElement('img', { src: gallery[activeImg].img, alt: gallery[activeImg].label, style: { display: 'block', width: '100%', height: '100%', objectFit: 'cover' } })
            : React.createElement('image-slot', { id: gallery[activeImg].id, shape: 'rounded', radius: 22, placeholder: tx('拖入图片', 'Drop image'), style: { display: 'block', width: '100%', height: '100%', background: gallery[activeImg].g } })),
        React.createElement('div', { className: 'gallery-thumbs' },
          gallery.map((g, i) => React.createElement('button', { key: g.id, className: 'thumb' + (activeImg === i ? ' on' : ''), onClick: () => setActiveImg(i), style: { background: g.img ? `center/cover no-repeat url(${g.img})` : g.g } },
            g.video ? React.createElement('video', { src: g.video, autoPlay: false, loop: false, muted: true, playsInline: true, preload: 'auto', ref: (el) => { if (el) { el.muted = true; el.defaultMuted = true; el.volume = 0; try { el.pause(); } catch (e) {} } }, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }) : null,
            g.app ? React.createElement('div', { className: 'thumb-app' }, appThumbGraphic()) : null,
            React.createElement('span', { className: 'thumb-label' }, g.label))))),
      // ── sticky buy box ──
      React.createElement('div', { className: 'buybox-wrap' },
        React.createElement('div', { className: 'buybox' },
          React.createElement('div', { className: 'eyebrow' }, React.createElement(Pill, { on: true, label: tx('最受欢迎', 'Best seller') })),
          React.createElement(Title, { className: 'buy-title' }, tx('Aura 智能温控床垫', 'Aura Smart Cover')),
          React.createElement('div', { className: 'buy-rate' },
            window.marketingStars(),
            React.createElement(Caption, null, tx('4.9 · 12,000+ 条评价', '4.9 · 12,000+ reviews'))),
          React.createElement(Body, { dim: true, variant: 'body', className: 'buy-desc' },
            tx('双区独立温控,AI 整夜自动调节,适配你现有的任何床垫。', 'Dual-zone climate with all-night AI, fitting any mattress you already own.')),

          React.createElement('div', { className: 'opt-block' },
            React.createElement('div', { className: 'opt-head' },
              React.createElement(Label, null, tx('选择尺寸', 'Size')),
              React.createElement(Caption, null, size.t)),
            React.createElement('div', { className: 'opt-row' },
              sizes.map(s => React.createElement('button', { key: s.id, className: 'opt-chip' + (state.size === s.id ? ' on' : ''), onClick: () => set({ size: s.id }) },
                React.createElement('span', { className: 'opt-chip-t' }, s.t),
                React.createElement('span', { className: 'opt-chip-p' }, money(s.price)))))),

          React.createElement('div', { className: 'opt-block' },
            React.createElement('div', { className: 'opt-head' }, React.createElement(Label, null, tx('选择套餐', 'Plan'))),
            React.createElement('div', { className: 'plan-col' },
              plans.map(p => React.createElement('button', { key: p.id, className: 'plan-opt' + (state.plan === p.id ? ' on' : ''), onClick: () => set({ plan: p.id }) },
                React.createElement('span', { className: 'radio' + (state.plan === p.id ? ' on' : '') }),
                React.createElement('span', { className: 'plan-opt-main' },
                  React.createElement('span', { className: 'plan-opt-t' }, p.t),
                  React.createElement('span', { className: 'plan-opt-s' }, p.sub)),
                React.createElement('span', { className: 'plan-opt-p' }, p.add ? '+' + money(p.add) : tx('包含', 'Included'),
                  p.per ? React.createElement('span', { className: 'plan-opt-per' }, ' ' + p.per) : null)))) ),

          React.createElement('div', { className: 'opt-block qty-block' },
            React.createElement(Label, null, tx('数量', 'Qty')),
            React.createElement('div', { className: 'qty' },
              React.createElement('button', { className: 'qty-b', onClick: () => set({ qty: Math.max(1, state.qty - 1) }) }, '−'),
              React.createElement('span', { className: 'qty-n' }, state.qty),
              React.createElement('button', { className: 'qty-b', onClick: () => set({ qty: Math.min(9, state.qty + 1) }) }, '+'))),

          React.createElement('div', { className: 'buy-total' },
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
              React.createElement(Caption, null, tx('合计', 'Total')),
              React.createElement(Body, { variant: 'hero', style: { fontSize: 30, fontWeight: 800, color: '#1a2238', lineHeight: '1' } }, money(total))),
            React.createElement(Caption, null, tx('或 $' + Math.round(total / 12).toLocaleString() + '/月 × 12 期免息', 'or ' + money(Math.round(total / 12)) + '/mo · 12 mo 0%'))),

          React.createElement('div', { className: 'buy-actions' },
            React.createElement(Button, { label: tx('加入购物车 · ' + money(total), 'Add to cart · ' + money(total)), variant: 'solid', onPress: addToCart }),
            React.createElement(Button, { label: tx('立即购买', 'Buy now'), variant: 'line', onPress: addToCart })),

          React.createElement('div', { className: 'buy-assure' },
            [tx('30 晚无忧试睡', '30-night trial'), tx('全国包邮', 'Free shipping'), tx('1 年质保', '1-yr warranty')].map((t, i) =>
              React.createElement('div', { key: i, className: 'assure-item' }, window.cmpYes(), React.createElement(Caption, null, t)))))) ));
}

// ── what's included ─────────────────────────────────────────────
function inclIcon(k) {
  const s = { width: 42, height: 42, viewBox: '0 0 48 48', fill: 'none', stroke: 'rgba(40,60,90,0.6)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (k === 'mattress') return React.createElement('svg', s,
    React.createElement('rect', { x: 6, y: 19, width: 36, height: 17, rx: 5 }),
    React.createElement('path', { d: 'M6 27h36' }),
    React.createElement('path', { d: 'M11 19v-3a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v3' }));
  if (k === 'hub') return React.createElement('svg', s,
    React.createElement('rect', { x: 10, y: 10, width: 28, height: 28, rx: 7 }),
    React.createElement('circle', { cx: 24, cy: 24, r: 6 }),
    React.createElement('path', { d: 'M24 13v2M24 33v2' }));
  return React.createElement('svg', s,
    React.createElement('rect', { x: 15, y: 7, width: 18, height: 34, rx: 4 }),
    React.createElement('path', { d: 'M15 14h18M15 34h18' }));
}
function WhatsIncluded({ lang }) {
  const { Title, Body, Caption, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, , seen] = dReveal(0.14);
  const items = [
    { ic: 'mattress', g: 'linear-gradient(150deg,#cdd8ea,#eef1f6)', t: tx('智能温控床垫', 'Smart cover'), d: tx('水循环控温层,像床笠一样套上。', 'Water-channel cover that slips on like a sheet.') },
    { ic: 'hub', g: 'linear-gradient(150deg,#e7d6b6,#f7efdd)', t: tx('控温主机', 'The Hub'), d: tx('静音运行,双区独立供水控温。', 'Quiet hub driving both zones independently.') },
    { ic: 'app', g: 'linear-gradient(150deg,#d9c3e8,#efe6f6)', t: tx('Aura App', 'Aura app'), d: tx('温控、睡眠分析与健康追踪。', 'Climate, sleep analysis and health tracking.') },
  ];
  return React.createElement('section', { className: 'included', id: 'included', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('开箱即用', 'In the box')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } }, tx('包含哪些', 'What\u2019s included'))),
      React.createElement('div', { className: 'incl-grid' },
        items.map((it, i) => React.createElement('div', { key: i, className: 'incl-card reveal' + (seen ? ' in' : ''), style: { transitionDelay: (i * 0.08) + 's' } },
          React.createElement('div', { className: 'incl-media', style: { background: it.g } },
            React.createElement('div', { className: 'incl-ico' }, inclIcon(it.ic))),
          React.createElement('div', { className: 'incl-body' },
            React.createElement(Title, { style: { fontSize: 21, color: '#1a2238', margin: '2px 0 6px' } }, it.t),
            React.createElement(Body, { dim: true, variant: 'body', style: { lineHeight: '1.6' } }, it.d)))))));
}

// ── feature strip (reuses scene demos, compact) ─────────────────
function FeatureStrip({ lang }) {
  const { Title, Body, Label, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const rows = [
    { Scene: SceneClimate, e: tx('双区智能温控', 'Dual-zone climate'), t: tx('你的凉,与 TA 的暖', 'Your cool, their warm'), b: tx('左右独立调温,精度 ±0.3°C,AI 整夜自动规划。', 'Independent sides to ±0.3°C, planned all night by AI.'), rev: false },
    { Scene: SceneAnalysis, e: tx('AI 睡眠分析', 'AI sleep analysis'), t: tx('醒来,即见解', 'Wake up to insight'), b: tx('整夜分期、评分与可执行的当晚建议。', 'Overnight stages, score and an actionable tip.'), rev: true },
    { Scene: SceneWomen, e: tx('女性健康', 'Women\u2019s health'), t: tx('懂你的周期与体温', 'In tune with your cycle'), b: tx('周期日历 + 基础体温,推荐每阶段床温。', 'Cycle calendar + basal temp, warmth per phase.'), rev: false },
  ];
  return React.createElement('section', { className: 'features', id: 'features' },
    React.createElement('div', { className: 'page-wrap' },
      rows.map((r, i) => React.createElement(FeatureRowCompact, { key: i, ...r }))));
}
function FeatureRowCompact({ Scene, e, t, b, rev }) {
  const { Title, Body, SectionLabel } = window.AuraDS;
  const [ref, vis, seen] = dReveal(0.18);
  return React.createElement('div', { className: 'frow' + (rev ? ' reverse' : ''), ref },
    React.createElement('div', { className: 'frow-text reveal' + (seen ? ' in' : '') },
      React.createElement(SectionLabel, null, e),
      React.createElement(Title, { style: { fontSize: 'clamp(26px,3vw,40px)', lineHeight: '1.1', color: '#1a2238', margin: '8px 0 12px' } }, t),
      React.createElement(Body, { variant: 'bodyLg', dim: true, style: { fontSize: 17, lineHeight: '1.6', maxWidth: 400 } }, b)),
    React.createElement('div', { className: 'frow-demo reveal' + (seen ? ' in' : '') },
      React.createElement('div', { className: 'frow-glow' }),
      React.createElement('div', { className: 'demo-card' }, React.createElement(Phone, null, React.createElement(Scene, { active: vis })))));
}

// ── plan compare (Standard vs Pro) ──────────────────────────────
function PlanCompare({ lang }) {
  const { Title, Body, Label, Caption, SectionLabel, PremiumTag } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, , seen] = dReveal(0.14);
  const rows = [
    [tx('双区独立温控', 'Dual-zone climate'), 1, 1],
    [tx('睡眠评分与分期', 'Sleep score + stages'), 1, 1],
    [tx('女性健康追踪', 'Women\u2019s health'), 1, 1],
    [tx('AI 自动温控 (Autopilot)', 'AI Autopilot'), 0, 1],
    [tx('进阶健康报告', 'Advanced health reports'), 0, 1],
    [tx('优先客服与延保', 'Priority care + warranty'), 0, 1],
  ];
  return React.createElement('section', { className: 'plans', id: 'plans', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('选择会员', 'Choose membership')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } }, tx('标准版 与 Pro 会员', 'Standard vs Pro'))),
      React.createElement('div', { className: 'plan-table reveal' + (seen ? ' in' : '') },
        React.createElement('div', { className: 'plan-trow plan-thead' },
          React.createElement('div', { className: 'plan-feat' }),
          React.createElement('div', { className: 'plan-tcol' }, React.createElement(Label, { style: { color: '#6b7592', fontWeight: 700 } }, tx('标准版', 'Standard'))),
          React.createElement('div', { className: 'plan-tcol plan-own' },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
              React.createElement(Label, { style: { color: '#b8893f', fontWeight: 700 } }, 'Pro'), React.createElement(PremiumTag, null)))),
        rows.map((r, i) => React.createElement('div', { key: i, className: 'plan-trow' },
          React.createElement('div', { className: 'plan-feat' }, React.createElement(Body, { variant: 'body', style: { fontWeight: 600 } }, r[0])),
          React.createElement('div', { className: 'plan-tcol' }, r[1] ? window.cmpYes() : dDash()),
          React.createElement('div', { className: 'plan-tcol plan-own' }, r[2] ? window.cmpYes() : dDash()))))));
}
function dDash() {
  return React.createElement('span', { style: { width: 16, height: 2, borderRadius: 2, background: 'rgba(40,60,90,0.22)' } });
}

// ── specs ───────────────────────────────────────────────────────
function Specs({ lang }) {
  const { Title, Label, Body, SectionLabel } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, , seen] = dReveal(0.12);
  const specs = [
    [tx('温度范围', 'Temperature range'), '16–43°C'],
    [tx('控温精度', 'Precision'), '±0.3°C'],
    [tx('温区', 'Zones'), tx('左右双区独立', 'Dual, independent')],
    [tx('适配厚度', 'Mattress depth'), tx('25–40 cm', '25–40 cm')],
    [tx('主机噪音', 'Hub noise'), tx('< 35 分贝', '< 35 dB')],
    [tx('连接方式', 'Connectivity'), 'Wi-Fi · Bluetooth'],
    [tx('供电', 'Power'), tx('低压直流 · 安全', 'Low-voltage DC')],
    [tx('清洁', 'Care'), tx('床垫面可机洗', 'Machine-washable cover')],
  ];
  return React.createElement('section', { className: 'specs', id: 'specs', ref },
    React.createElement('div', { className: 'page-wrap' },
      React.createElement('div', { className: 'sec-head reveal' + (seen ? ' in' : '') },
        React.createElement(SectionLabel, null, tx('技术规格', 'Specifications')),
        React.createElement(Title, { style: { fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 } }, tx('参数一览', 'The details'))),
      React.createElement('div', { className: 'spec-table reveal' + (seen ? ' in' : '') },
        specs.map((s, i) => React.createElement('div', { key: i, className: 'spec-trow' },
          React.createElement(Label, { dim: true }, s[0]),
          React.createElement(Body, { variant: 'body', style: { fontWeight: 600, color: '#1a2238' } }, s[1]))))));
}

// ── footer ──────────────────────────────────────────────────────
function DFooter({ lang }) {
  const { Caption, Label } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const cols = [
    [tx('产品', 'Product'), [tx('智能温控', 'Climate'), tx('睡眠分析', 'Sleep analysis'), tx('女性健康', 'Women\u2019s health'), tx('规格', 'Specs')]],
    [tx('支持', 'Support'), [tx('如何安装', 'Setup'), tx('常见问题', 'FAQ'), tx('保修政策', 'Warranty'), tx('联系我们', 'Contact')]],
    [tx('公司', 'Company'), [tx('关于 Aura', 'About'), tx('试睡政策', 'Trial'), tx('隐私', 'Privacy'), tx('条款', 'Terms')]],
  ];
  return React.createElement('footer', { className: 'footer-full' },
    React.createElement('div', { className: 'page-wrap footer-grid' },
      React.createElement('div', { className: 'footer-brand' },
        React.createElement('div', { className: 'wordmark' }, React.createElement('img', { src: 'assets/aura-logo.svg', alt: 'AURA', className: 'brand-mark' }), 'AURA'),
        React.createElement(Caption, { style: { marginTop: 12, maxWidth: 240 } }, tx('智能睡眠系统 · 让每一夜都恰到好处。', 'Intelligent sleep system — every night, just right.'))),
      React.createElement('div', { className: 'footer-cols' },
        cols.map((c, i) => React.createElement('div', { key: i, className: 'footer-col' },
          React.createElement(Label, { style: { color: '#1a2238', marginBottom: 12 } }, c[0]),
          c[1].map((l, li) => React.createElement('a', { key: li, className: 'footer-link' }, React.createElement(Caption, null, l))))))),
    React.createElement('div', { className: 'page-wrap footer-base' },
      React.createElement(Caption, null, '© 2026 Aura'),
      React.createElement(Caption, null, tx('为更好的睡眠而生', 'Built for better sleep'))));
}

// ── sticky add-to-cart bar (mobile + after scroll) ──────────────
function DBuyBar({ lang, total, addToCart }) {
  const { Body, Caption, Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [show, setShow] = dState(false);
  dEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return React.createElement('div', { className: 'buybar' + (show ? ' show' : '') },
    React.createElement('div', { className: 'buybar-inner page-wrap' },
      React.createElement('div', { className: 'buybar-info' },
        React.createElement('img', { src: 'assets/aura-logo.svg', alt: '', className: 'buybar-mark' }),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
          React.createElement(Body, { style: { fontWeight: 700, color: '#1a2238' } }, tx('Aura 智能温控床垫', 'Aura Smart Cover')),
          React.createElement(Caption, null, money(total) + tx(' · 30 晚无忧试睡', ' · 30-night trial')))),
      React.createElement('div', { className: 'buybar-cta' },
        React.createElement(Button, { label: tx('加入购物车', 'Add to cart'), variant: 'solid', onPress: addToCart }))));
}

// ── cart toast + drawer ─────────────────────────────────────────
function CartToast({ lang, toast, onView }) {
  const { Body, Caption, Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  return React.createElement('div', { className: 'cart-toast' + (toast ? ' show' : '') },
    toast ? React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'cart-toast-ic' }, window.cmpYes()),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 } },
        React.createElement(Body, { style: { fontWeight: 700, color: '#1a2238' } }, tx('已加入购物车', 'Added to cart')),
        React.createElement(Caption, null, toast.name + ' · ' + toast.spec)),
      React.createElement(Button, { label: tx('查看', 'View'), variant: 'line', onPress: onView })) : null);
}
function CartDrawer({ lang, open, cart, setCart, onClose }) {
  const { Title, Body, Caption, Label, Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const grand = cart.reduce((n, it) => n + it.total, 0);
  const remove = (key) => setCart(c => c.filter(it => it.key !== key));
  return React.createElement('div', { className: 'cart-overlay' + (open ? ' open' : ''), 'aria-hidden': !open },
    React.createElement('div', { className: 'cart-backdrop', onClick: onClose }),
    React.createElement('aside', { className: 'cart-panel' },
      React.createElement('div', { className: 'cart-head' },
        React.createElement(Title, { style: { fontSize: 22, color: '#1a2238' } }, tx('购物车', 'Your cart')),
        React.createElement('button', { className: 'cart-close', onClick: onClose, 'aria-label': tx('关闭', 'Close') }, '×')),
      cart.length === 0
        ? React.createElement('div', { className: 'cart-empty' },
            React.createElement(Body, { dim: true, variant: 'body' }, tx('购物车还是空的。', 'Your cart is empty.')),
            React.createElement('div', { style: { marginTop: 16 } },
              React.createElement(Button, { label: tx('继续选购', 'Keep shopping'), variant: 'line', onPress: onClose })))
        : React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'cart-items' },
              cart.map((it) => React.createElement('div', { key: it.key, className: 'cart-item' },
                React.createElement('div', { className: 'cart-item-thumb' }),
                React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 } },
                  React.createElement(Body, { style: { fontWeight: 700, color: '#1a2238' } }, it.name),
                  React.createElement(Caption, null, it.spec + ' · ×' + it.qty),
                  React.createElement('button', { className: 'cart-remove', onClick: () => remove(it.key) }, tx('移除', 'Remove'))),
                React.createElement(Label, { style: { color: '#1a2238', fontWeight: 700 } }, money(it.total))))),
            React.createElement('div', { className: 'cart-foot' },
              React.createElement('div', { className: 'cart-total-row' },
                React.createElement(Body, { style: { fontWeight: 700, color: '#1a2238' } }, tx('合计', 'Subtotal')),
                React.createElement(Body, { variant: 'hero', style: { fontSize: 24, fontWeight: 800, color: '#1a2238' } }, money(grand))),
              React.createElement(Caption, { style: { marginBottom: 14 } }, tx('含税 · 30 晚无忧试睡 · 全国包邮', 'Tax incl. · 30-night trial · free shipping')),
              React.createElement(Button, { label: tx('去结算 · ' + money(grand), 'Checkout · ' + money(grand)), variant: 'solid', onPress: () => {} })))));
}

// ── root ────────────────────────────────────────────────────────
function PdpApp() {
  const [lang, setLang] = window.useSharedLang();
  const [paused, setPaused] = dState(false);
  const [speed, setSpeed] = dState(1);
  const [state, setState] = dState({ size: 'queen', plan: 'std', qty: 1 });
  const [cart, setCart] = dState([]);
  const [cartOpen, setCartOpen] = dState(false);
  const [toast, setToast] = dState(null);
  const set = (patch) => setState(s => ({ ...s, ...patch }));
  const sizePrice = { full: 1099, queen: 1299, king: 1499 }[state.size];
  const planAdd = state.plan === 'pro' ? 119 : 0;
  const total = (sizePrice + planAdd) * state.qty;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const sizeLabel = { full: tx('1.5 米床', 'Full'), queen: tx('1.8 米床', 'Queen'), king: tx('2.0 米床', 'King') }[state.size];
  const planLabel = state.plan === 'pro' ? tx('Aura+ 会员', 'Aura+') : tx('标准版', 'Standard');
  const addToCart = () => {
    const item = { key: Date.now(), name: tx('Aura 智能温控床垫', 'Aura Smart Cover'), spec: sizeLabel + ' · ' + planLabel, qty: state.qty, total };
    setCart(c => [...c, item]);
    setCartOpen(false);
    setToast(item);
    setTimeout(() => setToast(t => (t === item ? null : t)), 2800);
  };
  const cartCount = cart.reduce((n, it) => n + it.qty, 0);

  return React.createElement(MotionCtx.Provider, { value: { speed, paused, lang } },
    React.createElement(DNav, { lang, setLang, cartCount, onCart: () => setCartOpen(true) }),
    React.createElement(BuyHero, { lang, state, set, addToCart }),
    React.createElement(WhatsIncluded, { lang }),
    React.createElement(FeatureStrip, { lang }),
    React.createElement(PlanCompare, { lang }),
    React.createElement(window.Reviews, { lang }),
    React.createElement(Specs, { lang }),
    React.createElement(window.FAQ, { lang }),
    React.createElement(DFooter, { lang }),
    React.createElement(DBuyBar, { lang, total, addToCart }),
    React.createElement(CartToast, { lang, toast, onView: () => { setToast(null); setCartOpen(true); } }),
    React.createElement(CartDrawer, { lang, open: cartOpen, cart, setCart, onClose: () => setCartOpen(false) }),
    React.createElement(DMotion, { paused, setPaused, speed, setSpeed }));
}
function DMotion({ paused, setPaused, speed, setSpeed }) {
  const tx = useTx();
  return React.createElement('div', { className: 'motion-ctl' },
    React.createElement('button', { className: 'mc-btn', onClick: () => setPaused(p => !p) }, paused ? '▶' : '❚❚'),
    React.createElement('div', { className: 'mc-sep' }),
    [0.5, 1, 2].map(s => React.createElement('button', { key: s, className: 'mc-spd' + (speed === s ? ' on' : ''), onClick: () => setSpeed(s) }, s + '×')));
}

(function mount() {
  const { DsPreviewFrame } = window.AuraDS;
  ReactDOM.createRoot(document.getElementById('ds-root')).render(
    React.createElement(DsPreviewFrame, null, React.createElement(PdpApp)));
})();
