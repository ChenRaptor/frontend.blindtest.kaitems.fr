import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from "fs"

ffmpeg.setFfmpegPath(ffmpegPath as string);

const downloadAndConvertToMP3 = (videoUrl: string, outputFileName: string) => {
  const videoStream = ytdl(videoUrl, { quality: 'highestaudio' });

  const outputPath = `./public/audio/${outputFileName}.mp3`;

  ffmpeg()
    .input(videoStream)
    .audioCodec('libmp3lame')
    .audioBitrate(320)
    .toFormat('mp3')
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
  const filePath = path.join(process.cwd(), 'public', 'json', 'audio.json');

  // Lire le contenu actuel du fichier
  const currentContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Mettre à jour le tableau avec les données de req.body
  currentContent.push(req.body);

  // Réécrire le fichier avec le contenu mis à jour
  fs.writeFileSync(filePath, JSON.stringify(currentContent));

  res.status(200).json({ name: 'Success' })
}