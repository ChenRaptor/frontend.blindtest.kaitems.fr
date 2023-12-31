import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from "fs"

ffmpeg.setFfmpegPath(ffmpegPath as string);

const downloadAndConvertToMP3 = (videoUrl: string, outputFileName: string, start: number) => {
  const videoStream = ytdl(videoUrl, { quality: 'highestaudio' });

  const outputPath = path.join(process.cwd(), 'public', 'audio', `${outputFileName}.mp3`);

  ffmpeg()
    .input(videoStream)
    .audioCodec('libmp3lame')
    .audioBitrate(320)
    .toFormat('mp3')
    .setStartTime(start) // Définir le début à 0 secondes
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

  console.log(req.body)
  const youtubeVideoUrl = `https://www.youtube.com/watch?v=${req.body.id}`;
  const outputFileName = req.body.id; // Nom du fichier sans extension

  const start = req.body.started_at; // La vidéo commence à ...
  console.log(start);
  
  
  downloadAndConvertToMP3(youtubeVideoUrl, outputFileName, start);

  // Chemin du fichier audio.json dans le dossier public/json
  const filePath = path.join(process.cwd(), 'public', 'json', 'audio.json');

  // Lire le contenu actuel du fichier
  const currentContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Mettre à jour le tableau avec les données de req.body
  currentContent[req.body.tag].push({
    ...req.body,
  });

  // Réécrire le fichier avec le contenu mis à jour
  fs.writeFileSync(filePath, JSON.stringify(currentContent, null, 2));

  res.status(200).json({ name: 'Success' })
}