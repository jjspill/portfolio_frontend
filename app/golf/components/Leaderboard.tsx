'use client';

import React, { useState } from 'react';
import {
  PlayerData,
  ScoreboardRowData,
} from '../leaderboard/leaderboardHelpers';
import course from '../course.json';

interface LeaderboardRowProps {
  name: string;
  total_score?: number;
  players: {
    firstName: string;
    lastName: string;
    score?: number;
    cutStatus?: string;
    playingStatus?: string;
    round?: number;
    numHoles?: number;
    todaysScore?: string | number | null;
    scoreList?: number[];
  }[];
}

export const LeaderboardRowLoader: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-[48px] p-2 rounded-xl bg-gray-200 w-full">
      <div className="flex-grow text-left h-[10px] rounded-md animate-pulse bg-gray-400" />
    </div>
  );
};

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  name,
  total_score,
  players,
}) => {
  const [showPlayers, setShowPlayers] = useState(false);

  const togglePlayers = () => {
    setShowPlayers(!showPlayers);
  };

  let playerOrder = players;

  // if no players have an undefined score sort them by score
  if (players.every((player) => player.score !== undefined)) {
    playerOrder = players.sort((a, b) => a.score! - b.score!);
  }

  return (
    <div className="flex flex-col justify-between p-2 rounded-xl bg-gray-200 w-full">
      <button
        onClick={togglePlayers}
        className="flex justify-between items-center w-full text-black py-1 px-3 rounded"
        aria-label={showPlayers ? 'Hide Players' : 'Show Players'}
      >
        <p className="flex-grow text-left">{name}</p>
        <p className="text-center w-10 pr-10">{total_score}</p>
        <svg
          className={`transform transition-transform duration-300 ${
            showPlayers ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="24"
          height="24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          ></path>
        </svg>
      </button>

      {showPlayers && players && (
        <div className="mt-4">
          {playerOrder?.map((player, index) => (
            <div
              key={index}
              className={`mt-2 p-2 rounded shadow bg-green-100
                `}
              // ${
              //   index === playerOrder.length - 1
              //     ? 'bg-red-100'
              //     : 'bg-green-100'
              // }
            >
              <p>
                {player.firstName} {player.lastName}
              </p>
              {player.cutStatus === 'cut' && <p>Status: Cut</p>}
              {player.cutStatus !== 'cut' && (
                <p>Status: {player.playingStatus}</p>
              )}
              {(player?.round! > 1 || player.numHoles) && (
                <>
                  <p>Total: {fixScore(player.score)}</p>
                </>
              )}
              {player?.numHoles && player?.numHoles >= 1 && (
                <>
                  <p>Today: {fixScore(player.todaysScore)}</p>
                  <p>Through: {player.numHoles}</p>
                  <Scorecard scores={player.scoreList!} />
                </>
              )}
              {/* <p>Round: {player.round}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const convertUTCDateToLocalDate = (date: string): string => {
  const newDate = new Date(date);
  return newDate.toLocaleString('en-US', { timeZoneName: 'short' });
};

export function UpdatedTime({ date }: { date: string }) {
  const convertedTime = React.useMemo(
    () => convertUTCDateToLocalDate(date),
    [date]
  );

  return <span className="text-sm">{convertedTime}</span>;
}

function fixScore(
  score: string | number | undefined | null
): number | string | undefined {
  if (!score && score !== 0) {
    return undefined;
  }
  if (score === 0) {
    return 'E';
  }
  if ((score as number) > 0) {
    return `+${score}`;
  }
  return score;
}

interface ScorecardProps {
  scores: number[];
}

const Scorecard: React.FC<ScorecardProps> = ({ scores }) => {
  const [showScorecard, setShowScorecard] = useState(false);

  const toggleScorecard = () => {
    setShowScorecard(!showScorecard);
  };

  return (
    <>
      <button
        onClick={toggleScorecard}
        className="text-white bg-gray-800 font-bold p1-2 px-4 rounded"
      >
        Scorecard
      </button>

      {showScorecard && (
        <div className="overflow-x-auto pt-2">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Hole</th>
                <th className="px-4 py-2">Par</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {course.holes.map(
                (hole: { hole_number: number; par: number }, index: number) => (
                  <tr
                    key={index}
                    className={`${
                      scores[index] < hole.par
                        ? 'bg-green-200'
                        : scores[index] > hole.par
                        ? 'bg-red-200'
                        : 'bg-white'
                    }`}
                  >
                    <td className="border px-4 py-2 text-center">
                      {hole.hole_number}
                    </td>
                    <td className="border px-4 py-2 text-center">{hole.par}</td>
                    <td className="border px-4 py-2 text-center">
                      {scores[index]}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Scorecard;
