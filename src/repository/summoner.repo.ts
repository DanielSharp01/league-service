import { Summoner, SummonerRank } from "../model/Summoner";
import { leagueApi } from "../riot-data/api/league.api";
import { Region, regionToApiRegion } from "../riot-data/api/regionConversion";
import { summonerApi } from "../riot-data/api/summoner.api";
import { objectMap } from "../utils/object-utils";

export type SummonerRanks = { soloQ?: SummonerRank, flex?: SummonerRank };

export interface SummonerRepo {
  getById(id: string): Promise<Summoner | undefined>;
  getByPuuid(puuid: string): Promise<Summoner | undefined>;
  getByName(name: string): Promise<Summoner | undefined>;
  getSummonerRanks(summonerId: string): Promise<SummonerRanks>;
}

function rankToNumber(rank: 'I' | 'II' | 'III' | 'IV') {
  if (rank === 'I') return 1;
  else if (rank === 'II') return 2;
  else if (rank === 'III') return 3;
  else return 4;
}

export function createRiotSummonerRepo(region: Region): SummonerRepo {
  return {
    getById: async (id: string): Promise<Summoner | undefined> => {
      const riotSummoner = await summonerApi[region].byId(id);
      return {
        ...riotSummoner,
        region: region
      }
    },
    getByPuuid: async (puuid: string): Promise<Summoner | undefined> => {
      const riotSummoner = await summonerApi[region].byPuuid(puuid);
      return {
        ...riotSummoner,
        region: region
      }
    },
    getByName: async (name: string): Promise<Summoner | undefined> => {
      const riotSummoner = await summonerApi[region].byName(name);
      return {
        ...riotSummoner,
        region: region
      }
    },
    getSummonerRanks: async (summonerId: string): Promise<SummonerRanks> => {
      const leagueEntries = await leagueApi[region].summonerEntries(summonerId);
      const soloq = leagueEntries.find(e => e.queueType === 'RANKED_SOLO_5x5');
      const flex = leagueEntries.find(e => e.queueType === 'RANKED_FLEX_SR');

      return {
        soloQ: soloq && {
          tier: soloq.tier,
          division: rankToNumber(soloq.rank),
          lp: soloq.leaguePoints,
          series: soloq.miniSeries?.progress
        },
        flex: flex && {
          tier: flex.tier,
          division: rankToNumber(flex.rank),
          lp: flex.leaguePoints,
          series: flex.miniSeries?.progress
        }
      }
    }
  }
}

export const summonerRepos = objectMap(regionToApiRegion, (_, key) => createRiotSummonerRepo(key));