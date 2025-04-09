'force dynamic';

import { PageContainer } from '@/app/components/templates/PageContainer';
import { LeaderboardContainer } from './leaderboardContainer';

async function LeaderboardPage({ params }: { params: any }) {
  return (
    <PageContainer className="bg-none shadow-none rounded-none">
      <LeaderboardContainer leagueId={params.id} />
    </PageContainer>
  );
}

export default LeaderboardPage;

export async function generateStaticParams() {
  const res = await fetch('https://api.james-spillmann.com/golf/leagues', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
    next: { revalidate: 15 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  const data = await res.json();

  if (!data?.data) {
    return [];
  }

  console.log(data);

  return data?.data?.map((league: string) => ({
    slug: league,
  }));
}
