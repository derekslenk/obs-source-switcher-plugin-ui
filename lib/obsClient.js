import { OBSWebSocket } from 'obs-websocket-js';
import config from '../config';

let obs = null;

export async function initializeOBSConnection() {
  if (!obs) {
    obs = new OBSWebSocket();
    try {
      await obs.connect(`ws://${config.OBS_WEBSOCKET_HOST}:${config.OBS_WEBSOCKET_PORT}`, config.OBS_WEBSOCKET_PASSWORD);
      console.log('Connected to OBS WebSocket server.');
    } catch (err) {
      console.error('Failed to connect to OBS WebSocket server:', err.message);
      throw err;
    }
  }
}

export function getOBSClient() {
  if (!obs) {
    throw new Error('OBS WebSocket client is not initialized. Call initializeOBSConnection() first.');
  }
  return obs;
}
