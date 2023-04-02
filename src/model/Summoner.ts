import { Summoner as RiotSummoner } from "../riot-data/responses/Summoner";

export interface SummonerRank {
  tier: string;
  division: number;
  lp: number;
  series?: string;
}

export type Summoner = RiotSummoner & { region: string };