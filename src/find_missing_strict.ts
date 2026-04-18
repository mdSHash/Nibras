import fs from 'fs';
import { companionsData, findCompanion } from './companionsList';

const events = JSON.parse(fs.readFileSync('src/imported_data.json', 'utf8'));
const missing = new Set<string>();

events.forEach((evt: any) => {
  if (evt.details?.companion_roles) {
    evt.details.companion_roles.forEach((cr: any) => {
      const name = cr.name.replace(/رضي الله عنه|رضي الله عنها|ﷺ|عليه السلام/g, '').trim();
      const exactMatch = companionsData.find(c => c.name === name || c.aliases.includes(name));
      if (!exactMatch) missing.add(name);
    });
  }
  if (evt.entities?.key_figures) {
    evt.entities.key_figures.forEach((kf: string) => {
      const name = kf.replace(/رضي الله عنه|رضي الله عنها|ﷺ|عليه السلام/g, '').trim();
      const exactMatch = companionsData.find(c => c.name === name || c.aliases.includes(name));
      if (!exactMatch) missing.add(name);
    });
  }
});

console.log("Strict Missing Figures count:", missing.size);
console.log(Array.from(missing).join('\n'));
