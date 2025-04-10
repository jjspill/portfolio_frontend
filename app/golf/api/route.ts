import { getAPIUrl } from 'config/config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const apiUrl = getAPIUrl();
  const username = request.headers.get('Username');

  if (!username) {
    return new NextResponse(
      JSON.stringify({ error: 'An account is required to access this page.' })
    );
  }

  const encodedUsername = encodeURIComponent(username);

  try {
    const res = await fetch(`${apiUrl}/golf/teams/user/${encodedUsername}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    });

    const team = await res.json();
    return new NextResponse(JSON.stringify(team?.data));
  } catch (error) {
    console.error('Error in /golf POST request: ', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to get teams', error })
    );
  }
}
