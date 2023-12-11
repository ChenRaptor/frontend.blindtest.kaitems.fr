import path from "path";

const fs = require('fs');

export default async function handler(req: any, res: any) {
  fs.readdir('./public/audio', (err: any, files: string[]) => {
    if (err) {
      return console.log('Impossible de lire le répertoire : ', err);
    }
  
    // Filtrer les fichiers pour n'inclure que les fichiers MP3
    // const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

    const jsonFilePath = path.join(process.cwd(), 'public', 'json', 'audio.json');
    const jsonContent : {[key: string]: any} = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    console.log(jsonContent)

    const filesIdMap = files.map((file: string) => {
      let fileWithoutExt = file.split(".mp3")[0]

      const allArrays = Object.values(jsonContent);
      const mergedArray = [].concat(...allArrays);

      let fileInfo = (mergedArray as any[]).find((item) => {
        console.log("1:", item.id)
        console.log("2:", fileWithoutExt)
        return item.id === fileWithoutExt
      })
      console.log(fileInfo)
      return {
        id: fileWithoutExt,
        title: fileInfo.title,
        tag: fileInfo.tag,
        associated_piece: fileInfo.associated_piece
      }
    })

    res.status(200).json(filesIdMap)
  });
}