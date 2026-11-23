/**
 * The tour as illustrated cards (Phase 7, direction «كروت بالرسم», Mostafa 2026-11-23): a sheet
 * slides up with one card per step (a moving drawing, a title, one line read out loud). On a first
 * visit the first card asks; «وريني 🔊» is the tap that lets the browser play sound, «من غير صوت»
 * shows the text only. Swipe or «اللي بعده» / «رجوع»; «وريني فين» lowers the sheet and lights the
 * real thing on the page for a moment. Escape or «اقفل الجولة» closes it. A card whose recording is
 * missing or stale shows its text and plays nothing. Shared by Nibras and «تحدي اليوم».
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Tour, TourStep } from '../../shared/tours';
import { tourClipUrl } from '../../shared/tours';
import { sceneHtml } from './scenes';
import './tour.css';

const MUTED_KEY = 'nibras.tour.muted';
const readMuted = (): boolean => {
  try { return localStorage.getItem(MUTED_KEY) === '1'; } catch { return false; }
};
const writeMuted = (muted: boolean): void => {
  try { localStorage.setItem(MUTED_KEY, muted ? '1' : '0'); } catch { /* storage off: the choice lasts this visit */ }
};

export interface TourCardsProps {
  tour: Tour;
  /** Where the recordings are served, ending in `/` (Nibras's `audio/`). */
  audioBase: string;
  /** `ask`: a first visit, the first card asks. `play`: opened from the tour button (that tap allows sound). */
  start: 'ask' | 'play';
  /** `done` after the last card, `skip` when closed early or declined. */
  onClose: (how: 'done' | 'skip') => void;
  /** Gets the page ready for «وريني فين» (e.g. opens an event for a step inside the event panel). */
  prepare?: (step: TourStep) => Promise<void> | void;
}

/** The first element carrying `data-tour-id` (or its phone twin, `<id>-compact`) that is on screen. */
function findTarget(id: string): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>(`[data-tour-id="${id}"], [data-tour-id="${id}-compact"]`)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

export function TourCards({ tour, audioBase, start, onClose, prepare }: TourCardsProps) {
  const [phase, setPhase] = useState<'ask' | 'play'>(start);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(readMuted);
  const [said, setSaid] = useState(1); // the share of the line already said, 0–1
  const [ring, setRing] = useState<DOMRect | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const x0 = useRef<number | null>(null);
  const step = tour.steps[index];
  const last = index === tour.steps.length - 1;
  const titleId = `tc-title-${tour.id}`;

  // Plays the card's recording, if it has a fresh one; the words light up as it is said.
  useEffect(() => {
    audio.current?.pause();
    const url = tourClipUrl(audioBase, tour.id, step);
    if (phase !== 'play' || muted || !url) { setSaid(1); return; }
    const el = new Audio(url);
    audio.current = el;
    setSaid(0);
    const onTime = () => setSaid(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => setSaid(1);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    el.addEventListener('error', onEnd);
    el.play().catch(onEnd); // blocked or failed: the text is already there
    return () => { el.pause(); el.removeEventListener('timeupdate', onTime); el.removeEventListener('ended', onEnd); el.removeEventListener('error', onEnd); };
  }, [phase, muted, index, step, audioBase, tour.id]);

  const close = useCallback((how: 'done' | 'skip') => { audio.current?.pause(); onClose(how); }, [onClose]);
  const go = useCallback((delta: 1 | -1) => {
    if (delta === 1 && last) { close('done'); return; }
    setIndex((i) => Math.min(tour.steps.length - 1, Math.max(0, i + delta)));
  }, [last, close, tour.steps.length]);

  const begin = (withSound: boolean) => {
    setMuted(!withSound);
    writeMuted(!withSound);
    setPhase('play');
  };
  const toggleSound = () => { setMuted((m) => { writeMuted(!m); return !m; }); };

  const showWhere = async () => {
    if (!step.target) return;
    await prepare?.(step);
    // The page may need a moment to open what the step points at (an event's details load on demand).
    for (let i = 0; i < 40; i++) {
      const el = findTarget(step.target);
      if (el) {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        setRing(el.getBoundingClientRect());
        window.setTimeout(() => setRing(null), 2400);
        return;
      }
      await new Promise((r) => window.setTimeout(r, 100));
    }
  };

  // Keys: Escape closes; the arrows move between cards (right is back in Arabic).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close('skip'); }
      else if (e.key === 'Tab') {
        // Focus stays inside the tour (the top buttons and the sheet).
        const all = [...document.querySelectorAll<HTMLElement>('.tc-root button')];
        const at = all.indexOf(document.activeElement as HTMLElement);
        if (all.length && (at === -1 || (e.shiftKey ? at === 0 : at === all.length - 1))) {
          e.preventDefault();
          all[e.shiftKey ? all.length - 1 : 0].focus();
        }
      }
      else if (phase === 'play' && e.key === 'ArrowLeft') go(1);
      else if (phase === 'play' && e.key === 'ArrowRight') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go, phase]);

  // Focus moves into the sheet (again when the first card starts playing) and back where it was
  // when the tour closes.
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    return () => before?.focus?.();
  }, []);
  useEffect(() => {
    sheet.current?.querySelector<HTMLElement>('.tc-btn.go')?.focus();
  }, [phase]);

  const words = step.text.split(/\s+/);
  const lit = Math.ceil(said * words.length);
  const sound = phase === 'play' && !muted && !!step.clip;

  return (
    <div className="tc-root" data-phase={phase} data-testid={`tour-${tour.id}`}>
      <div className="tc-shade" hidden={!!ring} onClick={() => close('skip')} aria-hidden="true" />
      {ring && <div className="tc-ring" style={{ top: ring.top - 6, left: ring.left - 6, width: ring.width + 12, height: ring.height + 12 }} />}
      <div
        ref={sheet}
        className={`tc-sheet${ring ? ' away' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onPointerDown={(e) => { x0.current = e.clientX; }}
        onPointerUp={(e) => {
          if (phase !== 'play' || x0.current === null) return;
          const dx = e.clientX - x0.current;
          x0.current = null;
          if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1);
        }}
      >
        <div className="tc-head">
          {phase === 'play' ? (
            <button type="button" className="tc-icon" onClick={toggleSound} aria-label={muted ? 'شغّل الصوت' : 'اكتم الصوت'} title={muted ? 'شغّل الصوت' : 'اكتم الصوت'}>{muted ? '🔈' : '🔇'}</button>
          ) : <span />}
          <span className="tc-grab" aria-hidden="true" />
          <button type="button" className="tc-icon" onClick={() => close('skip')} aria-label="اقفل الجولة" title="اقفل الجولة">✕</button>
        </div>
        <div className="tc-scene" aria-hidden="true" dangerouslySetInnerHTML={{ __html: sceneHtml(step.id) }} />
        <h2 id={titleId}>
          {sound && <span className="tc-wave" aria-hidden="true"><i /><i /><i /><i /></span>}
          {phase === 'ask' ? tour.steps[0].title : step.title}
        </h2>
        {phase === 'ask' ? (
          <>
            <p className="tc-line">{tour.ask}</p>
            <div className="tc-row">
              <button type="button" className="tc-btn" onClick={() => close('skip')}>مش دلوقتي</button>
              <button type="button" className="tc-btn" onClick={() => begin(false)}>من غير صوت</button>
              <button type="button" className="tc-btn go" onClick={() => begin(true)}>وريني 🔊</button>
            </div>
          </>
        ) : (
          <>
            <p className={`tc-line${sound ? '' : ' all'}`} aria-live="polite">
              {words.map((w, i) => <span key={i} className={`w${i < lit ? ' said' : ''}`}>{w} </span>)}
            </p>
            <div className="tc-dots" role="img" aria-label={`كارت ${(index + 1).toLocaleString('ar-EG')} من ${tour.steps.length.toLocaleString('ar-EG')}`}>
              {tour.steps.map((s, i) => <i key={s.id} className={i === index ? 'on' : ''} />)}
            </div>
            <div className="tc-row">
              {index > 0 && <button type="button" className="tc-btn" onClick={() => go(-1)}>رجوع</button>}
              {step.target && <button type="button" className="tc-btn link" onClick={showWhere}>وريني فين</button>}
              <button type="button" className="tc-btn go" onClick={() => go(1)}>{last ? 'يلا نبدأ ✓' : 'اللي بعده ‹'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TourCards;
