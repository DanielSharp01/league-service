;import gql from "graphql-tag";
import { infoFields, resolveQueryable } from "../utils/graphql";
import { SummonerRanks, summonerRepos } from "../repository/summoner.repo";
import { Region } from "../riot-data/api/regionConversion";
import { matchRepos } from "../repository/match.repo";
import { Summoner } from "../model/Summoner";
import { CacheContext, setupCache } from "../utils/request-cache";
import { retrieveMatch } from "./match.graph";
import { retrieveActiveGame } from "./active-game.graph";

export const summonerTypeDefs = gql`
  type SummonerRank {
    tier: String!,
    division: Int!,
    lp: Int !,
    series: String
  }

  type SummonerRanks {
    soloQ: SummonerRank,
    flex: SummonerRank
  }

  type Summoner {
    id: String!,
    accountId: String!,
    region: String!,
    puuid: String!,
    name: String!,
    profileIconId: Int!,
    revisionDate: BigInt!,
    summonerLevel: Int!,
    ranks: SummonerRanks!
    matches(offset: Int, limit: Int): [Match!],
    activeGame: ActiveGame
  }

  type Query {
    getSummonerBy(region: String!, id: String, puuid: String, name: String): Summoner
  }
`

export type SummonerQuery = {
  region: Region,
  id?: string,
  puuid?: string,
  name?: string,
  summonerLevel?: number
}

export async function retrieveSummonerCached(context: CacheContext, { region, id, name, puuid }: SummonerQuery) {
  const cachePromise = context.cache.getEntry<Summoner>(['summoner', 'id', region, id]) ??
    context.cache.getEntry<Summoner>(['summoner', 'puuid', region, puuid]) ??
    context.cache.getEntry<Summoner>(['summoner', 'name', region, name]);
  
  if (cachePromise) {
    return await cachePromise;
  }

  const summoner = await (async () => {
    if (id) {
      return await context.cache.setRequest(['summoner', 'id', region, id], summonerRepos[region].getById(id));
    } else if (puuid) {
      return await context.cache.setRequest(['summoner', 'puuid', region, puuid], summonerRepos[region].getByPuuid(puuid));
    } else if (name) {
      return await context.cache.setRequest(['summoner', 'name', region, name], summonerRepos[region].getByName(name));
    }
    return undefined;
  })();

  if (summoner) {
    context.cache.setEntry(['summoner', 'id', region, summoner.id], summoner);
    context.cache.setEntry(['summoner', 'name', region, summoner.name], summoner);
    context.cache.setEntry(['summoner', 'puuid', region, summoner.puuid], summoner);
  }
  
  return summoner;
}

async function retrieveRanksCached(context: CacheContext, { region, id }: { region: Region, id: string }) {
  const cachePromise = context.cache.getEntry<SummonerRanks>(['summonerRanks', region, id]);
  
  if (cachePromise) {
    return await cachePromise;
  }

  const ranks = await context.cache.setRequest(['summoner', 'id', region, id], summonerRepos[region].getSummonerRanks(id));

  if (ranks) {
    context.cache.setEntry(['summoner', 'id', region, id], ranks);
  }
  
  return ranks;
}

async function retrieveMatchListCached(context: CacheContext, { region, puuid }: { region: Region, puuid: string }, offset: number, limit: number) {
  const cachePromise = context.cache.getEntry<string[]>(['summonerMatches', region, puuid]);
  
  if (cachePromise) {
    return await cachePromise;
  }

  const matches = await context.cache.setRequest(['summonerMatches', region, puuid], matchRepos[region].getAllByPuuid(puuid, offset, limit));

  if (matches) {
    context.cache.setEntry(['summonerMatches', region, puuid], matches);
  }
  
  return matches;
}

export const summonerResolvers = {
  Query: {
    getSummonerBy: (_: any, query: SummonerQuery, context: any, info: any) => {    
      setupCache(context);
      return resolveQueryable(
        query,
        infoFields(info),
        q => retrieveSummonerCached(context, q),
        ['matches', 'ranks', 'activeGame']
      );
    }
  },
  Summoner: {
    ranks: async (query: SummonerQuery, _: any, context: any, info: any) => {
      if (!query.id) {
        const summoner = await retrieveSummonerCached(context, query);
        query.id = summoner!.id;
      }
      return resolveQueryable(
        { region: query.region, id: query.id! },
        infoFields(info),
        q => retrieveRanksCached(context, q)
      );
    },
    matches: async (query: SummonerQuery, { offset, limit }: { offset?: number, limit?: number }, context: any, info: any) => {
      if (!query.puuid) {
        const summoner = await retrieveSummonerCached(context, query);
        query.puuid = summoner!.puuid;
      }
      const matchList = await retrieveMatchListCached(context, { region: query.region, puuid: query.puuid! }, offset ?? 0, limit ?? 20);
      return matchList?.map(m => resolveQueryable(
        { region: query.region, id: m },
        infoFields(info),
        q => retrieveMatch(context, q),
        ['timeline']
      ));
    },
    activeGame: async (query: SummonerQuery, _: any, context: any) => {
      if (!query.id) {
        const summoner = await retrieveSummonerCached(context, query);
        query.id = summoner!.id;
      }
      return retrieveActiveGame(context, { region: query.region, summonerId: query.id });
    }
  }
}