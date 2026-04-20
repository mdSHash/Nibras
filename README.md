# نِبْرَاس (Nibras)

**تطبيق تفاعلي للخط الزمني والخريطة للتاريخ الإسلامي**

نِبْرَاس (بمعنى "المصباح" أو "النور" في اللغة العربية) هو تطبيق ويب تفاعلي يُصوّر التاريخ الإسلامي من خلال واجهة خط زمني ديناميكي وخريطة جغرافية. عِش السيرة النبوية والتاريخ الإسلامي المبكر كما لم تختبره من قبل، مع سياق مكاني وزماني يُحيي الأحداث التاريخية.

## نظرة عامة

يوفر نِبْرَاس رحلة غامرة عبر التاريخ الإسلامي من ميلاد النبي محمد صلى الله عليه وسلم إلى نهاية الخلافة الراشدة. يجمع التطبيق بين رسم الخرائط التفاعلية، والتنقل عبر الخط الزمني، والمحتوى التاريخي الغني لإنشاء تجربة تعليمية شاملة.

**الفلسفة:** التاريخ ليس مجرد نص يُقرأ، بل هو "مكان" شهد الأحداث و"زمان" وثّق اللحظات. نِبْرَاس يُنير الزمان والمكان معاً، مما يتيح لك تجربة السيرة النبوية كأنك تشهدها بنفسك.

## المميزات

### خط زمني تفاعلي
- التنقل عبر التاريخ الإسلامي بشكل زمني متسلسل
- تصفية الأحداث حسب الحقبة (الفترة المكية، الفترة المدنية، الخلافة الراشدة)
- عرض الأحداث الكبرى والغزوات مع معلومات تفصيلية
- انتقالات سلسة بين الفترات التاريخية

### تصور خريطة ديناميكية
- حدود إقليمية عضوية باستخدام خوارزميات خلايا فورونوي
- تغييرات إقليمية في الوقت الفعلي تعكس التوسع التاريخي
- علامات المدن ذات الأهمية التاريخية
- حركات كاميرا سلسة إلى مواقع الأحداث
- خريطة تاريخية مخصصة بدون حدود سياسية حديثة

### محتوى تاريخي غني
- أوصاف تفصيلية للأحداث مع مجريات الأحداث
- سير الصحابة مع ملفات تعريف قابلة للبحث
- مراجع قرآنية متعلقة بالأحداث التاريخية
- استشهادات حديثية من مصادر موثوقة
- توثيق المصادر التاريخية

### وظيفة البحث
- البحث عن الصحابة والشخصيات التاريخية
- وصول سريع إلى المعلومات السيرية
- التصفية حسب الاسم أو اللقب أو الكنية

### ملفات الصحابة
- سير شاملة للصحابة رضوان الله عليهم
- تواريخ الميلاد والوفاة
- الأدوار في الأحداث التاريخية
- تنوعات متعددة للأسماء للبحث الدقيق

## التقنيات المستخدمة

### إطار العمل الأمامي
- **React 19** - مكتبة واجهة مستخدم حديثة
- **TypeScript** - تطوير آمن من حيث الأنواع
- **Vite** - أداة بناء سريعة وخادم تطوير

### رسم الخرائط والمعلومات الجغرافية المكانية
- **Leaflet** - عرض خرائط تفاعلية
- **react-leaflet** - مكونات React لـ Leaflet
- **Turf.js** - تحليل جغرافي مكاني متقدم وتوليد خلايا فورونوي
- **use-supercluster** - تجميع فعال للنقاط الجغرافية الكثيفة

### التنسيق والحركة
- **TailwindCSS** - إطار عمل CSS قائم على الأدوات المساعدة
- **Framer Motion** - حركات وانتقالات سلسة

### مكتبات إضافية
- **lucide-react** - مكتبة أيقونات

## التثبيت

### المتطلبات الأساسية
- Node.js (الإصدار 16 أو أعلى)
- مدير حزم npm أو yarn

### تعليمات الإعداد

1. استنساخ المستودع:
```bash
git clone https://github.com/your-username/nibras.git
cd nibras
```

2. تثبيت التبعيات:
```bash
npm install
```

3. بدء خادم التطوير:
```bash
npm run dev
```

سيكون التطبيق متاحاً على `http://localhost:3000`

## هيكل المشروع

```
nibras/
├── src/
│   ├── components/          # مكونات React
│   │   ├── Timeline.tsx     # مكون التنقل عبر الخط الزمني
│   │   ├── Map.tsx          # مكون الخريطة التفاعلية
│   │   ├── EventPanel.tsx   # عرض تفاصيل الحدث
│   │   ├── CompanionModal.tsx  # نافذة سيرة الصحابي
│   │   ├── QuranModal.tsx   # نافذة المرجع القرآني
│   │   ├── QuranRef.tsx     # مكون مرجع القرآن
│   │   ├── SearchMenu.tsx   # وظيفة البحث
│   │   └── IntroScreen.tsx  # شاشة الترحيب
│   ├── data/
│   │   ├── dataList.json    # بيانات الأحداث التاريخية
│   │   ├── quranData.json   # المراجع القرآنية
│   │   ├── companionsList.ts   # بيانات الصحابة الأساسية
│   │   ├── citiesList.ts    # المدن والمواقع
│   │   └── territoriesData.ts  # حدود الأقاليم
│   ├── App.tsx              # مكون التطبيق الرئيسي
│   ├── main.tsx             # نقطة دخول التطبيق
│   ├── types.ts             # تعريفات أنواع TypeScript
│   └── index.css            # أنماط عامة
├── public/
│   └── nibras-icon.svg      # أيقونة التطبيق
├── ADDING_NEW_CONTENT_GUIDE.md  # دليل إضافة المحتوى
├── metadata.json            # بيانات وصفية للمشروع
├── package.json             # التبعيات والنصوص البرمجية
├── tsconfig.json            # تكوين TypeScript
├── vite.config.ts           # تكوين Vite
└── README.md                # هذا الملف
```

## التطوير

### النصوص البرمجية المتاحة

- `npm run dev` - بدء خادم التطوير على المنفذ 3000
- `npm run build` - بناء حزمة الإنتاج
- `npm run preview` - معاينة بناء الإنتاج
- `npm run clean` - إزالة مخرجات البناء
- `npm run lint` - تشغيل فحص أنواع TypeScript

### إضافة محتوى جديد

لإضافة أحداث تاريخية جديدة أو صحابة أو مدن إلى التطبيق، راجع الدليل الشامل:

**[ADDING_NEW_CONTENT_GUIDE.md](./ADDING_NEW_CONTENT_GUIDE.md)**

يغطي الدليل:
- إضافة أحداث تاريخية جديدة بالهيكل الصحيح
- إضافة سير الصحابة
- إضافة المدن والمواقع
- التحقق من صحة البيانات والاختبار
- الأخطاء الشائعة التي يجب تجنبها
- أمثلة كاملة

### هيكل البيانات

#### الأحداث
يتم تخزين الأحداث في [`src/dataList.json`](./src/dataList.json) بالهيكل التالي:
- بيانات وصفية للحدث (المعرف، الفئة، الحقبة، العنوان)
- معلومات التاريخ (هجري وميلادي)
- الموقع مع الإحداثيات
- أوصاف تفصيلية ومجريات الأحداث
- أدوار الصحابة
- مراجع قرآنية وحديثية
- مصادر تاريخية

#### الصحابة
يتم توزيع بيانات الصحابة عبر ملفات متعددة في [`src/`](./src/):
- `companionsList.ts` - الصحابة الأساسيون (الخلفاء الراشدون، العشرة المبشرون بالجنة)
- ملفات صحابة إضافية للسير الموسعة

#### المدن
يتم تخزين بيانات المدن في [`src/citiesList.ts`](./src/citiesList.ts) مع:
- اسم المدينة والإحداثيات
- وصف تاريخي
- الأهمية الدينية والتاريخية

## البناء للإنتاج

لإنشاء بناء إنتاج:

```bash
npm run build
```

سيتم إنشاء الملفات المحسّنة في دليل `dist/`.

لمعاينة بناء الإنتاج محلياً:

```bash
npm run preview
```

## المصادر التاريخية

جميع المحتويات مستمدة من مصادر إسلامية سنية موثوقة:

### المصادر الأساسية
- سيرة ابن هشام (سيرة النبي)
- الرحيق المختوم
- زاد المعاد (ابن القيم)

### المراجع التاريخية
- البداية والنهاية (ابن كثير)
- تاريخ الطبري
- الكامل في التاريخ (ابن الأثير)

### سير الصحابة
- الإصابة في تمييز الصحابة (ابن حجر)
- أسد الغابة (ابن الأثير)
- الاستيعاب (ابن عبد البر)

## المساهمة

المساهمات مرحب بها! عند المساهمة:

1. تأكد من الدقة التاريخية باستخدام مصادر موثوقة
2. اتبع هيكل الكود الحالي واصطلاحات TypeScript
3. اختبر جميع التغييرات بدقة
4. راجع ADDING_NEW_CONTENT_GUIDE.md لإضافات المحتوى
5. حافظ على النبرة المهنية ودقة التطبيق

## الترخيص

حقوق النشر 2026 - تم إنشاؤه بتفانٍ لخدمة التاريخ الإسلامي.

جميع المصادر مستمدة من كتب سنية موثوقة والسيرة النبوية الصحيحة.

## الرؤية والرسالة

**الرؤية:** أن نكون أول مرجع مكاني تفاعلي للمسلمين المعاصرين لاستكشاف السيرة النبوية والتاريخ الإسلامي من خلال أساليب بصرية وتقنية تربط القلوب بأماكن الوحي.

**الرسالة:** توظيف أحدث تقنيات رسم الخرائط التفاعلية لتوثيق أحداث السيرة النبوية وتاريخ الخلفاء الراشدين، وتقديمها خالية من الحدود السياسية الحديثة في عرض تفاعلي عضوي حي، بناءً على أصح المصادر السنية المعتمدة.

---

# English Version

# نِبْرَاس (Nibras)

**Interactive Islamic History Timeline and Map Application**

Nibras (نِبْرَاس - meaning "lamp" or "light" in Arabic) is an interactive web application that visualizes Islamic history through a dynamic timeline and geographical map interface. Experience the Prophetic biography and early Islamic history as never before, with spatial and temporal context that brings historical events to life.

## Overview

Nibras provides an immersive journey through Islamic history from the birth of Prophet Muhammad (peace be upon him) to the end of the Rashidun Caliphate. The application combines interactive mapping, timeline navigation, and rich historical content to create a comprehensive educational experience.

**Philosophy:** History is not merely text to be read, but a "place" that witnessed events and a "time" that documented moments. Nibras illuminates both time and place together, allowing you to experience the Prophetic biography as if you were witnessing it firsthand.

## Features

### Interactive Timeline
- Navigate through Islamic history chronologically
- Filter events by era (Meccan period, Medinan period, Rashidun Caliphate)
- View major events and battles with detailed information
- Smooth transitions between historical periods

### Dynamic Map Visualization
- Organic territorial boundaries using Voronoi cell algorithms
- Real-time territory changes reflecting historical expansion
- City markers with historical significance
- Smooth camera movements to event locations
- Custom historical map without modern political borders

### Rich Historical Content
- Detailed event descriptions with course of events
- Companion biographies with searchable profiles
- Quranic references related to historical events
- Hadith citations from authentic sources
- Historical source documentation

### Search Functionality
- Search for companions and historical figures
- Quick access to biographical information
- Filter by name, title, or aliases

### Companion Profiles
- Comprehensive biographies of Sahaba (companions)
- Birth and death dates
- Roles in historical events
- Multiple name variations for accurate search

## Technology Stack

### Frontend Framework
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Mapping and Geospatial
- **Leaflet** - Interactive map rendering
- **react-leaflet** - React components for Leaflet
- **Turf.js** - Advanced geospatial analysis and Voronoi cell generation
- **use-supercluster** - Efficient clustering for dense geographical points

### Styling and Animation
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### Additional Libraries
- **lucide-react** - Icon library

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/nibras.git
cd nibras
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nibras/
├── src/
│   ├── components/          # React components
│   │   ├── Timeline.tsx     # Timeline navigation component
│   │   ├── Map.tsx          # Interactive map component
│   │   ├── EventPanel.tsx   # Event details display
│   │   ├── CompanionModal.tsx  # Companion biography modal
│   │   ├── QuranModal.tsx   # Quranic reference modal
│   │   ├── QuranRef.tsx     # Quran reference component
│   │   ├── SearchMenu.tsx   # Search functionality
│   │   └── IntroScreen.tsx  # Welcome screen
│   ├── data/
│   │   ├── dataList.json    # Historical events data
│   │   ├── quranData.json   # Quranic references
│   │   ├── companionsList.ts   # Core companions data
│   │   ├── citiesList.ts    # Cities and locations
│   │   └── territoriesData.ts  # Territory boundaries
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── types.ts             # TypeScript type definitions
│   └── index.css            # Global styles
├── public/
│   └── nibras-icon.svg      # Application icon
├── ADDING_NEW_CONTENT_GUIDE.md  # Content addition guide
├── metadata.json            # Project metadata
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run TypeScript type checking

### Adding New Content

To add new historical events, companions, or cities to the application, refer to the comprehensive guide:

**[ADDING_NEW_CONTENT_GUIDE.md](./ADDING_NEW_CONTENT_GUIDE.md)**

The guide covers:
- Adding new historical events with proper structure
- Adding companion biographies
- Adding cities and locations
- Data validation and testing
- Common mistakes to avoid
- Complete examples

### Data Structure

#### Events
Events are stored in [`src/dataList.json`](./src/dataList.json) with the following structure:
- Event metadata (id, category, era, title)
- Date information (Hijri and Gregorian)
- Location with coordinates
- Detailed descriptions and course of events
- Companion roles
- Quranic and Hadith references
- Historical sources

#### Companions
Companion data is distributed across multiple files in [`src/`](./src/):
- `companionsList.ts` - Core companions (Rashidun Caliphs, Ten Promised Paradise)
- Additional companion files for extended biographies

#### Cities
City data is stored in [`src/citiesList.ts`](./src/citiesList.ts) with:
- City name and coordinates
- Historical description
- Religious and historical significance

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Historical Sources

All content is derived from authentic Sunni Islamic sources:

### Primary Sources
- Sirat Ibn Hisham (Biography of the Prophet)
- Al-Raheeq Al-Makhtum (The Sealed Nectar)
- Zad al-Ma'ad (Ibn Qayyim)

### Historical References
- Al-Bidaya wa'l-Nihaya (Ibn Kathir)
- Tarikh al-Tabari
- Al-Kamil fi al-Tarikh (Ibn al-Athir)

### Companion Biographies
- Al-Isabah fi Tamyiz al-Sahabah (Ibn Hajar)
- Usd al-Ghabah (Ibn al-Athir)
- Al-Isti'ab (Ibn Abd al-Barr)

## Contributing

Contributions are welcome! When contributing:

1. Ensure historical accuracy using authentic sources
2. Follow the existing code structure and TypeScript conventions
3. Test all changes thoroughly
4. Refer to ADDING_NEW_CONTENT_GUIDE.md for content additions
5. Maintain the professional tone and accuracy of the application

## License

Copyright 2026 - Created with dedication to serve Islamic history.

All sources are derived from authentic Sunni books and the authentic Prophetic biography.

## Vision and Mission

**Vision:** To be the first interactive spatial reference for contemporary Muslims to explore the Prophetic biography and Islamic history through visual and technical methods that connect hearts to the places of revelation.

**Mission:** To employ the latest interactive mapping technologies to document events of the Prophetic biography and the history of the Rashidun Caliphs, presenting them free from modern political borders in an organic, living interactive display, based on the most authentic approved Sunni sources.

---

**نِبْرَاس - Illuminating Islamic History Through Time and Space**
