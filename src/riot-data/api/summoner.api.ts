import { objectMap } from "../../utils/object-utils";
import { Summoner } from "../responses/Summoner";
import { createAxios } from "./base";
import { regionToApiRegion, SummonerApiRegion } from "./regionConversion";

const summonerApiForRegion = (regionApi: SummonerApiRegion) => {
  const axiosInstance = createAxios(`https://${regionApi}.api.riotgames.com/lol/summoner/v4`);

  return {
    byId: (id: string): Promise<Summoner> => {
      console.log('Getting summoner by id', id);
      return axiosInstance.get(`/summoners/${id}`);
    },
    byName: (name: string): Promise<Summoner> => {
      console.log('Getting summoner by name', name);
      return axiosInstance.get(`/summoners/by-name/${name}`);
    },
    byPuuid: (puuid: string): Promise<Summoner> => {
      console.log('Getting summoner by puuid', puuid);
      return axiosInstance.get(`/summoners/by-puuid/${puuid}`);
    }
  }
}

export const summonerApi = objectMap(regionToApiRegion, value => summonerApiForRegion(value));