import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { FILE_DIRECTORY } from '../../../config';
import { getDatabase } from '../../../lib/database';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
  team_id: number;
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
  
    const filePath = path.join(FILE_DIRECTORY(), `${screen}.txt`);
  
    try {
    //     const streamBody = await request.json();
    //     const { name, obs_source_name, url } = streamBody;
        const db = await getDatabase();
        const streamId = await db.get('SELECT * FROM streams WHERE id = ?', [id]);
        console.log(streamId); 

        if (!streamId) { return NextResponse.json({ error: 'Stream not found' },{status: 400}) }

        fs.writeFileSync(filePath, streamId.obs_source_name);
        return NextResponse.json({ message: `${screen} updated successfully.` },{status: 200});;
    
    } catch (error) {
      console.error('Error updating active source:', error);
      return NextResponse.json({ error: 'Failed to update active source', details: error.message }, {status:500})
    }
}