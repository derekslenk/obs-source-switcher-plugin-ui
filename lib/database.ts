import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

const FILE_DIRECTORY = path.resolve(process.env.FILE_DIRECTORY || './files')

export const getDatabase = async () => {
  if (!db) {
    db = await open({
      filename: path.join(FILE_DIRECTORY, 'sources.db'),
      driver: sqlite3.Database,
    });
    console.log('Database connection established.');
  }
  return db;
}

// export default getDatabase