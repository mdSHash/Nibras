import fs from 'fs';
import https from 'https';

function download(url: string, dest: string) {
  return new Promise<void>((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

Promise.all([
  download('https://raw.githubusercontent.com/mdSHash/sera/main/src/data.json', './src/dataList.json'),
  download('https://raw.githubusercontent.com/mdSHash/sera/main/src/data/cities.ts', './src/citiesList.ts'),
  download('https://raw.githubusercontent.com/mdSHash/sera/main/src/data/companions.ts', './src/companionsList.ts')
]).then(() => console.log('Downloaded successfully')).catch(console.error);
