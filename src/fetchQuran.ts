import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/dataList.json', 'utf8'));

// Flag major events
data.forEach((e: any) => {
  if (
    e.title.includes('تولي') && e.title.includes('الخلافة') ||
    e.title.includes('وفاة النبي') || 
    e.title.includes('ميلاد النبي') || 
    e.title.includes('نزول الوحي') ||
    e.title.includes('الهجرة النبوية')
  ) {
     e.is_major_event = true;
  }
});

const newEvents = [
  {
    category: 'أحداث',
    era: 'العهد المكي',
    title: 'ميلاد النبي ﷺ',
    is_major_event: true,
    date: {
      hijri: -53,
      hijri_relative: 'عام الفيل',
      gregorian: 571
    },
    location: {
      name: 'مكة المكرمة - شعب بني هاشم',
      coordinates: [21.4225, 39.8262]
    },
    details: {
      summary: 'ولادة أشرف الخلق محمد بن عبد الله ﷺ في مكة.',
      full_description: 'ولد النبي محمد ﷺ يتيم الأب، حيث توفي والده عبد الله بن عبد المطلب وهو في بطن أمه آمنة بنت وهب. ولد يوم الإثنين، الثاني عشر من شهر ربيع الأول في عام الفيل، وهو العام الذي حاول فيه أبرهة الحبشي هدم الكعبة فأنقذها الله. وكانت ولادته إيذاناً بانبلاج فجر جديد للبشرية.',
      course_of_events: [
        'وفاة عبد الله (والد النبي) في يثرب قبل الولادة',
        'الولادة في شعب أبي طالب بمكة',
        'تبشير جده عبد المطلب وفرحه به',
        'تسميته بمحمد، وهو اسم لم يكن شائعاً عند العرب'
      ],
      companion_roles: []
    },
    entities: {
      key_figures: ['عبد المطلب', 'آمنة بنت وهب', 'حليمة السعدية'],
      quran_refs: [],
      hadith_refs: ['صحيح مسلم: سئل عن صوم يوم الإثنين فقال: ذاك يوم ولدت فيه'],
      sources: ['الرحيق المختوم', 'سيرة ابن هشام']
    }
  },
  {
    category: 'أحداث',
    era: 'العهد المكي',
    title: 'حادثة شق الصدر',
    date: {
      hijri: -49,
      hijri_relative: '4 سنوات قبل البعثة (تقريباً)',
      gregorian: 575
    },
    location: {
      name: 'ديار بني سعد',
      coordinates: [21.3200, 39.9500]
    },
    details: {
      summary: 'حادثة شق صدر النبي ﷺ وهو في بادية بني سعد عند مرضعته حليمة.',
      full_description: 'وبينما كان النبي ﷺ يلعب مع الغلمان في مضارب بني سعد، أتاه جبريل عليه السلام فصرعه، فشق صدره واستخرج قلبه، واستخرج منه علقة وقال: (هذا حظ الشيطان منك). ثم غسله في طست من ذهب بماء زمزم، ثم لأمه (أعاده) ورده في مكانه.',
      course_of_events: [
        'مجيء جبريل عليه السلام للنبي ﷺ وهو يلعب',
        'شق الصدر واستخراج حظ الشيطان',
        'غسل القلب بماء زمزم',
        'فزع الغلمان وإخبارهم لحليمة',
        'عودة النبي ﷺ إلى أمه آمنة في مكة بعد الحادثة خوفاً عليه'
      ]
    },
    entities: {
      key_figures: ['جبريل عليه السلام', 'حليمة السعدية', 'الشيماء (أخته من الرضاعة)'],
      quran_refs: [],
      hadith_refs: ['صحيح مسلم: كتاب الإيمان، باب الإسراء'],
      sources: ['الرحيق المختوم']
    }
  },
  {
    category: 'غزوات ومعارك',
    era: 'العهد المدني',
    title: 'سرية نخلة',
    date: {
      hijri: 2,
      hijri_relative: 'رجب 2 هـ',
      gregorian: 624
    },
    location: {
      name: 'وادي نخلة (بين مكة والطائف)',
      coordinates: [21.5606, 40.0689]
    },
    details: {
      summary: 'أول اشتباك مسلح تسيل فيه دماء بين المسلمين والمشركين بقيادة عبد الله بن جحش.',
      full_description: 'أرسل النبي ﷺ عبد الله بن جحش في رجب (الشهر الحرام) ليستطلع أخبار قريش. واعترضوا قافلة تجارية لقريش. فتشاور المسلمون ثم قرروا الهجوم، فقتلوا واقداً بن عبد الله التميمي وأسروا اثنين. وعندما عادوا أنكر عليهم النبي ﷺ القتال في الشهر الحرام حتى نزل الوحي يوضح الموقف.',
      course_of_events: [
        'خروج عبد الله بن جحش في 8 من رفاقه',
        'رسالة النبي ﷺ المغلقة التي قرأها بعد يومين من المسير',
        'الوصول إلى نخلة ومراقبة القافلة',
        'الهجوم وقتل واقد بن عبد الله',
        'العودة للرسول ﷺ ونزول آيات سورة البقرة'
      ],
      companion_roles: [
        { name: 'عبد الله بن جحش', role_in_event: 'أمير السرية' }
      ]
    },
    entities: {
      key_figures: ['عمرو بن الحضرمي'],
      quran_refs: ['البقرة: 217'],
      hadith_refs: [],
      sources: ['الرحيق المختوم', 'سيرة ابن هشام']
    }
  }
];

// Combine and resolve dupes for testing
const existingTitles = new Set(data.map((d: any) => d.title));
newEvents.forEach(e => {
  if (!existingTitles.has(e.title)) {
    data.push(e);
  }
});

fs.writeFileSync('src/dataList.json', JSON.stringify(data, null, 2), 'utf8');

const refs = new Set<string>();

data.forEach((d: any) => {
  if (d.entities && d.entities.quran_refs) {
    d.entities.quran_refs.forEach((r: string) => refs.add(r));
  }
});

const surahMap: Record<string, number> = {
  "الفيل": 105,
  "العلق": 96,
  "الحجر": 15,
  "الشعراء": 26,
  "الإسراء": 17,
  "النجم": 53,
  "الممتحنة": 60,
  "التوبة": 9,
  "البقرة": 2,
  "آل عمران": 3,
  "الأنفال": 8,
  "الحشر": 59,
  "الأحزاب": 33,
  "الفتح": 48,
  "النصر": 110,
  "المائدة": 5,
  "الدخان": 44
};

function parseRef(ref: string) {
  let clean = ref.replace('سورة ', '').replace(' (تلاها سعد عند دخول القصر)', '');
  let [surahName, ayahRange] = clean.split(':');
  surahName = surahName.trim();
  
  const surahNum = surahMap[surahName];
  if (!surahNum) return null;

  if (ayahRange) {
    ayahRange = ayahRange.trim();
    if (ayahRange.includes('-')) {
      const [start, end] = ayahRange.split('-').map(Number);
      return { surahName, surahNum, start, end, type: 'range' };
    } else {
      return { surahName, surahNum, start: Number(ayahRange), end: Number(ayahRange), type: 'single' };
    }
  } else {
    // If no range specified, we fetch the whole surah
    return { surahName, surahNum, start: 1, end: null, type: 'full' };
  }
}

async function fetchSurah(surah: number) {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`);
  if (!res.ok) throw new Error('API ERROR: ' + res.status);
  const json = await res.json();
  return json.data.ayahs;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
  const result: any = {};
  const surahCache: Record<number, any[]> = {};

  // First, identify all unique surahs we need to fetch
  const neededSurahs = new Set<number>();
  for (const ref of Array.from(refs)) {
    const parsed = parseRef(ref);
    if (parsed) neededSurahs.add(parsed.surahNum);
  }

  // Fetch and cache all needed surahs
  for (const surahNum of Array.from(neededSurahs)) {
    console.log(`Fetching full Surah ${surahNum}...`);
    try {
      await delay(500);
      surahCache[surahNum] = await fetchSurah(surahNum);
    } catch(e) {
      console.error(`Failed to fetch Surah ${surahNum}:`, e);
    }
  }

  // Process references
  for (const ref of Array.from(refs)) {
    const parsed = parseRef(ref);
    if (!parsed) continue;

    const { surahNum, start, end, type } = parsed;
    const ayahsData = surahCache[surahNum];
    if (!ayahsData) continue;

    let ayahsText = [];
    const limit = end ? end : ayahsData.length;
    
    for (let i = start; i <= limit; i++) {
        let text = ayahsData[i - 1].text;
        if (i === 1 && surahNum !== 1 && surahNum !== 9) {
          text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
        }
        const arabicNum = i.toLocaleString('ar-EG');
        text = `${text} ﴿${arabicNum}﴾`;
        ayahsText.push(text);
    }

    result[ref] = {
      text: ayahsText.join(' '),
      link: `https://quran.com/ar/${surahNum}/${start}${end ? `-${end}` : ''}`,
      surahNum,
      start,
      end: limit
    };
  }

  fs.writeFileSync('src/quranData.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('Done mapping all Quran refs (Full text)!');
}

main();
