import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const quotesPath = path.join(process.cwd(), 'public', 'quotes.json');
const conceptsPath = path.join(process.cwd(), 'public', 'concepts.json');

export async function GET() {
  try {
    const quotesData = JSON.parse(await fs.readFile(quotesPath, 'utf8'));
    const conceptsData = JSON.parse(await fs.readFile(conceptsPath, 'utf8'));

    const randomQuote = quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
    const randomConcept = conceptsData.concepts[Math.floor(Math.random() * conceptsData.concepts.length)];

    const dailyContent = {
      quote: randomQuote,
      concept: randomConcept,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(dailyContent);
  } catch (error) {
    console.error('API: Error reading or generating content:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function POST() {
  // For now, just return the same as GET
  return GET();
}