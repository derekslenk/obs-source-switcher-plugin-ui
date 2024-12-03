import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/database';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    // Use a Promise to handle the SQLite database query
    const streams: Stream[] = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM streams', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.status(200).json(streams);
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
