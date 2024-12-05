import { NextRequest, NextResponse } from 'next/server';
import { initializeOBSConnection, getOBSClient } from '../../../lib/obsClient';
import db from '../../../lib/database';
import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// // Initialize SQLite
// async function getDB() {
//   return open({
//     filename: './streams.db',
//     driver: sqlite3.Database,
//   });
// }


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, obs_source_name, url } = body;

    if (!name || !obs_source_name || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to OBS WebSocket
    await initializeOBSConnection();
    const obs = getOBSClient();

    console.log('Stream data received:', { name, obs_source_name, url });

    // Check if the OBS source exists
    const { inputs } = await obs.call('GetInputList');
    const sourceExists = inputs.some((input) => input.inputName === obs_source_name);

    if (!sourceExists) {
      // Create the OBS browser source
      await obs.call('CreateInput', {
        sceneName: 'SaT 2024', // TODO: dynamic lookup?
        inputName: obs_source_name,
        inputKind: 'browser_source',
        inputSettings: {
          width: 1600,
          height: 900,
          url, // Use the provided Twitch URL as the source
        },
      });
      console.log(`OBS source "${obs_source_name}" created.`);
    } else {
      console.log(`OBS source "${obs_source_name}" already exists.`);
    }


    const query = `INSERT INTO streams (name, obs_source_name, url) VALUES (?, ?, ?)`;
    db.run(query, [name, obs_source_name, url])
    return NextResponse.json({ message: 'Stream added successfully' }, {status: 201})
  } catch (error) {
    console.error('Error adding stream:', error);
    return NextResponse.json({ error: 'Failed to add stream' }, { status: 500 });
  }
}