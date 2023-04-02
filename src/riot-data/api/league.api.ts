import { objectMap } from "../../utils/object-utils";
import { League, LeagueEntry } from "../responses/League";
import { createAxios } from "./base";
import { regionToApiRegion, SummonerApiRegion } from "./regionConversion";

const leagueApiForRegion = (regionApi: SummonerApiRegion) => {
  const axiosInstance = createAxios(`https://${regionApi}.api.riotgames.com/lol/league/v4`);

  return {
    byId: (id: string): Promise<League> => {
      return axiosInstance.get(`/leagues/${id}`);
    },
    masterLeague: (queue: League['queueType']): Promise<League> => {
      return axiosInstance.get(`/masterleagues/by-queue/${queue}`);
    },
    grandMasterLeague: (queue: League['queueType']): Promise<League> => {
      return axiosInstance.get(`/grandmasterleagues/by-queue/${queue}`);
    },
    challengerLeague: (queue: League['queueType']): Promise<League> => {
      return axiosInstance.get(`/challengerleagues/by-queue/${queue}`);
    },
    lowEloEntries: (queue: League['queueType'], tier: League['tier'], rank: LeagueEntry['rank'], page?: number): Promise<LeagueEntry[]> => {
      return axiosInstance.get(`/entries/${queue}/${tier}/${rank}?page=${page || 1}`);
    },
    summonerEntries: (summonerId: string): Promise<LeagueEntry[]> => {
      console.log('Getting summoner league entries by summonerId', summonerId);
      return axiosInstance.get(`/entries/by-summoner/${summonerId}`);
    }
  }
}

export const leagueApi = objectMap(regionToApiRegion, value => leagueApiForRegion(value));