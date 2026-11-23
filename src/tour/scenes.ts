/**
 * The tour cards' small moving drawings (Phase 7, «كروت بالرسم»): a miniature of the screen and a
 * finger doing the thing, one per step id. Static markup, no user text, styled and animated in
 * tour.css (classes under .tc-scene, every color a --tc-* token). Each loops every 4 s.
 */
const dots = (on = 3): string =>
  [12, 24, 36, 48, 60, 72, 84].map((x, k) => `<i style="right:${x}%"${k === on ? ' class="on"' : ''}></i>`).join('');
const base = (extra = ''): string =>
  `<div class="h"></div><div class="mp"><div class="ld"></div></div><div class="tl">${dots()}</div>${extra}`;
const finger = (top: number, right: number, delay = 0): string =>
  `<span class="rp a-rip" style="top:${top}%;right:calc(${right}% - 13px);animation-delay:${delay}s"></span>` +
  `<span class="f a-tap" style="top:${top - 4}%;right:calc(${right}% - 22px);animation-delay:${delay}s">👆</span>`;
const sheet = (inner: string, open = true): string =>
  `<div class="h"></div><div class="pn${open ? ' open' : ' a-up'}"><span class="tx t" style="top:8px;right:10px">غزوة بدر</span>${inner}</div>`;
const lines = (top: number): string => `<span class="ln" style="top:${top}px;width:70%"></span><span class="ln" style="top:${top + 12}px;width:55%"></span>`;
const plain = (inner: string): string => `<div class="h"></div><div class="pg">${inner}</div>`;
const chips = (labels: string[], at: (k: number) => string, glow = -1): string =>
  labels.map((o, k) => `<span class="bub box${k === glow ? ' a-good' : ''}" style="${at(k)}">${o}</span>`).join('');

export const SCENES: Record<string, () => string> = {
  welcome: () => base('<span class="pin" style="top:46%;left:44%"></span><span class="pin alt" style="top:38%;left:60%"></span><span class="bub dark a-in" style="top:30%;right:12%">خريطة + خط زمني</span>'),
  timeline: () => base(`<span class="er" style="right:3%;width:40%"></span>${finger(84, 51)}<span class="pin a-in" style="top:46%;left:44%"></span>`),
  map: () =>
    '<div class="h"></div><div class="mp a-zoom"><div class="ld"></div><span class="pin" style="top:50%;left:46%"></span></div><div class="tl"></div>' +
    '<span class="f a-pinch" style="top:44%;right:44%;--dx:14px;--dy:-14px">👆</span><span class="f a-pinch" style="top:56%;right:60%;--dx:-14px;--dy:14px">👇</span>',
  territories: () =>
    base(`<span class="bub box" style="top:20%;left:6px">الدول ▾</span>${finger(24, 86)}<span class="rg green a-in" style="top:34%;right:30%;width:34%;height:30%"></span><span class="rg red a-in" style="top:24%;left:12%;width:30%;height:26%"></span>`),
  panel: () => base(`<span class="pin" style="top:46%;left:44%"></span>${finger(48, 56)}<div class="pn a-up"><span class="tx t" style="top:8px;right:10px">غزوة بدر</span>${lines(28)}<span class="tx note" style="bottom:8px;right:10px">المصادر ↓</span></div>`),
  listen: () =>
    sheet(`<span class="bub dark" style="top:32px;right:10px">▶ اسمع</span>${[0, 1, 2, 3, 4].map((k) => `<span class="wv" style="top:36px;right:${78 + k * 9}px;animation-delay:${k * 0.12}s"></span>`).join('')}${lines(66)}`) + finger(30, 16),
  people: () =>
    sheet(`${chips(['حمزة', 'علي', 'أبو عبيدة'], (k) => `top:34px;right:${[10, 66, 110][k]}px`)}<span class="card a-in" style="top:62px;right:10px;left:10px;height:44px"><span class="tx t" style="top:6px;right:8px">حمزة بن عبد المطلب</span><span class="ln" style="top:28px;right:8px;width:60%"></span></span>`) + finger(34, 14),
  quran: () => sheet('<span class="frame a-in" style="top:34px;right:16px;left:16px;height:62px"><span class="tx ayah">﴿ ··· ﴾</span><span class="tx note ref">آل عمران · ١٢٣</span></span>'),
  video: () =>
    `<div class="h"></div><div class="vd">${[0, 1, 2, 3, 4, 5].map((k) => `<span class="sq ally a-walk" style="top:${30 + (k % 3) * 18}%;right:${18 + Math.floor(k / 3) * 10}%;animation-delay:${k * 0.1}s"></span>`).join('')}` +
    `${[0, 1, 2].map((k) => `<span class="sq foe" style="top:${32 + k * 18}%;left:16%"></span>`).join('')}<span class="bub cap" style="bottom:8px;right:8px">ترجمة بالعربي</span></div>`,
  search: () =>
    base('<span class="sb" style="top:22%;right:8%;left:8%;height:16%"><span class="tx t typing">بدر|</span><span class="tx" style="top:50%;left:10px;transform:translateY(-50%)">⌕</span></span><span class="card a-in" style="top:42%;right:8%;left:8%;height:16%"><span class="tx" style="top:50%;right:10px;transform:translateY(-50%)">غزوة بدر الكبرى · ٢ هـ</span></span>'),
  chat: () => plain('<span class="bub dark" style="top:12px;left:10px">كام واحد كانوا في بدر؟</span><span class="bub box wrap a-in" style="top:44px;right:10px;width:70%">الإجابة من محتوى نبراس…<br><span class="src">المصدر ↗</span></span>'),
  dark: () => `<div class="a-dark" style="inset:0">${base()}</div><span class="f a-spin" style="top:-2px;left:8px;font-size:18px">☀️</span>`,
  challenge: () => plain(`<span class="tx t center" style="top:8px">مين الشخصية دي؟</span>${chips(['بلال بن رباح', 'أبو هريرة', 'سلمان الفارسي'], (k) => `top:${32 + k * 24}px;right:24px;left:24px`, 0)}`) + finger(36, 50),
  level: () => plain(chips(['لسه ببتدي', 'عارف شوية', 'أستاذ فيها'], (k) => `top:${14 + k * 30}px;right:30px;left:30px`, 1)) + finger(52, 50),
  modes: () =>
    `<div class="h"></div><div class="pg chrome"><div class="row a-walk">${['من أكون؟', 'المعركة', 'المكان', 'السنة', 'الرقم', 'القائد'].map((m, k) => `<span class="bub${k === 0 ? ' gold' : ' ghost'}">${m}</span>`).join('')}</div><span class="tx t center light" style="top:60px">سؤال جديد في كل لعبة</span></div>`,
  tries: () =>
    plain(`${[0, 1, 2].map((k) => `<span class="try${k < 2 ? ' a-miss' : ' a-good'}" style="right:${62 + k * 42}px;animation-delay:${k < 2 ? k * 0.8 : 0}s">${k < 2 ? '✗' : '✓'}</span>`).join('')}<span class="bub box clue a-in" style="top:76px;right:30px;left:30px">💡 دليل جديد</span>`),
  cards: () =>
    plain('<span class="card miss" style="top:12px;right:16px;left:16px;height:96px"><span class="tx red" style="top:8px;right:10px">✗ غلط · أبو بكر الصديق</span><span class="ln" style="top:32px;width:80%"></span><span class="ln" style="top:44px;width:60%"></span><span class="bub gold a-in" style="bottom:8px;right:10px;left:10px">اعرف أكتر في نبراس ‹</span></span>'),
  share: () => plain('<span class="tx center big" style="top:14px">🟥🟥🟩</span><span class="bub dark" style="top:52px;right:60px;left:60px">شارك مع صحابك</span><span class="f a-fly" style="top:46px;left:40px">✈️</span>'),
  board: () =>
    plain(`${[[2, 50], [1, 74], [3, 36]].map(([r, h], k) => `<span class="pod${r === 1 ? ' first' : ''} a-rise" style="right:${44 + k * 54}px;--hh:${h}px;animation-delay:${k * 0.2}s">${r.toLocaleString('ar-EG')}</span>`).join('')}<span class="f" style="top:4px;right:106px">🏆</span>`),
  save: () => plain('<span class="bub box" style="top:18px;right:40px;left:40px">G  سجّل بجوجل</span><span class="tx center a-in" style="top:62px">🔥 سلسلتك ٧ أيام · محفوظة</span>') + finger(30, 50),
};

/** The drawing for a step, or the welcome drawing for a step without one. */
export const sceneHtml = (id: string): string => (SCENES[id] ?? SCENES.welcome)();
