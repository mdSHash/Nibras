import { companionsData, findCompanion } from './src/companionsList.ts';
import dataList from './src/dataList.json' with { type: "json" };

const allEventCompanions = new Set();
dataList.forEach(event => {
    if(event.details && event.details.companion_roles) {
        event.details.companion_roles.forEach(cr => {
            allEventCompanions.add(cr.name);
        });
    }
});

const missing = [];
const found = [];

allEventCompanions.forEach(name => {
    const companion = findCompanion(name);
    if (!companion) {
        missing.push(name);
    } else {
        found.push({ name, title: companion.title, descLength: companion.description.length });
    }
});

console.log('--- MISSING COMPANIONS ---');
console.log(missing);

console.log('\n--- FOUND COMPANIONS (Title + Desc Length) ---');
found.forEach(f => console.log(`${f.name} - ${f.title} (${f.descLength} chars)`));
