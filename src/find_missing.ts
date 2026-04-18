import fs from 'fs';
import { companionsData } from './companionsList';

const events = JSON.parse(fs.readFileSync('src/imported_data.json', 'utf8'));

const missing = new Set<string>();

events.forEach((evt: any) => {
  if (evt.details?.companion_roles) {
    evt.details.companion_roles.forEach((cr: any) => {
      const name = cr.name;
      const found = companionsData.some(c => 
        c.name.includes(name) || c.aliases.some(a => a.includes(name) || name.includes(a))
      );
      if (!found) missing.add(name);
    });
  }
  if (evt.entities?.key_figures) {
    evt.entities.key_figures.forEach((kf: string) => {
      const found = companionsData.some(c => 
         c.name.includes(kf) || c.aliases.some(a => a.includes(kf) || kf.includes(a)) || kf.includes(c.name)
      );
      if (!found) missing.add(kf);
    });
  }
});

console.log("Missing Figures count:", missing.size);
console.log(Array.from(missing).join('\n'));
