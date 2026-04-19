const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/dataList.json', 'utf8'));

const updates = Object.assign({}, ...[
    { title: "معركة الفراض", greg: 634.05 },
    { title: "وفاة أبي بكر الصديق", greg: 634.1 },
    { title: "تولي عمر بن الخطاب الخلافة", greg: 634.11 },
    { title: "معركة النمارق", greg: 634.2 },
    { title: "موقعة الجسر", greg: 634.3 },
    { title: "معركة البويب", greg: 634.4 },
    { title: "فتح دمشق", greg: 634.5 }
].map(u => ({ [u.title]: u.greg })));

data.forEach(evt => {
    if (updates[evt.title] !== undefined) {
        evt.date.gregorian = updates[evt.title];
    }
});

fs.writeFileSync('src/dataList.json', JSON.stringify(data, null, 2));
console.log('Fixed dates successfully');
