import { TourStep } from '../types/tour';

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'مرحباً بك في نبراس',
    content: 'نبراس هو تطبيق تفاعلي لاستكشاف التاريخ الإسلامي المبكر من خلال الخرائط والخطوط الزمنية. دعنا نأخذك في جولة سريعة للتعرف على مميزات التطبيق.',
    position: 'center',
    spotlightPadding: 0,
    disableInteraction: true
  },
  {
    id: 'timeline',
    target: '[data-tour-id="timeline"]',
    title: 'الخط الزمني',
    content: 'يعرض الخط الزمني الأحداث مرتبة زمنياً من عام 571م إلى 661م. يمكنك النقر على أي حدث لعرض تفاصيله على الخريطة.',
    position: 'top',
    spotlightPadding: 10,
    action: {
      type: 'click',
      description: 'انقر على أي حدث في الخط الزمني'
    }
  },
  {
    id: 'map',
    target: '[data-tour-id="map-container"]',
    title: 'الخريطة التفاعلية',
    content: 'هذه هي الخريطة التفاعلية التي تعرض مواقع الأحداث التاريخية. يمكنك التكبير والتصغير والتنقل بحرية. انقر على أي علامة لعرض تفاصيل الحدث.',
    position: 'right',
    spotlightPadding: 10,
    action: {
      type: 'click',
      description: 'انقر على علامة في الخريطة لعرض التفاصيل'
    }
  },
  {
    id: 'search',
    target: '[data-tour-id="search-button"]',
    title: 'البحث والتصفية',
    content: 'استخدم زر البحث للوصول إلى خيارات البحث والتصفية المتقدمة. يمكنك البحث عن أحداث، صحابة، أو مواقع محددة.',
    position: 'bottom',
    spotlightPadding: 8,
    action: {
      type: 'click',
      target: '[data-tour-id="search-button"]',
      description: 'انقر لفتح قائمة البحث'
    }
  },
  {
    id: 'filters',
    target: '[data-tour-id="filters-section"]',
    title: 'خيارات التصفية',
    content: 'يمكنك تصفية الأحداث حسب الفترة الزمنية (العهد المكي، المدني، الخلافة الراشدة) أو حسب النوع (أحداث، معارك، مدن).',
    position: 'left',
    spotlightPadding: 10,
    beforeShow: async () => {
      try {
        const searchButton = document.querySelector('[data-tour-id="search-button"]') as HTMLElement;
        if (searchButton && !document.querySelector('[data-tour-id="filters-section"]')) {
          searchButton.click();
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // Verify the filters section appeared
          const filtersSection = document.querySelector('[data-tour-id="filters-section"]');
          if (!filtersSection) {
            console.warn('Filters section did not appear after clicking search button');
          }
        }
      } catch (error) {
        console.error('Error in filters step beforeShow:', error);
      }
    },
    afterShow: async () => {
      try {
        // Close the search menu by clicking the backdrop or close button
        const filtersSection = document.querySelector('[data-tour-id="filters-section"]');
        if (filtersSection) {
          // Try to find and click the X button in the search menu
          const closeButton = document.querySelector('[aria-label="إغلاق القائمة"]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
            await new Promise(resolve => setTimeout(resolve, 400));
          }
        }
      } catch (error) {
        console.error('Error in filters step afterShow:', error);
      }
    }
  },
  {
    id: 'dark-mode',
    target: '[data-tour-id="dark-mode-toggle"]',
    title: 'الوضع الداكن',
    content: 'يمكنك التبديل بين الوضع الفاتح والداكن حسب تفضيلاتك. الوضع الداكن مريح للعينين في الإضاءة المنخفضة.',
    position: 'bottom',
    spotlightPadding: 8,
    beforeShow: async () => {
      try {
        // Ensure search menu is closed
        const filtersSection = document.querySelector('[data-tour-id="filters-section"]');
        if (filtersSection) {
          const closeButton = document.querySelector('[aria-label="إغلاق القائمة"]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
            await new Promise(resolve => setTimeout(resolve, 400));
            
            // Verify the menu closed
            const stillOpen = document.querySelector('[data-tour-id="filters-section"]');
            if (stillOpen) {
              console.warn('Search menu did not close as expected');
            }
          }
        }
      } catch (error) {
        console.error('Error in dark-mode step beforeShow:', error);
      }
    }
  },
  {
    id: 'event-details',
    target: '[data-tour-id="event-panel"]',
    title: 'تفاصيل الأحداث',
    content: 'الآن سنختار حدثاً لنريك كيف تظهر التفاصيل. ستظهر لوحة على الجانب تحتوي على: الوصف الكامل، التاريخ، الموقع، الصحابة المشاركين، والآيات القرآنية المرتبطة.',
    position: 'left',
    spotlightPadding: 10,
    beforeShow: async () => {
      try {
        // First, ensure search menu is closed
        const filtersSection = document.querySelector('[data-tour-id="filters-section"]');
        if (filtersSection) {
          const closeButton = document.querySelector('[aria-label="إغلاق القائمة"]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
            await new Promise(resolve => setTimeout(resolve, 400));
          }
        }
        
        // Then select the first event from timeline (they are divs with role="button", not actual buttons)
        const timelineEvents = document.querySelectorAll('[data-tour-id="timeline"] [role="button"]');
        if (timelineEvents.length > 0) {
          const firstEvent = timelineEvents[0] as HTMLElement;
          firstEvent.click();
          
          // Wait longer for the event panel animation to complete and become visible
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Wait for event panel to be visible with retry logic
          let retries = 0;
          const maxRetries = 10;
          while (retries < maxRetries) {
            const eventPanel = document.querySelector('[data-tour-id="event-panel"]') as HTMLElement;
            if (eventPanel) {
              const rect = eventPanel.getBoundingClientRect();
              const isVisible = rect.width > 0 && rect.height > 0 &&
                               rect.top < window.innerHeight && rect.bottom > 0;
              if (isVisible) {
                break;
              }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
          }
          
          if (retries >= maxRetries) {
            console.warn('Event panel did not become visible after clicking timeline event');
          }
        } else {
          console.warn('No timeline events found to select');
        }
      } catch (error) {
        console.error('Error in event-details step beforeShow:', error);
      }
    },
    afterShow: async () => {
      try {
        // Close event panel when moving to next step
        const closeButton = document.querySelector('[data-tour-id="event-panel"] button[title="إغلاق"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error('Error in event-details step afterShow:', error);
      }
    }
  },
  {
    id: 'navigation-tips',
    target: 'body',
    title: 'نصائح للتنقل',
    content: 'يمكنك التنقل بحرية بين الخريطة والخط الزمني. استخدم البحث للوصول السريع إلى أحداث محددة، أو تصفح الأحداث زمنياً. جرب النقر على الأحداث المختلفة لاستكشاف التاريخ!',
    position: 'center',
    spotlightPadding: 0,
    disableInteraction: true
  },
  {
    id: 'complete',
    target: 'body',
    title: 'انتهت الجولة',
    content: 'الآن أنت جاهز لاستكشاف التاريخ الإسلامي المبكر! يمكنك إعادة الجولة في أي وقت من الزر العائم في الزاوية السفلية اليسرى. نتمنى لك تجربة ممتعة ومفيدة.',
    position: 'center',
    spotlightPadding: 0,
    disableInteraction: true
  }
];

