/** «تحدي اليوم»: the game shell. Level, mode tabs, today's round (or a practice round), the result. */
import { Component, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toArabicIndic } from '../../../shared/arabic';
import type { GameData } from '../../../shared/gameData';
import { loadGame } from '../data';
import { dailyRound, nibrasBase, practiceRound, suggestLevel, type Round } from '../engine/daily';
import { LEVEL_NAMES, MAX_WRONG, MODE_NAMES, MODES, type Level, type Mode } from '../engine/levels';
import { loadState, recordResult, saveState, visibleStreak, type DailyState } from '../engine/progress';
import { LevelSheet } from './LevelSheet';
import { ResultCard } from './ResultCard';
import { RoundView } from './RoundView';
import { clock, useNow } from './useNow';
import { reportAndFetch, type Stats } from '../stats';

const PLAY_KEY = 'nibras.challenge.play.v1';
interface Play { picks: string[]; startedAt: number; endedAt?: number }
type Plays = { date: string; plays: Record<string, Play> };

const storage = (): Storage | undefined => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};
function loadPlays(date: string): Plays {
  try {
    const p = JSON.parse(storage()?.getItem(PLAY_KEY) ?? 'null') as Plays | null;
    if (p && p.date === date) return p;
  } catch {
    // A broken or blocked store starts the day fresh.
  }
  return { date, plays: {} };
}
function savePlays(p: Plays): void {
  try {
    storage()?.setItem(PLAY_KEY, JSON.stringify(p));
  } catch {
    // Not remembered; the round still plays.
  }
}
const isDone = (round: Round, picks: string[]): { done: boolean; won: boolean } => {
  const won = picks.includes(round.answerId);
  return { won, done: won || picks.filter((p) => p !== round.answerId).length >= MAX_WRONG };
};

export function App() {
  const [data, setData] = useState<GameData | null>(null);
  const [failed, setFailed] = useState(false);
  const load = useCallback(() => {
    setFailed(false);
    loadGame().then(setData, () => setFailed(true));
  }, []);
  useEffect(load, [load]);
  return (
    <Boundary>
      {data ? <Game data={data} /> : <Loading failed={failed} retry={load} />}
    </Boundary>
  );
}

function Loading({ failed, retry }: { failed: boolean; retry: () => void }) {
  return (
    <>
      <Header />
      <main className="page">
        {failed ? (
          <div className="error" role="alert">
            <p>الأسئلة ماحمّلتش. اتأكد إنك متصل بالنت وجرّب تاني.</p>
            <button type="button" className="btn gold" onClick={retry}>جرّب تاني</button>
          </div>
        ) : (
          <div className="skeleton" aria-label="بيحمّل الأسئلة"><i /><i /><i /><i /></div>
        )}
      </main>
    </>
  );
}

function Header({ children, below }: { children?: ReactNode; below?: ReactNode }) {
  return (
    <header className="hdr">
      <div className="hdr-bar">
        <a className="brand" href={nibrasBase()} title="افتح نبراس">نِبْرَاس<small>تحدي اليوم</small></a>
        {children}
      </div>
      {below}
    </header>
  );
}

function Game({ data }: { data: GameData }) {
  const { today, left } = useNow();
  const [state, setState] = useState<DailyState>(() => loadState(storage(), today));
  const [plays, setPlays] = useState<Plays>(() => loadPlays(today));
  const [mode, setMode] = useState<Mode>('who');
  const [practice, setPractice] = useState<{ round: Round; play: Play } | null>(null);
  const [sheet, setSheet] = useState(state.level === null);
  const [toast, setToast] = useState<string | null>(null);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const level: Level = state.level ?? 'easy';
  const [stats, setStats] = useState<Record<string, Stats | null>>({});

  // A new Cairo day while the page is open: fresh rounds.
  useEffect(() => {
    if (plays.date !== today) {
      setPlays({ date: today, plays: {} });
      setState((s) => loadState({ getItem: () => JSON.stringify(s) }, today));
    }
  }, [today, plays.date]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const rounds = useMemo(() => Object.fromEntries(MODES.map((m) => [m, dailyRound(data, m, level, today)])) as Record<Mode, Round>, [data, level, today]);
  const key = (m: Mode): string => `${level}:${m}`;
  const playOf = (m: Mode): Play => plays.plays[key(m)] ?? { picks: [], startedAt: Date.now() };
  const statusOf = (m: Mode) => isDone(rounds[m], playOf(m).picks);

  const round = practice ? practice.round : rounds[mode];
  const play = practice ? practice.play : playOf(mode);
  const { done, won } = isDone(round, play.picks);
  const seconds = Math.round(((play.endedAt ?? Date.now()) - play.startedAt) / 1000);
  const streak = visibleStreak(state.streaks[level], today);
  const doneToday = MODES.filter((m) => statusOf(m).done).length;
  const nextMode = MODES.find((m) => m !== mode && !statusOf(m).done) ?? null;

  const pick = (id: string): void => {
    if (done) return;
    const picks = [...play.picks, id];
    const status = isDone(round, picks);
    const next: Play = { ...play, picks, ...(status.done ? { endedAt: Date.now() } : {}) };
    if (practice) {
      setPractice({ round, play: next });
      return;
    }
    const updated = { date: today, plays: { ...plays.plays, [key(mode)]: next } };
    setPlays(updated);
    savePlays(updated);
    if (status.done) {
      const s = recordResult(state, { date: today, puzzle: round.puzzle, mode, level, won: status.won, attempts: picks.length, seconds: Math.round(((next.endedAt ?? 0) - next.startedAt) / 1000) });
      setState(s);
      saveState(storage(), s);
    }
  };
  const setLevel = (l: Level, fromResult: boolean): void => {
    const s = { ...state, level: l };
    setState(s);
    saveState(storage(), s);
    setSheet(false);
    setPractice(null);
    if (state.level !== null) setToast(`مستواك دلوقتي «${LEVEL_NAMES[l].name}» في كل الأوضاع. تقدر تغيّره من فوق في أي وقت.`);
    if (fromResult) setMode(MODES.find((m) => !s.results[`${l}:${m}`]) ?? 'who');
  };
  const startPractice = (): void => {
    const m = practice?.round.mode ?? mode;
    setPractice({ round: practiceRound(data, m, level, rounds[m].questionId), play: { picks: [], startedAt: Date.now() } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleTheme = (): void => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try {
      storage()?.setItem('nibras.challenge.theme', next ? 'dark' : 'light');
    } catch {
      // Not remembered.
    }
  };
  const suggestion = done && !practice ? suggestLevel(level, won, play.picks.length, seconds) : null;
  const statsKey = `${today}:${level}:${mode}`;
  // A finished daily round: add it (once per browser, the database ignores repeats) and read today's totals.
  useEffect(() => {
    if (practice || !done || statsKey in stats) return;
    setStats((s) => ({ ...s, [statsKey]: null }));
    reportAndFetch({ date: today, level, mode, questionId: round.questionId, won, attempts: play.picks.length, seconds }).then((st) => setStats((s) => ({ ...s, [statsKey]: st })));
  }, [practice, done, statsKey, stats, today, level, mode, round.questionId, won, play.picks.length, seconds]);

  return (
    <>
      <Header
        below={
          <>
            <div className="hdr-sub">
              <span>{streak > 0 ? `${toArabicIndic(streak)} ${streak === 1 ? 'يوم' : 'أيام'} ورا بعض` : 'ابدأ سلسلة أيامك النهارده'}</span>
              <span>السؤال الجاي بعد <b>{clock(left)}</b></span>
            </div>
            <nav className="tabs" role="tablist" aria-label="الأوضاع">
              {MODES.map((m) => {
                const s = statusOf(m);
                return (
                  <button key={m} type="button" role="tab" className="tab" aria-selected={!practice && m === mode} onClick={() => { setPractice(null); setMode(m); }}>
                    {MODE_NAMES[m].tab}
                    {s.done && <span className={`mark ${s.won ? 'won' : 'lost'}`}>{s.won ? '✓' : '✕'}</span>}
                  </button>
                );
              })}
              {practice && <button type="button" role="tab" className="tab" aria-selected>تدريب</button>}
            </nav>
          </>
        }
      >
        <div className="hdr-tools">
          <button type="button" className="chip" onClick={() => setSheet(true)} aria-label={state.level ? `المستوى: ${LEVEL_NAMES[level].name}. غيّره` : 'اختار مستواك'}>{state.level ? LEVEL_NAMES[level].name : 'اختار مستواك'}</button>
          <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={dark ? 'الوضع الفاتح' : 'الوضع الغامق'}>{dark ? '☀' : '☾'}</button>
        </div>
      </Header>
      <main className="page">
        {practice && <div className="banner">جولة تدريب: العب براحتك، مش بتتحسب في الأيام ورا بعض.</div>}
        <RoundView key={`${round.questionId}:${practice ? 'p' : 'd'}`} round={round} picks={play.picks} done={done} won={won} onPick={pick} />
        {done && (
          <ResultCard
            round={round}
            picks={play.picks.length}
            won={won}
            practice={Boolean(practice)}
            streak={streak}
            doneToday={doneToday}
            totalModes={MODES.length}
            left={left}
            suggestion={suggestion}
            stats={practice ? null : (stats[statsKey] ?? null)}
            nextMode={practice ? null : nextMode}
            onLevel={(l) => setLevel(l, true)}
            onNext={(m) => { setMode(m); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onPractice={startPractice}
          />
        )}
        <p className="foot">الأسئلة كلها من محتوى <a href={nibrasBase()}>نبراس</a>: خريطة وخط زمني للسيرة النبوية والتاريخ الإسلامي المبكر.</p>
      </main>
      {sheet && <LevelSheet first={state.level === null} current={state.level} onPick={(l) => setLevel(l, false)} onClose={() => setSheet(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="page error" role="alert">
        <p>حصلت مشكلة في اللعبة. حمّل الصفحة تاني.</p>
        <button type="button" className="btn gold" onClick={() => window.location.reload()}>حمّل تاني</button>
      </main>
    );
  }
}
