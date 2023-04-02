import gql from "graphql-tag";
import { Region, SummonerApiRegion, apiRegionToRegion } from "../riot-data/api/regionConversion";
import { infoFields, resolveQueryable } from "../utils/graphql";
import { matchRepos } from "../repository/match.repo";
import { CacheContext, setupCache } from "../utils/request-cache";
import { Match } from "../model/Match";
import { retrieveSummonerCached } from "./summoner.graph";
import { Participant } from "../riot-data/responses/Match";

export const matchTypeDefs = gql`
  type Match {
    id: String!,
    region: String!,
    dataVersion: String!,
    matchId: String!,
    gameCreation: BigInt!,
    gameDuration: BigInt!,
    gameStartTimestamp: BigInt!,
    gameEndTimestamp: BigInt!,
    gameId: BigInt!,
    gameMode: String!,
    gameName: String!,
    gameType: String!,
    gameVersion: String!,
    mapId: Int!,
    queueId: Int!,
    tournamentCode: String,
    participants: [Participant!]!,
    teams: [Team!]!,
    timeline: Timeline!
  }

  type Participant {
    allInPings: Int,
    assistMePings: Int,
    assists: Int,
    baitPings: Int,
    baronKills: Int,
    basicPings: Int,
    bountyLevel: Int,
    challenges: JSONObject,
    champExperience: Int,
    champLevel: Int,
    championId: Int,
    championName: String,
    championTransform: Int,
    commandPings: Int,
    consumablesPurchased: Int,
    damageDealtToBuildings: Int,
    damageDealtToObjectives: Int,
    damageDealtToTurrets: Int,
    damageSelfMitigated: Int,
    dangerPings: Int,
    deaths: Int,
    detectorWardsPlaced: Int,
    doubleKills: Int,
    dragonKills: Int,
    eligibleForProgression: Boolean,
    enemyMissingPings: Int,
    enemyVisionPings: Int,
    firstBloodAssist: Boolean,
    firstBloodKill: Boolean,
    firstTowerAssist: Boolean,
    firstTowerKill: Boolean,
    gameEndedInEarlySurrender: Boolean,
    gameEndedInSurrender: Boolean,
    getBackPings: Int,
    goldEarned: Int,
    goldSpent: Int,
    holdPings: Int,
    individualPosition: String,
    inhibitorKills: Int,
    inhibitorTakedowns: Int,
    inhibitorsLost: Int,
    item0: Int,
    item1: Int,
    item2: Int,
    item3: Int,
    item4: Int,
    item5: Int,
    item6: Int,
    itemsPurchased: Int,
    killingSprees: Int,
    kills: Int,
    lane: String,
    largestCriticalStrike: Int,
    largestKillingSpree: Int,
    largestMultiKill: Int,
    longestTimeSpentLiving: Int,
    magicDamageDealt: Int,
    magicDamageDealtToChampions: Int,
    magicDamageTaken: Int,
    needVisionPings: Int,
    neutralMinionsKilled: Int,
    nexusKills: Int,
    nexusLost: Int,
    nexusTakedowns: Int,
    objectivesStolen: Int,
    objectivesStolenAssists: Int,
    onMyWayPings: Int,
    participantId: Int,
    pentaKills: Int,
    perks: Perks,
    physicalDamageDealt: Int,
    physicalDamageDealtToChampions: Int,
    physicalDamageTaken: Int,
    profileIcon: Int,
    pushPings: Int,
    puuid: String,
    quadraKills: Int,
    riotIdName: String,
    riotIdTagline: String,
    role: String,
    sightWardsBoughtInGame: Int,
    spell1Casts: Int,
    spell2Casts: Int,
    spell3Casts: Int,
    spell4Casts: Int,
    summoner1Casts: Int,
    summoner1Id: Int,
    summoner2Casts: Int,
    summoner2Id: Int,
    summoner: Summoner,
    teamEarlySurrendered: Boolean,
    teamId: Int,
    teamPosition: String,
    timeCCingOthers: Int,
    timePlayed: Int,
    totalDamageDealt: Int,
    totalDamageDealtToChampions: Int,
    totalDamageShieldedOnTeammates: Int,
    totalDamageTaken: Int,
    totalHeal: Int,
    totalHealsOnTeammates: Int,
    totalMinionsKilled: Int,
    totalTimeCCDealt: Int,
    totalTimeSpentDead: Int,
    totalUnitsHealed: Int,
    tripleKills: Int,
    trueDamageDealt: Int,
    trueDamageDealtToChampions: Int,
    trueDamageTaken: Int,
    turretKills: Int,
    turretTakedowns: Int,
    turretsLost: Int,
    unrealKills: Int,
    visionClearedPings: Int,
    visionScore: Int,
    visionWardsBoughtInGame: Int,
    wardsKilled: Int,
    wardsPlaced: Int,
    win: Boolean
  }

  type Perks {
    statPerks: StatPerks!,
    styles: [Style!]!
  }
  
  type StatPerks {
    defense: Int!,
    flex: Int!,
    offense: Int!
  }
  
  type Style {
    description: String!,
    selections: [Selection!]!,
    style: Int!
  }
  
  type Selection {
    perk: Int!,
    var1: Int!,
    var2: Int!,
    var3: Int!
  }

  type Team {
    bans: [Ban!]!,
    objectives: Objectives!,
    teamId: Int!,
    win: Boolean!
  }
  
  type Ban {
    championId: Int!,
    pickTurn: Int!
  }
  
  type Objectives {
    baron: Objective!,
    champion: Objective!,
    dragon: Objective!,
    inhibitor: Objective!,
    riftHerald: Objective!,
    tower: Objective!
  }
  
  type Objective {
    first: Boolean!,
    kills: Int!
  }

  type Timeline {
    frameInterval: Int,
    frames: [Frame!]!
  }

  type Frame {
    events: [JSONObject!]!,
    participantFrames: [ParticipantFrame!]!,
    timestamp: BigInt,
  }

  type ParticipantFrame {
    summoner: Summoner!,
    championStats: ChampionStats,
    currentGold: Int,
    damageStats: DamageStats,
    goldPerSecond: Int,
    jungleMinionsKilled: Int,
    level: Int,
    minionsKilled: Int,
    participantId: Int,
    position: Position,
    timeEnemySpentControlled: Int,
    totalGold: Int,
    xp: Int
  }

  type Position {
    x: Int,
    y: Int
  }

  type ChampionStats {
    abilityHaste: Int,
    abilityPower: Int,
    armor: Int,
    armorPen: Int,
    armorPenPercent: Int,
    attackDamage: Int,
    attackSpeed: Int,
    bonusArmorPenPercent: Int,
    bonusMagicPenPercent: Int,
    ccReduction: Int,
    cooldownReduction: Int,
    health: Int,
    healthMax: Int,
    healthRegen: Int,
    lifesteal: Int,
    magicPen: Int,
    magicPenPercent: Int,
    magicResist: Int,
    movementSpeed: Int,
    omnivamp: Int,
    physicalVamp: Int,
    power: Int,
    powerMax: Int,
    powerRegen: Int,
    spellVamp: Int
  }

  type DamageStats {
    magicDamageDone: Int,
    magicDamageDoneToChampions: Int,
    magicDamageTaken: Int,
    physicalDamageDone: Int,
    physicalDamageDoneToChampions: Int,
    physicalDamageTaken: Int,
    totalDamageDone: Int,
    totalDamageDoneToChampions: Int,
    totalDamageTaken: Int,
    trueDamageDone: Int,
    trueDamageDoneToChampions: Int,
    trueDamageTaken: Int
  }

  extend type Query {
    getMatchBy(id: String!): Match
  }
`

export async function retrieveMatch(context: CacheContext, { region, id }: { region: Region, id: string }) {
  const cachePromise = context.cache.getEntry<Match>(['match', region, id]);
  if (cachePromise) {
    return await cachePromise;
  }

  const match = await context.cache.setRequest(['match', region, id], matchRepos[region].getById(id));

  if (match) {
    context.cache.setEntry(['match', region, id], match);
  }
  
  return match;
}

export async function retrieveMatchTimeline(context: CacheContext, { region, id }: { region: Region, id: string }) {
  const cachePromise = context.cache.getEntry<Match>(['matchTimeline', region, id]);
  if (cachePromise) {
    return await cachePromise;
  }

  const match = await context.cache.setRequest(['matchTimeline', region, id], matchRepos[region].getTimelineById(id));

  if (match) {
    context.cache.setEntry(['matchTimeline', region, id], match);
  }
  
  return match;
}

export const matchResolvers = {
  Query: {
    getMatchBy: (_: any, { id }: { id: string }, context: any, info: any) => {
      setupCache(context);
      let [region] = id.split('_');
      region = apiRegionToRegion[region?.toLowerCase() as SummonerApiRegion];
      return resolveQueryable(
        { region: region as Region, id },
        infoFields(info),
        q => retrieveMatch(context, q),
        ['timeline']
      );
    }
  },
  Match: {
    participants: ({ region, participants }: { region: Region, participants: Participant[] }) => {
      return participants.map(p => ({ ...p, region }));
    },
    timeline: (query: { id: string, region: Region }, _: any, context: any) => {
      return retrieveMatchTimeline(context, query);
    }
  },
  Participant: {
    summoner: async ({
      region,
      puuid,
      summonerLevel,
      summonerName,
      summonerId
    }: { region: Region, puuid: string, summonerLevel: number, summonerName: string, summonerId: string }, _: any, context: any, info: any) => {;
      const res = await resolveQueryable(
        { region, id: summonerId, puuid, name: summonerName, summonerLevel },
        infoFields(info),
        q => retrieveSummonerCached(context, q),
        ['matches', 'ranks', 'activeGame']
      );
      return res;
    }
  }
}