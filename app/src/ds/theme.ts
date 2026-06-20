// Resolved AuraDS theme: light palette + gold accent (the app default, forced
// to light by DsPreviewFrame in the original prototype). Values lifted verbatim
// from the published smart-mattress-cover bundle (palettes.light merged with
// THEME_COLORS.gold.light).

export const c = {
  bg: '#f2f3f7',
  bgTop: '#ffffff',
  panel: '#ffffff',
  panelAlt: 'rgba(80,100,140,0.09)',
  glassNav: 'rgba(255,255,255,0.74)',
  text: '#1a2238',
  textDim: '#6b7592',
  border: '#dfe3ee',
  // gold accent family
  accent: '#d4ba82',
  accent2: '#ecdcb4',
  brand: '#d4ba82',
  gold: '#b89a60',
  warm: '#d2a868',
  cool: '#8fb4e6',
  purple: '#8b5cf6',
  warn: '#a8842e',
  danger: '#cf4a63',
  ok: '#27926a',
  glass: 'rgba(255,255,255,0.62)',
  glassStrong: 'rgba(255,255,255,0.80)',
  glassHi: 'rgba(255,255,255,0.92)',
  // glassTile = the liquid-glass surface gradient (light → faint blue-grey)
  glassTile: ['rgba(74,96,138,0.12)', 'rgba(74,96,138,0.04)'] as const,
  glassBorder: 'rgba(200,176,120,0.16)',
  hairline: 'rgba(200,176,120,0.09)',
};

export const fonts = {
  display: "'Fraunces', Georgia, serif",
};

export type Variant =
  | 'hero'
  | 'title'
  | 'headline'
  | 'bodyLg'
  | 'body'
  | 'label'
  | 'caption';

export const type: Record<Variant, { size: number; weight: number }> = {
  hero: { size: 28, weight: 800 },
  title: { size: 22, weight: 600 },
  headline: { size: 17, weight: 800 },
  bodyLg: { size: 15, weight: 600 },
  body: { size: 14, weight: 400 },
  label: { size: 12.5, weight: 600 },
  caption: { size: 11, weight: 400 },
};

export const radius = { sm: 10, md: 16, lg: 22, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

// liquid-glass tile gradient as a CSS background string
export const glassTileBg = `linear-gradient(158deg, ${c.glassTile[0]}, ${c.glassTile[1]})`;

// WCAG-ish readable text over a solid hex (mirrors DS readableText)
export function readableText(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return '#14171f';
  const lin = (x: number) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const r = lin(parseInt(h.slice(0, 2), 16) / 255);
  const g = lin(parseInt(h.slice(2, 4), 16) / 255);
  const b = lin(parseInt(h.slice(4, 6), 16) / 255);
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.45 ? '#14171f' : '#ffffff';
}
