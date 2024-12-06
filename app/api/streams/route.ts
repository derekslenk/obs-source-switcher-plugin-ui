import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
  team_id: number;
};

export async function GET(request: NextRequest) {
    const db = await getDatabase();
    const streams = await db.all('SELECT * FROM streams');
  return NextResponse.json(streams);
}
