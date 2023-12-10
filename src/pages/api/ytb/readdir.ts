const fs = require('fs');
const path = require('path');

const directoryPath = path.join('public/audio');

export default async function handler(req, res) {
  fs.readdir('./public/audio', (err, files) => {
    if (err) {
      return console.log('Impossible de lire le répertoire : ', err);
    }
  
    // Filtrer les fichiers pour n'inclure que les fichiers MP3
    //const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

    res.status(200).json(files)
  });
}