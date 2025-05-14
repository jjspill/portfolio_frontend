import Link from 'next/link';

interface GolfTeamProps {
  teamName: string;
  teamID: string;
  teamMembers: string[];
  userID: string;
}

interface GolfLeagueProps {
  leagueName: string;
  leagueID: string;
  teams: GolfTeamProps[];
}

interface DisplayTeamProps {
  teamName: string;
  leagueName: string;
  teamId: string;
  leagueId: string;
}

interface GolfContainerProps {
  children: React.ReactNode;
  title: string;
}

interface GolfLeagueProps {
  leagueName: string;
  leagueID: string;
  teams: GolfTeamProps[];
}

export const GolfTeamLoader: React.FC = () => {
  return (
    <div className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg my-3 w-full ">
      <div className="animate-pulse flex justify-between items-center w-full h-[24px]">
        <div className="flex-1 text-center px-2">
          <div className="bg-gray-400 w-full h-4" />
        </div>
        <div className="bg-gray-800 w-[2px] h-4 mx-4" />{' '}
        <div className="flex-1 text-center px-2">
          <div className="bg-gray-400 w-full h-4" />
        </div>
      </div>
    </div>
  );
};

export const GolfContainer: React.FC<GolfContainerProps> = ({
  children,
  title,
}) => {
  return (
    <div className="bg-white p-4 w-full min-w-lg md:min-w-l rounded-lg">
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="w-full h-[2px] bg-gray-800" />
        {children}
      </div>
    </div>
  );
};

export const GolfTeam: React.FC<DisplayTeamProps> = ({
  teamName,
  leagueName,
  teamId,
  leagueId,
}) => {
  return (
    <div className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg my-3 w-full">
      <Link href={`/golf/the-pga-championship-2025`}>
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 text-center pr-2">
            <p>{teamName}</p>
          </div>
          <div className="bg-gray-800 w-[2px] h-4 mx-4" />
          <div className="flex-1 text-center pl-2">
            <p>{leagueName}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const GolfLeague: React.FC<GolfLeagueProps> = ({
  leagueName,
  leagueID,
  teams,
}) => {
  return (
    <div>
      <Link
        href={`/golf/the-pga-championship-2025`}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <div className="flex justify-start items-center">
          <p>{leagueName}</p>
        </div>
      </Link>
    </div>
  );
};
