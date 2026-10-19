import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Lead, M, Slide } from "../deck/ui";
import { clamp01, pulse } from "./common";
import { SyntaxBox } from "./kit";
import { Term, Win } from "./retro";

/* Стек цілей */
const STACK_FRAMES = [
  { stack: ["дід(іван, Z)"], binds: [] as string[], note: "запит кладеться в стек" },
  { stack: ["батько(іван, Y)", "батько(Y, Z)"], binds: [], note: "правило дід замінює ціль своїми підцілями" },
  { stack: ["батько(петро, Z)"], binds: ["Y = петро"], note: "верхня ціль доведена фактом" },
  { stack: [], binds: ["Y = петро", "Z = анна"], note: "стек порожній – розв’язок знайдено" },
];
const SF_GAP = 50;

const GoalStack: React.FC = () => {
  const { s, t } = useSteps();
  const k = Math.max(0, Math.min(STACK_FRAMES.length - 1, Math.floor(Math.max(0, t(2, 0)) / SF_GAP)));
  const fr = t(2, 0) >= 0 ? STACK_FRAMES[k] : STACK_FRAMES[0];
  const pop = s(2, k * SF_GAP, POP);
  return (
    <Slide title="Стек цілей">
      <Lead>Prolog кладе ціль у стек цілей і завжди працює з верхньою: знайдене правило замінює її своїми підцілями.</Lead>
      <Code
        x={96}
        y={330}
        size={30}
        step={1}
        stagger={10}
        code={`
          батько(іван, петро).
          батько(петро, анна).
          дід(X, Z) :-
              батько(X, Y), батько(Y, Z).
          ?- дід(іван, Z).
        `}
      />
      <Win x={1000} y={320} w={460} h={460} title="стек цілей" titleColor={C.amber} p={s(1, 20, POP)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {fr.stack.map((g, i) => (
            <div
              key={g}
              style={{
                padding: "12px 16px",
                border: `2.5px solid ${i === 0 ? C.amber : C.cream}`,
                borderRadius: 4,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 29,
                color: i === 0 ? C.amber : C.text,
                background: i === 0 ? "rgba(242,193,78,0.12)" : undefined,
                opacity: clamp01(pop),
                transform: `translateY(${(1 - pop) * -20}px)`,
              }}
            >
              {g}
            </div>
          ))}
          {fr.stack.length === 0 && <div style={{ fontFamily: F.pixel, fontSize: 22, color: C.mint, marginTop: 20 }}>EMPTY ✓</div>}
        </div>
      </Win>
      <Win x={1500} y={320} w={324} h={460} title="зв’язування" titleColor={C.mint} p={s(1, 26, POP)}>
        {fr.binds.map((b) => (
          <div key={b} style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.mint, lineHeight: 1.8 }}>
            {b}
          </div>
        ))}
      </Win>
      <At x={1000} y={800} w={824} step={2} size={29} weight={700} color={C.dim}>
        {fr.note}
      </At>
      <At x={96} y={880} w={1720} step={3} size={32} weight={700}>
        Що глибший стек і що більше зайвих підцілей, то більше роботи й бектрекінгу: порядок правил і підцілей впливає на ефективність.
      </At>
    </Slide>
  );
};

/* Відсікання (!) */
type CNode = { x: number; y: number; label: string };
const CT: CNode[] = [
  { x: 960, y: 360, label: "a" },
  { x: 640, y: 500, label: "a :- b, !, c." },
  { x: 1280, y: 500, label: "a :- d." },
  { x: 440, y: 650, label: "b ✓" },
  { x: 860, y: 650, label: "b (альтернатива)" },
  { x: 440, y: 790, label: "c ✓" },
];
const CE: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [3, 5],
];
const PRUNED = [2, 4];

const Cut: React.FC = () => {
  const { s, t } = useSteps();
  const cut = s(2, 0);
  const scissors = (x: number, y: number, d: number) => {
    const p = s(2, d, POP);
    return (
      <div style={{ position: "absolute", left: x - 24, top: y - 24, fontSize: 44, color: C.red, opacity: clamp01(p), transform: `scale(${mix(0.4, 1, p)}) rotate(${(1 - p) * 90}deg)` }}>✂</div>
    );
  };
  return (
    <Slide title="Відсікання (!)">
      <Lead>
        <A c={C.red}>!</A> забороняє бектрекінг після себе: щойно Prolog пройшов відсікання, альтернативи до нього в цьому правилі відкидаються.
      </Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {CE.map(([a, b], i) => {
          const pr = PRUNED.includes(b);
          return (
            <line
              key={i}
              x1={CT[a].x}
              y1={CT[a].y + 24}
              x2={CT[b].x}
              y2={CT[b].y - 24}
              stroke={pr ? (cut > 0.5 ? C.red : C.cream) : C.cream}
              strokeWidth={3}
              strokeDasharray={pr && cut > 0.5 ? "8 8" : undefined}
              opacity={clamp01(s(1, 6 + i * 5)) * (pr ? mix(1, 0.6, cut) : 1)}
            />
          );
        })}
      </svg>
      {CT.map((n, i) => {
        const pr = PRUNED.includes(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x - 160,
              top: n.y - 24,
              width: 320,
              height: 48,
              border: `2.5px solid ${pr && cut > 0.5 ? C.red : i === 3 || i === 5 ? C.mint : C.cream}`,
              borderRadius: 4,
              background: "rgba(20,18,10,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 28,
              color: pr && cut > 0.5 ? C.red : C.text,
              textDecoration: pr && cut > 0.5 ? "line-through" : undefined,
              opacity: clamp01(s(1, i * 5, POP)) * (pr ? mix(1, 0.55, cut) : 1),
            }}
          >
            {n.label}
          </div>
        );
      })}
      {scissors((CT[1].x + CT[4].x) / 2 + 10, (CT[1].y + CT[4].y) / 2, 6)}
      {scissors((CT[0].x + CT[2].x) / 2 + 10, (CT[0].y + CT[2].y) / 2, 14)}
      <At x={96} y={880} w={1720} step={3} size={32} weight={700}>
        Відсікання підвищує ефективність, обмежує простір пошуку й дає змогу керувати логікою програми.
      </At>
      {t(2, 0) >= 0 && (
        <At x={1100} y={640} w={640} step={2} delay={20} size={30} weight={700} color={C.red}>
          після ! ці гілки вже не розглядаються
        </At>
      )}
    </Slide>
  );
};

/* Зелене і червоне відсікання */
const GreenRed: React.FC = () => {
  const { s } = useSteps();
  const items = (arr: string[], color: string, step: number) =>
    arr.map((it, i) => (
      <div key={it} style={{ display: "flex", gap: 14, fontFamily: F.body, fontWeight: 700, fontSize: 35, lineHeight: 1.4, color: C.text, marginBottom: 24, opacity: clamp01(s(step, 10 + i * 8)) }}>
        <span style={{ color, fontFamily: F.pixel, fontSize: 18, marginTop: 6 }}>●</span>
        <span>{it}</span>
      </div>
    ));
  return (
    <Slide title="Зелене і червоне відсікання">
      <Win x={96} y={210} w={850} h={500} title="Зелене відсікання" titleColor={C.mint} border={C.mint} p={s(1, 0, POP)}>
        {items(["Використовується для підвищення ефективності.", "Не змінює поведінку програми: відповіді ті самі.", "Програма просто працює швидше."], C.mint, 1)}
      </Win>
      <Win x={974} y={210} w={850} h={500} title="Червоне відсікання" titleColor={C.red} border={C.red} p={s(2, 0, POP)}>
        {items(["Змінює поведінку програми.", "Без нього програма повертала б інші результати.", "Керує логікою, обмежує пошук.", "Дає «ранній вихід» із предиката."], C.red, 2)}
      </Win>
      <At x={96} y={780} w={1720} step={3} size={34} weight={700}>
        Перевірка проста: приберіть відсікання. Якщо набір відповідей не змінився – воно зелене, якщо змінився – червоне.
      </At>
    </Slide>
  );
};

/* Зелене відсікання: факторіал */
const GreenCut: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Зелене відсікання: факторіал">
      <Win x={96} y={190} w={850} h={420} title="без відсікання" titleColor={C.amber} p={s(1, 0, POP)} pad="16px 22px">
        <Code
          x={0}
          y={0}
          size={29}
          step={1}
          delay={6}
          stagger={4}
          style={{ position: "relative" }}
          code={`
            factorial(0, 1).
            factorial(N, Result) :-
                N > 0,
                Prev is N - 1,
                factorial(Prev, PrevResult),
                Result is N * PrevResult.
          `}
        />
      </Win>
      <Win x={974} y={190} w={850} h={420} title="із зеленим відсіканням" titleColor={C.mint} border={C.mint} p={s(2, 0, POP)} pad="16px 22px">
        <Code
          x={0}
          y={0}
          size={29}
          step={2}
          delay={6}
          stagger={4}
          style={{ position: "relative" }}
          code={`
            factorial(0, 1) :- !.
            factorial(N, Result) :-
                N > 0,
                Prev is N - 1,
                factorial(Prev, PrevResult),
                Result is N * PrevResult.
          `}
        />
      </Win>
      <Term
        x={96}
        y={626}
        w={850}
        h={256}
        step={3}
        p={s(3, 0, POP)}
        size={30}
        lines={[
          { text: "?- factorial(0, R).", at: 0 },
          { text: "R = 1 ;", at: 26 },
          { text: "false.", at: 50, color: C.amber },
        ]}
      />
      <Term
        x={974}
        y={626}
        w={850}
        h={256}
        step={3}
        p={s(3, 6, POP)}
        size={30}
        lines={[
          { text: "?- factorial(0, R).", at: 6 },
          { text: "R = 1.", at: 32 },
        ]}
      />
      <At x={96} y={910} w={1720} step={4} size={30} weight={700}>
        Відповідь та сама – <M>R = 1</M>. Без відсікання Prolog ще пробує друге правило й марно перевіряє <M>0 &gt; 0</M>; відсікання прибирає цю точку вибору, тому воно зелене.
      </At>
    </Slide>
  );
};

/* Червоне відсікання: дільники */
const RedCut: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Червоне відсікання: дільники">
      <SyntaxBox x={96} y={200} w={1000} step={1} size={26} lines={["between({Low}, {High}, {X})   % X перебирає Low, Low+1, …, High"]} />
      <Code
        x={96}
        y={330}
        size={31}
        step={1}
        delay={20}
        stagger={10}
        code={`
          дільник(N, D) :- between(2, N, D), 0 is N mod D.
          перший_дільник(N, D) :- between(2, N, D), 0 is N mod D, !.
        `}
      />
      <Term
        x={96}
        y={470}
        w={850}
        h={340}
        step={2}
        p={s(2, 0, POP)}
        size={30}
        lines={[
          { text: "?- дільник(12, D).", at: 0 },
          { text: "D = 2 ; D = 3 ; D = 4 ;", at: 26 },
          { text: "D = 6 ; D = 12.", at: 46 },
        ]}
      />
      <Term
        x={974}
        y={470}
        w={850}
        h={340}
        step={3}
        p={s(3, 0, POP)}
        size={30}
        lines={[
          { text: "?- перший_дільник(12, D).", at: 0 },
          { text: "D = 2.", at: 26, color: C.red },
        ]}
      />
      <At x={96} y={860} w={1720} step={4} size={32} weight={700}>
        Без відсікання – усі дільники, з ним – лише перший. Відсікання змінило набір відповідей, тому воно <A c={C.red}>червоне</A>.
      </At>
    </Slide>
  );
};

/* Коли використовують відсікання */
const USES = [
  { t: "Обмеження результатів", c: "first_solution(X) :-\n    some_predicate(X), !." },
  { t: "Унікальність", c: "unique_solution(X) :-\n    once(some_predicate(X))." },
  { t: "Певний порядок", c: "approach(X) :- condition(X),\n    !, method_one(X).\napproach(X) :- method_two(X)." },
  { t: "Обробка виключень", c: "factorial(0, 1) :- !." },
  { t: "Оптимізація", c: "is_even(X) :-\n    0 is X mod 2, !." },
];

const CutUses: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Коли використовують відсікання">
      {USES.map((u, i) => {
        const row = i < 2 ? 0 : 1;
        const col = i < 2 ? i : i - 2;
        const w = row === 0 ? 850 : 556;
        const x = row === 0 ? 96 + col * 878 : 96 + col * 586;
        return (
          <Win key={u.t} x={x} y={200 + row * 360} w={w} h={320} title={u.t} titleColor={[C.pink, C.lav, C.amber, C.mint, C.orange][i]} tag={`0${i + 1}`} p={s(1, i * 10, POP)}>
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, lineHeight: 1.6, color: C.mint, whiteSpace: "pre" }}>{u.c}</div>
          </Win>
        );
      })}
    </Slide>
  );
};

/* ! і once/1 */
const CutOnce: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="! і once/1">
      <Win x={96} y={200} w={850} h={430} title="!" titleColor={C.red} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, lineHeight: 1.45, color: C.text }}>
          Обрізає всі попередні точки бектрекінгу в поточному правилі. Сильніше впливає на логіку програми й може дати несподівані результати.
        </div>
        <div style={{ marginTop: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 29, color: C.mint, whiteSpace: "pre" }}>{"?- member(X, [a, b, c]), !.\nX = a."}</div>
      </Win>
      <Win x={974} y={200} w={850} h={430} title="once/1" titleColor={C.lav} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, lineHeight: 1.45, color: C.text }}>
          Виконує ціль-аргумент і повертає лише перший розв’язок. Явно показує, що саме виконується один раз, тому передбачуваніший.
        </div>
        <div style={{ marginTop: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 29, color: C.mint, whiteSpace: "pre" }}>{"?- once(member(X, [a, b, c])).\nX = a."}</div>
      </Win>
      <At x={96} y={700} w={1720} step={3} size={34} weight={700}>
        Обидва обмежують бектрекінг, але <M>once/1</M> діє лише на свій аргумент, а <M c={C.red}>!</M> – на все правило до місця відсікання.
      </At>
    </Slide>
  );
};

/* Вбудовані предикати керування */
const CTRL = [
  { p: "fail/0", d: "завжди хибний: явно завершує гілку невдачею", ex: "?- fail.   false." },
  { p: "true/0", d: "завжди істинний і нічого не робить", ex: "?- true.   true." },
  { p: "repeat/0", d: "істинний і знову істинний при кожному поверненні", ex: "repeat, …, умова, !" },
  { p: "call/1", d: "викликає ціль, передану як аргумент", ex: "?- call(member(X, [1])).  X = 1." },
  { p: "\\+/1, not/1", d: "успіх, якщо ціль-аргумент не вдається", ex: "?- \\+ member(d, [a, b]).  true." },
];

const CtrlPreds: React.FC = () => {
  const { s } = useSteps();
  const COLS = [130, 450, 1150];
  return (
    <Slide title="Вбудовані предикати керування">
      {CTRL.map((r, i) => {
        const p = s(1, i * 10, POP);
        return (
          <div
            key={r.p}
            style={{
              position: "absolute",
              left: 96,
              top: 190 + i * 132,
              width: 1728,
              height: 112,
              border: `2.5px solid ${C.cream}`,
              borderRadius: 6,
              background: "rgba(20,18,10,0.25)",
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            <div style={{ position: "absolute", left: COLS[0] - 96, top: 0, height: 112, display: "flex", alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.pink }}>{r.p}</div>
            <div style={{ position: "absolute", left: COLS[1] - 96, width: 660, top: 0, height: 112, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text, lineHeight: 1.3 }}>{r.d}</div>
            <div style={{ position: "absolute", left: COLS[2] - 96, top: 0, height: 112, display: "flex", alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.mint, whiteSpace: "pre" }}>{r.ex}</div>
          </div>
        );
      })}
      <At x={96} y={870} w={1720} step={2} size={32} weight={700}>
        <M>true</M> при поверненні просто не дає нових варіантів, а <M>repeat</M> щоразу знову вдається – тому стає точкою повернення для циклів.
      </At>
    </Slide>
  );
};

/* Цикл, керований невдачею */
const ITEMS = [1, 2, 3];
const LOOP_GAP = 40;

const FailLoop: React.FC = () => {
  const { s, t } = useSteps();
  const k = Math.floor(Math.max(0, t(2, 0)) / LOOP_GAP);
  const phase = (Math.max(0, t(2, 0)) % LOOP_GAP) / LOOP_GAP;
  const done = k >= ITEMS.length;
  const hl = done ? 4 : phase < 0.3 ? 0 : phase < 0.6 ? 1 : 2;
  return (
    <Slide title="Цикл, керований невдачею">
      <Lead>Prolog не має звичних циклів: fail змушує повернутися до member, і той видає наступний елемент.</Lead>
      <Code
        x={96}
        y={320}
        size={30}
        step={1}
        stagger={10}
        code={`
          друкувати_все(L) :-
              member(X, L), write(X), nl, fail.
          друкувати_все(_).
          ?- друкувати_все([1, 2, 3]).
        `}
      />
      {t(2, 0) >= 0 && (
        <div style={{ position: "absolute", left: 96, top: 580, display: "flex", gap: 22, alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30 }}>
          {["member(X, L)", "write(X), nl", "fail"].map((g, i) => (
            <span
              key={g}
              style={{
                padding: "10px 18px",
                border: `2.5px solid ${i === 2 ? C.red : C.cream}`,
                borderRadius: 4,
                color: i === 2 ? C.red : C.text,
                background: hl === i ? (i === 2 ? "rgba(239,107,107,0.25)" : "rgba(242,193,78,0.2)") : undefined,
                boxShadow: hl === i ? `0 0 20px ${i === 2 ? C.red : C.amber}` : undefined,
              }}
            >
              {g}
            </span>
          ))}
          <span style={{ color: C.amber, fontSize: 30, position: "absolute", left: 0, top: 80, whiteSpace: "nowrap" }}>{done ? "member вичерпано → друге речення" : `X = ${ITEMS[k]}`}</span>
        </div>
      )}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: t(2, 0) >= 0 && !done ? 1 : 0 }}>
        <path d="M 600 640 Q 400 760 200 640" fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="8 8" />
        <polygon points="190,635 206,630 202,646" fill={C.red} />
      </svg>
      <Term
        x={1280}
        y={330}
        w={544}
        h={420}
        step={2}
        p={s(2, 0, POP)}
        lines={[
          ...ITEMS.map((v, i) => ({ text: `${v}`, at: i * LOOP_GAP + 16, color: C.text })),
          { text: "true.", at: ITEMS.length * LOOP_GAP + 6, color: C.mint },
        ]}
      />
      <At x={96} y={860} w={1720} step={3} size={32} weight={700}>
        Коли member вичерпає список, перше речення не вдається, і друге – <M>друкувати_все(_)</M> – завершує запит успіхом.
      </At>
    </Slide>
  );
};

/* fail для явної невдачі */
const FailExplicit: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="fail і відсікання разом">
      <Win x={96} y={190} w={850} h={520} title="Перевірка кількох умов" titleColor={C.amber} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 29, lineHeight: 1.6, color: C.mint, whiteSpace: "pre" }}>
          {"acceptable(X) :- condition1(X), !.\nacceptable(X) :- condition2(X), !.\nacceptable(_) :- fail."}
        </div>
        <div style={{ marginTop: 22, fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.45, color: C.text }}>
          Якщо condition1 вдається, відсікання зупиняє пошук. Інакше перевіряється condition2. Якщо обидві не виконуються, fail явно завершує предикат невдачею.
        </div>
      </Win>
      <Win x={974} y={190} w={850} h={520} title="Перше число, більше за 10" titleColor={C.lav} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 29, lineHeight: 1.6, color: C.mint, whiteSpace: "pre" }}>
          {"перше_більше_10(X, L) :-\n    member(X, L), X > 10, !.\n\n?- перше_більше_10(X, [3, 15, 7, 20]).\nX = 15."}
        </div>
        <div style={{ marginTop: 22, fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.45, color: C.text }}>
          member перебирає елементи, X &gt; 10 відкидає зайві, а ! зупиняє пошук після першого підходящого.
        </div>
      </Win>
      <At x={96} y={780} w={1720} step={3} size={32} weight={700}>
        Поєднання fail і відсікання дає змогу явно керувати потоком виконання: коли продовжувати пошук, а коли зупинитися.
      </At>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "goal-stack", title: "Стек цілей", steps: [45, 60, STACK_FRAMES.length * SF_GAP + 20, 60], C: GoalStack },
  { id: "cut", title: "Відсікання", steps: [45, 50, 60, 60], C: Cut },
  { id: "green-red", title: "Зелене і червоне", steps: [20, 50, 60, 60], C: GreenRed },
  { id: "green-cut", title: "Зелене відсікання", steps: [20, 50, 50, 90, 60], C: GreenCut },
  { id: "red-cut", title: "Червоне відсікання", steps: [20, 60, 80, 60, 60], C: RedCut },
  { id: "cut-uses", title: "Сценарії відсікання", steps: [20, 70], C: CutUses },
  { id: "cut-once", title: "! і once/1", steps: [20, 40, 40, 60], C: CutOnce },
  { id: "ctrl-preds", title: "Предикати керування", steps: [20, 70, 60], C: CtrlPreds },
  { id: "fail-loop", title: "Цикл через fail", steps: [45, 50, ITEMS.length * LOOP_GAP + 40, 60], C: FailLoop },
  { id: "fail-explicit", title: "fail і відсікання", steps: [20, 50, 50, 60], C: FailExplicit },
];
