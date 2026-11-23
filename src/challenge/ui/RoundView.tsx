/**
 * One round: the question and its clues, the three tries, and the options. A picked option
 * grows in place into a card: right or wrong, a Nibras line about it, the comparison tiles,
 * and «اعرف أكتر عن …» into its page (direction approved 2026-11-22).
 */
import { useState } from 'react';
import { toArabicIndic } from '../../../shared/arabic';
import { cluesOpen, type Option, type Round } from '../engine/daily';
import { TRIES, WRONG_PER_CLUE } from '../engine/levels';


interface Props {
  round: Round;
  picks: string[];
  done: boolean;
  won: boolean;
  onPick: (id: string) => void;
  /** A card's «اعرف أكتر» was opened (counted by Umami). */
  onNibras: () => void;
}

export function RoundView({ round, picks, done, won, onPick, onNibras }: Props) {
  const wrong = picks.filter((p) => p !== round.answerId);
  const shown = done ? round.clues.length : cluesOpen(round.level, wrong.length, round.clues.length);
  // Wrong picks until the next clue opens; 0 when none is left or the round ends first.
  const toClue = WRONG_PER_CLUE - (wrong.length % WRONG_PER_CLUE);
  const nextClueIn = shown < round.clues.length && !done && wrong.length + toClue < TRIES ? toClue : 0;
  const order = round.mode === 'order';

  return (
    <section aria-labelledby="q-title">
      <div className="ask">
        <h1 id="q-title">{round.prompt}</h1>
        <p>{order ? 'اضغط على الأحداث من الأقدم للأحدث، وبعدين «اتأكد من الترتيب».' : `${round.clues.length ? 'اقرا الدليل و' : ''}اختار إجابة من الخمسة، وكل اختيار هيقولك صح ولا غلط ومعلومة عنه.`}</p>
      </div>
      {round.clues.length > 0 && (
        <div className="clues">
          {round.clues.slice(0, shown).map((c) => (
            <div className="clue" key={c}>{c}</div>
          ))}
        </div>
      )}
      <Tries round={round} picks={picks} won={won} done={done} />
      {nextClueIn > 0 && <p className="clue-btn" role="status">دليل تاني بعد {nextClueIn === 1 ? 'غلطة كمان' : 'غلطتين'}</p>}
      {order ? (
        <>
          <OrderBoard round={round} picks={picks} done={done} onSubmit={onPick} />
          {wrong.length > 0 && (
            <div className="cards" aria-live="polite">
              {[...wrong].reverse().map((attempt, i) => (
                <article key={attempt} className="pc no">
                  <div className="pc-top">
                    <h3 className="pc-name">المحاولة {toArabicIndic(wrong.length - i)}</h3>
                    <span className="verdict no">✗ غلط</span>
                  </div>
                  <Tiles round={round} id={attempt} />
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="cards" role="group" aria-label="الاختيارات" aria-live="polite">
          {round.options.map((o) => {
            const picked = picks.includes(o.id);
            const isAnswer = o.id === round.answerId;
            if (picked || (done && isAnswer)) return <Card key={o.id} round={round} option={o} picked={picked} onNibras={onNibras} />;
            return (
              <button key={o.id} type="button" className="opt" disabled={done} onClick={() => onPick(o.id)}>
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

/** The three tries: numbered circles that turn ✗ or ✓, and a line that counts down. */
function Tries({ round, picks, won, done }: { round: Round; picks: string[]; won: boolean; done: boolean }) {
  const left = TRIES - picks.length;
  const say = won ? 'عرفتها!' : done ? 'خلصت محاولاتك' : left === TRIES ? `معاك ${toArabicIndic(TRIES)} محاولات بس` : left === 1 ? 'دي آخر محاولة!' : (left === 2 ? 'فاضلّك محاولتين' : `فاضلّك ${toArabicIndic(left)} محاولات`);
  return (
    <div className={`tries${left === 1 && !done ? ' last' : ''}`} role="status" aria-label={`المحاولات: ${toArabicIndic(picks.length)} من ${toArabicIndic(TRIES)}. ${say}`}>
      <div className="tries-dots" aria-hidden="true">
        {Array.from({ length: TRIES }, (_, i) => {
          const p = picks[i];
          const right = p === round.answerId;
          return <span key={i} className={p ? (right ? 'won' : 'used') : ''}>{p ? (right ? '✓' : '✗') : toArabicIndic(i + 1)}</span>;
        })}
      </div>
      <b>{say}</b>
    </div>
  );
}

function Card({ round, option: o, picked, onNibras }: { round: Round; option: Option; picked: boolean; onNibras: () => void }) {
  const yes = o.id === round.answerId;
  return (
    <article className={`pc ${yes ? 'yes' : 'no'}`}>
      <div className="pc-top">
        <h3 className="pc-name">{o.label}</h3>
        <span className={`verdict ${yes ? 'yes' : 'no'}`}>{!picked ? 'دي الإجابة' : yes ? '✓ صح' : '✗ غلط'}</span>
      </div>
      {o.tag && <div className="pc-tag">{o.tag}</div>}
      {o.about && <p className="pc-about">{o.about}</p>}
      {!yes && <Tiles round={round} id={o.id} />}
      {o.link && (
        <a className={`cta${yes ? '' : ' ghost'}`} href={o.link} target="_blank" rel="noopener" onClick={onNibras}>
          اعرف أكتر عن {o.label}
          <Arrow />
        </a>
      )}
    </article>
  );
}

/** What a wrong pick teaches: a tile per fact, named, then its sentence. */
function Tiles({ round, id }: { round: Round; id: string }) {
  const t = round.teach(id);
  return (
    <>
      <div className="tiles" style={{ gridTemplateColumns: `repeat(${t.cells.length}, minmax(0, 1fr))` }} aria-label="مقارنة بالإجابة">
        {t.cells.map((c, j) => (
          <div key={j} className={`tile ${c.mark}`}>
            <span>{c.text}</span>
            {c.sub && <span className="tile-sub">{c.sub}</span>}
            <small>{round.heads[j]}</small>
          </div>
        ))}
      </div>
      {t.sentence && <p className="say">{t.sentence}</p>}
    </>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

/** «رتّب الأحداث»: tap the events in order into four slots, then check. */
function OrderBoard({ round, picks, done, onSubmit }: { round: Round; picks: string[]; done: boolean; onSubmit: (attempt: string) => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const label = (id: string): string => round.options.find((o) => o.id === id)?.label ?? id;
  const answer = round.answerId.split(',');
  const slots = done ? answer : chosen;
  const pool = round.options.filter((o) => !chosen.includes(o.id));
  const submit = (): void => {
    const attempt = chosen.join(',');
    if (picks.includes(attempt)) return;
    onSubmit(attempt);
    setChosen([]);
  };
  return (
    <div>
      <div className="order" role="list" aria-label="ترتيبك">
        {[0, 1, 2, 3].map((i) => (
          <button key={i} type="button" role="listitem" className={`slot${slots[i] ? '' : ' empty'}`} disabled={done || !slots[i]} onClick={() => setChosen(chosen.filter((x) => x !== slots[i]))}>
            <b>{'١٢٣٤'[i]}</b>
            {slots[i] ? label(slots[i]) : 'اضغط على حدث من تحت'}
          </button>
        ))}
      </div>
      {!done && (
        <>
          <div className="pool">
            {pool.map((o) => (
              <button key={o.id} type="button" className="opt" onClick={() => setChosen([...chosen, o.id])}>{o.label}</button>
            ))}
          </div>
          <div className="order-actions">
            <button type="button" className="btn gold" style={{ flex: 1 }} disabled={chosen.length < 4} onClick={submit}>اتأكد من الترتيب</button>
            <button type="button" className="btn" disabled={!chosen.length} onClick={() => setChosen([])}>امسح</button>
          </div>
        </>
      )}
    </div>
  );
}
