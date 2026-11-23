/** «تحدي اليوم»: the game shell. Level, mode tabs, today's round (or a practice round), the result. */
import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toArabicIndic } from '../../../shared/arabic';
import type { GameData } from '../../../shared/gameData';
import { loadGame } from '../data';
import { dailyRound, nibrasBase, practiceRound, suggestLevel, type Round } from '../engine/daily';
import { LEVEL_NAMES, MODE_NAMES, MODES, type Level, type Mode } from '../engine/levels';
import { isDone, mergeIntoLocal, type AccountResult, type Play, type Plays } from '../engine/account';
import { loadState, recordResult, saveState, visibleStreak, type DailyState } from '../engine/progress';
import { LevelSheet } from './LevelSheet';
import { ResultCard } from './ResultCard';
import { RoundView } from './RoundView';
import { clock, useNow } from './useNow';
import { reportAndFetch, type Stats } from '../stats';
import { trackChallenge } from '../analytics';
import { useAccount } from '../account/useAccount';
import { SaveOffer } from './account/SaveOffer';
import { NameSheet, NewPasswordSheet, SignInSheet } from './account/Sheets';
import { showGame, useHashView } from './account/useHashView';
import '../account.css';

// The account pages load when first opened, so a guest's round page stays as light as before.
const BoardView = lazy(() => import('./account/BoardView').then((m) => ({ default: m.BoardView })));
const AccountView = lazy(() => import('./account/AccountView').then((m) => ({ default: m.AccountView })));
const PrivacyView = lazy(() => import('./account/PrivacyView').then((m) => ({ default: m.PrivacyView })));

const PLAY_KEY = 'nibras.challenge.play.v1';

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
  const view = useHashView();
  const [signIn, setSignIn] = useState(false);
  const getPlays = useCallback(() => loadPlays(today), [today]);
  // After every sign-in: the account's days and today's rounds folded into the local state.
  const onResults = useCallback((results: AccountResult[]) => setState((s) => {
    const merged = mergeIntoLocal(s, results, today);
    saveState(storage(), merged);
    return merged;
  }), [today]);
  const account = useAccount(today, getPlays, onResults);
  const failedSignIn = account.state.status === 'guest' && Boolean(account.state.failed);
  useEffect(() => {
    if (failedSignIn) setSignIn(true);
  }, [failedSignIn]);
  // Signed in (or on to the name step): the sign-in sheet is done, and must not come back by itself.
  const pastSignIn = account.state.status !== 'guest' && account.state.status !== 'off' && account.state.status !== 'loading';
  useEffect(() => {
    if (pastSignIn) setSignIn(false);
  }, [pastSignIn]);
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
    const counted = { mode: round.mode, level: round.level, practice: Boolean(practice) };
    if (play.picks.length === 0) trackChallenge('challenge_round_started', counted);
    if (status.done) {
      trackChallenge('challenge_round_finished', { ...counted, picks: picks.length, solved: status.won });
      // The end (share, today's cards) comes into view once the card has grown.
      window.setTimeout(() => document.getElementById('end')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
    }
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
      account.report({ date: today, level, mode, picks, seconds: Math.round(((next.endedAt ?? 0) - next.startedAt) / 1000), won: status.won, questionId: round.questionId });
    }
  };
  const setLevel = (l: Level, fromResult: boolean): void => {
    if (l !== state.level) trackChallenge('challenge_level_changed', { from: state.level ?? 'none', to: l, via: state.level === null ? 'first' : fromResult ? 'suggestion' : 'sheet' });
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
    trackChallenge('challenge_practice_started', { mode: m, level });
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
                  <button key={m} type="button" role="tab" className="tab" aria-selected={!view && !practice && m === mode} onClick={() => { showGame(); setPractice(null); setMode(m); }}>
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
          {account.state.status !== 'off' && (
            <>
              <a className="icon-btn" href="#board" aria-label="لوحة الصدارة" aria-current={view === 'board' ? 'page' : undefined}><TrophyIcon /></a>
              <a className="icon-btn" href="#account" aria-label={account.state.status === 'ready' ? `حسابي: ${account.state.name}` : 'حسابي'} aria-current={view === 'account' ? 'page' : undefined}><PersonIcon /></a>
            </>
          )}
          <button type="button" className="chip" onClick={() => setSheet(true)} aria-label={state.level ? `المستوى: ${LEVEL_NAMES[level].name}. غيّره` : 'اختار مستواك'}>{state.level ? LEVEL_NAMES[level].name : 'اختار مستواك'}</button>
          <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={dark ? 'الوضع الفاتح' : 'الوضع الغامق'}>{dark ? '☀' : '☾'}</button>
        </div>
      </Header>
      {view ? (
        <main className="page">
          <Boundary>
            <Suspense fallback={<div className="skeleton" aria-label="بيحمّل"><i /><i /><i /></div>}>
              {view === 'board' && <BoardView level={level} account={account.state} token={account.token} onSignIn={() => setSignIn(true)} />}
              {view === 'account' && <AccountView account={account} today={today} onSignIn={() => setSignIn(true)} />}
              {view === 'privacy' && <PrivacyView />}
            </Suspense>
          </Boundary>
        </main>
      ) : (
      <main className={`page${done ? ' docked' : ''}`}>
        {practice && <div className="banner">جولة تدريب: العب براحتك، مش بتتحسب في الأيام ورا بعض.</div>}
        <RoundView key={`${round.questionId}:${practice ? 'p' : 'd'}`} round={round} picks={play.picks} done={done} won={won} onPick={pick} onNibras={() => trackChallenge('challenge_nibras_opened', { mode: round.mode, level: round.level, from: 'card' })} />
        {done && (
          <ResultCard
            round={round}
            picked={play.picks}
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
            onNibras={(from) => trackChallenge('challenge_nibras_opened', { mode: round.mode, level: round.level, from })}
            after={practice ? null : <SaveOffer state={account.state} streak={streak} onSignIn={() => setSignIn(true)} />}
          />
        )}
        <p className="foot">الأسئلة كلها من محتوى <a href={nibrasBase()}>نبراس</a>: خريطة وخط زمني للسيرة النبوية والتاريخ الإسلامي المبكر.</p>
      </main>
      )}
      {sheet && <LevelSheet first={state.level === null} current={state.level} onPick={(l) => setLevel(l, false)} onClose={() => setSheet(false)} />}
      {signIn && account.state.status === 'guest' && <SignInSheet account={account} failed={account.state.failed} onClose={() => setSignIn(false)} />}
      {account.state.status === 'needs-name' && <NameSheet error={account.state.error} onSubmit={account.chooseName} onCancel={() => void account.signOut()} />}
      {account.state.status === 'new-password' && <NewPasswordSheet onSubmit={account.newPassword} />}
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

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h3v1a4 4 0 0 1-4 4M7 6H4v1a4 4 0 0 0 4 4" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
