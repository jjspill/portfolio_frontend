'use client';

import { useUser } from '@/app/contexts/UserContext';
import { useEffect, useState } from 'react';
import { assignScoresToTeams, getScores, shouldDisplayData } from './helpers';
import {
  LeaderboardRow,
  LeaderboardRowLoader,
  UpdatedTime,
} from '../components/Leaderboard';

interface LeaderboardContainerProps {
  leagueId: string;
  liveScores: any;
  teamData: any[];
}

const LeaderboardClient = ({
  leagueId,
  liveScores,
  teamData,
}: LeaderboardContainerProps) => {
  const { user, setUser } = useUser();

  // empty state
  if (
    Object.keys(liveScores).length === 0 ||
    (teamData && teamData.length === 0)
  ) {
    return (
      <div className="items-justify-center w-full">
        <div className="flex flex-col space-y-2 w-full m-auto px-2 justify-center items-center max-w-lg">
          <div className="bg-gray-200 font-semibold text-2xl p-4 rounded-lg text-center mb-10 h-[120px]">
            <h1>{leagueId} Leaderboard</h1>
            <div className="bg-gray-400 animate-pulse w-full h-4 mt-3"></div>
          </div>
          <div className="w-full px-2 space-y-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <LeaderboardRowLoader key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const updatedAt = liveScores?.live_details?.updated;
  const scores = getScores(liveScores);

  const { sortedTeams, highestScore } = assignScoresToTeams(teamData, scores);
  const leagueData = sortedTeams ? sortedTeams : teamData;
  const pgaHasStarted = shouldDisplayData();

  const round = liveScores?.results?.leaderboard[0]?.round;

  return (
    <div className="items-justify-center w-full">
      <div className="flex flex-col justify-center items-center m-auto w-full max-w-lg">
        <div className="bg-gray-200 font-semibold text-2xl p-4 rounded-lg text-center mb-10">
          <h1>{decodeURIComponent(leagueId)} Leaderboard</h1>
          <UpdatedTime date={updatedAt} />
          {round > 2 && (
            <p className="text-base">Missed Cut Score: {highestScore.score}</p>
          )}
        </div>
        <div className="w-full px-2 space-y-2">
          {pgaHasStarted &&
            leagueData &&
            leagueData.map((row: any, index: number) => (
              <LeaderboardRow key={index} {...row} />
            ))}
          {!pgaHasStarted &&
            leagueData &&
            user &&
            leagueData.map((row: any, index: number) => {
              if (row.userId === user.username) {
                return <LeaderboardRow key={index} {...row} />;
              }
              return null;
            })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardClient;
