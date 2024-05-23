import { getAPIUrl } from 'config/config';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const apiUrl = getAPIUrl();
    const res = await fetch(`${apiUrl}/account/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error('Failed to login:', error);
    return new Response(JSON.stringify({ message: 'Failed to login', error }));
  }
}
