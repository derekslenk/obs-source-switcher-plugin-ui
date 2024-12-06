import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';
const { connectToOBS, getOBSClient, disconnectFromOBS, addSourceToSwitcher } = require('../../../lib/obsClient');

let obs = null

async function fetchTeamName(teamId) {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/getTeamName?team_id=${teamId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch team name');
    }
    const data = await response.json();
    return data.team_name;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, obs_source_name, url, team_id } = body;

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
      // console.log('Inputs:', inputs);
    } catch (err) {
      console.error('Failed to fetch inputs:', err.message);
      throw new Error('GetInputList failed.');
    }
    const teamName = await fetchTeamName(team_id);
    console.log('Team Name:', teamName)
    const { scenes } = await obs.call('GetSceneList');
    const groupExists = scenes.some((scene) => scene.sceneName === teamName);    
    if (!groupExists) {
      await obs.call('CreateScene', { sceneName: teamName });
    }
    
    const sourceExists = inputs.some((input) => input.inputName === obs_source_name);

    if (!sourceExists) {
      // Create a new browser source in OBS
      await obs.call('CreateInput', {
        sceneName: teamName, // Replace with your actual scene name
        inputName: obs_source_name,
        inputKind: 'browser_source',
        inputSettings: {
          width: 1600,
          height: 900,
          url, // Use the Twitch URL as the source
        },
      });
      // Step 4: Enable "Control audio via OBS" via second call
      await obs.call('SetInputSettings', {
        inputName: obs_source_name,
        inputSettings: {
          control_audio: true, // Enable audio control
        },
        overlay: true, // Keep existing settings and apply changes
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
      addSourceToSwitcher('ss_top_right', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
      addSourceToSwitcher('ss_top_left', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
      addSourceToSwitcher('ss_bottom_right', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
      addSourceToSwitcher('ss_bottom_left', [
        { hidden: false, selected: false, value: obs_source_name },
      ]);
    } else {
      console.log(`OBS source "${obs_source_name}" already exists.`);
    }

    const db = await getDatabase();
    const query = `INSERT INTO streams (name, obs_source_name, url, team_id) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, obs_source_name, url, team_id])
    disconnectFromOBS();
    return NextResponse.json({ message: 'Stream added successfully' }, {status: 201})
  } catch (error) {
    console.error('Error adding stream:', error);
    return NextResponse.json({ error: 'Failed to add stream' }, { status: 500 });
  }
}