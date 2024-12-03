const path = require('path');

const config = {
  FILE_DIRECTORY: path.resolve(process.env.FILE_DIRECTORY || './files'),
};

module.exports = config;
