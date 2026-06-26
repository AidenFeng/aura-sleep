// Aura PDP — gallery + sticky buy box + what's included + feature strip +
// plan compare + reviews + specs + FAQ + footer + sticky buy bar + cart.
// Ported from the prototype's pdp.jsx.
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Title, Body, Caption, Label, Button, Pill, Card, SectionLabel, PremiumTag } from '../ds';
import { MotionCtx, useSharedLang, useTx, Phone, asset, useDevControls } from '../lib/motion';
import { useVisible, useReveal } from '../lib/reveal';
import { SceneClimate } from '../scenes/scenes1';
import { SceneWomen, SceneAnalysis } from '../scenes/scenes2';
import { Reviews, FAQ, stars, cmpYes } from '../sections/marketing';
import '../styles/base.css';
import '../styles/buy.css';

type Lang = 'zh' | 'en';
type Scene = (p: { active?: boolean }) => React.ReactElement;
const money = (n: number) => '$' + n.toLocaleString('en-US');

// clean dual-dial graphic for the App gallery thumbnail
function appThumbGraphic() {
  const dial = (cx: number, color: string, frac: number, temp: string) => {
    const cy = 44, r = 22, C = 2 * Math.PI * r, sweep = 0.72;
    return (
      <g key={cx}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(40,60,90,0.13)" strokeWidth={6} strokeLinecap="round" strokeDasharray={(C * sweep).toFixed(1) + ' ' + C.toFixed(1)} transform={`rotate(126 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={(C * sweep * frac).toFixed(1) + ' ' + C.toFixed(1)} transform={`rotate(126 ${cx} ${cy})`} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#1a2238">{temp}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 150 88" width="86%" style={{ display: 'block' }}>
      {dial(45, '#5f9bd8', 0.5, '21°')}
      {dial(105, '#e08a60', 0.78, '28°')}
    </svg>
  );
}
function muteIcon(muted: boolean) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#fff" stroke="#fff" />
      {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12" />}
    </svg>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="lang-toggle">
      {(['zh', 'en'] as Lang[]).map((l) => (
        <button key={l} className={'lang-opt' + (lang === l ? ' on' : '')} onClick={() => setLang(l)}>
          {l === 'zh' ? '中' : 'EN'}
        </button>
      ))}
    </div>
  );
}

// ── nav ────────────────────────────────────────────────────────
function DNav({ lang, setLang, cartCount, onCart, scrollTo }: { lang: Lang; setLang: (l: Lang) => void; cartCount: number; onCart: () => void; scrollTo: (id: string) => () => void }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  return (
    <div className="nav">
      <div className="nav-inner page-wrap">
        <Link className="wordmark" to="/">
          <img src={import.meta.env.BASE_URL + 'assets/aura-logo.svg'} alt="AURA" className="brand-mark" />
          AURA
        </Link>
        <div className="nav-links">
          <Link to="/">{tx('产品官网', 'Official site')}</Link>
          <a onClick={scrollTo('buy')}>{tx('购买主页', 'Shop')}</a>
          <a onClick={scrollTo('included')}>{tx('包含内容', 'What’s included')}</a>
          <a onClick={scrollTo('features')}>{tx('功能', 'Features')}</a>
          <a onClick={scrollTo('plans')}>{tx('会员', 'Membership')}</a>
          <a onClick={scrollTo('specs')}>{tx('规格', 'Specs')}</a>
        </div>
        <div className="nav-right">
          <LangToggle lang={lang} setLang={setLang} />
          <button className="cart-btn" onClick={onCart} aria-label={tx('购物车', 'Cart')}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#1a2238" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" />
              <circle cx={9} cy={20} r={1.3} />
              <circle cx={18} cy={20} r={1.3} />
            </svg>
            {cartCount > 0 ? <span className="cart-badge">{cartCount}</span> : null}
          </button>
          <div className="nav-cta">
            <Button label={tx('加入购物车', 'Add to cart')} variant="solid" onPress={scrollTo('buy')} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface BuyState { size: 'full' | 'queen' | 'king'; plan: 'std' | 'pro'; qty: number; }
interface SizeOpt { id: BuyState['size']; t: string; price: number; }
interface PlanOpt { id: BuyState['plan']; t: string; sub: string; add: number; per?: string; }

function BuyHero({ lang, state, set, addToCart }: { lang: Lang; state: BuyState; set: (p: Partial<BuyState>) => void; addToCart: () => void }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [activeImg, setActiveImg] = React.useState(0);
  const [muted, setMuted] = React.useState(true);

  const sizes: SizeOpt[] = [
    { id: 'full', t: tx('1.5 米床', 'Double'), price: 1099 },
    { id: 'queen', t: tx('1.8 米床', 'Queen'), price: 1299 },
    { id: 'king', t: tx('2.0 米床', 'King'), price: 1499 },
  ];
  const plans: PlanOpt[] = [
    { id: 'std', t: tx('标准版', 'Standard'), sub: tx('核心温控 + 睡眠分析', 'Core climate + analysis'), add: 0 },
    { id: 'pro', t: tx('Aura+ 会员', 'Aura+'), sub: tx('AI 自动温控 + 进阶报告', 'AI Autopilot + advanced reports'), add: 119, per: tx('($9.9/月 × 12)', '($9.9/mo × 12)') },
  ];
  const size = sizes.find((s) => s.id === state.size) || sizes[1];
  const plan = plans.find((p) => p.id === state.plan) || plans[0];
  const total = (size.price + plan.add) * state.qty;

  interface GalleryItem { id: string; img?: string; video?: string; app?: boolean; g: string; label: string; }
  const gallery: GalleryItem[] = [
    { id: 'g0', img: asset('assets/mattress-main.png'), g: 'linear-gradient(150deg,#cdd8ea,#eef1f6)', label: tx('床垫主图', 'Cover') },
    { id: 'g1', video: asset('assets/hub-render.mp4'), g: 'linear-gradient(150deg,#e7d6b6,#f7efdd)', label: tx('控温主机', 'Hub') },
    { id: 'g2', app: true, g: 'linear-gradient(150deg,#d9c3e8,#efe6f6)', label: tx('App 界面', 'App') },
    { id: 'g3', video: asset('assets/lifestyle.mp4'), g: 'linear-gradient(150deg,#cfe0d6,#eef4ef)', label: tx('使用场景', 'Lifestyle') },
  ];
  const cur = gallery[activeImg];

  return (
    <section className="buy" id="buy">
      <div className="buy-grid page-wrap">
        {/* gallery */}
        <div className="gallery">
          <div className="gallery-main">
            {cur.video ? (
              <>
                <video
                  key={cur.id}
                  src={cur.video}
                  autoPlay
                  loop={false}
                  muted={muted}
                  playsInline
                  ref={(el) => {
                    if (el) {
                      el.muted = muted;
                      el.volume = muted ? 0 : 1;
                    }
                  }}
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button className="mute-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? tx('取消静音', 'Unmute') : tx('静音', 'Mute')}>{muteIcon(muted)}</button>
              </>
            ) : cur.app ? (
              <div className="gallery-app"><Phone><SceneClimate active /></Phone></div>
            ) : cur.img ? (
              <img src={cur.img} alt={cur.label} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : null}
          </div>
          <div className="gallery-thumbs">
            {gallery.map((g, i) => (
              <button
                key={g.id}
                className={'thumb' + (activeImg === i ? ' on' : '')}
                onClick={() => setActiveImg(i)}
                style={{ background: g.img ? `center/cover no-repeat url(${g.img})` : g.g }}
              >
                {g.video ? (
                  <video
                    src={g.video}
                    autoPlay={false}
                    loop={false}
                    muted
                    playsInline
                    preload="auto"
                    ref={(el) => {
                      if (el) {
                        el.muted = true;
                        el.defaultMuted = true;
                        el.volume = 0;
                        try { el.pause(); } catch (e) { /* ignore */ }
                      }
                    }}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
                {g.app ? <div className="thumb-app">{appThumbGraphic()}</div> : null}
                <span className="thumb-label">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* sticky buy box */}
        <div className="buybox-wrap">
          <div className="buybox">
            <div className="eyebrow"><Pill on label={tx('最受欢迎', 'Best seller')} /></div>
            <Title className="buy-title">{tx('Aura 智能温控床垫', 'Aura Smart Cover')}</Title>
            <div className="buy-rate">
              {stars()}
              <Caption>{tx('4.9 · 12,000+ 条评价', '4.9 · 12,000+ reviews')}</Caption>
            </div>
            <Body dim variant="body" className="buy-desc">{tx('双区独立温控,AI 整夜自动调节,适配你现有的任何床垫。', 'Dual-zone climate with all-night AI, fitting any mattress you already own.')}</Body>

            <div className="opt-block">
              <div className="opt-head">
                <Label>{tx('选择尺寸', 'Size')}</Label>
                <Caption>{size.t}</Caption>
              </div>
              <div className="opt-row">
                {sizes.map((s) => (
                  <button key={s.id} className={'opt-chip' + (state.size === s.id ? ' on' : '')} onClick={() => set({ size: s.id })}>
                    <span className="opt-chip-t">{s.t}</span>
                    <span className="opt-chip-p">{money(s.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="opt-block">
              <div className="opt-head"><Label>{tx('选择套餐', 'Plan')}</Label></div>
              <div className="plan-col">
                {plans.map((p) => (
                  <button key={p.id} className={'plan-opt' + (state.plan === p.id ? ' on' : '')} onClick={() => set({ plan: p.id })}>
                    <span className={'radio' + (state.plan === p.id ? ' on' : '')} />
                    <span className="plan-opt-main">
                      <span className="plan-opt-t">{p.t}</span>
                      <span className="plan-opt-s">{p.sub}</span>
                    </span>
                    <span className="plan-opt-p">
                      {p.add ? '+' + money(p.add) : tx('包含', 'Included')}
                      {p.per ? <span className="plan-opt-per">{' ' + p.per}</span> : null}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="opt-block qty-block">
              <Label>{tx('数量', 'Qty')}</Label>
              <div className="qty">
                <button className="qty-b" onClick={() => set({ qty: Math.max(1, state.qty - 1) })}>−</button>
                <span className="qty-n">{state.qty}</span>
                <button className="qty-b" onClick={() => set({ qty: Math.min(9, state.qty + 1) })}>+</button>
              </div>
            </div>

            <div className="buy-total">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Caption>{tx('合计', 'Total')}</Caption>
                <Body variant="hero" style={{ fontSize: 30, fontWeight: 800, color: '#1a2238', lineHeight: '1' }}>{money(total)}</Body>
              </div>
              <Caption>{tx('或 $' + Math.round(total / 12).toLocaleString() + '/月 × 12 期免息', 'or ' + money(Math.round(total / 12)) + '/mo · 12 mo 0%')}</Caption>
            </div>

            <div className="buy-actions">
              <Button label={tx('加入购物车 · ' + money(total), 'Add to cart · ' + money(total))} variant="solid" onPress={addToCart} style={{ alignSelf: 'stretch' }} />
              <Button label={tx('立即购买', 'Buy now')} variant="line" onPress={addToCart} style={{ alignSelf: 'stretch' }} />
            </div>

            <div className="buy-assure">
              {[tx('30 晚无忧试睡', '30-night trial'), tx('全国包邮', 'Free shipping'), tx('1 年质保', '1-yr warranty')].map((t, i) => (
                <div key={i} className="assure-item">{cmpYes()}<Caption>{t}</Caption></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── what's included ─────────────────────────────────────────────
function inclIcon(k: string) {
  const s = { width: 42, height: 42, viewBox: '0 0 48 48', fill: 'none', stroke: 'rgba(40,60,90,0.6)', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (k === 'mattress') return (
    <svg {...s}>
      <rect x={6} y={19} width={36} height={17} rx={5} />
      <path d="M6 27h36" />
      <path d="M11 19v-3a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v3" />
    </svg>
  );
  if (k === 'hub') return (
    <svg {...s}>
      <rect x={10} y={10} width={28} height={28} rx={7} />
      <circle cx={24} cy={24} r={6} />
      <path d="M24 13v2M24 33v2" />
    </svg>
  );
  return (
    <svg {...s}>
      <rect x={15} y={7} width={18} height={34} rx={4} />
      <path d="M15 14h18M15 34h18" />
    </svg>
  );
}

function WhatsIncluded({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.14);
  const items = [
    { ic: 'mattress', g: 'linear-gradient(150deg,#cdd8ea,#eef1f6)', t: tx('智能温控床垫', 'Smart cover'), d: tx('水循环控温层,像床笠一样套上。', 'Water-channel cover that slips on like a sheet.') },
    { ic: 'hub', g: 'linear-gradient(150deg,#e7d6b6,#f7efdd)', t: tx('控温主机', 'The Hub'), d: tx('静音运行,双区独立供水控温。', 'Quiet hub driving both zones independently.') },
    { ic: 'app', g: 'linear-gradient(150deg,#d9c3e8,#efe6f6)', t: tx('Aura App', 'Aura app'), d: tx('温控、睡眠分析与健康追踪。', 'Climate, sleep analysis and health tracking.') },
  ];
  return (
    <section className="included" id="included" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('开箱即用', 'In the box')}</SectionLabel>
          <Title style={{ fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 }}>{tx('包含哪些', 'What’s included')}</Title>
        </div>
        <div className="incl-grid">
          {items.map((it, i) => (
            <div key={i} className={'incl-card reveal' + (seen ? ' in' : '')} style={{ transitionDelay: i * 0.08 + 's' }}>
              <div className="incl-media" style={{ background: it.g }}>
                <div className="incl-ico">{inclIcon(it.ic)}</div>
              </div>
              <div className="incl-body">
                <Title style={{ fontSize: 21, color: '#1a2238', margin: '2px 0 6px' }}>{it.t}</Title>
                <Body dim variant="body" style={{ lineHeight: '1.6' }}>{it.d}</Body>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── feature strip ──────────────────────────────────────────────
interface FRow { Scene: Scene; e: string; t: string; b: string; rev: boolean; }

function FeatureRowCompact({ Scene, e, t, b, rev }: FRow) {
  const [ref, vis, seen] = useVisible(0.18);
  return (
    <div className={'frow' + (rev ? ' reverse' : '')} ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={'frow-text reveal' + (seen ? ' in' : '')}>
        <SectionLabel>{e}</SectionLabel>
        <Title style={{ fontSize: 'clamp(26px,3vw,40px)', lineHeight: '1.1', color: '#1a2238', margin: '8px 0 12px' }}>{t}</Title>
        <Body variant="bodyLg" dim style={{ fontSize: 17, lineHeight: '1.6', maxWidth: 400 }}>{b}</Body>
      </div>
      <div className={'frow-demo reveal' + (seen ? ' in' : '')}>
        <div className="frow-glow" />
        <div className="demo-card"><Phone><Scene active={vis} /></Phone></div>
      </div>
    </div>
  );
}

function FeatureStrip({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const rows: FRow[] = [
    { Scene: SceneClimate, e: tx('双区智能温控', 'Dual-zone climate'), t: tx('你的凉,与 TA 的暖', 'Your cool, their warm'), b: tx('左右独立调温,精度 ±0.3°C,AI 整夜自动规划。', 'Independent sides to ±0.3°C, planned all night by AI.'), rev: false },
    { Scene: SceneAnalysis, e: tx('AI 睡眠分析', 'AI sleep analysis'), t: tx('醒来,即见解', 'Wake up to insight'), b: tx('整夜分期、评分与可执行的当晚建议。', 'Overnight stages, score and an actionable tip.'), rev: true },
    { Scene: SceneWomen, e: tx('女性健康', 'Women’s health'), t: tx('懂你的周期与体温', 'In tune with your cycle'), b: tx('周期日历 + 基础体温,推荐每阶段床温。', 'Cycle calendar + basal temp, warmth per phase.'), rev: false },
  ];
  return (
    <section className="features" id="features">
      <div className="page-wrap">
        {rows.map((r, i) => <FeatureRowCompact key={i} {...r} />)}
      </div>
    </section>
  );
}

// ── plan compare ───────────────────────────────────────────────
function dDash() {
  return <span style={{ display: 'inline-block', width: 16, height: 2, borderRadius: 2, background: 'rgba(40,60,90,0.22)' }} />;
}

function PlanCompare({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.14);
  const rows: [string, number, number][] = [
    [tx('双区独立温控', 'Dual-zone climate'), 1, 1],
    [tx('睡眠评分与分期', 'Sleep score + stages'), 1, 1],
    [tx('女性健康追踪', 'Women’s health'), 1, 1],
    [tx('AI 自动温控 (Autopilot)', 'AI Autopilot'), 0, 1],
    [tx('进阶健康报告', 'Advanced health reports'), 0, 1],
    [tx('优先客服与延保', 'Priority care + warranty'), 0, 1],
  ];
  return (
    <section className="plans" id="plans" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('选择会员', 'Choose membership')}</SectionLabel>
          <Title style={{ fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 }}>{tx('标准版 与 Pro 会员', 'Standard vs Pro')}</Title>
        </div>
        <div className={'plan-table reveal' + (seen ? ' in' : '')}>
          <div className="plan-trow plan-thead">
            <div className="plan-feat" />
            <div className="plan-tcol"><Label style={{ color: '#6b7592', fontWeight: 700 }}>{tx('标准版', 'Standard')}</Label></div>
            <div className="plan-tcol plan-own">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Label style={{ color: '#b8893f', fontWeight: 700 }}>Pro</Label>
                <PremiumTag />
              </div>
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="plan-trow">
              <div className="plan-feat"><Body variant="body" style={{ fontWeight: 600 }}>{r[0]}</Body></div>
              <div className="plan-tcol">{r[1] ? cmpYes() : dDash()}</div>
              <div className="plan-tcol plan-own">{r[2] ? cmpYes() : dDash()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── specs ──────────────────────────────────────────────────────
function Specs({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [ref, seen] = useReveal(0.12);
  const specs: [string, string][] = [
    [tx('温度范围', 'Temperature range'), '16–43°C'],
    [tx('控温精度', 'Precision'), '±0.3°C'],
    [tx('温区', 'Zones'), tx('左右双区独立', 'Dual, independent')],
    [tx('适配厚度', 'Mattress depth'), '25–40 cm'],
    [tx('主机噪音', 'Hub noise'), tx('< 35 分贝', '< 35 dB')],
    [tx('连接方式', 'Connectivity'), 'Wi-Fi · Bluetooth'],
    [tx('供电', 'Power'), tx('低压直流 · 安全', 'Low-voltage DC')],
    [tx('清洁', 'Care'), tx('床垫面可机洗', 'Machine-washable cover')],
  ];
  return (
    <section className="specs" id="specs" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('技术规格', 'Specifications')}</SectionLabel>
          <Title style={{ fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 }}>{tx('参数一览', 'The details')}</Title>
        </div>
        <div className={'spec-table reveal' + (seen ? ' in' : '')}>
          {specs.map((s, i) => (
            <div key={i} className="spec-trow">
              <Label dim>{s[0]}</Label>
              <Body variant="body" style={{ fontWeight: 600, color: '#1a2238' }}>{s[1]}</Body>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── footer ─────────────────────────────────────────────────────
function DFooter({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const cols: [string, string[]][] = [
    [tx('产品', 'Product'), [tx('智能温控', 'Climate'), tx('睡眠分析', 'Sleep analysis'), tx('女性健康', 'Women’s health'), tx('规格', 'Specs')]],
    [tx('支持', 'Support'), [tx('如何安装', 'Setup'), tx('常见问题', 'FAQ'), tx('保修政策', 'Warranty'), tx('联系我们', 'Contact')]],
    [tx('公司', 'Company'), [tx('关于 Aura', 'About'), tx('试睡政策', 'Trial'), tx('隐私', 'Privacy'), tx('条款', 'Terms')]],
  ];
  return (
    <footer className="footer-full">
      <div className="page-wrap footer-grid">
        <div className="footer-brand">
          <div className="wordmark"><img src={asset('assets/aura-logo.svg')} alt="AURA" className="brand-mark" />AURA</div>
          <Caption style={{ marginTop: 12, maxWidth: 240 }}>{tx('智能睡眠系统 · 让每一夜都恰到好处。', 'Intelligent sleep system — every night, just right.')}</Caption>
        </div>
        <div className="footer-cols">
          {cols.map((c, i) => (
            <div key={i} className="footer-col">
              <Label style={{ color: '#1a2238', marginBottom: 12 }}>{c[0]}</Label>
              {c[1].map((l, li) => <a key={li} className="footer-link"><Caption>{l}</Caption></a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="page-wrap footer-base">
        <Caption>© 2026 Aura</Caption>
        <Caption>{tx('为更好的睡眠而生', 'Built for better sleep')}</Caption>
      </div>
    </footer>
  );
}

// ── sticky add-to-cart bar ─────────────────────────────────────
function DBuyBar({ lang, total, addToCart }: { lang: Lang; total: number; addToCart: () => void }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={'buybar' + (show ? ' show' : '')}>
      <div className="buybar-inner page-wrap">
        <div className="buybar-info">
          <img src={asset('assets/aura-logo.svg')} alt="" className="buybar-mark" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Body style={{ fontWeight: 700, color: '#1a2238' }}>{tx('Aura 智能温控床垫', 'Aura Smart Cover')}</Body>
            <Caption>{money(total) + tx(' · 30 晚无忧试睡', ' · 30-night trial')}</Caption>
          </div>
        </div>
        <div className="buybar-cta">
          <Button label={tx('加入购物车', 'Add to cart')} variant="solid" onPress={addToCart} />
        </div>
      </div>
    </div>
  );
}

// ── cart toast + drawer ────────────────────────────────────────
interface Toast { key: number; name: string; spec: string; }
interface CartItem extends Toast { qty: number; total: number; }

function CartToast({ lang, toast, onView }: { lang: Lang; toast: Toast | null; onView: () => void }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  return (
    <div className={'cart-toast' + (toast ? ' show' : '')}>
      {toast ? (
        <>
          <div className="cart-toast-ic">{cmpYes()}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
            <Body style={{ fontWeight: 700, color: '#1a2238' }}>{tx('已加入购物车', 'Added to cart')}</Body>
            <Caption>{toast.name + ' · ' + toast.spec}</Caption>
          </div>
          <Button label={tx('查看', 'View')} variant="line" onPress={onView} />
        </>
      ) : null}
    </div>
  );
}

function CartDrawer({ lang, open, cart, setCart, onClose }: { lang: Lang; open: boolean; cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; onClose: () => void }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const grand = cart.reduce((n, it) => n + it.total, 0);
  const remove = (key: number) => setCart((c) => c.filter((it) => it.key !== key));
  return (
    <div className={'cart-overlay' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="cart-backdrop" onClick={onClose} />
      <aside className="cart-panel">
        <div className="cart-head">
          <Title style={{ fontSize: 22, color: '#1a2238' }}>{tx('购物车', 'Your cart')}</Title>
          <button className="cart-close" onClick={onClose} aria-label={tx('关闭', 'Close')}>×</button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <Body dim variant="body">{tx('购物车还是空的。', 'Your cart is empty.')}</Body>
            <div style={{ marginTop: 16 }}>
              <Button label={tx('继续选购', 'Keep shopping')} variant="line" onPress={onClose} />
            </div>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((it) => (
                <div key={it.key} className="cart-item">
                  <div className="cart-item-thumb" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <Body style={{ fontWeight: 700, color: '#1a2238' }}>{it.name}</Body>
                    <Caption>{it.spec + ' · ×' + it.qty}</Caption>
                    <button className="cart-remove" onClick={() => remove(it.key)}>{tx('移除', 'Remove')}</button>
                  </div>
                  <Label style={{ color: '#1a2238', fontWeight: 700 }}>{money(it.total)}</Label>
                </div>
              ))}
            </div>
            <div className="cart-foot">
              <div className="cart-total-row">
                <Body style={{ fontWeight: 700, color: '#1a2238' }}>{tx('合计', 'Subtotal')}</Body>
                <Body variant="hero" style={{ fontSize: 24, fontWeight: 800, color: '#1a2238' }}>{money(grand)}</Body>
              </div>
              <Caption style={{ marginBottom: 14 }}>{tx('含税 · 30 晚无忧试睡 · 全国包邮', 'Tax incl. · 30-night trial · free shipping')}</Caption>
              <Button label={tx('去结算 · ' + money(grand), 'Checkout · ' + money(grand))} variant="solid" onPress={() => { /* no-op */ }} style={{ alignSelf: 'stretch' }} />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

// ── motion controls ────────────────────────────────────────────
function DMotion({ paused, setPaused, speed, setSpeed }: { paused: boolean; setPaused: React.Dispatch<React.SetStateAction<boolean>>; speed: number; setSpeed: (s: number) => void }) {
  return (
    <div className="motion-ctl">
      <button className="mc-btn" onClick={() => setPaused((p) => !p)}>{paused ? '▶' : '❚❚'}</button>
      <div className="mc-sep" />
      {[0.5, 1, 2].map((s) => (
        <button key={s} className={'mc-spd' + (speed === s ? ' on' : '')} onClick={() => setSpeed(s)}>{s + '×'}</button>
      ))}
    </div>
  );
}

export default function Buy() {
  const [lang, setLang] = useSharedLang();
  const [paused, setPaused] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const showDev = useDevControls();
  const [state, setState] = React.useState<BuyState>({ size: 'queen', plan: 'std', qty: 1 });
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [toast, setToast] = React.useState<Toast | null>(null);
  const set = (patch: Partial<BuyState>) => setState((s) => ({ ...s, ...patch }));
  const sizePrice = { full: 1099, queen: 1299, king: 1499 }[state.size];
  const planAdd = state.plan === 'pro' ? 119 : 0;
  const total = (sizePrice + planAdd) * state.qty;
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const sizeLabel = { full: tx('1.5 米床', 'Full'), queen: tx('1.8 米床', 'Queen'), king: tx('2.0 米床', 'King') }[state.size];
  const planLabel = state.plan === 'pro' ? tx('Aura+ 会员', 'Aura+') : tx('标准版', 'Standard');
  const addToCart = () => {
    const item: CartItem = { key: Date.now(), name: tx('Aura 智能温控床垫', 'Aura Smart Cover'), spec: sizeLabel + ' · ' + planLabel, qty: state.qty, total };
    setCart((c) => [...c, item]);
    setCartOpen(false);
    setToast(item);
    setTimeout(() => setToast((t) => (t === item ? null : t)), 2800);
  };
  const cartCount = cart.reduce((n, it) => n + it.qty, 0);
  const scrollTo = (id: string) => () => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
  };

  return (
    <MotionCtx.Provider value={{ speed, paused, lang }}>
      <div className="buy-root">
        <DNav lang={lang} setLang={setLang} cartCount={cartCount} onCart={() => setCartOpen(true)} scrollTo={scrollTo} />
        <BuyHero lang={lang} state={state} set={set} addToCart={addToCart} />
        <WhatsIncluded lang={lang} />
        <FeatureStrip lang={lang} />
        <PlanCompare lang={lang} />
        <Reviews lang={lang} />
        <Specs lang={lang} />
        <FAQ lang={lang} />
        <DFooter lang={lang} />
        <DBuyBar lang={lang} total={total} addToCart={addToCart} />
        <CartToast lang={lang} toast={toast} onView={() => { setToast(null); setCartOpen(true); }} />
        <CartDrawer lang={lang} open={cartOpen} cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} />
        {showDev && <DMotion paused={paused} setPaused={setPaused} speed={speed} setSpeed={setSpeed} />}
      </div>
    </MotionCtx.Provider>
  );
}
