import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, obs_source_name, url } = body;

    console.log('Stream data received:', { name, obs_source_name, url });

    const query = `INSERT INTO streams (name, obs_source_name, url) VALUES (?, ?, ?)`;
    db.run(query, [name, obs_source_name, url])
    return NextResponse.json({ message: 'Stream added successfully' }, {status: 201})
  } catch (error) {
    console.error('Error adding stream:', error);
    return NextResponse.json({ error: 'Failed to add stream' }, { status: 500 });
  }
}