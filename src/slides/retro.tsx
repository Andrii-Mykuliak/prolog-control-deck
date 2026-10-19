import React from "react";
import { C, F } from "../deck/theme";
import { mix, useSteps } from "../deck/steps";
import { clamp01 } from "./common";

/** A small retro OS window: cream frame, three dots in the top strip, optional title row. */
export const Win: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  title?: React.ReactNode;
  titleColor?: string;
  tag?: string;
  p?: number;
  glow?: number;
  border?: string;
  children?: React.ReactNode;
  pad?: string;
}> = ({ x, y, w, h, title, titleColor = C.pink, tag, p = 1, glow = 0, border = C.cream, children, pad = "16px 22px 18px" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      border: `2.5px solid ${border}`,
      borderRadius: 6,
      background: "rgba(20,18,10,0.28)",
      boxSizing: "border-box",
      boxShadow: glow > 0.02 ? `0 0 ${30 * glow}px ${border}` : undefined,
      opacity: clamp01(p),
      transform: `translateY(${(1 - p) * 22}px)`,
      overflow: "hidden",
    }}
  >
    <div style={{ height: 26, borderBottom: `2.5px solid ${border}`, display: "flex", alignItems: "center", gap: 7, padding: "0 10px", boxSizing: "border-box" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: border }} />
      ))}
      {tag && <span style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: border }}>{tag}</span>}
    </div>
    {title !== undefined && (
      <div style={{ padding: "8px 20px", borderBottom: `2px solid ${border}`, fontFamily: F.head, fontSize: 26, color: titleColor, whiteSpace: "nowrap" }}>{title}</div>
    )}
    <div style={{ padding: pad }}>{children}</div>
  </div>
);

/** Cyan highlight box used by the source deck for predicate names. */
export const Hl: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.lav }) => (
  <span style={{ background: color, color: "#14120a", padding: "0 6px", borderRadius: 2, fontFamily: F.mono, fontWeight: 700 }}>{children}</span>
);

/** Deterministic pseudo-random number in [0, 1). */
export const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Twinkling star field. */
export const Stars: React.FC<{ n?: number; t: number; x0?: number; y0?: number; w?: number; h?: number; seed?: number; opacity?: number }> = ({
  n = 70,
  t,
  x0 = 50,
  y0 = 70,
  w = 1820,
  h = 980,
  seed = 0,
  opacity = 1,
}) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity }}>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + rnd(i + seed * 97) * w;
      const y = y0 + rnd(i + 500 + seed * 97) * h;
      const r = 0.8 + rnd(i + 900 + seed) * 1.8;
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + rnd(i) * 2) + i));
      const col = [C.cream, C.lav, C.pink, C.cream][i % 4];
      return (
        <g key={i} opacity={tw}>
          <circle cx={x} cy={y} r={r} fill={col} />
          {r > 2.2 && <path d={`M ${x - 7} ${y} L ${x + 7} ${y} M ${x} ${y - 7} L ${x} ${y + 7}`} stroke={col} strokeWidth={1} opacity={0.6} />}
        </g>
      );
    })}
  </svg>
);

/** Striped synthwave sun sitting on the horizon. */
export const SynthSun: React.FC<{ cx: number; cy: number; r: number; p?: number; t?: number; id?: string }> = ({ cx, cy, r, p = 1, t = 0, id = "sun" }) => {
  const bands = 7;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1={cy - r} x2="0" y2={cy} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd36e" />
          <stop offset="45%" stopColor={C.pink} />
          <stop offset="100%" stopColor={C.purple} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x={cx - r - 10} y={cy - r * mix(0, 1, clamp01(p)) - 2} width={2 * r + 20} height={r + 2} />
        </clipPath>
        <mask id={`${id}m`}>
          <rect x={cx - r - 10} y={cy - r - 10} width={2 * r + 20} height={r + 20} fill="#ffffff" />
          {Array.from({ length: bands }, (_, i) => {
            const k = i / bands;
            const y = cy - r * 0.55 + k * r * 0.55 + ((t * 18) % (r * 0.55 / bands));
            const hgt = 2 + k * 9;
            return <rect key={i} x={cx - r - 10} y={y} width={2 * r + 20} height={hgt} fill="#000000" />;
          })}
        </mask>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.35} fill={C.pink} opacity={0.08} />
      <g clipPath={`url(#${id}c)`} mask={`url(#${id}m)`}>
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}g)`} />
      </g>
    </svg>
  );
};

/** Perspective grid floor scrolling towards the viewer. */
export const GridFloor: React.FC<{ y0: number; y1?: number; x0?: number; x1?: number; t: number; p?: number; color?: string; vx?: number }> = ({
  y0,
  y1 = 1052,
  x0 = 46,
  x1 = 1874,
  t,
  p = 1,
  color = C.cream,
  vx = 960,
}) => {
  const rows = 12;
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < rows; i++) {
    const u = ((i + (t * 0.8) % 1) / rows);
    const yy = y0 + (y1 - y0) * u * u;
    lines.push(<line key={`h${i}`} x1={x0} y1={yy} x2={x1} y2={yy} stroke={color} strokeWidth={1 + u * 1.6} opacity={0.15 + 0.5 * u} />);
  }
  for (let i = -14; i <= 14; i++) {
    const xb = vx + i * 150;
    lines.push(<line key={`v${i}`} x1={vx + i * 8} y1={y0} x2={xb} y2={y1 + 40} stroke={color} strokeWidth={1.4} opacity={0.38} />);
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
      <defs>
        <clipPath id="floorClip">
          <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
        </clipPath>
        <linearGradient id="floorFade" x1="0" y1={y0} x2="0" y2={y1} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={C.purple} stopOpacity={0.35} />
          <stop offset="100%" stopColor={C.bg} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="url(#floorFade)" />
      <g clipPath="url(#floorClip)">{lines}</g>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.pink} strokeWidth={2.5} opacity={0.8} />
    </svg>
  );
};

/** Ringed retro planet. */
export const Planet: React.FC<{ x: number; y: number; r: number; color?: string; ring?: string; tilt?: number; p?: number }> = ({
  x,
  y,
  r,
  color = C.lav,
  ring = C.cream,
  tilt = -18,
  p = 1,
}) => (
  <svg width={r * 4} height={r * 4} viewBox={`${-2 * r} ${-2 * r} ${4 * r} ${4 * r}`} style={{ position: "absolute", left: x - 2 * r, top: y - 2 * r, opacity: clamp01(p), overflow: "visible" }}>
    <g transform={`rotate(${tilt})`}>
      <path d={`M ${-1.9 * r} 0 A ${1.9 * r} ${0.45 * r} 0 0 0 ${1.9 * r} 0`} fill="none" stroke={ring} strokeWidth={r * 0.09} opacity={0.9} />
    </g>
    <circle r={r} fill={color} />
    <path d={`M ${-r} ${-r * 0.2} Q 0 ${-r * 0.45} ${r} ${-r * 0.2}`} stroke="#14120a" strokeWidth={r * 0.08} fill="none" opacity={0.25} />
    <path d={`M ${-r * 0.95} ${r * 0.3} Q 0 ${r * 0.05} ${r * 0.95} ${r * 0.3}`} stroke="#14120a" strokeWidth={r * 0.1} fill="none" opacity={0.2} />
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.22} fill="#ffffff" opacity={0.25} />
    <g transform={`rotate(${tilt})`}>
      <path d={`M ${1.9 * r} 0 A ${1.9 * r} ${0.45 * r} 0 0 1 ${-1.9 * r} 0`} fill="none" stroke={ring} strokeWidth={r * 0.09} opacity={0.9} />
    </g>
  </svg>
);

/** Retro rocket pointing up; `flame` animates the exhaust. */
export const Rocket: React.FC<{ x: number; y: number; s?: number; rot?: number; flame?: number; p?: number }> = ({ x, y, s = 1, rot = 0, flame = 0, p = 1 }) => (
  <svg
    width={120 * s}
    height={220 * s}
    viewBox="-60 -110 120 220"
    style={{ position: "absolute", left: x - 60 * s, top: y - 110 * s, transform: `rotate(${rot}deg)`, opacity: clamp01(p), overflow: "visible" }}
  >
    <path d={`M -14 62 Q 0 ${100 + 22 * flame} 14 62 Z`} fill={C.amber} opacity={0.9} />
    <path d={`M -8 62 Q 0 ${86 + 14 * flame} 8 62 Z`} fill="#fff4c2" />
    <path d="M 0 -96 C 30 -60 30 20 22 58 L -22 58 C -30 20 -30 -60 0 -96 Z" fill={C.cream} stroke="#14120a" strokeWidth={3} />
    <path d="M -22 30 L -42 66 L -20 58 Z" fill={C.pink} stroke="#14120a" strokeWidth={3} />
    <path d="M 22 30 L 42 66 L 20 58 Z" fill={C.pink} stroke="#14120a" strokeWidth={3} />
    <circle cx={0} cy={-26} r={13} fill={C.lav} stroke="#14120a" strokeWidth={3} />
    <path d="M -21 8 L 21 8" stroke={C.pink} strokeWidth={6} />
  </svg>
);

/** Retro terminal with lines that type in over time. */
export const Term: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  lines: { text: string; at: number; color?: string; step?: number }[];
  step: number;
  p?: number;
  size?: number;
}> = ({ x, y, w, h, title = "swipl", lines, step, p = 1, size = 31 }) => {
  const { t, frame } = useSteps();
  const shown = lines.filter((l) => t(l.step ?? step, l.at) >= 0);
  const last = shown[shown.length - 1];
  return (
    <Win x={x} y={y} w={w} h={h} title={title} titleColor={C.lav} p={p} pad="14px 22px">
      {lines.map((l, i) => {
        const tt = t(l.step ?? step, l.at);
        if (tt < 0) {
          return null;
        }
        const typed = l.text.startsWith("?-") ? Math.min(l.text.length, Math.floor(tt * 1.6) + 3) : l.text.length;
        const caret = l === last && typed < l.text.length + 1 && frame % 30 < 18;
        return (
          <div key={i} style={{ fontFamily: F.mono, fontWeight: 600, fontSize: size, lineHeight: 1.5, color: l.color ?? (l.text.startsWith("?-") ? C.text : C.mint), whiteSpace: "pre" }}>
            {l.text.slice(0, typed)}
            {caret && <span style={{ background: C.cream, color: C.cream }}>_</span>}
          </div>
        );
      })}
    </Win>
  );
};


/** Shared title slide: lecture number, cream lead line, pink headline, plaque, synthwave sun, LOGICAL PROGRAMMING badge. */
export const RetroTitle: React.FC<{ lecture: string; lead: string; lines: string[]; plaque: string; t: number; s: (step: number, delay?: number, cfg?: object) => number }> = ({
  lecture,
  lead,
  lines,
  plaque,
  t,
  s,
}) => {
  const letters = (str: string, base: number, step = 1.3) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * step);
      return (
        <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px)`, whiteSpace: "pre" }}>
          {ch}
        </span>
      );
    });
  return (
    <>
      <Stars t={t} n={60} y0={80} h={520} opacity={clamp01(s(0, 4))} />
      <SynthSun cx={1450} cy={600} r={190} p={s(0, 10)} t={t} id="tsun" />
      <Planet x={1110} y={330} r={38} color={C.lav} p={s(0, 30, { damping: 13, stiffness: 170, mass: 0.9 })} />
      <GridFloor y0={600} t={t} p={s(0, 6)} vx={1450} />
      <div
        style={{
          position: "absolute",
          right: 96,
          top: 96,
          textAlign: "right",
          fontFamily: F.head,
          fontSize: 62,
          lineHeight: 1.12,
          color: C.pink,
          textShadow: "0 0 24px rgba(246,115,169,0.5)",
        }}
      >
        <div>{letters("LOGICAL", 20, 1.6)}</div>
        <div>{letters("PROGRAMMING", 30, 1.6)}</div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 130, fontFamily: F.pixel, fontSize: 30, color: C.lav, opacity: clamp01(s(0, 6)) }}>{lecture}</div>
      <div style={{ position: "absolute", left: 104, top: 200, fontFamily: F.title, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.cream }}>
        {letters(lead, 12)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 286,
          fontFamily: F.title,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.04,
          color: C.pink,
          textShadow: "0 0 26px rgba(246,115,169,0.45)",
          letterSpacing: 1,
        }}
      >
        {lines.map((l, i) => (
          <div key={l}>{letters(l, 30 + i * 12)}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 520,
          padding: "10px 22px",
          background: C.lav,
          color: "#14120a",
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          borderRadius: 2,
          opacity: clamp01(s(0, 64)),
          transform: `translateX(${(1 - s(0, 64)) * -30}px)`,
        }}
      >
        {plaque}
      </div>
    </>
  );
};
