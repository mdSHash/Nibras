import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(process.cwd(), 'src/dataList.json');
const events = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Find and update specific events
events.forEach((e: any) => {
  if (e.id === 'battle-badr' || e.title.includes('غزوة بدر الكبرى')) {
    if (!e.entities) e.entities = {};
    if (!e.entities.key_figures) e.entities.key_figures = [];
    e.entities.key_figures.push('أبو جهل', 'المقداد بن عمرو', 'عبد الرحمن بن عوف', 'عبد الله بن مسعود');
  }
  
  if (e.title.includes('خيبر') || e.id === 'khaybar') {
    if (!e.entities) e.entities = {};
    if (!e.entities.key_figures) e.entities.key_figures = [];
    e.entities.key_figures.push('أبو هريرة');
  }
  
  if (e.title.includes('سقيفة') || e.title.includes('خلافة أبي بكر') || e.id === 'abu-bakr-caliphate') {
    if (!e.entities) e.entities = {};
    if (!e.entities.key_figures) e.entities.key_figures = [];
    e.entities.key_figures.push('سعد بن عبادة');
  }
  
  if (e.title.includes('شورى') || e.title.includes('مقتل عمر') || e.title.includes('خلافة عثمان')) {
    if (!e.entities) e.entities = {};
    if (!e.entities.key_figures) e.entities.key_figures = [];
    e.entities.key_figures.push('عبد الرحمن بن عوف');
  }

  if (e.title.includes('وفاة النبي') || e.title.includes('حجة الوداع')) {
    if (!e.entities) e.entities = {};
    if (!e.entities.key_figures) e.entities.key_figures = [];
    e.entities.key_figures.push('فاطمة الزهراء', 'الحسن بن علي', 'الحسين بن علي');
  }

  if (e.title.includes('خلافة علي') || e.title.includes('صفين') || e.title.includes('الجمل') || e.id === 'ali-caliphate') {
    if (!e.entities) e.entities = {};
    if (!e.entities.key_figures) e.entities.key_figures = [];
    e.entities.key_figures.push('الحسن بن علي', 'الحسين بن علي');
  }
  
  // Deduplicate figures
  if (e.entities && e.entities.key_figures) {
    e.entities.key_figures = [...new Set(e.entities.key_figures)];
  }
});

fs.writeFileSync(dataPath, JSON.stringify(events, null, 2));
console.log('Successfully updated dataList.json');
