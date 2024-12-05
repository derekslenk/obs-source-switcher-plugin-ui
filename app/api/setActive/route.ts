import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import config from '../../../config';
import db from '../../../lib/database';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
};

type Screen = {
    screen: string;
    id: number;
}

export async function POST(request: NextRequest) {

    const body = await request.json();
    const { screen, id } = body;

    const validScreens = ['large', 'left', 'right'];
    if (!validScreens.includes(screen)) {
        return NextResponse.json({ error: 'Invalid screen name' },{status: 400})
    }
  
    const filePath = path.join(config.FILE_DIRECTORY, `${screen}.txt`);
  
    try {
        const body = await request.json();
        const { name, obs_source_name, url } = body;
        const stream: Stream | null = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM streams WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!stream) { return NextResponse.json({ error: 'Stream not found' },{status: 400}) }

        fs.writeFileSync(filePath, stream.obs_source_name);
        return NextResponse.json({ message: `${screen} updated successfully.` },{status: 200});;
    
    } catch (error) {
      console.error('Error updating active source:', error);
      return NextResponse.json({ error: 'Failed to update active source', details: error.message }, {status:500})
    }
}