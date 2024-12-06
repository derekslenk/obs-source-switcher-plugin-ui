import {  NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';
import { Stream } from '@/types';

export async function GET() {
    const db = await getDatabase();
    const streams:Stream = await db.all('SELECT * FROM streams');
  return NextResponse.json(streams);
}
