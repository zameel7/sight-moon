import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const date = searchParams.get('date');

  if (!lat || !lon || !date) {
    return NextResponse.json(
      { error: 'Missing required parameters: lat, lon, date' },
      { status: 400 }
    );
  }

  const apiKey = process.env.API_VERSE_API_KEY;

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.apiverve.com/v1/moonposition?lat=${lat}&lon=${lon}&date=${date}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching moon position:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moon position data' },
      { status: 500 }
    );
  }
}
