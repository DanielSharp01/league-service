export interface ActiveGame {
  gameId: number;
  mapId: number;
  gameMode: string;
  gameType: string;
  gameQueueConfigId: number;
  participants: Participant[];
  observers: Observers;
  platformId: string;
  bannedChampions: BannedChampion[];
  gameStartTime: number;
  gameLength: number;
}

export interface BannedChampion {
  championId: number;
  teamId: number;
  pickTurn: number;
}

export interface Observers {
  encryptionKey: string;
}

export interface Participant {
  teamId: number;
  spell1Id: number;
  spell2Id: number;
  championId: number;
  profileIconId: number;
  summonerName: string;
  summonerId: string;
  bot: boolean;
  gameCustomizationObjects: GameCustomizationObject[];
  perks: Perks;
}

export interface GameCustomizationObject {
  category: string;
  content: string;
}

export interface Perks {
  perkIds: number[];
  perkStyle: number;
  perkSubStyle: number;
}
