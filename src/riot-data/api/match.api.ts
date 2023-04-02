import { objectMap } from "../../utils/object-utils";
import { Match } from "../responses/Match";
import { MatchTimeline } from "../responses/MatchTimeline";
import { createAxios } from "./base";
import { MatchApiRegion, regionToMatchApiRegion } from "./regionConversion";

const matchApiForRegion = (region: MatchApiRegion) => {
  const axiosInstance = createAxios(`https://${region}.api.riotgames.com/lol/match/v5`);

  return {
    byId: (id: string): Promise<Match> => {
      console.log('Getting match by id', id);
      return axiosInstance.get(`/matches/${id}`);
    },
    timelineById: (id: string): Promise<MatchTimeline> => {
      console.log('Getting match timeline by id', id);
      return axiosInstance.get(`/matches/${id}/timeline`);
    },
    allByPuuid: (puuid: string, start: number, count: number): Promise<string[]> => {
      console.log('Getting all matches by puuid', puuid);
      return axiosInstance.get(`/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`);
    }
  }
}

export const matchApi = objectMap(regionToMatchApiRegion, value => matchApiForRegion(value));