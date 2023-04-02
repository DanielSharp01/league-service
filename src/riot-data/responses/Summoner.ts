export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number; // Unix timestamp in milliseconds
  summonerLevel: number;
}