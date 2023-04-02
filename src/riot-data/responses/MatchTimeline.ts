import { Metadata } from "./Match";

export interface MatchTimeline {
  metadata: Metadata;
  info: TimelineInfo;
}

export interface TimelineFrame {
  events: TimelineEvent[];
  participantFrames: Record<string, ParticipantFrame>; // 1-10 key
  timestamp: number;
}

export interface TimelineInfo {
  frameInterval: number;
  frames: TimelineFrame[];
  gameId: number;
  participants: TimelineParticipant[]; // 1-10 key to puuid mapping
}

export interface TimelineParticipant {
  participantId: number;
  puuid: string;
}

export interface ParticipantFrame {
  championStats: ChampionStats;
  currentGold: number;
  damageStats: DamageStats;
  goldPerSecond: number;
  jungleMinionsKilled: number;
  level: number;
  minionsKilled: number;
  participantId: number;
  position: Position;
  timeEnemySpentControlled: number;
  totalGold: number;
  xp: number;
}

export interface ChampionStats {
  abilityHaste: number;
  abilityPower: number;
  armor: number;
  armorPen: number;
  armorPenPercent: number;
  attackDamage: number;
  attackSpeed: number;
  bonusArmorPenPercent: number;
  bonusMagicPenPercent: number;
  ccReduction: number;
  cooldownReduction: number;
  health: number;
  healthMax: number;
  healthRegen: number;
  lifesteal: number;
  magicPen: number;
  magicPenPercent: number;
  magicResist: number;
  movementSpeed: number;
  omnivamp: number;
  physicalVamp: number;
  power: number;
  powerMax: number;
  powerRegen: number;
  spellVamp: number;
}

export interface DamageStats {
  magicDamageDone: number;
  magicDamageDoneToChampions: number;
  magicDamageTaken: number;
  physicalDamageDone: number;
  physicalDamageDoneToChampions: number;
  physicalDamageTaken: number;
  totalDamageDone: number;
  totalDamageDoneToChampions: number;
  totalDamageTaken: number;
  trueDamageDone: number;
  trueDamageDoneToChampions: number;
  trueDamageTaken: number;
}

export interface Position {
  x: number;
  y: number;
}

interface BaseEvent<ET extends EventType> {
  timestamp: number;
  type: ET;
}

export type TimelineEvent = GameEndEvent | PauseStateEvent
  | SkillLevelUpEvent | LevelUpEvent
  | ItemChangeEvent | ItemUndoEvent
  | WardPlacedEvent | WardKillEvent
  | TurretPlateDestroyedEvent | ObjectiveBountyPrestartEvent | EliteMonsterKillEvent | DragonSoulGivenEvent | BuildingKillEvent
  | ChampionKillEvent | ChampionSpecialKillEvent;

interface GameEndEvent extends BaseEvent<'GAME_END'> {
  gameId: number;
  realTimestamp: number;
  winningTeam: number;
}

interface PauseStateEvent extends BaseEvent<'PAUSE_START' | 'PAUSE_END'> {
  realTimestamp: number;
}

interface SkillLevelUpEvent extends BaseEvent<'SKILL_LEVEL_UP'> {
  levelUpType: LevelUpType;
  skillSlot: number;
  participantId: number;
}

interface ItemChangeEvent extends BaseEvent<'ITEM_PURCHASED' | 'ITEM_DESTROYED' | 'ITEM_SOLD'> {
  itemId: number;
  participantId: number;
}

interface ItemUndoEvent extends BaseEvent<'ITEM_UNDO'> {
  afterId: number;
  beforeId: number;
  participantId: number;
  goldGain: number;
}

interface WardKillEvent extends BaseEvent<'WARD_KILL'> {
  killerId: number;
  wardType: WardType;
}

interface WardPlacedEvent extends BaseEvent<'WARD_PLACED'> {
  creatorId: number;
  wardType: WardType;
}

interface LevelUpEvent extends BaseEvent<'LEVEL_UP'> {
  level: number;
}

interface TurretPlateDestroyedEvent extends BaseEvent<'TURRET_PLATE_DESTROYED'> {
  killerId: number;
  teamId: number;
  position: Position;
  laneType: LaneType;
}

interface ObjectiveBountyPrestartEvent extends BaseEvent<'OBJECTIVE_BOUNTY_PRESTART'> {
  actualStartTime: number;
  teamId: number;
}

interface EliteMonsterKillEvent extends BaseEvent<'ELITE_MONSTER_KILL'> {
  monsterType: MonsterType;
  monsterSubType?: MonsterSubType;
  bounty: number;
  killerTeamId: number;
  killerId: number;
  assistingParticipantIds: number[];
  position: Position;
}

interface DragonSoulGivenEvent extends BaseEvent<'DRAGON_SOUL_GIVEN'> {
}

interface BuildingKillEvent extends BaseEvent<'BUILDING_KILL'> {
  bounty: number;
  buildingType: BuildingType;
  killerId: number;
  laneType: LaneType;
  position: Position;
  teamId: number;
  towerType?: TowerType;
}

interface ChampionSpecialKillEvent extends BaseEvent<'CHAMPION_SPECIAL_KILL'> {
  killType: SpecialKillType;
  killerId: number;
  multiKillLength: number;
  position: Position;
}

interface ChampionKillEvent extends BaseEvent<'CHAMPION_KILL'> {
  assistingParticipantIds: number[];
  killerId: number;
  killStreakLength: number;
  position: Position;
  shutdownBounty: number;
  victimDamageDealt: VictimDamage[];
  victimDamageReceived: VictimDamage[];
  victimId: number;
}


export type MonsterType =
  "DRAGON" |
  "BARON_NASHOR" |
  "BLUE_GOLEM" |
  "RED_LIZARD" |
  "RIFTHERALD";

export type MonsterSubType =
  "AIR_DRAGON" |
  "EARTH_DRAGON" |
  "FIRE_DRAGON" |
  "WATER_DRAGON" |
  "ELDER_DRAGON";

export type BuildingType = "INHIBITOR_BUILDING" | "TOWER_BUILDING";

export type SpecialKillType = "KILL_ACE" | "KILL_FIRST_BLOOD" | "KILL_MULTI";

export type LaneType = "BOT_LANE" | "MID_LANE" | "TOP_LANE";

export type LevelUpType = "NORMAL" | "EVOLVE";

export type TowerType = "BASE_TURRET" | "INNER_TURRET" | "OUTER_TURRET";

export type EventType =
  "BUILDING_KILL" |
  "CHAMPION_KILL" |
  "CHAMPION_SPECIAL_KILL" |
  "DRAGON_SOUL_GIVEN" |
  "ELITE_MONSTER_KILL" |
  "GAME_END" |
  "ITEM_DESTROYED" | // Consumable, Stopwatch destroy (broken stopwatch has no even appearing tho), Broken stopwatch destroy when buying full item etc.
  "ITEM_PURCHASED" |
  "ITEM_SOLD" |
  "ITEM_UNDO" |
  "LEVEL_UP" |
  "OBJECTIVE_BOUNTY_PRESTART" |
  "PAUSE_START" |
  "PAUSE_END" |
  "SKILL_LEVEL_UP" |
  "TURRET_PLATE_DESTROYED" |
  "WARD_KILL" |
  "WARD_PLACED";

export interface VictimDamage {
  basic: boolean;
  magicDamage: number;
  name: string;
  participantId: number;
  physicalDamage: number;
  spellName: string;
  spellSlot: number;
  trueDamage: number;
  type: VictimDamageDealtType;
}

export type VictimDamageDealtType = "MINION" | "MONSTER" | "OTHER" | "TOWER";

export type WardType =
  "BLUE_TRINKET" |
  "CONTROL_WARD" |
  "SIGHT_WARD" |
  "UNDEFINED" | // Seems to be rune based warding like Zombie ward
  "YELLOW_TRINKET";