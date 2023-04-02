export type League = {
  leagueId: string,
  queueType: "RANKED_SOLO_5x5" | "RANKED_FLEX_SR",
  tier: "IRON" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "GRANDMASTER" | "CHALLENGER",
  name: string,
  entries: LeagueEntryShort[]
}

export type LeagueEntryShort = Omit<LeagueEntry, 'leagueId' | 'queue'>;

export interface LeagueEntry {
  leagueId: string;
  summonerId?: string;
  summonerName?: string;
  queueType: League['queueType'];
  tier: League['tier'];
  rank: "I" | "II" | "III" | "IV"; // "I" even in grandmaster and challenger leagues
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
  miniSeries?: MiniSeries;
}

interface MiniSeries {
  target: number;
  wins: number;
  losses: number;
  progress: string;
}