import { getAPIUrl } from 'config/config';
import { NextRequest } from 'next/server';
import { splitName } from '../../leaderboard/leaderboardHelpers';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const apiUrl = getAPIUrl();

  const leagueId = request.nextUrl.searchParams.get('leagueId');
  if (!leagueId) {
    return new Response(
      JSON.stringify({ error: 'An account is required to access this page.' })
    );
  }
  const encodedLeagueId = encodeURIComponent(leagueId);

  try {
    const res = await fetch(`${apiUrl}/golf/teams/${encodedLeagueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      next: { revalidate: 60 * 5 }, // 10 minutes
    });

    const league = await res.json();
    if (!league?.data) {
      console.error('No data available');
      return new Response(JSON.stringify({ error: 'No data available' }));
    }
    league.data.map((team: any) => {
      team.players = team.players.map((playerName: any) => {
        const { firstName, lastName } = splitName(playerName);
        return {
          firstName,
          lastName,
        };
      });
    });

    return new Response(JSON.stringify(league?.data));
  } catch (error) {
    console.error('Error in /golf POST request: ', error);
    return new Response(
      JSON.stringify({ message: 'Failed to get teams', error })
    );
  }
}
