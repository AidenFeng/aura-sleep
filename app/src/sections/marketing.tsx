// Shared commerce / marketing sections (Eight Sleep / Orion-style).
// Ported from the prototype's marketing.jsx.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Body, Caption, Label, Card, Button, SectionLabel, PremiumTag } from '../ds';
import { useReveal } from '../lib/reveal';
import { asset } from '../lib/motion';

type Lang = 'zh' | 'en';
type TX = (zh: string, en: string) => string;
const mk = (lang: Lang): TX => (zh, en) => (lang === 'en' ? en : zh);

export function stars() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={18} height={18} viewBox="0 0 16 16">
          <path d="M8 1l1.9 4.1L14 5.6l-3 3 .8 4.4L8 11l-3.8 2 .8-4.4-3-3 4.1-.5z" fill="#b8893f" />
        </svg>
      ))}
    </div>
  );
}

export function cmpYes() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={11} fill="#b8893f" />
      <path d="M7 12.4l3.2 3.1L17 8.8" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── "Meet Aura" pillars ─────────────────────────────────────────
function pillarIcon(k: string) {
  const s = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#b8893f', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (k === 'climate') return (
    <svg {...s}><path d="M12 3v10" /><circle cx={12} cy={16} r={4} /><path d="M12 3a3 3 0 0 1 3 3v6.4a4 4 0 1 1-6 0V6a3 3 0 0 1 3-3z" /></svg>
  );
  if (k === 'ai') return (
    <svg {...s}><path d="M4 14s1.5-2 4-2 3 1 4 1 2.5-1 4-1 2 2 2 2" /><path d="M12 3l1.2 3.3L16.5 7l-2.6 2 .7 3.4L12 11l-2.6 1.4.7-3.4L7.5 7l3.3-.7z" /></svg>
  );
  if (k === 'cycle') return (
    <svg {...s}><circle cx={12} cy={12} r={8} /><path d="M12 4a8 8 0 0 1 0 16" /><circle cx={12} cy={4} r={1.4} fill="#b8893f" /></svg>
  );
  return <svg {...s}><rect x={3} y={7} width={18} height={11} rx={3} /><path d="M3 11h18" /></svg>;
}

export function Pillars({ lang }: { lang: Lang }) {
  const tx = mk(lang);
  const [ref, seen] = useReveal(0.15);
  const items = [
    { i: 'climate', t: tx('双区智能温控', 'Dual-zone climate'), d: tx('左右独立,16–43°C,精度 ±0.3°C。', 'Independent sides, 16–43°C, ±0.3°C.') },
    { i: 'ai', t: tx('AI 睡眠监测', 'AI sleep tracking'), d: tx('整夜分期、评分与可执行洞察。', 'Overnight stages, score and insight.') },
    { i: 'cycle', t: tx('女性健康', 'Women’s health'), d: tx('跟随周期与体温调节床温。', 'Warmth that follows your cycle.') },
    { i: 'fit', t: tx('适配更多附件', 'More smart add-ons'), d: tx('智能床架、智能枕头、智能眼罩。', 'Smart frame, pillow & eye mask.') },
  ];
  return (
    <section className="pillars" id="meet" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('认识 Aura', 'Meet Aura')}</SectionLabel>
          <Title style={{ fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 }}>{tx('一张床垫,四种智能', 'One cover, four kinds of smart')}</Title>
        </div>
        <div className="pillar-grid">
          {items.map((it, idx) => (
            <div key={idx} className={'reveal' + (seen ? ' in' : '')} style={{ transitionDelay: idx * 0.07 + 's' }}>
              <Card className="lift-card" style={{ padding: 22, height: '100%' }}>
                <div className="pillar-ico">{pillarIcon(it.i)}</div>
                <Title style={{ fontSize: 21, color: '#1a2238', marginTop: 16, marginBottom: 7 }}>{it.t}</Title>
                <Body dim variant="body" style={{ lineHeight: '1.6' }}>{it.d}</Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Reviews ─────────────────────────────────────────────────────
export function Reviews({ lang }: { lang: Lang }) {
  const tx = mk(lang);
  const [ref, seen] = useReveal(0.12);
  const list = [
    { q: tx('我和先生终于不用为温度吵架了——他那侧暖,我这侧凉,各睡各的好觉。', 'We finally stopped fighting over temperature. His side warm, mine cool — we both sleep great.'), n: tx('林女士', 'Mia L.'), m: tx('情侣双区用户', 'Couple, dual-zone') },
    { q: tx('深睡时间肉眼可见地变长,早上的分析报告让我第一次真正了解自己的睡眠。', 'My deep sleep visibly grew, and the morning report finally helped me understand my nights.'), n: tx('David', 'David R.'), m: tx('易热人群', 'Hot sleeper') },
    { q: tx('经期那几天床温会自动暖一点,很贴心,基础体温记录也很准。', 'It warms the bed a little during my period — so thoughtful, and the temperature log is accurate.'), n: tx('Yuki', 'Yuki S.'), m: tx('女性健康用户', 'Women’s health') },
  ];
  const grads = ['linear-gradient(150deg,#5b8fd6,#a6cdf0)', 'linear-gradient(150deg,#c25b7d,#f2cedb)', 'linear-gradient(150deg,#d4763f,#ecdcbd)'];
  return (
    <section className="reviews" id="reviews" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('用户怎么说', 'What sleepers say')}</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            {stars()}
            <Title style={{ fontSize: 'clamp(24px,3vw,38px)', color: '#1a2238' }}>{tx('4.9 / 5 · 12,000+ 条评价', '4.9 / 5 · 12,000+ reviews')}</Title>
          </div>
        </div>
        <div className="review-grid">
          {list.map((r, i) => (
            <div key={i} className={'reveal' + (seen ? ' in' : '')} style={{ transitionDelay: i * 0.08 + 's' }}>
              <Card className="lift-card" style={{ padding: 22, height: '100%' }}>
                <div style={{ marginBottom: 12 }}>{stars()}</div>
                <Body variant="bodyLg" style={{ fontSize: 16, lineHeight: '1.6', color: '#1a2238', marginBottom: 16 }}>{'“' + r.q + '”'}</Body>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, background: grads[i % 3] }}>{(r.n || '').trim().charAt(0)}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Label style={{ color: '#1a2238' }}>{r.n}</Label>
                    <Caption>{r.m}</Caption>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ─────────────────────────────────────────────────────
export function Pricing({ lang }: { lang: Lang }) {
  const tx = mk(lang);
  const nav = useNavigate();
  const [ref, seen] = useReveal(0.12);
  const products = [
    { t: tx('早鸟', 'Early bird'), p: '$1,099', orig: '$1,499', save: tx('立省 $400', 'Save $400'), f: [tx('1× 床罩 + 床头主机', '1× cover + bedside hub'), tx('1 年高级版免费', '1 year Premium free'), tx('优先客服', 'Priority support')], cta: tx('立即支持', 'Back it now'), best: true },
    { t: tx('标准档', 'Standard'), p: '$1,299', orig: '$1,499', save: tx('立省 $200', 'Save $200'), f: [tx('1× 床罩 + 床头主机', '1× cover + bedside hub'), tx('6 个月高级版免费', '6 months Premium free'), tx('标准发货', 'Standard shipping')], cta: tx('选择', 'Choose'), best: false },
  ];
  const member = { t: tx('Aura+ 会员', 'Aura+'), p: '$9.9', per: tx('/月', '/mo'), s: tx('解锁全部高级智能', 'All premium intelligence'), f: [tx('AI 自动温控 (Autopilot)', 'AI Autopilot'), tx('进阶睡眠与健康报告', 'Advanced health reports'), tx('优先客服与延保', 'Priority care + warranty')], cta: tx('加入会员', 'Add membership') };
  return (
    <section className="pricing" id="pricing" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('选择你的方案', 'Choose your plan')}</SectionLabel>
          <Title style={{ fontSize: 'clamp(28px,3.6vw,46px)', color: '#1a2238', marginTop: 8 }}>{tx('从今晚开始更好地睡', 'Start sleeping better tonight')}</Title>
        </div>
        <div className="price-grid three">
          {products.map((pl, i) => (
            <div key={i} className={'price-card' + (pl.best ? ' best' : '') + ' reveal' + (seen ? ' in' : '')} style={{ transitionDelay: i * 0.07 + 's' }}>
              {pl.best ? <div className="price-flag">{tx('最受欢迎', 'Most popular')}</div> : null}
              <Title style={{ fontSize: 21, color: '#1a2238', marginBottom: 10 }}>{pl.t}</Title>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <Body variant="hero" style={{ fontSize: 36, fontWeight: 800, color: '#1a2238', lineHeight: '1' }}>{pl.p}</Body>
                {pl.orig ? <Body style={{ fontSize: 17, color: '#9aa3b8', textDecoration: 'line-through' }}>{pl.orig}</Body> : null}
              </div>
              <Label style={{ color: '#1a2238', fontWeight: 700, margin: '10px 0 14px' }}>{pl.save}</Label>
              <div className="price-feats">
                {pl.f.map((f, fi) => (
                  <div key={fi} className="price-feat">{cmpYes()}<Body variant="body">{f}</Body></div>
                ))}
              </div>
              <div style={{ marginTop: 18, width: '100%' }}>
                <Button label={pl.cta} variant={pl.best ? 'solid' : 'line'} onPress={() => nav('/buy')} style={{ alignSelf: 'stretch' }} />
              </div>
            </div>
          ))}
          <div className={'price-card reveal' + (seen ? ' in' : '')} style={{ transitionDelay: '0.14s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Title style={{ fontSize: 21, color: '#1a2238' }}>{member.t}</Title>
              <PremiumTag />
            </div>
            <Caption>{member.s}</Caption>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, margin: '12px 0 14px' }}>
              <Body variant="hero" style={{ fontSize: 36, fontWeight: 800, color: '#1a2238', lineHeight: '1' }}>{member.p}</Body>
              <Caption>{member.per}</Caption>
            </div>
            <div className="price-feats">
              {member.f.map((f, fi) => (
                <div key={fi} className="price-feat">{cmpYes()}<Body variant="body">{f}</Body></div>
              ))}
            </div>
            <div style={{ marginTop: 18, width: '100%' }}>
              <Button label={member.cta} variant="line" onPress={() => nav('/buy')} style={{ alignSelf: 'stretch' }} />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Caption>{tx('示意价格,含 30 晚无忧试睡与 1 年质保。', 'Illustrative pricing · 30-night trial · 1-year warranty.')}</Caption>
        </div>
      </div>
    </section>
  );
}

// ── FAQ accordion ───────────────────────────────────────────────
export function FAQ({ lang }: { lang: Lang }) {
  const tx = mk(lang);
  const [ref, seen] = useReveal(0.12);
  const [open, setOpen] = React.useState(0);
  const qs = [
    { q: tx('能适配我现在的床垫吗?', 'Will it fit my current mattress?'), a: tx('可以。Aura 像床笠一样套在你现有床垫上,适配大多数厚度,几分钟即可铺好。', 'Yes. Aura slips over your existing mattress like a fitted sheet and fits most depths in minutes.') },
    { q: tx('用电安全吗?有噪音吗?', 'Is it safe and quiet?'), a: tx('采用低压水循环控温,主机静音运行,床面无电热元件,睡感安心。', 'It uses low-voltage water-based climate control; the hub runs quietly and there are no electric heating elements in the bed.') },
    { q: tx('一定要订阅会员吗?', 'Do I need a subscription?'), a: tx('不需要。核心温控与睡眠分析买断即用;Aura+ 会员可额外解锁 AI 自动温控等高级功能。', 'No. Core climate control and sleep analysis are included; Aura+ unlocks premium features like AI Autopilot.') },
    { q: tx('试睡不满意可以退吗?', 'What if I don’t love it?'), a: tx('30 晚无忧试睡,不满意全额退款,我们承担退货运费。', '30-night risk-free trial with a full refund — we cover return shipping.') },
    { q: tx('可以用 HSA/FSA 支付吗?', 'Can I pay with HSA/FSA?'), a: tx('符合条件的用户可以。结账时填写一份简短健康问卷,由独立持证医师评估,针对更年期血管舒缩症状(潮热/夜汗)或确诊睡眠问题出具医疗必要性证明(LMN)。资格由医师判定,而非我们。', 'Eligible customers can. At checkout you complete a short health questionnaire reviewed by an independent licensed provider, who may issue a Letter of Medical Necessity for qualifying conditions. Eligibility is decided by the provider, not us.') },
    { q: tx('我的周期数据存在哪里?', 'Where is my cycle data stored?'), a: tx('周期数据为可选项,加密存储,仅用于生成你的温控曲线。可随时在 App 内删除,我们绝不出售或共享。', 'Cycle data is optional, encrypted, and used only to generate your climate curve. Delete it anytime in the app — we never sell or share it.') },
    { q: tx('它真的会根据我的生物钟调节,还是只显示图表?', 'Does it actually adapt to my rhythm, or just show charts?'), a: tx('两者皆有。App 会展示你的 24 小时生物钟环;只需一键(高级版可全自动),它便据此对齐每晚的预冷、深睡降温与升温唤醒。', 'Both. The app shows your 24-hour circadian ring, and with one tap (or fully automatic on Premium) it aligns each night’s pre-cool, deep-sleep cooling and wake-up warming.') },
    { q: tx('App 支持哪些语言?', 'Which languages does the app support?'), a: tx('目前支持英文与中文,App 内一键即时切换,更多语言陆续加入。', 'English and Chinese today, switchable instantly in-app, with more languages on the way.') },
    { q: tx('会漏水吗?', 'Can it leak?'), a: tx('水路双重密封,一旦渗漏即时侦测、自动断电。', 'The water channels are double-sealed, with instant leak detection that cuts power automatically.') },
    { q: tx('我的数据安全吗?', 'Is my data safe?'), a: tx('符合 CCPA 规范,数据可在 App 内随时导出或删除,生理数据全程脱敏。', 'CCPA-compliant — export or delete your data anytime in-app, with physiological data anonymized throughout.') },
    { q: tx('发往哪些国家和地区?', 'Where do you ship?'), a: tx('首发面向美国,其他地区陆续开放。', 'Launching in the US first, with more regions to follow.') },
  ];
  return (
    <section className="faq" id="faq" ref={ref as React.RefObject<HTMLElement>}>
      <div className="page-wrap faq-wrap">
        <div className={'sec-head reveal' + (seen ? ' in' : '')}>
          <SectionLabel>{tx('常见问题', 'FAQ')}</SectionLabel>
          <Title style={{ fontSize: 'clamp(26px,3.2vw,42px)', color: '#1a2238', marginTop: 8 }}>{tx('还有疑问?', 'Questions?')}</Title>
        </div>
        <div className={'faq-list reveal' + (seen ? ' in' : '')}>
          {qs.map((it, i) => (
            <div key={i} className={'faq-item' + (open === i ? ' open' : '')}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <Body variant="bodyLg" style={{ fontSize: 17, fontWeight: 600, color: '#1a2238' }}>{it.q}</Body>
                <span className="faq-plus">{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-a">
                <Body dim variant="body" style={{ lineHeight: '1.65' }}>{it.a}</Body>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── sticky buy bar (appears after hero) ─────────────────────────
export function StickyBuyBar({ lang }: { lang: Lang }) {
  const tx = mk(lang);
  const nav = useNavigate();
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 760);
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
            <Body style={{ fontWeight: 700, color: '#1a2238' }}>{tx('Aura 智能温控床垫', 'Aura smart cover')}</Body>
            <Caption>{tx('$1,099 起 · 30 晚无忧试睡', 'From $1,099 · 30-night trial')}</Caption>
          </div>
        </div>
        <div className="buybar-cta">
          <Button label={tx('立即购买', 'Buy now')} variant="solid" onPress={() => nav('/buy')} />
        </div>
      </div>
    </div>
  );
}
