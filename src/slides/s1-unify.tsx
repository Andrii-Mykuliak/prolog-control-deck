import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Slide } from "../deck/ui";
import { clamp01, pulse } from "./common";
import { Planet, Term, Win } from "./retro";

/* Уніфікація */
const Unification: React.FC = () => {
  const { s } = useSteps();
  const checks = [
    { k: "ім’я предиката", v: "любить = любить", color: C.pink },
    { k: "кількість аргументів", v: "2 = 2", color: C.lav },
    { k: "значення аргументів", v: "кіт = кіт,  X ↔ сметана", color: C.mint },
  ];
  return (
    <Slide title="Уніфікація">
      <Lead>
        <A>Уніфікація</A> – вбудований механізм Prolog: послідовне зіставлення запиту з фактами й правилами бази знань, щоб довести, що запит виконується.
      </Lead>
      {checks.map((c, i) => (
        <Win key={c.k} x={96 + i * 590} y={360} w={550} h={250} title={c.k} titleColor={c.color} tag={`0${i + 1}`} p={s(1, i * 12, POP)}>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 38, color: C.text, marginTop: 30 }}>{c.v}</div>
        </Win>
      ))}
      <At x={96} y={680} w={1720} step={2} size={34} weight={700}>
        Якщо в запиті є <A c={C.amber}>вільні змінні</A>, Prolog шукає їхні значення, за яких ціль досяжна.
      </At>
      <At x={96} y={760} w={1720} step={3} size={34} weight={700}>
        Якщо вільних змінних немає, відповідь – лише результат уніфікації: <M>true</M> або <M c={C.red}>false</M>.
      </At>
    </Slide>
  );
};

/* Етапи уніфікації */
const STAGES = [
  { t: "Запит", d: "початок уніфікації", color: C.pink },
  { t: "Відповідності", d: "зіставлення з базою знань", color: C.lav },
  { t: "Перевірка умов", d: "предикат, арність, значення", color: C.amber },
  { t: "Зв’язування", d: "присвоєння значень змінним", color: C.mint },
  { t: "Результат", d: "видача відповіді", color: C.pink },
  { t: "Бектрекінг", d: "пошук альтернативних рішень", color: C.lav },
];
const ST_GAP = 22;

const Stages: React.FC = () => {
  const { s, t } = useSteps();
  return (
    <Slide title="Етапи уніфікації">
      {STAGES.map((st, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const hot = pulse(t(1, 30 + i * ST_GAP), 8, 16);
        return (
          <Win key={st.t} x={150 + col * 560} y={230 + row * 330} w={500} h={260} title={st.t} titleColor={st.color} tag={`0${i + 1}`} p={s(1, i * 8, POP)} glow={hot} border={hot > 0.3 ? st.color : C.cream}>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: C.text, lineHeight: 1.4, marginTop: 14 }}>{st.d}</div>
          </Win>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(s(1, 50)) }}>
        {[0, 1].map((r) => (
          <g key={r}>
            {[0, 1].map((c) => (
              <g key={c}>
                <line x1={650 + c * 560 + 4} y1={360 + r * 330} x2={710 + c * 560 - 6} y2={360 + r * 330} stroke={C.cream} strokeWidth={2.5} />
                <polygon points={`${710 + c * 560 - 2},${360 + r * 330} ${700 + c * 560 - 2},${354 + r * 330} ${700 + c * 560 - 2},${366 + r * 330}`} fill={C.cream} />
              </g>
            ))}
          </g>
        ))}
        <path d={`M ${1710} ${490} L ${1710} ${540} L ${400} ${540} L ${400} ${552}`} fill="none" stroke={C.cream} strokeWidth={2.5} strokeDasharray="6 6" />
      </svg>
      <At x={96} y={900} w={1720} step={2} size={34} weight={700}>
        Якщо на будь-якому етапі зіставлення не вдається, Prolog повертається до останньої точки вибору – це і є бектрекінг.
      </At>
    </Slide>
  );
};

/* Приклад уніфікації */
const Cell: React.FC<{ x: number; y: number; text: string; color: string; p: number; glow?: number }> = ({ x, y, text, color, p, glow = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 220,
      height: 80,
      border: `2.5px solid ${color}`,
      borderRadius: 6,
      background: "rgba(20,18,10,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: 32,
      color,
      boxShadow: glow > 0.02 ? `0 0 ${26 * glow}px ${color}` : undefined,
      opacity: clamp01(p),
      transform: `scale(${mix(0.8, 1, clamp01(p))})`,
    }}
  >
    {text}
  </div>
);

const MATCH_GAP = 26;

const UnifyExample: React.FC = () => {
  const { s, t } = useSteps();
  const cols = [
    { fact: "любить", query: "любить", ok: true, note: "ім’я" },
    { fact: "кіт", query: "кіт", ok: true, note: "1-й аргумент" },
    { fact: "сметана", query: "X", ok: true, note: "X ← сметана" },
  ];
  const X0 = 360;
  return (
    <Slide title="Приклад уніфікації">
      <Code
        x={96}
        y={200}
        size={32}
        step={0}
        stagger={10}
        code={`
          любить(кіт, сметана).
          ?- любить(кіт, X).
        `}
      />
      <At x={96} y={378} w={240} step={1} size={24} weight={700} color={C.mint} font={F.pixel}>
        ФАКТ
      </At>
      <At x={96} y={498} w={240} step={1} size={24} weight={700} color={C.amber} font={F.pixel}>
        ЗАПИТ
      </At>
      {cols.map((c, i) => {
        const tt = t(1, 20 + i * MATCH_GAP);
        const hot = pulse(tt, 8, 16);
        return (
          <React.Fragment key={i}>
            <Cell x={X0 + i * 300} y={360} text={c.fact} color={C.mint} p={s(1, i * 6, POP)} glow={hot} />
            <Cell x={X0 + i * 300} y={480} text={c.query} color={i === 2 ? C.amber : C.cream} p={s(1, 6 + i * 6, POP)} glow={hot} />
            <div style={{ position: "absolute", left: X0 + i * 300, width: 220, top: 448, textAlign: "center", fontFamily: F.mono, fontSize: 30, color: c.ok ? C.mint : C.red, opacity: clamp01(s(1, 26 + i * MATCH_GAP)) }}>
              {i === 2 ? "↕" : "="}
            </div>
            <div style={{ position: "absolute", left: X0 + i * 300 - 20, width: 260, top: 580, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 27, color: C.dim, opacity: clamp01(s(1, 30 + i * MATCH_GAP)) }}>
              {c.note}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 1300, top: 430, padding: "14px 26px", border: `3px solid ${C.mint}`, borderRadius: 6, fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.mint, boxShadow: `0 0 26px ${C.mint}55`, opacity: clamp01(s(1, 110, POP)) }}>
        X = сметана
      </div>
      <Win x={96} y={680} w={1728} title="Коли уніфікація не вдається" titleColor={C.red} p={s(2, 0, POP)} pad="12px 22px">
        <div style={{ display: "flex", gap: 80, fontFamily: F.mono, fontWeight: 700, fontSize: 31, lineHeight: 1.6 }}>
          <div>
            <span style={{ color: C.text }}>?- любить(пес, X).</span>
            <span style={{ color: C.red }}>{"  кіт ≠ пес"}</span>
          </div>
          <div>
            <span style={{ color: C.text }}>?- любить(кіт).</span>
            <span style={{ color: C.red }}>{"  арність 1 ≠ 2"}</span>
          </div>
        </div>
      </Win>
    </Slide>
  );
};

/* Бектрекінг */
type GNode = { x: number; y: number; kind: "start" | "node" | "sol" | "bad" | "end" };
const GRAPH: GNode[] = [
  { x: 330, y: 560, kind: "start" },
  { x: 560, y: 560, kind: "node" },
  { x: 760, y: 430, kind: "node" },
  { x: 960, y: 430, kind: "sol" },
  { x: 760, y: 560, kind: "node" },
  { x: 960, y: 560, kind: "bad" },
  { x: 760, y: 690, kind: "node" },
  { x: 960, y: 690, kind: "sol" },
  { x: 1180, y: 800, kind: "end" },
];
const GEDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [4, 5],
  [1, 6],
  [6, 7],
];
const WALK = [0, 1, 2, 3, 2, 1, 4, 5, 4, 1, 6, 7, 6, 1, 8];
const WALK_GAP = 14;

const Backtracking: React.FC = () => {
  const { s, t } = useSteps();
  const k = Math.min(WALK.length - 1, Math.floor(Math.max(0, t(1, 10)) / WALK_GAP));
  const started = t(1, 10) >= 0;
  const cur = WALK[k];
  const visited = new Set(WALK.slice(0, k + 1));
  const stack = started ? (k < 4 ? ["вузол 1: ще 2 альтернативи"] : k < 9 ? ["вузол 1: ще 1 альтернатива"] : k < 13 ? ["вузол 1: альтернатив немає"] : []) : [];
  const label = (n: GNode) => (n.kind === "start" ? "START" : n.kind === "end" ? "END" : n.kind === "sol" ? "SOLUTION" : n.kind === "bad" ? "NOT A SOLUTION" : "");
  return (
    <Slide title="Бектрекінг">
      <Lead>
        <A>Бектрекінг</A> – повернення до найближчої точки розгалуження, коли уніфікація не вдалася. Можливий лише тоді, коли є альтернативні речення.
      </Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(s(1, 0)) }}>
        {GEDGES.map(([a, b], i) => (
          <line key={i} x1={GRAPH[a].x} y1={GRAPH[a].y} x2={GRAPH[b].x} y2={GRAPH[b].y} stroke={visited.has(b) ? C.lav : C.line} strokeWidth={3} />
        ))}
        <path d={`M ${GRAPH[1].x} ${GRAPH[1].y + 30} Q ${GRAPH[1].x} ${GRAPH[8].y} ${GRAPH[8].x - 70} ${GRAPH[8].y}`} fill="none" stroke={visited.has(8) ? C.lav : C.line} strokeWidth={3} strokeDasharray="6 6" />
        {GRAPH.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.kind === "node" ? 22 : 16}
            fill={i === cur && started ? C.amber : visited.has(i) ? (n.kind === "bad" ? C.red : n.kind === "sol" ? C.mint : C.lav) : C.panel}
            stroke={n.kind === "bad" ? C.red : n.kind === "sol" ? C.mint : C.cream}
            strokeWidth={3}
          />
        ))}
      </svg>
      {GRAPH.map((n, i) =>
        label(n) ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.kind === "start" ? n.x - 200 : n.x + 30,
              top: n.y - 20,
              padding: "4px 12px",
              background: n.kind === "bad" ? "#ea9999" : n.kind === "sol" ? C.mint : C.lav,
              color: "#14120a",
              fontFamily: F.head,
              fontSize: 26,
              opacity: clamp01(s(1, 0)),
            }}
          >
            {label(n)}
          </div>
        ) : null,
      )}
      <Win x={1340} y={330} w={480} h={300} title="стек точок повернення" titleColor={C.amber} p={s(1, 0, POP)}>
        {stack.map((st) => (
          <div key={st} style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 27, color: C.amber, padding: "8px 12px", border: `2px solid ${C.amber}`, borderRadius: 4 }}>
            {st}
          </div>
        ))}
        {started && stack.length === 0 && <div style={{ fontFamily: F.body, fontSize: 27, color: C.dim }}>порожній: пошук завершено</div>}
      </Win>
      <At x={96} y={880} w={1720} step={2} size={32} weight={700}>
        Пошук іде вглиб; у точках розвилки Prolog запам’ятовує альтернативи, а при поверненні відновлює значення змінних, які вони мали в цій точці.
      </At>
    </Slide>
  );
};

/* Приклад бектрекінгу */
const BtExample: React.FC = () => {
  const { s, t } = useSteps();
  const marker = t(1, 30) < 0 ? -1 : t(1, 70) < 0 ? 0 : 1;
  return (
    <Slide title="Приклад бектрекінгу">
      <Win x={96} y={200} w={820} h={300} title="база знань" titleColor={C.mint} p={s(0, 6, POP)}>
        {["любить(кіт, сметана).", "любить(кіт, сир)."].map((f, i) => (
          <div key={f} style={{ display: "flex", gap: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 32, lineHeight: 1.7, color: i === marker ? C.amber : C.mint }}>
            <span style={{ width: 26, color: C.amber }}>{i === marker ? "▶" : ""}</span>
            {f}
          </div>
        ))}
      </Win>
      <Term
        x={980}
        y={200}
        w={844}
        h={300}
        step={1}
        p={s(1, 0, POP)}
        lines={[
          { text: "?- любить(кіт, X).", at: 0 },
          { text: "X = сметана ;", at: 30 },
          { text: "X = сир.", at: 70 },
        ]}
      />
      <At x={96} y={580} w={1720} step={2} size={34} weight={700}>
        Перша відповідь – <M>X = сметана</M>. Після «;» Prolog повертається до точки вибору й пробує наступне речення: <M>X = сир</M>.
      </At>
      <At x={96} y={700} w={1720} step={3} size={34} weight={700}>
        Автоматичний перебір із поверненнями – головна перевага Prolog: програмістові не потрібні явні цикли для перебору варіантів.
      </At>
    </Slide>
  );
};

/* Дерево цілей */
const PLANETS = [
  { name: "меркурій", color: "#b9a68a", r: 16 },
  { name: "венера", color: C.amber, r: 22 },
  { name: "земля", color: C.lav, r: 24 },
  { name: "юпітер", color: C.orange, r: 34 },
];
const PT_GAP = 26;

const GoalTree: React.FC = () => {
  const { s, t } = useSteps();
  const RX = 520;
  const RY = 560;
  return (
    <Slide title="Дерево цілей">
      <Code
        x={96}
        y={180}
        size={30}
        lh={44}
        step={0}
        stagger={4}
        code={`
          планета(сонце, меркурій).   планета(сонце, венера).
          планета(сонце, земля).      планета(сонце, юпітер).
        `}
      />
      <div
        style={{
          position: "absolute",
          left: RX - 230,
          top: RY - 40,
          padding: "14px 22px",
          border: `2.5px solid ${C.cream}`,
          borderRadius: 6,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          color: C.text,
          background: "rgba(20,18,10,0.4)",
          opacity: clamp01(s(1, 0, POP)),
        }}
      >
        ?- планета(сонце, X).
      </div>
      {PLANETS.map((pl, i) => {
        const y = 330 + i * 150;
        const x = 1220;
        const hot = pulse(t(1, 20 + i * PT_GAP), 6, 18);
        const on = t(1, 20 + i * PT_GAP) >= 0;
        return (
          <React.Fragment key={pl.name}>
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
              <path d={`M ${RX + 250} ${RY} L ${RX + 360} ${RY} L ${RX + 360} ${y} L ${x - 60} ${y}`} fill="none" stroke={on ? C.lav : C.line} strokeWidth={3} opacity={clamp01(s(1, 10))} />
            </svg>
            <Planet x={x} y={y} r={pl.r} color={pl.color} p={s(1, 10 + i * 6, POP)} />
            <div
              style={{
                position: "absolute",
                left: x + 70,
                top: y - 24,
                padding: "6px 18px",
                border: `2.5px solid ${on ? C.mint : C.cream}`,
                borderRadius: 4,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 31,
                color: on ? C.mint : C.text,
                boxShadow: hot > 0.02 ? `0 0 ${26 * hot}px ${C.mint}` : undefined,
                opacity: clamp01(s(1, 10 + i * 6, POP)),
              }}
            >
              {`X = ${pl.name}`}
            </div>
            <div style={{ position: "absolute", left: x + 360, top: y - 18, fontFamily: F.pixel, fontSize: 20, color: C.amber, opacity: on ? 1 : 0 }}>{`#${i + 1}`}</div>
          </React.Fragment>
        );
      })}
      <At x={96} y={880} w={1720} step={2} size={32} weight={700}>
        Корінь – запит, листки – знайдені рішення; номери показують порядок, у якому бектрекінг обходить дерево: зверху вниз за текстом програми.
      </At>
    </Slide>
  );
};

/* Правила бектрекінгу */
const RULES = [
  "Цілі доводяться по порядку – зліва направо.",
  "Для доведення цілі речення переглядаються в тому порядку, в якому записані в програмі.",
  "Щоб довести голову правила, треба довести цілі в його тілі.",
  "Тіло правила, своєю чергою, складається з цілей, які теж треба довести.",
  "Ціль доведена, якщо доведено всі цілі в листках дерева цілей за допомогою фактів.",
];

const BtRules: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Правила бектрекінгу">
      {RULES.map((r, i) => {
        const a = s(0, 12 + i * 10, POP);
        return (
          <div key={i} style={{ position: "absolute", left: 110, top: 210 + i * 140, width: 1700, display: "flex", gap: 30, alignItems: "flex-start", opacity: clamp01(a), transform: `translateX(${(1 - a) * -30}px)` }}>
            <div style={{ fontFamily: F.pixel, fontSize: 28, color: [C.pink, C.lav, C.mint, C.amber, C.pink][i], marginTop: 6 }}>{`0${i + 1}`}</div>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 34, lineHeight: 1.4, color: C.text }}>{r}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s1Slides: SlideDef[] = [
  { id: "unification", title: "Уніфікація", steps: [45, 60, 60, 60], C: Unification },
  { id: "stages", title: "Етапи уніфікації", steps: [20, 30 + 6 * ST_GAP + 20, 60], C: Stages },
  { id: "unify-example", title: "Приклад уніфікації", steps: [40, 130, 60], C: UnifyExample },
  { id: "backtracking", title: "Бектрекінг", steps: [45, 10 + WALK.length * WALK_GAP + 20, 60], C: Backtracking },
  { id: "bt-example", title: "Приклад бектрекінгу", steps: [30, 100, 60, 60], C: BtExample },
  { id: "goal-tree", title: "Дерево цілей", steps: [30, 20 + 4 * PT_GAP + 30, 60], C: GoalTree },
  { id: "bt-rules", title: "Правила бектрекінгу", steps: [80], C: BtRules },
];
