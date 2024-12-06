const config = require('../config');
const { OBSWebSocket } = require('obs-websocket-js');

let obs = null;

async function connectToOBS() {
  if (!obs) {
    obs = new OBSWebSocket();
  }

  try {
    const OBS_HOST = process.env.OBS_WEBSOCKET_HOST || '127.0.0.1';
    const OBS_PORT = process.env.OBS_WEBSOCKET_PORT || '4455';
    const OBS_PASSWORD = process.env.OBS_WEBSOCKET_PASSWORD || '';

    console.log('Connecting to OBS WebSocket...');
    console.log('Host:', OBS_HOST);
    console.log('Port:', OBS_PORT);
    console.log('Password:', OBS_PASSWORD ? '***' : '(none)');

    await obs.connect(`ws://${OBS_HOST}:${OBS_PORT}`, OBS_PASSWORD);
    console.log('Connected to OBS WebSocket.');
  } catch (err) {
    console.error('Failed to connect to OBS WebSocket:', err.message);
    throw err;
  }
}

function getOBSClient() {
  if (!obs) {
    throw new Error('OBS WebSocket client is not initialized. Call connectToOBS() first.');
  }
  // console.log('client', obs)
  return obs;
}

async function disconnectFromOBS() {
  if (obs) {
    await obs.disconnect();
    console.log('Disconnected from OBS WebSocket.');
    obs = null;
  }
}

async function addSourceToSwitcher(inputName, newSources) {
  const obs = new OBSWebSocket();

  try {
    await obs.connect('ws://127.0.0.1:4455', 'your_password');

    // Step 1: Get current input settings
    const { inputSettings } = await obs.call('GetInputSettings', { inputName });
    console.log('Current Settings:', inputSettings);

    // Step 2: Add new sources to the sources array
    const updatedSources = [...inputSettings.sources, ...newSources];

    // Step 3: Update the settings with the new sources array
    await obs.call('SetInputSettings', {
      inputName,
      inputSettings: {
        ...inputSettings,
        sources: updatedSources,
      },
    });

    console.log('Updated settings successfully.');
    obs.disconnect();
  } catch (error) {
    console.error('Error updating settings:', error.message);
  }
}

// Export all functions
module.exports = { connectToOBS, getOBSClient, disconnectFromOBS, addSourceToSwitcher };