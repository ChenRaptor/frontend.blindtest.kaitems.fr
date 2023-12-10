import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath as string);

const downloadAndConvertToMP3 = (videoUrl, outputFileName) => {
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

export default async function handler(req, res) {
  const youtubeVideoUrl = 'https://www.youtube.com/watch?v=l0PV3BQHDo8';
  const outputFileName = 'output'; // Nom du fichier sans extension
  
  downloadAndConvertToMP3(youtubeVideoUrl, outputFileName);

  res.status(200).json({ name: 'John Doe' })
}