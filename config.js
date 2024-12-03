const path = require('path');

const config = {
  FILE_DIRECTORY: path.resolve(process.env.FILE_DIRECTORY || './files'),
  OBS_WEBSOCKET_HOST: process.env.OBS_WEBSOCKET_HOST || '127.0.0.1', // Do not use path.resolve here
  OBS_WEBSOCKET_PORT: process.env.OBS_WEBSOCKET_PORT || '4455',
  OBS_WEBSOCKET_PASSWORD: process.env.OBS_WEBSOCKET_PASSWORD || '',
};

module.exports = config;
