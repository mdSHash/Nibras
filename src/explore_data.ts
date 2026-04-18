import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/imported_data.json', 'utf8'));
console.log(`It's an array of size: ${data.length}`);
console.log(JSON.stringify(data[0], null, 2));
