// Scroll-reveal / in-view hooks. Content has a visible base state; the entrance
// class is added only when actually scrolled into view (never stuck hidden).
import React from 'react';

// returns [ref, vis, seen] — vis tracks live intersection (gates rAF), seen
// latches once the element has entered the viewport (gates the entrance class).
export function useVisible(threshold = 0.2): [React.RefObject<HTMLElement>, boolean, boolean] {
  const ref = React.useRef<HTMLElement>(null);
  const [vis, setVis] = React.useState(false);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r0 = el.getBoundingClientRect();
    if (r0.top < window.innerHeight && r0.bottom > 0) {
      setVis(true);
      setSeen(true);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        setVis(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis, seen];
}

// lighter variant used by static (non-animated) sections — [ref, seen]
export function useReveal(threshold = 0.18): [React.RefObject<HTMLElement>, boolean] {
  const ref = React.useRef<HTMLElement>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r0 = el.getBoundingClientRect();
    if (r0.top < window.innerHeight && r0.bottom > 0) setSeen(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSeen(true); }, {
      threshold,
      rootMargin: '0px 0px -8% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}
