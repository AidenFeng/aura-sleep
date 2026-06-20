// Aura marketing homepage — full-bleed video hero + alternating feature
// stories + spec band + personas + pricing + FAQ + waitlist + closing CTA.
// Ported from the prototype's app.jsx.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Body, Label, Caption, Button, Pill, Card, SectionLabel } from '../ds';
import { MotionCtx, useSharedLang, useTx, asset } from '../lib/motion';
import { useVisible } from '../lib/reveal';
import { Phone } from '../lib/motion';
import { MattressViz, SceneClimate } from '../scenes/scenes1';
import { SceneWomen, SceneAnalysis } from '../scenes/scenes2';
import { Pillars, Pricing, FAQ, StickyBuyBar } from '../sections/marketing';
import '../styles/base.css';
import '../styles/home.css';

type Lang = 'zh' | 'en';
type Scene = (p: { active?: boolean }) => React.ReactElement;

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

function Nav({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const nav = useNavigate();
  return (
    <div className="nav">
      <div className="nav-inner page-wrap">
        <a className="wordmark" href="#top">
          <img src={asset('assets/aura-logo.svg')} alt="AURA" className="brand-mark" />
          AURA
        </a>
        <div className="nav-links">
          <a href="#top">{tx('产品主页', 'Home')}</a>
          <a href="#tech">{tx('智能床垫', 'Smart cover')}</a>
          <a href="#ai">{tx('AI睡眠监测', 'AI sleep')}</a>
          <a href="#women">{tx('健康追踪', 'Health')}</a>
          <a href="#pricing">{tx('价格', 'Pricing')}</a>
          <a href="#faq">{tx('常见问题', 'FAQ')}</a>
        </div>
        <div className="nav-right">
          <LangToggle lang={lang} setLang={setLang} />
          <div className="nav-cta">
            <Button label={tx('立即体验', 'Try it')} variant="solid" onPress={() => nav('/buy')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MotionControls({ paused, setPaused, speed, setSpeed }: { paused: boolean; setPaused: React.Dispatch<React.SetStateAction<boolean>>; speed: number; setSpeed: (s: number) => void }) {
  const tx = useTx();
  return (
    <div className="motion-ctl">
      <button className="mc-btn" onClick={() => setPaused((p) => !p)} title={tx('播放/暂停', 'Play/Pause')}>{paused ? '▶' : '❚❚'}</button>
      <div className="mc-sep" />
      {[0.5, 1, 2].map((s) => (
        <button key={s} className={'mc-spd' + (speed === s ? ' on' : '')} onClick={() => setSpeed(s)}>{s + '×'}</button>
      ))}
    </div>
  );
}

function Check() {
  return (
    <svg width={15} height={15} viewBox="0 0 16 16">
      <circle cx={8} cy={8} r={8} fill="rgba(236,220,189,0.16)" />
      <path d="M4.5 8.2l2.2 2.2 4.8-5" fill="none" stroke="#b8893f" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const nav = useNavigate();
  const [heroMuted, setHeroMuted] = React.useState(false);
  const trust = [tx('30 晚无忧试睡', '30-night trial'), tx('双区独立控温', 'Dual-zone control'), tx('适配任何床垫', 'Fits any mattress')];
  return (
    <section className="hero" id="top">
      <video
        className="hero-video"
        src={asset('assets/hero-cover.mp4')}
        autoPlay
        loop={false}
        muted={heroMuted}
        playsInline
        ref={(el) => {
          if (el) {
            el.muted = heroMuted;
            el.volume = heroMuted ? 0 : 1;
            if (el.paused) {
              const pr = el.play();
              if (pr && pr.catch) pr.catch(() => {});
            }
          }
        }}
      />
      <div className="hero-scrim" />
      <button className="hero-mute" onClick={() => setHeroMuted((m) => !m)} aria-label={heroMuted ? tx('取消静音', 'Unmute') : tx('静音', 'Mute')}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#fff" stroke="#fff" />
          {heroMuted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12" />}
        </svg>
      </button>
      <div className="hero-grid page-wrap">
        <div className="hero-text reveal in">
          <div className="eyebrow"><Pill on label={tx('智能分区温控床垫', 'Smart climate mattress')} /></div>
          <Title style={{ fontSize: 'clamp(38px,5.4vw,72px)', lineHeight: '1.12', color: '#fff', letterSpacing: '-0.5px', marginTop: 18 }}>
            {tx('重新定义', 'Redefine')}<br />
            <span className="grad-ink">{tx('你的每一夜。', 'every night.')}</span>
          </Title>
          <Body variant="bodyLg" style={{ fontSize: 19, lineHeight: '1.6', marginTop: 20, maxWidth: 460, color: 'rgba(255,255,255,0.92)' }}>
            {tx('为你的身体与习惯量身规划每一夜的温度。左右双区,各自的凉与暖,整夜自动调节。', 'Every night’s temperature, planned for your body and habits. Independent left and right zones — your cool, their warm — adjusting all night.')}
          </Body>
          <div className="hero-cta">
            <button className="hero-shop-btn" onClick={() => nav('/buy')}>{tx('选购优惠', 'Shop the sale')}</button>
          </div>
          <div className="hero-eligible">
            <Check />
            <span>{tx('支持医疗账户支付 · HSA/FSA', 'HSA/FSA Eligible')}</span>
          </div>
          <div className="trust-row">
            {trust.map((t, i) => (
              <div key={i} className="trust-item">
                <Check />
                <Body variant="label" style={{ color: 'rgba(255,255,255,0.88)' }}>{t}</Body>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-viz reveal in">
          <div className="viz-stage">
            <MattressViz active scale={1.04} onDark />
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span style={{ width: 6, height: 6, borderRadius: 99, background: '#b8893f', flex: '0 0 auto', marginTop: 8, boxShadow: '0 0 8px rgba(184,137,63,0.5)' }} />;
}

interface Feature {
  id: string;
  reverse: boolean;
  Scene: Scene;
  glow: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  stat: { big: string; label: string };
}

function FeatureRow({ id, reverse, eyebrow, title, body, bullets, stat, Scene, index, total, glow }: Feature & { index: number; total: number }) {
  const [ref, vis, seen] = useVisible(0.18);
  return (
    <section className={'feat' + (reverse ? ' reverse' : '')} id={id} ref={ref as React.RefObject<HTMLElement>}>
      <div className="feat-grid page-wrap">
        <div className={'feat-text reveal' + (seen ? ' in' : '')}>
          {typeof index === 'number' ? (
            <div className="feat-index">
              <span className="feat-idx-num">{'0' + (index + 1)}</span>
              <span className="feat-idx-tot">{' / 0' + total}</span>
            </div>
          ) : null}
          <SectionLabel>{eyebrow}</SectionLabel>
          <Title style={{ fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: '1.08', color: '#1a2238', marginTop: 8, marginBottom: 14 }}>{title}</Title>
          <Body variant="bodyLg" dim style={{ fontSize: 17, lineHeight: '1.65', maxWidth: 420 }}>{body}</Body>
          <div className="bullets">
            {bullets.map((b, i) => (
              <div key={i} className="bullet"><Dot /><Body variant="body">{b}</Body></div>
            ))}
          </div>
          {stat ? (
            <div className="feat-stat">
              <Title style={{ fontSize: 40, color: '#b8893f', lineHeight: '1' }}>{stat.big}</Title>
              <Label dim style={{ marginTop: 4 }}>{stat.label}</Label>
            </div>
          ) : null}
        </div>
        <div className={'feat-phone reveal' + (seen ? ' in' : '')}>
          {glow ? <div className="feat-glow" style={{ background: glow }} /> : null}
          <div className="demo-card">
            <Phone><Scene active={vis} /></Phone>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecBand({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [ref, , seen] = useVisible(0.3);
  const specs: [string, string][] = [
    [tx('双区', 'Dual'), tx('独立温区', 'Independent zones')],
    ['16–43°C', tx('调节范围', 'Climate range')],
    [tx('整夜', 'All-night'), tx('自动调节', 'Auto-adjust')],
    ['AI', tx('睡眠监测', 'Sleep tracking')],
    [tx('生理周期', 'Cycle'), tx('智能优化', 'optimized')],
  ];
  return (
    <section className="spec-band" id="science" ref={ref as React.RefObject<HTMLElement>}>
      <div className={'spec-grid page-wrap reveal' + (seen ? ' in' : '')}>
        {specs.map((s, i) => (
          <div key={i} className="spec-cell">
            <Title style={{ fontSize: 'clamp(24px,2.6vw,38px)', color: '#1a2238', lineHeight: '1', whiteSpace: 'nowrap' }}>{s[0]}</Title>
            <Label dim style={{ marginTop: 8, letterSpacing: 1 }}>{s[1]}</Label>
          </div>
        ))}
      </div>
    </section>
  );
}

function personaIcon(i: number) {
  const s = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (i === 0) return (
    <svg {...s}><circle cx={8.5} cy={9} r={3} /><circle cx={15.5} cy={9} r={3} /><path d="M4 19c0-2.5 2-4 4.5-4M20 19c0-2.5-2-4-4.5-4" /></svg>
  );
  if (i === 1) return <svg {...s}><circle cx={12} cy={8.5} r={4} /><path d="M12 12.5V20M9 17h6" /></svg>;
  return <svg {...s}><path d="M12 3c2.2 3 4 4.6 4 8a4 4 0 0 1-8 0c0-1.6.6-2.8 1.5-3.8C10.2 9 12 7 12 3z" /></svg>;
}

function Personas({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [ref, , seen] = useVisible(0.15);
  const people = [
    { g: 'linear-gradient(150deg,#5b8fd6,#a6cdf0)', t: tx('情侣双区', 'Couples'), d: tx('你睡你的凉,TA 睡 TA 的暖,不再争抢温度。', 'Your cool, their warm — no more thermostat battles.') },
    { g: 'linear-gradient(150deg,#c25b7d,#f2cedb)', t: tx('经期女性', 'Women'), d: tx('跟随周期与体温,自动给出最舒适的床温。', 'Bed warmth that follows your cycle and temperature.') },
    { g: 'linear-gradient(150deg,#d4763f,#ecdcbd)', t: tx('易热人群', 'Hot sleepers'), d: tx('入睡前提前降温,整夜不再燥热醒来。', 'Pre-cools before you overheat, all night long.') },
  ];
  return (
    <section className="personas" id="cycle" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <Title className={'reveal' + (seen ? ' in' : '')} style={{ fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', textAlign: 'center', marginBottom: 10 }}>{tx('为每一种睡眠而设计', 'Designed for every sleeper')}</Title>
        <div className="persona-grid">
          {people.map((p, i) => (
            <div key={i} className={'reveal' + (seen ? ' in' : '')} style={{ transitionDelay: i * 0.08 + 's' }}>
              <Card style={{ padding: 26, height: '100%' }}>
                <div className="persona-ico" style={{ background: p.g }}>{personaIcon(i)}</div>
                <div className="persona-body" style={{ marginTop: 18 }}>
                  <Title style={{ fontSize: 24, color: '#1a2238', marginBottom: 7 }}>{p.t}</Title>
                  <Body dim variant="body" style={{ lineHeight: '1.6' }}>{p.d}</Body>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistCTA({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const [ref, , seen] = useVisible(0.2);
  return (
    <section className="waitlist" ref={ref as React.RefObject<HTMLElement>}>
      <div className={'page-wrap waitlist-inner reveal' + (seen ? ' in' : '')}>
        <p className="waitlist-eyebrow">{tx('订阅锁定优惠', 'Subscribe & save')}</p>
        <h2 className="waitlist-title">{tx('想了解更多？', 'Want to know more?')}</h2>
        <p className="waitlist-sub">{tx('订阅邮件即刻锁定早鸟优惠资格,并订阅我们更多活动消息。', 'Subscribe to lock in early-bird pricing and get our latest news.')}</p>
        <form className="waitlist-form" onSubmit={(e) => e.preventDefault()}>
          <input className="waitlist-input" type="email" placeholder="you@email.com" aria-label="Email" />
          <button className="waitlist-btn" type="submit">{tx('订阅并锁定优惠', 'Subscribe & lock in')}</button>
        </form>
      </div>
    </section>
  );
}

function ClosingCTA({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const nav = useNavigate();
  const [ref, , seen] = useVisible(0.25);
  return (
    <section className="closing" ref={ref as React.RefObject<HTMLElement>}>
      <div className={'page-wrap closing-inner reveal' + (seen ? ' in' : '')}>
        <Title style={{ fontSize: 'clamp(40px,6vw,84px)', color: '#1a2238', lineHeight: '1.04', letterSpacing: '-1px' }}>
          {tx('睡眠,', 'Sleep,')}<br />
          <span className="grad-ink">{tx('重新设计。', 'redesigned.')}</span>
        </Title>
        <Body variant="bodyLg" dim style={{ fontSize: 19, marginTop: 20, marginBottom: 30 }}>{tx('30 晚无忧试睡,不满意全额退款。', '30-night risk-free trial. Full refund if you don’t love it.')}</Body>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button label={tx('购买页面', 'Buy now')} variant="solid" onPress={() => nav('/buy')} />
          <Button label={tx('联系我们', 'Talk to us')} variant="ghost" onPress={() => {}} />
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);
  const cols: [string, string[]][] = [
    [tx('产品', 'Product'), [tx('智能温控', 'Climate'), tx('睡眠分析', 'Sleep analysis'), tx('女性健康', 'Women’s health'), tx('价格', 'Pricing')]],
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
          {cols.map((col, i) => (
            <div key={i} className="footer-col">
              <Label style={{ color: '#1a2238', marginBottom: 12 }}>{col[0]}</Label>
              {col[1].map((l, li) => (
                <a key={li} className="footer-link"><Caption>{l}</Caption></a>
              ))}
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

export default function Home() {
  const [lang, setLang] = useSharedLang();
  const [paused, setPaused] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const tx = (zh: string, en: string) => (lang === 'en' ? en : zh);

  const features: Feature[] = [
    {
      id: 'tech', reverse: false, Scene: SceneClimate,
      glow: 'radial-gradient(circle, rgba(95,155,216,0.26), rgba(184,137,63,0.10) 45%, transparent 70%)',
      eyebrow: tx('智能温控', 'Smart climate'),
      title: tx('双区独立,整夜自动', 'Two zones, all night'),
      body: tx('左右两侧各自独立调温; AI 睡眠生物钟分析,整夜自动规划升温与降温。', 'Each side adjusts independently to ±0.3°C — then AI plans the whole night’s warming and cooling around your sleep stages.'),
      bullets: [tx('双区独立 · AI 自动温控', 'Dual-zone · AI Autopilot'), tx('温度曲线深度适配', 'AI-planned temperature curve')],
      stat: { big: tx('双区', 'Dual-zone'), label: tx('深睡调节', 'deep-sleep tuning') },
    },
    {
      id: 'ai', reverse: true, Scene: SceneAnalysis,
      glow: 'radial-gradient(circle, rgba(95,155,216,0.30), rgba(120,95,200,0.10) 45%, transparent 70%)',
      eyebrow: tx('AI 睡眠分析', 'AI sleep analysis'),
      title: tx('醒来,即见解', 'Wake up to insight'),
      body: tx('整夜分期曲线 + 睡眠评分 + AI 洞察:深睡、REM、效率逐项拆解,并给出当晚可执行的温度建议。', 'Overnight hypnogram + sleep score + AI insight — deep sleep, REM and efficiency broken down, with one actionable tip for tonight.'),
      bullets: [tx('整夜分期曲线与睡眠评分', 'Hypnogram + sleep score'), tx('AI 洞察与当晚建议', 'AI insight + tonight’s tip')],
      stat: { big: tx('智能', 'Smart'), label: tx('睡眠洞察', 'sleep insight') },
    },
    {
      id: 'women', reverse: false, Scene: SceneWomen,
      glow: 'radial-gradient(circle, rgba(224,122,153,0.30), rgba(184,137,63,0.12) 45%, transparent 70%)',
      eyebrow: tx('女性健康', 'Women’s health'),
      title: tx('懂你的周期与体温', 'In tune with your cycle'),
      body: tx('结合基础体温与周期模型,为不同阶段推荐最舒适的床温,并预测关键窗口。', 'Combines basal temperature with a cycle model to recommend the right warmth for each phase — and predict key windows.'),
      bullets: [tx('随周期调整建议床温', 'Adapts warmth to your phase'), tx('体温驱动的周期预测', 'Temperature-driven predictions')],
      stat: { big: tx('懂你', 'For her'), label: tx('女性专属体验', 'women-first experience') },
    },
  ];

  return (
    <MotionCtx.Provider value={{ speed, paused, lang }}>
      <div className="home-root">
      <Nav lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <Pillars lang={lang} />
      <FeatureRow {...features[0]} index={0} total={features.length} />
      <SpecBand lang={lang} />
      <FeatureRow {...features[1]} index={1} total={features.length} />
      <Personas lang={lang} />
      <FeatureRow {...features[2]} index={2} total={features.length} />
      <Pricing lang={lang} />
      <FAQ lang={lang} />
      <WaitlistCTA lang={lang} />
      <ClosingCTA lang={lang} />
      <Footer lang={lang} />
      <StickyBuyBar lang={lang} />
      <MotionControls paused={paused} setPaused={setPaused} speed={speed} setSpeed={setSpeed} />
      </div>
    </MotionCtx.Provider>
  );
}
