import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/database';

type Option = {
  id: number;
  label: string;
  file1_value: string;
  file2_value: string;
  file3_value: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    db.all('SELECT * FROM options', [], (err, rows: Option[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json(rows);
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
