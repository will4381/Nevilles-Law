import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'concepts_techniques.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const parsedData = JSON.parse(jsonData);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('API: Error reading or parsing JSON:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}