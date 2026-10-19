import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { clamp01, useClock } from "./common";
import { GridFloor, RetroTitle, Stars, SynthSun, Win } from "./retro";

const TitleSlide: React.FC = () => {
  const { s, frame, fps } = useSteps();
  const clock = useClock();
  const t = Math.max(frame / fps, clock);
  return (
    <Slide>
      <RetroTitle lecture="ЛЕКЦІЯ 11" lead="Керування виконанням" lines={["у логічному", "програмуванні"]} plaque="уніфікація → бектрекінг → відсікання" t={t} s={s} />
      <AuthorBlock />
    </Slide>
  );
};

/* Epigraph: same answer, two control strategies – full search vs. search with a cut. */
const NODES = [
  { x: 260, y: 30 },
  { x: 120, y: 120 },
  { x: 400, y: 120 },
  { x: 60, y: 210 },
  { x: 180, y: 210 },
  { x: 340, y: 210 },
  { x: 460, y: 210 },
];
const NEDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
];
const FULL = [0, 1, 3, 4, 2, 5, 6];
const CUT = [0, 1, 3];
const SOLUTION = 3;
const VISIT = 16;
const QUOTE_STOP = 170;

const Search: React.FC<{ x: number; order: number[]; title: string; color: string; p: number; delay: number }> = ({ x, order, title, color, p, delay }) => {
  const { t } = useSteps();
  const k = Math.min(order.length, Math.floor(Math.max(0, t(0, delay)) / VISIT) + (t(0, delay) >= 0 ? 1 : 0));
  const seen = order.slice(0, k);
  return (
    <Win x={x} y={300} w={560} h={370} title={title} titleColor={color} p={p} pad="0">
      <svg width={560} height={280} style={{ position: "absolute", left: 0, top: 64 }}>
        {NEDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke={seen.includes(b) ? color : C.line} strokeWidth={2.5} strokeDasharray={seen.includes(b) ? undefined : "5 6"} />
        ))}
        {NODES.map((n, i) => {
          const on = seen.includes(i);
          const sol = i === SOLUTION && on;
          return <circle key={i} cx={n.x} cy={n.y} r={sol ? 16 : 13} fill={on ? (sol ? C.mint : color) : C.panel} stroke={on ? (sol ? C.mint : color) : C.faint} strokeWidth={2.5} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 12, display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.dim }}>
        <span>
          кроків: <span style={{ color }}>{seen.length}</span>
        </span>
        <span style={{ color: C.mint, opacity: seen.includes(SOLUTION) ? 1 : 0 }}>R = 1</span>
      </div>
    </Win>
  );
};

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (str: string, base: number, color?: string) =>
    str.split(" ").map((w, i) => {
      const p = s(0, base + i * 2.6, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 34}px)`, color }}>
          {w + " "}
        </span>
      );
    });
  return (
    <Slide>
      <div style={{ position: "absolute", left: 110, top: 96, width: 1720, fontFamily: F.head, fontSize: 44, lineHeight: 1.32, color: C.text }}>
        {words("The logic component determines the", 4)}
        {words("meaning", 20, C.pink)}
        {words("of the algorithm whereas the control component only affects its", 24)}
        {words("efficiency.", 56, C.lav)}
      </div>
      <Search x={300} order={FULL} title="без відсікання" color={C.amber} p={s(0, 70, POP)} delay={80} />
      <Search x={1060} order={CUT} title="з відсіканням" color={C.lav} p={s(0, 76, POP)} delay={80} />
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 704,
          height: 6,
          width: mix(0, 420, s(1, 0)),
          background: `linear-gradient(90deg, ${C.pink}, ${C.lav})`,
          borderRadius: 3,
        }}
      />
      <At x={110} y={730} w={1720} step={1} delay={6} size={38} weight={700} color={C.text}>
        Логічна складова визначає <span style={{ color: C.pink }}>зміст</span> алгоритму, а керувальна впливає лише на його <span style={{ color: C.lav }}>ефективність</span>.
      </At>
      <At x={110} y={890} step={1} delay={24} size={30} weight={400} color={C.dim} font={F.mono}>
        Robert Kowalski
      </At>
      <At x={110} y={936} w={1600} step={1} delay={36} size={30} weight={700} color={C.dim}>
        «Algorithm = Logic + Control», Communications of the ACM, 1979
      </At>
    </Slide>
  );
};

const AGENDA = ["Уніфікація та бектрекінг", "Керування бектрекінгом", "Організація рекурсивних викликів"];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  const Y0 = 290;
  const GAP = 170;
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 6, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const color = [C.pink, C.lav, C.mint][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 110,
              top: Y0 + i * GAP,
              width: 1200,
              height: 120,
              display: "flex",
              alignItems: "center",
              gap: 34,
              border: `2.5px solid ${on > 0.5 && !full ? color : C.cream}`,
              borderRadius: 6,
              padding: "0 34px",
              boxSizing: "border-box",
              background: on > 0.5 && !full ? `${color}1a` : "rgba(20,18,10,0.25)",
              boxShadow: on > 0.5 && !full ? `0 0 ${28 * on}px ${color}66` : undefined,
              opacity: clamp01(p) * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            <div style={{ fontFamily: F.pixel, fontSize: 34, color }}>{`0${i + 1}`}</div>
            <div style={{ fontFamily: F.title, fontSize: 50, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [QUOTE_STOP, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
