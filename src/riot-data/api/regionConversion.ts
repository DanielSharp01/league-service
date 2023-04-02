import { reverseMap } from "../../utils/object-utils";

export const regionToApiRegion = {
  'EUNE': 'eun1',
  'EUW': 'euw1'
} as const;

export const apiRegionToRegion = reverseMap(regionToApiRegion);

export const regionToMatchApiRegion = {
  'EUNE': 'EUROPE',
  'EUW': 'EUROPE'
} as const;

export type Region = keyof typeof regionToApiRegion;
export type SummonerApiRegion = typeof regionToApiRegion[Region];
export type MatchApiRegion = typeof regionToMatchApiRegion[Region];