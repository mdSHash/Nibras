/** One round: the question and its clues, the options, and a row of tiles for every wrong pick. */
import { useState } from 'react';
import { cluesOpen, type Round } from '../engine/daily';
import { MAX_WRONG } from '../engine/levels';

interface Props {
  round: Round;
  picks: string[];
  done: boolean;
  won: boolean;
  onPick: (id: string) => void;
}

export function RoundView({ round, picks, done, won, onPick }: Props) {
  const wrong = picks.filter((p) => p !== round.answerId);
  const shown = done ? round.clues.length : cluesOpen(round.level, wrong.length, round.clues.length);
  const label = (id: string): string => round.options.find((o) => o.id === id)?.label ?? id;
  const link = (id: string): string | undefined => round.options.find((o) => o.id === id)?.link;
  const cols = { gridTemplateColumns: `${round.heads.length > 2 ? '1.25fr' : '1.6fr'} repeat(${round.heads.length}, 1fr)` };
  const nextClueIn = shown < round.clues.length && !done ? 2 - (wrong.length % 2) : 0;

  return (
    <section aria-labelledby="q-title">
      <div className="ask">
        <h1 id="q-title">{round.prompt}</h1>
        <p>{round.mode === 'order' ? 'دوس على الأحداث بالترتيب، وبعدين اتأكد.' : `${round.clues.length ? 'اقرا الدليل و' : ''}اختار واحد من الخمسة. كل اختيار غلط بيقولك إيه اللي زيه وإيه اللي مختلف.`}</p>
      </div>
      {round.clues.length > 0 && (
        <div className="clues">
          {round.clues.slice(0, shown).map((c) => (
            <div className="clue" key={c}>{c}</div>
          ))}
        </div>
      )}
      {round.mode === 'order' ? (
        <OrderBoard round={round} picks={picks} done={done} onSubmit={onPick} />
      ) : (
        <div className="opts" role="group" aria-label="الاختيارات">
          {round.options.map((o) => {
            const picked = picks.includes(o.id);
            const isAnswer = o.id === round.answerId;
            const cls = done && isAnswer ? (won ? 'opt right' : 'opt reveal') : 'opt';
            return (
              <button key={o.id} type="button" className={cls} disabled={done || picked} aria-pressed={picked} onClick={() => onPick(o.id)}>
                {o.label}
              </button>
            );
          })}
        </div>
      )}
      {!done && (
        <div className="picks" aria-label={`غلطات: ${wrong.length} من ${MAX_WRONG}`}>
          {Array.from({ length: MAX_WRONG }, (_, i) => <i key={i} className={i < wrong.length ? 'used' : ''} />)}
        </div>
      )}
      {nextClueIn > 0 && <p className="clue-btn" role="status">دليل تاني بعد {nextClueIn === 1 ? 'غلطة كمان' : 'غلطتين'}</p>}
      {wrong.length > 0 && (
        <div className="grid" aria-live="polite">
          <div className="heads" style={cols}>
            <span>{round.mode === 'order' ? 'محاولة' : 'اختيارك'}</span>
            {round.heads.map((h) => <span key={h}>{h}</span>)}
          </div>
          {[...wrong].reverse().map((id, i) => {
            const t = round.teach(id);
            const href = link(id);
            return (
              <div key={id + i} className="row" style={cols}>
                <div className="cell name">
                  {round.mode === 'order' ? `#${wrong.length - i}` : href ? <a href={href} target="_blank" rel="noopener" title="اعرف أكتر في نبراس">{label(id)}</a> : label(id)}
                </div>
                {t.cells.map((c, j) => (
                  <div key={j} className={`cell ${c.mark}`}>
                    {c.text}
                    {c.sub && <small>{c.sub}</small>}
                  </div>
                ))}
                {t.sentence && <p className="say">{t.sentence}</p>}
              </div>
            );
          })}
          <div className="legend">
            <span><i style={{ background: 'var(--c-go)' }} />زيه</span>
            <span><i style={{ background: 'var(--c-near)' }} />قريب</span>
            <span><i style={{ background: 'var(--c-miss)' }} />مختلف</span>
          </div>
        </div>
      )}
    </section>
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
            {slots[i] ? label(slots[i]) : 'دوس على حدث من تحت'}
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
