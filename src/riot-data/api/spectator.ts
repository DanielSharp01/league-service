import { objectMap } from "../../utils/object-utils";
import { ActiveGame } from "../responses/ActiveGame";
import { createAxios } from "./base";
import { SummonerApiRegion, regionToApiRegion } from "./regionConversion";

const spectatorApiForRegion = (region: SummonerApiRegion) => {
  const axiosInstance = createAxios(`https://${region}.api.riotgames.com/lol/spectator/v4`);

  return {
    activeGameFor: (summonerId: string): Promise<ActiveGame> => {
      console.log('Getting active game for', summonerId);
      return axiosInstance.get(`/active-games/by-summoner/${summonerId}`);
    }
  }
}

export const spectatorApi = objectMap(regionToApiRegion, value => spectatorApiForRegion(value));