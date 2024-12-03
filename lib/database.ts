import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('C:/OBS/source-switching/sources.db', (err) => {
  if (err) console.error('Error connecting to SQLite:', err.message);
  else console.log('Connected to SQLite database.');
});

export default db;
