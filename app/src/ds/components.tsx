// Native reimplementation of the AuraDS primitives (light + gold theme),
// matching the published smart-mattress-cover bundle's render output.
import React from 'react';
import { c, fonts, type, radius, glassTileBg, readableText, Variant } from './theme';

type Sx = React.CSSProperties;
interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: Sx;
  dim?: boolean;
  serif?: boolean;
  variant?: Variant;
  className?: string;
}

// ── text primitives (RN Text → block div) ───────────────────────
export function Body({ style, dim, serif, variant, ...rest }: TextProps) {
  const v = variant ? type[variant] : null;
  const s: Sx = {
    color: dim ? c.textDim : c.text,
    fontSize: 14,
    margin: 0,
    ...(v ? { fontSize: v.size, fontWeight: v.weight } : {}),
    ...(serif ? { fontFamily: fonts.display } : {}),
    ...style,
  };
  return <div style={s} {...rest} />;
}

export function Title({ style, ...rest }: TextProps) {
  return <div style={{ color: c.text, fontSize: 22, fontFamily: fonts.display, margin: 0, ...style }} {...rest} />;
}

export function Label({ style, dim, ...rest }: TextProps) {
  return <Body variant="label" dim={dim} style={style} {...rest} />;
}

export function Caption({ style, dim = true, ...rest }: TextProps) {
  return <Body variant="caption" dim={dim} style={style} {...rest} />;
}

export function SectionLabel({ style, ...rest }: TextProps) {
  return <Body style={{ fontWeight: 700, marginLeft: 2, ...style }} {...rest} />;
}

// ── surfaces ─────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: Sx;
  highlight?: boolean;
  flat?: boolean;
  radius?: number;
  className?: string;
}
export function Card({ style, highlight, flat, radius: cardRadius = 22, children, ...rest }: CardProps) {
  if (flat) {
    return (
      <div style={{ borderRadius: 22, borderWidth: 1, borderStyle: 'solid', borderColor: c.border, padding: 16, display: 'flex', flexDirection: 'column', ...style }} {...rest}>
        {children}
      </div>
    );
  }
  const layers = [
    `linear-gradient(150deg, ${c.glassHi} 0%, transparent 58%)`,
    ...(highlight ? [`linear-gradient(150deg, ${c.accent}30, ${c.accent}12)`] : []),
    glassTileBg,
  ].join(', ');
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: cardRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: highlight ? c.glassBorder : 'rgba(255,255,255,0.72)',
        overflow: 'hidden',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        background: layers,
        backgroundColor: c.glass,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 ' + c.glassHi,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function GlassTile({ style, children, ...rest }: React.HTMLAttributes<HTMLDivElement> & { style?: Sx }) {
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: glassTileBg, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ── controls ─────────────────────────────────────────────────────
type BtnVariant = 'solid' | 'line' | 'ghost';
interface ButtonProps {
  label: React.ReactNode;
  variant?: BtnVariant;
  style?: Sx;
  disabled?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
}
export function Button({ label, variant = 'solid', style, disabled, icon, onPress }: ButtonProps) {
  const base: Sx = {
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 26,
    paddingRight: 26,
    borderRadius: radius.md,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 7,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    fontWeight: 700,
    fontSize: 13.5,
    letterSpacing: 0.3,
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'relative',
    overflow: 'hidden',
  };
  let look: Sx;
  if (variant === 'solid') {
    look = {
      background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`,
      borderColor: 'rgba(0,0,0,0.10)',
      color: readableText(c.accent),
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
    };
  } else if (variant === 'line') {
    look = { background: c.glass, borderColor: c.glassBorder, color: c.text };
  } else {
    look = { background: 'transparent', borderColor: c.glassBorder, color: c.textDim };
  }
  return (
    <button type="button" disabled={disabled} onClick={onPress} style={{ ...base, ...look, ...style }}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function Pill({ label, on }: { label: React.ReactNode; on?: boolean }) {
  if (on) {
    return (
      <span
        style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`,
          padding: '3.5px 10px',
          borderRadius: radius.pill,
          fontSize: 10.5,
          color: '#10131d',
          fontWeight: 800,
        }}
      >
        {label}
      </span>
    );
  }
  return (
    <span
      style={{
        display: 'inline-block',
        borderRadius: radius.pill,
        overflow: 'hidden',
        border: '1px solid ' + c.hairline,
        background: glassTileBg,
        padding: '3.5px 10px',
        fontSize: 10.5,
        color: c.textDim,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

export function PremiumTag({ label = '' }: { label?: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: `linear-gradient(135deg, #ecd9ae, ${c.gold})`,
        padding: '2.5px 9px',
        borderRadius: radius.pill,
        fontSize: 10,
        color: '#2c2105',
        fontWeight: 800,
        letterSpacing: 0.3,
        minWidth: 8,
      }}
    >
      {label}
    </span>
  );
}

export function Toggle({ on, onPress, label }: { on?: boolean; onPress?: () => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!on}
      aria-label={label}
      onClick={onPress}
      style={{
        width: 46,
        height: 26,
        borderRadius: radius.pill,
        padding: 3,
        border: on ? 'none' : '1px solid ' + c.hairline,
        background: on ? `linear-gradient(135deg, ${c.accent}, ${c.accent2})` : glassTileBg,
        boxShadow: on ? `0 3px 8px ${c.accent}55` : 'none',
        position: 'relative',
        cursor: 'pointer',
        display: 'block',
      }}
    >
      {on && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            height: '52%',
            borderRadius: radius.pill,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.04))',
            pointerEvents: 'none',
          }}
        />
      )}
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 20,
          height: 20,
          borderRadius: 10,
          background: '#fff',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.25)',
          transform: `translateX(${on ? 20 : 0}px)`,
          transition: 'transform .2s cubic-bezier(.2,.8,.3,1.2)',
        }}
      />
    </button>
  );
}

export function SegmentControl({ options, active, onPick }: { options: string[]; active: number; onPick?: (i: number) => void }) {
  return (
    <GlassTile style={{ flexDirection: 'row', borderRadius: radius.sm, padding: 3 }}>
      {options.map((o, i) => {
        const isOn = i === active;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onPick?.(i)}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              border: 0,
              cursor: 'pointer',
              background: isOn ? c.accent : 'transparent',
              fontSize: 11.5,
              color: isOn ? '#04122a' : c.textDim,
              fontWeight: isOn ? 700 : 400,
            }}
          >
            {o}
          </button>
        );
      })}
    </GlassTile>
  );
}
