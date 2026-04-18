import https from 'https';
import fs from 'fs';

https.get('https://raw.githubusercontent.com/mdSHash/sera/main/src/data.json', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('src/imported_data.json', data);
    console.log('File successfully downloaded! Size:', data.length);
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
