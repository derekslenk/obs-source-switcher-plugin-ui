import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/database';
import fs from 'fs';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  const { screen, id }: { screen: string; id: number } = req.body;

  // Validate screen name
  const validScreens = ['large', 'left', 'right'];
  if (!validScreens.includes(screen)) {
    res.status(400).json({ error: 'Invalid screen name' });
    return;
  }

  // Wrap database operations in a Promise to ensure proper handling
  const stream: Stream | null = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM streams WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  }).catch((error) => {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
    return null;
  });

  if (!stream) {
    // Response is already sent if there's an error in the database query
    return;
  }

  try {
    // Write the active stream's `obs_source_name` to the corresponding file
    const filename = `C:\\OBS\\source-switching\\${screen}.txt`;
    fs.writeFileSync(filename, stream.obs_source_name);

    res.status(200).json({ message: `${screen} updated successfully.` });
  } catch (error) {
    console.error('Failed to write to file:', error);
    res.status(500).json({ error: 'Failed to write to file', details: error.message });
  }
}
