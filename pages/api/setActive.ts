import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import db from '../../lib/database';


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

  const validScreens = ['large', 'left', 'right'];
  if (!validScreens.includes(screen)) {
    res.status(400).json({ error: 'Invalid screen name' });
    return;
  }

  const filePath = path.join(config.FILE_DIRECTORY, `${screen}.txt`);

  try {
    // Example: Fetch the stream from your database
    const stream: Stream | null = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM streams WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!stream) {
      res.status(404).json({ error: 'Stream not found' });
      return;
    }

    // Write the obs_source_name to the corresponding file
    fs.writeFileSync(filePath, stream.obs_source_name);
    res.status(200).json({ message: `${screen} updated successfully.` });
  } catch (error) {
    console.error('Error updating active source:', error);
    res.status(500).json({ error: 'Failed to update active source', details: error.message });
  }
}
