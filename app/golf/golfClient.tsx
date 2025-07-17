'use client';

import useSWR, { BareFetcher, SWRConfiguration } from 'swr';
import Link from 'next/link';
import { useUser } from '../contexts/UserContext';
import { GolfContainer, GolfTeam, GolfTeamLoader } from './components/Golf';
import { PageContainer } from '../components/templates/PageContainer';

interface UserGolfTeam {
  leagueId: string;
  players: string[];
  name: string;
  userId: string;
}

const fetcher = async (args: [string, string]): Promise<UserGolfTeam[]> => {
  const [url, username] = args;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Username: username,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return await response.json();
};

const swrConfig: SWRConfiguration<
  UserGolfTeam[],
  any,
  BareFetcher<UserGolfTeam[]>
> = {
  onError: (error) => {
    console.error('Fetching error:', error);
  },
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

export const GolfHomePage = () => {
  const { user } = useUser();

  const { data: userGolfData, error } = useSWR<UserGolfTeam[]>(
    user ? [`/golf/api`, user.username] : null,
    fetcher,
    swrConfig
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-lg">
          <div className="flex flex-col max-w-2xl bg-white items-center justify-center mt-20 p-5 h-hit w-fit rounded-xl shadow-lg mx-5">
            <div className="p-5 text-center rounded-xl  h-fit w-fit">
              An account is required to access this page. Please sign in or
              create one below.
            </div>
            <Link href="/login" className="w-fit h-fit">
              <div className="px-5 py-3 h-fit w-fit bg-gray-200 hover:bg-gray-300 rounded-xl shadow-lg ">
                Sign In or Create Account
              </div>
            </Link>
          </div>
          <div>
            <div className="w-full h-fit rounded-lg pt-2 px-4 text-center">
              <Link href={`/golf/the-open-championship-2025`}>
                <div className="bg-green-500 hover:bg-green-600 w-full rounded-lg my-2 px-4 py-2 shadow-lg">
                  <p className="text-white font-bold text-xl">
                    View Leaderboard
                  </p>
                </div>
              </Link>
            </div>
            <InstructionsDiv />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="pt-20">Failed to load data</div>;

  return (
    <PageContainer className="bg-none shadow-none rounded-none max-w-lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex justify-center items-center space-x-4 w-full">
          {userGolfData && (
            <>
              <GolfContainer title="Teams">
                {userGolfData.length > 0 ? (
                  userGolfData.map((team) => {
                    return (
                      <div key={team.leagueId} className="w-full">
                        <GolfTeam
                          teamName={team.name}
                          leagueName={team.leagueId}
                          teamId={team.userId}
                          leagueId={team.leagueId}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="pt-4 text-center w-full">
                    No teams found, join a league!
                  </div>
                )}
              </GolfContainer>
              {/* <GolfContainer title="Leagues">
              {userGolfData.map((team) => {
                return (
                  <div key={team.leagueId}>
                    <Link href={`/golf/leagues/${team.leagueId}`}>
                      <GolfTeam
                        teamName={team.name}
                        leagueName={team.leagueId}
                        teamId={team.userId}
                        leagueId={team.leagueId}
                      />
                    </Link>
                  </div>
                );
              })}
            </GolfContainer> */}
            </>
          )}

          {!userGolfData && (
            <GolfContainer title="Teams">
              {Array.from({ length: 3 }, (_, index) => {
                return <GolfTeamLoader key={index} />;
              })}
            </GolfContainer>
          )}
        </div>
        <div className="w-full h-fit rounded-lg py-2 px-4 text-center">
          <Link href={`/golf/the-open-championship-2025`}>
            <div className="bg-green-500 hover:bg-green-600 w-full rounded-lg my-2 px-4 py-2 shadow-lg">
              <p className="text-white font-bold text-xl">View Leaderboard</p>
            </div>
          </Link>
        </div>
        <div className="w-full h-fit rounded-lg py-2 px-4 text-center">
          <Link href="/golf/join-league">
            <div className="bg-green-500 hover:bg-green-600 w-full rounded-lg my-2 px-4 py-2 shadow-lg">
              <p className="text-white font-bold text-xl">
                Join The Open Championship 2025
              </p>
            </div>
          </Link>
        </div>
        <InstructionsDiv />
      </div>
    </PageContainer>
  );
};

const InstructionsDiv = () => {
  return (
    <div className="bg-white p-5 mt-5 text-left rounded-xl text-pretty shadow-lg">
      <h1 className="font-bold mb-4">How to Play</h1>
      <div className="text-sm">
        <p>1. Create an account and login</p>
        <p>3. Join the league and pick your team</p>
        <p>
          4. After submitting your picks, the leaderboard will update but your
          picks might not show up immediately, refresh
        </p>
        <p>5. To change picks, join the league again with the same account</p>
        <p className="font-bold">
          Note: Opponents picks are hidden until first tee and after that
          leagues are unable to be joined
        </p>
      </div>
    </div>
  );
};
