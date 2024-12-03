import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import config from '../../config';

// Ensure directory exists
if (!fs.existsSync(config.FILE_DIRECTORY)) {
  fs.mkdirSync(config.FILE_DIRECTORY, { recursive: true });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const largePath = path.join(config.FILE_DIRECTORY, 'large.txt');
    const leftPath = path.join(config.FILE_DIRECTORY, 'left.txt');
    const rightPath = path.join(config.FILE_DIRECTORY, 'right.txt');

    const large = fs.existsSync(largePath) ? fs.readFileSync(largePath, 'utf-8') : null;
    const left = fs.existsSync(leftPath) ? fs.readFileSync(leftPath, 'utf-8') : null;
    const right = fs.existsSync(rightPath) ? fs.readFileSync(rightPath, 'utf-8') : null;

    res.status(200).json({ large, left, right });
  } catch (error) {
    console.error('Error reading active sources:', error);
    res.status(500).json({ error: 'Failed to read active sources' });
  }
}
