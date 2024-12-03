import type { NextApiRequest, NextApiResponse } from 'next';
import { connectOBS, checkSourceExists } from '../../lib/obsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sourceName } = req.query;

  if (!sourceName || typeof sourceName !== 'string') {
    res.status(400).json({ error: 'Invalid or missing sourceName parameter.' });
    return;
  }

  try {
    // Connect to OBS if not already connected
    await connectOBS();

    // Check if the source exists
    const exists = await checkSourceExists(sourceName);

    res.status(200).json({ sourceName, exists });
  } catch (err) {
    console.error('Error checking source existence:', err.message);
    res.status(500).json({ error: 'Failed to check source existence.', details: err.message });
  }
}
