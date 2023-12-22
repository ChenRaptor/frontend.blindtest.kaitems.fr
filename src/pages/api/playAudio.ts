import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileName } = req.query;

  if (!fileName || typeof fileName !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid fileName parameter' });
  }

  const audioFilePath = path.join(process.cwd(), 'public', 'audio', path.basename(fileName));

  if (!fs.existsSync(audioFilePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stream = fs.createReadStream(audioFilePath);

  res.setHeader('Content-Type', 'audio/mpeg');

  stream.pipe(res);
}