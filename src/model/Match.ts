import { Info, Metadata } from "../riot-data/responses/Match";
import { ParticipantFrame, TimelineFrame, TimelineInfo } from "../riot-data/responses/MatchTimeline";
import { Summoner } from "./Summoner";
import { ActiveGame as RiotActiveGame, Participant as ActiveGameParticipant } from "../riot-data/responses/ActiveGame";
import { Region } from "../riot-data/api/regionConversion";

export type Match = Omit<Info, 'plaformId'> &
  Omit<Metadata, 'participants'> &
  {
    id: string;
    region: Region
  };

export type MatchTimeline = Omit<TimelineInfo, 'gameId' | 'participants' | 'frames'> & {
  frames: (Omit<TimelineFrame, 'participantFrames'> & {
    participantFrames: (ParticipantFrame & { summoner: Summoner })[]
  })[]
};

export type ActiveGame = Omit<RiotActiveGame, 'platformId' | 'participants'> & {
  region: Region,
  id: string,
  participants: (Omit<ActiveGameParticipant, 'summonerId' | 'summonerName'> & { summoner: Summoner })[]
};