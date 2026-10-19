import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { SlideDef, useSteps } from "../deck/steps";
import { Backdrop, WindowFrame } from "../deck/ui";
import { clamp01, useClock } from "./common";
import { GridFloor, rnd, Rocket, SynthSun, Win } from "./retro";

const HORIZON = 650;
const VX = 960;
const VY = 520;
const THANKS = ["Дякую", "за увагу!"];

const Mountains: React.FC<{ p: number }> = ({ p }) => {
  const left = [
    [46, HORIZON],
    [150, 590],
    [250, 625],
    [380, 520],
    [520, 600],
    [640, 560],
    [760, HORIZON],
  ];
  const right = left.map(([x, y]) => [1920 - x, y]);
  const path = (pts: number[][]) => `M ${pts.map(([x, y]) => `${x},${y}`).join(" L ")} Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
      {[left, right].map((pts, i) => (
        <g key={i}>
          <path d={path(pts)} fill="#1d1b12" stroke={C.pink} strokeWidth={2.5} strokeLinejoin="round" />
          {pts.slice(1, -1).map(([x, y], k) => (
            <line key={k} x1={x} y1={y} x2={x + (i === 0 ? 30 : -30)} y2={HORIZON} stroke={C.pink} strokeWidth={1.2} opacity={0.5} />
          ))}
        </g>
      ))}
    </svg>
  );
};

/* A depth-first search drawn in the sky: the cursor walks the tree, ! prunes, leaves light up as solutions or fail. */
type SNode = { x: number; y: number; parent: number; leaf?: "ok" | "fail" };
const SN: SNode[] = [
  { x: 960, y: 360, parent: -1 },
  { x: 560, y: 440, parent: 0 },
  { x: 1360, y: 440, parent: 0 },
  { x: 360, y: 520, parent: 1 },
  { x: 760, y: 520, parent: 1 },
  { x: 1160, y: 520, parent: 2 },
  { x: 1560, y: 520, parent: 2 },
  { x: 260, y: 600, parent: 3, leaf: "fail" },
  { x: 460, y: 600, parent: 3, leaf: "ok" },
  { x: 660, y: 600, parent: 4, leaf: "ok" },
  { x: 860, y: 600, parent: 4, leaf: "fail" },
  { x: 1060, y: 600, parent: 5, leaf: "fail" },
  { x: 1260, y: 600, parent: 5, leaf: "ok" },
  { x: 1460, y: 600, parent: 6, leaf: "ok" },
  { x: 1660, y: 600, parent: 6, leaf: "ok" },
];
const ORDER = [0, 1, 3, 7, 8, 2, 5, 11, 12, 6, 13];
const PRUNE_AT: Record<number, number[]> = { 8: [4, 9, 10], 13: [14] };
const CYCLE = 7.5;

const SearchSky: React.FC<{ t: number; p: number }> = ({ t, p }) => {
  const u = (t % CYCLE) / CYCLE;
  const steps = ORDER.length;
  const pos = Math.min(steps - 1, Math.floor(u * (steps + 2)));
  const visited = new Set(ORDER.slice(0, pos + 1));
  const pruned = new Set<number>();
  ORDER.slice(0, pos + 1).forEach((n) => (PRUNE_AT[n] ?? []).forEach((m) => pruned.add(m)));
  const fade = u > 0.92 ? 1 - (u - 0.92) / 0.08 : 1;
  const cur = ORDER[pos];
  const local = (u * (steps + 2)) % 1;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) * fade }}>
      {SN.map((n, i) =>
        n.parent >= 0 ? (
          <line
            key={`e${i}`}
            x1={SN[n.parent].x}
            y1={SN[n.parent].y}
            x2={n.x}
            y2={n.y}
            stroke={pruned.has(i) ? C.red : visited.has(i) ? C.lav : C.line}
            strokeWidth={visited.has(i) ? 3 : 2}
            strokeDasharray={pruned.has(i) ? "6 8" : undefined}
            opacity={pruned.has(i) ? 0.5 : 0.9}
          />
        ) : null,
      )}
      {SN.map((n, i) => {
        const on = visited.has(i);
        const col = pruned.has(i) ? C.red : on ? (n.leaf === "ok" ? C.mint : n.leaf === "fail" ? C.red : C.lav) : C.faint;
        const isCur = i === cur;
        return (
          <g key={`n${i}`}>
            {on && n.leaf === "ok" && <circle cx={n.x} cy={n.y} r={24 + 10 * Math.sin(t * 4 + i)} fill={C.mint} opacity={0.18} />}
            <circle cx={n.x} cy={n.y} r={n.leaf ? 11 : 14} fill={on ? col : C.panel} stroke={col} strokeWidth={2.5} />
            {isCur && <circle cx={n.x} cy={n.y} r={22 + 18 * local} fill="none" stroke={C.amber} strokeWidth={3 * (1 - local)} opacity={1 - local} />}
            {on && n.leaf === "fail" && !pruned.has(i) && (
              <path d={`M ${n.x - 7} ${n.y - 7} L ${n.x + 7} ${n.y + 7} M ${n.x + 7} ${n.y - 7} L ${n.x - 7} ${n.y + 7}`} stroke="#14120a" strokeWidth={3} />
            )}
          </g>
        );
      })}
      {Object.keys(PRUNE_AT).map((k) => {
        const n = Number(k);
        const idx = ORDER.indexOf(n);
        const age = pos - idx + local;
        if (idx < 0 || age < 0 || age > 1.6) {
          return null;
        }
        const q = age / 1.6;
        return (
          <text key={`cut${k}`} x={SN[n].x + 26} y={SN[n].y - 18 - 30 * q} fill={C.red} opacity={1 - q} fontFamily={F.pixel} fontSize={30}>
            !
          </text>
        );
      })}
    </svg>
  );
};

const Outro: React.FC = () => {
  const { s, frame: f, fps } = useSteps();
  const clock = useClock();
  const t = Math.max(f / fps, clock);
  const scene = s(0, 6);
  const credit = s(0, 100);
  const sweep = interpolate(f, [110, 160], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const launch = (t % 5.2) / 5.2;
  const ry = interpolate(launch, [0, 1], [HORIZON + 60, -260]);
  const rx = VX + Math.sin(launch * Math.PI * 2) * 40;

  const typed = Math.floor(Math.max(0, f - 20) / 3);
  let used = 0;

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <Backdrop />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(154,68,150,0.28) 0%, rgba(41,38,26,0) 60%)`, opacity: scene }} />
      <SearchSky t={t} p={s(0, 30)} />
      <SynthSun cx={VX} cy={HORIZON} r={220} p={s(0, 10)} t={t} id="osun" />
      <Mountains p={s(0, 24)} />
      <GridFloor y0={HORIZON} t={t * 2.2} p={scene} vx={VX} />
      {launch > 0.02 && launch < 0.98 && (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            {Array.from({ length: 14 }, (_, k) => {
              const l2 = launch - k * 0.012;
              if (l2 <= 0) {
                return null;
              }
              const yy = interpolate(l2, [0, 1], [HORIZON + 60, -260]) + 70;
              const xx = VX + Math.sin(l2 * Math.PI * 2) * 40;
              return <circle key={k} cx={xx + (rnd(k + f) - 0.5) * 10} cy={yy} r={10 - k * 0.6} fill={k % 2 ? C.amber : C.pink} opacity={0.6 - k * 0.04} />;
            })}
          </svg>
          <Rocket x={rx} y={ry} s={0.7} flame={0.5 + 0.5 * Math.sin(f * 0.9)} />
        </>
      )}
      <div style={{ position: "absolute", left: 0, top: 110, width: 1920, textAlign: "center", fontFamily: F.pixel, fontSize: 68, lineHeight: 1.45, color: C.pink, textShadow: `0 0 24px rgba(246,115,169,0.65), 4px 4px 0 #14120a` }}>
        {THANKS.map((line, li) => {
          const start = used;
          used += line.length;
          const vis = Math.max(0, Math.min(line.length, typed - start));
          return (
            <div key={li}>
              {line.slice(0, vis)}
              <span style={{ opacity: 0 }}>{line.slice(vis)}</span>
            </div>
          );
        })}
      </div>
      <Win x={96} y={790} w={600} h={180} title="swipl" titleColor={C.lav} p={s(0, 60)} pad="10px 22px">
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.text, lineHeight: 1.5 }}>
          {"?- дякую(всім), !.".slice(0, Math.max(0, Math.floor((f - 70) / 2)))}
        </div>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.mint, opacity: f > 110 ? 1 : 0 }}>true.</div>
      </Win>
      <div style={{ position: "absolute", right: 96, top: 940, opacity: credit, transform: `translateY(${(1 - credit) * 16}px)` }}>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 2,
            backgroundImage: `linear-gradient(100deg, ${C.dim} 0%, ${C.dim} ${sweep - 12}%, #ffffff ${sweep}%, ${C.dim} ${sweep + 12}%, ${C.dim} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          made with Claude Opus 5.5
        </span>
      </div>
      <WindowFrame title={false} />
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
