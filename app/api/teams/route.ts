import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';
import { Team } from '@/types';

export async function GET() {
    const db = await getDatabase();
    const teams:Team = await db.all('SELECT * FROM teams_2025_spring_adr');
    return NextResponse.json(teams);
}