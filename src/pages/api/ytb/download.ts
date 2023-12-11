import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from "fs"
const ffmpegPath = require.resolve('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const downloadAndConvertToMP3 = (videoUrl: string, outputFileName: string) => {
  const videoStream = ytdl(videoUrl, { quality: 'highestaudio' });

  const outputPath = process.env.METHOD_PATH === 'PROCESS_CWD' ?
    path.join(process.cwd(), 'public', 'audio', `${outputFileName}.mp3`) : path.join(process.cwd(), 'public', 'audio', `${outputFileName}.mp3`);

  ffmpeg()
    .input(videoStream)
    .audioCodec('libmp3lame')
    .audioBitrate(320)
    .toFormat('mp3')
    .setStartTime(0) // Définir le début à 0 secondes
    .duration(20)   // Définir la durée à 20 secondes
    .on('end', () => {
      console.log('Conversion finished.');
    })
    .on('error', (err) => {
      console.error('Error:', err);
    })
    .save(outputPath);
};

export default async function handler(req: any, res: any) {

  const youtubeVideoUrl = `https://www.youtube.com/watch?v=${req.body.id}`;
  const outputFileName = req.body.id; // Nom du fichier sans extension
  
  downloadAndConvertToMP3(youtubeVideoUrl, outputFileName);

  // Chemin du fichier audio.json dans le dossier public/json
  const filePath = process.env.METHOD_PATH === 'PROCESS_CWD' ?
    path.join(process.cwd(), 'public', 'json', 'audio.json') : path.join(process.cwd(), 'public', 'json', 'audio.json');

  // Lire le contenu actuel du fichier
  const currentContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Mettre à jour le tableau avec les données de req.body
  currentContent[req.body.tag].push(req.body);

  // Réécrire le fichier avec le contenu mis à jour
  fs.writeFileSync(filePath, JSON.stringify(currentContent, null, 2));

  res.status(200).json({ name: 'Success' })
}