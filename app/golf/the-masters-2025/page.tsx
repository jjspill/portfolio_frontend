import { PageContainer } from '@/app/components/templates/PageContainer';
import LeaderboardClient from './train-client'; // client component

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LeaderboardPage = async () => {
  const leagueId = 'The Masters 2025';

  // Fetch on the server
  const [liveRes, teamRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/golf/api/live-data`, {
      cache: 'no-store',
    }),
    fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/golf/api/league-data?leagueId=${encodeURIComponent(leagueId)}`,
      {
        cache: 'no-store',
      }
    ),
  ]);

  const [liveScores, teamData] = await Promise.all([
    liveRes.json(),
    teamRes.json(),
  ]);

  return (
    <PageContainer className="bg-none shadow-none rounded-none">
      <LeaderboardClient
        leagueId={leagueId}
        liveScores={liveScores}
        teamData={teamData}
      />
    </PageContainer>
  );
};

export default LeaderboardPage;
