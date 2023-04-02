import gql from "graphql-tag";
import { Region } from "../riot-data/api/regionConversion";
import { matchRepos } from "../repository/match.repo";
import { CacheContext } from "../utils/request-cache";
import { ActiveGame } from "../riot-data/responses/ActiveGame";
import { resolveQueryable, infoFields } from "../utils/graphql";
import { SummonerQuery, retrieveSummonerCached } from "./summoner.graph";

export const activeGameTypeDefs = gql`
  type ActiveGame {
    id: String,
    region: String,
    gameId: Int,
    mapId: Int,
    gameMode: String,
    gameType: String,
    gameQueueConfigId: Int,
    participants: [ActiveParticipant],
    observers: Observers,
    bannedChampions: [BannedChampion],
    gameStartTime: BigInt,
    gameLength: Int
  }

  type BannedChampion {
    championId: Int,
    teamId: Int,
    pickTurn: Int
  }

  type Observers {
    encryptionKey: String!
  }

  type ActiveParticipant {
    teamId: Int,
    spell1Id: Int,
    spell2Id: Int,
    championId: Int,
    profileIconId: Int,
    summoner: Summoner,
    bot: Boolean,
    gameCustomizationObjects: [GameCustomizationObject],
    perks: Perks
  }
  
  type GameCustomizationObject {
    category: String,
    content: String
  }

  type Perks {
    perkIds: [Int],
    perkStyle: Int,
    perkSubStyle: Int
  }
`

export async function retrieveActiveGame(context: CacheContext, { region, summonerId }: { region: Region, summonerId: string }) {
  const cachePromise = context.cache.getEntry<ActiveGame>(['activeGame', region, summonerId]);
  if (cachePromise) {
    return await cachePromise;
  }

  const activeGame = await context.cache.setRequest(['activeGame', region, summonerId], matchRepos[region].getActiveGameFor(summonerId));

  if (activeGame) {
    context.cache.setEntry(['activeGame', region, summonerId], activeGame);
  }
  
  return activeGame;
}

export const activeGameResolvers = {
  ActiveParticipant: {
    summoner: async ({
      summoner,
    }: { summoner: SummonerQuery }, _: any, context: any, info: any) => {;
      const res = await resolveQueryable(
        summoner,
        infoFields(info),
        q => retrieveSummonerCached(context, q),
        ['matches', 'ranks', 'activeGame']
      );
      return res;
    }
  }
}