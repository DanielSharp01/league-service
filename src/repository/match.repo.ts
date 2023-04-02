import { ActiveGame, Match, MatchTimeline } from "../model/Match";
import { Summoner } from "../model/Summoner";
import { matchApi } from "../riot-data/api/match.api";
import { Region, SummonerApiRegion, apiRegionToRegion, regionToApiRegion } from "../riot-data/api/regionConversion";
import { spectatorApi } from "../riot-data/api/spectator";
import { objectMap } from "../utils/object-utils";

export interface MatchRepo {
  getById(id: string): Promise<Match | undefined>;
  getAllByPuuid(puuid: string, offset: number, limit: number): Promise<string[]>;
  getTimelineById(id: string): Promise<MatchTimeline | undefined>;
  getActiveGameFor(summonerId: string): Promise<ActiveGame | undefined>;
}

export function createRiotMatchRepo(region: Region): MatchRepo {
  return {
    getById: async (id: string): Promise<Match | undefined> => {
      const match = await matchApi[region].byId(id);
      if (!match) return match;

      const { info, metadata: { participants: _, ...metadata } } = match;
      return {
        id,
        region: apiRegionToRegion[info.platformId.toLowerCase() as SummonerApiRegion],
        ...info,
        ...metadata,
      }
    },
    getAllByPuuid: async (puuid: string, offset: number, limit: number): Promise<string[]> => {
      return await matchApi[region].allByPuuid(puuid, offset, limit);
    },
    getTimelineById: async (id: string): Promise<MatchTimeline | undefined> => {
      const timeline = await matchApi[region].timelineById(id);
      if (!timeline) return timeline;

      const { info: { gameId: _, participants, frames, ...info }, metadata: __ } = timeline;
      const mappedInfo = { ...info, frames: frames.map(({ participantFrames, ...f }) => ({
        ...f,
        participantFrames: Object.entries(participantFrames).map(([participantId, pf]) => ({
          summoner: { puuid: participants.find(p => p.participantId.toString() === participantId)!.puuid } as Summoner,
          ...pf
        })),
      })) };
      return mappedInfo;
    },
    getActiveGameFor: async (summonerId: string): Promise<ActiveGame | undefined> => {
      const activeGame = await spectatorApi[region].activeGameFor(summonerId);
      if (!activeGame) return activeGame;

      const { platformId, participants, ...game } = activeGame;
      return {
        id: platformId,
        region: apiRegionToRegion[platformId.toLowerCase() as SummonerApiRegion],
        participants: participants.map(({ summonerName, summonerId, ...p }) => ({
          ...p,
          summoner: { region, name: summonerName, id: summonerId } as Summoner
        })),
        ...game
      };
    }
  }
}

export const matchRepos = objectMap(regionToApiRegion, (_, key) => createRiotMatchRepo(key));