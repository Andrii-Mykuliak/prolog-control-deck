import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Slide } from "../deck/ui";
import { clamp01, Num, pulse } from "./common";
import { Term, Win } from "./retro";

/* Рекурсія в Prolog */
const FACT = [
  { call: "factorial(3, R)", res: "R = 6" },
  { call: "factorial(2, R1)", res: "R1 = 2" },
  { call: "factorial(1, R2)", res: "R2 = 1" },
  { call: "factorial(0, R3)", res: "R3 = 1" },
];
const F_GAP = 26;

const Recursion: React.FC = () => {
  const { s, t } = useSteps();
  return (
    <Slide title="Рекурсія в Prolog">
      <Lead>Рекурсія – ситуація, коли правило посилається на себе у своїх умовах. Кожен виклик додає ціль до стеку цілей.</Lead>
      <Code
        x={96}
        y={330}
        size={30}
        step={1}
        stagger={6}
        code={`
          factorial(0, 1) :- !.
          factorial(N, R) :-
              N > 0,
              N1 is N - 1,
              factorial(N1, R1),
              R is N * R1.
        `}
      />
      {FACT.map((f, i) => {
        const down = s(2, i * F_GAP, POP);
        const upAt = FACT.length * F_GAP + (FACT.length - 1 - i) * F_GAP;
        const up = s(2, upAt, POP);
        const hot = pulse(t(2, upAt), 4, 14);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1000 + i * 36,
              top: 320 + i * 116,
              width: 700,
              height: 90,
              border: `2.5px solid ${up > 0.5 ? C.mint : C.cream}`,
              borderRadius: 6,
              background: "rgba(20,18,10,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              boxSizing: "border-box",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 30,
              color: C.text,
              boxShadow: hot > 0.02 ? `0 0 ${26 * hot}px ${C.mint}` : undefined,
              opacity: clamp01(down),
              transform: `translateX(${(1 - down) * 40}px)`,
            }}
          >
            <span>{f.call}</span>
            <span style={{ color: C.mint, opacity: clamp01(up) }}>{f.res}</span>
          </div>
        );
      })}
      <At x={96} y={860} w={1720} step={3} size={32} weight={700}>
        Prolog ефективно обробляє глибоку рекурсію, але неправильно описані правила ведуть до нескінченних циклів і великих витрат пам’яті.
      </At>
    </Slide>
  );
};

/* Базовий випадок спершу */
const WrongOrder: React.FC = () => {
  const { s, t, frame } = useSteps();
  const tt = Math.max(0, t(2, 0));
  const n = 2 - Math.floor(tt / 7);
  const depth = Math.min(14, Math.floor(tt / 7) + 1);
  const overflow = tt > 7 * 14;
  return (
    <Slide title="Базовий випадок – спершу">
      <Lead>Prolog перебирає речення в порядку запису. Якщо базовий випадок стоїть після рекурсивного, без умови N &gt; 0 рекурсія не зупиняється.</Lead>
      <Win x={96} y={330} w={900} title="базовий випадок після рекурсії" titleColor={C.red} border={C.red} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 29, lineHeight: 1.55, color: C.mint, whiteSpace: "pre" }}>
          {"factorial(N, R) :-\n    N1 is N - 1,\n    factorial(N1, R1),\n    R is N * R1.\nfactorial(0, 1)."}
        </div>
      </Win>
      <Win x={96} y={720} w={900} title="виправлено" titleColor={C.mint} border={C.mint} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, color: C.text }}>
          Базовий випадок <M>factorial(0, 1)</M> першим і умова <M>N &gt; 0</M> у рекурсивному правилі.
        </div>
      </Win>
      <Win x={1060} y={330} w={764} h={560} title="?- factorial(2, R)." titleColor={C.amber} p={s(2, 0, POP)}>
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 6, height: 420, overflow: "hidden" }}>
          {Array.from({ length: depth }, (_, i) => (
            <div key={i} style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 27, color: 2 - i < 0 ? C.red : C.text, padding: "4px 12px", border: `2px solid ${2 - i < 0 ? C.red : C.cream}`, borderRadius: 4 }}>
              {`factorial(${2 - i}, R${i})`}
            </div>
          ))}
        </div>
        {overflow && (
          <div style={{ position: "absolute", left: 30, right: 30, top: 250, padding: "14px", background: C.red, color: "#14120a", fontFamily: F.pixel, fontSize: 22, textAlign: "center", opacity: frame % 20 < 14 ? 1 : 0.5 }}>
            STACK OVERFLOW
          </div>
        )}
      </Win>
      <At x={1060} y={900} w={764} step={2} delay={20} size={27} weight={700} color={C.dim}>
        {overflow ? "N іде в мінус: базовий випадок так і не досягнуто" : `N = ${n}`}
      </At>
    </Slide>
  );
};

/* Рекомендації */
const RECS = [
  { t: "Базові випадки – спершу", d: "Prolog спочатку перевіряє випадки без рекурсивних викликів, і рекурсія швидко завершується." },
  { t: "Найсуворіші умови – спереду", d: "Непідходящі варіанти відкидаються якнайраніше, тож бектрекінгу менше." },
  { t: "Вбудовані предикати", d: "Відсікання ! зупиняє бектрекінг і не дає повторно виконувати вже пройдений код правила." },
  { t: "Декомпозиція", d: "Складне правило розбивають на менші: порядок виконання стає очевиднішим, а код – чистішим." },
];

const Recs: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Рекомендації до правил">
      {RECS.map((r, i) => (
        <Win key={r.t} x={96 + (i % 2) * 878} y={200 + Math.floor(i / 2) * 340} w={850} h={300} title={r.t} titleColor={[C.pink, C.lav, C.amber, C.mint][i]} tag={`0${i + 1}`} p={s(1, i * 10, POP)}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 33, lineHeight: 1.45, color: C.text, marginTop: 6 }}>{r.d}</div>
        </Win>
      ))}
    </Slide>
  );
};

/* Порядок у предок/2 */
const Ancestor: React.FC = () => {
  const { s, frame } = useSteps();
  const facts = "батько(андрій, богдан).\nбатько(богдан, василь).";
  return (
    <Slide title="Порядок речень і цілей: предок/2">
      <Code x={96} y={176} size={31} step={0} stagger={6} code={`батько(андрій, богдан).   батько(богдан, василь).`} />
      <Win x={96} y={260} w={556} h={600} title="правильно" titleColor={C.mint} border={C.mint} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 29, lineHeight: 1.55, color: C.mint, whiteSpace: "pre" }}>
          {"предок(X, Y) :-\n    батько(X, Y).\nпредок(X, Y) :-\n    батько(X, Z),\n    предок(Z, Y)."}
        </div>
        <div style={{ marginTop: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 29, color: C.text, whiteSpace: "pre", opacity: clamp01(s(1, 20)) }}>
          {"?- предок(андрій, X).\nX = богдан ;\nX = василь."}
        </div>
      </Win>
      <Win x={682} y={260} w={556} h={600} title="речення переставлено" titleColor={C.amber} border={C.amber} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 29, lineHeight: 1.55, color: C.mint, whiteSpace: "pre" }}>
          {"предок(X, Y) :-\n    батько(X, Z),\n    предок(Z, Y).\nпредок(X, Y) :-\n    батько(X, Y)."}
        </div>
        <div style={{ marginTop: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 29, color: C.text, whiteSpace: "pre", opacity: clamp01(s(2, 20)) }}>
          {"?- предок(андрій, X).\nX = василь ;\nX = богдан."}
        </div>
        <div style={{ marginTop: 14, fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.amber, opacity: clamp01(s(2, 30)) }}>
          завершується, але відповіді йдуть в іншому порядку
        </div>
      </Win>
      <Win x={1268} y={260} w={556} h={600} title="ліва рекурсія" titleColor={C.red} border={C.red} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 29, lineHeight: 1.55, color: C.mint, whiteSpace: "pre" }}>
          {"предок(X, Y) :-\n    предок(Z, Y),\n    батько(X, Z).\nпредок(X, Y) :-\n    батько(X, Y)."}
        </div>
        <div style={{ marginTop: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 29, color: C.text, whiteSpace: "pre", opacity: clamp01(s(3, 20)) }}>
          {"?- предок(андрій, X)."}
        </div>
        <div style={{ marginTop: 10, fontFamily: F.pixel, fontSize: 20, color: C.red, opacity: s(3, 30) * (frame % 20 < 14 ? 1 : 0.4) }}>LOOP...</div>
        <div style={{ marginTop: 12, fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.red, opacity: clamp01(s(3, 34)) }}>
          рекурсивна ціль стоїть першою в тілі й викликає себе, не просунувшись ні на крок
        </div>
      </Win>
      <At x={96} y={900} w={1720} step={4} size={31} weight={700}>
        Перестановка речень змінює лише порядок відповідей; нескінченну рекурсію спричиняє рекурсивна ціль на початку тіла правила.
      </At>
    </Slide>
  );
};

/* Підсумок */
const POINTS: React.ReactNode[] = [
  <>
    <A>Уніфікація</A> зіставляє запит із фактами й правилами за іменем предиката, кількістю аргументів і їхніми значеннями, прив’язуючи вільні змінні.
  </>,
  <>
    <A>Бектрекінг</A> повертає пошук до останньої точки вибору, відновлює значення змінних і пробує наступне речення – так Prolog перебирає всі розв’язки
    без явних циклів.
  </>,
  <>
    Відсікання <M c={C.red}>!</M> забороняє повертатися за нього: зелене лише прискорює програму, а червоне змінює набір її відповідей.
  </>,
  <>
    Предикати <M>fail</M>, <M>true</M>, <M>repeat</M>, <M>call/1</M>, <M>\+</M> і <M>once/1</M> дають змогу явно керувати пошуком, зокрема будувати цикли через
    невдачу.
  </>,
  <>
    У рекурсивних правилах базовий випадок має йти першим, а рекурсивна ціль – не на початку тіла: інакше рекурсія може ніколи не завершитися.
  </>,
];

const Summary: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Підсумок">
      {POINTS.map((p, i) => {
        const a = s(0, 14 + i * 9, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 110,
              top: 200 + i * 160,
              width: 1690,
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
              opacity: clamp01(a),
              transform: `translateX(${(1 - a) * -30}px)`,
            }}
          >
            <Num n={i + 1} size={46} style={{ marginTop: 2 }} />
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 34, lineHeight: 1.4, color: C.text }}>{p}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "recursion", title: "Рекурсія", steps: [45, 60, 8 * F_GAP + 30, 60], C: Recursion },
  { id: "wrong-order", title: "Базовий випадок спершу", steps: [45, 50, 7 * 15 + 30, 60], C: WrongOrder },
  { id: "recs", title: "Рекомендації", steps: [20, 70], C: Recs },
  { id: "ancestor", title: "предок/2", steps: [30, 50, 50, 60, 60], C: Ancestor },
];
export const summarySlide: SlideDef = { id: "summary", title: "Підсумок", steps: [100], C: Summary };
