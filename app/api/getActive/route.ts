import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// import config from '../../../config';

const FILE_DIRECTORY = path.resolve(process.env.FILE_DIRECTORY || './files')
// Ensure directory exists
if (!fs.existsSync(FILE_DIRECTORY)) {
  fs.mkdirSync(FILE_DIRECTORY, { recursive: true });
}
console.log('using',  FILE_DIRECTORY)

export async function GET(request: NextRequest) {
    try {
        const largePath = path.join(FILE_DIRECTORY, 'large.txt');
        const leftPath = path.join(FILE_DIRECTORY, 'left.txt');
        const rightPath = path.join(FILE_DIRECTORY, 'right.txt');
    
        const large = fs.existsSync(largePath) ? fs.readFileSync(largePath, 'utf-8') : null;
        const left = fs.existsSync(leftPath) ? fs.readFileSync(leftPath, 'utf-8') : null;
        const right = fs.existsSync(rightPath) ? fs.readFileSync(rightPath, 'utf-8') : null;
        
        console.log(large)
        return NextResponse.json({ large, left, right }, {status: 201})
      } catch (error) {
        console.error('Error reading active sources:', error);
        return NextResponse.json({ error: 'Failed to read active sources' }, {status: 500});
      }

}