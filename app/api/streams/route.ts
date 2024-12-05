import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/database';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
};

export async function GET(request: NextRequest) {
    const streams: Stream[] = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM streams', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
  return NextResponse.json(streams);
}
