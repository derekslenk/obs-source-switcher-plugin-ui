const { OBSWebSocket } = require('obs-websocket-js');
const config = require('../config');

const obs = new OBSWebSocket();

async function connectOBS() {
  try {
    await obs.connect(`ws://${config.OBS_WEBSOCKET_HOST}:${config.OBS_WEBSOCKET_PORT}`, config.OBS_WEBSOCKET_PASSWORD);
    console.log('Connected to OBS WebSocket server.');
  } catch (err) {
    console.error('Failed to connect to OBS WebSocket server:', err.message);
    throw err;
  }
}

async function getSourceList() {
  try {
    // Use GetInputList for OBS WebSocket API v5+
    const { inputs } = await obs.call('GetInputList');
    return inputs.map((input) => input.inputName); // Return an array of input names
  } catch (err) {
    console.error('Failed to fetch sources from OBS:', err.message);
    throw err;
  }
}

async function checkSourceExists(sourceName) {
  try {
    const sourceList = await getSourceList();
    return sourceList.includes(sourceName);
  } catch (err) {
    console.error('Failed to check source existence:', err.message);
    throw err;
  }
}

module.exports = {
  connectOBS,
  getSourceList,
  checkSourceExists,
};
