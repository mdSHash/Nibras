const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/dataList.json'));
const counts = {};
data.forEach(d => {
    counts[d.era] = (counts[d.era] || 0) + 1;
});
console.log(counts);
