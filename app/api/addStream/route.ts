import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';
const { connectToOBS, getOBSClient, disconnectFromOBS, addSourceToSwitcher } = require('../../../lib/obsClient');

let obs = null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, obs_source_name, url } = body;

    if (!name || !obs_source_name || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to OBS WebSocket
    console.log("Pre-connect")
    await connectToOBS();
    console.log('Pre client')
    obs = await getOBSClient();
    // obs.on('message', (msg) => {
    //   console.log('Message from OBS:', msg);
    // });
    let inputs;
    try {
      const response = await obs.call('GetInputList');
      inputs = response.inputs;
      console.log('Inputs:', inputs);
    } catch (err) {
      console.error('Failed to fetch inputs:', err.message);
      throw new Error('GetInputList failed.');
    }

    // console.log('Input list "${inputs}')
    const sourceExists = inputs.some((input) => input.inputName === obs_source_name);

    if (!sourceExists) {
      // Create a new browser source in OBS
      await obs.call('CreateInput', {
        sceneName: 'twitch_streams', // Replace with your actual scene name
        inputName: obs_source_name,
        inputKind: 'browser_source',
        inputSettings: {
          width: 1600,
          height: 900,
          url, // Use the Twitch URL as the source
        },
      });
      console.log(`OBS source "${obs_source_name}" created.`);
      addSourceToSwitcher('ss_large', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
      addSourceToSwitcher('ss_left', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
      addSourceToSwitcher('ss_right', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
    } else {
      console.log(`OBS source "${obs_source_name}" already exists.`);
    }

    const db = await getDatabase();
    const query = `INSERT INTO streams (name, obs_source_name, url) VALUES (?, ?, ?)`;
    db.run(query, [name, obs_source_name, url])
    disconnectFromOBS();
    return NextResponse.json({ message: 'Stream added successfully' }, {status: 201})
  } catch (error) {
    console.error('Error adding stream:', error);
    return NextResponse.json({ error: 'Failed to add stream' }, { status: 500 });
  }
}


// const { connectToOBS, getOBSClient, disconnectFromOBS } = require('../../../lib/obsClient');

// export async function POST(request) {
//   try {
//     console.log('Pre-connect');
//     await connectToOBS(); // Initialize and connect OBS client
//     console.log('Connected to OBS');

//     console.log('Pre-client');
//     const obs = getOBSClient(); // Retrieve the connected client
//     console.log('OBS client retrieved:', obs);

//     // Example operation: GetInputList
//     const { inputs } = await obs.call('GetInputList');
//     console.log('Inputs:', inputs);

//     await disconnectFromOBS();
//     return new Response(JSON.stringify({ message: 'OBS operation successful', inputs }), { status: 200 });
//   } catch (error) {
//     console.error('Error during OBS operation:', error.message);
//     return new Response(JSON.stringify({ error: 'OBS operation failed', details: error.message }), { status: 500 });
//   }
// }