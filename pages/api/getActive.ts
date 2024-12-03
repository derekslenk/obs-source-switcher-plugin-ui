import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    // Read current active sources from files
    const large = fs.existsSync('large.txt') ? fs.readFileSync('large.txt', 'utf-8') : null;
    const left = fs.existsSync('left.txt') ? fs.readFileSync('left.txt', 'utf-8') : null;
    const right = fs.existsSync('right.txt') ? fs.readFileSync('right.txt', 'utf-8') : null;

    res.status(200).json({ large, left, right });
  } catch (error) {
    console.error('Error reading active sources:', error);
    res.status(500).json({ error: 'Failed to read active sources' });
  }
}
