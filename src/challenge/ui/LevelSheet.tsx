/** The level picker: opens on the first visit, and from the header any time after. */
import { useEffect, useRef } from 'react';
import { LEVEL_NAMES, LEVELS, type Level } from '../engine/levels';

interface Props {
  first: boolean;
  current: Level | null;
  onPick: (level: Level) => void;
  onClose: () => void;
}

export function LevelSheet({ first, current, onPick, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('.lv')?.focus();
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && !first) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [first, onClose]);
  return (
    <div className="sheet-wrap" onClick={(e) => e.target === e.currentTarget && !first && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="lv-title" ref={ref}>
        <div className="kicker">{first ? 'أهلًا بيك في تحدي نبراس' : 'غيّر مستواك'}</div>
        <h2 id="lv-title">إنت قد إيه عارف؟</h2>
        <p className="sub">اختار المستوى اللي يناسبك، والأسئلة هتبقى على قدّه في كل الأوضاع. كل مستوى ليه أسئلته وأيامه ورا بعض، وتقدر تغيّره في أي وقت.</p>
        {LEVELS.map((l, i) => (
          <button key={l} type="button" className="lv" aria-pressed={l === current} onClick={() => onPick(l)}>
            <b aria-hidden="true">{'١٢٣'[i]}</b>
            <span>
              <strong>{LEVEL_NAMES[l].name}</strong>
              <small>{LEVEL_NAMES[l].desc}</small>
            </span>
          </button>
        ))}
        {!first && <button type="button" className="link-btn" onClick={onClose}>رجوع</button>}
      </div>
    </div>
  );
}
