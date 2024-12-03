import sqlite3 from 'sqlite3';
import path from 'path';
import config from '../config';

// Use the configured FILE_DIRECTORY to locate the database
const dbPath = path.join(config.FILE_DIRECTORY, 'sources.db');

// Ensure the directory exists
import fs from 'fs';
if (!fs.existsSync(config.FILE_DIRECTORY)) {
  fs.mkdirSync(config.FILE_DIRECTORY, { recursive: true });
}

// Create and export the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
  }
});

export default db;
