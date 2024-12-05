import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import config from '../../../config';

// Ensure directory exists
if (!fs.existsSync(config.FILE_DIRECTORY)) {
  fs.mkdirSync(config.FILE_DIRECTORY, { recursive: true });
}

export async function GET(request: NextRequest) {
    try {
        const largePath = path.join(config.FILE_DIRECTORY, 'large.txt');
        const leftPath = path.join(config.FILE_DIRECTORY, 'left.txt');
        const rightPath = path.join(config.FILE_DIRECTORY, 'right.txt');
    
        const large = fs.existsSync(largePath) ? fs.readFileSync(largePath, 'utf-8') : null;
        const left = fs.existsSync(leftPath) ? fs.readFileSync(leftPath, 'utf-8') : null;
        const right = fs.existsSync(rightPath) ? fs.readFileSync(rightPath, 'utf-8') : null;
        
        return NextResponse.json({ large, left, right }, {status: 201})
      } catch (error) {
        console.error('Error reading active sources:', error);
        return NextResponse.json({ error: 'Failed to read active sources' }, {status: 500});
      }

}