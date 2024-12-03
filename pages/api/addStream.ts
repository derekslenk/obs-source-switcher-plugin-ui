import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, obs_source_name, url } = req.body;

    if (!name || !obs_source_name || !url) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const query = `INSERT INTO streams (name, obs_source_name, url) VALUES (?, ?, ?)`;
    db.run(query, [name, obs_source_name, url], (err) => {
      if (err) {
        console.error('Error inserting stream:', err);
        res.status(500).json({ error: 'Failed to add stream' });
      } else {
        res.status(201).json({ message: 'Stream added successfully' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
