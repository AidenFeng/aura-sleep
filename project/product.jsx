// product.jsx — full Aura product page (Eight Sleep / Orion-style commerce
// arc), reusing the scene modules + marketing sections. Mounts the page.

const { useState: pState, useRef: pRef, useEffect: pEffect } = React;

function pUseReveal(threshold = 0.18) {
  const ref = pRef(null);
  const [vis, setVis] = pState(false);
  const [seen, setSeen] = pState(false);
  pEffect(() => {
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

// ── nav ─────────────────────────────────────────────────────────
function PNav({ lang, setLang }) {
  const { Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const go = (id) => () => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); };
  return React.createElement('div', { className: 'nav' },
    React.createElement('div', { className: 'nav-inner page-wrap' },
      React.createElement('a', { className: 'wordmark', href: 'Aura 产品主页.html' },
        React.createElement('img', { src: 'assets/aura-logo.svg', alt: 'AURA', className: 'brand-mark' }), 'AURA'),
      React.createElement('div', { className: 'nav-links' },
        React.createElement('a', { onClick: go('meet') }, tx('产品', 'Product')),
        React.createElement('a', { onClick: go('how') }, tx('如何使用', 'How it works')),
        React.createElement('a', { onClick: go('reviews') }, tx('评价', 'Reviews')),
        React.createElement('a', { onClick: go('faq') }, tx('问答', 'FAQ'))),
      React.createElement('div', { className: 'nav-right' },
        React.createElement(LangToggle, { lang, setLang }),
        React.createElement('div', { className: 'nav-cta' },
          React.createElement(Button, { label: tx('购买', 'Buy'), variant: 'solid', onPress: () => { window.location.href = 'Aura 购买页.html'; } })))));
}
function LangToggle({ lang, setLang }) {
  return React.createElement('div', { className: 'lang-toggle' },
    ['zh', 'en'].map(l => React.createElement('button', { key: l, className: 'lang-opt' + (lang === l ? ' on' : ''), onClick: () => setLang(l) }, l === 'zh' ? '中' : 'EN')));
}

function MotionControls({ paused, setPaused, speed, setSpeed }) {
  const tx = useTx();
  return React.createElement('div', { className: 'motion-ctl' },
    React.createElement('button', { className: 'mc-btn', onClick: () => setPaused(p => !p), title: tx('播放/暂停', 'Play/Pause') }, paused ? '▶' : '❚❚'),
    React.createElement('div', { className: 'mc-sep' }),
    [0.5, 1, 2].map(s => React.createElement('button', { key: s, className: 'mc-spd' + (speed === s ? ' on' : ''), onClick: () => setSpeed(s) }, s + '×')));
}

// ── hero ────────────────────────────────────────────────────────
function PHero({ lang }) {
  const { Title, Body, Button, Pill } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const go = (id) => () => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); };
  return React.createElement('section', { className: 'hero', id: 'top' },
    React.createElement('div', { className: 'hero-halo' }),
    React.createElement('div', { className: 'hero-grid page-wrap' },
      React.createElement('div', { className: 'hero-text reveal in' },
        React.createElement('div', { className: 'eyebrow' },
          React.createElement(Pill, { on: true, label: tx('智能分区温控床垫', 'Smart climate mattress cover') })),
        React.createElement(Title, { style: { fontSize: 'clamp(40px,5.6vw,76px)', lineHeight: '1.1', color: '#1a2238', letterSpacing: '-0.5px', marginTop: 18 } },
          tx('掌控每一夜的', 'Master every'), React.createElement('br'),
          React.createElement('span', { className: 'grad-ink' }, tx('温度与睡眠。', 'degree of sleep.'))),
        React.createElement(Body, { variant: 'bodyLg', dim: true, style: { fontSize: 19, lineHeight: '1.6', marginTop: 20, maxWidth: 460 } },
          tx('Aura 智能温控床垫,左右双区独立调温,AI 整夜自动规划,并把每一晚的睡眠讲给你听。',
            'The Aura smart cover: independent dual-zone temperature, AI that runs the whole night, and a clear story of how you slept.')),
        React.createElement('div', { className: 'hero-cta' },
          React.createElement(Button, { label: tx('查看价格', 'See pricing'), variant: 'solid', onPress: go('pricing') }),
          React.createElement(Button, { label: tx('了解技术', 'How it works'), variant: 'line', onPress: go('how') })),
        React.createElement('div', { className: 'trust-row' },
          [tx('30 晚无忧试睡', '30-night trial'), tx('适配任何床垫', 'Fits any mattress'), tx('1 年质保', '1-year warranty')].map((t, i) =>
            React.createElement('div', { key: i, className: 'trust-item' }, React.createElement(Check, null), React.createElement(Body, { variant: 'label', dim: true }, t))))),
      React.createElement('div', { className: 'hero-viz reveal in' },
        React.createElement('div', { className: 'viz-stage' }, React.createElement(MattressViz, { active: true, scale: 1.04 })))));
}
function Check() {
  return React.createElement('svg', { width: 15, height: 15, viewBox: '0 0 16 16' },
    React.createElement('circle', { cx: 8, cy: 8, r: 8, fill: 'rgba(184,137,63,0.16)' }),
    React.createElement('path', { d: 'M4.5 8.2l2.2 2.2 4.8-5', fill: 'none', stroke: '#b8893f', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }));
}

// ── cinematic showcase panel (Eight Sleep / Orion presentation) ─
// full-height, oversized type, a large floating app screen with a soft
// color-washed glow halo + gentle scroll parallax.
function ShowcasePanel({ index, total, reverse, tint, glow, eyebrow, title, body, bullets, stat, Scene }) {
  const { Title, Body, Label, SectionLabel } = window.AuraDS;
  const [ref, vis, seen] = pUseReveal(0.16);
  const demoRef = pRef(null);
  pEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current, d = demoRef.current; if (!el || !d) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        d.style.transform = 'translateY(' + (-center * 0.045).toFixed(1) + 'px)';
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const ids = ['climate', 'analysis', 'women'];
  return React.createElement('section', { className: 'showcase ' + tint + (reverse ? ' reverse' : ''), id: ids[index], ref },
    React.createElement('div', { className: 'page-wrap show-grid' },
      React.createElement('div', { className: 'show-text reveal' + (seen ? ' in' : '') },
        React.createElement('div', { className: 'show-index' },
          React.createElement('span', { className: 'show-idx-num' }, '0' + (index + 1)),
          React.createElement('span', { className: 'show-idx-tot' }, ' / 0' + total)),
        React.createElement(SectionLabel, null, eyebrow),
        React.createElement(Title, { className: 'show-title' }, title),
        React.createElement(Body, { variant: 'bodyLg', dim: true, className: 'show-body' }, body),
        React.createElement('div', { className: 'bullets' },
          bullets.map((b, i) => React.createElement('div', { key: i, className: 'bullet' },
            React.createElement(Dot, null), React.createElement(Body, { variant: 'body' }, b)))),
        stat ? React.createElement('div', { className: 'feat-stat' },
          React.createElement(Title, { style: { fontSize: 46, color: '#b8893f', lineHeight: '1' } }, stat.big),
          React.createElement(Label, { dim: true, style: { marginTop: 4, letterSpacing: 1 } }, stat.label)) : null),
      React.createElement('div', { className: 'show-demo' },
        React.createElement('div', { className: 'show-glow', style: { background: glow } }),
        React.createElement('div', { className: 'demo-card', ref: demoRef },
          React.createElement(Phone, null, React.createElement(Scene, { active: vis }))))));
}
function Dot() {
  return React.createElement('span', { style: { width: 6, height: 6, borderRadius: 99, background: '#b8893f', flex: '0 0 auto', marginTop: 8, boxShadow: '0 0 8px rgba(184,137,63,0.5)' } });
}

// ── big claim band ──────────────────────────────────────────────
function BigClaim({ lang }) {
  const { Title, Body } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, , seen] = pUseReveal(0.3);
  return React.createElement('section', { className: 'claim', ref },
    React.createElement('div', { className: 'page-wrap claim-inner reveal' + (seen ? ' in' : '') },
      React.createElement(Body, { variant: 'label', style: { color: '#b8893f', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 } }, tx('体感温度,直接改变睡眠', 'Temperature changes everything')),
      React.createElement(Title, { style: { fontSize: 'clamp(30px,4.6vw,62px)', color: '#fff', lineHeight: '1.16', letterSpacing: '-0.5px', maxWidth: 980, margin: '0 auto' } },
        tx('合适的温度,是入睡更快、深睡更久、半夜不再热醒的开始。',
          'The right temperature means falling asleep faster, deeper sleep, and no more waking up hot.')),
      React.createElement('div', { className: 'claim-stats' },
        [['±0.3°C', tx('控温精度', 'precision')], ['16–43°C', tx('调节范围', 'range')], [tx('整夜', 'All-night'), tx('自动调节', 'auto-adjust')]].map((s, i) =>
          React.createElement('div', { key: i, className: 'claim-stat' },
            React.createElement(Title, { style: { fontSize: 'clamp(26px,3.4vw,42px)', color: '#ecdcbd', lineHeight: '1' } }, s[0]),
            React.createElement(Body, { variant: 'caption', style: { color: 'rgba(255,255,255,0.66)', marginTop: 6 } }, s[1]))))));
}

// ── closing CTA + footer ────────────────────────────────────────
function Closing({ lang }) {
  const { Title, Body, Button } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const [ref, , seen] = pUseReveal(0.25);
  const go = (id) => () => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' }); };
  return React.createElement('section', { className: 'closing', ref },
    React.createElement('div', { className: 'page-wrap closing-inner reveal' + (seen ? ' in' : '') },
      React.createElement(Title, { style: { fontSize: 'clamp(40px,6vw,84px)', color: '#1a2238', lineHeight: '1.04', letterSpacing: '-1px' } },
        tx('重新定义', 'Redefine'), React.createElement('br'),
        React.createElement('span', { className: 'grad-ink' }, tx('你的每一夜。', 'every night.'))),
      React.createElement(Body, { variant: 'bodyLg', dim: true, style: { fontSize: 19, marginTop: 20, marginBottom: 30 } },
        tx('30 晚无忧试睡,不满意全额退款。', '30-night risk-free trial. Full refund if you don\u2019t love it.')),
      React.createElement('div', { style: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' } },
        React.createElement(Button, { label: tx('立即购买', 'Buy now'), variant: 'solid', onPress: () => { window.location.href = 'Aura 购买页.html'; } }),
        React.createElement(Button, { label: tx('联系我们', 'Talk to us'), variant: 'ghost', onPress: () => {} }))));
}

function Footer({ lang }) {
  const { Body, Caption, Label } = window.AuraDS;
  const tx = (zh, en) => (lang === 'en' ? en : zh);
  const cols = [
    [tx('产品', 'Product'), [tx('智能温控', 'Climate'), tx('睡眠分析', 'Sleep analysis'), tx('女性健康', 'Women\u2019s health'), tx('价格', 'Pricing')]],
    [tx('支持', 'Support'), [tx('如何安装', 'Setup'), tx('常见问题', 'FAQ'), tx('保修政策', 'Warranty'), tx('联系我们', 'Contact')]],
    [tx('公司', 'Company'), [tx('关于 Aura', 'About'), tx('试睡政策', 'Trial'), tx('隐私', 'Privacy'), tx('条款', 'Terms')]],
  ];
  return React.createElement('footer', { className: 'footer-full' },
    React.createElement('div', { className: 'page-wrap footer-grid' },
      React.createElement('div', { className: 'footer-brand' },
        React.createElement('div', { className: 'wordmark' },
          React.createElement('img', { src: 'assets/aura-logo.svg', alt: 'AURA', className: 'brand-mark' }), 'AURA'),
        React.createElement(Caption, { style: { marginTop: 12, maxWidth: 240 } }, tx('智能睡眠系统 · 让每一夜都恰到好处。', 'Intelligent sleep system — every night, just right.'))),
      React.createElement('div', { className: 'footer-cols' },
        cols.map((c, i) => React.createElement('div', { key: i, className: 'footer-col' },
          React.createElement(Label, { style: { color: '#1a2238', marginBottom: 12 } }, c[0]),
          c[1].map((l, li) => React.createElement('a', { key: li, className: 'footer-link' }, React.createElement(Caption, null, l))))))),
    React.createElement('div', { className: 'page-wrap footer-base' },
      React.createElement(Caption, null, '© 2026 Aura'),
      React.createElement(Caption, null, tx('为更好的睡眠而生', 'Built for better sleep'))));
}

// ── root ────────────────────────────────────────────────────────
function ProductApp() {
  const [lang, setLang] = window.useSharedLang();
  const [paused, setPaused] = pState(false);
  const [speed, setSpeed] = pState(1);
  const tx = (zh, en) => (lang === 'en' ? en : zh);

  const features = [
    {
      tint: 'tint-warm', glow: 'radial-gradient(circle, rgba(224,138,96,0.34), rgba(184,137,63,0.12) 45%, transparent 70%)',
      Scene: SceneClimate,
      eyebrow: tx('智能温控', 'Smart climate'),
      title: tx('双区独立,整夜自动', 'Two zones, all night'),
      body: tx('左右两侧各自独立调温,精度 ±0.3°C;  AI 睡眠生物钟适配,整夜自动规划升温与降温。',
        'Each side adjusts independently to ±0.3°C — then AI plans the whole night\u2019s warming and cooling around your sleep stages.'),
      bullets: [tx('双区独立 · AI 自动温控', 'Dual-zone · AI Autopilot'), tx('温度曲线AI自动规划', 'AI-planned temperature curve')],
      stat: { big: tx('双区', 'Dual-zone'), label: tx('深睡调节', 'deep-sleep tuning') },
    },
    {
      tint: 'tint-cool', glow: 'radial-gradient(circle, rgba(95,155,216,0.30), rgba(139,111,224,0.12) 45%, transparent 70%)',
      Scene: SceneAnalysis,
      eyebrow: tx('AI 睡眠分析', 'AI sleep analysis'),
      title: tx('醒来,即见解', 'Wake up to insight'),
      body: tx('整夜分期曲线 + 睡眠评分 + AI 洞察:深睡、REM、效率逐项拆解,并给出当晚可执行的温度建议。',
        'Overnight hypnogram + sleep score + AI insight — deep sleep, REM and efficiency broken down, with one actionable tip for tonight.'),
      bullets: [tx('整夜分期曲线与睡眠评分', 'Hypnogram + sleep score'), tx('AI 洞察与当晚建议', 'AI insight + tonight\u2019s tip')],
      stat: { big: tx('智能', 'Smart'), label: tx('睡眠洞察', 'sleep insight') },
    },
    {
      tint: 'tint-rose', glow: 'radial-gradient(circle, rgba(224,122,153,0.30), rgba(184,137,63,0.12) 45%, transparent 70%)',
      Scene: SceneWomen,
      eyebrow: tx('女性健康', 'Women\u2019s health'),
      title: tx('懂你的周期与体温', 'In tune with your cycle'),
      body: tx('结合基础体温与周期模型,为不同阶段推荐最舒适的床温,并以周期日历预测关键窗口。',
        'Combines basal temperature with a cycle model to recommend the right warmth — and a calendar that predicts key windows.'),
      bullets: [tx('随周期调整建议床温', 'Adapts warmth to your phase'), tx('周期日历与体温预测', 'Cycle calendar + predictions')],
      stat: { big: tx('懂你', 'For her'), label: tx('女性专属体验', 'women-first experience') },
    },
  ];

  return React.createElement(MotionCtx.Provider, { value: { speed, paused, lang } },
    React.createElement(AnnouncementBar, { lang }),
    React.createElement(PNav, { lang, setLang }),
    React.createElement(PHero, { lang }),
    React.createElement(TrustStrip, { lang }),
    React.createElement(Pillars, { lang }),
    React.createElement(ShowcasePanel, { index: 0, total: 3, reverse: false, ...features[0] }),
    React.createElement(BigClaim, { lang }),
    React.createElement(ShowcasePanel, { index: 1, total: 3, reverse: true, ...features[1] }),
    React.createElement(ShowcasePanel, { index: 2, total: 3, reverse: false, ...features[2] }),
    React.createElement(HowItWorks, { lang }),
    React.createElement(Comparison, { lang }),
    React.createElement(Reviews, { lang }),
    React.createElement(Pricing, { lang }),
    React.createElement(FAQ, { lang }),
    React.createElement(Closing, { lang }),
    React.createElement(Footer, { lang }),
    React.createElement(StickyBuyBar, { lang }),
    React.createElement(MotionControls, { paused, setPaused, speed, setSpeed }));
}

(function mount() {
  const { DsPreviewFrame } = window.AuraDS;
  ReactDOM.createRoot(document.getElementById('ds-root')).render(
    React.createElement(DsPreviewFrame, null, React.createElement(ProductApp)));
})();
