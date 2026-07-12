import { TourStep } from '../types/tour';
import { queryVisibleTourTarget } from '../utils/tour';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clickIfPresent = async (selector: string, delayAfter = 300) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return false;
  el.click();
  await wait(delayAfter);
  return true;
};

/** Close any open panels (search menu + event panel) before a step runs. */
const closeAllPanels = async () => {
  await clickIfPresent('[aria-label="إغلاق القائمة"]');
  await clickIfPresent('[data-tour-id="event-panel"] button[title="إغلاق"]');
};

/** Close only the search menu — used by event-details, which needs the event panel to stay open. */
const closeSearchMenu = async () => {
  await clickIfPresent('[aria-label="إغلاق القائمة"]');
};

/** Wait until the given selector's first visible match reports non-zero size, up to `timeout` ms. */
const waitForVisible = async (selector: string, timeout = 1200) => {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    if (queryVisibleTourTarget(selector)) return true;
    await wait(80);
  }
  return false;
};

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'مرحباً بك في نبراس',
    content:
      'نِبراس تطبيق تفاعلي لاستكشاف التاريخ الإسلامي المبكر عبر الخريطة والخط الزمني. سنأخذك في جولة قصيرة للتعرّف على أهم مميزاته.',
    position: 'center',
    spotlightPadding: 0,
    disableInteraction: true,
  },
  {
    id: 'timeline',
    target: '[data-tour-id="timeline"]',
    title: 'الخط الزمني',
    content:
      'يعرض الخط الزمني الأحداث مرتّبةً من عام 571م إلى 661م. انقر على أي حدث لعرض موقعه وتفاصيله على الخريطة.',
    position: 'top',
    spotlightPadding: 10,
    action: { type: 'click', description: 'انقر على أي حدث في الخط الزمني' },
  },
  {
    id: 'map',
    target: '[data-tour-id="map-container"]',
    title: 'الخريطة التفاعلية',
    content:
      'تعرض الخريطة مواقع الأحداث التاريخية. يمكنك التكبير والتصغير والتنقّل بحرية، ثم النقر على أي علامة لعرض تفاصيل الحدث.',
    position: 'right',
    spotlightPadding: 10,
    action: { type: 'click', description: 'انقر على أي علامة في الخريطة' },
  },
  {
    id: 'search',
    target: '[data-tour-id="search-button"]',
    title: 'البحث والتصفية',
    content:
      'من هنا تفتح قائمة البحث والتصفية المتقدّمة، وتستطيع البحث عن الأحداث والصحابة والمواقع.',
    position: 'bottom',
    spotlightPadding: 8,
    action: { type: 'click', target: '[data-tour-id="search-button"]', description: 'انقر لفتح قائمة البحث' },
  },
  {
    id: 'filters',
    target: '[data-tour-id="filters-section"]',
    title: 'خيارات التصفية',
    content:
      'يمكنك تصفية الأحداث حسب الفترة الزمنية (عصر النبي ﷺ أو الخلفاء الراشدين) أو حسب نوع المحتوى (الأحداث فقط أو المعارك فقط).',
    position: 'left',
    spotlightPadding: 10,
    beforeShow: async () => {
      await closeAllPanels();
      if (document.querySelector('[data-tour-id="filters-section"]')) return;
      const searchBtn = queryVisibleTourTarget('[data-tour-id="search-button"]');
      if (!searchBtn) return;
      searchBtn.click();
      await waitForVisible('[data-tour-id="filters-section"]');
    },
    afterShow: closeSearchMenu,
  },
  {
    id: 'dark-mode',
    target: '[data-tour-id="dark-mode-toggle"]',
    title: 'الوضع الداكن',
    content:
      'يمكنك التبديل بين الوضع الفاتح والوضع الداكن حسب تفضيلك. الوضع الداكن أكثر راحةً للعين في الإضاءة المنخفضة.',
    position: 'bottom',
    spotlightPadding: 8,
  },
  {
    id: 'event-details',
    target: '[data-tour-id="event-panel"]',
    title: 'تفاصيل الحدث',
    content:
      'سنفتح لك حدثاً كمثال. تعرض اللوحة الجانبية: الوصف الكامل، والتاريخ، والموقع، والصحابة المشاركين، والآيات القرآنية المرتبطة بالحدث.',
    position: 'left',
    spotlightPadding: 10,
    beforeShow: async () => {
      await closeSearchMenu();
      // Match BOTH desktop (`<div role="button" data-event-id>`) and mobile
      // (`<motion.button data-event-id>`) timeline events. The prior selector
      // used only `[role="button"]`, which mobile doesn't set — leaving the
      // step invisible under ~640px because EventPanel never opened.
      const first = document.querySelector<HTMLElement>('[data-tour-id="timeline"] [data-event-id]');
      if (!first) return;
      first.click();
      await waitForVisible('[data-tour-id="event-panel"]', 1500);
    },
    afterShow: async () => {
      await clickIfPresent('[data-tour-id="event-panel"] button[title="إغلاق"]');
    },
  },
  {
    id: 'navigation-tips',
    target: 'body',
    title: 'نصائح للتنقل',
    content:
      'انتقل بحرية بين الخريطة والخط الزمني. استخدم البحث للوصول السريع إلى أحداث بعينها، أو تصفّح الأحداث زمنياً. جرّب النقر على الأحداث المختلفة لاستكشاف التاريخ.',
    position: 'center',
    spotlightPadding: 0,
    disableInteraction: true,
  },
  {
    id: 'complete',
    target: 'body',
    title: 'انتهت الجولة',
    content:
      'أنت الآن جاهز لاستكشاف التاريخ الإسلامي المبكر. تستطيع إعادة الجولة في أي وقت بالضغط على زر "ابدأ الجولة" في شريط الأدوات. نتمنى لك تجربةً ممتعةً ومفيدة.',
    position: 'center',
    spotlightPadding: 0,
    disableInteraction: true,
  },
];

export { closeAllPanels };
