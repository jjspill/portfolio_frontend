import { keys } from 'lodash';

export interface ScoreboardRowData {
  name: string;
  total_score: number;
  players?: PlayerData[];
  userId: string;
  leagueId: string;
}

export interface PlayerData {
  first_name: string;
  last_name: string;
  score: number;
  status: string;
  numHoles: number;
  round: number;
  todaysScore: string | number | null;
  scoreList: number[];
}

export interface Scores {
  [key: string]: PlayerData;
}

export interface Config {
  leagueId: string;
  players: string[];
  name: string;
  userId: string;
}

function fixFirstName(firstName: string) {
  if (firstName === 'Joohyun') {
    return 'Tom';
  }
  return firstName;
}

export function shouldDisplayData() {
  const now = new Date();
  const targetDate = new Date(Date.UTC(2025, 5, 12, 10, 45, 0));
  return now >= targetDate;
}

function getTotalOfLowestScores(scores: number[]): number {
  const sortedScores = scores.sort((a, b) => a - b);
  const lowest5Scores = sortedScores.slice(0, 4);
  const total = lowest5Scores.reduce((acc, score) => acc + score, 0);
  return total;
}

function sortTeamsByScore(
  scoreBoard: ScoreboardRowData[]
): ScoreboardRowData[] {
  return scoreBoard.sort((a, b) => a.total_score - b.total_score);
}

export function getScores(data: any): Scores {
  if (!data) return {};
  const scores = data.results.leaderboard.reduce((acc: any, item: any) => {
    const key = `${
      item.first_name.toLowerCase()[0]
    }_${item.last_name.toLowerCase()}`;
    acc[key] = {
      score: item.total_to_par,
      ...item,
    };
    return acc;
  }, {});

  return scores;
}

export function assignScoresToTeams(config: Config[], scores: Scores) {
  if (keys(scores).length === 0 || config.length === 0) {
    return { config, highestScore: { name: '', score: 0 } };
  }

  const highestScore = getHighestActiveScore(scores);
  if (!highestScore) {
    return { config, highestScore: { name: '', score: 0 } };
  }

  const updatedTeams = config.map((team: Config) => {
    const teamScores = team.players.map((player: any) => {
      player.firstName = fixFirstName(player.firstName);
      const key = `${
        player.firstName.toLowerCase()[0]
      }_${player.lastName.toLowerCase()}`;
      const score = scores[key];
      if (!score) {
        return player;
      }
      if (score.status === 'cut') {
        score.score = highestScore.score;
      }
      if (score) {
        return {
          ...player,
          score: score.score,
          cutStatus: score.status,
          playingStatus: !score.numHoles
            ? 'Awaiting Tee Time'
            : score.numHoles >= 18
            ? 'Done for Day'
            : 'Playing',
          numHoles: score.numHoles,
          round: score.round,
          todaysScore: score.todaysScore,
          scoreList: score.scoreList,
        };
      } else {
        return player;
      }
    });

    if (teamScores.some((player) => player.score === undefined)) {
      return {
        ...team,
        total_score: 0,
      };
    }

    const total = getTotalOfLowestScores(
      teamScores.map((player) => player?.score!)
    );

    team.players = teamScores;

    return {
      ...team,
      total_score: total,
    };
  });

  const sortedTeams = sortTeamsByScore(updatedTeams as []);
  return { sortedTeams, highestScore };
}

export function getHighestActiveScore(
  scores: Scores
): { name: string; score: number } | null {
  let highestScore = -Infinity;
  let highestScorer = null;

  for (const [name, data] of Object.entries(scores)) {
    if (data.status !== 'cut' && data.score > highestScore) {
      highestScore = data.score;
      highestScorer = { name, score: data.score };
    }
  }

  return highestScorer;
}

export function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const parts = name.trim().split(/\s+/); // Split by one or more spaces and handle extra spaces gracefully
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : ''; // Check if there is a last name
  return { firstName, lastName };
}
