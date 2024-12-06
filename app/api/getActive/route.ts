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
        const topLeftPath = path.join(FILE_DIRECTORY, 'topLeft.txt');
        const topRightPath = path.join(FILE_DIRECTORY, 'topRight.txt');
        const bottomLeftPath = path.join(FILE_DIRECTORY, 'bottomLeft.txt');
        const bottomRightPath = path.join(FILE_DIRECTORY, 'bottomRight.txt');
    
        const large = fs.existsSync(largePath) ? fs.readFileSync(largePath, 'utf-8') : null;
        const left = fs.existsSync(leftPath) ? fs.readFileSync(leftPath, 'utf-8') : null;
        const right = fs.existsSync(rightPath) ? fs.readFileSync(rightPath, 'utf-8') : null;
        const topLeft = fs.existsSync(topLeftPath) ? fs.readFileSync(topLeftPath, 'utf-8') : null;
        const topRight = fs.existsSync(topRightPath) ? fs.readFileSync(topRightPath, 'utf-8') : null;
        const bottomLeft = fs.existsSync(bottomLeftPath) ? fs.readFileSync(bottomLeftPath, 'utf-8') : null;
        const bottomRight = fs.existsSync(bottomRightPath) ? fs.readFileSync(bottomRightPath, 'utf-8') : null;

        
        console.log(bottomLeft)
        return NextResponse.json({ large, left, right, topLeft, topRight, bottomLeft, bottomRight }, {status: 201})
      } catch (error) {
        console.error('Error reading active sources:', error);
        return NextResponse.json({ error: 'Failed to read active sources' }, {status: 500});
      }

}