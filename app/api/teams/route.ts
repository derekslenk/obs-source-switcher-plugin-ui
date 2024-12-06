import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';

type Team = {
    team_id: number;
    team_name: string;
};

export async function GET(request: NextRequest) {
    const db = await getDatabase();
    const teams = await db.all('SELECT * FROM teams');
    return NextResponse.json(teams);
}